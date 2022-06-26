import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <div className="p-2">
        Welcome to my thing that'll eventually be something interesting
      </div>
      <div className="p-2">
        For now, you track things and maybe it saves it? :shrug:
      </div>
      <div>
        <Link href="/api/auth/login">
          Login
        </Link>
      </div>
    </div>
  )
}
