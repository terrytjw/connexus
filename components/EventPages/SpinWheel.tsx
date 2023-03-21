import { useSession } from "next-auth/react";
import React, { useState } from "react";
import WheelComponent from "react-wheel-of-prizes";
import { insertRafflePrize } from "../../lib/api-helpers/user-api";
import Button from "../Button";
// import 'react-wheel-of-prizes/dist/index.css'

interface SpinWheelProps {
  prizes: any[];
  size: number;
  setIsPrizeWon: (value: boolean) => void;
}

const SpinWheel = ({ prizes, size, setIsPrizeWon }: SpinWheelProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);
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

  const emptyPrizeValues = ["No prize :(", "No prize :("];

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const getSpinWheelPrizes = (): any[] => {
    return shuffleArray(
      prizes.map((prize: any) => prize.name).concat(emptyPrizeValues)
    );
  };

  const getWonPrizeId = (wonPrizeName: string): number | undefined => {
    return prizes.find((prize: any) => prize.name == wonPrizeName)
      ?.rafflePrizeId;
  };

  const onFinished = async (wonPrize: any) => {
    console.log(wonPrize);
    if (wonPrize != "No prize :(") {
      if (getWonPrizeId(wonPrize)) {
        console.log(
          "calling user Ticket api with won prize id -> ",
          getWonPrizeId(wonPrize)
        );
        const res = await insertRafflePrize(getWonPrizeId(wonPrize), userId);
        setIsPrizeWon(true);
        console.log("res ->", res);
      } else {
        console.log("error with getting won prize id");
      }
    }
  };

  return (
    <div className="">
      <WheelComponent
        segments={getSpinWheelPrizes()}
        segColors={segColors}
        onFinished={(wonPrize: any) => onFinished(wonPrize)}
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
