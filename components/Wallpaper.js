import React from "react";
import Image from "next/image";

export default function WallpaperComponent() {
  return (
    <>
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        src="/space.jpg"
        alt="Space image Wallpaper for Kreative ID"
        fill="fill"
      />
    </>
  );
}
