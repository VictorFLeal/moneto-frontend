import { useState } from 'react'

export default function Notifications() {
  const [notifs, setNotifs] = useState([])

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        {unread > 0 ? (
          <span style={styles.badge}>{unread} não lida{unread !== 1 ? 's' : ''}</span>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Nenhuma notificação nova</span>
        )}
        {notifs.length > 0 && (
          <button style={styles.btnGhost} onClick={markAllRead}>Marcar todas como lidas</button>
        )}
      </div>

      <div style={styles.card}>
        {notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }}>🔔</div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nenhuma notificação ainda</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>
              As notificações aparecerão aqui quando houver alertas<br />de orçamento, metas e resumos financeiros.
            </div>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} style={{ ...styles.notifItem, background: n.read ? 'transparent' : 'rgba(46,99,232,0.04)' }}
              onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? {...x, read: true} : x))}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ ...styles.notifIcon, background: n.bg }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.notifTitle}>{n.title}</div>
                <div style={styles.notifBody}>{n.body}</div>
                <div style={styles.notifTime}>{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  badge:      { fontSize: 12, fontWeight: 600, color: 'var(--blue-l)', background: 'rgba(46,99,232,0.12)', border: '1px solid rgba(46,99,232,0.2)', padding: '4px 12px', borderRadius: 20 },
  btnGhost:   { background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 16px', color: 'var(--white)', fontSize: 13, cursor: 'pointer' },
  card:       { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' },
  notifItem:  { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', borderBottom: '1px solid rgba(91,139,245,0.07)', cursor: 'pointer' },
  notifIcon:  { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  notifTitle: { fontSize: 13, fontWeight: 600, marginBottom: 3 },
  notifBody:  { fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 },
  notifTime:  { fontSize: 11, color: 'var(--muted)', marginTop: 5 },
}