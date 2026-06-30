import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import type { UserRole } from '@/types'

interface DashboardLayoutProps {
  role: UserRole
  children: React.ReactNode
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop)

  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const sidebarVariants = {
    open: { width: 256 },
    closed: { width: 64 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleSidebar={toggleSidebar} />

      {isDesktop ? (
        <motion.div
          variants={sidebarVariants}
          animate={sidebarOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] overflow-hidden"
        >
          <Sidebar
            role={role}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </motion.div>
      ) : (
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]"
              >
                <Sidebar
                  role={role}
                  open={true}
                  onClose={() => setSidebarOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          isDesktop ? (sidebarOpen ? 'pl-64' : 'pl-16') : 'pl-0'
        }`}
      >
        <div className="h-full overflow-y-auto p-6 pb-8">{children}</div>
      </main>
    </div>
  )
}
