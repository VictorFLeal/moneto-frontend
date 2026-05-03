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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [form, setForm] = useState({
    descricao: '',
    tipo: 'RECEITA',
    categoria: '',
    valor: '',
    data: '',
    vencimento: '',
    status: 'pendente',
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const styles = {
    page: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
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
      right: isMobile ? 12 : 24,
      bottom: isMobile ? 12 : 24,
      left: isMobile ? 12 : 'auto',
      zIndex: 999,
      padding: '12px 18px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      backdropFilter: 'blur(10px)',
    },
    topHeader: {
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 20,
      flexWrap: 'wrap',
      gap: 12,
      flexDirection: isMobile ? 'column' : 'row',
    },
    businessBadge: {
      background: 'rgba(240,168,74,0.15)',
      border: '1px solid rgba(240,168,74,0.3)',
      borderRadius: 10,
      padding: '6px 14px',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--accent2)',
      width: 'fit-content',
    },
    addButton: {
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 9,
      padding: '9px 18px',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    },
    tabs: {
      display: 'flex',
      gap: 3,
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
      flexWrap: 'wrap',
      width: '100%',
    },
    tab: {
      padding: isMobile ? '8px 10px' : '8px 14px',
      borderRadius: 8,
      fontSize: 13,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      transition: 'all 0.18s',
      flex: isMobile ? '1 0 45%' : 'unset',
      textAlign: 'center',
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 16 : 22,
      minWidth: 0,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 15,
      fontWeight: 700,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 10,
      marginTop: 14,
    },
    buttonRow: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexDirection: isMobile ? 'column' : 'row',
    },
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
    empty: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 24 : 36,
      textAlign: 'center',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)',
      gap: 16,
      marginBottom: 20,
    },
    kpiCard: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? '18px 20px' : '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
    },
    kpiGlow: {
      position: 'absolute',
      top: -30,
      right: -30,
      width: 100,
      height: 100,
      borderRadius: '50%',
      filter: 'blur(40px)',
      pointerEvents: 'none',
    },
    kpiIcon: {
      position: 'absolute',
      top: 18,
      right: 18,
      fontSize: 22,
      opacity: 0.5,
    },
    kpiLabel: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: 'var(--muted)',
      marginBottom: 10,
    },
    kpiValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 21 : 24,
      fontWeight: 800,
      letterSpacing: -1,
      wordBreak: 'break-word',
    },
    chartRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '32px 1fr auto' : '32px 1fr 2fr 90px',
      alignItems: 'center',
      gap: 10,
      padding: '10px 0',
      borderBottom: '1px solid rgba(91,139,245,0.07)',
    },
    chartIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      flexShrink: 0,
    },
    chartName: {
      fontSize: 13,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    chartBar: {
      height: 6,
      background: 'rgba(91,139,245,0.1)',
      borderRadius: 3,
      overflow: 'hidden',
      display: isMobile ? 'none' : 'block',
    },
    chartValue: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    twoGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16,
    },
    entryRow: {
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid rgba(91,139,245,0.07)',
      minWidth: 0,
    },
    entryIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      flexShrink: 0,
    },
    entryInfo: {
      flex: 1,
      minWidth: 0,
    },
    entryTitle: {
      fontSize: 13,
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    entrySub: {
      fontSize: 11,
      color: 'var(--muted)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    entryRight: {
      textAlign: 'right',
      flexShrink: 0,
      maxWidth: isMobile ? 110 : 'none',
    },
    entryActions: {
      display: 'flex',
      gap: 6,
      marginTop: 6,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
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
    dreLine: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
    },
    distributionRow: {
      marginBottom: 16,
      marginTop: 14,
    },
    distributionTop: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6,
      gap: 12,
      flexDirection: isMobile ? 'column' : 'row',
    },
    aiHeader: {
      background: 'linear-gradient(135deg, rgba(46,99,232,0.1), rgba(74,240,196,0.05))',
      border: '1px solid rgba(46,99,232,0.2)',
      borderRadius: 16,
      padding: isMobile ? 16 : 22,
      marginBottom: 16,
    },
    insight: {
      display: 'flex',
      gap: 14,
      padding: isMobile ? 16 : 18,
      background: 'rgba(46,99,232,0.1)',
      border: '1px solid rgba(46,99,232,0.2)',
      borderRadius: 14,
    },
  }

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
    <div style={styles.page}>
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

      <div style={styles.topHeader}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={styles.businessBadge}>🏢 MONETO Business</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{current?.desc}</p>
        </div>

        <button style={styles.addButton} onClick={() => setShowAdd(v => !v)}>
          + Nova transação empresarial
        </button>
      </div>

      <div style={styles.tabs}>
        {tabs.map(t => (
          <div
            key={t.id}
            style={{
              ...styles.tab,
              color: activeTab === t.id ? '#fff' : 'var(--muted)',
              background: activeTab === t.id ? 'var(--blue)' : 'transparent',
              fontWeight: activeTab === t.id ? 600 : 400,
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

          <div style={styles.formGrid}>
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

          <div style={styles.buttonRow}>
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
          <div style={styles.kpiGrid}>
            {kpis.map(k => (
              <div key={k.label} style={styles.kpiCard}>
                <div style={{ ...styles.kpiGlow, background: k.glow }} />
                <div style={styles.kpiIcon}>{k.icon}</div>
                <div style={styles.kpiLabel}>{k.label}</div>
                <div style={{ ...styles.kpiValue, color: k.color }}>{k.value}</div>
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
                  <div key={e.id} style={styles.chartRow}>
                    <div style={{ ...styles.chartIcon, background: color + '22' }}>
                      {isIn ? '💰' : e.tipo === 'IMPOSTO' ? '🏛️' : '📤'}
                    </div>
                    <div style={styles.chartName}>{e.categoria}</div>
                    <div style={styles.chartBar}>
                      <div style={{ height: '100%', width: `${(e.valor / max) * 100}%`, background: color, borderRadius: 3 }} />
                    </div>
                    <div style={{ ...styles.chartValue, color }}>
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
              <EntryRow key={e.id} entry={e} markDone={markDone} removeEntry={removeEntry} saving={saving} styles={styles} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payables' && entries.length > 0 && (
        <div style={styles.twoGrid}>
          <ListCard title="📤 Contas a pagar" items={contasPagar} markDone={markDone} removeEntry={removeEntry} saving={saving} styles={styles} />
          <ListCard title="📥 Contas a receber" items={contasReceber} markDone={markDone} removeEntry={removeEntry} saving={saving} styles={styles} />
        </div>
      )}

      {activeTab === 'dre' && entries.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>📈 DRE — Demonstrativo de Resultado</div>

          <DreLine label="Receita Bruta" value={summary.receitas} type="in" bold styles={styles} />
          <DreLine label="Despesas" value={-Math.max(Number(summary.despesas || 0) - Number(summary.impostos || 0), 0)} type="out" styles={styles} />
          <DreLine label="Impostos" value={-Number(summary.impostos || 0)} type="out" styles={styles} />
          <DreLine label="Lucro líquido" value={summary.lucro} type={Number(summary.lucro || 0) >= 0 ? 'in' : 'out'} bold separator styles={styles} />
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
              <div key={d.label} style={styles.distributionRow}>
                <div style={styles.distributionTop}>
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
        <ListCard title="🏛️ Impostos cadastrados" items={impostos} markDone={markDone} removeEntry={removeEntry} saving={saving} styles={styles} />
      )}

      {activeTab === 'ai' && entries.length > 0 && (
        <div>
          <div style={styles.aiHeader}>
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
              styles={styles}
            />
            <Insight
              icon="💡"
              title="Controle de caixa"
              body={`Receitas: R$ ${money(summary.receitas)} | Saídas: R$ ${money(summary.despesas)}. O Moneto recomenda acompanhar vencimentos semanalmente.`}
              styles={styles}
            />
          </div>
        </div>
      )}

      <style>{spinStyle}</style>
    </div>
  )
}

function EntryRow({ entry, markDone, removeEntry, saving, styles }) {
  const isIn = entry.tipo === 'RECEITA'
  const color = isIn ? 'var(--accent)' : entry.tipo === 'IMPOSTO' ? 'var(--accent2)' : 'var(--red)'

  return (
    <div style={styles.entryRow}>
      <div style={{ ...styles.entryIcon, background: color + '22' }}>
        {isIn ? '📥' : entry.tipo === 'IMPOSTO' ? '🏛️' : '📤'}
      </div>

      <div style={styles.entryInfo}>
        <div style={styles.entryTitle}>{entry.descricao}</div>
        <div style={styles.entrySub}>{entry.categoria} · {entry.status}</div>
      </div>

      <div style={styles.entryRight}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color, whiteSpace: 'nowrap' }}>
          {isIn ? '+' : '−'}R$ {money(entry.valor)}
        </div>
        <div style={styles.entryActions}>
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

function ListCard({ title, items, markDone, removeEntry, saving, styles }) {
  return (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>{title}</div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>Nenhum registro encontrado.</p>
      ) : (
        items.map(e => (
          <EntryRow key={e.id} entry={e} markDone={markDone} removeEntry={removeEntry} saving={saving} styles={styles} />
        ))
      )}
    </div>
  )
}

function DreLine({ label, value, type, bold, separator, styles }) {
  return (
    <div style={{
      ...styles.dreLine,
      padding: separator ? '14px 0 10px' : '10px 0',
      borderTop: separator ? '1px solid var(--border)' : 'none',
    }}>
      <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: bold ? 16 : 14, fontWeight: bold ? 800 : 600, color: type === 'in' ? 'var(--accent)' : 'var(--red)', whiteSpace: 'nowrap' }}>
        {Number(value || 0) >= 0 ? '+' : ''}R$ {money(value)}
      </span>
    </div>
  )
}

function Insight({ icon, title, body, styles }) {
  return (
    <div style={styles.insight}>
      <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div>
        <strong style={{ fontSize: 15, display: 'block', marginBottom: 6, fontFamily: 'Syne, sans-serif' }}>{title}</strong>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{body}</p>
      </div>
    </div>
  )
}

const spinStyle = `
  @keyframes spin { to { transform: rotate(360deg) } }
`