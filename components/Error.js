import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ErrorComponent({ cause }) {
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("We ran into an issue");
  const [message, setMessage] = useState("Something");

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
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 md:max-w-3xl lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <Link href="/" className="inline-flex">
              <span className="sr-only">Kreative ID</span>
              <Image
                className="h-12 w-auto"
                src="https://cdn.kreativeusa.com/id/kreative-id.png"
                alt="Kreative ID logo in black and white"
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
                  href="/"
                  className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Go back home
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
