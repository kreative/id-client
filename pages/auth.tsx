import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

// this is the callback page that Kreative ID (public authentication part) will go to after a successful auth flow
// this means that this page is in charge of taking the key=XXX from the query parameters and creating a cookie with it
// as a result, no middleware will be on this page, instead this page will take the key, add a cookie, and then redirect to the admin page
// there, the admin page will have it's middleware go through the auth verification flow
export default function AuthPage() {
  const router = useRouter();
  const { key } = router.query;
  const [cookies, setCookie] = useCookies(["kreative_id_key"]);

  useEffect(() => {
    // ?? we never use this again, but it works, should we take it out ??
    let mounted = true;

    // nothing happens unless the key query param loads
    if (!key) return;

    // function that executes business logic for callback auth flow
    const executeCallback = async () => {
      // adds the cookie for the client side
      setCookie("kreative_id_key", key, { secure: true, sameSite: "strict" });
      // redirects to the admin page for authentication flow to continue
      window.location.href = "/admin";
    };

    // takes the given key and creates a new cookie, then redirects user to admin page
    executeCallback();
  }, [key]);

  return (
    <>
      <Head>
        <title>Authenticating | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="pt-6 text-center text-gray-400">
          We are signing you in... you should be redirected soon.
        </h1>
      </main>
    </>
  );
}
