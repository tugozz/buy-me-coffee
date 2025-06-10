"use client";
import { useUser } from "@clerk/nextjs";

const Homepage = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  console.log(user);

  return <div>Hello {user.username}</div>;
};

export default Homepage;
