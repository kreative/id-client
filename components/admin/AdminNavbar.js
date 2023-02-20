import Link from "next/link";
import Image from "next/image";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useAtom } from "jotai";

import { accountStore } from "@/stores/accountStore";

const AIDN = process.env.NEXT_PUBLIC_AIDN;
const APPCHAIN = process.env.NEXT_PUBLIC_APPCHAIN;

export default function AdminNavbarComponent() {
  // gets the global account data store
  const [account, setAccount] = useAtom(accountStore);
  // gets the cookies from local storage
  const [cookies, setCookie, removeCookie] = useCookies([
    "kreative_id_key",
    "keychain_id",
  ]);

  const logout = (e) => {
    // prevents default button click behavior
    e.preventDefault();

    // closes the keychain using id-api
    axios
      .post(
        `https://id-api.kreativeusa.com/v1/keychains/${cookies["keychain_id"]}/close`,
        {
          aidn: parseInt(AIDN),
          appchain: APPCHAIN,
        }
      )
      .then((response) => {
        // deletes all cookies stored in local storage
        removeCookie("kreative_id_key", { path: "/" });
        removeCookie("keychain_id", { path: "/" });

        // resets the global account data store
        setAccount({});

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

        if (error.response.data.statusCode === undefined) {
          statusCode = error.response.data.data.statusCode;

          // for all of these errors we want to redirect the user to the error page with a cause
          if (statusCode === 403) {
            // bad request, probably the id was not passed or is not a number
            window.location.href = `/error?cause=badrequest&aidn=${AIDN}`;
          } else if (statusCode === 404) {
            // keychain not found using the id
            window.location.href = `/error?cause=notfound&aidn=${AIDN}`;
          } else if (statusCode === 500) {
            // internal server error
            window.location.href = `/error?cause=ise&aidn=${AIDN}`;
          } else {
            // some weird unknown error
            // this should not happen at all, so if it does there are critical issues
            window.location.href = `/error?cause=unknown&aidn=${AIDN}`;
          }
        } else {
          // if there is no error response status code then we have an "unknown error"
          // in most cases this is a connection error or some sort of axios error
          window.location.href = `/error?cause=unknown&aidn=${AIDN}`;
        }
      });
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Link href="/admin/apps">
            <Image
              className="h-8 w-auto sm:h-12"
              src="https://cdn.kreativeusa.com/id/kreative-id.png"
              alt={"Kreative ID Logo in Black and White"}
              width={300}
              height={100}
            />
          </Link>
        </div>
        <div className="mt-4 flex space-x-8 md:mt-0 md:ml-4">
          <Link
            className="inline-block py-2 text-base font-medium text-black"
            href="/admin/apps"
          >
            Apps
          </Link>
          <Link
            className="inline-block py-2 text-base font-medium text-black"
            href="/admin/accounts"
          >
            Accounts
          </Link>
          <a
            className="inline-block py-2 text-base font-medium text-black"
            href="https://support.kreativeusa.com/id"
            target={"_blank"}
            rel={"noreferrer"}
          >
            Get Support
          </a>
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
