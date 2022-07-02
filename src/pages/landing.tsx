import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <div className="p-2">
        Welcome to my thing that will eventually be something interesting
      </div>
      <div className="text-center">
        <Link href="/api/auth/login">
          <button className="bg-gray-200 btn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
