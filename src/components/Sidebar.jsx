import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { section: 'Principal' },
  { path: '/dashboard',              icon: '📊', label: 'Dashboard' },
  { path: '/dashboard/chat',         icon: '🤖', label: 'Falar com a IA', badge: 'IA' },
  { path: '/dashboard/transactions', icon: '💳', label: 'Transações' },
  { section: 'Gestão' },
  { path: '/dashboard/goals',        icon: '🎯', label: 'Metas' },
  { path: '/dashboard/reports',      icon: '📈', label: 'Relatórios' },
  { path: '/dashboard/calendar',     icon: '📅', label: 'Calendário' },
  { section: 'Conta' },
  { path: '/dashboard/notifications',icon: '🔔', label: 'Notificações', badge: '3' },
  { path: '/dashboard/settings',     icon: '⚙️', label: 'Configurações' },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside style={styles.sidebar}>

      {/* Logo */}
      <div style={styles.logo}>
        Mon<span style={{ color: 'var(--accent)' }}>.</span>eto
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {navItems.map((item, i) => {
          if (item.section) return (
            <div key={i} style={styles.section}>{item.section}</div>
          )

          const active = isActive(item.path)
          return (
            <div
              key={item.path}
              style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
              onClick={() => navigate(item.path)}
            >
              {active && <div style={styles.activePill} />}
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={styles.badge}>{item.badge}</span>
              )}
            </div>
          )
        })}
      </nav>

      {/* User */}
      <div style={styles.userWrap}>
        <div style={styles.userPill}>
          <div style={styles.userAvatar}>VS</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Victor</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>victor@email.com</div>
          </div>
          <span style={styles.planBadge}>Pro</span>
        </div>
      </div>

    </aside>
  )
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    flexShrink: 0,
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    padding: '20px 24px 16px',
    fontFamily: 'Syne, sans-serif',
    fontSize: 22, fontWeight: 800,
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  section: {
    padding: '16px 20px 6px',
    fontSize: 11, fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 20px',
    margin: '2px 8px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14, fontWeight: 500,
    color: 'var(--muted)',
    transition: 'all 0.18s',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(46,99,232,0.15)',
    color: 'var(--white)',
    fontWeight: 600,
  },
  activePill: {
    position: 'absolute',
    left: -8, top: '20%', bottom: '20%',
    width: 3,
    background: 'var(--blue)',
    borderRadius: '0 3px 3px 0',
  },
  navIcon: { fontSize: 17, width: 20, textAlign: 'center', flexShrink: 0 },
  badge: {
    background: 'var(--blue)',
    color: '#fff',
    fontSize: 10, fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
  },
  userWrap: {
    padding: '12px 8px',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  userPill: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 13, flexShrink: 0,
  },
  planBadge: {
    fontSize: 10, fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'var(--accent)',
    background: 'rgba(74,240,196,0.1)',
    border: '1px solid rgba(74,240,196,0.2)',
    padding: '2px 8px', borderRadius: 20,
  },
}