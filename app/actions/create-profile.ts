// "use server";
// import { z } from "zod/v4";
// import { currentUser } from "@clerk/nextjs/server";

// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";

// const schemaUserProfile = z.object({
//   avatarImage: z.string().min(1, { message: "Please enter image" }),
//   name: z.string().min(3, { message: "Please enter name" }),
//   about: z.string().min(1, { message: "Please enter info about yourself" }),
//   socialMediaURL: z.url({ message: "Please enter a social link" }),
// });

// export const createProfile = async (previous: unknown, formData: FormData) => {
//   const user = await currentUser();
//   if (!user || !user.id) {
//     return {
//       ZodError: {},
//       message: "User not authenticated",
//     };
//   }

//   console.log(formData);

//   const validateFormData = schemaUserProfile.safeParse({
//     avatarImage: formData.get("avatarImage"),
//     name: formData.get("name"),
//     about: formData.get("about"),
//     socialMediaURL: formData.get("socialMediaURL"),
//   });

//   if (!validateFormData.success) {
//     return {
//       ZodError: validateFormData.error.flatten().fieldErrors,
//       message: "Missing Fields, Failed to maka profile",
//     };
//   }

//   const name = formData.get("name") as string;
//   const about = formData.get("about") as string;
//   const avatarImage = formData.get("avatarImage") as string;
//   const socialMediaURL = formData.get("socialMediaURL") as string;

//   await prisma.profile.create({
//     data: {
//       userId: user.id,
//       name,
//       about,
//       avatarImage,
//       socialMediaURL,
//       backgroundImage: "",
//     },
//   });

//   redirect("/");
// };

"use server";
import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
