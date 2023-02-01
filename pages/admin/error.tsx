import Head from "next/head";

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Error | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="pt-6 text-center text-lg">Applications cannot load. Pleae contact your administrator</h1>
      </main>
    </>
  );
}