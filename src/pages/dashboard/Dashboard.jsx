import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSummary, getTransactions } from '../../services/api'

const budgets = [
  { label: '🛒 Alimentação', cur: 520,  max: 800,  color: 'var(--accent)' },
  { label: '🚗 Transporte',  cur: 320,  max: 400,  color: 'var(--blue-l)' },
  { label: '🎬 Lazer',       cur: 415,  max: 500,  color: 'var(--accent2)' },
  { label: '🏠 Moradia',     cur: 425,  max: 1200, color: 'var(--red)' },
]

const catIcon = {
  'Alimentação': { icon: '🛒', bg: 'rgba(74,240,196,0.1)' },
  'Transporte':  { icon: '🚗', bg: 'rgba(46,99,232,0.1)' },
  'Lazer':       { icon: '🎬', bg: 'rgba(240,168,74,0.1)' },
  'Moradia':     { icon: '🏠', bg: 'rgba(91,139,245,0.1)' },
  'Saúde':       { icon: '💊', bg: 'rgba(240,106,106,0.1)' },
  'Trabalho':    { icon: '💰', bg: 'rgba(74,240,196,0.1)' },
  'Educação':    { icon: '📚', bg: 'rgba(46,99,232,0.1)' },
  'Outros':      { icon: '📦', bg: 'rgba(91,139,245,0.1)' },
}

