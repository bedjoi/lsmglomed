import React from 'react'
import Logo from './logo'

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col  border-r overflow-y-auto bg-white shadow-sm" >
      <div className="p-6">
        <Logo />
      </div>
    </div>
  )
}

export default Sidebar