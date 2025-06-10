"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { getCountries } from "@/utils/getCountries";

const { countries, months, years } = getCountries();

const schemaUserBankCard = z.object({
  country: z.enum(countries, {
    message: "Please select a country",
  }),
  firstName: z.string().min(2, { message: "Please enter name" }),
  lastName: z.string().min(2, { message: "Please enter name" }),
  cardNumber: z.string().min(16).max(16, { message: "Card number must be 16 digits" }).regex(/^\d{16}$/, "Card number must be 16 digits"),
  months: z.enum(months, {
    message: "Please select a month",
  }),
  years: z.enum(years, {
    message: "Please select a year",
  }),
  cvc: z.string().length(3, { message: "Enter cvc number" }).regex(/^\d{3}$/, "CVV must be 3 or 4 digits"),
});

export const createCard = async (previous: unknown, formData: FormData) => {
  const user = await currentUser();

  if (!user?.id) {
    return;
  }

  const validateFormData = schemaUserBankCard.safeParse({
    country: formData.get("country"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    cardNumber: formData.get("cardNumber"),
    months: formData.get("months"),
    years: formData.get("years"),
    cvc: formData.get("cvc"),
  });

  if (!validateFormData.success) {
    return {
      ZodError: validateFormData.error.flatten().fieldErrors,
      message: "Missing fields, failed to make add card",
    };
  }

  const country = formData.get("country") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const cardNumber = formData.get("cardNumber") as string;
  const months = formData.get("months");
  const years = formData.get("years");
  const cvc = (formData.get("cvc") as string) ?? "";

  await prisma.bankCard.create({
    data: {
      userId: user.id,
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate: new Date(Number(years), Number(months)),
      cvc,
    },
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: { isBankCardCompleted: true },
  });
};
