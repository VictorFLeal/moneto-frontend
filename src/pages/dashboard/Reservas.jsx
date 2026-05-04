import { useEffect, useState } from 'react'
import { getReserves, createReserve, updateReserve, deleteReserve, depositReserve, withdrawReserve } from '../../services/api'

export default function Reservas() {
  const [reserves, setReserves] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [meta, setMeta] = useState('')

  const [editingReserve, setEditingReserve] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editCategoria, setEditCategoria] = useState('')
  const [editMeta, setEditMeta] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function load() {
    try {
      const res = await getReserves()
      setReserves(res.data || [])
    } catch (err) {
      console.error('Erro ao carregar reservas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate() {
    if (!nome.trim() || !categoria.trim()) {
      alert('Preencha o nome e a categoria da reserva.')
      return
    }

    try {
      await createReserve({
        nome: nome.trim(),
        categoria: categoria.trim(),
        valorAtual: 0,
        meta: meta ? Number(meta) : null,
      })

      setNome('')
      setCategoria('')
      setMeta('')
      load()
    } catch (err) {
      console.error('Erro ao criar reserva:', err)
      alert('Erro ao criar reserva.')
    }
  }

  function openEdit(reserve) {
    setEditingReserve(reserve)
    setEditNome(reserve.nome || '')
    setEditCategoria(reserve.categoria || '')
    setEditMeta(reserve.meta || '')
  }

  function closeEdit() {
    setEditingReserve(null)
    setEditNome('')
    setEditCategoria('')
    setEditMeta('')
  }

  async function handleUpdate() {
    if (!editingReserve) return

    if (!editNome.trim() || !editCategoria.trim()) {
      alert('Preencha o nome e a categoria da reserva.')
      return
    }

    setSavingEdit(true)

    try {
      await updateReserve(editingReserve.id, {
        id: editingReserve.id,
        nome: editNome.trim(),
        categoria: editCategoria.trim(),
        valorAtual: editingReserve.valorAtual,
        meta: editMeta ? Number(editMeta) : null,
      })

      closeEdit()
      load()
    } catch (err) {
      console.error('Erro ao editar reserva:', err)
      alert('Erro ao editar reserva.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDelete(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta reserva?')

    if (!confirmar) return

    try {
      await deleteReserve(id)
      load()
    } catch (err) {
      console.error('Erro ao excluir reserva:', err)
      alert('Erro ao excluir reserva.')
    }
  }

  async function handleDeposit(id) {
    const valor = prompt('Valor para adicionar:')

    if (!valor || Number(valor) <= 0) return

    try {
      await depositReserve(id, Number(valor))
      load()
    } catch (err) {
      console.error('Erro ao adicionar valor:', err)
      alert('Erro ao adicionar valor.')
    }
  }

  async function handleWithdraw(id) {
    const valor = prompt('Valor para retirar:')

    if (!valor || Number(valor) <= 0) return

    try {
      await withdrawReserve(id, Number(valor))
      load()
    } catch (err) {
      console.error('Erro ao retirar valor:', err)
      alert('Erro ao retirar valor.')
    }
  }

  function format(v) {
    return Number(v || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const totalReservado = reserves.reduce(
    (total, r) => total + Number(r.valorAtual || 0),
    0
  )

  const totalMetas = reserves.reduce(
    (total, r) => total + Number(r.meta || 0),
    0
  )

  const styles = {
    wrap: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 20 : 22,
      fontWeight: 800,
      marginBottom: 4,
    },
    subtitle: {
      color: 'var(--muted)',
      fontSize: 14,
      lineHeight: 1.6,
    },
    g2: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16,
      marginBottom: 16,
    },
    gStats: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
      gap: 16,
      marginBottom: 20,
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 18 : 24,
      backdropFilter: 'blur(12px)',
      minWidth: 0,
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
      background: 'rgba(74,240,196,0.2)',
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
      color: 'var(--accent)',
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
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(91,139,245,0.14)',
      borderRadius: 10,
      padding: '11px 14px',
      color: 'var(--white)',
      fontSize: 14,
      outline: 'none',
    },
    btn: {
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '11px 18px',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 0 20px rgba(46,99,232,0.25)',
      width: isMobile ? '100%' : 'fit-content',
    },
    reserveGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 16,
    },
    reserveCard: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 18 : 22,
      backdropFilter: 'blur(12px)',
      minWidth: 0,
    },
    reserveTop: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
    },
    reserveIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: 'rgba(74,240,196,0.1)',
      border: '1px solid rgba(74,240,196,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      flexShrink: 0,
    },
    reserveName: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 15,
      fontWeight: 800,
      marginBottom: 4,
      wordBreak: 'break-word',
    },
    reserveCat: {
      fontSize: 12,
      color: 'var(--muted)',
      wordBreak: 'break-word',
    },
    amount: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 4,
    },
    meta: {
      fontSize: 12,
      color: 'var(--muted)',
      marginBottom: 10,
    },
    progBar: {
      height: 6,
      background: 'rgba(91,139,245,0.1)',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 10,
    },
    progFill: {
      height: '100%',
      borderRadius: 3,
      background: 'var(--accent)',
      transition: 'width 0.5s ease',
    },
    actions: {
      display: 'flex',
      gap: 8,
      flexDirection: isMobile ? 'column' : 'row',
      marginTop: 14,
    },
    btnSmall: {
      flex: 1,
      background: 'rgba(46,99,232,0.12)',
      color: 'var(--blue-l)',
      border: '1px solid rgba(46,99,232,0.25)',
      borderRadius: 9,
      padding: '9px 12px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
    },
    btnDanger: {
      flex: 1,
      background: 'rgba(240,106,106,0.08)',
      color: 'var(--red)',
      border: '1px solid rgba(240,106,106,0.2)',
      borderRadius: 9,
      padding: '9px 12px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
    },
    btnEdit: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: 'rgba(46,99,232,0.12)',
      color: 'var(--blue-l)',
      border: '1px solid rgba(46,99,232,0.25)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      flexShrink: 0,
    },
    btnDeleteIcon: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: 'rgba(240,106,106,0.08)',
      color: 'var(--red)',
      border: '1px solid rgba(240,106,106,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      flexShrink: 0,
    },
    empty: {
      textAlign: 'center',
      padding: isMobile ? '28px 16px' : '36px 20px',
      color: 'var(--muted)',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? 14 : 24,
    },
    modal: {
      width: '100%',
      maxWidth: 520,
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 18,
      padding: isMobile ? 18 : 24,
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 18,
    },
    modalTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 17,
      fontWeight: 800,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      color: 'var(--muted)',
      cursor: 'pointer',
      fontSize: 15,
    },
    modalActions: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 18,
      flexDirection: isMobile ? 'column' : 'row',
    },
    btnCancel: {
      background: 'var(--bg3)',
      color: 'var(--muted)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 18px',
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    },
    btnSave: {
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '10px 18px',
      fontSize: 13,
      fontWeight: 700,
      cursor: savingEdit ? 'not-allowed' : 'pointer',
      opacity: savingEdit ? 0.75 : 1,
      width: isMobile ? '100%' : 'auto',
      boxShadow: '0 0 20px rgba(46,99,232,0.25)',
    },
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando reservas...</div>
      </div>
    )
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cofrinho MONETO 💰</h2>
        <p style={styles.subtitle}>
          Separe dinheiro para objetivos importantes sem perder o controle do seu mês.
        </p>
      </div>

      <div style={styles.gStats}>
        <div style={styles.statCard}>
          <div style={styles.statGlow} />
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statLabel}>Total reservado</div>
          <div style={styles.statValue}>R$ {format(totalReservado)}</div>
          <div style={styles.statChange}>Dinheiro guardado</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statGlow} />
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statLabel}>Metas cadastradas</div>
          <div style={styles.statValue}>{reserves.length}</div>
          <div style={styles.statChange}>Reservas ativas</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statGlow} />
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statLabel}>Meta total</div>
          <div style={styles.statValue}>R$ {format(totalMetas)}</div>
          <div style={styles.statChange}>Objetivos planejados</div>
        </div>
      </div>

      <div style={styles.g2}>
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Nova reserva</span>
          </div>

          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Nome da reserva"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Categoria: Reserva de emergência, Viagem, Investimentos..."
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Meta opcional"
              value={meta}
              onChange={e => setMeta(e.target.value)}
            />

            <button style={styles.btn} onClick={handleCreate}>
              Criar reserva
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Categorias sugeridas</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'Reserva de emergência',
              'Viagem',
              'Investimentos',
              'Quitar dívidas',
              'Compra futura',
              'Outros',
            ].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '7px 14px',
                  fontSize: 13,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {reserves.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💰</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 6 }}>
            Nenhuma reserva ainda
          </div>
          <div style={{ fontSize: 13 }}>
            Crie seu primeiro cofrinho para começar a separar dinheiro.
          </div>
        </div>
      ) : (
        <div style={styles.reserveGrid}>
          {reserves.map(r => {
            const percentual = r.meta
              ? Math.min((Number(r.valorAtual || 0) / Number(r.meta || 1)) * 100, 100)
              : 0

            return (
              <div key={r.id} style={styles.reserveCard}>
                <div style={styles.reserveTop}>
                  <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                    <div style={styles.reserveIcon}>💰</div>

                    <div style={{ minWidth: 0 }}>
                      <div style={styles.reserveName}>{r.nome}</div>
                      <div style={styles.reserveCat}>{r.categoria}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button style={styles.btnEdit} onClick={() => openEdit(r)} title="Editar reserva">
                      ✏️
                    </button>

                    <button style={styles.btnDeleteIcon} onClick={() => handleDelete(r.id)} title="Excluir reserva">
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={styles.amount}>R$ {format(r.valorAtual)}</div>

                {r.meta && (
                  <>
                    <div style={styles.meta}>
                      Meta: R$ {format(r.meta)} · {percentual.toFixed(0)}%
                    </div>

                    <div style={styles.progBar}>
                      <div style={{ ...styles.progFill, width: `${percentual}%` }} />
                    </div>
                  </>
                )}

                <div style={styles.actions}>
                  <button style={styles.btnSmall} onClick={() => handleDeposit(r.id)}>
                    + Adicionar
                  </button>

                  <button style={styles.btnDanger} onClick={() => handleWithdraw(r.id)}>
                    - Retirar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editingReserve && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Editar reserva</div>
              <button style={styles.closeBtn} onClick={closeEdit}>✕</button>
            </div>

            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Nome da reserva"
                value={editNome}
                onChange={e => setEditNome(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Categoria"
                value={editCategoria}
                onChange={e => setEditCategoria(e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Meta opcional"
                value={editMeta}
                onChange={e => setEditMeta(e.target.value)}
              />
            </div>

            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={closeEdit}>
                Cancelar
              </button>

              <button style={styles.btnSave} onClick={handleUpdate} disabled={savingEdit}>
                {savingEdit ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none }
        input::placeholder { color: rgba(122,154,191,0.35) !important }
        input:focus { border-color: rgba(46,99,232,0.45) !important; box-shadow: 0 0 0 3px rgba(46,99,232,0.1) !important; outline: none !important }
      `}</style>
    </div>
  )
}