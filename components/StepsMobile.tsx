import React from "react";
import { StepStatus } from "../utils/enums";

export type Step = {
  id: string;
  name: string;
  status: StepStatus;
};

type StepsMobileProps = {
  currentStep: Step | undefined;
  steps: Step[];
};

const StepsMobile = ({ currentStep, steps }: StepsMobileProps) => {
  return (
    <nav className="absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center sm:invisible">
      <p className="text-sm font-medium">{currentStep?.name}</p>
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {steps?.map((step) => (
          <li key={step.name}>
            {step.status === StepStatus.COMPLETE ? (
              <span className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900" />
            ) : step.status === StepStatus.CURRENT ? (
              <a className="relative flex items-center justify-center">
                <span className="absolute flex h-5 w-5 p-px">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" />
              </a>
            ) : (
              <span className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepsMobile;
