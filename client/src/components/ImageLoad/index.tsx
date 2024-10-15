import React from 'react';
import { serverURL } from '@/http/config';
import { LoadErrorImage } from '@/assets/images';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
}
const ImageLoad = (props: ImageProps) => {
  const { src, alt, className } = props;
  const getValidSrc = (src: string) => {
    return src.startsWith('http') || src.startsWith('https') ? src : `${serverURL}${src}`;
  };
  const validSrc = src ? getValidSrc(src) : LoadErrorImage.AVATAR;
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.src !== LoadErrorImage.AVATAR) {
      e.currentTarget.src = LoadErrorImage.AVATAR;
    }
  };
  return (
    <img src={validSrc} onError={handleError} alt={alt} className={className} draggable="false" />
  );
};

export default ImageLoad;
