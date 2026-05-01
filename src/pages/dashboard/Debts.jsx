import { useState } from 'react'

const initialDebts = [
  { id:1, name:'Cartão Nubank',    total:3200, paid:800,  rate:12.5, minPayment:160, due:'Dia 10', color:'#f06a6a', category:'Cartão' },
  { id:2, name:'Empréstimo Caixa', total:8500, paid:2500, rate:3.2,  minPayment:420, due:'Dia 15', color:'#f0a84a', category:'Empréstimo' },
  { id:3, name:'Cartão Inter',     total:1200, paid:200,  rate:9.8,  minPayment:80,  due:'Dia 20', color:'#5b8bf5', category:'Cartão' },
]

const strategies = [
  { id:'avalanche', icon:'🏔️', title:'Método Avalanche', sub:'Paga primeiro a maior taxa de juros', benefit:'Economiza mais dinheiro no total', tag:'Recomendado pela IA', tagColor:'var(--accent)', desc:'Matematicamente ótimo. Elimina os juros mais caros primeiro, reduzindo o total pago ao longo do tempo. Ideal para quem tem disciplina e foco em economizar.' },
  { id:'snowball',  icon:'⛄', title:'Método Bola de Neve', sub:'Paga primeiro a menor dívida',    benefit:'Gera motivação com vitórias rápidas', tag:'Mais popular', tagColor:'var(--accent2)', desc:'Psicologicamente eficaz. Cada dívida quitada gera motivação para continuar. Ideal para quem precisa de impulso emocional para manter o foco.' },
  { id:'hibrido',   icon:'⚡', title:'Método Híbrido', sub:'Combina Avalanche + Bola de Neve',      benefit:'Equilíbrio entre economia e motivação', tag:'Avançado', tagColor:'var(--blue-l)', desc:'Quitadas dívidas pequenas rapidamente para ganhar motivação, depois foca nas de maior juros. O melhor dos dois mundos.' },
]

const tips = [
  { icon: '💡', title: 'Negocia as taxas', body: 'Muitos bancos aceitam renegociação. Liga para o banco e peça redução de juros — pode economizar até 30%.' },
  { icon: '🔄', title: 'Portabilidade de crédito', body: 'Transfere dívidas de cartão (12%+) para empréstimos pessoais (3-6%). Pode reduzir drasticamente os juros.' },
  { icon: '📱', title: 'Regista tudo pelo WhatsApp', body: 'Manda mensagem "paguei R$X na dívida Y" e o Moneto atualiza o progresso automaticamente.' },
  { icon: '🎯', title: 'Regra dos 50/30/20', body: '50% necessidades, 30% desejos, 20% dívidas e poupança. Adapta conforme a tua realidade.' },
]

