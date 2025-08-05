import React from 'react'
import Logo from './logo'

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col  border-r overflow-y-auto bg-white shadow-sm" >
      <div className="p-6 border-b shadow-sm bg-gray-100">
        <Logo />
      </div>
    </div>
  )
}

export default Sidebar