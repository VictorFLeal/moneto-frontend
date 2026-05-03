import { useEffect, useState } from 'react'
import {
  getBusinessEntries,
  createBusinessEntry,
  updateBusinessEntry,
  deleteBusinessEntry,
  getBusinessSummary,
} from '../../services/api'

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: '📊', desc: 'KPIs principais e receitas vs despesas da empresa' },
  { id: 'cashflow', label: 'Fluxo de Caixa', icon: '💸', desc: 'Entradas e saídas por período' },
  { id: 'payables', label: 'Contas', icon: '🧾', desc: 'Contas a pagar e receber com status' },
  { id: 'dre', label: 'DRE', icon: '📈', desc: 'Demonstrativo de resultado simplificado da empresa' },
  { id: 'distribution', label: 'Distribuição', icon: '🎯', desc: 'Sugestão de distribuição do lucro' },
  { id: 'taxes', label: 'Impostos', icon: '🏛️', desc: 'Obrigações fiscais cadastradas' },
  { id: 'ai', label: 'IA Empresarial', icon: '🤖', desc: 'Insights com base nos dados cadastrados' },
]

function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function normalizeEntry(e) {
  return {
    id: e.id,
    descricao: e.descricao || 'Sem descrição',
    tipo: e.tipo || 'DESPESA',
    categoria: e.categoria || 'Outros',
    valor: toNumber(e.valor),
    data: e.data,
    vencimento: e.vencimento,
    status: e.status || 'pendente',
  }
}

