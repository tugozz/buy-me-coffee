"use server";

import { boolean, z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { fa } from "zod/v4/locales";

const schemaUserProfile = z.object({
  avatarImage: z.string().url({ message: "Please upload a valid image" }),
  name: z.string().min(3, { message: "Please enter name" }),
  about: z.string().min(1, { message: "Please enter info about yourself" }),
  socialMediaURL: z
    .string()
    .url({ message: "Please enter a valid social link" }),
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
  const userId = user.id;

  const avatarImage = formData.get("avatarImage") as string;

  const validateFormData = schemaUserProfile.safeParse({
    avatarImage,
    name: formData.get("name"),
    about: formData.get("about"),
    socialMediaURL: formData.get("socialMediaURL"),
  });

  if (!validateFormData.success) {
    const fieldErrors = validateFormData.error.flatten().fieldErrors;
    return {
      ZodError: {
        avatarImage: fieldErrors.avatarImage || [],
        name: fieldErrors.name || [],
        about: fieldErrors.about || [],
        socialMediaURL: fieldErrors.socialMediaURL || [],
      },
      message: "Missing Fields, Failed to make profile",
    };
  }

  const { name, about, socialMediaURL } = validateFormData.data;
  const backgroundImage = "https://picsum.photos/id/237/536/354";

  const data = await prisma.profile.create({
    data: {
      name,
      about,
      avatarImage,
      socialMediaURL,
      backgroundImage,
      userId,
    },
  });

  const client = clerkClient();
  await (
    await client
  ).users.updateUserMetadata(userId, {
    publicMetadata: {
      isProfileCompleted: true,
      isCardCompleted: !false,
    },
  });

  return {
    data,
    message: "Profile created successfully",
    ZodError: {
      avatarImage: [],
      name: [],
      about: [],
      socialMediaURL: [],
    },
  };
};
