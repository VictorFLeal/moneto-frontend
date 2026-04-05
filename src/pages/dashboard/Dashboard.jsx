import { useNavigate } from 'react-router-dom'

const transactions = [
  { id:1, name:'iFood',           cat:'🛒 Alimentação', val:-45.90,  date:'Hoje, 13:21', icon:'🛒', bg:'rgba(74,240,196,0.1)' },
  { id:2, name:'Uber',            cat:'🚗 Transporte',  val:-28.50,  date:'Hoje, 11:05', icon:'🚗', bg:'rgba(46,99,232,0.1)' },
  { id:3, name:'Mercado São Jorge',cat:'🛒 Alimentação',val:-89.00,  date:'Hoje, 09:32', icon:'🛒', bg:'rgba(74,240,196,0.1)' },
  { id:4, name:'Netflix',         cat:'🎬 Lazer',       val:-39.90,  date:'Ontem, 23:00',icon:'🎬', bg:'rgba(240,168,74,0.1)' },
  { id:5, name:'Salário',         cat:'💼 Trabalho',    val:+5500.00,date:'1 Abr, 08:00', icon:'💰', bg:'rgba(74,240,196,0.1)' },
]

const stats = [
  { label:'Saldo atual',    value:'R$ 4.820', change:'↑ 12% vs mês anterior', up:true,  icon:'💰', glow:'rgba(46,99,232,0.25)' },
  { label:'Receitas',       value:'R$ 6.500', change:'↑ Salário + freelance',  up:true,  icon:'📥', glow:'rgba(74,240,196,0.2)' },
  { label:'Despesas',       value:'R$ 1.680', change:'↑ 8% vs mês anterior',   up:false, icon:'📤', glow:'rgba(240,106,106,0.2)' },
  { label:'Economia',       value:'R$ 4.820', change:'✓ Meta atingida!',        up:true,  icon:'🎯', glow:'rgba(240,168,74,0.2)' },
]

const budgets = [
  { label:'🛒 Alimentação', cur:520,  max:800,  color:'var(--accent)' },
  { label:'🚗 Transporte',  cur:320,  max:400,  color:'var(--blue-l)' },
  { label:'🎬 Lazer',       cur:415,  max:500,  color:'var(--accent2)' },
  { label:'🏠 Moradia',     cur:425,  max:1200, color:'var(--red)' },
]

export default function Dashboard({ onAddTx }) {
  const navigate = useNavigate()

  return (
    <div>
      {/* Stats */}
      <div style={styles.g4}>
        {stats.map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statGlow, background: s.glow }} />
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={{ ...styles.statChange, color: s.up ? 'var(--accent)' : 'var(--red)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={styles.g2}>
        {/* Transações recentes */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Transações recentes</span>
            <span style={styles.sectionAction} onClick={() => navigate('/dashboard/transactions')}>Ver todas →</span>
          </div>
          {transactions.map(t => (
            <div key={t.id} style={styles.txItem}>
              <div style={{ ...styles.txIcon, background: t.bg }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.txName}>{t.name}</div>
                <div style={styles.txCat}>{t.cat}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...styles.txAmount, color: t.val < 0 ? 'var(--red)' : 'var(--accent)' }}>
                  {t.val < 0 ? '−' : '+'}R${Math.abs(t.val).toFixed(2).replace('.', ',')}
                </div>
                <div style={styles.txDate}>{t.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coluna direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Insights */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>💡 Insights da IA</span>
              <span style={styles.sectionAction} onClick={() => navigate('/dashboard/chat')}>Perguntar →</span>
            </div>
            {[
              { icon:'✅', bg:'rgba(74,240,196,0.1)',  title:'Ótimo desempenho!',  body:'Você gastou 18% menos em alimentação esta semana.' },
              { icon:'⚠️', bg:'rgba(240,168,74,0.1)', title:'Atenção: Lazer',      body:'Gastos com lazer aumentaram 40% vs semana passada.' },
            ].map(ins => (
              <div key={ins.title} style={styles.insight}>
                <div style={{ ...styles.insightIcon, background: ins.bg }}>{ins.icon}</div>
                <div>
                  <strong style={{ fontSize: 13, display: 'block', marginBottom: 3 }}>{ins.title}</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{ins.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Orçamento */}
          <div style={styles.card}>
            <div style={{ ...styles.sectionHeader, marginBottom: 14 }}>
              <span style={styles.sectionTitle}>📊 Orçamento mensal</span>
              <span style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(74,240,196,0.1)', border: '1px solid rgba(74,240,196,0.2)', padding: '2px 10px', borderRadius: 20 }}>68% usado</span>
            </div>
            {budgets.map(b => (
              <div key={b.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{b.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>R${b.cur} / R${b.max}</span>
                </div>
                <div style={styles.progBar}>
                  <div style={{ ...styles.progFill, width: `${(b.cur/b.max)*100}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  g4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
  g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  statCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
  },
  statGlow: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' },
  statIcon: { position: 'absolute', top: 18, right: 18, fontSize: 22, opacity: 0.5 },
  statLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 },
  statValue: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: -1, lineHeight: 1 },
  statChange: { marginTop: 8, fontSize: 12 },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, backdropFilter: 'blur(12px)' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
  sectionAction: { fontSize: 13, color: 'var(--blue-l)', cursor: 'pointer' },
  txItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.06)' },
  txIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  txName: { fontSize: 13, fontWeight: 600, color: 'var(--white)' },
  txCat:  { fontSize: 11, color: 'var(--muted)', marginTop: 1 },
  txAmount: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 },
  txDate: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  insight: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10 },
  insightIcon: { width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
  progBar: { height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 3, transition: 'width 0.5s ease' },
}