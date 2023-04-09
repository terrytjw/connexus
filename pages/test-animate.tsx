import React, { useRef, MouseEvent } from "react";
import { Typewriter } from "react-simple-typewriter";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const HoverComponent = () => {
  const hoverEffectRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { pageX, pageY } = e;
    const hoverEffect = hoverEffectRef.current;

    if (hoverEffect) {
      hoverEffect.style.left = `${pageX - hoverEffect.clientWidth / 2}px`;
      hoverEffect.style.top = `${pageY - hoverEffect.clientHeight / 2}px`;
    }
  };

  const handleMouseLeave = () => {
    const hoverEffect = hoverEffectRef.current;

    if (hoverEffect) {
      hoverEffect.style.opacity = "0";
    }
  };

  const handleMouseEnter = () => {
    const hoverEffect = hoverEffectRef.current;

    if (hoverEffect) {
      hoverEffect.style.opacity = "1";
    }
  };

  const handleType = (count: number) => {
    // access word count number
    console.log(count);
  };

  const handleDone = () => {
    console.log(`Done after 5 loops!`);
  };

  return (
    <div
      className="relative min-h-[30rem] w-full overflow-hidden bg-blue-200"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        ref={hoverEffectRef}
        className="pointer-events-none absolute z-0 h-72 w-72 rounded-full bg-blue-100/60 blur-2xl transition-opacity duration-500"
      />
      <h1
        className={classNames(
          "relative z-10 inline-block p-36 text-5xl font-extrabold",
          "bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
        )}
      >
        WAZZZUPPPP homiesssss
      </h1>
      <Typewriter
        words={["WAZZZUPPPP homiesssss."]}
        // loop={5}
        cursor
        cursorStyle="|"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
        onLoopDone={handleDone}
        onType={handleType}
      />
    </div>
  );
};

const TestAnimatePage = () => {
  return (
    <main>
      <HoverComponent />
    </main>
  );
};

export default TestAnimatePage;
