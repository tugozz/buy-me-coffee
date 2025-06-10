export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("upload_preset", "food-delivery");
  formData.append("file", file);

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tugozz/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    const imageUrl = data.url;

    return imageUrl;
  } catch (err) {
    console.error("Upload failed", err);
    alert("Failed to upload image");
    return "";
  }
};