export default function Debts() {
  const [debts, setDebts]           = useState(initialDebts)
  const [strategy, setStrategy]     = useState('avalanche')
  const [extraBudget, setExtraBudget] = useState(500)
  const [showAdd, setShowAdd]       = useState(false)
  const [activeTab, setActiveTab]   = useState('plano')
  const [newDebt, setNewDebt]       = useState({ name:'', total:'', rate:'', minPayment:'', due:'', category:'' })

  const totalDebt  = debts.reduce((s,d) => s + d.total, 0)
  const totalPaid  = debts.reduce((s,d) => s + d.paid, 0)
  const totalLeft  = totalDebt - totalPaid
  const totalPct   = Math.round((totalPaid / totalDebt) * 100)
  const totalMin   = debts.reduce((s,d) => s + d.minPayment, 0)
  const monthsToFree = Math.ceil(totalLeft / (extraBudget + totalMin))

  const sorted = strategy === 'avalanche'
    ? [...debts].sort((a,b) => b.rate - a.rate)
    : strategy === 'snowball'
      ? [...debts].sort((a,b) => (a.total - a.paid) - (b.total - b.paid))
      : [...debts].sort((a,b) => (a.total - a.paid) - (b.total - b.paid)).slice(0,1).concat([...debts].sort((a,b) => b.rate - a.rate).slice(1))

  function addDebt() {
    if (!newDebt.name || !newDebt.total) return
    setDebts(prev => [...prev, { id: Date.now(), name: newDebt.name, total: parseFloat(newDebt.total), paid: 0, rate: parseFloat(newDebt.rate)||0, minPayment: parseFloat(newDebt.minPayment)||0, due: newDebt.due||'Dia 10', color:'#5b8bf5', category: newDebt.category||'Outros' }])
    setNewDebt({ name:'', total:'', rate:'', minPayment:'', due:'', category:'' })
    setShowAdd(false)
  }

  const tabs = [
    { id:'plano',    label:'📋 Plano de quitação' },
    { id:'simular',  label:'🔢 Simulador' },
    { id:'dicas',    label:'💡 Dicas da IA' },
    { id:'historico',label:'📈 Progresso' },
  ]

  return (
    <div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label:'Total em dívidas',  value:`R$ ${totalLeft.toLocaleString('pt-BR')}`, color:'var(--red)',    icon:'💸', sub:`de R$ ${totalDebt.toLocaleString()} totais` },
          { label:'Já quitado',        value:`R$ ${totalPaid.toLocaleString('pt-BR')}`, color:'var(--accent)', icon:'✅', sub:`${totalPct}% do total` },
          { label:'Previsão liberdade', value:`${monthsToFree} meses`,                  color:'var(--accent2)',icon:'🗓️', sub:'com orçamento extra' },
          { label:'Mínimo mensal',     value:`R$ ${totalMin.toLocaleString()}`,          color:'var(--blue-l)', icon:'💳', sub:'pagamento mínimo total' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8, opacity: 0.6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -1, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Barra de progresso */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>Progresso geral de quitação</span>
          <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>{totalPct}%</span>
        </div>
        <div style={{ height: 10, background: 'rgba(91,139,245,0.1)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${totalPct}%`, background: 'linear-gradient(90deg, var(--blue), var(--accent))', borderRadius: 5, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
          <span>R$ {totalPaid.toLocaleString()} pago</span>
          <span>R$ {totalDebt.toLocaleString()} total</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(t => (
          <div key={t.id} style={{ padding: '8px 16px', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: activeTab === t.id ? '#fff' : 'var(--muted)', background: activeTab === t.id ? 'var(--blue)' : 'transparent', fontWeight: activeTab === t.id ? 600 : 400, transition: 'all 0.18s' }}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* PLANO */}
      {activeTab === 'plano' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={styles.card}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🧠 Escolhe a estratégia</div>
              {strategies.map(s => (
                <div key={s.id} style={{ ...styles.stratCard, border: `1px solid ${strategy === s.id ? 'var(--blue)' : 'var(--border)'}`, background: strategy === s.id ? 'rgba(46,99,232,0.1)' : 'var(--bg3)' }} onClick={() => setStrategy(s.id)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(46,99,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: 14 }}>{s.title}</strong>
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.tagColor, background: s.tagColor + '22', border: `1px solid ${s.tagColor}44`, padding: '2px 8px', borderRadius: 20 }}>{s.tag}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{s.sub}</div>
                      {strategy === s.id && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginTop: 6, padding: '8px', background: 'rgba(46,99,232,0.08)', borderRadius: 8 }}>{s.desc}</div>}
                      <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>✓ {s.benefit}</div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${strategy === s.id ? 'var(--blue)' : 'var(--border)'}`, background: strategy === s.id ? 'var(--blue)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>
                      {strategy === s.id ? '✓' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💰 Orçamento extra mensal</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Quanto podes pagar além do mínimo por mês?</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <input style={{ ...styles.input, maxWidth: 120 }} type="number" value={extraBudget} onChange={e => setExtraBudget(Number(e.target.value))} />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$/mês</span>
              </div>
              <div style={{ padding: 14, background: 'rgba(74,240,196,0.06)', border: '1px solid rgba(74,240,196,0.15)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>🎯 Projeção com R$ {extraBudget}/mês extra:</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                  Ficarás livre das dívidas em <strong style={{ color: 'var(--white)' }}>{monthsToFree} meses</strong><br />
                  Economia estimada em juros: <strong style={{ color: 'var(--accent)' }}>R$ {(extraBudget * monthsToFree * 0.08).toFixed(0)}</strong><br />
                  Pagamento total por mês: <strong style={{ color: 'var(--white)' }}>R$ {(totalMin + extraBudget).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>📋 Ordem de pagamento</div>
              <button style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowAdd(v => !v)}>➕ Adicionar</button>
            </div>

            {showAdd && (
              <div style={{ ...styles.card, marginBottom: 12, background: 'var(--bg3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <input style={styles.input} placeholder="Nome da dívida" value={newDebt.name} onChange={e => setNewDebt(p => ({...p, name:e.target.value}))} />
                  <input style={styles.input} placeholder="Categoria (Cartão, Empréstimo...)" value={newDebt.category} onChange={e => setNewDebt(p => ({...p, category:e.target.value}))} />
                  <input style={styles.input} type="number" placeholder="Valor total (R$)" value={newDebt.total} onChange={e => setNewDebt(p => ({...p, total:e.target.value}))} />
                  <input style={styles.input} type="number" placeholder="Taxa de juros (% a.m.)" value={newDebt.rate} onChange={e => setNewDebt(p => ({...p, rate:e.target.value}))} />
                  <input style={styles.input} type="number" placeholder="Pagamento mínimo" value={newDebt.minPayment} onChange={e => setNewDebt(p => ({...p, minPayment:e.target.value}))} />
                  <input style={styles.input} placeholder="Vencimento (ex: Dia 10)" value={newDebt.due} onChange={e => setNewDebt(p => ({...p, due:e.target.value}))} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex:1, background:'transparent', border:'1px solid var(--border)', borderRadius:9, padding:10, color:'var(--white)', fontSize:13, cursor:'pointer' }} onClick={() => setShowAdd(false)}>Cancelar</button>
                  <button style={{ flex:1, background:'var(--blue)', color:'#fff', border:'none', borderRadius:9, padding:10, fontSize:13, fontWeight:600, cursor:'pointer' }} onClick={addDebt}>Salvar</button>
                </div>
              </div>
            )}

            {sorted.map((d, i) => {
              const remaining = d.total - d.paid
              const pct = Math.round((d.paid / d.total) * 100)
              return (
                <div key={d.id} style={{ ...styles.card, borderLeft: `3px solid ${d.color}`, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: d.color + '22', border: `1px solid ${d.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i+1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.category} · Vence: {d.due} · Juros: {d.rate}% a.m.</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: d.color }}>R$ {remaining.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Mín: R$ {d.minPayment}</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: 'var(--muted)' }}>
                    <span>{pct}% pago</span>
                    <span>R$ {d.paid.toLocaleString()} de R$ {d.total.toLocaleString()}</span>
                  </div>
                  {i === 0 && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>⚡ Foco aqui primeiro — estratégia {strategies.find(s => s.id === strategy)?.title}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SIMULADOR */}
      {activeTab === 'simular' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={styles.card}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔢 Simula diferentes cenários</div>
            {[300, 500, 700, 1000, 1500].map(budget => {
              const months = Math.ceil(totalLeft / (budget + totalMin))
              const saved  = (budget * months * 0.08).toFixed(0)
              return (
                <div key={budget} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>+R$ {budget}/mês extra</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total mensal: R$ {(budget + totalMin).toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{months} meses</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Poupa R$ {saved} em juros</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={styles.card}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Impacto das taxas de juros</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>Se renegociares as taxas, o impacto pode ser enorme:</p>
            {debts.map(d => {
              const newRate = d.rate * 0.7
              const saving  = ((d.total - d.paid) * (d.rate - newRate) / 100 * 12).toFixed(0)
              return (
                <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <span style={{ color: 'var(--red)' }}>Atual: {d.rate}% a.m.</span>
                    <span style={{ color: 'var(--accent)' }}>Negociado: {newRate.toFixed(1)}% a.m.</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>💰 Economia anual estimada: R$ {saving}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* DICAS */}
      {activeTab === 'dicas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {tips.map(t => (
              <div key={t.title} style={{ ...styles.card, display: 'flex', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(46,99,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{t.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(46,99,232,0.1), rgba(74,240,196,0.05))', border: '1px solid rgba(46,99,232,0.2)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🤖 Análise personalizada da IA</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
              Com base nas tuas dívidas, a IA recomenda: <strong style={{ color: 'var(--white)' }}>Método Avalanche</strong> — começa pelo Cartão Nubank (12.5% a.m.). Renegoceia o Cartão Inter (9.8% → ~7%) e usa os R$ {extraBudget}/mês extra no Nubank. Projeção: livre em <strong style={{ color: 'var(--accent)' }}>{monthsToFree} meses</strong>.
            </p>
          </div>
        </div>
      )}

      {/* PROGRESSO */}
      {activeTab === 'historico' && (
        <div style={styles.card}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>📈 Evolução do progresso</div>
          {[
            { month: 'Janeiro 2025', paid: 500,  total: 13900 },
            { month: 'Fevereiro',    paid: 660,  total: 13240 },
            { month: 'Março',        paid: 720,  total: 12520 },
            { month: 'Abril (atual)',paid: 380,  total: 12140 },
          ].map(m => {
            const pct = Math.round(((totalDebt - m.total) / totalDebt) * 100)
            return (
              <div key={m.month} style={{ padding: '14px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.month}</span>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <span style={{ color: 'var(--accent)' }}>Pago: R$ {m.paid}</span>
                    <span style={{ color: 'var(--muted)' }}>Restante: R$ {m.total.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ height: 7, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--blue), var(--accent))', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{pct}% do total quitado</div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

const styles = {
  card:      { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 },
  stratCard: { borderRadius: 12, padding: 14, marginBottom: 10, cursor: 'pointer', transition: 'all 0.18s' },
  input:     { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 13px', color: 'var(--white)', fontSize: 13, outline: 'none' },
}