"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { getCountries } from "@/utils/getCountries";

const { countries, months, years } = getCountries();

const schemaUserBankCard = z.object({
  country: z.string().refine((val) => countries.includes(val), {
    message: "Please select a valid country",
  }),
  firstName: z.string().min(2, { message: "Please enter first name" }),
  lastName: z.string().min(2, { message: "Please enter last name" }),
  cardNumber: z
    .string()
    .length(16, { message: "Wrong card number" })
    .regex(/^\d+$/, { message: "Card number must be digits only" }),
  month: z.string().refine((val) => months.includes(val), {
    message: "Please select a valid month",
  }),
  year: z.string().refine((val) => years.includes(val), {
    message: "Please select a valid year",
  }),
  cvc: z
    .string()
    .length(3, { message: "Enter CVC number" })
    .regex(/^\d+$/, { message: "CVC must be digits" }),
});

export const createCard = async (_: any, formData: FormData) => {
  const user = await currentUser();
  if (!user?.id) {
    return { message: "User not authenticated" };
  }

  const validated = schemaUserBankCard.safeParse({
    country: formData.get("country"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    cardNumber: formData.get("cardNumber")?.toString().replace(/-/g, ""),
    month: formData.get("month"),
    year: formData.get("year"),
    cvc: formData.get("cvc"),
  });

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;

    return {
      ZodError: {
        country: fieldErrors.country || [],
        firstName: fieldErrors.firstName || "",
        lastName: fieldErrors.lastName || "",
        cardNumber: fieldErrors.cardNumber || "",
        month: fieldErrors.month || [],
        year: fieldErrors.year || [],
        cvc: fieldErrors.cvc || [],
      },
      message: "Missing or invalid fields",
    };
  }

  const { country, firstName, lastName, cardNumber, month, year, cvc } =
    validated.data;

  const expiryDate = new Date(`${year}-${month}-01`);

  await prisma.bankCard.create({
    data: {
      userId: user.id,
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate,
      cvc,
    },
  });

  redirect("/");
};
