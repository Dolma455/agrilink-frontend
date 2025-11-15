import Image from "next/image";
import { useState } from "react";

function ImageWithFallback({ src, fallbackSrc, alt, className }: any) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={1080}
      height={720}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
export { ImageWithFallback };