import Head from "next/head";
import { useRouter } from "next/router";
import { useAtom } from "jotai";

import AdminNavbarComponent from "@/components/admin/AdminNavbar";
import SingleApp from "@/components/admin/apps/SingleApp";

import { appDataStore } from "@/stores/appDataStore";
import Authenticate from "@/components/Authenticate";

// any of the permissions that would allow the user to continue using the application
const adminPermissions = ["KREATIVE_ID_ADMIN", "KREATIVE_ID_DEVELOPER"];

export default function SingleAppAdminPage() {
  const { aidn } = useRouter().query;
  const [appData] = useAtom(appDataStore);

  return (
    <Authenticate permissions={adminPermissions}>
      <Head>
        <title>{appData.name} | Apps | Admin | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <AdminNavbarComponent />
          <SingleApp aidn={aidn} />
        </div>
      </main>
    </Authenticate>
  );
}
