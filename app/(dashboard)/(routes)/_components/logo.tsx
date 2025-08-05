import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
      <div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className="cursor-pointer"
          />
    </div>
  )
}

export default Logo