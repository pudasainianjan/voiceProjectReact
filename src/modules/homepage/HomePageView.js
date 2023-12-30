import logo from "../../logo.svg";
import "../../App.css";
import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SoundPermissionModal from "./SoundPermissionModal";
import ToggleWithDescription from "../../components/ToggleWithDescription";
import Alert from "../../components/Alert";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Product",
    href: "#",
    ariaLabel: "Click on this to get information about products available.",
  },
  {
    name: "Pricing",
    href: "#",
    ariaLabel: "Want to know about our pricing? Click this.",
  },
  {
    name: "Our Works",
    href: "#",
    ariaLabel: "Want to know about our working style? Click this.",
  },
  {
    name: "About Us",
    href: "#",
    ariaLabel: "Want to know about our  company? Click this.",
  },
];

function HomePageView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSoundPermissionModalOpen, setSoundPermissionModalOpen] =
    useState(false);
  const [enableSoundAssistance, setEnableSoundAssistance] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("");
  const [currentCommand, setCurrentCommand] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recognitionStarted, setRecognitionStarted] = useState(false);
  const [isPermissionLoading, setIsPermissionIsLoading] = useState(false);

  const [permissionObj, setPermissionObj] = useState({
    headerText: "",
    bodyText: "",
    status: "",
    permissionStatus: "",
  });

  useEffect(() => {
    if (enableSoundAssistance) {
      isMicrophoneAllowed().then((permissionStatus) => {
        setPermissionStatus(permissionStatus);
        if (permissionStatus === "granted") {
          setSoundPermissionModalOpen(false);
          console.log("before calling recog");
          !recognitionStarted && startRecognitionProcess();
        } else {
          setSoundPermissionModalOpen(true);
        }
      });
    }
  }, [enableSoundAssistance]);

  async function isMicrophoneAllowed() {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });
      console.log("permission state", permissionStatus.state);
      return permissionStatus.state;
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      return false;
    }
  }

  const setPermissionData = (data) => {
    setPermissionObj(data);
  };

  const startRecognitionProcess = useCallback(() => {
    setRecognitionStarted(true);
    setIsPermissionIsLoading(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setIsPermissionIsLoading(false);

        const recognition = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();

        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = false;
        console.log("called rec");
        recognition.onresult = (event) => {
          console.log("event", event);
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript
            .trim()
            .toLowerCase();
          executeCommand(command);
        };

        recognition.onstart = () => {
          setIsListening(true);
          setIsPermissionIsLoading(false);
        };

        recognition.onend = () => {
          recognition.start();
        };

        recognition.addEventListener("error", (event) => {
          console.error("Error during recognition:", event.error);
          setIsListening(false);
          setIsPermissionIsLoading(true);
        });

        recognition.onsoundend = () => {
          console.log("before calling recognition stop");

          setIsListening(false);
        };

        recognition.onstop = () => {
          setIsListening(false);
        };

        console.log("before calling recognition start");

        recognition.start();
      })
      .catch(() => {
        setIsPermissionIsLoading(false);
      });
  }, []);

  function executeCommand(command) {
    setCurrentCommand(command);
    if (checkStrings(command, ["disable", "sound", "off"])) {
      setEnableSoundAssistance(false);
    } else if (checkStrings(command, ["enable", "sound", "on"])) {
      setEnableSoundAssistance(true);
    } else if (command.includes("dark mode")) {
      setIsDarkMode(true);
    } else if (command.includes("light mode")) {
      setIsDarkMode(false);
    }
  }

  const checkStrings = (command, strings) => {
    const matches = strings.filter((str) => command.includes(str));
    return matches.length >= 2;
  };

  return (
    <>
      <div className={isDarkMode ? "bg-gray-900" : "bg-white"}>
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <span className="sr-only">
                <a href="#main" className="skip-to-main-content-link">
                  Skip to main content
                </a>
              </span>
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-8 w-auto" src={logo} alt="" />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  className={`text-sm font-semibold leading-6 ${
                    isDarkMode ? "text-white opacity-70" : "text-gray-900"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {console.log("current sound", enableSoundAssistance)}
              <ToggleWithDescription
                toggleEnabled={enableSoundAssistance}
                toggleSetEnabled={setEnableSoundAssistance}
                header={"Sound mode"}
              />
            </div>
            {(isListening || isPermissionLoading) && (
              <span className="animate-pulse inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-white  lg:ml-14 bg-indigo-500">
                <svg
                  className="animate-ping h-1.5 w-1.5 fill-green-400"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx={3} cy={3} r={3} />
                </svg>
                <h1 className="sm:text-xl md:text-sm font-bold leading-6 text-white">
                  {isPermissionLoading
                    ? "Waiting for mic..."
                    : isListening && "Listening..."}
                </h1>
              </span>
            )}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img className="h-8 w-auto" src={logo} alt="" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 
                        ${
                          isDarkMode ? "text-white opacity-70" : "text-gray-900"
                        }  hover:bg-gray-50`}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>

                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </a>
                  </div>
                  <div className="border-none ">
                    <ToggleWithDescription
                      toggleEnabled={enableSoundAssistance}
                      toggleSetEnabled={setEnableSoundAssistance}
                      header={"Sound mode"}
                    />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          {isDarkMode ? (
            <div
              className="darkmode absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              {/* <div
                className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
              /> */}

              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5]opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
              />
            </div>
          ) : (
            <div
              className="lightmode absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          )}
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            {currentCommand && (
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-5 py-1 text-4xl leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  {currentCommand}
                </div>
              </div>
            )}
            <div className="text-center">
              <h1
                aria-label="heading"
                className={`text-4xl font-bold tracking-tight sm:text-6xl ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Try saying following commands
              </h1>
              <p
                id="#main"
                className={`mt-6 text-lg leading-8 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You can say something like{" "}
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  "Hello, can you turn on the sound feature?"
                </span>{" "}
                or something like{" "}
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  There is a toggle switch for sound. Can you disable it?
                </span>
                or something like{" "}
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  "I need dark mode to be enabled"
                </span>{" "}
                or like{" "}
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  "Turn on the light mode"
                </span>
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  aria-pressed="false"
                  className="aria-pressed:ring-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className={`text-sm font-semibold leading-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert
        headerText={permissionObj.headerText}
        leftIcon={
          <MicrophoneIcon
            className="h-6 w-6 text-green-600"
            aria-hidden="true"
          />
        }
        bodyText={permissionObj.bodyText}
        showAlert={permissionObj.headerText}
      />

      <SoundPermissionModal
        isOpen={isSoundPermissionModalOpen}
        onClose={() => setSoundPermissionModalOpen(false)}
        sendPermissionDataToParent={setPermissionData}
        isSoundEnabled={enableSoundAssistance}
        startRecognition={startRecognitionProcess}
        setEnableSoundAssistance={setEnableSoundAssistance}
        permissionStatus={permissionStatus}
      />
    </>
  );
}

export default HomePageView;
