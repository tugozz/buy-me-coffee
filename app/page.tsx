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

  return (
    <div>
      {" "}
      {user.username}
      <div className="flex flex-col">
        <a href="">Home</a>
        <a href="">Explore</a>
        <a href="">View Page</a>
        <a href="">Account Settings</a>
      </div>
    </div>
  );
};

export default Homepage;
