import { useState, useEffect } from 'react'
import { getTransactions, createTransaction } from '../../services/api'

const categories = ['Todas', '🛒 Alimentação', '🚗 Transporte', '🏠 Moradia', '🎬 Lazer', '💊 Saúde', '💼 Trabalho']
const periods    = ['Semana', 'Mês', 'Ano']

export default function Transactions({ onAddTx }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch]             = useState('')
  const [cat, setCat]                   = useState('Todas')
  const [period, setPeriod]             = useState('Mês')
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getTransactions()
        setTransactions(res.data)
      } catch (err) {
        console.error('Erro ao carregar transações:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = transactions.filter(t => {
    const matchSearch = t.descricao?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = cat === 'Todas' || t.categoria?.includes(cat.replace(/^[^\s]+\s/, ''))
    return matchSearch && matchCat
  })

  const total   = filtered.reduce((s, t) => t.tipo === 'RECEITA' ? s + Number(t.valor) : s - Number(t.valor), 0)
  const income  = filtered.filter(t => t.tipo === 'RECEITA').reduce((s, t) => s + Number(t.valor), 0)
  const expense = filtered.filter(t => t.tipo === 'DESPESA').reduce((s, t) => s + Number(t.valor), 0)

  const catIcon = {
    'Alimentação': { icon: '🛒', bg: 'rgba(74,240,196,0.1)' },
    'Transporte':  { icon: '🚗', bg: 'rgba(46,99,232,0.1)' },
    'Lazer':       { icon: '🎬', bg: 'rgba(240,168,74,0.1)' },
    'Moradia':     { icon: '🏠', bg: 'rgba(91,139,245,0.1)' },
    'Saúde':       { icon: '💊', bg: 'rgba(240,106,106,0.1)' },
    'Trabalho':    { icon: '💰', bg: 'rgba(74,240,196,0.1)' },
    'Freelance':   { icon: '💎', bg: 'rgba(74,240,196,0.1)' },
    'Salário':     { icon: '💰', bg: 'rgba(74,240,196,0.1)' },
    'Outros':      { icon: '📦', bg: 'rgba(91,139,245,0.1)' },
  }

  function getTxStyle(cat) {
    const key = Object.keys(catIcon).find(k => cat?.includes(k)) || 'Outros'
    return catIcon[key]
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 28 }}>⏳</div>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando transações...</div>
    </div>
  )

  return (
    <div>
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
            <div key={p} style={{ ...styles.tab, ...(period === p ? styles.tabActive : {}) }} onClick={() => setPeriod(p)}>{p}</div>
          ))}
        </div>
        <button style={styles.btnAdd} onClick={onAddTx}>➕ Adicionar</button>
      </div>

      <div style={styles.card}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 36, opacity: 0.3, marginBottom: 10 }}>💳</div>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12 }}>
              {transactions.length === 0 ? 'Nenhuma transação ainda' : 'Nenhum resultado encontrado'}
            </div>
            {transactions.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Adiciona a tua primeira transação<br/>ou envia uma mensagem no WhatsApp!
              </div>
            )}
          </div>
        ) : (
          filtered.map((t, i) => {
            const style = getTxStyle(t.categoria)
            const isNeg = t.tipo === 'DESPESA'
            return (
              <div key={t.id} style={{ ...styles.txItem, borderBottom: i < filtered.length - 1 ? '1px solid rgba(91,139,245,0.07)' : 'none' }}>
                <div style={{ ...styles.txIcon, background: style.bg }}>{style.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.txName}>{t.descricao}</div>
                  <div style={styles.txCat}>{t.categoria} · {t.origem === 'whatsapp' ? '📱 WhatsApp' : '✏️ Manual'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...styles.txAmount, color: isNeg ? 'var(--red)' : 'var(--accent)' }}>
                    {isNeg ? '−' : '+'}R${Math.abs(Number(t.valor)).toFixed(2).replace('.', ',')}
                  </div>
                  <div style={styles.txDate}>{t.data}</div>
                </div>
              </div>
            )
          })
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
  tab:         { padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' },
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