import { useEffect, useMemo, useState } from 'react'
import { getTransactions } from '../../services/api'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const catIcon = {
  Alimentação: { icon: '🛒', bg: 'rgba(74,240,196,0.1)' },
  Transporte: { icon: '🚗', bg: 'rgba(46,99,232,0.1)' },
  Lazer: { icon: '🎬', bg: 'rgba(240,168,74,0.1)' },
  Moradia: { icon: '🏠', bg: 'rgba(91,139,245,0.1)' },
  Saúde: { icon: '💊', bg: 'rgba(240,106,106,0.1)' },
  Educação: { icon: '📚', bg: 'rgba(46,99,232,0.1)' },
  Trabalho: { icon: '💼', bg: 'rgba(74,240,196,0.1)' },
  Tecnologia: { icon: '💻', bg: 'rgba(91,139,245,0.1)' },
  Salário: { icon: '💰', bg: 'rgba(74,240,196,0.1)' },
  Freelance: { icon: '🧾', bg: 'rgba(240,168,74,0.1)' },
  Investimento: { icon: '📈', bg: 'rgba(74,240,196,0.1)' },
  Outros: { icon: '📦', bg: 'rgba(91,139,245,0.1)' },
}

export default function Calendar() {
  const today = new Date()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
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
        console.error('Erro ao carregar calendário:', err)
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t.data) return false
      const date = new Date(`${t.data}T00:00:00`)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
  }, [transactions, currentMonth, currentYear])

  const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

  const selectedDayTransactions = useMemo(() => {
    return monthTransactions.filter(t => t.data === selectedDate)
  }, [monthTransactions, selectedDate])

  const transactionDays = useMemo(() => {
    return new Set(
      monthTransactions.map(t => {
        const date = new Date(`${t.data}T00:00:00`)
        return date.getDate()
      })
    )
  }, [monthTransactions])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()
    const prevTotalDays = new Date(currentYear, currentMonth, 0).getDate()

    const prevDays = Array.from({ length: firstDay }, (_, i) => ({
      day: prevTotalDays - firstDay + i + 1,
      current: false,
    }))

    const currentDays = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      current: true,
    }))

    return [...prevDays, ...currentDays]
  }, [currentMonth, currentYear])

  const upcoming = useMemo(() => {
    const todayKey = new Date()
    todayKey.setHours(0, 0, 0, 0)

    return transactions
      .filter(t => {
        if (!t.data) return false
        const date = new Date(`${t.data}T00:00:00`)
        return date >= todayKey
      })
      .sort((a, b) => new Date(`${a.data}T00:00:00`) - new Date(`${b.data}T00:00:00`))
      .slice(0, 5)
  }, [transactions])

  function previousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
    setSelectedDay(1)
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
    setSelectedDay(1)
  }

  function getTxStyle(categoria) {
    return catIcon[categoria] || catIcon.Outros
  }

  function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
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
    g2: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16,
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 14 : 20,
      minWidth: 0,
      overflow: 'hidden',
    },
    calHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 10,
    },
    calNav: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: 18,
      flexShrink: 0,
    },
    calTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 13 : 14,
      fontWeight: 700,
      textAlign: 'center',
    },
    daysHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      textAlign: 'center',
      marginBottom: 6,
    },
    dayLabel: {
      fontSize: isMobile ? 10 : 11,
      fontWeight: 600,
      color: 'var(--muted)',
      padding: '4px 0',
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: isMobile ? 3 : 2,
      textAlign: 'center',
    },
    day: {
      padding: isMobile ? '7px 0' : '8px 2px',
      fontSize: isMobile ? 12 : 13,
      borderRadius: 8,
      cursor: 'pointer',
      color: 'var(--muted)',
      minHeight: isMobile ? 30 : 30,
      minWidth: 0,
    },
    dayMuted: {
      opacity: 0.25,
      cursor: 'default',
    },
    daySelected: {
      background: 'var(--blue)',
      color: '#fff',
      fontWeight: 700,
    },
    dayTodayBorder: {
      border: '1px solid var(--blue)',
      color: 'var(--white)',
    },
    txDot: {
      position: 'absolute',
      bottom: 2,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'var(--accent)',
      display: 'block',
    },
    sectionTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 14,
    },
    dayHeader: {
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 10,
      flexDirection: isMobile ? 'column' : 'row',
    },
    txItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid rgba(91,139,245,0.07)',
      minWidth: 0,
    },
    txIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      flexShrink: 0,
    },
    txInfo: {
      flex: 1,
      minWidth: 0,
    },
    txName: {
      fontSize: 13,
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    txCat: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    txValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 13 : 14,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    badge: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--blue-l)',
      background: 'rgba(46,99,232,0.12)',
      border: '1px solid rgba(46,99,232,0.2)',
      padding: '3px 10px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
    },
    empty: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--muted)',
      fontSize: 13,
    },
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: 30 }}>⏳</div>
        <div style={{ color: 'var(--muted)' }}>Carregando calendário...</div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.g2}>
        <div>
          <div style={styles.card}>
            <div style={styles.calHeader}>
              <div style={styles.calNav} onClick={previousMonth}>‹</div>
              <div style={styles.calTitle}>
                {monthNames[currentMonth]} {currentYear}
              </div>
              <div style={styles.calNav} onClick={nextMonth}>›</div>
            </div>

            <div style={styles.daysHeader}>
              {weekDays.map(d => (
                <div key={d} style={styles.dayLabel}>{d}</div>
              ))}
            </div>

            <div style={styles.daysGrid}>
              {calendarDays.map((d, index) => {
                const isSelected = d.current && d.day === selectedDay
                const isToday =
                  d.current &&
                  d.day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear()

                return (
                  <div
                    key={`${d.current ? 'c' : 'p'}-${d.day}-${index}`}
                    style={{
                      ...styles.day,
                      ...(!d.current ? styles.dayMuted : {}),
                      ...(isSelected ? styles.daySelected : {}),
                      ...(isToday && !isSelected ? styles.dayTodayBorder : {}),
                      position: 'relative',
                    }}
                    onClick={() => d.current && setSelectedDay(d.day)}
                  >
                    {d.day}

                    {d.current && transactionDays.has(d.day) && (
                      <span style={styles.txDot} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.sectionTitle}>📌 Próximos lançamentos</div>

            {upcoming.length === 0 ? (
              <div style={styles.empty}>Nenhum lançamento futuro encontrado</div>
            ) : (
              upcoming.map(t => {
                const txStyle = getTxStyle(t.categoria)
                const isExpense = t.tipo === 'DESPESA'

                return (
                  <div key={t.id} style={styles.txItem}>
                    <div style={{ ...styles.txIcon, background: txStyle.bg }}>{txStyle.icon}</div>

                    <div style={styles.txInfo}>
                      <div style={styles.txName}>{t.descricao || 'Sem descrição'}</div>
                      <div style={styles.txCat}>
                        {t.categoria || 'Outros'} · {formatDate(t.data)}
                      </div>
                    </div>

                    <div
                      style={{
                        ...styles.txValue,
                        color: isExpense ? 'var(--red)' : 'var(--accent)',
                      }}
                    >
                      {isExpense ? '−' : '+'}{money(t.valor)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.dayHeader}>
            <div style={styles.sectionTitle}>
              📅 Dia {selectedDay} de {monthNames[currentMonth]}
            </div>

            <span style={styles.badge}>
              {selectedDayTransactions.length} transação{selectedDayTransactions.length !== 1 ? 'ões' : ''}
            </span>
          </div>

          {selectedDayTransactions.length === 0 ? (
            <div style={styles.empty}>Nenhuma transação neste dia</div>
          ) : (
            selectedDayTransactions.map(t => {
              const txStyle = getTxStyle(t.categoria)
              const isExpense = t.tipo === 'DESPESA'

              return (
                <div key={t.id} style={styles.txItem}>
                  <div style={{ ...styles.txIcon, background: txStyle.bg }}>{txStyle.icon}</div>

                  <div style={styles.txInfo}>
                    <div style={styles.txName}>{t.descricao || 'Sem descrição'}</div>
                    <div style={styles.txCat}>{t.categoria || 'Outros'}</div>
                  </div>

                  <div
                    style={{
                      ...styles.txValue,
                      color: isExpense ? 'var(--red)' : 'var(--accent)',
                    }}
                  >
                    {isExpense ? '−' : '+'}{money(t.valor)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}