import { useState } from 'react'

export default function TransactionModal({ open, onClose }) {
  const [form, setForm] = useState({
    type: 'Despesa', value: '', desc: '', cat: '🛒 Alimentação',
    date: new Date().toISOString().split('T')[0]
  })

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function handleSave() {
    if (!form.value || !form.desc) { alert('Preenche valor e descrição!'); return }
    onClose()
    setForm({ type: 'Despesa', value: '', desc: '', cat: '🛒 Alimentação', date: new Date().toISOString().split('T')[0] })
  }

  if (!open) return null

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        <div style={styles.header}>
          <span style={styles.title}>➕ Nova transação</span>
          <div style={styles.closeBtn} onClick={onClose}>✕</div>
        </div>

        <div style={styles.row}>
          <Field label="TIPO">
            <select style={styles.input} value={form.type} onChange={e => handle('type', e.target.value)}>
              <option>Despesa</option>
              <option>Receita</option>
            </select>
          </Field>
          <Field label="VALOR (R$)">
            <input style={styles.input} type="number" placeholder="0,00"
              value={form.value} onChange={e => handle('value', e.target.value)} />
          </Field>
        </div>

        <Field label="DESCRIÇÃO">
          <input style={styles.input} type="text" placeholder="Ex: Mercado, Uber, Salário…"
            value={form.desc} onChange={e => handle('desc', e.target.value)} />
        </Field>

        <div style={styles.row}>
          <Field label="CATEGORIA">
            <select style={styles.input} value={form.cat} onChange={e => handle('cat', e.target.value)}>
              {['🛒 Alimentação','🚗 Transporte','🏠 Moradia','🎬 Lazer',
                '💊 Saúde','📚 Educação','👕 Vestuário','💼 Trabalho',
                '📱 Tecnologia','💰 Salário','📦 Outros'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="DATA">
            <input style={styles.input} type="date"
              value={form.date} onChange={e => handle('date', e.target.value)} />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button style={styles.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={styles.btnPrimary} onClick={handleSave}>Salvar transação</button>
        </div>

      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(3,7,15,0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 20, padding: '28px 32px',
    width: '100%', maxWidth: 460,
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 8,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 14,
  },
  row: { display: 'flex', gap: 12, marginBottom: 14 },
  input: {
    width: '100%', background: 'var(--bg3)',
    border: '1px solid var(--border)', borderRadius: 9,
    padding: '11px 14px', color: 'var(--white)',
    fontSize: 14, outline: 'none', appearance: 'none',
    marginBottom: 14,
  },
  btnPrimary: {
    flex: 1, background: 'var(--blue)', color: '#fff',
    border: 'none', borderRadius: 10, padding: 13,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  btnGhost: {
    flex: 1, background: 'transparent',
    border: '1px solid var(--border)', borderRadius: 10,
    padding: 13, color: 'var(--white)',
    fontSize: 14, cursor: 'pointer',
  },
}