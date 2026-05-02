import { useLocation, useNavigate } from 'react-router-dom'

function getSaudacao(nome) {
  const hora = new Date().getHours()
  let saudacao
  if (hora >= 5 && hora < 12)       saudacao = 'Bom dia'
  else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
  else                               saudacao = 'Boa noite'

  const emoji = hora >= 5 && hora < 12 ? '☀️' : hora >= 12 && hora < 18 ? '🌤️' : '🌙'
  return `${saudacao}, ${nome}! ${emoji}`
}

const pageMeta = {
  '/dashboard':               { title: 'Dashboard' },
  '/dashboard/chat':          { title: 'Falar com a IA',        sub: 'Assistente financeiro inteligente' },
  '/dashboard/transactions':  { title: 'Transações',            sub: 'Histórico completo' },
  '/dashboard/goals':         { title: 'Metas financeiras',     sub: 'Acompanha o progresso' },
  '/dashboard/reports':       { title: 'Relatórios',            sub: 'Análise detalhada' },
  '/dashboard/calendar':      { title: 'Calendário',            sub: 'Eventos e vencimentos' },
  '/dashboard/notifications': { title: 'Notificações',          sub: 'Alertas e atualizações' },
  '/dashboard/settings':      { title: 'Configurações',         sub: 'Personaliza a tua experiência' },
  '/dashboard/debts':         { title: '💸 Sair das Dívidas',   sub: 'Plano inteligente com IA' },
  '/dashboard/business':      { title: '🏢 Modo Empresa',       sub: 'Gestão financeira empresarial' },
}

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function Header({ onAddTx, onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Busca o nome real do localStorage (vindo do backend)
  const user = JSON.parse(localStorage.getItem('moneto_user') || '{}')
  const nome = user.nome || 'utilizador'

  const meta = pageMeta[location.pathname] || { title: 'Moneto' }

  // No dashboard mostra a saudação dinâmica, nas outras páginas mostra o sub normal
  const isDashboard = location.pathname === '/dashboard'
  const subtitle    = isDashboard ? getSaudacao(nome) : (meta.sub || '')

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={styles.menuBtn} onClick={onMenuClick} title="Menu">
          <MenuIcon />
        </button>
        <div>
          <div style={styles.title}>{meta.title}</div>
          {subtitle && <div style={styles.sub}>{subtitle}</div>}
        </div>
      </div>

      <div style={styles.right}>
        {/* Notificações */}
        <button
          style={styles.iconBtn}
          onClick={() => navigate('/dashboard/notifications')}
          title="Notificações"
        >
          <BellIcon />
          <div style={styles.notifDot} />
        </button>

        {/* Nova transação — ícone em mobile */}
        <button
          style={styles.iconBtn}
          onClick={onAddTx}
          title="Nova transação"
          className="hide-desktop"
        >
          <PlusIcon />
        </button>

        {/* Nova transação — botão em desktop */}
        <button style={styles.btn} onClick={onAddTx} className="hide-mobile">
          + Nova transação
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .hide-desktop { display: none !important; }
        }
      `}</style>
    </header>
  )
}

const styles = {
  header: {
    height: 'var(--header-h)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(3,7,15,0.9)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  menuBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9, width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--muted)',
    transition: 'all 0.18s',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--white)',
  },
  sub: {
    fontSize: 12,
    color: 'var(--muted)',
    marginTop: 2,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36, height: 36,
    borderRadius: 9,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--muted)',
    position: 'relative',
    transition: 'all 0.18s',
  },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--accent)',
    border: '1.5px solid var(--bg)',
  },
  btn: {
    background: 'var(--blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(46,99,232,0.25)',
    transition: 'all 0.18s',
  },
}