import Head from "next/head";
import ErrorComponent from "@/components/Error";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();
  const { cause } = router.query;

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
        <div className="h-full">
          {cause && <ErrorComponent cause={cause} />}
        </div>
      </main>
    </>
  );
}
