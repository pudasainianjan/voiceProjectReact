import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ToggleWithDescription({
  header,
  description,
  toggleEnabled,
  toggleSetEnabled,
  isDarkMode,
}) {
  const [enabled, setEnabled] = useState(toggleEnabled);

  useEffect(() => {
    toggleSetEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    setEnabled(toggleEnabled);
  }, [toggleEnabled]);

  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          aria-label="sound toggle switch"
          aria-description="Use this toggle switch to enable voice command mode"
          as="span"
          className={`text-sm font-medium leading-6 ${
            isDarkMode ? "text-white opacity-70" : "text-gray-900"
          }  lg:mx-5`}
          passive
        >
          {header}
        </Switch.Label>
        <Switch.Description
          as="span"
          className={`text-sm ${
            isDarkMode ? "text-white opacity-70" : "text-gray-500"
          } `}
        >
          {description}
        </Switch.Description>
      </span>
      <Switch
        defaultChecked={enabled}
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
