import { useState } from 'react'
import { LogOut, User } from 'lucide-react'
import Link from 'next/link'

export default function UserDropdown({ handleLogout }: { handleLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left border rounded-3xl">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-naija-green-600 transition font-semibold"
      >
        <User size={18} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <Link
              href="/user/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-naija-green-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-naija-green-100 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
