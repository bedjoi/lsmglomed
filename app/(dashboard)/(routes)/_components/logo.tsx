import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
      <div className="flex items-center justify-center space-x-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={30}
            className="cursor-pointer"
          />
          <Image
            src="/logoblack.png"
            alt="Logo"
            width={100}
            height={30}
            className="cursor-pointer"
          />
    </div>
  )
}

export default Logo