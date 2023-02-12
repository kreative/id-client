import { useQuery } from "@tanstack/react-query";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useAtom } from "jotai";

import EditApplicationModal from "@/components/modals/EditApplication";
import Breadcrumb from "@/components/admin/Breadcrumb";
import AppStats from "@/components/admin/apps/AppStats";

import { editAppModalStore } from "../../../stores/editAppModalStore";
import { appDataStore } from "@/stores/appDataStore";

export default function SingleApp({ aidn }) {
  const [editState, setEditState] = useAtom(editAppModalStore);
  const [appData, setAppData] = useAtom(appDataStore);

  const pages = [
    { name: "Admin", href: "/admin", current: false },
    { name: "Apps", href: "/admin/apps", current: false },
    { name: appData.name, href: `/admin/apps/${aidn}`, current: true },
  ];

  // this is mock data, should be replaced with real data
  // we will eventually send this exact array in the getOneApplication query
  // through response.data.data.stats
  const stats = [
    { name: "Total Subscribers", stat: "71,897" },
    { name: "Avg. Open Rate", stat: "58.16%" },
    { name: "Avg. Click Rate", stat: "24.57%" },
    { name: "Total Apps", stat: "4" },
  ];

  const changeEditState = (event) => {
    event.preventDefault();

    // modifies the global state of the edit application modal
    // changes the modal to open and adds app data based on current app
    setEditState(true);
  };

  const copyLinkToClipboard = (event, url) => {
    event.preventDefault();

    // copies the link to the clipboard
    navigator.clipboard.writeText(url);
  };

  // we need this query to run, and then set the global app data
  // this app data will be used to populate the edit application modal
  // and it will be used to populate the application page
  // we only want the page below the navbar to render once the query is done
  const applicationQuery = useQuery({
    queryKey: ["application", aidn],
    queryFn: async () => {
      // creates an empty response variable
      let response;

      // doesn't run the query if there is no aidn
      // without this, there will be a failed axios request (400) because the query tries
      // to make a requent to /v1/applications/undefined
      if (aidn === undefined) return null;

      try {
        // this request doesn't require any authentication
        // so no headers or any sort of body data will be sent with this get request
        response = await axios.get(
          `https://id-api.kreativeusa.com/v1/applications/${aidn}`
        );
      } catch (error) {
        // some sort of error, statusCode is not between 200-299
        // since this is a simple get request, something is wrong with the server
        console.log(error);
        throw new Error("Something went wrong with the server.");
      }

      const application = response.data.data.application;

      // sets the global app data to the returned application
      setAppData({
        aidn: application.aidn,
        appchain: application.appchain,
        name: application.name,
        description: application.description,
        callback: application.callbackUrl,
        homepage: application.homepage,
        logoUrl: application.logoUrl,
        iconUrl: application.iconUrl,
      });

      // sends back the application data object
      return application;
    },
  });

  return (
    <div>
      {applicationQuery.isLoading && (
        <p className="pt-6 text-center text-lg text-gray-400">Loading...</p>
      )}
      {applicationQuery.isError && (
        <p className="pt-6 text-center text-2xl text-red-600">
          Error: {applicationQuery.error}
        </p>
      )}
      {applicationQuery.isSuccess && (
        <div>
          <EditApplicationModal state={editState} setState={setEditState} />
          <div className="pt-12">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-3xl font-semibold text-gray-900">
                  {appData.name}
                </h1>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  onClick={(e) => changeEditState(e)}
                >
                  Edit application
                </button>
              </div>
            </div>
          </div>
          <Breadcrumb pages={pages} />
          <AppStats stats={stats} />
          <div className="mt-6 pb-24">
            <div className="overflow-hidden border-2 border-gray-100 bg-white sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Application information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  All details and availible assets for {appData.name}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Application name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {appData.name}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Website homepage
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <a
                        href={appData.homepage}
                        className="text-indigo-600 hover:text-blue-700"
                      >
                        {appData.homepage}
                      </a>
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {appData.description}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Callback link
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <a
                        href={appData.callback}
                        className="text-indigo-600 hover:text-blue-700"
                      >
                        {appData.callback}
                      </a>
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Brand assets
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-200 rounded-md border border-gray-200"
                      >
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {appData.name} typographic logo color
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href={appData.logoUrl}
                              className="font-medium text-indigo-600 hover:text-indigo-500 mr-3"
                              target={"_blank"}
                              rel={"noreferrer"}
                            >
                              View
                            </a>
                            <button
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={(e) => copyLinkToClipboard(e, appData.iconUrl)}
                            >
                              Copy link
                            </button>
                          </div>
                        </li>
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {appData.name} iconologo color
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href={appData.iconUrl}
                              className="mr-3 font-medium text-indigo-600 hover:text-indigo-500"
                              target={"_blank"}
                              rel={"noreferrer"}
                            >
                              View
                            </a>
                            <button
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={(e) => copyLinkToClipboard(e, appData.iconUrl)}
                            >
                              Copy link
                            </button>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
