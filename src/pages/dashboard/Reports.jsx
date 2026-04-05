import { useState } from 'react'

const months   = ['Jan','Fev','Mar','Abr','Mai','Jun']
const categories = [
  { icon:'🛒', name:'Alimentação', val:520,  pct:31, color:'#4af0c4' },
  { icon:'🚗', name:'Transporte',  val:320,  pct:19, color:'#5b8bf5' },
  { icon:'🎬', name:'Lazer',       val:415,  pct:25, color:'#f0a84a' },
  { icon:'🏠', name:'Moradia',     val:425,  pct:25, color:'#f06a6a' },
]

export default function Reports() {
  const [activePeriod, setActivePeriod] = useState('Abr')

  return (
    <div>

      {/* Period tabs */}
      <div style={styles.tabs}>
        {months.map(m => (
          <div
            key={m}
            style={{ ...styles.tab, ...(activePeriod === m ? styles.tabActive : {}) }}
            onClick={() => setActivePeriod(m)}
          >
            {m}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={styles.g4}>
        {[
          { label:'Total gasto',    value:'R$1.680', change:'↑ 8% vs Mar', up:false, icon:'💸' },
          { label:'Total recebido', value:'R$6.500', change:'Estável',      up:true,  icon:'💰' },
          { label:'Maior gasto',    value:'Aliment.', change:'R$ 520 · 31%', up:null, icon:'📊' },
          { label:'Economia',       value:'R$4.820', change:'Meta atingida', up:true,  icon:'💎' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={{ fontSize: 12, marginTop: 6, color: s.up === true ? 'var(--accent)' : s.up === false ? 'var(--red)' : 'var(--muted)' }}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.g2}>

        {/* Evolução mensal simulada */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Evolução mensal</div>
          <div style={{ marginTop: 16 }}>
            {[
              { m:'Jan', income:4200, expense:1900 },
              { m:'Fev', income:4800, expense:2100 },
              { m:'Mar', income:5500, expense:1750 },
              { m:'Abr', income:6500, expense:1680 },
            ].map(row => (
              <div key={row.m} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{row.m}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: 'var(--accent)' }}>+R${row.income.toLocaleString()}</span>
                    <span style={{ color: 'var(--red)' }}>−R${row.expense.toLocaleString()}</span>
                  </div>
                </div>
                <div style={styles.progBar}>
                  <div style={{ ...styles.progFill, width: `${(row.income / 7000) * 100}%`, background: 'var(--accent)', opacity: 0.4 }} />
                </div>
                <div style={{ ...styles.progBar, marginTop: 3 }}>
                  <div style={{ ...styles.progFill, width: `${(row.expense / 7000) * 100}%`, background: 'var(--red)', opacity: 0.6 }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 3, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} /> Receitas
              </span>
              <span style={{ fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 3, background: 'var(--red)', display: 'inline-block', borderRadius: 2 }} /> Despesas
              </span>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Gastos por categoria</div>
          <div style={{ marginTop: 12 }}>
            {categories.map(c => (
              <div key={c.name} style={styles.catRow}>
                <div style={{ ...styles.catIcon, background: c.color + '22' }}>{c.icon}</div>
                <div style={{ flex: 1, fontSize: 13 }}>{c.name}</div>
                <div style={{ flex: 2, height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden', margin: '0 12px' }}>
                  <div style={{ height: '100%', width: `${c.pct * 3}%`, background: c.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>R${c.val}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', minWidth: 35, textAlign: 'right' }}>{c.pct}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Export */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        <button style={styles.btnGhost}>📋 Exportar CSV</button>
        <button style={styles.btnPrimary}>📄 Gerar PDF</button>
      </div>

    </div>
  )
}

const styles = {
  tabs:       { display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' },
  tab:        { padding: '7px 16px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' },
  tabActive:  { background: 'var(--blue)', color: '#fff', fontWeight: 600 },
  g4:         { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
  g2:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  statCard:   { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px' },
  statIcon:   { fontSize: 20, marginBottom: 8, opacity: 0.6 },
  statLabel:  { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 6 },
  statValue:  { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -1 },
  card:       { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 },
  sectionTitle:{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
  progBar:    { height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden' },
  progFill:   { height: '100%', borderRadius: 3 },
  catRow:     { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' },
  catIcon:    { width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
  btnGhost:   { background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 18px', color: 'var(--white)', fontSize: 13, cursor: 'pointer' },
  btnPrimary: { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
}