import { useNavigate, useLocation } from 'react-router-dom'

const pageMeta = {
  '/dashboard':               { title: 'Dashboard',             sub: 'Bom dia, Victor 👋' },
  '/dashboard/chat':          { title: 'Falar com a IA',        sub: 'Assistente financeiro inteligente' },
  '/dashboard/transactions':  { title: 'Transações',            sub: 'Histórico completo de movimentações' },
  '/dashboard/goals':         { title: 'Metas financeiras',     sub: 'Acompanha o progresso dos teus objetivos' },
  '/dashboard/reports':       { title: 'Relatórios',            sub: 'Análise detalhada das tuas finanças' },
  '/dashboard/calendar':      { title: 'Calendário financeiro', sub: 'Eventos e vencimentos' },
  '/dashboard/notifications': { title: 'Notificações',          sub: 'Alertas e atualizações' },
  '/dashboard/settings':      { title: 'Configurações',         sub: 'Personaliza a tua experiência' },
}

export default function Header({ onAddTx }) {
  const navigate = useNavigate()
  const location = useLocation()
  const meta = pageMeta[location.pathname] || { title: 'Moneto', sub: '' }

  return (
    <header style={styles.header}>
      <div>
        <div style={styles.title}>{meta.title}</div>
        <div style={styles.sub}>{meta.sub}</div>
      </div>
      <div style={styles.right}>
        <div style={styles.iconBtn} onClick={() => navigate('/dashboard/notifications')} title="Notificações">
          🔔
          <div style={styles.notifDot} />
        </div>
        <div style={styles.iconBtn} onClick={onAddTx} title="Nova transação">➕</div>
        <button style={styles.btn} onClick={onAddTx}>Nova transação</button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    height: 'var(--header-h)',
    flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(3,7,15,0.8)',
    backdropFilter: 'blur(12px)',
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700 },
  sub:   { fontSize: 12, color: 'var(--muted)', marginTop: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 9,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 16, position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 6, right: 6,
    width: 7, height: 7, borderRadius: '50%',
    background: 'var(--accent)',
    border: '1.5px solid var(--bg)',
  },
  btn: {
    background: 'var(--blue)', color: '#fff',
    border: 'none', borderRadius: 10,
    padding: '9px 18px', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 0 20px rgba(46,99,232,0.3)',
  },
}