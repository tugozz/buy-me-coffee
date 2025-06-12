import Image from "next/image";

export const LoadingCoffeeGif = () => {
  return (
    <div className="flex flex-col items-center justify-center p-15 border rounded-lg shadow-lg w-150">
      <Image
        src="/LoadingCoffee.gif"
        alt="Loading Coffee"
        width={150}
        height={150}
      />
      <p>Loading...</p>
    </div>
  );
};
