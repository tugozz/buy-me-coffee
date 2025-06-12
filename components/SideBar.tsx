"use client";

import { Button } from "./ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
export const SideBar = () => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => push("/")}
        className="bg-white text-black hover:bg-gray-200 justify-start"
      >
        Home
      </Button>
      <Button
        onClick={() => push("/explore")}
        className="bg-white text-black hover:bg-gray-200 justify-start"
      >
        Explore
      </Button>
      <Button
        onClick={() => push("/view-page")}
        className="bg-white text-black hover:bg-gray-200 justify-start"
      >
        View page <SquareArrowOutUpRight />
      </Button>
      <Button
        onClick={() => push("/account-settings")}
        className="bg-white text-black hover:bg-gray-200 justify-start"
      >
        Account Settings
      </Button>
    </div>
  );
};
