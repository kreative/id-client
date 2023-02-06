import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

export default function AppsTableComponent() {
  const [cookies] = useCookies(["kreative_id_key"]);

  const applicationsQuery = useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      // create empty response variable
      let response;

      try {
        // with this axios request, we need to set the proper headers for the server-side authentication
        // this includes: kreative_id_key, kreative_aidn
        response = await axios.get(
          "https://id-api.kreativeusa.com/v1/applications",
          {
            headers: {
              KREATIVE_ID_KEY: cookies["kreative_id_key"],
              KREATIVE_AIDN: process.env.NEXT_PUBLIC_AIDN,
            },
          }
        );
      } catch (error) {
        // some sort of error, statusCode is not between 200-199
        console.log(error);
        // window.location.href = "/admin/error";
      }

      // sends back array of applications from response object
      return response.data.data;
    },
    enabled: true,
  });

  if (applicationsQuery.isFetching) {
    return (
      <h1 className="pt-6 text-center text-lg text-gray-700">
        Applications are being fetched...
      </h1>
    );
  }

  if (applicationsQuery.isLoading) {
    return (
      <h1 className="pt-6 text-center text-lg text-gray-700">
        Applications are loading...
      </h1>
    );
  }

  if (applicationsQuery.isError) {
    return (
      <h1 className="pt-6 text-center text-lg text-gray-700">
        Error. Applications can&apos;t load.
      </h1>
    );
  }

  if (applicationsQuery.isSuccess) {
    return (
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
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {applicationsQuery.data.map((app) => (
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
    );
  }
}
