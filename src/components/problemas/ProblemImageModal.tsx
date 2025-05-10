
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { X } from 'lucide-react';

interface ProblemImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  description: string;
}

export const ProblemImageModal: React.FC<ProblemImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  description,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-lg">Visualizar Imagem</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        </DialogHeader>
        <div className="mt-2">
          <AspectRatio ratio={16 / 9} className="bg-black/5 overflow-hidden rounded-md">
            <img
              src={imageUrl}
              alt={description}
              className="w-full h-full object-contain"
            />
          </AspectRatio>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
