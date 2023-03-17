import React, { useState } from "react";
import WheelComponent from "react-wheel-of-prizes";
// import 'react-wheel-of-prizes/dist/index.css'

interface SpinWheelProps {
  prizes: string[];
  size: number;
}

const SpinWheel = ({ prizes, size }: SpinWheelProps) => {
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner: any) => {
    console.log(winner);
  };

  return (
    <div className="">
      <WheelComponent
        segments={prizes}
        segColors={segColors}
        onFinished={(winner: any) => onFinished(winner)}
        primaryColor="black"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={true}
        size={size}
        upDuration={100}
        downDuration={1000}
        fontFamily="Arial"
      />
    </div>
  );
};

export default SpinWheel;
