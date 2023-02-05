import { useCookies } from "react-cookie";
import axios from "axios";

export default function AdminNavbarComponent() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "kreative_id_key",
    "keychain_id",
    "id_ksn",
    "id_email",
    "id_fname",
    "id_lname",
    "id_picture",
  ]);

  const logout = (e) => {
    // prevents default button click behavior
    e.preventDefault();

    // closes the keychain using id-api
    axios
      .post(
        `https://id-api.kreativeusa.com/v1/keychains/${cookies["keychain_id"]}/close`
      )
      .then((response) => {
        // response status code is between 200-299
        // the only response that would come through is 200 (HTTP OK)
        console.log(response.data.data);

        // deletes all cookies stored in local storage
        removeCookie("kreative_id_key");
        removeCookie("keychain_id");
        removeCookie("id_ksn");
        removeCookie("id_email");
        removeCookie("id_fname");
        removeCookie("id_lname");
        removeCookie("id_picture");

        // redirects the user to the logout confirmation page
        // TODO: make a better logout confirmation page
        window.location.href = "/logged-out";
      })
      .catch((error) => {
        // error response status code is above 300+
        console.log(error);

        // gets the status code of the error through the response
        // we check to see if the status code exists as to not throw an error in case an error is thrown
        // that isn't actually sent by the server api, but rather from axios
        let statusCode;

        if (error.response.data.data.statusCode === undefined) {
          statusCode = error.response.data.data.statusCode;

          // for all of these errors we want to redirect the user to the error page with a cause
          if (statusCode === 403) {
            // bad request, probably the id was not passed or is not a number
            window.location.href = "/error?cause=badrequest";
          } else if (statusCode === 404) {
            // keychain not found using the id
            window.location.href = "/error?cause=notfound";
          } else if (statusCode === 500) {
            // internal server error
            window.location.href = "/error?cause=ise";
          } else {
            // some weird unknown error
            // this should not happen at all, so if it does there are critical issues
            window.location.href = "/error?cause=unknown";
          }
        } else {
          // if there is no error response status code then we have an "unknown error"
          // in most cases this is a connection error or some sort of axios error
          window.location.href = "/error?cause=unknown";
        }
      });
  };

  return (
    <>
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
            onClick={(e) => logout(e)}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
