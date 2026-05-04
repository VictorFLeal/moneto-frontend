import { useState, useEffect } from 'react'
import { getTransactions, updateTransaction, deleteTransaction } from '../../services/api'

const categories = ['Todas', '🛒 Alimentação', '🚗 Transporte', '🏠 Moradia', '🎬 Lazer', '💊 Saúde', '💼 Trabalho']
const periods    = ['Semana', 'Mês', 'Ano']

export default function Transactions({ onAddTx }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch]             = useState('')
  const [cat, setCat]                   = useState('Todas')
  const [period, setPeriod]             = useState('Mês')
  const [loading, setLoading]           = useState(true)
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768)

  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const [editForm, setEditForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'DESPESA',
    categoria: '',
    data: '',
    origem: 'manual',
  })

  async function loadTransactions() {
    try {
      const res = await getTransactions()
      setTransactions(res.data || [])
    } catch (err) {
      console.error('Erro ao carregar transações:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    loadTransactions()

    return () => window.removeEventListener('resize', handleResize)
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

  function openEdit(t) {
    setEditing(t)
    setEditForm({
      descricao: t.descricao || '',
      valor: t.valor || '',
      tipo: t.tipo || 'DESPESA',
      categoria: t.categoria || '',
      data: t.data || '',
      origem: t.origem || 'manual',
    })
  }

  function closeEdit() {
    setEditing(null)
    setEditForm({
      descricao: '',
      valor: '',
      tipo: 'DESPESA',
      categoria: '',
      data: '',
      origem: 'manual',
    })
  }

  function setEditField(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  async function saveEdit() {
    if (!editing) return

    if (!editForm.descricao || !editForm.valor || !editForm.tipo || !editForm.categoria || !editForm.data) {
      alert('Preencha todos os campos.')
      return
    }

    setSavingEdit(true)

    try {
      await updateTransaction(editing.id, {
        descricao: editForm.descricao,
        valor: Number(editForm.valor),
        tipo: editForm.tipo,
        categoria: editForm.categoria,
        data: editForm.data,
        origem: editForm.origem || 'manual',
      })

      await loadTransactions()
      closeEdit()
    } catch (err) {
      console.error('Erro ao editar transação:', err)
      alert('Erro ao salvar alteração.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta transação?')

    if (!confirmDelete) return

    try {
      await deleteTransaction(id)
      await loadTransactions()
    } catch (err) {
      console.error('Erro ao excluir transação:', err)
      alert('Erro ao excluir transação.')
    }
  }

  const styles = {
    page: { width: '100%', maxWidth: '100%', overflowX: 'hidden' },
    g3: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 20 },
    statCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '18px 20px' : '18px 20px', position: 'relative', minWidth: 0, overflow: 'hidden' },
    statIcon: { fontSize: 20, marginBottom: 10, opacity: 0.6 },
    statLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 6 },
    statValue: { fontFamily: 'Syne, sans-serif', fontSize: isMobile ? 22 : 24, fontWeight: 800, letterSpacing: -1, whiteSpace: 'nowrap' },
    filters: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 170px auto 140px', gap: 10, alignItems: 'center', marginBottom: 16, width: '100%' },
    searchInput: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--white)', fontSize: 14, outline: 'none', width: '100%', minWidth: 0 },
    select: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--white)', fontSize: 14, outline: 'none', appearance: 'none', width: '100%', minWidth: 0 },
    tabs: { display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: 3, width: isMobile ? '100%' : 'fit-content' },
    tab: { padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: 'var(--muted)', flex: isMobile ? 1 : 'unset', textAlign: 'center' },
    tabActive: { background: 'var(--blue)', color: '#fff', fontWeight: 600 },
    btnAdd: { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: isMobile ? '100%' : 'auto' },
    card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '8px 14px' : '8px 16px', width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' },
    txItem: { display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14, padding: '12px 0', minWidth: 0 },
    txIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
    txInfo: { flex: 1, minWidth: 0 },
    txName: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    txCat: { fontSize: 11, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    txRight: { textAlign: 'right', flexShrink: 0, maxWidth: isMobile ? 105 : 'none' },
    txAmount: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' },
    txDate: { fontSize: 11, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap' },
    txActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
    actionBtn: { width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 },
    empty: { textAlign: 'center', padding: '48px 24px' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 14 : 24 },
    modal: { width: '100%', maxWidth: 520, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: isMobile ? 18 : 24 },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800 },
    closeBtn: { width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' },
    formGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 },
    fieldFull: { gridColumn: '1 / -1' },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 7 },
    modalInput: { width: '100%', boxSizing: 'border-box', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 13px', color: 'var(--white)', fontSize: 14, outline: 'none' },
    modalSelect: { width: '100%', boxSizing: 'border-box', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 13px', color: 'var(--white)', fontSize: 14, outline: 'none' },
    modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18, flexDirection: isMobile ? 'column' : 'row' },
    btnCancel: { background: 'var(--bg3)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto' },
    btnSave: { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: savingEdit ? 'not-allowed' : 'pointer', opacity: savingEdit ? 0.75 : 1, width: isMobile ? '100%' : 'auto' },
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 28 }}>⏳</div>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando transações...</div>
    </div>
  )

  return (
    <div style={styles.page}>
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
        <input style={styles.searchInput} placeholder="🔍 Buscar transação…" value={search} onChange={e => setSearch(e.target.value)} />

        <select style={styles.select} value={cat} onChange={e => setCat(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <div style={styles.tabs}>
          {periods.map(p => (
            <div key={p} style={{ ...styles.tab, ...(period === p ? styles.tabActive : {}) }} onClick={() => setPeriod(p)}>
              {p}
            </div>
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

                <div style={styles.txInfo}>
                  <div style={styles.txName}>{t.descricao}</div>
                  <div style={styles.txCat}>{t.categoria} · {t.origem === 'whatsapp' ? '📱 WhatsApp' : '✏️ Manual'}</div>
                </div>

                <div style={styles.txActions}>
                  <button style={styles.actionBtn} onClick={() => openEdit(t)}>✏️</button>
                  <button style={styles.actionBtn} onClick={() => handleDelete(t.id)}>🗑️</button>

                  <div style={styles.txRight}>
                    <div style={{ ...styles.txAmount, color: isNeg ? 'var(--red)' : 'var(--accent)' }}>
                      {isNeg ? '−' : '+'}R${Math.abs(Number(t.valor)).toFixed(2).replace('.', ',')}
                    </div>
                    <div style={styles.txDate}>{t.data}</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {editing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Editar transação</div>
              <button style={styles.closeBtn} onClick={closeEdit}>✕</button>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.fieldFull}>
                <label style={styles.label}>Descrição</label>
                <input style={styles.modalInput} value={editForm.descricao} onChange={e => setEditField('descricao', e.target.value)} />
              </div>

              <div>
                <label style={styles.label}>Valor</label>
                <input style={styles.modalInput} type="number" value={editForm.valor} onChange={e => setEditField('valor', e.target.value)} />
              </div>

              <div>
                <label style={styles.label}>Tipo</label>
                <select style={styles.modalSelect} value={editForm.tipo} onChange={e => setEditField('tipo', e.target.value)}>
                  <option value="DESPESA">Despesa</option>
                  <option value="RECEITA">Receita</option>
                </select>
              </div>

              <div>
                <label style={styles.label}>Categoria</label>
                <input style={styles.modalInput} value={editForm.categoria} onChange={e => setEditField('categoria', e.target.value)} />
              </div>

              <div>
                <label style={styles.label}>Data</label>
                <input style={styles.modalInput} type="date" value={editForm.data} onChange={e => setEditField('data', e.target.value)} />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={closeEdit}>Cancelar</button>
              <button style={styles.btnSave} onClick={saveEdit} disabled={savingEdit}>
                {savingEdit ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none }
        input::placeholder { color: rgba(122,154,191,0.35) !important }
        input:focus, select:focus {
          border-color: rgba(46,99,232,0.45) !important;
          box-shadow: 0 0 0 3px rgba(46,99,232,0.1) !important;
          outline: none !important;
        }
      `}</style>
    </div>
  )
}