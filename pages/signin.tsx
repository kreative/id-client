import Head from "next/head";
import Signin from "../components/Signin";

export default function SigninPage() {
  return (
    <>
      <Head>
        <title>Sign In | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Signin />
    </>
  );
}
