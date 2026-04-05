import { useState } from 'react'

const initialGoals = [
  { id:1, icon:'✈️', title:'Viagem a Portugal',      sub:'Meta até Dezembro 2025', cur:3200,  max:8000,  color:'var(--accent)' },
  { id:2, icon:'🏠', title:'Reserva de emergência',  sub:'6 meses de despesas',    cur:8400,  max:12000, color:'var(--blue-l)' },
  { id:3, icon:'💻', title:'Novo MacBook',            sub:'Meta até Junho 2025',    cur:5800,  max:6500,  color:'var(--accent2)' },
]

const completed = [
  { id:4, icon:'🚗', title:'Fundo para carro', date:'Concluída em Março 2025', val:'R$ 15.000' },
]

export default function Goals() {
  const [goals] = useState(initialGoals)

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{goals.length} metas ativas · {completed.length} concluída este mês</span>
        <button style={styles.btnAdd}>➕ Nova meta</button>
      </div>

      {/* Metas ativas */}
      <div style={styles.g2}>
        {goals.map(g => {
          const pct = Math.round((g.cur / g.max) * 100)
          return (
            <div key={g.id} style={styles.goalCard}>
              <div style={styles.goalHeader}>
                <div style={{ ...styles.goalIcon, background: `${g.color}22` }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.goalTitle}>{g.title}</div>
                  <div style={styles.goalSub}>{g.sub}</div>
                </div>
                <button style={styles.editBtn}>✏️</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                <div style={{ ...styles.goalValue, color: g.color }}>
                  R$ {g.cur.toLocaleString('pt-BR')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>de R$ {g.max.toLocaleString('pt-BR')}</div>
              </div>
              <div style={styles.progBar}>
                <div style={{ ...styles.progFill, width: `${pct}%`, background: g.color }} />
              </div>
              <div style={{ fontSize: 12, color: g.color, marginTop: 6 }}>
                {pct}% concluído · Faltam R$ {(g.max - g.cur).toLocaleString('pt-BR')}
              </div>
            </div>
          )
        })}

        {/* Adicionar nova */}
        <div style={styles.goalCardEmpty}>
          <div style={{ fontSize: 32, opacity: 0.25, marginBottom: 8 }}>➕</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Adicionar nova meta</div>
        </div>
      </div>

      {/* Concluídas */}
      <div style={{ marginTop: 24 }}>
        <div style={styles.sectionTitle}>🏆 Concluídas</div>
        <div style={styles.card}>
          {completed.map(c => (
            <div key={c.id} style={styles.txItem}>
              <div style={{ ...styles.txIcon, background: 'rgba(74,240,196,0.1)' }}>✅</div>
              <div style={{ flex: 1 }}>
                <div style={styles.txName}>{c.title}</div>
                <div style={styles.txCat}>{c.date}</div>
              </div>
              <span style={styles.badge}>{c.val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

const styles = {
  g2:           { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  goalCard:     { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 },
  goalCardEmpty:{ background: 'var(--card)', border: '1px dashed rgba(91,139,245,0.25)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, cursor: 'pointer' },
  goalHeader:   { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  goalIcon:     { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  goalTitle:    { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
  goalSub:      { fontSize: 12, color: 'var(--muted)', marginTop: 2 },
  goalValue:    { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 },
  progBar:      { height: 8, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' },
  progFill:     { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  editBtn:      { background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 13, color: 'var(--white)' },
  btnAdd:       { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 },
  card:         { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 16px' },
  txItem:       { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' },
  txIcon:       { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  txName:       { fontSize: 13, fontWeight: 600 },
  txCat:        { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  badge:        { fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'rgba(74,240,196,0.1)', border: '1px solid rgba(74,240,196,0.2)', padding: '3px 10px', borderRadius: 20 },
}