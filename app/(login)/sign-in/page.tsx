"use client";

import Image from "next/legacy/image";
import { Coffee } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const { push } = useRouter();
  return (
    <div className="flex w-full">
      <div className="w-1/2 bg-[#FBBF24] h-screen">
        <div className="pl-10 pt-5">
          <Button
            className="flex gap-2 font-bold bg-[#FBBF24] border-none hover:bg-[#FBBF24] text-black"
            onClick={() => push("/")}
          >
            <Coffee /> Buy Me Coffee
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 h-full p-10 pb-20">
          <Image
            src="/illustration.svg"
            alt="Clerk Logo"
            width={240}
            height={240}
            className="mb-5"
          />
          <h2 className="text-3xl font-bold bg-[#FBBF24]">
            Fund your creative work
          </h2>
          <h1 className="text-lg bg-[#FBBF24] px-15 text-center">
            Accept support. Start a membership. Setup a shop. It’s easier than
            you think.
          </h1>
        </div>
      </div>
      <div className="w-1/2 h-screen">
        <div className="flex justify-end pt-5 pr-10">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/sign-up")}
          >
            Sign Up
          </Button>
        </div>
        <div className="flex items-center justify-center mt-40">
          <SignIn routing="hash" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
