"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { IMAGE_HOME_GALLERY_1, IMAGE_HOME_GALLERY_2, IMAGE_HOME_GALLERY_3, IMAGE_HOME_GALLERY_4, IMAGE_HOME_GALLERY_5, IMAGE_HOME_GALLERY_6, IMAGE_HOME_GALLERY_7, IMAGE_HOME_GALLERY_8 } from "@/contexts/constants/constants_images";
import popup from "@/contexts/libs/popup";



const ImageSingle = ({ image }) => {
  return (
    <div className="image-wrapper relative group" data-aos="fade-up">
      <Image
        src={image}
        alt="Image 1"
        className="gallery-image w-full"
        placeholder="blur"
      />
      <div className="absolute left-0 top-0 right-0 bottom-0 bg-blackColor bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-60 text-whiteColor flex items-center justify-center">
        <button className="popup-open">
          <i className="icofont-eye-alt opacity-0 group-hover:opacity-100"></i>
        </button>
      </div>
    </div>
  );
};

const GalleryComponent = ({ gallary }) => {
  useEffect(() => {
    popup();
  }, []);
  const allImages = [
    IMAGE_HOME_GALLERY_1,
    IMAGE_HOME_GALLERY_2,
    IMAGE_HOME_GALLERY_3,
    IMAGE_HOME_GALLERY_4,
    IMAGE_HOME_GALLERY_5,
    IMAGE_HOME_GALLERY_6,
    IMAGE_HOME_GALLERY_7,
    IMAGE_HOME_GALLERY_8,
        ];
  const images = [...allImages];
  return (
    <div>
      <div
        className={`container-fluid-2 mb-10`}
      >
        <div className="gallary-container">
          <div className="popup">
            <div id="slider-container" className="slider-container">
              <span className="close-btn">&times;</span>
              <div className="slider-container-wrapper"></div>
            </div>
            <div className="slider-navigation">
              <button className="prev-btn"></button>
              <button className="next-btn"></button>
            </div>
          </div>

          <div
            className={
              gallary
                ? "grid grid-cols-3 gap-5px"
                : "grid grid-cols-2 md:grid-cols-4 gap-10px p-5 md:p-30px lg:p-5 2xl:p-30px border border-borderColor2 dark:border-borderColor2-dark"
            }
          >
            {images.map((image, idx) => (
              <ImageSingle key={idx} image={image} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryComponent;
