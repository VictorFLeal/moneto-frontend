import { useEffect, useState } from 'react'
import { getDebts, createDebt, updateDebt, deleteDebt } from '../../services/api'

const strategies = [
  {
    id: 'avalanche',
    icon: '🏔️',
    title: 'Método Avalanche',
    sub: 'Paga primeiro a maior taxa de juros',
    benefit: 'Economiza mais dinheiro no total',
    tag: 'Recomendado pela IA',
    tagColor: 'var(--accent)',
    desc: 'Matematicamente ótimo. Elimina os juros mais caros primeiro, reduzindo o total pago ao longo do tempo. Ideal para quem tem disciplina e foco em economizar.'
  },
  {
    id: 'snowball',
    icon: '⛄',
    title: 'Método Bola de Neve',
    sub: 'Paga primeiro a menor dívida',
    benefit: 'Gera motivação com vitórias rápidas',
    tag: 'Mais popular',
    tagColor: 'var(--accent2)',
    desc: 'Psicologicamente eficaz. Cada dívida quitada gera motivação para continuar. Ideal para quem precisa de impulso emocional para manter o foco.'
  },
  {
    id: 'hibrido',
    icon: '⚡',
    title: 'Método Híbrido',
    sub: 'Combina Avalanche + Bola de Neve',
    benefit: 'Equilíbrio entre economia e motivação',
    tag: 'Avançado',
    tagColor: 'var(--blue-l)',
    desc: 'Quita dívidas pequenas rapidamente para ganhar motivação, depois foca nas de maior juros. O melhor dos dois mundos.'
  },
]

const tips = [
  {
    icon: '💡',
    title: 'Negocia as taxas',
    body: 'Muitos bancos aceitam renegociação. Liga para o banco e pede redução de juros antes de aceitar parcelamentos ruins.'
  },
  {
    icon: '🔄',
    title: 'Portabilidade de crédito',
    body: 'Se uma dívida tem juros muito altos, vale comparar com empréstimo pessoal ou portabilidade para reduzir o custo.'
  },
  {
    icon: '📱',
    title: 'Registra todo pagamento',
    body: 'Sempre que pagar uma parcela, atualiza o valor pago para o Moneto recalcular teu progresso.'
  },
  {
    icon: '🎯',
    title: 'Prioriza uma dívida por vez',
    body: 'Pagar várias ao mesmo tempo pode dar sensação de esforço sem avanço. Escolhe uma principal e acelera nela.'
  },
]

const colors = ['#f06a6a', '#f0a84a', '#5b8bf5', '#8b5cf6', '#4af0c4']

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

function inferCategory(nome) {
  const n = String(nome || '').toLowerCase()

  if (n.includes('cartão') || n.includes('cartao') || n.includes('nubank') || n.includes('inter')) {
    return 'Cartão'
  }

  if (n.includes('empréstimo') || n.includes('emprestimo') || n.includes('financiamento')) {
    return 'Empréstimo'
  }

  if (n.includes('curso') || n.includes('faculdade')) {
    return 'Educação'
  }

  return 'Outros'
}