export default function Business() {
  const [activeTab, setActiveTab] = useState('overview')
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState({
    receitas: 0,
    despesas: 0,
    impostos: 0,
    lucro: 0,
    caixa: 0,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    descricao: '',
    tipo: 'RECEITA',
    categoria: '',
    valor: '',
    data: '',
    vencimento: '',
    status: 'pendente',
  })

  const current = tabs.find(t => t.id === activeTab)

  const receitas = entries.filter(e => e.tipo === 'RECEITA')
  const despesas = entries.filter(e => e.tipo === 'DESPESA')
  const impostos = entries.filter(e => e.tipo === 'IMPOSTO')
  const contasReceber = entries.filter(e => e.tipo === 'RECEITA')
  const contasPagar = entries.filter(e => e.tipo !== 'RECEITA')

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [entriesRes, summaryRes] = await Promise.all([
        getBusinessEntries(),
        getBusinessSummary(),
      ])

      setEntries((entriesRes.data || []).map(normalizeEntry))
      setSummary(summaryRes.data || {})
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar dados empresariais.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function showSuccessMsg(msg) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 2500)
  }

  function showErrorMsg(msg) {
    setError(msg)
    setTimeout(() => setError(''), 3500)
  }

  async function saveEntry() {
    if (!form.descricao || !form.valor) {
      showErrorMsg('Preenche descrição e valor.')
      return
    }

    try {
      setSaving(true)

      await createBusinessEntry({
        descricao: form.descricao,
        tipo: form.tipo,
        categoria: form.categoria || 'Outros',
        valor: toNumber(form.valor),
        data: form.data || null,
        vencimento: form.vencimento || null,
        status: form.status || 'pendente',
      })

      setForm({
        descricao: '',
        tipo: 'RECEITA',
        categoria: '',
        valor: '',
        data: '',
        vencimento: '',
        status: 'pendente',
      })

      setShowAdd(false)
      showSuccessMsg('Registro empresarial salvo.')
      await loadData()
    } catch (err) {
      console.error(err)
      showErrorMsg('Erro ao salvar registro.')
    } finally {
      setSaving(false)
    }
  }

  async function markDone(entry) {
    try {
      setSaving(true)

      await updateBusinessEntry(entry.id, {
        descricao: entry.descricao,
        tipo: entry.tipo,
        categoria: entry.categoria,
        valor: entry.valor,
        data: entry.data,
        vencimento: entry.vencimento,
        status: entry.tipo === 'RECEITA' ? 'recebido' : 'pago',
      })

      showSuccessMsg('Status atualizado.')
      await loadData()
    } catch (err) {
      console.error(err)
      showErrorMsg('Erro ao atualizar status.')
    } finally {
      setSaving(false)
    }
  }

  async function removeEntry(entry) {
    const ok = window.confirm(`Excluir "${entry.descricao}"?`)
    if (!ok) return

    try {
      setSaving(true)
      await deleteBusinessEntry(entry.id)
      showSuccessMsg('Registro removido.')
      await loadData()
    } catch (err) {
      console.error(err)
      showErrorMsg('Erro ao excluir registro.')
    } finally {
      setSaving(false)
    }
  }

  const kpis = [
    {
      label: 'Receita do mês',
      value: `R$ ${money(summary.receitas)}`,
      icon: '💰',
      color: 'var(--accent)',
      glow: 'rgba(74,240,196,0.2)',
      change: `${receitas.length} receita(s)`,
      up: true,
    },
    {
      label: 'Despesas totais',
      value: `R$ ${money(summary.despesas)}`,
      icon: '📤',
      color: 'var(--red)',
      glow: 'rgba(240,106,106,0.2)',
      change: `${despesas.length + impostos.length} saída(s)`,
      up: false,
    },
    {
      label: 'Lucro líquido',
      value: `R$ ${money(summary.lucro)}`,
      icon: '💎',
      color: Number(summary.lucro || 0) >= 0 ? 'var(--accent)' : 'var(--red)',
      glow: 'rgba(74,240,196,0.2)',
      change: Number(summary.receitas || 0) > 0
        ? `Margem: ${Math.round((Number(summary.lucro || 0) / Number(summary.receitas || 1)) * 100)}%`
        : 'Sem receita',
      up: Number(summary.lucro || 0) >= 0,
    },
    {
      label: 'Caixa atual',
      value: `R$ ${money(summary.caixa)}`,
      icon: '🏦',
      color: 'var(--blue-l)',
      glow: 'rgba(91,139,245,0.2)',
      change: Number(summary.caixa || 0) >= 0 ? 'Positivo' : 'Negativo',
      up: Number(summary.caixa || 0) >= 0,
    },
  ]

  const distribution = [
    { label: 'Reserva da empresa (20%)', val: Number(summary.lucro || 0) * 0.2, color: 'var(--blue-l)', icon: '🏦', pct: 20 },
    { label: 'Reinvestimento (30%)', val: Number(summary.lucro || 0) * 0.3, color: 'var(--accent)', icon: '📈', pct: 30 },
    { label: 'Pró-labore (25%)', val: Number(summary.lucro || 0) * 0.25, color: 'var(--accent2)', icon: '👤', pct: 25 },
    { label: 'Fundo de emergência (15%)', val: Number(summary.lucro || 0) * 0.15, color: 'var(--blue-xl)', icon: '🛡️', pct: 15 },
    { label: 'Disponível (10%)', val: Number(summary.lucro || 0) * 0.1, color: 'var(--muted)', icon: '💳', pct: 10 },
  ]

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando modo empresa...</div>
        <style>{spinStyle}</style>
      </div>
    )
  }

  return (
    <div>
      {(error || success) && (
        <div style={{
          ...styles.toast,
          background: success ? 'rgba(74,240,196,0.10)' : 'rgba(240,106,106,0.10)',
          border: success ? '1px solid rgba(74,240,196,0.25)' : '1px solid rgba(240,106,106,0.25)',
          color: success ? 'var(--accent)' : 'var(--red)',
        }}>
          {success || error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ background: 'rgba(240,168,74,0.15)', border: '1px solid rgba(240,168,74,0.3)', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>
              🏢 MONETO Business
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{current?.desc}</p>
        </div>

        <button
          style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setShowAdd(v => !v)}
        >
          + Nova transação empresarial
        </button>
      </div>

      <div style={{ display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <div
            key={t.id}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              color: activeTab === t.id ? '#fff' : 'var(--muted)',
              background: activeTab === t.id ? 'var(--blue)' : 'transparent',
              fontWeight: activeTab === t.id ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.18s',
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{ ...styles.card, marginBottom: 20, background: 'var(--bg3)' }}>
          <div style={styles.sectionTitle}>+ Nova transação empresarial</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <input style={styles.input} placeholder="Descrição" value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} />

            <select style={styles.input} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
              <option value="IMPOSTO">Imposto</option>
            </select>

            <input style={styles.input} placeholder="Categoria" value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} />

            <input style={styles.input} type="number" placeholder="Valor" value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} />

            <input style={styles.input} type="date" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />

            <input style={styles.input} type="date" value={form.vencimento} onChange={e => setForm(p => ({ ...p, vencimento: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={styles.secondaryBtn} onClick={() => setShowAdd(false)} disabled={saving}>Cancelar</button>
            <button style={styles.primaryBtn} onClick={saveEntry} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🏢</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Nenhum dado empresarial cadastrado</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 560, margin: '0 auto 18px', lineHeight: 1.6 }}>
            Cadastre receitas, despesas e impostos da empresa para o Moneto gerar KPIs, DRE, fluxo de caixa e recomendações.
          </p>
          <button style={styles.primaryBtn} onClick={() => setShowAdd(true)}>+ Adicionar primeiro registro</button>
        </div>
      )}

      {activeTab === 'overview' && entries.length > 0 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: k.glow, filter: 'blur(40px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, opacity: 0.5 }}>{k.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 10 }}>{k.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: -1, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 12, marginTop: 8, color: k.up ? 'var(--accent)' : 'var(--red)' }}>{k.change}</div>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>📊 Receitas vs Despesas por categoria</div>
            <div style={{ marginTop: 14 }}>
              {entries.map(e => {
                const max = Math.max(...entries.map(x => x.valor), 1)
                const isIn = e.tipo === 'RECEITA'
                const color = isIn ? 'var(--accent)' : e.tipo === 'IMPOSTO' ? 'var(--accent2)' : 'var(--red)'

                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {isIn ? '💰' : e.tipo === 'IMPOSTO' ? '🏛️' : '📤'}
                    </div>
                    <div style={{ flex: 1, fontSize: 13 }}>{e.categoria}</div>
                    <div style={{ flex: 2, height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden', margin: '0 10px' }}>
                      <div style={{ height: '100%', width: `${(e.valor / max) * 100}%`, background: color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color, minWidth: 90, textAlign: 'right' }}>
                      {isIn ? '+' : '−'}R${money(e.valor)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cashflow' && entries.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>💸 Fluxo de caixa</div>
          <div style={{ marginTop: 14 }}>
            {entries.map(e => (
              <EntryRow key={e.id} entry={e} markDone={markDone} removeEntry={removeEntry} saving={saving} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payables' && entries.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ListCard title="📤 Contas a pagar" items={contasPagar} type="out" markDone={markDone} removeEntry={removeEntry} saving={saving} />
          <ListCard title="📥 Contas a receber" items={contasReceber} type="in" markDone={markDone} removeEntry={removeEntry} saving={saving} />
        </div>
      )}

      {activeTab === 'dre' && entries.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>📈 DRE — Demonstrativo de Resultado</div>

          <DreLine label="Receita Bruta" value={summary.receitas} type="in" bold />
          <DreLine label="Despesas" value={-Math.max(Number(summary.despesas || 0) - Number(summary.impostos || 0), 0)} type="out" />
          <DreLine label="Impostos" value={-Number(summary.impostos || 0)} type="out" />
          <DreLine label="Lucro líquido" value={summary.lucro} type={Number(summary.lucro || 0) >= 0 ? 'in' : 'out'} bold separator />
        </div>
      )}

      {activeTab === 'distribution' && entries.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>💡 Como distribuir o lucro</div>

          {Number(summary.lucro || 0) <= 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginTop: 14 }}>
              Ainda não há lucro positivo para distribuir. Primeiro ajuste despesas e aumente receitas.
            </p>
          ) : (
            distribution.map(d => (
              <div key={d.label} style={{ marginBottom: 16, marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>{d.icon} {d.label}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: d.color }}>R$ {money(d.val)}</span>
                </div>
                <div style={{ height: 7, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4 }} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'taxes' && entries.length > 0 && (
        <ListCard title="🏛️ Impostos cadastrados" items={impostos} type="tax" markDone={markDone} removeEntry={removeEntry} saving={saving} />
      )}

      {activeTab === 'ai' && entries.length > 0 && (
        <div>
          <div style={{ ...styles.card, marginBottom: 16, background: 'linear-gradient(135deg, rgba(46,99,232,0.1), rgba(74,240,196,0.05))', border: '1px solid rgba(46,99,232,0.2)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>🤖 MONETO IA — Modo Empresa</div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>Análise baseada nos registros reais da empresa</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Insight
              icon={Number(summary.lucro || 0) >= 0 ? '✅' : '⚠️'}
              title={Number(summary.lucro || 0) >= 0 ? 'Empresa positiva' : 'Resultado negativo'}
              body={
                Number(summary.lucro || 0) >= 0
                  ? `Seu lucro atual é de R$ ${money(summary.lucro)}. Considere reservar parte para caixa e reinvestimento.`
                  : `Seu resultado atual está negativo em R$ ${money(Math.abs(Number(summary.lucro || 0)))}. Revise despesas e impostos cadastrados.`
              }
            />
            <Insight
              icon="💡"
              title="Controle de caixa"
              body={`Receitas: R$ ${money(summary.receitas)} | Saídas: R$ ${money(summary.despesas)}. O Moneto recomenda acompanhar vencimentos semanalmente.`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function EntryRow({ entry, markDone, removeEntry, saving }) {
  const isIn = entry.tipo === 'RECEITA'
  const color = isIn ? 'var(--accent)' : entry.tipo === 'IMPOSTO' ? 'var(--accent2)' : 'var(--red)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
        {isIn ? '📥' : entry.tipo === 'IMPOSTO' ? '🏛️' : '📤'}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.descricao}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{entry.categoria} · {entry.status}</div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color }}>
          {isIn ? '+' : '−'}R$ {money(entry.valor)}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {entry.status === 'pendente' && (
            <button style={styles.miniBtn} onClick={() => markDone(entry)} disabled={saving}>
              {isIn ? 'Receber' : 'Pagar'}
            </button>
          )}
          <button style={styles.dangerMiniBtn} onClick={() => removeEntry(entry)} disabled={saving}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

function ListCard({ title, items, markDone, removeEntry, saving }) {
  return (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>{title}</div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>Nenhum registro encontrado.</p>
      ) : (
        items.map(e => (
          <EntryRow key={e.id} entry={e} markDone={markDone} removeEntry={removeEntry} saving={saving} />
        ))
      )}
    </div>
  )
}

function DreLine({ label, value, type, bold, separator }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: separator ? '14px 0 10px' : '10px 0',
      borderTop: separator ? '1px solid var(--border)' : 'none',
    }}>
      <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: bold ? 16 : 14, fontWeight: bold ? 800 : 600, color: type === 'in' ? 'var(--accent)' : 'var(--red)' }}>
        {Number(value || 0) >= 0 ? '+' : ''}R$ {money(value)}
      </span>
    </div>
  )
}

function Insight({ icon, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: 18, background: 'rgba(46,99,232,0.1)', border: '1px solid rgba(46,99,232,0.2)', borderRadius: 14 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div>
        <strong style={{ fontSize: 15, display: 'block', marginBottom: 6, fontFamily: 'Syne, sans-serif' }}>{title}</strong>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{body}</p>
      </div>
    </div>
  )
}

const spinStyle = `
  @keyframes spin { to { transform: rotate(360deg) } }
`

const styles = {
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
  input: {
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: '10px 13px',
    color: 'var(--white)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  },
  primaryBtn: {
    flex: 1,
    background: 'var(--blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    padding: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryBtn: {
    flex: 1,
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: 10,
    color: 'var(--white)',
    fontSize: 13,
    cursor: 'pointer',
  },
  miniBtn: {
    background: 'rgba(91,139,245,0.12)',
    border: '1px solid rgba(91,139,245,0.25)',
    color: 'var(--blue-l)',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerMiniBtn: {
    background: 'rgba(240,106,106,0.10)',
    border: '1px solid rgba(240,106,106,0.25)',
    color: 'var(--red)',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
  empty: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 36,
    textAlign: 'center',
  },
  loading: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 34,
    height: 34,
    border: '3px solid rgba(255,255,255,0.08)',
    borderTopColor: 'var(--blue)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  toast: {
    position: 'fixed',
    right: 24,
    bottom: 24,
    zIndex: 999,
    padding: '12px 18px',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    backdropFilter: 'blur(10px)',
  },
}