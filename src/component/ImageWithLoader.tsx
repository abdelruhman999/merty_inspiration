import { useState } from "react";
import Image, { ImageProps } from "next/image";
import Loaderimg from "./Loaderimg";
import { serve } from "@/api/utils";

const ImageWithLoader = ({ src, alt, ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loaderimg />
        </div>
      )}
      <Image
        src={serve(src as string) }
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
        className={`${props.className || ""} transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default ImageWithLoader;