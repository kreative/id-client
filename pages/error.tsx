import Head from "next/head";
import Image from "next/image";
import ErrorComponent from "@/components/Error";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();
  const { cause, aidn } = router.query;

  return (
    <div className="h-screen">
      <Head>
        <title>Error | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-5/6 w-full">
        <div >
          {cause && aidn && <ErrorComponent cause={cause} aidn={aidn} />}
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
          <p className="text-sm leading-7 text-gray-400">
            &copy; 2023 Kreative, LLC. All rights reserved.
          </p>
          <div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-gray-200" />
          <div className="flex gap-x-4">
            <Image
              className="h-6 w-auto"
              height={50}
              width={100}
              src="https://cdn.kreativeusa.com/id/kreative-id-gray.png"
              alt="Kreative ID logo in gray"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
