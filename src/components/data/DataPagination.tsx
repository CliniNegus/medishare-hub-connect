
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from '@/components/ui/pagination';

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const DataPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: DataPaginationProps) => {
  // Generate an array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const leftSibling = Math.max(2, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);
    
    // Add ellipsis if needed before left range
    if (leftSibling > 2) {
      pages.push('ellipsis-left');
    }
    
    // Add pages in the left to right range
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed after right range
    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis-right');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // If there's only 1 page or less, don't render pagination
  if (totalPages <= 1) return null;
  
  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            tabIndex={currentPage === 1 ? -1 : 0}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            tabIndex={currentPage === totalPages ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataPagination;
