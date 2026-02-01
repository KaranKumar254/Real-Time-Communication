import { useEffect, useRef } from "react";

export default function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(() => {
        alert("Camera access denied");
      });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      style={{ width: "300px", border: "2px solid black" }}
    />
  );
}
