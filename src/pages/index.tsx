// import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useUser } from '@auth0/nextjs-auth0';
import Track from './track';
import Landing from './landing';

const IndexPage: NextPageWithLayout = () => {
  // const utils = trpc.useContext();

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  if (user) return <Track />;
  return <Landing />;
};

export default IndexPage;