function mapDebtFromApi(d, index) {
  return {
    id: d.id,
    name: d.nome || 'Dívida sem nome',
    total: toNumber(d.valorTotal),
    paid: toNumber(d.valorPago),
    rate: toNumber(d.taxaJuros),
    minPayment: toNumber(d.pagamentoMinimo),
    due: d.vencimento || 'Dia 10',
    status: d.status || 'ativa',
    category: inferCategory(d.nome),
    color: colors[index % colors.length],
  }
}

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [strategy, setStrategy] = useState('avalanche')
  const [extraBudget, setExtraBudget] = useState(500)
  const [showAdd, setShowAdd] = useState(false)
  const [activeTab, setActiveTab] = useState('plano')

  const [paymentModal, setPaymentModal] = useState(null)
  const [paymentValue, setPaymentValue] = useState('')

  const [newDebt, setNewDebt] = useState({
    name: '',
    total: '',
    rate: '',
    minPayment: '',
    due: '',
    category: '',
  })

  async function loadDebts() {
    try {
      setLoading(true)
      setError('')

      const res = await getDebts()
      const mapped = (res.data || []).map(mapDebtFromApi)

      setDebts(mapped)
    } catch (err) {
      console.error(err)
      setError('Não consegui carregar suas dívidas agora.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDebts()
  }, [])

  function showSuccess(msg) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 2500)
  }

  function showError(msg) {
    setError(msg)
    setTimeout(() => setError(''), 3500)
  }

  async function addDebt() {
    if (!newDebt.name || !newDebt.total) {
      showError('Preenche pelo menos o nome e o valor total da dívida.')
      return
    }

    try {
      setSaving(true)

      await createDebt({
        nome: newDebt.name,
        valorTotal: toNumber(newDebt.total),
        valorPago: 0,
        taxaJuros: toNumber(newDebt.rate),
        pagamentoMinimo: toNumber(newDebt.minPayment),
        vencimento: newDebt.due || 'Dia 10',
        status: 'ativa',
      })

      setNewDebt({
        name: '',
        total: '',
        rate: '',
        minPayment: '',
        due: '',
        category: '',
      })

      setShowAdd(false)
      showSuccess('Dívida cadastrada com sucesso.')
      await loadDebts()
    } catch (err) {
      console.error(err)
      showError('Erro ao cadastrar dívida.')
    } finally {
      setSaving(false)
    }
  }

  async function registerPayment(debt, value) {
    const payment = toNumber(value)

    if (!payment || payment <= 0) {
      showError('Digite um valor válido para pagamento.')
      return
    }

    try {
      setSaving(true)

      const newPaid = Math.min(debt.total, debt.paid + payment)

      await updateDebt(debt.id, {
        nome: debt.name,
        valorTotal: debt.total,
        valorPago: newPaid,
        taxaJuros: debt.rate,
        pagamentoMinimo: debt.minPayment,
        vencimento: debt.due,
        status: newPaid >= debt.total ? 'quitada' : 'ativa',
      })

      setPaymentModal(null)
      setPaymentValue('')
      showSuccess('Pagamento registrado.')
      await loadDebts()
    } catch (err) {
      console.error(err)
      showError('Erro ao registrar pagamento.')
    } finally {
      setSaving(false)
    }
  }

  async function payMinimum(debt) {
    await registerPayment(debt, debt.minPayment || 0)
  }

  async function payOffDebt(debt) {
    const remaining = debt.total - debt.paid
    await registerPayment(debt, remaining)
  }

  async function reactivateDebt(debt) {
    try {
      setSaving(true)

      await updateDebt(debt.id, {
        nome: debt.name,
        valorTotal: debt.total,
        valorPago: debt.paid,
        taxaJuros: debt.rate,
        pagamentoMinimo: debt.minPayment,
        vencimento: debt.due,
        status: 'ativa',
      })

      showSuccess('Dívida reativada.')
      await loadDebts()
    } catch (err) {
      console.error(err)
      showError('Erro ao reativar dívida.')
    } finally {
      setSaving(false)
    }
  }

  async function removeDebt(debt) {
    const ok = window.confirm(`Excluir a dívida "${debt.name}"?`)
    if (!ok) return

    try {
      setSaving(true)
      await deleteDebt(debt.id)
      showSuccess('Dívida removida.')
      await loadDebts()
    } catch (err) {
      console.error(err)
      showError('Erro ao remover dívida.')
    } finally {
      setSaving(false)
    }
  }

  const activeDebts = debts.filter(d => d.status !== 'quitada')
  const paidDebts = debts.filter(d => d.status === 'quitada')

  const totalDebt = activeDebts.reduce((sum, d) => sum + d.total, 0)
  const totalPaid = activeDebts.reduce((sum, d) => sum + d.paid, 0)
  const totalLeft = totalDebt - totalPaid
  const totalPct = totalDebt ? Math.round((totalPaid / totalDebt) * 100) : 0
  const totalMin = activeDebts.reduce((sum, d) => sum + d.minPayment, 0)

  const paidTotalDebt = paidDebts.reduce((sum, d) => sum + d.total, 0)

  const monthsToFree = totalLeft > 0
    ? Math.ceil(totalLeft / Math.max(extraBudget + totalMin, 1))
    : 0

  const sorted = (() => {
    if (strategy === 'avalanche') {
      return [...activeDebts].sort((a, b) => b.rate - a.rate)
    }

    if (strategy === 'snowball') {
      return [...activeDebts].sort((a, b) => {
        return (a.total - a.paid) - (b.total - b.paid)
      })
    }

    const smallFirst = [...activeDebts].sort((a, b) => {
      return (a.total - a.paid) - (b.total - b.paid)
    })

    const highRate = [...activeDebts].sort((a, b) => b.rate - a.rate)

    const first = smallFirst[0]

    if (!first) return []

    return [
      first,
      ...highRate.filter(d => d.id !== first.id),
    ]
  })()

  const tabs = [
    { id: 'plano', label: '📋 Plano de quitação' },
    { id: 'simular', label: '🔢 Simulador' },
    { id: 'dicas', label: '💡 Dicas da IA' },
    { id: 'historico', label: '📈 Progresso' },
  ]

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner} />
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando dívidas...</div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          {
            label: 'Total em dívidas',
            value: `R$ ${money(totalLeft)}`,
            color: 'var(--red)',
            icon: '💸',
            sub: `de R$ ${money(totalDebt)} ativas`,
          },
          {
            label: 'Já quitado',
            value: `R$ ${money(paidTotalDebt)}`,
            color: 'var(--accent)',
            icon: '✅',
            sub: `${paidDebts.length} dívida(s) quitada(s)`,
          },
          {
            label: 'Previsão liberdade',
            value: activeDebts.length ? `${monthsToFree} meses` : '—',
            color: 'var(--accent2)',
            icon: '🗓️',
            sub: 'com orçamento extra',
          },
          {
            label: 'Mínimo mensal',
            value: `R$ ${money(totalMin)}`,
            color: 'var(--blue-l)',
            icon: '💳',
            sub: 'pagamento mínimo total',
          },
        ].map(s => (
          <div key={s.label} style={styles.kpiCard}>
            <div style={{ fontSize: 20, marginBottom: 8, opacity: 0.6 }}>{s.icon}</div>
            <div style={styles.kpiLabel}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -1, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>
            Progresso geral de quitação
          </span>
          <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>{totalPct}%</span>
        </div>

        <div style={{ height: 10, background: 'rgba(91,139,245,0.1)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${totalPct}%`,
            background: 'linear-gradient(90deg, var(--blue), var(--accent))',
            borderRadius: 5,
            transition: 'width 0.6s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
          <span>R$ {money(totalPaid)} pago em dívidas ativas</span>
          <span>R$ {money(totalDebt)} total ativo</span>
        </div>
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
            {t.label}
          </div>
        ))}
      </div>

      {activeDebts.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>💸</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
            Nenhuma dívida ativa
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.6 }}>
            Cadastre uma nova dívida para o Moneto montar uma estratégia de quitação, simular cenários e acompanhar teu progresso.
          </p>
          <button style={styles.primaryBtn} onClick={() => setShowAdd(true)}>
            ➕ Adicionar dívida
          </button>
        </div>
      )}

      {showAdd && (
        <div style={{ ...styles.card, marginBottom: 20, background: 'var(--bg3)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            ➕ Nova dívida
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input style={styles.input} placeholder="Nome da dívida" value={newDebt.name} onChange={e => setNewDebt(p => ({ ...p, name: e.target.value }))} />
            <input style={styles.input} placeholder="Categoria (Cartão, Empréstimo...)" value={newDebt.category} onChange={e => setNewDebt(p => ({ ...p, category: e.target.value }))} />
            <input style={styles.input} type="number" placeholder="Valor total (R$)" value={newDebt.total} onChange={e => setNewDebt(p => ({ ...p, total: e.target.value }))} />
            <input style={styles.input} type="number" placeholder="Taxa de juros (% a.m.)" value={newDebt.rate} onChange={e => setNewDebt(p => ({ ...p, rate: e.target.value }))} />
            <input style={styles.input} type="number" placeholder="Pagamento mínimo" value={newDebt.minPayment} onChange={e => setNewDebt(p => ({ ...p, minPayment: e.target.value }))} />
            <input style={styles.input} placeholder="Vencimento (ex: Dia 10)" value={newDebt.due} onChange={e => setNewDebt(p => ({ ...p, due: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.secondaryBtn} onClick={() => setShowAdd(false)} disabled={saving}>Cancelar</button>
            <button style={styles.primaryBtn} onClick={addDebt} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar dívida'}
            </button>
          </div>
        </div>
      )}

      {activeDebts.length > 0 && activeTab === 'plano' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>🧠 Escolhe a estratégia</div>

              {strategies.map(s => (
                <div
                  key={s.id}
                  style={{
                    ...styles.stratCard,
                    border: `1px solid ${strategy === s.id ? 'var(--blue)' : 'var(--border)'}`,
                    background: strategy === s.id ? 'rgba(46,99,232,0.1)' : 'var(--bg3)',
                  }}
                  onClick={() => setStrategy(s.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={styles.stratIcon}>{s.icon}</div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: 14 }}>{s.title}</strong>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: s.tagColor,
                          background: s.tagColor + '22',
                          border: `1px solid ${s.tagColor}44`,
                          padding: '2px 8px',
                          borderRadius: 20,
                        }}>
                          {s.tag}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{s.sub}</div>

                      {strategy === s.id && (
                        <div style={styles.strategyDesc}>{s.desc}</div>
                      )}

                      <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>✓ {s.benefit}</div>
                    </div>

                    <div style={{
                      ...styles.radio,
                      border: `2px solid ${strategy === s.id ? 'var(--blue)' : 'var(--border)'}`,
                      background: strategy === s.id ? 'var(--blue)' : 'transparent',
                    }}>
                      {strategy === s.id ? '✓' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={styles.sectionTitle}>💰 Orçamento extra mensal</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                Quanto podes pagar além do mínimo por mês?
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <input style={{ ...styles.input, maxWidth: 120 }} type="number" value={extraBudget} onChange={e => setExtraBudget(Number(e.target.value))} />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$/mês</span>
              </div>

              <div style={styles.projection}>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>
                  🎯 Projeção com R$ {money(extraBudget)}/mês extra:
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                  Ficarás livre das dívidas em <strong style={{ color: 'var(--white)' }}>{monthsToFree} meses</strong><br />
                  Economia estimada em juros: <strong style={{ color: 'var(--accent)' }}>R$ {money(extraBudget * monthsToFree * 0.08)}</strong><br />
                  Pagamento total por mês: <strong style={{ color: 'var(--white)' }}>R$ {money(totalMin + extraBudget)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={styles.sectionTitle}>📋 Ordem de pagamento</div>
              <button style={styles.smallPrimaryBtn} onClick={() => setShowAdd(v => !v)}>
                ➕ Adicionar
              </button>
            </div>

            {sorted.map((d, i) => {
              const remaining = d.total - d.paid
              const pct = d.total ? Math.round((d.paid / d.total) * 100) : 0

              return (
                <div key={d.id} style={{ ...styles.card, borderLeft: `3px solid ${d.color}`, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ ...styles.rank, background: d.color + '22', border: `1px solid ${d.color}44` }}>{i + 1}</div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {d.category} · Vence: {d.due} · Juros: {d.rate}% a.m.
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: d.color }}>
                        R$ {money(remaining)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Mín: R$ {money(d.minPayment)}</div>
                    </div>
                  </div>

                  <div style={{ height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 3 }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'var(--muted)' }}>
                    <span>{pct}% pago</span>
                    <span>R$ {money(d.paid)} de R$ {money(d.total)}</span>
                  </div>

                  {i === 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                      ⚡ Foco aqui primeiro — estratégia {strategies.find(s => s.id === strategy)?.title}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    <button style={styles.miniBtn} onClick={() => payMinimum(d)} disabled={saving}>Pagar mínimo</button>
                    <button style={styles.miniBtn} onClick={() => setPaymentModal(d)} disabled={saving}>Registrar pagamento</button>
                    <button style={styles.miniBtn} onClick={() => payOffDebt(d)} disabled={saving}>Quitar</button>
                    <button style={styles.dangerMiniBtn} onClick={() => removeDebt(d)} disabled={saving}>Excluir</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {paidDebts.length > 0 && (
        <div style={{ ...styles.card, marginTop: 20 }}>
          <div style={styles.sectionTitle}>✅ Dívidas quitadas</div>

          {paidDebts.map(d => (
            <div key={d.id} style={{
              ...styles.paidCard,
              borderLeft: '3px solid var(--accent)',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Quitada · {d.category} · {d.due}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>
                  R$ {money(d.total)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent)' }}>
                  100% pago
                </div>
              </div>

              <button style={styles.miniBtn} onClick={() => reactivateDebt(d)} disabled={saving}>
                Reativar
              </button>

              <button style={styles.dangerMiniBtn} onClick={() => removeDebt(d)} disabled={saving}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}

      {activeDebts.length > 0 && activeTab === 'simular' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🔢 Simula diferentes cenários</div>

            {[300, 500, 700, 1000, 1500].map(budget => {
              const months = totalLeft > 0 ? Math.ceil(totalLeft / Math.max(budget + totalMin, 1)) : 0
              const saved = (budget * months * 0.08).toFixed(0)

              return (
                <div key={budget} style={styles.row}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>+R$ {money(budget)}/mês extra</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total mensal: R$ {money(budget + totalMin)}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{months} meses</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Poupa R$ {money(saved)} em juros</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>📊 Impacto das taxas de juros</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
              Se renegociares as taxas, o impacto pode ser enorme:
            </p>

            {activeDebts.map(d => {
              const newRate = d.rate * 0.7
              const saving = ((d.total - d.paid) * (d.rate - newRate) / 100 * 12).toFixed(0)

              return (
                <div key={d.id} style={styles.rowColumn}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <span style={{ color: 'var(--red)' }}>Atual: {d.rate}% a.m.</span>
                    <span style={{ color: 'var(--accent)' }}>Negociado: {newRate.toFixed(1)}% a.m.</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>
                    💰 Economia anual estimada: R$ {money(saving)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeDebts.length > 0 && activeTab === 'dicas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {tips.map(t => (
              <div key={t.title} style={{ ...styles.card, display: 'flex', gap: 14 }}>
                <div style={styles.tipIcon}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{t.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.aiCard}>
            <div style={styles.sectionTitle}>🤖 Análise personalizada da IA</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
              Com base nas tuas dívidas atuais, o Moneto recomenda o método{' '}
              <strong style={{ color: 'var(--white)' }}>
                {strategies.find(s => s.id === strategy)?.title}
              </strong>.
              {' '}O foco principal deve ser <strong style={{ color: 'var(--accent)' }}>{sorted[0]?.name}</strong>,
              pois ela aparece como a prioridade pela estratégia escolhida. Com R$ {money(extraBudget)} extras por mês,
              a previsão atual é quitar tudo em <strong style={{ color: 'var(--accent)' }}>{monthsToFree} meses</strong>.
            </p>
          </div>
        </div>
      )}

      {activeDebts.length > 0 && activeTab === 'historico' && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>📈 Progresso atual</div>

          {activeDebts.map(d => {
            const pct = d.total ? Math.round((d.paid / d.total) * 100) : 0

            return (
              <div key={d.id} style={styles.rowColumn}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <span style={{ color: 'var(--accent)' }}>Pago: R$ {money(d.paid)}</span>
                    <span style={{ color: 'var(--muted)' }}>Restante: R$ {money(d.total - d.paid)}</span>
                  </div>
                </div>

                <div style={{ height: 7, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--blue), var(--accent))', borderRadius: 4 }} />
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{pct}% quitado</div>
              </div>
            )
          })}
        </div>
      )}

      {paymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              Registrar pagamento
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              {paymentModal.name} — restante R$ {money(paymentModal.total - paymentModal.paid)}
            </div>

            <input
              style={styles.input}
              type="number"
              placeholder="Valor pago"
              value={paymentValue}
              onChange={e => setPaymentValue(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button style={styles.secondaryBtn} onClick={() => setPaymentModal(null)} disabled={saving}>Cancelar</button>
              <button style={styles.primaryBtn} onClick={() => registerPayment(paymentModal, paymentValue)} disabled={saving}>
                {saving ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{spinStyle}</style>
    </div>
  )
}

const spinStyle = `
  @keyframes spin { to { transform: rotate(360deg) } }
`

const styles = {
  loadingBox: {
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
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 20,
  },
  kpiCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '18px 20px',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'var(--muted)',
    marginBottom: 6,
  },
  tabs: {
    display: 'flex',
    gap: 3,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    width: 'fit-content',
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 7,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.18s',
  },
  empty: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 36,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 14,
  },
  stratCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'all 0.18s',
  },
  stratIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(46,99,232,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
  },
  strategyDesc: {
    fontSize: 12,
    color: 'var(--muted)',
    lineHeight: 1.5,
    marginTop: 6,
    padding: 8,
    background: 'rgba(46,99,232,0.08)',
    borderRadius: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: '#fff',
    flexShrink: 0,
  },
  projection: {
    padding: 14,
    background: 'rgba(74,240,196,0.06)',
    border: '1px solid rgba(74,240,196,0.15)',
    borderRadius: 10,
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
  smallPrimaryBtn: {
    background: 'var(--blue)',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  miniBtn: {
    background: 'rgba(91,139,245,0.12)',
    border: '1px solid rgba(91,139,245,0.25)',
    color: 'var(--blue-l)',
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerMiniBtn: {
    background: 'rgba(240,106,106,0.10)',
    border: '1px solid rgba(240,106,106,0.25)',
    color: 'var(--red)',
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Syne, sans-serif',
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(91,139,245,0.07)',
  },
  rowColumn: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(91,139,245,0.07)',
  },
  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: 'rgba(46,99,232,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  aiCard: {
    background: 'linear-gradient(135deg, rgba(46,99,232,0.1), rgba(74,240,196,0.05))',
    border: '1px solid rgba(46,99,232,0.2)',
    borderRadius: 16,
    padding: 20,
  },
  paidCard: {
    background: 'rgba(74,240,196,0.06)',
    border: '1px solid rgba(74,240,196,0.14)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gap: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: 380,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 22,
    boxShadow: '0 20px 80px rgba(0,0,0,0.35)',
  },
}