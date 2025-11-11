'use client'

import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        theme="light"
        expand
        toastOptions={{
          unstyled: false,
          classNames: {
            toast: 'bg-white shadow-lg border border-gray-200 !justify-center',
            title: '!text-center !w-full !block',
            description: '!text-center !w-full !block',
            error: '!bg-white !text-red-600 !border-red-200',
            success: '!bg-white !text-green-600 !border-green-200',
            warning: '!bg-white !text-yellow-600 !border-yellow-200',
            info: '!bg-white !text-blue-600 !border-blue-200',
          },
        }}
      />
      <style jsx global>{`
        [data-sonner-toast] {
          justify-content: center !important;
        }
        [data-sonner-toast] [data-title],
        [data-sonner-toast] [data-description] {
          text-align: center !important;
          width: 100% !important;
          display: block !important;
        }
      `}</style>
    </>
  )
}