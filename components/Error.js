import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function ErrorComponent({ cause, aidn }) {
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("We ran into an issue");
  const [message, setMessage] = useState("Something");
  const [initiative, setInitiative] = useState("id");

  const errorAppQuery = useQuery({
    queryKey: ["errorApplication"],
    queryFn: async () => {
      // empty response variable to store api response
      let response;

      try {
        // gets non verbose application information based on the aidn
        response = await axios.get(
          `https://id-api.kreativeusa.com/v1/applications/${aidn}`
        );
      } catch (error) {
        // some sort of error, statusCode is not between 200-299
        console.log(error.message);
        throw new Error(error);
      }

      // returns the application object on the data.data key
      return response.data.data.application;
    },
    onSuccess: (data) => {
      const words = data.name.split(" ");
      
      if (words.length === 1) setInitiative(words[0].toLowerCase());
      else setInitiative(words[1].toLowerCase());
    },
    enabled: true,
  });

  // handles setting the title and message based on the error cause
  useEffect(() => {
    // resets the default title message for the error component
    setTitle("We ran into an issue");

    if (cause === "ise") {
      setTag("Internal Server Error");
      setMessage(
        "Something went wrong with our server or website. Please try again soon, our team will be working to fix Kreative ID."
      );
    } else if (cause === "permissions") {
      setTag("Inadequete Permissions");
      setTitle("Your account doesn't have access");
      setMessage(
        "The resource you are trying to access requires permissions that your account doesn't have."
      );
    } else if (cause === "unknown") {
      setTag("Unknown Error");
      setMessage(
        "Unfortunately, our system cannot identify the exact issue. Please try again soon."
      );
    } else if (cause === "badrequest") {
      setTag("Bad Request Error");
      setMessage(
        "There has been an issue with our internal applications. Please try again soon."
      );
    } else if (cause === "notfound") {
      setTag("Not Found Error");
      setMessage(
        "The system we use to authenticate you and verify your account is using an invalid 'keychain'. Please try again soon."
      );
    }
  }, [cause, aidn]);

  return (
    <div>
      {errorAppQuery.isError && (
        <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
          <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 md:max-w-3xl lg:px-8">
            <div className="flex flex-shrink-0 justify-center">
              <Link href="/" className="inline-flex">
                <span className="sr-only">Kreative ID</span>
                <Image
                  className="h-12 w-auto"
                  width={400}
                  height={100}
                  src="https://cdn.kreativeusa.com/id/kreative-id.png"
                  alt="Kreative ID logo in black and white"
                />
              </Link>
            </div>
            <div className="py-16">
              <div className="text-center">
                <p className="text-base font-semibold text-red-600">
                  Something went terribly wrong...
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                  Uh oh. The page to show you an error broke :/
                </h1>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Go back to Kreative ID homepage
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
      {errorAppQuery.isSuccess && (
        <div>
          <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
            <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 md:max-w-3xl lg:px-8">
              <div className="flex flex-shrink-0 justify-center">
                <Link
                  href={errorAppQuery.data.homepage}
                  className="inline-flex"
                >
                  <span className="sr-only">Application Logo</span>
                  <Image
                    className="h-12 w-auto"
                    height={150}
                    width={400}
                    src={errorAppQuery.data.logoUrl}
                    alt="Redirecting application logo in color"
                  />
                </Link>
              </div>
              <div className="py-16">
                <div className="text-center">
                  <p className="text-base font-semibold text-red-600">{tag}</p>
                  <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                    {title}
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">{message}</p>
                  <div className="mt-6">
                    <Link
                      href={errorAppQuery.data.homepage}
                      className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Go back to {errorAppQuery.data.name} homepage
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                  <div className="mt-2">
                    <Link
                      href={`https://support.kreativeusa.com/${initiative}`}
                      className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Submit an issue with {errorAppQuery.data.name} support
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
