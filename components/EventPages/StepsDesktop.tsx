import React from "react";
import { StepStatus } from "../../lib/enums";

export type Step = {
  id: string;
  name: string;
  status: StepStatus;
};

type StepsDesktopProps = {
  steps: Step[];
  setSteps: (steps: (prev: any) => any) => void;
  isEdit?: boolean;
};

const StepsDesktop = ({ steps, setSteps, isEdit }: StepsDesktopProps) => {
  const goToStep = (stepId: string): void => {
    switch (stepId) {
      case "Step 1":
        setSteps((prev) =>
          prev.map((step: Step) =>
            step.id === "Step 1"
              ? { ...step, status: StepStatus.CURRENT }
              : { ...step, status: StepStatus.UPCOMING }
          )
        );
        break;
      case "Step 2":
        setSteps((prev) =>
          prev.map((step: Step) =>
            step.id === "Step 2"
              ? { ...step, status: StepStatus.CURRENT }
              : step.id === "Step 1"
              ? { ...step, status: StepStatus.COMPLETE }
              : { ...step, status: StepStatus.UPCOMING }
          )
        );
        break;
      case "Step 3":
        setSteps((prev) =>
          prev.map((step: Step) =>
            step.id === "Step 3"
              ? { ...step, status: StepStatus.CURRENT }
              : { ...step, status: StepStatus.COMPLETE }
          )
        );
        break;
      default:
        break;
    }
  };
  return (
    <nav className="debug-screens invisible mt-8 mb-8 h-full w-full sm:visible">
      <ol role="list" className="flex space-y-0 space-x-8">
        {steps?.map((step) => (
          <li
            key={step.id}
            className={`flex-1 ${isEdit ? "hover:cursor-pointer" : ""}`}
            onClick={() => {
              if (isEdit) goToStep(step.id);
            }}
          >
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
