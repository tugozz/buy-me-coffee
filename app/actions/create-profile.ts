"use server";

import { z } from "zod/v4";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

const schemaUserProfile = z.object({
  avatarImage: z.string().min(1, { message: "Please enter image" }),
  name: z.string().min(3, { message: "Please enter name" }),
  about: z.string().min(1, { message: "Please enter info about yourself" }),
  socialMediaURL: z.string().url({ message: "Please enter a social link" }),
});

export const createProfile = async (previous: unknown, formData: FormData) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return {
      ZodError: {
        avatarImage: [],
        name: [],
        about: [],
        socialMediaURL: [],
      },
      message: "User not authenticated",
    };
  }

  const validated = schemaUserProfile.safeParse({
    avatarImage: formData.get("avatarImage"),
    name: formData.get("name"),
    about: formData.get("about"),
    socialMediaURL: formData.get("socialMediaURL"),
  });

  if (!validated.success) {
    return {
      ZodError: {
        avatarImage: validated.error.flatten().fieldErrors.avatarImage ?? [],
        name: validated.error.flatten().fieldErrors.name ?? [],
        about: validated.error.flatten().fieldErrors.about ?? [],
        socialMediaURL:
          validated.error.flatten().fieldErrors.socialMediaURL ?? [],
      },
      message: "Validation failed",
    };
  }

  const { name, about, avatarImage, socialMediaURL } = validated.data;

  await prisma.profile.create({
    data: {
      userId: user.id,
      name,
      about,
      avatarImage,
      socialMediaURL,
      backgroundImage: "",
    },
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: { isProfileCompleted: true },
  });
};
