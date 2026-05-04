import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ open, onClose }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem('moneto_user') || '{}')
  const plano     = user.plano || 'start'
  const isBusiness = plano === 'business'
  const isPro      = plano === 'pro' || plano === 'business'

  const navItems = [
    { section: 'Principal' },
    { path: '/dashboard',               icon: '📊', label: 'Dashboard' },
    { path: '/dashboard/chat',          icon: '🤖', label: 'Falar com a IA', badge: 'IA', locked: !isPro },
    { path: '/dashboard/transactions',  icon: '💳', label: 'Transações' },

    { section: 'Gestão' },
    { path: '/dashboard/goals',         icon: '🎯', label: 'Metas' },
    { path: '/dashboard/reservas',      icon: '💰', label: 'Cofrinho MONETO' }, // 🔥 NOVO
    { path: '/dashboard/reports',       icon: '📈', label: 'Relatórios' },
    { path: '/dashboard/calendar',      icon: '📅', label: 'Calendário' },

    { section: 'Ferramentas IA' },
    { path: '/dashboard/debts',         icon: '💸', label: 'Sair das Dívidas', badge: 'Pro', locked: !isPro },
    { path: '/dashboard/business',      icon: '🏢', label: 'Modo Empresa',     badge: 'Business', locked: !isBusiness },

    { section: 'Conta' },
    { path: '/dashboard/notifications', icon: '🔔', label: 'Notificações' },
    { path: '/dashboard/settings',      icon: '⚙️', label: 'Configurações' },
  ]

  const initials = user.nome
    ? user.nome.charAt(0).toUpperCase() + (user.sobrenome || '').charAt(0).toUpperCase()
    : 'U'

  function go(path, locked) {
    if (locked) {
      alert('Esta funcionalidade requer um plano superior. Vai às Configurações para fazer upgrade!')
      return
    }
    navigate(path)
    onClose()
  }

  return (
    <aside style={{ ...styles.sidebar, transform: `translateX(${open ? '0' : '-100%'})` }}>

      <div style={styles.logo}>
        MONETO
        <div style={styles.closeBtn} onClick={onClose}>✕</div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
        {navItems.map((item, i) => {
          if (item.section) {
            return <div key={i} style={styles.section}>{item.section}</div>
          }

          const active = location.pathname === item.path

          return (
            <div
              key={item.path}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
                ...(item.locked ? styles.navItemLocked : {}),
              }}
              onClick={() => go(item.path, item.locked)}
            >
              {active && <div style={styles.activePill} />}
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.locked && <span style={styles.lockIcon}>🔒</span>}
              {item.badge && !item.locked && (
                <span style={styles.badge}>{item.badge}</span>
              )}
            </div>
          )
        })}
      </nav>

      <div style={styles.userWrap}>
        <div style={styles.userPill}>
          <div style={styles.userAvatar}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {user.nome || 'Utilizador'}
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.email || ''}
            </div>
          </div>

          <span style={{
            ...styles.planBadge,
            color:
              plano === 'business'
                ? 'var(--accent2)'
                : plano === 'pro'
                ? '#a855f7'
                : 'var(--accent)'
          }}>
            {plano.charAt(0).toUpperCase() + plano.slice(1)}
          </span>
        </div>
      </div>

    </aside>
  )
}

const styles = {
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)'
  },
  logo: {
    padding: '20px 24px 16px',
    fontFamily: 'Syne, sans-serif',
    fontSize: 20,
    fontWeight: 800,
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    letterSpacing: 2
  },
  closeBtn: {
    fontSize: 14,
    color: 'var(--muted)',
    cursor: 'pointer',
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    padding: '16px 20px 6px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--muted)'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 20px',
    margin: '2px 8px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--muted)',
    position: 'relative'
  },
  navItemActive: {
    background: 'rgba(46,99,232,0.15)',
    color: 'var(--white)',
    fontWeight: 600
  },
  navItemLocked: {
    opacity: 0.5
  },
  activePill: {
    position: 'absolute',
    left: -8,
    top: '20%',
    bottom: '20%',
    width: 3,
    background: 'var(--blue)',
    borderRadius: '0 3px 3px 0'
  },
  navIcon: {
    fontSize: 17,
    width: 20,
    textAlign: 'center'
  },
  badge: {
    background: 'var(--blue)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20
  },
  lockIcon: {
    fontSize: 12
  },
  userWrap: {
    padding: '12px 8px',
    borderTop: '1px solid var(--border)'
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--blue),var(--blue-l))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13
  },
  planBadge: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    background: 'rgba(74,240,196,0.1)',
    border: '1px solid rgba(74,240,196,0.2)',
    padding: '2px 8px',
    borderRadius: 20
  }
}