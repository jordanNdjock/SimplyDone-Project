"use client";

import Image from "next/image";
import { FC } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/src/components/ui/dialog";

interface ImageWithDialogProps {
  imageUrl: string;
  alt?: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  enlargedWidth?: number;
  enlargedHeight?: number;
  thumbnailClassName?: string;
}

const ImageWithDialog: FC<ImageWithDialogProps> = ({
  imageUrl,
  alt = "Image",
  thumbnailWidth,
  thumbnailHeight,
  enlargedWidth = 600,
  enlargedHeight = 600,
  thumbnailClassName = "",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button">
          <Image
            src={imageUrl}
            alt={alt}
            width={thumbnailWidth}
            height={thumbnailHeight}
            className={`cursor-pointer object-cover ${thumbnailClassName}`}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="p-4 max-h-screen">
        <DialogHeader>
          <DialogTitle className="mt-1"></DialogTitle>
          <DialogClose className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 outline-none">
          </DialogClose>
        </DialogHeader>
        <div className="flex justify-center items-center">
          <Image
            src={imageUrl}
            alt={alt}
            width={enlargedWidth}
            height={enlargedHeight}
            className="rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageWithDialog;
