import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import axios from "axios";

import { appDataStore } from "@/stores/appDataStore";
import AlertComponent from "../Alert";

export default function EditApplicationModal({ state, setState }) {
  const cancelButtonRef = useRef(null);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["kreative_id_key"]);
  const [alertStyles, setAlertStyles] = useState("hidden");
  const [message, setMessage] = useState("");

  // global states
  const [appData, setAppData] = useAtom(appDataStore);

  // temporary states, initialized to be empty
  const [appName, setAppName] = useState("");
  const [callback, setCallback] = useState("");
  const [homepage, setHomepage] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogo] = useState("");
  const [iconUrl, setIcon] = useState("");
  const [refresh, setRefresh] = useState(false);

  // sets the local states based on appData global state
  // there is some sort of async issue where setting the default value of the temp states
  // to the appData variables results in undefined default values, so we do it here
  // also going to hide any alert messages
  useEffect(() => {
    console.log(appData);
    setAlertStyles("hidden");
    setAppName(appData.name);
    setCallback(appData.callback);
    setHomepage(appData.homepage);
    setDescription(appData.description);
    setLogo(appData.logoUrl);
    setIcon(appData.iconUrl);
  }, [appData]);

  const setOpen = (isOpen) => {
    setState(isOpen);
    setAlertStyles("hidden");
  };

  // handles changes to the checkbox
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    console.log(checked);
    setRefresh(checked);
  };

  // updates the application details
  const editAppMutation = useMutation({
    mutationFn: async (url) => {
      let response;

      try {
        response = await axios.post(
          url,
          {
            callbackUrl: callback,
            name: appName,
            refreshAppchain: refresh,
            homepage, 
            description,
            logoUrl,
            iconUrl,
          },
          {
            headers: {
              KREATIVE_ID_KEY: cookies["kreative_id_key"],
              KREATIVE_AIDN: process.env.NEXT_PUBLIC_AIDN,
              KREATIVE_APPCHAIN: process.env.NEXT_PUBLIC_APPCHAIN,
            },
          }
        );
      } catch (error) {
        // some sort of error happened
        console.log(error);
        throw new Error(error.message);
      }

      return response.data;
    },
    onError: (error) => {
      // some sort of error occured
      // handle any errors produced from the request
      console.log(error);
      setMessage(
        `Internal server error occured. Please try again later. ERROR: ${error.message}`
      );
      setAlertStyles("");
    },
    onSuccess: () => {
      // close the modal since the method completely succeeded
      setState(false);
      // invalidate the query so that the data will be refreshed
      queryClient.invalidateQueries("applications");
    },
  });

  const editApplication = (e) => {
    // prevents default behavior of form submission
    e.preventDefault();
    // hide any alert messages
    setAlertStyles("hidden");

    // makes sure all fields actually have values
    // logo and icon are allowed to be "" since they are optional
    if (
      appName === "" ||
      callback === "" ||
      homepage === "" ||
      description === ""
    ) {
      setMessage("Please fill out all fields.");
      setAlertStyles("");
      return;
    }

    // check if the logo URL starts with https://
    // we need this to be a valid URL if there is actually something entered
    if (logoUrl !== "" && !logoUrl.startsWith("https://")) {
      setMessage("Logo URL must start with https://");
      setAlertStyles("");
      return;
    }

    // check if the icon URL starts with https://
    // we need this to be a valid URL if there is actually something entered
    if (iconUrl !== "" && !iconUrl.startsWith("https://")) {
      setMessage("Icon URL must start with https://");
      setAlertStyles("");
      return;
    }

    // checks to see if the fields are the same as the global state
    // if they are we show an alert message and return
    // we don't want to run a query to post the same data, that's a waste of resources
    if (
      appName === appData.name &&
      callback === appData.callback &&
      homepage === appData.homepage &&
      description === appData.description &&
      logoUrl === appData.logoUrl &&
      iconUrl === appData.iconUrl &&
      refresh === false
    ) {
      setMessage("No changes were made.");
      setAlertStyles("");
      return;
    }

    // creates the url to send the request to
    const url = `https://id-api.kreativeusa.com/v1/applications/${appData.aidn}`;
    // call the edit app mutation function
    editAppMutation.mutate(url);
  };

  // deletes the application from the database
  const deleteAppMutation = useMutation({
    mutationFn: async (url) => {
      let response;

      try {
        response = await axios.delete(url, {
          headers: {
            KREATIVE_ID_KEY: cookies["kreative_id_key"],
            KREATIVE_AIDN: process.env.NEXT_PUBLIC_AIDN,
            KREATIVE_APPCHAIN: process.env.NEXT_PUBLIC_APPCHAIN,
          },
        });
      } catch (error) {
        // some sort of error happened
        console.log(error);
        throw new Error(error.message);
      }

      return response.data;
    },
    onError: (error) => {
      // some sort of error occured
      // handle any errors produced from the request
      console.log(error);
      setMessage(
        `Internal server error occured. Please try again later. ERROR: ${error.message}`
      );
      setAlertStyles("");
    },
    onSuccess: (data) => {
      // close the modal since the method completely succeeded
      setState(false);
      // invalidate the query so that the data will be refreshed
      queryClient.invalidateQueries("applications");
    },
  });

  const deleteApplication = (e) => {
    // prevents default behavior of form submission
    e.preventDefault();
    // creates the url to send the request to
    const url = `https://id-api.kreativeusa.com/v1/applications/${appData.aidn}`;
    // call the delete app mutation function
    deleteAppMutation.mutate(url);
  };

  return (
    <Transition.Root show={state} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-6 pb-3">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-2xl font-bold leading-6 text-gray-900"
                    >
                      Edit {appData.name} ({appData.aidn})
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-center text-sm text-gray-500">
                        Modify the callback URL or application name.
                      </p>
                    </div>
                    <div className={alertStyles}>
                      <AlertComponent message={message} />
                    </div>
                    <div id="new-application-form">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <div className="pb-2 pt-6">
                            <label
                              htmlFor="appName"
                              className="block text-left text-sm font-medium text-gray-700"
                            >
                              Application Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="appName"
                                id="appName"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Kreative DreamFactory"
                                required
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <div className="sm:col-span-3">
                            <div className="pb-2 pt-6">
                              <label
                                htmlFor="homepage"
                                className="block text-left text-sm font-medium text-gray-700"
                              >
                                Homepage
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="homepage"
                                  id="homepage"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="https://kreativeusa.com"
                                  required
                                  value={homepage}
                                  onChange={(e) => setHomepage(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 pb-2">
                        <label
                          htmlFor="callback-url"
                          className="block text-left text-sm font-medium text-gray-700"
                        >
                          Callback URL
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="callback-url"
                            id="callback-url"
                            className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="kreativeusa.com"
                            required
                            value={callback}
                            onChange={(e) => setCallback(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="pt-2 pb-2">
                        <label
                          htmlFor="description"
                          className="block text-left text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="mt-1 block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder={"End to end asteroid mining service..."}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <div className="pb-2">
                            <label
                              htmlFor="logo"
                              className="block text-left text-sm font-medium text-gray-700"
                            >
                              Logo URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="logo"
                                id="logo"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="https://cdn.kreativeusa.com/icon.png"
                                required
                                value={logoUrl}
                                onChange={(e) => setLogo(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <div className="sm:col-span-3">
                            <div className="pb-2">
                              <label
                                htmlFor="icon"
                                className="block text-left text-sm font-medium text-gray-700"
                              >
                                Icon URL
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="icon"
                                  id="icon"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="https://cdn.kreativeusa.com/icon.png"
                                  required
                                  value={iconUrl}
                                  onChange={(e) => setIcon(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex items-start py-4">
                        <div className="min-w-0 flex-1 text-sm">
                          <label
                            htmlFor="comments"
                            className="font-medium text-gray-700"
                          >
                            Generate a new appchain?
                          </label>
                          <p
                            id="comments-description"
                            className="text-gray-500"
                          >
                            Current appchain: {appData.appchain}
                          </p>
                        </div>
                        <div className="ml-3 flex h-5 items-center">
                          <input
                            id="comments"
                            aria-describedby="comments-description"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:col-start-2 sm:text-sm"
                    onClick={(e) => editApplication(e)}
                  >
                    Update application
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <span className="pt-4">
                    <button
                      className="text-md inline-flex items-center justify-center font-medium text-red-600 shadow-sm hover:text-red-400 sm:w-auto"
                      onClick={(e) => deleteApplication(e)}
                    >
                      Delete application
                    </button>
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
