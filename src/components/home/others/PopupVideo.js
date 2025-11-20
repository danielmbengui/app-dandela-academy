"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import videoImage from "@/assets/images/icon/video.png";
import { Box, Button, Modal, Stack } from "@mui/material";
import { PUBLIC_COVER_DANDELA_PRESENTATION, VIDEO_DANDELA_PRESENTATION } from "@/contexts/constants/constants_videos";
import CloseIcon from '@mui/icons-material/Close';
import { ClassColor } from "@/classes/ClassColor";
import videoModal from "@/contexts/libs/videoModal";

function SimpleBackdrop() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);
  const resetVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.removeAttribute("src");
      v.currentTime = 0;   // remet la tête de lecture au début
      v.load();            // réinitialise l’UI du player
    } catch { }
  };
  const handleClose = () => {
    resetVideo();
    setOpen(false);
    //console.log("VIDEEEEO", videoRef?.current)
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <button
        //data-url="https://www.youtube.com/watch?v=vHdclsdkp28"
        onClick={handleOpen}
        className="relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
      >
        <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <Image src={videoImage} alt="" />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        // force au-dessus de tout
        sx={{ 
          //position:'relative',
          width:'100vw',
          height:'100vh',
          zIndex: (t) => t.zIndex.modal + 100, 
          bgcolor: 'rgba(0,0,0,0.6)',
          //p: `${APP_BAR_HEIGHT * 2}px 0`,
         }}
      //slotProps={{ backdrop: { inert: false } }} // évite le focus piège
      >
        <Stack
          //onClick={handleClose}

          //onClick={(e) => e.stopPropagation()}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            pointerEvents:'none',
            //position: 'absolute',
            //top: '50%',
            //left: '50%',
            //transform: 'translate(-50%, -50%)',
            outline: "none",                  // évite le focus ring
            height: "100vh",
            cursor: 'pointer',
            width: "100vw",
            p: `10px`,
            //boxSizing: "border-box",
            //bgcolor: 'red',
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Stack spacing={1} alignItems={'end'}>
            <CloseIcon onClick={handleClose} sx={{ color: ClassColor.WHITE, pointerEvents: 'auto', }} />
            <Box
              ref={videoRef}
              component="video"
              src={VIDEO_DANDELA_PRESENTATION}
              poster={PUBLIC_COVER_DANDELA_PRESENTATION}
              controls
              playsInline
              onClick={(e) => { e.preventDefault() }}
              sx={{
                cursor: 'default',
                pointerEvents:'auto',
                width: "100%",
                //bgcolor:'red',
                maxWidth: 960,
                //borderRadius: 2,
                //boxShadow: 3,
                aspectRatio: "16 / 9",
                //backgroundColor: "black",
                display: "block",
              }}
            />
          </Stack>
        </Stack>
      </Modal>
    </div>
  );
}

const PopupVideo = () => {
  useEffect(() => {
    videoModal();
  }, []);
  return (
    <div>
      <SimpleBackdrop />

      <button
        data-url="https://www.youtube.com/watch?v=vHdclsdkp28"
        className="hidden lvideo relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
      >
        <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <Image src={videoImage} alt="" />
      </button>
    </div>
  );
};

export default PopupVideo;
