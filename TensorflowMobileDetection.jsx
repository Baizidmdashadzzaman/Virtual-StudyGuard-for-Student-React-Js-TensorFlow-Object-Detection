import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import useSound from 'use-sound';

function TensorflowMobileDetection() {

  const scrollToadditionalinfotabDiv = () => {
    const element = document.getElementById('myTabContent');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      //console.log(obj[0].class);
      if(obj[0]?.class === "cell phone"){
        set_display_warning(true);
        // scrollToadditionalinfotabDiv();
      }else{
        set_display_warning(false);
      }

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    //   if(obj[0]?.class === "cell phone"){
    //      const ctx = canvasRef.current.getContext("2d");
    //      drawRect(obj, ctx); 
    //   }

    }
  };

  useEffect(()=>{runCoco()},[]);


  const colors = ['#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF'];
  const [index, setIndex] = useState(0);

  const [display_warning, set_display_warning] = useState(false);

  useEffect(() => {
    if(display_warning === true){
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % colors.length);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [display_warning]);

  const [playsoundping] = useSound('/static/sound/mixkit-sci-fi-ship-siren-alert-1653.wav');
  const [play, { stop }] = useSound('/static/sound/mixkit-sci-fi-ship-siren-alert-1653.wav', { loop: true });
    
  useEffect(() => {
    if (display_warning) {
      play();
    } else {
      stop();
    }
    return () => stop();
  }, [display_warning, play, stop]);

  return (
    <>
    
<main  id="myTabContent" role="main" className="1 lg:flex lg:flex-1 lg:flex-col ">


<div style={display_warning?{ backgroundColor: colors[index]??'#FF0000'}:{}}>



<div className="relative ">


  <div className="relative overflow-x-clip">
    <img style={{position: 'absolute', width: 700, height: 700, left: '-15%', top: 0, opacity: '.75'}} src="/static/img/blur.svg" className="animate-pulse-slow" />
    <div className="relative mx-auto mt-2 max-w-5xl px-6">


<div className="mt-16 row">

<div className="col-lg-12 col-sm-12 mb-4" style={{width:'100%'}}>
    <div className="w-full bg-gray-850 rounded-xl mx-auto px-12 py-8" style={{boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',width:'100%'}}>
    <h1 onClick={()=>{playsoundping()}} className="mx-auto max-w-4xl px-16 text-center text-3xl font-semibold leading-tight sm:text-3xl">
      Mobile detection system
    </h1>

    <div className="App">
      <header className="App-header" style={{backgroundColor:'#282c3400'}}>
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius:'5px',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
    

    </div>
  </div>

</div>

    </div>
  </div>

</div>


</div>

</main>

    
    </>
  )
}

export default TensorflowMobileDetection
