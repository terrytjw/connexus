import React from "react";
import { StepStatus } from "../../lib/enums";

// not sure where to put this
export type Step = {
  id: string;
  name: string;
  status: StepStatus;
};

type StepsDesktopProps = {
  steps: Step[];
};

const StepsDesktop = ({ steps }: StepsDesktopProps) => {
  return (
    <nav className="debug-screens invisible mt-8 mb-8 h-full w-full sm:visible">
      <ol role="list" className="flex space-y-0 space-x-8">
        {steps?.map((step) => (
          <li key={step.name} className="flex-1">
            {step.status === StepStatus.COMPLETE ? (
              <a className="group flex flex-col border-indigo-600 py-2 pl-4 hover:border-indigo-800 sm:border-l-0 sm:border-t-4 sm:pl-0 sm:pt-4 sm:pb-0">
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === StepStatus.CURRENT ? (
              <a
                className="flex flex-col border-indigo-600 py-2 pl-4 sm:border-l-0 sm:border-t-4 sm:pl-0 sm:pt-4 sm:pb-0"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a className="group flex flex-col border-gray-200 py-2 pl-4 hover:border-gray-300 sm:border-l-0 sm:border-t-4 sm:pl-0 sm:pt-4 sm:pb-0">
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepsDesktop;
