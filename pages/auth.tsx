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
  const { key } = router.query
  const [cookies, setCookie, removeCookie] = useCookies(["kreative_id_key"]);
  
  useEffect(() => {
    let mounted = true;
    
    // nothing happens unless the key query param loads
    if (!key) return;

    // function that executes business logic for callback auth flow
    const executeCallback = async () => {
      console.log("callback: hello");
      // adds the cookie for the client side
      setCookie("kreative_id_key", key, { secure: true });
      
      // verifies that the cookie is actually there (testing)
      if (cookies["kreative_id_key"] !== undefined) {
        window.location.href = `/admin`
      } else {
        console.log("somethings wrong...")
      }
    };

    // takes the given key and creates a new cookie, then redirects user to admin page
    executeCallback();
  }, [key]);

  return (
    <>
      <Head>
        <title>Authenticate | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Authentication Page</h1>
      </main>
    </>
  )
}