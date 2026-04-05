import { useState } from 'react'

const initialTransactions = [
  { id:1,  name:'iFood',            cat:'🛒 Alimentação', val:-45.90,   date:'Hoje, 13:21',    icon:'🛒', bg:'rgba(74,240,196,0.1)' },
  { id:2,  name:'Uber',             cat:'🚗 Transporte',  val:-28.50,   date:'Hoje, 11:05',    icon:'🚗', bg:'rgba(46,99,232,0.1)' },
  { id:3,  name:'Mercado São Jorge',cat:'🛒 Alimentação', val:-89.00,   date:'Hoje, 09:32',    icon:'🛒', bg:'rgba(74,240,196,0.1)' },
  { id:4,  name:'Netflix',          cat:'🎬 Lazer',       val:-39.90,   date:'Ontem, 23:00',   icon:'🎬', bg:'rgba(240,168,74,0.1)' },
  { id:5,  name:'Salário',          cat:'💼 Trabalho',    val:+5500.00, date:'1 Abr, 08:00',   icon:'💰', bg:'rgba(74,240,196,0.1)' },
  { id:6,  name:'Freelance',        cat:'💼 Trabalho',    val:+1000.00, date:'31 Mar, 16:00',  icon:'💎', bg:'rgba(74,240,196,0.1)' },
  { id:7,  name:'Farmácia',         cat:'💊 Saúde',       val:-67.30,   date:'30 Mar, 15:20',  icon:'💊', bg:'rgba(240,106,106,0.1)' },
  { id:8,  name:'Academia',         cat:'💊 Saúde',       val:-99.00,   date:'30 Mar, 10:00',  icon:'🏋️', bg:'rgba(240,106,106,0.1)' },
  { id:9,  name:'Cinema',           cat:'🎬 Lazer',       val:-58.00,   date:'29 Mar, 20:00',  icon:'🎬', bg:'rgba(240,168,74,0.1)' },
  { id:10, name:'Conta de água',    cat:'🏠 Moradia',     val:-85.00,   date:'28 Mar, 09:00',  icon:'🏠', bg:'rgba(91,139,245,0.1)' },
]

const categories = ['Todas', '🛒 Alimentação', '🚗 Transporte', '🏠 Moradia', '🎬 Lazer', '💊 Saúde', '💼 Trabalho']
const periods    = ['Semana', 'Mês', 'Ano']

export default function Transactions({ onAddTx }) {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('Todas')
  const [period, setPeriod]   = useState('Mês')
  const [transactions]        = useState(initialTransactions)

  const filtered = transactions.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = cat === 'Todas' || t.cat === cat
    return matchSearch && matchCat
  })

  const total    = filtered.reduce((s, t) => s + t.val, 0)
  const income   = filtered.filter(t => t.val > 0).reduce((s, t) => s + t.val, 0)
  const expense  = filtered.filter(t => t.val < 0).reduce((s, t) => s + t.val, 0)

  return (
    <div>

      {/* Totais */}
      <div style={styles.g3}>
        {[
          { label: 'Total de entradas', value: income,  color: 'var(--accent)', icon: '📥' },
          { label: 'Total de saídas',   value: expense, color: 'var(--red)',    icon: '📤' },
          { label: 'Saldo do período',  value: total,   color: total >= 0 ? 'var(--accent)' : 'var(--red)', icon: '💰' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statValue, color: s.color }}>
              {s.value >= 0 ? '+' : '−'}R${Math.abs(s.value).toFixed(2).replace('.', ',')}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Buscar transação…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={styles.select} value={cat} onChange={e => setCat(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div style={styles.tabs}>
          {periods.map(p => (
            <div
              key={p}
              style={{ ...styles.tab, ...(period === p ? styles.tabActive : {}) }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </div>
          ))}
        </div>
        <button style={styles.btnAdd} onClick={onAddTx}>➕ Adicionar</button>
      </div>

      {/* Lista */}
      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 40, opacity: 0.3 }}>🔍</div>
            <div style={{ color: 'var(--muted)', marginTop: 10 }}>Nenhuma transação encontrada</div>
          </div>
        ) : (
          filtered.map((t, i) => (
            <div key={t.id} style={{ ...styles.txItem, borderBottom: i < filtered.length - 1 ? '1px solid rgba(91,139,245,0.07)' : 'none' }}>
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
          ))
        )}
      </div>

    </div>
  )
}

const styles = {
  g3:          { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 },
  statCard:    { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', position: 'relative' },
  statIcon:    { fontSize: 20, marginBottom: 10, opacity: 0.6 },
  statLabel:   { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 6 },
  statValue:   { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: -1 },
  filters:     { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  searchInput: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--white)', fontSize: 14, outline: 'none', maxWidth: 240, width: '100%' },
  select:      { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--white)', fontSize: 14, outline: 'none', appearance: 'none' },
  tabs:        { display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: 3 },
  tab:         { padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.18s' },
  tabActive:   { background: 'var(--blue)', color: '#fff', fontWeight: 600 },
  btnAdd:      { marginLeft: 'auto', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  card:        { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 16px' },
  txItem:      { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' },
  txIcon:      { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  txName:      { fontSize: 13, fontWeight: 600 },
  txCat:       { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  txAmount:    { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 },
  txDate:      { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  empty:       { textAlign: 'center', padding: '48px 24px' },
}