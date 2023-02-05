import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { motion } from "framer-motion";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const animatedVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

type TabGroupBorderedProps = {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  children?: React.ReactNode;
};
const TabGroupBordered = ({
  tabs,
  activeTab,
  setActiveTab,
  children,
}: TabGroupBorderedProps) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-2 py-16 sm:px-0">
      <Tab.Group
        as={Fragment}
        selectedIndex={activeTab}
        onChange={setActiveTab}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Tab.List className="rounded-x -mb-px flex space-x-8 border-b border-gray-200 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                    selected
                      ? "border-pink-500 text-gray-900"
                      : "hover:border-gray-500' border-transparent text-gray-500 hover:text-gray-700",
                    "transition-all"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {tabs.map((tab, index) => (
              <Tab.Panel
                key={index}
                className={classNames("p-8", "focus:outline-none")}
              >
                <motion.div
                  variants={animatedVariant}
                  initial="hidden"
                  animate="visible"
                >
                  {children}
                </motion.div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default TabGroupBordered;
