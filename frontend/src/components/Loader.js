import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import fitnessLoaderGif from "../sd.gif"; // Import your fitness loader GIF

function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "black",
        }}
      >
        
        <br />
        <motion.div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.img
            src={fitnessLoaderGif}
            alt="Fitness Loader"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 13 }}
          />
        </motion.div>
      </div>
    );
  }
  return <div>Content loaded successfully!</div>;
}

export default Loading;
