import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import zxcvbn from "zxcvbn";

import AlertComponent from "./Alert";
import Wallpaper from "./Wallpaper";
import ProgressBarComponent from "./ProgressBar";

function ForgotPasswordFunction({ appData }) {
  // api data variables
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [ksn, setKsn] = useState("");

  // password strength analyzer progress bar states
  const [passwordScore, setPasswordScore] = useState(0);
  const [barWrapperClass, setBarWrapperClass] = useState("pb-3 hidden");
  const [barMessage, setBarMessage] = useState("");
  const [progressClass, setProgressClass] = useState("");
  const [barWidthName, setBarWidthName] = useState("");
  const [textClass, setTextClass] = useState("gray-500");

  // page element variables
  const [title, setTitle] = useState("Reset your password");
  const [subtitle, setSubtitle] = useState(
    `for your account and continue to ${appData.name}`
  );
  const [formStyles, setFormStyles] = useState("mt-8");
  const [findAccountStyles, setFindAccountStyles] = useState(
    "-space-y-px rounded-md shadow-sm"
  );
  const [verifyCodeStyles, setVerifyCodeStyles] = useState("hidden");
  const [newPasswordStyles, setNewPasswordStyles] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyles, setAlertStyles] = useState("hidden");
  const [goBackStyles, setGoBackStyles] = useState("hidden");

  // regex expression for checking if a string is a valid email address
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  const changeAlert = (message) => {
    setAlertMessage(message);
    setAlertStyles("");
  };

  const changeProgressBar = (message, progressClass, widthName, textClass) => {
    // sets the state for the different variables for the progress bar
    setBarMessage(message);
    setProgressClass(progressClass);
    setBarWidthName(widthName);
    setTextClass(textClass);
  };

  const handlePasswordInput = (passwordInput) => {
    // hides the progress bar if there is no password entered
    if (passwordInput.length != 0) setBarWrapperClass("pb-3");
    else setBarWrapperClass("pb-3 hidden");

    // updates the password in react state
    setPassword(passwordInput);

    // get the score of the password and sets it to state
    const score = zxcvbn(password).score;
    setPasswordScore(score);

    // changes progress bar strength based on score
    if (passwordScore === 0 || passwordScore === 1) {
      changeProgressBar(
        "Password weak",
        "h-2.5 w-4/12 rounded-full bg-red-600",
        "20%",
        "text-sm text-red-600"
      );
    } else if (passwordScore === 2) {
      changeProgressBar(
        "Password almost there",
        "h-2.5 w-8/12 rounded-full bg-yellow-500",
        "75%",
        "text-sm text-yellow-500"
      );
    } else if (passwordScore === 3 || passwordScore === 4) {
      changeProgressBar(
        "Strong password",
        "h-2.5 w-12/12 rounded-full bg-green-700",
        "100%",
        "text-sm text-green-700"
      );
    }
  };

  const findAccount = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();
    // removes any displayed alerts
    setAlertStyles("hidden");

    // makes sure that the email field is filled out
    if (email === "") {
      changeAlert("Please make sure to enter an email");
      return;
    }

    // makes sure that the email entered is a valid email
    if (!regexExp.test(email)) {
      changeAlert("Please make sure to enter a valid email");
      return;
    }

    // makes post request to create a reset code
    axios
      .post("https://id-api.kreativeusa.com/v1/accounts/resetCode/send", {
        email,
      })
      .then((response) => {
        setFindAccountStyles("hidden");
        setVerifyCodeStyles("-space-y-px rounded-md shadow-sm");
        setKsn(response.data.data.accountChange.ksn);
        setTitle(`Verify your reset code`);
        setSubtitle(
          `We sent a six-digit reset code to your email at ${email}. Enter it below to continue.`
        );
      })
      .catch((error) => {
        // sets and finds the statuscode from the error object
        const statusCode = error.response.data.statusCode;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          changeAlert("Internal server error. Try again soon.");
        } else if (statusCode === 404) {
          // the account was not found
          changeAlert("No account found from this email.");
        } else {
          // some sort of unknown error on the client side
          console.log(error);
          changeAlert("Internal application error. Try again soon.");
        }
      });
  };

  const verifyCode = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();
    // removes any displayed alerts
    setAlertStyles("hidden");

    // makes sure the reset code field is not empty
    if (resetCode === "") {
      changeAlert("Please enter a reset code");
      return;
    }

    // makes post request to create a reset code
    axios
      .post(
        `https://id-api.kreativeusa.com/v1/accounts/${ksn}/resetCode/verify`,
        {
          resetCode: parseInt(resetCode),
        }
      )
      .then((response) => {
        setVerifyCodeStyles("hidden");
        setNewPasswordStyles("-space-y-px rounded-md shadow-sm");
        setTitle(`Create your new password`);
        setSubtitle(`And continue your experience at ${appData.name}`);
      })
      .catch((error) => {
        // sets and finds the statuscode from the error object
        const statusCode = error.response.data.statusCode;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          if (statusCode === 400 && message === "email must be an email") {
            changeAlert("Please enter a valid email address");
          } else {
            changeAlert("Internal server error. Try again soon.");
          }
        } else if (statusCode === 403) {
          // reset code that was given is incorrect
          changeAlert("Reset code given is incorrect, try again.");
        } else {
          // some sort of unknown error on the client side
          console.log(error);
          changeAlert("Internal application error. Try again soon.");
        }
      });
  };

  const createNewPassword = (e) => {
    // restricts page refresh on button click
    e.preventDefault();
    // removes any displayed alerts
    setAlertStyles("hidden");

    // makes sure that the password is strong enough
    if (passwordScore < 3) {
      changeAlert("Please make your password stronger");
      return;
    }

    // verifys that the password and confirmed password are correct
    if (!(password === cPassword)) {
      changeAlert("Passwords do not match.");
    } else {
      // creates a new post request to reset an account password
      axios
        .post(
          `https://id-api.kreativeusa.com/v1/accounts/${ksn}/resetPassword`,
          {
            password,
          }
        )
        .then((response) => {
          setFormStyles("hidden");
          setGoBackStyles("mt-8");
          setTitle(`You're all set to sign in`);
          setSubtitle(`Sign in and continue to ${appData.name}`);
        })
        .catch((error) => {
          // sets and finds the statuscode from error object
          const statusCode = error.response.data.statusCode;

          if (statusCode === 500 || statusCode === 400) {
            // 500: internal server error, 400: bad schema
            changeAlert("Internal server error. Try again soon.");
          } else {
            // some sort of unknown error on the client side
            console.log(error);
            changeAlert("Internal application error. Try again soon.");
          }
        });
    }
  };

  const goBack = (e) => {
    e.preventDefault();
    window.location.href = `/signin?aidn=${appData.aidn}`;
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-8 w-auto"
                src="https://cdn.kreativeusa.com/id/kreative-id.png"
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
            <div id="main-form-area" className={formStyles}>
              <div className="mt-6">
                <form autoComplete="ignore" className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div id="find-account" className={findAccountStyles}>
                    <div className="mb-6">
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
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <button
                        onClick={(e) => findAccount(e)}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Reset password
                      </button>
                    </div>
                  </div>
                  <div id="verify-code" className={verifyCodeStyles}>
                    <div className="mb-6">
                      <label htmlFor="email-address" className="sr-only">
                        Reset code
                      </label>
                      <input
                        id="reset-code"
                        value={resetCode}
                        name="resetCode"
                        type="text"
                        autoComplete="nope"
                        required
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="000000"
                        onChange={(e) => setResetCode(e.target.value)}
                      />
                    </div>
                    <div>
                      <button
                        onClick={(e) => verifyCode(e)}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Verify reset code
                      </button>
                    </div>
                  </div>

                  <div id="new-password" className={newPasswordStyles}>
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        value={password}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="New password"
                        onChange={(e) => handlePasswordInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Confirm password
                      </label>
                      <input
                        id="confirm-password"
                        value={cPassword}
                        name="confirm-password"
                        type="password"
                        autoComplete="confirm-password"
                        required
                        className="relative mb-3 block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Confirm password"
                        onChange={(e) => setCPassword(e.target.value)}
                      />
                    </div>
                    <div className={barWrapperClass}>
                      <ProgressBarComponent
                        widthName={barWidthName}
                        progressClass={progressClass}
                        textClass={textClass}
                        message={barMessage}
                      />
                    </div>
                    <div>
                      <button
                        onClick={(e) => createNewPassword(e)}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Set new password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <p className="mt-2 pt-2 text-center text-sm text-gray-600">
                Got your password?{" "}
                <Link
                  href={`/signin?aidn=${appData.aidn}`}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in{" "}
                </Link>
              </p>
            </div>
            <div id="go-back-button" className={goBackStyles}>
              <div>
                <button
                  onClick={(e) => goBack(e)}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Return to sign in
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

export default function ForgotPasswordComponent() {
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

  return <div>{appData && <ForgotPasswordFunction appData={appData} />}</div>;
}
