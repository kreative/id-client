import Head from "next/head";

import Authenticate from "../../../components/Authenticate";
import AdminNavbarComponent from "@/components/admin/AdminNavbar";

// any of the permissions that would allow the user to continue using the application
const adminPermissions = ["KREATIVE_ID_ADMIN", "KREATIVE_ID_DEVELOPER"];

export default function AccountsAdminHome(): JSX.Element {
  return (
    <Authenticate permissions={adminPermissions}>
      <Head>
        <title>Accounts | Admin | Kreative ID</title>
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
          <h1 className="text-2xl font-bold py-12 text-center">Accounts Admin coming soon</h1>
        </div>        
      </main>
    </Authenticate>
  )
}