export default function ForgotPassword() {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-7 w-auto"
                src="/kreative-id.png"
                alt="Kreative ID logo in color"
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                for your account and continue to your application
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form className="mt-8 space-y-6" action="#" method="POST">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div className="mb-6">
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <p className="mt-2 pt-2 text-center text-sm text-gray-600">
                Got your password?{" "}
                <a
                  href="/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in!{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
