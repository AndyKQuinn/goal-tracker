// import { trpc } from '../../utils/trpc';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import profilePic from '../../images/profile.jpg'

export default function Profile() {
  const { user } = useUser();
  const {
    nickname,
    name,
    // picture,
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
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Profile
      </div>
      <div className="p-2 pl-4 text-2xl text-center">
        <div className="p-2 mb-2 text-white">
          NickName
        </div>
        <div className="text-2xl form-input">{nickname}</div>
        <div className="p-4 text-white">
          Name
        </div>
        <div className="text-2xl form-input">
          {name}
        </div>
        <div className="p-4 text-center text-white">
          Email
        </div>
        <div className="text-2xl form-input">
          {email}
        </div>
        <div className="p-4 text-white">
          Sub
        </div>
        <div className="tracking-wider text-md form-input">
          {sub}
        </div>
        <div className="p-4 text-white">
          Image
        </div>
        <div className="text-center">
          <Image height={200} width={200} src={profilePic} alt="Profile Pic" />
        </div>
      </div>
    </>
  );
}
