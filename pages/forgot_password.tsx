import Head from "next/head";
import ForgotPassword from "../components/ForgotPassword";

export default function forgotPassword() {
  return (
    <>
      <Head>
        <title>Forgot password | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ForgotPassword />
    </>
  );
}
