import { useState, useRef, useEffect } from 'react'
import api, { getTransactions } from '../../services/api'

const suggestions = [
  '📊 Resumo do mês',
  '💸 Onde gastei mais?',
  '🎯 Estou no orçamento?',
  '📈 Como economizar mais?',
  '🔮 Previsão do mês',
]

function getNow() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Olá, Victor! Sou o teu assistente financeiro com IA.\n\nPodes me perguntar qualquer coisa sobre as tuas finanças, lançar gastos ou pedir relatórios.\n\nComo posso te ajudar hoje?',
      time: getNow(),
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showSugs, setShowSugs] = useState(true)
  const [settings, setSettings] = useState(null)
  const [transactions, setTransactions] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, txRes] = await Promise.all([
          api.get('/settings'),
          getTransactions(),
        ])

        setSettings(settingsRes.data)
        setTransactions(txRes.data || [])
      } catch (err) {
        console.error('Erro ao carregar dados da IA:', err)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function formatMoney(value) {
    return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`
  }

  function getExpenses() {
    return transactions.filter(t => t.tipo === 'DESPESA')
  }

  function getIncomes() {
    return transactions.filter(t => t.tipo === 'RECEITA')
  }

  function getTotal(list) {
    return list.reduce((total, t) => total + Number(t.valor || 0), 0)
  }

  function getBotReply(msg) {
    const m = msg.toLowerCase()
    const despesas = getExpenses()
    const receitas = getIncomes()
    const totalDespesas = getTotal(despesas)
    const totalReceitas = getTotal(receitas)
    const saldo = totalReceitas - totalDespesas
    const orcamentos = settings?.orcamentos || {}

    if (m.includes('resumo')) {
      const maiorGasto = despesas.reduce((maior, atual) => {
        return Number(atual.valor || 0) > Number(maior?.valor || 0) ? atual : maior
      }, null)

      return `Resumo atual\n\nTotal gasto: ${formatMoney(totalDespesas)}\nTotal recebido: ${formatMoney(totalReceitas)}\nSaldo líquido: ${formatMoney(saldo)}\n\nMaior gasto: ${maiorGasto ? `${maiorGasto.categoria} (${formatMoney(maiorGasto.valor)})` : 'Nenhum gasto registrado ainda.'}`
    }

    if (m.includes('onde gastei') || m.includes('gastei mais')) {
      const resumo = {}

      despesas.forEach(t => {
        resumo[t.categoria] = (resumo[t.categoria] || 0) + Number(t.valor || 0)
      })

      const ranking = Object.entries(resumo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      if (ranking.length === 0) {
        return 'Ainda não encontrei gastos registrados.'
      }

      return `Onde você mais gastou:\n\n${ranking.map((item, i) => `${i + 1}. ${item[0]} — ${formatMoney(item[1])}`).join('\n')}`
    }

    if (m.includes('orçamento') || m.includes('orcamento')) {
      const linhas = Object.entries(orcamentos)
        .filter(([_, limite]) => Number(limite) > 0)
        .map(([categoria, limite]) => {
          const gasto = despesas
            .filter(t => t.categoria === categoria)
            .reduce((total, t) => total + Number(t.valor || 0), 0)

          const percentual = Number(limite) > 0
            ? Math.round((gasto / Number(limite)) * 100)
            : 0

          let status = 'OK'
          if (percentual >= 100) status = 'Estourou o limite'
          else if (percentual >= 90) status = 'Atenção'
          else if (percentual >= 75) status = 'Quase no limite'

          return `${categoria}: ${formatMoney(gasto)} / ${formatMoney(limite)} (${percentual}%) — ${status}`
        })

      if (linhas.length === 0) {
        return 'Ainda não encontrei orçamentos cadastrados. Vai em Configurações > Orçamento e define os limites por categoria.'
      }

      return `Analisei teus orçamentos atuais:\n\n${linhas.join('\n')}`
    }

    if (m.includes('economizar')) {
      const resumo = {}

      despesas.forEach(t => {
        resumo[t.categoria] = (resumo[t.categoria] || 0) + Number(t.valor || 0)
      })

      const ranking = Object.entries(resumo).sort((a, b) => b[1] - a[1])

      if (ranking.length === 0) {
        return 'Ainda não tenho gastos suficientes para sugerir economia.'
      }

      const [categoria, valor] = ranking[0]
      const economia = valor * 0.2

      return `Com base nos teus gastos reais, tua maior categoria de despesa é ${categoria}, com ${formatMoney(valor)}.\n\nSe você reduzir 20% nessa categoria, pode economizar aproximadamente ${formatMoney(economia)}.`
    }

    if (m.includes('previsão') || m.includes('previsao')) {
      return `Com base nos dados atuais:\n\nReceitas registradas: ${formatMoney(totalReceitas)}\nDespesas registradas: ${formatMoney(totalDespesas)}\nSaldo projetado atual: ${formatMoney(saldo)}`
    }

    if (m.includes('gastei') || m.includes('paguei') || m.includes('comprei')) {
      return 'Ainda não estou lançando gastos automaticamente pelo chat. Por enquanto, registra pela tela de transações ou pelo fluxo do WhatsApp.'
    }

    return 'Agora estou usando teus dados reais. Você pode perguntar sobre resumo do mês, onde gastou mais, orçamento, economia ou previsão.'
  }

  function send(text) {
    const msg = text || input.trim()
    if (!msg) return

    setInput('')
    setShowSugs(false)
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg, time: getNow() }])
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: getBotReply(msg),
        time: getNow()
      }])
    }, 1400)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={styles.wrap}>

      {/* Bot header */}
      <div style={styles.botHeader}>
        <div style={styles.botAvatar}>🤖</div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>
            Moneto IA
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Online agora
          </div>
        </div>
        <div style={styles.waBadge}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#25d366', display: 'inline-block' }} />
          WhatsApp conectado
        </div>
      </div>

      {/* Suggestions */}
      {showSugs && (
        <div style={styles.sugsWrap}>
          {suggestions.map(s => (
            <div
              key={s}
              style={styles.sug}
              onClick={() => send(s.replace(/^\S+\s/, '').toLowerCase())}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map(m => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
              maxWidth: '75%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div style={m.role === 'bot' ? styles.av : styles.avUser}>
              {m.role === 'bot' ? 'M' : 'V'}
            </div>
            <div>
              <div style={{
                fontSize: 11, color: 'var(--muted)', marginBottom: 4,
                textAlign: m.role === 'user' ? 'right' : 'left'
              }}>
                {m.role === 'bot' ? 'Moneto IA' : 'Você'} · {m.time}
              </div>
              <div style={{
                ...styles.bubble,
                ...(m.role === 'user' ? styles.bubbleUser : styles.bubbleBot)
              }}>
                {m.text.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < m.text.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', alignSelf: 'flex-start' }}>
            <div style={styles.av}>M</div>
            <div style={{ ...styles.bubble, ...styles.bubbleBot }}>
              <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--muted)', display: 'inline-block',
                    animation: 'bounce 1.2s ease infinite',
                    animationDelay: i * 0.2 + 's',
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputWrap}>
        <textarea
          style={styles.input}
          placeholder="Ex: Gastei R$45 no mercado hoje… ou Qual meu saldo?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button style={styles.sendBtn} onClick={() => send()}>➤</button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex', flexDirection: 'column',
    height: 'calc(100vh - var(--header-h) - 56px)',
  },
  botHeader: {
    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
  },
  botAvatar: {
    width: 44, height: 44, borderRadius: 12,
    background: 'linear-gradient(135deg, var(--blue), var(--accent))',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
  },
  waBadge: {
    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7,
    background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
    borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#25d366',
  },
  sugsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 },
  sug: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '7px 14px', fontSize: 13,
    color: 'var(--muted)', cursor: 'pointer',
  },
  messages: {
    flex: 1, overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
    gap: 14, paddingBottom: 12,
  },
  av: {
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
  },
  avUser: {
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(74,240,196,0.15)', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
  },
  bubble: {
    padding: '11px 15px', borderRadius: 16,
    fontSize: 14, lineHeight: 1.7, maxWidth: 420,
  },
  bubbleBot: {
    background: 'rgba(13,32,80,0.7)', border: '1px solid var(--border)',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    background: 'rgba(46,99,232,0.25)', border: '1px solid rgba(46,99,232,0.3)',
    borderBottomRightRadius: 4, color: 'var(--white)',
  },
  inputWrap: {
    display: 'flex', gap: 10, alignItems: 'flex-end',
    paddingTop: 14, borderTop: '1px solid var(--border)',
  },
  input: {
    flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '12px 16px', color: 'var(--white)',
    fontSize: 14, resize: 'none', outline: 'none',
    minHeight: 46, maxHeight: 120,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 12,
    background: 'var(--blue)', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 18, color: '#fff', flexShrink: 0,
  },
}