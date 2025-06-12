"use client";
import { LoadingCoffeeGif } from "@/components/LoadingCoffeeGif";
import { SideBar } from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { SquareArrowOutUpRight } from "lucide-react";

const Homepage = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <LoadingCoffeeGif />
      </div>
    );
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <div className="flex items-start justify-start w-full min-h-screen px-20">
      <SideBar />
    </div>
  );
};

export default Homepage;
