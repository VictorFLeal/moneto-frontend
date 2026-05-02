import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const profiles = [
  {
    id: 'individual',
    icon: '👤',
    title: 'Pessoa física',
    sub: 'Quero organizar minhas finanças pessoais',
    features: ['Controlo de gastos pessoais', 'Metas financeiras', 'Insights da IA', 'Integração WhatsApp'],
    color: 'var(--blue)',
    glow: 'rgba(46,99,232,0.3)',
  },
  {
    id: 'debts',
    icon: '💸',
    title: 'Quero sair das dívidas',
    sub: 'Tenho dívidas e quero um plano para quitá-las',
    features: ['Plano inteligente de quitação', 'Método Avalanche ou Bola de Neve', 'Projeção de quando ficará livre', 'Alertas de vencimento'],
    color: 'var(--red)',
    glow: 'rgba(240,106,106,0.3)',
    badge: '🔥 Popular',
  },
  {
    id: 'business',
    icon: '🏢',
    title: 'Tenho uma empresa',
    sub: 'MEI, ME ou empresa — quero gerir as finanças do negócio',
    features: ['Separação pessoal vs empresa', 'Fluxo de caixa empresarial', 'Controlo de impostos', 'Distribuição inteligente do lucro'],
    color: 'var(--accent)',
    glow: 'rgba(74,240,196,0.25)',
    badge: '✨ Novo',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function proceed() {
    if (!selected) return
    if (selected === 'debts')    navigate('/dashboard/debts')
    else if (selected === 'business') navigate('/dashboard/business')
    else navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.wrap}>
        <div style={styles.logo}>Moneto</div>

        <div style={styles.header}>
          <h1 style={styles.title}>Qual é o teu perfil financeiro?</h1>
          <p style={styles.sub}>Escolhe o perfil que melhor te descreve. A IA vai personalizar toda a experiência para ti.</p>
        </div>

        <div style={styles.cards}>
          {profiles.map(p => (
            <div
              key={p.id}
              style={{
                ...styles.card,
                border: `1px solid ${selected === p.id ? p.color : 'var(--border)'}`,
                background: selected === p.id ? `${p.color}15` : 'var(--card)',
                boxShadow: selected === p.id ? `0 0 40px ${p.glow}` : 'none',
              }}
              onClick={() => setSelected(p.id)}
            >
              {p.badge && (
                <span style={{ ...styles.badge, color: p.color, background: p.color + '22', border: `1px solid ${p.color}44` }}>
                  {p.badge}
                </span>
              )}
              <div style={{ ...styles.cardIcon, background: p.color + '22', border: `1px solid ${p.color}44` }}>
                {p.icon}
              </div>
              <h3 style={styles.cardTitle}>{p.title}</h3>
              <p style={styles.cardSub}>{p.sub}</p>
              <ul style={styles.featureList}>
                {p.features.map(f => (
                  <li key={f} style={styles.featureItem}>
                    <span style={{ color: p.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div style={{
                ...styles.radio,
                border: `2px solid ${selected === p.id ? p.color : 'var(--border)'}`,
                background: selected === p.id ? p.color : 'transparent',
              }}>
                {selected === p.id && <span style={{ fontSize: 10, color: '#fff' }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        <button
          style={{ ...styles.btn, opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
          onClick={proceed}
          disabled={!selected}
        >
          Começar com este perfil →
        </button>

        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>
          Podes mudar o perfil a qualquer momento nas configurações
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px 20px', position: 'relative', overflow: 'hidden',
  },
  blob1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,75,204,0.3) 0%, transparent 70%)', top: -100, left: -100, filter: 'blur(100px)', pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,240,196,0.1) 0%, transparent 70%)', bottom: -80, right: -80, filter: 'blur(100px)', pointerEvents: 'none' },
  wrap:  { width: '100%', maxWidth: 900, position: 'relative', zIndex: 2 },
  logo:  { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 32 },
  header:{ textAlign: 'center', marginBottom: 36 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 12 },
  sub:   { fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 },
  card:  { borderRadius: 18, padding: 24, cursor: 'pointer', transition: 'all 0.22s', position: 'relative' },
  badge: { position: 'absolute', top: -10, right: 16, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  cardIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 6 },
  cardSub:   { fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  featureItem: { fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 8 },
  radio: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', marginLeft: 'auto' },
  btn:   { display: 'block', width: '100%', maxWidth: 360, margin: '0 auto', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, transition: 'all 0.18s', boxShadow: '0 0 30px rgba(46,99,232,0.35)' },
}