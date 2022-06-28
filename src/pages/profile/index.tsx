import { trpc } from '../../utils/trpc';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import profilePic from '../../images/profile.jpg'

export default function Profile() {
  const { user } = useUser();
  const {
    nickname,
    name,
    picture,
    email,
    sub
  } = user || {
    nickname: '',
    name: '',
    picture: '',
    email: '',
    sub: '',
  }

  console.log("User: ", user)
  return (
    <>
      <div className="p-2 text-2xl text-center bg-blue-300">
        Profile
      </div>
      <div className="p-2 pl-4">
        <div>Nickname: {nickname} </div>
        <div>Name: {name}</div>
        <div>
          Image: {' '}
          <Image height={50} width={50} src={picture || profilePic} alt="Profile Pic" />
        </div>
        <div>Email: {email} </div>
        <div>ID (sub): {sub} </div>
      </div>
    </>
  );
}
