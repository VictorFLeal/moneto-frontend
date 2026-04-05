import { useState, useRef, useEffect } from 'react'

const suggestions = [
  '📊 Resumo do mês',
  '💸 Onde gastei mais?',
  '🎯 Estou no orçamento?',
  '📈 Como economizar mais?',
  '🔮 Previsão do mês',
]

const aiReplies = {
  'resumo do mês': 'Resumo de Abril 2025\n\nTotal gasto: R$ 1.680\nTotal recebido: R$ 6.500\nSaldo líquido: +R$ 4.820\n\nMaior gasto: Alimentação (R$ 520)\nEsse foi um excelente mês, Victor!',
  'onde gastei mais?': 'Olhando teus dados de Abril:\n\n1. Alimentação — R$ 520 (31%)\n2. Moradia — R$ 425 (25%)\n3. Lazer — R$ 415 (25%)\n4. Transporte — R$ 320 (19%)\n\nAtenção para o Lazer — subiu 40% em relação a Março!',
  'estou no orçamento?': 'Analisei todos os teus orçamentos:\n\nAlimentação: R$520 / R$800 (65%) — OK\nTransporte: R$320 / R$400 (80%) — Atenção\nLazer: R$415 / R$500 (83%) — Quase no limite\nMoradia: R$425 / R$1.200 (35%) — Ótimo\n\nNo geral estás bem! Só cuidado com Lazer.',
  'como economizar mais?': 'Com base no teu histórico:\n\nDelivery — Gastas ~R$180/mês. Reduzindo 50% economizas R$90.\n\nTransporte — Usar apps fora do pico economiza ~R$40/mês.\n\nStreamings — Tens 4 serviços ativos (R$160/mês). Vale revisar!\n\nTotal possível: R$ 290/mês',
  'previsão do mês': 'Com base nos teus padrões:\n\nGastos estimados: R$ 2.100 – R$ 2.300\nReceitas previstas: R$ 6.500\nEconomia projetada: R$ 4.200 – R$ 4.400\n\nEstás no ritmo certo para a meta de Portugal!',
}

function getBotReply(msg) {
  const m = msg.toLowerCase()
  for (const [key, val] of Object.entries(aiReplies)) {
    if (m.includes(key)) return val
  }
  if (m.includes('gastei') || m.includes('paguei') || m.includes('comprei')) {
    return 'Anotado! Valor registrado com sucesso.\n\nSe quiser ajustar a categoria ou valor, é só me dizer!'
  }
  return 'Entendi a tua pergunta sobre "' + msg + '".\n\nPodes me perguntar sobre: resumo do mês, onde gastaste mais, orçamento, como economizar, ou lançar um gasto como "gastei R$50 no mercado".'
}

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
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

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