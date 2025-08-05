import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'
import Sidebar from './sidebar'

const MobileSidebar = () => {
  return (
      <div>
          <Sheet>
              <SheetTrigger className="md:hidden fixed pr-4 hover:opacity-75 transition-opacity z-50">
                  <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                  <Sidebar />
              </SheetContent>
          </Sheet>
    </div>
  )
}

export default MobileSidebar