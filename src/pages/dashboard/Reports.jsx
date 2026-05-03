import { useEffect, useMemo, useState } from 'react'
import { getTransactions } from '../../services/api'

const months = [
  { label: 'Jan', value: 0 },
  { label: 'Fev', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Abr', value: 3 },
  { label: 'Mai', value: 4 },
  { label: 'Jun', value: 5 },
  { label: 'Jul', value: 6 },
  { label: 'Ago', value: 7 },
  { label: 'Set', value: 8 },
  { label: 'Out', value: 9 },
  { label: 'Nov', value: 10 },
  { label: 'Dez', value: 11 },
]

const categoryIcons = {
  Alimentação: '🛒',
  Transporte: '🚗',
  Lazer: '🎬',
  Moradia: '🏠',
  Saúde: '💊',
  Educação: '📚',
  Vestuário: '👕',
  Trabalho: '💼',
  Tecnologia: '💻',
  Salário: '💰',
  Freelance: '🧾',
  Investimento: '📈',
  Outros: '📦',
}

const categoryColors = ['#4af0c4', '#5b8bf5', '#f0a84a', '#f06a6a', '#a855f7', '#22c55e']

export default function Reports() {
  const now = new Date()

  const [transactions, setTransactions] = useState([])
  const [activeMonth, setActiveMonth] = useState(now.getMonth())
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)

    async function load() {
      try {
        const res = await getTransactions()
        setTransactions(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err)
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (!t.data) return false

      const date = new Date(`${t.data}T00:00:00`)
      return date.getMonth() === activeMonth && date.getFullYear() === now.getFullYear()
    })
  }, [transactions, activeMonth, now])

  const previousFiltered = useMemo(() => {
    const previousMonth = activeMonth === 0 ? 11 : activeMonth - 1
    const previousYear = activeMonth === 0 ? now.getFullYear() - 1 : now.getFullYear()

    return transactions.filter(t => {
      if (!t.data) return false

      const date = new Date(`${t.data}T00:00:00`)
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear
    })
  }, [transactions, activeMonth, now])

  const totalGasto = filtered
    .filter(t => t.tipo === 'DESPESA')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0)

  const totalRecebido = filtered
    .filter(t => t.tipo === 'RECEITA')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0)

  const economia = totalRecebido - totalGasto

  const previousGasto = previousFiltered
    .filter(t => t.tipo === 'DESPESA')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0)

  const variation = previousGasto > 0
    ? Math.round(((totalGasto - previousGasto) / previousGasto) * 100)
    : 0

  const categories = useMemo(() => {
    const map = {}

    filtered
      .filter(t => t.tipo === 'DESPESA')
      .forEach(t => {
        const cat = t.categoria || 'Outros'
        map[cat] = (map[cat] || 0) + Number(t.valor || 0)
      })

    return Object.entries(map)
      .map(([name, val], index) => ({
        name,
        val,
        pct: totalGasto > 0 ? Math.round((val / totalGasto) * 100) : 0,
        icon: categoryIcons[name] || categoryIcons.Outros,
        color: categoryColors[index % categoryColors.length],
      }))
      .sort((a, b) => b.val - a.val)
  }, [filtered, totalGasto])

  const maiorGasto = categories[0]

  const monthlyEvolution = useMemo(() => {
    return months.slice(0, now.getMonth() + 1).map(m => {
      const txMonth = transactions.filter(t => {
        if (!t.data) return false
        const date = new Date(`${t.data}T00:00:00`)
        return date.getMonth() === m.value && date.getFullYear() === now.getFullYear()
      })

      return {
        m: m.label,
        income: txMonth.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + Number(t.valor || 0), 0),
        expense: txMonth.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + Number(t.valor || 0), 0),
      }
    })
  }, [transactions, now])

  function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const styles = {
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40vh',
      flexDirection: 'column',
      gap: 12,
    },
    page: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
    },
    tabs: {
      display: 'flex',
      gap: 3,
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 4,
      marginBottom: 20,
      width: isMobile ? '100%' : 'fit-content',
      flexWrap: 'wrap',
    },
    tab: {
      padding: isMobile ? '7px 0' : '7px 16px',
      borderRadius: 7,
      fontSize: 13,
      cursor: 'pointer',
      color: 'var(--muted)',
      flex: isMobile ? '1 0 20%' : 'unset',
      textAlign: 'center',
    },
    tabActive: {
      background: 'var(--blue)',
      color: '#fff',
      fontWeight: 600,
    },
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
      padding: '18px 20px',
      minWidth: 0,
      overflow: 'hidden',
    },
    statIcon: {
      fontSize: 20,
      marginBottom: 8,
      opacity: 0.6,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: 'var(--muted)',
      marginBottom: 6,
    },
    statValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 20 : 22,
      fontWeight: 800,
      letterSpacing: -1,
      wordBreak: 'break-word',
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 16 : 24,
      minWidth: 0,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 15,
      fontWeight: 700,
    },
    evolutionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5,
      fontSize: 13,
      gap: 10,
      flexDirection: isMobile ? 'column' : 'row',
    },
    evolutionValues: {
      display: 'flex',
      gap: isMobile ? 8 : 16,
      flexDirection: isMobile ? 'column' : 'row',
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
    },
    catRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '34px 1fr auto' : '34px 1fr 2fr 90px 35px',
      alignItems: 'center',
      gap: 10,
      padding: '10px 0',
      borderBottom: '1px solid rgba(91,139,245,0.07)',
    },
    catIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      flexShrink: 0,
    },
    catName: {
      fontSize: 13,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    catBar: {
      height: 6,
      background: 'rgba(91,139,245,0.1)',
      borderRadius: 3,
      overflow: 'hidden',
      display: isMobile ? 'none' : 'block',
    },
    catValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    catPct: {
      fontSize: 12,
      color: 'var(--muted)',
      textAlign: 'right',
      display: isMobile ? 'none' : 'block',
    },
    legendWrap: {
      display: 'flex',
      gap: 16,
      marginTop: 10,
      flexWrap: 'wrap',
    },
    legendAccent: {
      fontSize: 12,
      color: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
    },
    legendRed: {
      fontSize: 12,
      color: 'var(--red)',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
    },
    legendDot: {
      width: 10,
      height: 3,
      display: 'inline-block',
      borderRadius: 2,
    },
    empty: {
      textAlign: 'center',
      padding: '36px 0',
      color: 'var(--muted)',
      fontSize: 13,
    },
    actions: {
      display: 'flex',
      justifyContent: isMobile ? 'stretch' : 'flex-end',
      gap: 10,
      marginTop: 20,
      flexDirection: isMobile ? 'column' : 'row',
    },
    btnGhost: {
      background: 'transparent',
      border: '1px solid var(--border)',
      borderRadius: 9,
      padding: '9px 18px',
      color: 'var(--white)',
      fontSize: 13,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    },
    btnPrimary: {
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 9,
      padding: '9px 18px',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    },
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: 30 }}>⏳</div>
        <div style={{ color: 'var(--muted)' }}>Carregando relatórios...</div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.tabs}>
        {months.map(m => (
          <div
            key={m.label}
            style={{ ...styles.tab, ...(activeMonth === m.value ? styles.tabActive : {}) }}
            onClick={() => setActiveMonth(m.value)}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div style={styles.g4}>
        {[
          {
            label: 'Total gasto',
            value: money(totalGasto),
            change: previousGasto > 0 ? `${variation >= 0 ? '↑' : '↓'} ${Math.abs(variation)}% vs mês anterior` : 'Sem comparação',
            up: variation <= 0,
            icon: '💸',
          },
          {
            label: 'Total recebido',
            value: money(totalRecebido),
            change: totalRecebido > 0 ? 'Entradas no mês' : 'Nenhuma receita',
            up: true,
            icon: '💰',
          },
          {
            label: 'Maior gasto',
            value: maiorGasto ? maiorGasto.name : 'Nenhum',
            change: maiorGasto ? `${money(maiorGasto.val)} · ${maiorGasto.pct}%` : 'Sem despesas',
            up: null,
            icon: '📊',
          },
          {
            label: 'Economia',
            value: money(economia),
            change: economia >= 0 ? 'Saldo positivo' : 'Atenção ao saldo',
            up: economia >= 0,
            icon: '💎',
          },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div
              style={{
                fontSize: 12,
                marginTop: 6,
                color: s.up === true ? 'var(--accent)' : s.up === false ? 'var(--red)' : 'var(--muted)',
              }}
            >
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.g2}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Evolução mensal</div>

          <div style={{ marginTop: 16 }}>
            {monthlyEvolution.map(row => {
              const max = Math.max(...monthlyEvolution.map(m => Math.max(m.income, m.expense)), 1)

              return (
                <div key={row.m} style={{ marginBottom: 14 }}>
                  <div style={styles.evolutionHeader}>
                    <span style={{ color: 'var(--muted)' }}>{row.m}</span>
                    <div style={styles.evolutionValues}>
                      <span style={{ color: 'var(--accent)' }}>+{money(row.income)}</span>
                      <span style={{ color: 'var(--red)' }}>−{money(row.expense)}</span>
                    </div>
                  </div>

                  <div style={styles.progBar}>
                    <div
                      style={{
                        ...styles.progFill,
                        width: `${(row.income / max) * 100}%`,
                        background: 'var(--accent)',
                        opacity: 0.4,
                      }}
                    />
                  </div>

                  <div style={{ ...styles.progBar, marginTop: 3 }}>
                    <div
                      style={{
                        ...styles.progFill,
                        width: `${(row.expense / max) * 100}%`,
                        background: 'var(--red)',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            <div style={styles.legendWrap}>
              <span style={styles.legendAccent}>
                <span style={{ ...styles.legendDot, background: 'var(--accent)' }} /> Receitas
              </span>
              <span style={styles.legendRed}>
                <span style={{ ...styles.legendDot, background: 'var(--red)' }} /> Despesas
              </span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Gastos por categoria</div>

          <div style={{ marginTop: 12 }}>
            {categories.length === 0 ? (
              <div style={styles.empty}>Nenhum gasto neste mês</div>
            ) : (
              categories.map(c => (
                <div key={c.name} style={styles.catRow}>
                  <div style={{ ...styles.catIcon, background: c.color + '22' }}>{c.icon}</div>
                  <div style={styles.catName}>{c.name}</div>

                  <div style={styles.catBar}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 3 }} />
                  </div>

                  <div style={styles.catValue}>{money(c.val)}</div>
                  <div style={styles.catPct}>{c.pct}%</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button style={styles.btnGhost}>📋 Exportar CSV</button>
        <button style={styles.btnPrimary}>📄 Gerar PDF</button>
      </div>
    </div>
  )
}