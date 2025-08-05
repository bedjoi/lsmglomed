import React from 'react'
import Logo from './logo'
import SidebarRoutes from './sidebard-routes'

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col  border-r overflow-y-auto bg-white shadow-sm" >
      <div className="px-6 py-5 border-b shadow-sm bg-gray-100">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar