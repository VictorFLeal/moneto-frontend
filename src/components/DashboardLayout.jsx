import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from '../pages/dashboard/Dashboard'
import Chat from '../pages/dashboard/Chat'
import Transactions from '../pages/dashboard/Transactions'
import Goals from '../pages/dashboard/Goals'
import Reports from '../pages/dashboard/Reports'
import Calendar from '../pages/dashboard/Calendar'
import Notifications from '../pages/dashboard/Notifications'
import Settings from '../pages/dashboard/Settings'
import Debts from '../pages/dashboard/Debts'
import Business from '../pages/dashboard/Business'
import TransactionModal from './TransactionModal'
import Reservas from '../pages/dashboard/Reservas'

export default function DashboardLayout() {
  const [modalOpen, setModalOpen]   = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={styles.app}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.main}>
        <Header
          onAddTx={() => setModalOpen(true)}
          onMenuClick={() => setSidebarOpen(v => !v)}
        />
        <div style={styles.content}>
          <Routes>
            <Route index                  element={<Dashboard onAddTx={() => setModalOpen(true)} />} />
            <Route path="chat"            element={<Chat />} />
            <Route path="transactions"    element={<Transactions onAddTx={() => setModalOpen(true)} />} />
            <Route path="goals"           element={<Goals />} />
            <Route path="reports"         element={<Reports />} />
            <Route path="calendar"        element={<Calendar />} />
            <Route path="notifications"   element={<Notifications />} />
            <Route path="settings"        element={<Settings />} />
            <Route path="debts"           element={<Debts />} />
            <Route path="business"        element={<Business />} />
            <Route path="reservas"        element={<Reservas />} />
          </Routes>
        </div>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

const styles = {
  app: { display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
  content: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 99,
  },
  '@media(max-width:768px)': {
    content: { padding: '16px' },
  }
}