import { useLocation, useNavigate } from 'react-router-dom'

function getSaudacao() {
  const hora = new Date().getHours()

  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem('moneto_user'))
    return user?.nome?.split(' ')[0] || 'Usuário'
  } catch {
    return 'Usuário'
  }
}

const pageMeta = {
  '/dashboard':               { title: 'Dashboard',              dynamicSub: true },
  '/dashboard/chat':          { title: 'Falar com a IA',         sub: 'Assistente financeiro inteligente' },
  '/dashboard/transactions':  { title: 'Transações',             sub: 'Histórico completo' },
  '/dashboard/goals':         { title: 'Metas financeiras',      sub: 'Acompanha o progresso' },
  '/dashboard/reports':       { title: 'Relatórios',             sub: 'Análise detalhada' },
  '/dashboard/calendar':      { title: 'Calendário',             sub: 'Eventos e vencimentos' },
  '/dashboard/notifications': { title: 'Notificações',           sub: 'Alertas e atualizações' },
  '/dashboard/settings':      { title: 'Configurações',          sub: 'Personaliza a tua experiência' },
  '/dashboard/debts':         { title: '💸 Sair das Dívidas',    sub: 'Plano inteligente com IA' },
  '/dashboard/business':      { title: '🏢 Modo Empresa',        sub: 'Gestão financeira empresarial' },
}

export default function Header({ onAddTx, onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  const userName = getUserName()
  const meta = pageMeta[location.pathname] || { title: 'Moneto', sub: '' }

  const sub = meta.dynamicSub
    ? `${getSaudacao()}, ${userName} 👋`
    : meta.sub

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={styles.menuBtn} onClick={onMenuClick}>☰</button>
        <div>
          <div style={styles.title}>{meta.title}</div>
          <div style={styles.sub}>{sub}</div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.iconBtn} onClick={() => navigate('/dashboard/notifications')}>
          🔔<div style={styles.notifDot} />
        </div>

        <div style={styles.iconBtn} onClick={onAddTx}>➕</div>

        <button style={styles.btn} onClick={onAddTx}>
          <span className="header-btn-text">Nova transação</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .header-btn-text { display: none !important; }
        }
      `}</style>
    </header>
  )
}

const styles = {
  header: {
    height: 'var(--header-h)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(3,7,15,0.9)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 50,
  },
  menuBtn: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 9, width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 16, color: 'var(--white)',
  },
  title:    { fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 },
  sub:      { fontSize: 11, color: 'var(--muted)', marginTop: 1 },
  right:    { display: 'flex', alignItems: 'center', gap: 8 },
  iconBtn:  { width: 36, height: 36, borderRadius: 9, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, position: 'relative' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', border: '1.5px solid var(--bg)' },
  btn:      { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
}