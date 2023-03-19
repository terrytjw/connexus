import { Switch } from "@headlessui/react";

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
};
const Toggle = ({ isChecked, setIsChecked }: ToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isChecked}
        onChange={setIsChecked}
        className={`${isChecked ? "bg-blue-600" : "bg-gray-400"}
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${isChecked ? "translate-x-6" : "translate-x-1"}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};

export default Toggle;