export default function Dashboard({ onAddTx = () => {} }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('moneto_user') || '{}')

  const [summary, setSummary]           = useState({ receitas: 0, despesas: 0, saldo: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)

    async function load() {
      try {
        const [sumRes, txRes] = await Promise.all([
          getSummary(),
          getTransactions(),
        ])
        setSummary(sumRes.data)
        setTransactions(txRes.data.slice(0, 5))
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stats = [
    { label: 'Saldo atual',    value: summary.saldo,    change: 'Saldo disponível',    up: summary.saldo >= 0,    icon: '💰', glow: 'rgba(46,99,232,0.25)' },
    { label: 'Receitas',       value: summary.receitas, change: 'Total de entradas',    up: true,                  icon: '📥', glow: 'rgba(74,240,196,0.2)' },
    { label: 'Despesas',       value: summary.despesas, change: 'Total de saídas',      up: false,                 icon: '📤', glow: 'rgba(240,106,106,0.2)' },
    { label: 'Economia',       value: summary.saldo,    change: summary.saldo >= 0 ? '✓ Positivo!' : '⚠ Atenção', up: summary.saldo >= 0, icon: '🎯', glow: 'rgba(240,168,74,0.2)' },
  ]

  function formatVal(val) {
    return `R$ ${Math.abs(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  function getTxStyle(cat) {
    const key = Object.keys(catIcon).find(k => cat?.includes(k)) || 'Outros'
    return catIcon[key]
  }

  const styles = {
    g4: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)',
      gap: 16,
      marginBottom: 20,
    },
    g2: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16,
    },
    statCard: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? '18px 20px' : '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
    },
    statGlow: {
      position: 'absolute',
      top: -30,
      right: -30,
      width: 100,
      height: 100,
      borderRadius: '50%',
      filter: 'blur(40px)',
      pointerEvents: 'none',
    },
    statIcon: {
      position: 'absolute',
      top: 18,
      right: 18,
      fontSize: 22,
      opacity: 0.5,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: 'var(--muted)',
      marginBottom: 10,
    },
    statValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 22 : 24,
      fontWeight: 800,
      letterSpacing: -1,
      lineHeight: 1,
      wordBreak: 'break-word',
    },
    statChange: {
      marginTop: 8,
      fontSize: 12,
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 18 : 24,
      backdropFilter: 'blur(12px)',
      minWidth: 0,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 12,
    },
    sectionTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 15,
      fontWeight: 700,
    },
    sectionAction: {
      fontSize: 13,
      color: 'var(--blue-l)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    txItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 0',
      minWidth: 0,
    },
    txIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17,
      flexShrink: 0,
    },
    txName: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--white)',
      wordBreak: 'break-word',
    },
    txCat: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 1,
    },
    txAmount: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 14,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },
    txDate: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 2,
      whiteSpace: 'nowrap',
    },
    insight: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      padding: 12,
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: 10,
      minWidth: 0,
    },
    insightIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      flexShrink: 0,
    },
    progBar: {
      height: 6,
      background: 'rgba(91,139,245,0.1)',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progFill: {
      height: '100%',
      borderRadius: 3,
      transition: 'width 0.5s ease',
    },
    empty: {
      textAlign: 'center',
      padding: '32px 0',
    },
    btnAdd: {
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 9,
      padding: '9px 18px',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
    },
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 32 }}>⏳</div>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando dados...</div>
    </div>
  )

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>

      {/* Saudação */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: isMobile ? 20 : 22, fontWeight: 800, marginBottom: 4 }}>
          Olá, {user.nome || 'Victor'} 👋
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Aqui está o resumo das tuas finanças
        </p>
      </div>

      {/* Stats */}
      <div style={styles.g4}>
        {stats.map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statGlow, background: s.glow }} />
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{formatVal(s.value)}</div>
            <div style={{ ...styles.statChange, color: s.up ? 'var(--accent)' : 'var(--red)' }}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.g2}>

        {/* Transações recentes */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Transações recentes</span>
            <span
              style={styles.sectionAction}
              onClick={() => navigate('/dashboard/transactions')}
            >
              Ver todas →
            </span>
          </div>

          {transactions.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 8 }}>💳</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>Nenhuma transação ainda</div>
              <button style={{ ...styles.btnAdd, marginTop: 12 }} onClick={onAddTx}>
                Adicionar primeira transação
              </button>
            </div>
          ) : (
            transactions.map((t, i) => {
              const cat = getTxStyle(t.categoria)
              const isNeg = t.tipo === 'DESPESA'
              return (
                <div key={t.id} style={{ ...styles.txItem, borderBottom: i < transactions.length - 1 ? '1px solid rgba(91,139,245,0.06)' : 'none' }}>
                  <div style={{ ...styles.txIcon, background: cat.bg }}>{cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.txName}>{t.descricao}</div>
                    <div style={styles.txCat}>{t.categoria}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ ...styles.txAmount, color: isNeg ? 'var(--red)' : 'var(--accent)' }}>
                      {isNeg ? '−' : '+'}R${Math.abs(t.valor).toFixed(2).replace('.', ',')}
                    </div>
                    <div style={styles.txDate}>{t.data}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Coluna direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* Insights */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>💡 Insights da IA</span>
              <span style={styles.sectionAction} onClick={() => navigate('/dashboard/chat')}>
                Perguntar →
              </span>
            </div>
            {[
              {
                icon: summary.saldo >= 0 ? '✅' : '⚠️',
                bg: summary.saldo >= 0 ? 'rgba(74,240,196,0.1)' : 'rgba(240,106,106,0.1)',
                title: summary.saldo >= 0 ? 'Saldo positivo!' : 'Atenção ao saldo',
                body: summary.saldo >= 0
                  ? `Tens um saldo positivo de ${formatVal(summary.saldo)}. Continua assim!`
                  : `O teu saldo está negativo. Revê as despesas e corta o supérfluo.`,
              },
              {
                icon: '💡',
                bg: 'rgba(46,99,232,0.1)',
                title: 'Dica do dia',
                body: 'Regista todos os gastos pelo WhatsApp para ter insights mais precisos.',
              },
            ].map(ins => (
              <div key={ins.title} style={styles.insight}>
                <div style={{ ...styles.insightIcon, background: ins.bg }}>{ins.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: 13, display: 'block', marginBottom: 3 }}>{ins.title}</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{ins.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Orçamento */}
          <div style={styles.card}>
            <div style={{ ...styles.sectionHeader, marginBottom: 14 }}>
              <span style={styles.sectionTitle}>📊 Orçamento mensal</span>
            </div>
            {budgets.map(b => (
              <div key={b.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 10 }}>
                  <span style={{ fontSize: 13 }}>{b.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    R${b.cur} / R${b.max}
                  </span>
                </div>
                <div style={styles.progBar}>
                  <div style={{ ...styles.progFill, width: `${Math.min((b.cur / b.max) * 100, 100)}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}