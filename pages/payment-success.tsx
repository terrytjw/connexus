import React from "react";
import CountdownTimer from "../components/CountDownTimer";

const PaymentSuccess = () => {
  return (
    <main>
      <div>Payment Successful!</div>
      <CountdownTimer
        countdownTime={5}
        countDownInProgressMessage="Redirecting you in "
        countDownCompletionMessage="Redirecting now..."
      />
    </main>
  );
};

export default PaymentSuccess;
