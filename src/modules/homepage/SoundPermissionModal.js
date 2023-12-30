import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

export default function SoundPermissionModal({
  isOpen,
  onClose,
  sendPermissionDataToParent,
  isSoundEnabled,
  startRecognition,
  setEnableSoundAssistance,
  permissionStatus,
}) {
  const [open, setOpen] = useState(isOpen);
  const [permissionObj, setPermissionObj] = useState({
    headerText: "",
    bodyText: "",
    status: "",
    permissionStatus: "",
  });

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    sendPermissionDataToParent(permissionObj);
  }, [permissionObj, sendPermissionDataToParent]);

  // document.addEventListener("DOMContentLoaded", init);

  // function init() {
  //   const permissionButton = document.getElementById("permissionButton");
  //   permissionButton.addEventListener("click", requestPermission);
  // }

  function resetPermissonAlert() {
    setPermissionObj({
      headerText: "",
      bodyText: "",
      status: "",
    });
  }

  function requestPermission() {
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then(() => {
        console.log(" granted permission");

        startRecognition();
        setPermissionObj({
          headerText: "Microphone Permission Granted",
          bodyText: "Successfully granted microphone permission",
          status: "success",
        });
        setEnableSoundAssistance(true);
        onClose();
      })
      .catch((error) => {
        console.error("Error getting microphone permission:", error);
        setEnableSoundAssistance(false);

        setPermissionObj({
          headerText: "Microphone Permission Already Granted",
          bodyText: "You have already given permission to use microphone.",
          status: "info",
          permissionStatus: "",
        });
        onClose();
      });
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose} role="modal">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <MicrophoneIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Need microphone permission
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We need microphone permission enabled to hear your
                        sound. You can tap on Yes.
                      </p>
                    </div>
                  </div>
                </div>
                {console.log(
                  "permissionStatus permissionStatus",
                  permissionStatus
                )}
                {permissionStatus === "dsenied" ? (
                  <div className="flex-col lg:flex-row mt-5 sm:mt-6 flex justify-between ">
                    <button
                      disabled
                      type="button"
                      className="inline-flex w-full  justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={requestPermission}
                    >
                      Permission Denied
                    </button>
                  </div>
                ) : (
                  <div className="flex-col lg:flex-row mt-5 sm:mt-6 flex justify-between ">
                    <button
                      type="button"
                      className="mt-3 mb-3 lg:mb-auto inline-flex  justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="inline-flex  justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={requestPermission}
                    >
                      Grant permission
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
