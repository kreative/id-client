import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function AdminFunction({ apps }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Kreative ID Admin Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
      </div>
      <div className="pt-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Applications
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all applications including their AIDN, name, and
              callback URL.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add application
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                      >
                        AIDN
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Callback URL
                      </th>
                      <th
                        scope="col"
                        className="relative py-3 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {apps.map((app) => (
                      <tr key={app.aidn}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {app.aidn}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {app.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {app.callbackUrl}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only">, {app.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminComponent() {
  const [apps, setApps] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["kreative_id_key"]);

  React.useEffect(() => {
    let mounted = true;

    // ensures nothing can happen unless the cookie loads
    if (!cookies["kreative_id_key"]) return;

    const getApplications = () => {
      // with this axios request, we need to set the proper headers for the server-side authentication
      // this includes: kreative_id_key, kreative_aidn
      console.log(cookies["kreative_id_key"]);
      axios
        .get("https://id-api.kreativeusa.com/v1/applications", {
          headers: {
            "KREATIVE_ID_KEY": cookies["kreative_id_key"],
            "KREATIVE_AIDN": process.env.NEXT_PUBLIC_AIDN,
          }
        })
        .then((response) => {
          // status code is between 200-299, we should have the apps
          const applications = response.data.data;
          console.log(applications);
          setApps(applications);
          return () => (mounted = false);
        })
        .catch((error) => {
          // some sort of error, statusCode is not between 200-199
          // TODO: replace this with an alert that shows internal server error
          console.log(error);
        });
    };

    getApplications();
  }, [cookies["kreative_id_key"]]);

  return (
    <div>{apps.length !== 0 && <AdminFunction apps={apps} />}</div>
  );
}
