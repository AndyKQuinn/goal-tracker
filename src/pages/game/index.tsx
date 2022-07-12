import Image from 'next/image'
import dragonHeadImage from '~/images/dragon_head.jpg'
import Router from 'next/router'

export default function GamePage() {
  return (
    <div className="h-full bg-black">
      <div className="p-1 pt-4 font-mono text-3xl font-bold text-center text-red-600 bg-gradient-to-b from-grey-800 to-coal">
        <div>
          Legend of the Red Dragon
        </div>
        <button
          className="mt-6 text-2xl tracking-wider text-white bg-purple-600 btn"
          onClick={() => Router.push('/game/home')}
        >
          Play
        </button>
      </div>
      <Image
        src={dragonHeadImage}
        alt="dragon_image"
        className="bg-fixed"
      />
    </div>
  )
}
