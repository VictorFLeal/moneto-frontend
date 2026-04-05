import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

// Pages
import Dashboard from '../pages/dashboard/Dashboard'
import Chat from '../pages/dashboard/Chat'
import Transactions from '../pages/dashboard/Transactions'
import Goals from '../pages/dashboard/Goals'
import Reports from '../pages/dashboard/Reports'
import Calendar from '../pages/dashboard/Calendar'
import Notifications from '../pages/dashboard/Notifications'
import Settings from '../pages/dashboard/Settings'

// Modal
import TransactionModal from './TransactionModal'

export default function DashboardLayout() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={styles.app}>
      <Sidebar />
      <div style={styles.main}>
        <Header onAddTx={() => setModalOpen(true)} />
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
          </Routes>
        </div>
      </div>
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px 32px',
  },
}