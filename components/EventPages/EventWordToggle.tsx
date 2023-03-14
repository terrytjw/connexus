import { Switch } from "@headlessui/react";

type EventWordToggleProps = {
  leftWord: string;
  rightWord: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
};
const EventWordToggle = ({
  leftWord,
  rightWord,
  isChecked,
  setIsChecked,
}: EventWordToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isChecked}
        onChange={setIsChecked}
        className="relative inline-flex h-full w-60 shrink-0 cursor-pointer items-center rounded border border-blue-600 bg-white px-2 transition-colors duration-200 ease-in-out focus:outline-none"
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${isChecked ? "translate-x-28" : "translate-x-0"}
            pointer-events-none inline-flex h-10 w-28 transform items-center justify-center rounded bg-blue-600 text-neutral-50 ring-0 transition duration-200 ease-in-out`}
        />
        <div className="absolute flex w-56 text-sm">
          <span
            className={`w-28 ${
              isChecked ? "text-blue-600" : "text-neutral-50"
            }`}
          >
            {leftWord}
          </span>
          <span
            className={`w-28 ${
              isChecked ? "text-neutral-50" : "text-blue-600"
            }`}
          >
            {rightWord}
          </span>
        </div>
      </Switch>
    </div>
  );
};

export default EventWordToggle;
