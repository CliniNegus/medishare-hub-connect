
import { LazyImageLoader } from './performance/LazyImageLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const OptimizedImage = ({ src, alt, className = '', width, height }: OptimizedImageProps) => {
  return (
    <LazyImageLoader
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      showProgress={true}
      threshold={0.1}
    />
  );
};

export default OptimizedImage;
