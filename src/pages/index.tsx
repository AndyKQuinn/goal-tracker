import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useUser } from "@auth0/nextjs-auth0";
import Link from 'next/link';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  if (user) {
    return (
      <div>
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/api/auth/logout">Log Out</Link>
          </li>
        </ul>
        <h2 className="text-2xl underline">
          Hello, {user.name}
        </h2>
      </div>
    )
  }

  return (
    <>
      <div>
        Welcome to my thing that will eventually be a better thing
      </div>
      <Link href="/api/auth/login">Login</Link>
    </>
  )
};

export default IndexPage;
