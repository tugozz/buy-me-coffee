"use client";

import { useState, useRef } from "react";

export const useGetImage = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewLink, setPreviewLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const openBrowse = () => fileInputRef.current?.click();

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("upload_preset", "nextjs-prisma");
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
      console.log("imageUrl", imageUrl);

      onUpload(imageUrl);
      setPreviewLink(imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const deleteImage = () => {
    setPreviewLink("");
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    previewLink,
    uploading,
    isDragging,
    openBrowse,
    handleFileSelect,
    handleDrop,
    deleteImage,
    setIsDragging,
  };
};
