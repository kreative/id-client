import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
  const [screenStyles, setScreenStyles] = useState("");
  const [formStyles, setFormStyles] = useState("mt-8");
  const [goBackStyles, setGoBackStyles] = useState("hidden");

  React.useEffect(() => {
    // used to allow for checkbox changes
    if (router.query.a === "true") setRememberMe(true);
  }, [router.query.a]);

  const handleCheckedChange = (e) => setRememberMe(!rememberMe);

  const createSigninInstance = (e) => {
    // prevents page refresh upon button click
    e.preventDefault();

    // makes post request for the signin api
    axios
      .post("https://id-api.kreativeusa.com/v1/accounts/signin", {
        aidn: parseInt(appData.aidn),
        email,
        password,
      })
      .then((response) => {
        // sets and finds the statuscode for the response
        const statusCode = response.data.statusCode;

        if (statusCode === 500 || statusCode === 400) {
          // 500: internal server error, 400: bad schema
          console.log(response);
        }
        if (statusCode === 403) {
          // incorrect credentials
          console.log(response);
        }
        if (statusCode === 200) {
          // information passed
          console.log("information passed");
          setFormStyles("hidden");
          setGoBackStyles("mt-8");
          setKey(response.data.data.keychain.key)
          setTitle(`Welcome back, ${response.data.data.account.firstName}`);
          setSubtitle(
            `You're ready to go back to ${appData.name} and continue your experience`
          );
        }
      })
      .catch((error) => {
        // some sort of unknown error
        console.log(error);
      });
  };

  const goBack = (e) => {
    e.preventDefault();
    window.location.href = `${appData.callbackUrl}?key=${key}`;
  };

  return (
    <>
      <div className={screenStyles}>
        <div className="flex min-h-screen">
          <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <img
                  className="h-7 w-auto"
                  src="/kreative-id.png"
                  alt="Kreative ID logo in color"
                />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
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
                        <a
                          href="/forgot_password"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot your password?
                        </a>
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
                  <a
                    href="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up here{" "}
                  </a>
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
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
              alt=""
            />
          </div>
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
    // for useEffects
    let mounted = true;

    // ensures nothing happens unless aidn is defined
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
        })
        .catch((error) => {
          // unknown error
          console.log(error);
        })
        .finally(() => {
          return () => (mounted = false);
        });
    };

    // sets variables from applications api
    setAppVariables();
  }, [aidn, appData]);

  return <div>{appData && <SigninFunction appData={appData} />}</div>;
}
