import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

const ImageRenderer = ({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Image preview */}
      <img
        src={src}
        alt={alt}
        className="my-4 max-w-full h-auto border rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:opacity-90 cursor-pointer"
        onClick={openModal}
        {...props}
      />

      {/* Modal for image preview */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300 ease-in-out"
          onClick={closeModal} // Clicking the background closes the modal
        >
          {/* Prevent closing when clicking on the image itself */}
          <div
            className="relative max-w-screen-xl max-h-screen-xl p-4 rounded-lg shadow-xl "
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on the image
          >
            <img
              src={src}
              alt={alt}
              className="max-w-screen-xl max-h-screen-xl object-contain rounded-lg shadow-2xl transition-transform duration-500 ease-in-out transform scale-150"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageRenderer;
