import { useRouter } from "next/router";
import { useState, useEffect } from "react";

type CountdownTimerProps = {
  countdownTime: number; // in seconds
  countDownInProgressMessage: string;
  countDownCompletionMessage: string;
};
const CountdownTimer = ({
  countdownTime,
  countDownInProgressMessage,
  countDownCompletionMessage,
}: CountdownTimerProps) => {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(countdownTime);

  useEffect(() => {
    if (timeRemaining > 0) {
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    router.replace("/communities");
  }, [timeRemaining]);

  return (
    <div className="">
      {timeRemaining === 0 ? (
        <span>{countDownCompletionMessage}</span>
      ) : (
        <span>
          {countDownInProgressMessage} {timeRemaining}
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;
