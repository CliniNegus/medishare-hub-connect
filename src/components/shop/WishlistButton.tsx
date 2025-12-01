import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  variant?: 'default' | 'icon';
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  className,
  variant = 'icon'
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  if (variant === 'default') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={cn(
          "transition-all duration-200",
          inWishlist && "border-[#E02020] bg-red-50 text-[#E02020]",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-2 transition-all",
            inWishlist && "fill-[#E02020]"
          )}
        />
        {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110",
        className
      )}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-200",
          inWishlist 
            ? "fill-[#E02020] text-[#E02020]" 
            : "text-gray-400 hover:text-[#E02020]"
        )}
      />
    </button>
  );
};