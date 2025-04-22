
import React, { useState, useEffect } from 'react';
import { loadImageWithProgress } from '@/utils/api';
import { Progress } from '@/components/ui/progress';

interface LazyImageLoaderProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loadingClassName?: string;
  fallbackSrc?: string;
  threshold?: number;
  showProgress?: boolean;
}

/**
 * A component that lazily loads images with support for:
 * - Lazy loading via Intersection Observer
 * - Loading progress indication
 * - Fallback image for errors
 * - Smooth transition when loaded
 */
const LazyImageLoader = ({
  src,
  alt,
  width,
  height,
  className = '',
  loadingClassName = '',
  fallbackSrc = '/placeholder.svg',
  threshold = 0.1,
  showProgress = false,
}: LazyImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState(fallbackSrc);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const imgRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset state when src changes
    if (src) {
      setIsLoading(true);
      setError(false);
      setProgress(0);
    }
  }, [src]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '50px',
        threshold,
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [threshold]);
  
  useEffect(() => {
    if (!isInView || !src || error) return;
    
    const loadImage = async () => {
      try {
        if (showProgress) {
          await loadImageWithProgress(src, setProgress);
          setImageSrc(src);
        } else {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
          };
          img.onerror = () => {
            setError(true);
            setImageSrc(fallbackSrc);
          };
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setImageSrc(fallbackSrc);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [src, isInView, fallbackSrc, showProgress, error]);
  
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    overflow: 'hidden',
  };
  
  return (
    <div ref={imgRef} style={containerStyle} className={`image-loader-container ${className}`}>
      {isLoading && (
        <div className={`flex items-center justify-center h-full w-full bg-gray-100 ${loadingClassName}`}>
          {showProgress ? (
            <div className="w-3/4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-gray-500">{progress}%</p>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-red-600 animate-spin" />
          )}
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
          setImageSrc(fallbackSrc);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default LazyImageLoader;
