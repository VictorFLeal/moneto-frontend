const txDay = [2, 4, 7, 9, 10, 14, 15, 17, 20, 22, 25, 28]

const upcoming = [
  { icon:'💡', name:'Conta de luz',  date:'Vence em 10 Abr', val:-180, bg:'rgba(240,106,106,0.1)' },
  { icon:'📱', name:'Plano celular', date:'Vence em 15 Abr', val:-79,  bg:'rgba(46,99,232,0.1)' },
  { icon:'🏠', name:'Aluguel',       date:'Vence em 1 Mai',  val:-1200,bg:'rgba(240,168,74,0.1)' },
]

const dayTx = [
  { icon:'🛒', name:'iFood',     cat:'Alimentação', val:-45.90, bg:'rgba(74,240,196,0.1)' },
  { icon:'🚗', name:'Uber',      cat:'Transporte',  val:-28.50, bg:'rgba(46,99,232,0.1)' },
]

export default function Calendar() {
  const firstDay = 2
  const totalDays = 30
  const prevDays = [29, 30, 31].slice(-firstDay)

  return (
    <div style={styles.g2}>

      <div>
        {/* Calendário */}
        <div style={styles.card}>
          <div style={styles.calHeader}>
            <div style={styles.calNav}>‹</div>
            <div style={styles.calTitle}>Abril 2025</div>
            <div style={styles.calNav}>›</div>
          </div>
          <div style={styles.daysHeader}>
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
              <div key={d} style={styles.dayLabel}>{d}</div>
            ))}
          </div>
          <div style={styles.daysGrid}>
            {prevDays.map(d => (
              <div key={'p'+d} style={{ ...styles.day, opacity: 0.25 }}>{d}</div>
            ))}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => (
              <div key={d} style={{
                ...styles.day,
                ...(d === 4 ? styles.dayToday : {}),
                position: 'relative',
              }}>
                {d}
                {txDay.includes(d) && d !== 4 && (
                  <span style={styles.txDot} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vencimentos */}
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={styles.sectionTitle}>📌 Próximos vencimentos</div>
          {upcoming.map(u => (
            <div key={u.name} style={styles.txItem}>
              <div style={{ ...styles.txIcon, background: u.bg }}>{u.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.txName}>{u.name}</div>
                <div style={styles.txCat}>{u.date}</div>
              </div>
              <div style={{ color: 'var(--red)', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>
                R${Math.abs(u.val).toLocaleString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transações do dia */}
      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={styles.sectionTitle}>📅 Dia 4 de Abril</div>
          <span style={styles.badge}>{dayTx.length} transações</span>
        </div>
        {dayTx.map(t => (
          <div key={t.name} style={styles.txItem}>
            <div style={{ ...styles.txIcon, background: t.bg }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.txName}>{t.name}</div>
              <div style={styles.txCat}>{t.cat}</div>
            </div>
            <div style={{ color: 'var(--red)', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>
              −R${Math.abs(t.val).toFixed(2).replace('.', ',')}
            </div>
          </div>
        ))}
        {dayTx.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontSize: 13 }}>
            Nenhuma transação neste dia
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  g2:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:        { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 },
  calHeader:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  calNav:      { width: 28, height: 28, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 },
  calTitle:    { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 },
  daysHeader:  { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 6 },
  dayLabel:    { fontSize: 11, fontWeight: 600, color: 'var(--muted)', padding: '4px 0' },
  daysGrid:    { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' },
  day:         { padding: '6px 2px', fontSize: 13, borderRadius: 8, cursor: 'pointer', color: 'var(--muted)' },
  dayToday:    { background: 'var(--blue)', color: '#fff', fontWeight: 700 },
  txDot:       { position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'block' },
  sectionTitle:{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 14 },
  txItem:      { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' },
  txIcon:      { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  txName:      { fontSize: 13, fontWeight: 600 },
  txCat:       { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  badge:       { fontSize: 12, fontWeight: 600, color: 'var(--blue-l)', background: 'rgba(46,99,232,0.12)', border: '1px solid rgba(46,99,232,0.2)', padding: '3px 10px', borderRadius: 20 },
}