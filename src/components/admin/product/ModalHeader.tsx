
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalHeaderProps {
  title: string;
  description: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, description }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-[#333333]">{title}</DialogTitle>
      <DialogDescription>
        {description}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ModalHeader;
