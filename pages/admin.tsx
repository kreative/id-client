import Head from "next/head";

import Authenticate from "../components/Authenticate";
import AdminComponent from "../components/Admin";

// any of the permissions that would allow the user to continue using the application
const adminPermissions = ["KREATIVE_ID_ADMIN", "KREATIVE_ID_DEVELOPER"];

// we should be getting user data in the NextRequest object
// this would come from the middleware that is authenticating user information
// the Next middleware should take care of any and all authentication, this means that in this file
// we can just go ahead and serve the user what they need
export default function AdminPage() {
  return (
    <Authenticate permissions={adminPermissions}>
      <Head>
        <title>Admin | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AdminComponent />
      </main>
    </Authenticate>
  );
}
