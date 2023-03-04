import wretch from "wretch";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";

import { accountStore } from "@/stores/accountStore";

// the identifier for kreative id, either test or prod version
const AIDN = process.env.NEXT_PUBLIC_AIDN;
// the secret appchain for kreative id, production
const APPCHAIN = process.env.NEXT_PUBLIC_APPCHAIN;

// this component will serve as custom "middleware" to authenticate certain pages
// essentially, it will take all page components as children
// the function will run the authentication, and once it has passed will display children
// if the authentication fails, it will either handle it or redirect the user
export default function AuthenticateComponent({ children, permissions }) {
  // this sets default state to not authenticate so that the function won't render until useEffect has run
  const [authenticated, setAuthenticated] = useState(false);
  // the single cookie we need for this function, stores the key for the user
  const [cookies, setCookie] = useCookies(["kreative_id_key", "keychain_id"]);
  // global state for the account data
  const [account, setAccount] = useAtom(accountStore);

  // in every Kreative application, this sort of function has to take place before
  // the actual business logic occurs, as there needs to be an authenticated user
  React.useEffect(() => {
    const authenticate = () => {
      // gets cookies on the client side, if none are found, return false
      if (cookies.kreative_id_key === undefined) {
        // takes the user to the sign in page since there is no key
        window.location.href = `/signin?aidn=${AIDN}`;
      } else {
        // gets the key from cookie and parses it as a string for the POST request
        const keyFromCookie = cookies.kreative_id_key;

        // runs a verify keychain request on the API
        wretch("https://id-api.kreativeusa.com/v1/keychains/verify")
          .post({
            key: keyFromCookie,
            aidn: parseInt(AIDN),
            appchain: APPCHAIN,
          })
          .unauthorized((error) => {
            // unauthorized exception, meaning that the keychain is expired
            // relocates to signin page with the callback for 'Kreative ID Test'
            window.location.href = `/signin?aidn=${AIDN}&message=${error.message}`;
          })
          .forbidden((error) => {
            // aidn given is not the same as the one on the keychain
            // this is a weird error that would even happen, so we will just reauthenticate the user
            // relocates to signin page with the callback for 'Kreative ID Test'
            window.location.href = `/signin?aidn=${AIDN}&message=${error.message}`;
          })
          .internalError((error) => {
            // since there is something on the server side that isn't working reauthenticating wont work
            // instead we will redirect the user to an auth error page
            window.location.href = `/error?cause=ise&aidn=${AIDN}&message=${error.message}`;
          })
          .json((response) => {
            const account = response.data.account;
            const keychain = response.data.keychain;
            const userPermissions = account.permissions;

            // checks if the user has the same permissions as required by the application
            // in other Kreative applications this will have to be manually configured based on number of permissions
            if (
              !(
                userPermissions.includes(permissions[0]) ||
                userPermissions.includes(permissions[1])
              )
            ) {
              // user does not have the correct permissions to continue
              // we can't just say the user isn't authenticated, because they are, they just don't have the correct permissions
              // FOR NOW we will handle the error by redirecting the user to the error page with a query param for the error
              window.location.href = `/error?cause=permissions&aidn=${AIDN}`;
            } else {
              // since we can't add headers, since we are executing this on the client side, we will just setup new cookies
              setCookie("keychain_id", keychain.id, {
                secure: true,
                sameSite: "strict",
                path: "/",
              });

              // we set the account data in the global state so that the application can access it anywhere
              setAccount(account);

              // once all operations are completed, we set authenticated to true
              setAuthenticated(true);
            }
          })
          .catch((error) => {
            // some sort of unknown error, possibly on the client side itself
            window.location.href = `/error?cause=unknown&aidn=${AIDN}&message=${error.message}`;
          });
      }
    };

    authenticate();
  }, [cookies.keychain_id, cookies.kreative_id_key]);

  return <div>{authenticated && <div>{children}</div>}</div>;
}
