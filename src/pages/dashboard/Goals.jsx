import { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../../services/api'

export default function Goals() {
  const [goals, setGoals]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({ titulo: '', icone: '🎯', valorMeta: '', prazo: '' })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await getGoals()
      setGoals(res.data)
    } catch (err) {
      console.error('Erro ao carregar metas:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!newGoal.titulo || !newGoal.valorMeta) return
    try {
      await createGoal({
        titulo: newGoal.titulo,
        icone: newGoal.icone,
        valorMeta: parseFloat(newGoal.valorMeta),
        valorAtual: 0,
        prazo: newGoal.prazo || null,
        status: 'ativa',
      })
      setNewGoal({ titulo: '', icone: '🎯', valorMeta: '', prazo: '' })
      setShowAdd(false)
      load()
    } catch (err) {
      alert('Erro ao criar meta.')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Apagar esta meta?')) return
    try {
      await deleteGoal(id)
      load()
    } catch (err) {
      alert('Erro ao apagar meta.')
    }
  }

  const active    = goals.filter(g => g.status === 'ativa')
  const completed = goals.filter(g => g.status === 'concluida')

  const colors = ['var(--accent)', 'var(--blue-l)', 'var(--accent2)', 'var(--red)', '#a855f7']

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 28 }}>⏳</div>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando metas...</div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {active.length} meta{active.length !== 1 ? 's' : ''} ativa{active.length !== 1 ? 's' : ''}
          {completed.length > 0 ? ` · ${completed.length} concluída${completed.length !== 1 ? 's' : ''}` : ''}
        </span>
        <button style={styles.btnAdd} onClick={() => setShowAdd(v => !v)}>➕ Nova meta</button>
      </div>

      {/* Formulário nova meta */}
      {showAdd && (
        <div style={{ ...styles.card, marginBottom: 16, background: 'var(--bg3)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Nova meta</div>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, marginBottom: 10 }}>
            <input style={styles.input} placeholder="🎯" value={newGoal.icone} onChange={e => setNewGoal(p => ({...p, icone: e.target.value}))} />
            <input style={styles.input} placeholder="Nome da meta" value={newGoal.titulo} onChange={e => setNewGoal(p => ({...p, titulo: e.target.value}))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <input style={styles.input} type="number" placeholder="Valor meta (R$)" value={newGoal.valorMeta} onChange={e => setNewGoal(p => ({...p, valorMeta: e.target.value}))} />
            <input style={styles.input} type="date" value={newGoal.prazo} onChange={e => setNewGoal(p => ({...p, prazo: e.target.value}))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.btnGhost} onClick={() => setShowAdd(false)}>Cancelar</button>
            <button style={styles.btnPrimary} onClick={handleCreate}>Criar meta</button>
          </div>
        </div>
      )}

      {/* Metas ativas */}
      {active.length === 0 && !showAdd ? (
        <div style={{ ...styles.card, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }}>🎯</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Nenhuma meta criada ainda</div>
          <button style={styles.btnAdd} onClick={() => setShowAdd(true)}>Criar primeira meta</button>
        </div>
      ) : (
        <div style={styles.g2}>
          {active.map((g, i) => {
            const pct   = g.valorMeta > 0 ? Math.min(Math.round((g.valorAtual / g.valorMeta) * 100), 100) : 0
            const color = colors[i % colors.length]
            const left  = g.valorMeta - g.valorAtual
            return (
              <div key={g.id} style={styles.goalCard}>
                <div style={styles.goalHeader}>
                  <div style={{ ...styles.goalIcon, background: color + '22' }}>{g.icone || '🎯'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.goalTitle}>{g.titulo}</div>
                    <div style={styles.goalSub}>{g.prazo ? `Meta até ${g.prazo}` : 'Sem prazo definido'}</div>
                  </div>
                  <button style={styles.editBtn} onClick={() => handleDelete(g.id)} title="Apagar">🗑️</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color }}>
                    R$ {Number(g.valorAtual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    de R$ {Number(g.valorMeta).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div style={styles.progBar}>
                  <div style={{ ...styles.progFill, width: `${pct}%`, background: color }} />
                </div>
                <div style={{ fontSize: 12, color, marginTop: 6 }}>
                  {pct}% concluído {left > 0 ? `· Faltam R$ ${left.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '· Meta atingida! 🎉'}
                </div>
              </div>
            )
          })}

          <div style={{ ...styles.goalCard, border: '1px dashed rgba(91,139,245,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, cursor: 'pointer' }} onClick={() => setShowAdd(true)}>
            <div style={{ fontSize: 32, opacity: 0.25, marginBottom: 8 }}>➕</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Adicionar nova meta</div>
          </div>
        </div>
      )}

      {/* Concluídas */}
      {completed.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🏆 Concluídas</div>
          <div style={styles.card}>
            {completed.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(74,240,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{g.titulo}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Meta: R$ {Number(g.valorMeta).toLocaleString('pt-BR')}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'rgba(74,240,196,0.1)', border: '1px solid rgba(74,240,196,0.2)', padding: '3px 10px', borderRadius: 20 }}>
                  Concluída
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  g2:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  goalCard:  { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 },
  goalHeader:{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  goalIcon:  { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  goalTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
  goalSub:   { fontSize: 12, color: 'var(--muted)', marginTop: 2 },
  progBar:   { height: 8, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' },
  progFill:  { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  editBtn:   { background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 13, color: 'var(--white)' },
  btnAdd:    { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnPrimary:{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnGhost:  { background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 20px', color: 'var(--white)', fontSize: 14, cursor: 'pointer' },
  card:      { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 16px' },
  input:     { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 13px', color: 'var(--white)', fontSize: 14, outline: 'none' },
}