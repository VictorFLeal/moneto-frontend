import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

const plans = [
  {
    id: 'start',
    icon: '🟢',
    name: 'MONETO Start',
    price: 'R$ 0',
    period: '/ mês',
    tag: 'Gratuito',
    tagColor: 'var(--accent)',
    desc: 'Comece gratuitamente e sinta o valor',
    features: [
      'Cadastro de receitas e despesas',
      'Dashboard simples',
      'Categorias padrão',
      'Até 100 lançamentos/mês',
    ],
    limits: ['Sem IA', 'Sem WhatsApp', 'Sem relatórios avançados'],
    color: 'var(--accent)',
    glow: 'rgba(74,240,196,0.15)',
  },
  {
    id: 'essencial',
    icon: '🔵',
    name: 'MONETO Essencial',
    price: 'R$ 29,90',
    period: '/ mês',
    tag: null,
    desc: 'Organize seus gastos com praticidade',
    features: [
      'Tudo do Start',
      'Integração com WhatsApp',
      'Categorias personalizadas',
      'Relatórios básicos',
      'Histórico ilimitado',
    ],
    limits: [],
    color: 'var(--blue-l)',
    glow: 'rgba(91,139,245,0.15)',
  },
  {
    id: 'pro',
    icon: '🟣',
    name: 'MONETO Pro',
    price: 'R$ 59,90',
    period: '/ mês',
    tag: '🔥 Mais popular',
    tagColor: '#fff',
    tagBg: 'var(--blue)',
    desc: 'Assuma o controle total com inteligência',
    features: [
      'Tudo do Essencial',
      'IA do MONETO',
      'Análise automática de gastos',
      'Sugestões de economia',
      'Modo Sair das Dívidas',
      'Relatórios avançados',
      'Gráficos inteligentes',
    ],
    limits: [],
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.2)',
    highlight: true,
  },
  {
    id: 'business',
    icon: '🟡',
    name: 'MONETO Business',
    price: 'R$ 89,90',
    period: '/ mês',
    tag: 'Empresarial',
    tagColor: 'var(--accent2)',
    desc: 'Gestão financeira completa para empresas',
    features: [
      'Tudo do Pro',
      'Modo Empresa completo',
      'Fluxo de caixa avançado',
      'DRE simplificado',
      'Múltiplas contas',
      'Relatórios exportáveis (Excel/PDF)',
      'IA focada em empresa',
      'Alertas inteligentes empresariais',
    ],
    limits: [],
    color: 'var(--accent2)',
    glow: 'rgba(240,168,74,0.2)',
  },
]

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [form, setForm]       = useState({
    nome: '', sobrenome: '', email: '', telefone: '',
    senha: '', confirma: '', renda: '', objetivo: ''
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [showCf, setShowCf]   = useState(false)

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validateStep1() {
    const e = {}
    if (!form.nome.trim())      e.nome      = 'Insere o teu nome.'
    if (!form.sobrenome.trim()) e.sobrenome = 'Insere o teu sobrenome.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'E-mail inválido.'
    if (!form.telefone.trim())  e.telefone  = 'Insere o teu WhatsApp.'
    return e
  }

  function validateStep2() {
    const e = {}
    if (form.senha.length < 8)       e.senha    = 'Mínimo 8 caracteres.'
    if (form.senha !== form.confirma) e.confirma = 'As senhas não coincidem.'
    return e
  }

  function nextStep() {
    if (step === 1) { const e = validateStep1(); if (Object.keys(e).length) { setErrors(e); return } }
    if (step === 2) { const e = validateStep2(); if (Object.keys(e).length) { setErrors(e); return } }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await register({
        nome: form.nome, sobrenome: form.sobrenome,
        email: form.email, password: form.senha,
        telefone: form.telefone, perfil: 'individual', plano: selectedPlan,
      })
      localStorage.setItem('moneto_token', res.data.token)
      localStorage.setItem('moneto_user', JSON.stringify({
        nome: res.data.nome, email: res.data.email,
        perfil: res.data.perfil, plano: res.data.plano,
      }))
      setDone(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch {
      alert('Erro ao criar conta. O e-mail pode já estar em uso.')
    } finally {
      setLoading(false)
    }
  }

  function pwStrength(pw) {
    let s = 0
    if (pw.length >= 8)           s++
    if (/[A-Z]/.test(pw))        s++
    if (/[0-9]/.test(pw))        s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    const levels = [
      { pct: '0%',   color: 'transparent', text: '' },
      { pct: '25%',  color: '#f06a6a',     text: 'Fraca' },
      { pct: '50%',  color: '#fbbf24',     text: 'Razoável' },
      { pct: '75%',  color: '#5b8bf5',     text: 'Boa' },
      { pct: '100%', color: '#4af0c4',     text: 'Forte 💪' },
    ]
    return pw.length === 0 ? levels[0] : levels[s] || levels[1]
  }
  const strength = pwStrength(form.senha)

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>✅</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800 }}>Conta criada!</h2>
      <p style={{ color: 'var(--muted)', fontSize: 15 }}>Bem-vindo ao Moneto. Redirecionando...</p>
    </div>
  )

  const steps = ['Dados', 'Acesso', 'Plano', 'Perfil']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,75,204,0.3) 0%, transparent 70%)', top: -200, left: -100, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,240,196,0.08) 0%, transparent 70%)', bottom: -100, right: -80, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: step === 3 ? 1000 : 480, position: 'relative', zIndex: 2 }}>

        {/* Logo */}
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 32 }}>
          MONETO
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>
            Criar conta grátis ✨
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: 'var(--blue-l)', fontWeight: 600 }}>Fazer login</Link>
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, justifyContent: 'center' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  background: step > i+1 ? 'rgba(74,240,196,0.15)' : step === i+1 ? 'var(--blue)' : 'var(--bg4)',
                  border: `1px solid ${step > i+1 ? 'var(--accent)' : step === i+1 ? 'var(--blue)' : 'var(--border)'}`,
                  color: step > i+1 ? 'var(--accent)' : '#fff',
                  boxShadow: step === i+1 ? '0 0 16px rgba(46,99,232,0.4)' : 'none',
                }}>
                  {step > i+1 ? '✓' : i+1}
                </div>
                <span style={{ fontSize: 10, color: step === i+1 ? 'var(--white)' : 'var(--muted)', fontWeight: step === i+1 ? 600 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 48, height: 1, background: step > i+1 ? 'var(--blue)' : 'var(--border)', margin: '0 8px', marginBottom: 18 }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Dados pessoais */}
        {step === 1 && (
          <div style={styles.card}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <Field label="NOME" error={errors.nome}>
                <Input icon="👤" placeholder="João" value={form.nome} onChange={v => handle('nome', v)} error={errors.nome} />
              </Field>
              <Field label="SOBRENOME" error={errors.sobrenome}>
                <Input icon="👤" placeholder="Silva" value={form.sobrenome} onChange={v => handle('sobrenome', v)} error={errors.sobrenome} />
              </Field>
            </div>
            <Field label="E-MAIL" error={errors.email}>
              <Input icon="✉" placeholder="joao@exemplo.com" type="email" value={form.email} onChange={v => handle('email', v)} error={errors.email} />
            </Field>
            <Field label="WHATSAPP" error={errors.telefone}>
              <Input icon="📱" placeholder="+55 (11) 99999-9999" value={form.telefone} onChange={v => handle('telefone', v)} error={errors.telefone} />
            </Field>
            <button style={styles.btnPrimary} onClick={nextStep}>Continuar →</button>
          </div>
        )}

        {/* STEP 2 — Acesso */}
        {step === 2 && (
          <div style={styles.card}>
            <Field label="SENHA" error={errors.senha}>
              <Input icon="🔒" placeholder="Mínimo 8 caracteres"
                type={showPw ? 'text' : 'password'} value={form.senha}
                onChange={v => handle('senha', v)} error={errors.senha}
                eye onEye={() => setShowPw(v => !v)} showPw={showPw} />
              {form.senha && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: strength.pct, background: strength.color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 12, color: strength.color }}>{strength.text}</span>
                </div>
              )}
            </Field>
            <Field label="CONFIRMAR SENHA" error={errors.confirma}>
              <Input icon="🔒" placeholder="Repete a senha"
                type={showCf ? 'text' : 'password'} value={form.confirma}
                onChange={v => handle('confirma', v)} error={errors.confirma}
                eye onEye={() => setShowCf(v => !v)} showPw={showCf} />
            </Field>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={styles.btnGhost} onClick={() => setStep(1)}>←</button>
              <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={nextStep}>Continuar →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Escolha de plano */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>Escolhe o plano ideal para ti. Podes mudar a qualquer momento.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {plans.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    background: selectedPlan === p.id ? `${p.color}18` : 'var(--card)',
                    border: `1px solid ${selectedPlan === p.id ? p.color : 'var(--border)'}`,
                    borderRadius: 16, padding: 20, cursor: 'pointer',
                    position: 'relative', transition: 'all 0.2s',
                    boxShadow: selectedPlan === p.id ? `0 0 30px ${p.glow}` : 'none',
                  }}
                >
                  {p.tag && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: p.highlight ? 'var(--blue)' : `${p.color}22`,
                      color: p.highlight ? '#fff' : p.tagColor,
                      border: `1px solid ${p.highlight ? 'var(--blue)' : p.color}44`,
                      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                    }}>
                      {p.tag}
                    </div>
                  )}
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{p.icon}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: p.color, letterSpacing: -1 }}>
                    {p.price}
                    <span style={{ fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: 'var(--muted)', fontWeight: 400 }}>{p.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 12px', lineHeight: 1.5 }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 7, fontSize: 11, color: 'var(--muted)', alignItems: 'flex-start' }}>
                        <span style={{ color: p.color, flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                    {p.limits.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 7, fontSize: 11, color: 'rgba(122,154,191,0.4)', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0 }}>–</span> {f}
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 14, width: 22, height: 22, borderRadius: '50%', marginLeft: 'auto',
                    border: `2px solid ${selectedPlan === p.id ? p.color : 'var(--border)'}`,
                    background: selectedPlan === p.id ? p.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#fff',
                  }}>
                    {selectedPlan === p.id ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={styles.btnGhost} onClick={() => setStep(2)}>←</button>
              <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={nextStep}>
                Continuar com {plans.find(p => p.id === selectedPlan)?.name} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Perfil financeiro */}
        {step === 4 && (
          <div style={styles.card}>
            <Field label="RENDA MENSAL">
              <select style={styles.select} value={form.renda} onChange={e => handle('renda', e.target.value)}>
                <option value="">Seleciona uma faixa</option>
                <option>Até R$ 2.000</option>
                <option>R$ 2.000 – R$ 5.000</option>
                <option>R$ 5.000 – R$ 10.000</option>
                <option>Acima de R$ 10.000</option>
                <option>Prefiro não informar</option>
              </select>
            </Field>
            <Field label="OBJETIVO FINANCEIRO">
              <select style={styles.select} value={form.objetivo} onChange={e => handle('objetivo', e.target.value)}>
                <option value="">Seleciona um objetivo</option>
                <option>Economizar mais todo mês</option>
                <option>Sair das dívidas</option>
                <option>Guardar para uma meta específica</option>
                <option>Investir melhor</option>
                <option>Apenas organizar os gastos</option>
              </select>
            </Field>
            <div style={{ background: 'rgba(46,99,232,0.06)', border: '1px solid rgba(46,99,232,0.15)', borderRadius: 12, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Plano selecionado:</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>
                {plans.find(p => p.id === selectedPlan)?.name} — {plans.find(p => p.id === selectedPlan)?.price}/mês
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={styles.btnGhost} onClick={() => setStep(3)}>←</button>
              <button
                style={{ ...styles.btnPrimary, flex: 1, opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit} disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar minha conta 🎉'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 7 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'block' }}>{error}</span>}
    </div>
  )
}

function Input({ icon, placeholder, type = 'text', value, onChange, error, eye, onEye, showPw }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'rgba(10,21,48,0.8)', border: `1px solid ${error ? 'rgba(240,106,106,0.6)' : 'var(--border)'}`, borderRadius: 10, padding: '12px 14px 12px 40px', paddingRight: eye ? 42 : 14, color: 'var(--white)', fontSize: 15, outline: 'none' }} />
      {eye && <button type="button" onClick={onEye} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>{showPw ? '🙈' : '👁'}</button>}
    </div>
  )
}

const styles = {
  card:       { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, backdropFilter: 'blur(12px)' },
  btnPrimary: { width: '100%', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 28px rgba(46,99,232,0.35)' },
  btnGhost:   { background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', color: 'var(--white)', fontSize: 15, cursor: 'pointer' },
  select:     { width: '100%', background: 'rgba(10,21,48,0.8)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--white)', fontSize: 15, outline: 'none', appearance: 'none' },
}