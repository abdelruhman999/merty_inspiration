import { useState } from "react";
import Image, { ImageProps } from "next/image";
import Loaderimg from "./Loaderimg"; 


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
        src={src}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
        style={{
          ...props.style,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default ImageWithLoader;