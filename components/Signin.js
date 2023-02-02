import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import AlertComponent from "./Alert";
import Wallpaper from "./Wallpaper";

function SigninFunction({ appData }) {
  const router = useRouter();

  // api data variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [key, setKey] = useState();

  // page element variables
  const [title, setTitle] = useState("Sign in to your account");
  const [subtitle, setSubtitle] = useState(`to continue to ${appData.name}`);
  const [formStyles, setFormStyles] = useState("mt-8");
  const [goBackStyles, setGoBackStyles] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyles, setAlertStyles] = useState("hidden");
  
  // regex expression for checking if a string is a valid email address
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  React.useEffect(() => {
    // used to allow for checkbox changes
    if (router.query.a === "true") setRememberMe(true);
  }, [router.query.a]);

  const handleCheckedChange = (e) => setRememberMe(!rememberMe);

  const changeAlert = (message) => {
    setAlertMessage(message);
    setAlertStyles("");
  };

  const createSigninInstance = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();

    // removes any displayed alerts
    setAlertStyles("hidden");

    // verify that all the fields we want are not empty strings
    // if anyone of them are empty, error is shown
    if (email === "" || password === "") {
      changeAlert("Please make sure all fields are filled out");
      return;
    }

    // make sure that the email entered is actually an email
    // shows error if the string test doesn't pass
    if (!regexExp.test(email)) {
      changeAlert("Please enter a valid email address");
      return;
    }

    // makes post request for the signin api
    axios
      .post("https://id-api.kreativeusa.com/v1/accounts/signin", {
        aidn: parseInt(appData.aidn),
        email,
        password,
      })
      .then((response) => {
        // information passed
        setFormStyles("hidden");
        setGoBackStyles("mt-8");
        setKey(response.data.data.keychain.key);
        setTitle(`Welcome back, ${response.data.data.account.firstName}`);
        setSubtitle(
          `You're ready to go back to ${appData.name} and continue your experience`
        );
      })
      .catch((error) => {
        // retrieves the statusCode from error object
        const statusCode = error.response.data.statusCode;
        // finds and sets the message from error object
        const message = error.response.data.message;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          if (statusCode === 400 && message === "email must be an email") {
            changeAlert("Please enter a valid email address");
          } else {
            changeAlert("Internal server error. Try again soon.");
          }
        } else if (statusCode === 404) {
          // no account found with the given email
          changeAlert("No account found with the given email");
        } else if (statusCode === 403 || statusCode === 401) {
          // incorrect credentials
          // 401 means unauthorized, we need to FIX this from the server side response
          changeAlert("Password or email incorrect");
        } else {
          // some sort of unknown error on the client side
          console.log(error);
          changeAlert("Internal application error. Try again soon.");
        }
      });
  };

  const goBack = (e) => {
    e.preventDefault();
    window.location.href = `${appData.callbackUrl}?key=${key}`;
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-8 w-auto"
                src="/kreative-id.png"
                alt="Kreative ID logo in color"
                height={1000}
                width={100}
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-2 text-md text-gray-600">{subtitle}</p>
            </div>
            <div id="alert" className={alertStyles}>
              <AlertComponent message={alertMessage} />
            </div>
            <div id="signin-form" className={formStyles}>
              <div className="mt-6">
                <form className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        value={email}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        value={password}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        checked={rememberMe}
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => handleCheckedChange(e)}
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href={`/forgot_password?aidn=${appData.aidn}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={(e) => createSigninInstance(e)}
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
              <p className="mt-2 pt-2 text-center text-sm text-gray-600">
                Need an account?{" "}
                <Link
                  href={`/signup?aidn=${appData.aidn}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up here{" "}
                </Link>
              </p>
            </div>
            <div id="go-back-button" className={goBackStyles}>
              <div>
                <button
                  onClick={(e) => goBack(e)}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Wallpaper />
        </div>
      </div>
    </>
  );
}

export default function SigninComponent() {
  const router = useRouter();
  const { aidn } = router.query;
  const [appData, setAppData] = useState();

  React.useEffect(() => {
    let mounted = true;

    if (!aidn) return;

    const setAppVariables = async () => {
      axios
        .get(`https://id-api.kreativeusa.com/v1/applications/${aidn}`)
        .then((response) => {
          setAppData({
            aidn: response.data.data.application.aidn,
            name: response.data.data.application.name,
            callbackUrl: response.data.data.application.callbackUrl,
          });
          return () => (mounted = false);
        })
        .catch((error) => {
          // unknown error
          console.log(error);
        });
    };

    // sets variables from applications api
    setAppVariables();
  }, [aidn]);

  return <div>{appData && <SigninFunction appData={appData} />}</div>;
}
