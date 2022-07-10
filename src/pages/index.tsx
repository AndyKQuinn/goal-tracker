import { NextPageWithLayout } from './_app'
import { useUser } from '@auth0/nextjs-auth0'
import Track from './track'
import Landing from './landing'

const IndexPage: NextPageWithLayout = () => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (user) return <Track />
  
  return <Landing />
}

export default IndexPage
