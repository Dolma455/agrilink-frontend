import Image from "next/image";
import { useState } from "react";

function ImageWithFallback({ src, fallbackSrc, alt, className }: any) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  // Don't render if both src and fallbackSrc are empty
  if (!imgSrc && !fallbackSrc) {
    return null;
  }

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      width={1080}
      height={720}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
export { ImageWithFallback };