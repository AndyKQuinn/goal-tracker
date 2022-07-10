import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { GiQueenCrown } from 'react-icons/gi';

import { useUser } from '@auth0/nextjs-auth0'

export default function Nav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  router?.events?.on('routeChangeStart', () => setIsOpen(false))

  const { user } = useUser()
  console.log("User: ", user)

  return (
    <nav className="text-white from-purple-600 bg-gradient-to-r to-purple-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a>
                  <GiQueenCrown 
                    className="text-5xl"
                  />
                </a>
              </Link>
            </div>
            {user && <DesktopLinks />}
          </div>
          <div className="flex -mr-2 md:hidden">
            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-900 rounded-md hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <MobileView open={isOpen} />
    </nav>
  );
}

interface IMobileView {
  open: boolean
}

function MobileView(props: IMobileView) {
  const { open } = props
  return (
    <Transition
      show={open}
      enter="transition ease-out duration-100 transform"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
    {() => (
      <div className="md:hidden" id="mobile-menu">
        <div className="flex flex-col p-2 px-2 pt-2 pb-4 space-y-1 text-3xl text-center sm:px-3">
          <button className="p-2">
            <Link
              href="/"
              className="block font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
            >
              Track
            </Link>
          </button>
          <button className="p-4">
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-white rounded-md hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </button>
          <button className="p-4">
            <Link
              href="/profile"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
            >
              Profile
            </Link>
          </button>
          <button className="p-4">
            <Link
              href="/api/auth/logout"
              className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
            >
              Log Out
            </Link>
          </button>
        </div>
      </div>
    )}
  </Transition>
  )
}

function DesktopLinks() {
  return (
    <div className="hidden md:block">
      <div className="flex items-baseline ml-10 text-2xl tracking-wider space-x-7">
        <Link
          href="/"
          className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Track
        </Link>
        <Link
          href="/dashboard"
          className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Profile
        </Link>
        <Link
          href="/api/auth/logout"
          className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Logout
        </Link>
      </div>
    </div>
  )
}
