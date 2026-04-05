import { useState } from 'react'

const initialNotifs = [
  { id:1, read:false, icon:'⚠️', bg:'rgba(240,168,74,0.1)',  title:'Orçamento de Lazer em 83%',        body:'Você já usou R$415 dos R$500 disponíveis para Lazer este mês.', time:'Hoje às 14:32' },
  { id:2, read:false, icon:'🎉', bg:'rgba(74,240,196,0.1)',  title:'Meta MacBook quase concluída!',     body:'Você está a apenas R$700 de atingir sua meta do MacBook!',       time:'Hoje às 10:00' },
  { id:3, read:false, icon:'📊', bg:'rgba(46,99,232,0.1)',   title:'Resumo semanal disponível',         body:'Seu resumo da semana de 28 Mar – 4 Abr está pronto. Total: R$647,30.', time:'Hoje às 08:00' },
  { id:4, read:true,  icon:'✅', bg:'rgba(74,240,196,0.08)', title:'Transação registrada via WhatsApp', body:'R$89,00 em Alimentação foi registrado com sucesso.',            time:'Ontem às 14:32' },
  { id:5, read:true,  icon:'💡', bg:'rgba(240,106,106,0.08)',title:'Conta de luz vence em 6 dias',      body:'Lembrete: sua conta de luz de R$180 vence no dia 10 de Abril.', time:'29 Mar às 09:00' },
]

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifs)

  const unread = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={styles.badge}>{unread} não lidas</span>
        <button style={styles.btnGhost} onClick={markAllRead}>Marcar todas como lidas</button>
      </div>

      <div style={styles.card}>
        {notifs.map(n => (
          <div
            key={n.id}
            style={{ ...styles.notifItem, background: n.read ? 'transparent' : 'rgba(46,99,232,0.04)' }}
            onClick={() => markRead(n.id)}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
            <div style={{ ...styles.notifIcon, background: n.bg }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.notifTitle}>{n.title}</div>
              <div style={styles.notifBody}>{n.body}</div>
              <div style={styles.notifTime}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  badge:      { fontSize: 12, fontWeight: 600, color: 'var(--blue-l)', background: 'rgba(46,99,232,0.12)', border: '1px solid rgba(46,99,232,0.2)', padding: '4px 12px', borderRadius: 20 },
  btnGhost:   { background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 16px', color: 'var(--white)', fontSize: 13, cursor: 'pointer' },
  card:       { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' },
  notifItem:  { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderBottom: '1px solid rgba(91,139,245,0.07)', cursor: 'pointer', transition: 'background 0.15s' },
  notifIcon:  { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  notifTitle: { fontSize: 13, fontWeight: 600, marginBottom: 3 },
  notifBody:  { fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 },
  notifTime:  { fontSize: 11, color: 'var(--muted)', marginTop: 5 },
}