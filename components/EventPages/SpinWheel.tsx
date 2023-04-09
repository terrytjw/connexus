import { useSession } from "next-auth/react";
import React from "react";
import WheelComponent from "react-wheel-of-prizes";
import { insertRafflePrize } from "../../lib/api-helpers/user-api";
import { CurrentTicket } from "../../pages/events/tickets";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
// import 'react-wheel-of-prizes/dist/index.css'

interface SpinWheelProps {
  prizes: any[];
  size: number;
  setCurrentTicket: React.Dispatch<React.SetStateAction<CurrentTicket>>;
}

const SpinWheel = ({ prizes, size, setCurrentTicket }: SpinWheelProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);
  const COLORS = ["#1A54C2", "#79D7FF", "#FFD086", "#F69489", "#ED6571"];

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
    prizes.length,
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
    return shuffleArray(prizes.map((prize: any) => prize.name));
  };

  const getWonPrizeId = (wonPrizeName: string): number | undefined => {
    return prizes.find((prize: any) => prize.name == wonPrizeName)
      ?.rafflePrizeId;
  };

  const onFinished = async (wonPrize: any) => {
    let prizeId = getWonPrizeId(wonPrize);
    if (prizeId) {
      await toast.promise(insertRafflePrize(prizeId, userId), {
        loading: "Preparing prize...",
        success: "Congrats, you won something!!!",
        error: "Error Inserting Raffle Prize",
      });
      setCurrentTicket((prev: CurrentTicket) => ({
        ...prev,
        rafflePrizeWinner: {}, // pass in an truthy object
        rafflePrizeName: wonPrize,
      }));
      setTimeout(() => router.reload(), 5000);
    } else {
      console.log("error with getting won prize id");
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
