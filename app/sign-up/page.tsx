"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const { push } = useRouter();
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 relative">
        <Image
          src="/luxury.png"
          alt="poster"
          fill
          priority
          quality={100}
          className="object-cover"
        />

        <div className="absolute top-5 left-5">
          <Button
            className="flex gap-2 font-bold bg-[#616161] border-none hover:bg-[#FBBF24] text-black"
            onClick={() => push("/")}
          >
            <Coffee /> Buy Me Coffee
          </Button>
        </div>
      </div>

      <div className="w-1/2 flex flex-col h-full">
        <div className="flex justify-end pr-10 pt-5">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/sign-in")}
            className="bg-[#f1f1f1]"
          >
            Sign In
          </Button>
        </div>
        <div className="flex items-center justify-center h-full pb-20 bg-[#7a7a7a]">
          <SignUp routing="hash" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
