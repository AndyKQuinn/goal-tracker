import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <div className="p-4 m-4 mb-10 text-2xl tracking-wider text-center text-white">
        Welcome to my thing, that will eventually be something interesting!
      </div>
      <div className="text-center">
        <Link href="/api/auth/login">
          <button className="p-4 px-6 text-2xl text-white bg-purple-600 btn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
