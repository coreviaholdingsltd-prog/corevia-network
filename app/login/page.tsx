export default function Login() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Corevia Network</h1>
        <p className="mt-2 text-gray-600">Sign in to your member account.</p>

        <form className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-[#12352c] px-4 py-3 font-semibold text-white"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-semibold text-[#12352c]">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}