import { previousDay } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import WheelComponent from "react-wheel-of-prizes";
import { insertRafflePrize } from "../../lib/api-helpers/user-api";
import { CurrentTicket } from "../../pages/events/tickets";
import Button from "../Button";
// import 'react-wheel-of-prizes/dist/index.css'

interface SpinWheelProps {
  prizes: any[];
  size: number;
  setCurrentTicket: React.Dispatch<React.SetStateAction<CurrentTicket>>;
}

const SpinWheel = ({ prizes, size, setCurrentTicket }: SpinWheelProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);
  const COLORS = ["#1A54C2", "#87DBFF", "#FFD086", "#F69489", "#ED6571"];

  const emptyPrizeValues = ["No prize :(", "No prize :("];

  const concatArrayByCeilDivision = (
    a: number,
    b: number,
    values: string[]
  ): string[] => {
    const repetitions = Math.ceil(a / b);
    const result = [] as string[];

    for (let i = 0; i < repetitions; i++) {
      result.push(...values);
    }

    return result;
  };

  const segColors = concatArrayByCeilDivision(
    prizes.concat(emptyPrizeValues).length,
    COLORS.length,
    COLORS
  );

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
      let prizeId = getWonPrizeId(wonPrize);
      if (prizeId) {
        console.log(
          "calling user Ticket api with won prize id -> ",
          getWonPrizeId(wonPrize)
        );
        const res = await insertRafflePrize(prizeId, userId);
        setCurrentTicket((prev: CurrentTicket) => ({
          ...prev,
          rafflePrizeWinner: {}, // pass in an truthy object
          rafflePrizeName: wonPrize,
        }));
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
