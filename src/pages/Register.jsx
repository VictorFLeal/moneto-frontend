import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

const plans = [
  {
    id: 'start',
    name: 'MONETO Start',
    price: 'R$ 0',
    period: '/ mês',
    tag: 'Gratuito',
    desc: 'Comece gratuitamente e sinta o valor',
    features: ['Cadastro de receitas e despesas', 'Dashboard simples', 'Categorias padrão', 'Até 100 lançamentos/mês'],
    limits: ['Sem IA', 'Sem WhatsApp', 'Sem relatórios avançados'],
    color: '#4af0c4',
    border: 'rgba(74,240,196,0.3)',
    glow: 'rgba(74,240,196,0.08)',
  },
  {
    id: 'essencial',
    name: 'MONETO Essencial',
    price: 'R$ 29,90',
    period: '/ mês',
    tag: null,
    desc: 'Organize seus gastos com praticidade',
    features: ['Tudo do Start', 'Integração com WhatsApp', 'Categorias personalizadas', 'Relatórios básicos', 'Histórico ilimitado'],
    limits: [],
    color: '#5b8bf5',
    border: 'rgba(91,139,245,0.3)',
    glow: 'rgba(91,139,245,0.08)',
  },
  {
    id: 'pro',
    name: 'MONETO Pro',
    price: 'R$ 59,90',
    period: '/ mês',
    tag: '🔥 Mais popular',
    desc: 'Assuma o controle total com inteligência',
    features: ['Tudo do Essencial', 'IA do MONETO', 'Análise automática de gastos', 'Sugestões de economia', 'Modo Sair das Dívidas', 'Relatórios avançados'],
    limits: [],
    color: '#a855f7',
    border: 'rgba(168,85,247,0.4)',
    glow: 'rgba(168,85,247,0.1)',
    highlight: true,
  },
  {
    id: 'business',
    name: 'MONETO Business',
    price: 'R$ 89,90',
    period: '/ mês',
    tag: 'Empresarial',
    desc: 'Gestão financeira completa para empresas',
    features: ['Tudo do Pro', 'Modo Empresa completo', 'Fluxo de caixa avançado', 'DRE simplificado', 'Exportação Excel/PDF', 'IA empresarial'],
    limits: [],
    color: '#f0a84a',
    border: 'rgba(240,168,74,0.3)',
    glow: 'rgba(240,168,74,0.08)',
  },
]

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirma: '',
    renda: '',
    objetivo: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validateStep1() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Insere o teu nome.'
    if (!form.sobrenome.trim()) e.sobrenome = 'Insere o teu sobrenome.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'E-mail inválido.'
    if (!form.telefone.trim()) e.telefone = 'Insere o teu WhatsApp.'
    return e
  }

  function validateStep2() {
    const e = {}
    if (form.senha.length < 8) e.senha = 'Mínimo 8 caracteres.'
    if (form.senha !== form.confirma) e.confirma = 'As senhas não coincidem.'
    return e
  }

  function nextStep() {
    if (step === 1) {
      const e = validateStep1()
      if (Object.keys(e).length) {
        setErrors(e)
        return
      }
    }

    if (step === 2) {
      const e = validateStep2()
      if (Object.keys(e).length) {
        setErrors(e)
        return
      }
    }

    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setLoading(true)

    try {
      const res = await register({
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        password: form.senha,
        telefone: form.telefone,
        perfil: 'USER',
        plano: selectedPlan,
      })

      localStorage.setItem('moneto_token', res.data.token)
      localStorage.setItem('moneto_user', JSON.stringify({
        nome: res.data.nome,
        email: res.data.email,
        perfil: res.data.perfil,
        plano: res.data.plano,
      }))

      setDone(true)
      setTimeout(() => 
        navigate('/verify-phone', {
          state: { telefone: form.telefone }
        }), 
      2000)
    } catch (err) {
      console.error('Erro no cadastro:', err)

      const status = err.response?.status
      const message = err.response?.data?.message || err.response?.data || ''

      if (status === 409) {
        alert('Esse e-mail já está em uso.')
      } else if (status === 403) {
        alert('Erro de permissão/CORS. O backend bloqueou a requisição.')
      } else if (status === 400) {
        alert(`Dados inválidos: ${message || 'confira os campos e tente novamente.'}`)
      } else if (status === 500) {
        alert('Erro interno no servidor. Veja os logs do Railway.')
      } else {
        alert('Não foi possível criar a conta. Verifique sua conexão ou tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  function pwStrength(pw) {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++

    return [
      { pct: 0, color: 'transparent', text: '', label: '' },
      { pct: 25, color: '#f06a6a', text: 'Fraca', label: 'Usa letras maiúsculas, números e símbolos' },
      { pct: 50, color: '#fbbf24', text: 'Razoável', label: 'Adiciona mais variedade' },
      { pct: 75, color: '#5b8bf5', text: 'Boa', label: 'Quase perfeita!' },
      { pct: 100, color: '#4af0c4', text: 'Forte', label: 'Excelente segurança!' },
    ][pw.length === 0 ? 0 : s] || { pct: 25, color: '#f06a6a', text: 'Fraca', label: '' }
  }

  const strength = pwStrength(form.senha)
  const stepLabels = ['Dados pessoais', 'Acesso', 'Plano', 'Perfil']
  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? '24px 12px' : '40px 20px',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      boxSizing: 'border-box',
    },
    bgLayer: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    },
    blob1: {
      position: 'absolute',
      width: isMobile ? 360 : 600,
      height: isMobile ? 360 : 600,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(26,75,204,0.25) 0%, transparent 70%)',
      top: isMobile ? -140 : -200,
      left: isMobile ? -160 : -100,
      filter: 'blur(120px)',
    },
    blob2: {
      position: 'absolute',
      width: isMobile ? 280 : 400,
      height: isMobile ? 280 : 400,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74,240,196,0.08) 0%, transparent 70%)',
      bottom: -100,
      right: -80,
      filter: 'blur(100px)',
    },
    wrapper: {
      width: '100%',
      maxWidth: step === 3 ? (isMobile ? '100%' : 1080) : 500,
      position: 'relative',
      zIndex: 2,
      boxSizing: 'border-box',
    },
    logo: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 20 : 22,
      fontWeight: 800,
      textAlign: 'center',
      marginBottom: isMobile ? 24 : 36,
      letterSpacing: 3,
      color: 'var(--white)',
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? 24 : 32,
    },
    title: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 23 : 26,
      fontWeight: 800,
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    stepWrap: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: isMobile ? 'flex-start' : 'center',
      marginBottom: isMobile ? 26 : 36,
      gap: 0,
      overflowX: isMobile ? 'auto' : 'visible',
      paddingBottom: isMobile ? 6 : 0,
      scrollbarWidth: 'none',
    },
    stepItem: {
      display: 'flex',
      alignItems: 'flex-start',
      flexShrink: 0,
    },
    stepCircleWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      minWidth: isMobile ? 64 : 'auto',
    },
    stepLine: {
      width: isMobile ? 32 : 60,
      height: 1.5,
      margin: '16px 8px 0',
      transition: 'background 0.3s ease',
      flexShrink: 0,
    },
    card: {
      background: 'rgba(10,21,48,0.7)',
      border: '1px solid rgba(91,139,245,0.12)',
      borderRadius: 20,
      padding: isMobile ? '22px 16px' : '32px 28px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    step1Grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 0 : 14,
      marginBottom: 0,
    },
    fieldWrap: {
      marginBottom: 18,
      width: '100%',
    },
    label: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 0.3,
      color: 'rgba(240,246,255,0.6)',
      marginBottom: 8,
    },
    input: {
      width: '100%',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 16px',
      color: 'var(--white)',
      fontSize: 15,
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 16px',
      color: 'var(--white)',
      fontSize: 15,
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    eyeBtn: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(122,154,191,0.6)',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s',
      borderRadius: 6,
    },
    errorMsg: {
      fontSize: 12,
      color: '#f06a6a',
      marginTop: 6,
      display: 'block',
    },
    btnPrimary: {
      width: '100%',
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '14px',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 0 28px rgba(46,99,232,0.35)',
      transition: 'all 0.2s',
      marginTop: 4,
      boxSizing: 'border-box',
    },
    btnGhost: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '14px 20px',
      color: 'var(--muted)',
      fontSize: 14,
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: 4,
      whiteSpace: 'nowrap',
      width: isMobile ? '100%' : 'auto',
      boxSizing: 'border-box',
    },
    buttonRow: {
      display: 'flex',
      gap: 10,
      flexDirection: isMobile ? 'column' : 'row',
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)',
      gap: isMobile ? 16 : 12,
      marginBottom: 24,
      width: '100%',
      boxSizing: 'border-box',
    },
    planCard: {
      borderRadius: 16,
      padding: isMobile ? '22px 18px' : '22px 18px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.22s ease',
      backdropFilter: 'blur(12px)',
      width: '100%',
      boxSizing: 'border-box',
      minWidth: 0,
    },
    selectedPlanBox: {
      marginBottom: 20,
      padding: 14,
      borderRadius: 12,
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 10 : 0,
    },
    successPage: {
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
      padding: 20,
      textAlign: 'center',
      boxSizing: 'border-box',
    },
  }

  if (done) return (
    <div style={styles.successPage}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(74,240,196,0.1)',
        border: '1px solid rgba(74,240,196,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
      }}>
        ✅
      </div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: isMobile ? 24 : 28, fontWeight: 800 }}>
        Conta criada com sucesso!
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 15 }}>
        Redirecionando para o dashboard...
      </p>
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.bgLayer}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
      </div>

      <div style={styles.wrapper}>
        <div style={styles.logo}>
          MONETO
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>
            {step === 3 ? 'Escolhe o teu plano' : 'Criar conta grátis'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Já tens conta?{' '}
            <Link to="/login" style={{ color: 'var(--blue-l)', fontWeight: 600, textDecoration: 'none' }}>
              Fazer login
            </Link>
          </p>
        </div>

        <div style={styles.stepWrap}>
          {stepLabels.map((label, i) => {
            const n = i + 1
            const isDone = step > n
            const isActive = step === n

            return (
              <div key={label} style={styles.stepItem}>
                <div style={styles.stepCircleWrap}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                    background: isDone ? 'rgba(74,240,196,0.15)' : isActive ? 'var(--blue)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${isDone ? 'rgba(74,240,196,0.5)' : isActive ? 'var(--blue)' : 'rgba(255,255,255,0.1)'}`,
                    color: isDone ? '#4af0c4' : isActive ? '#fff' : 'var(--muted)',
                    boxShadow: isActive ? '0 0 20px rgba(46,99,232,0.4)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {isDone ? <CheckIcon /> : n}
                  </div>

                  <span style={{
                    fontSize: 11,
                    color: isActive ? 'var(--white)' : isDone ? '#4af0c4' : 'var(--muted)',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </div>

                {i < stepLabels.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    background: step > n ? 'rgba(74,240,196,0.4)' : 'rgba(255,255,255,0.06)',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {step === 1 && (
          <div style={styles.card}>
            <div style={styles.step1Grid}>
              <InputField
                label="Nome"
                placeholder="João"
                value={form.nome}
                onChange={v => handle('nome', v)}
                error={errors.nome}
                styles={styles}
              />

              <InputField
                label="Sobrenome"
                placeholder="Silva"
                value={form.sobrenome}
                onChange={v => handle('sobrenome', v)}
                error={errors.sobrenome}
                styles={styles}
              />
            </div>

            <InputField
              label="E-mail"
              type="email"
              placeholder="joao@exemplo.com"
              value={form.email}
              onChange={v => handle('email', v)}
              error={errors.email}
              styles={styles}
            />

            <InputField
              label="WhatsApp"
              placeholder="+55 (11) 99999-9999"
              value={form.telefone}
              onChange={v => handle('telefone', v)}
              error={errors.telefone}
              styles={styles}
            />

            <button style={styles.btnPrimary} onClick={nextStep}>
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Senha</label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.senha}
                  onChange={e => handle('senha', e.target.value)}
                  style={{
                    ...styles.input,
                    paddingRight: 48,
                    borderColor: errors.senha
                      ? 'rgba(240,106,106,0.5)'
                      : form.senha && strength.pct === 100
                        ? 'rgba(74,240,196,0.3)'
                        : 'var(--border)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={styles.eyeBtn}
                  title={showPw ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPw ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {errors.senha && <span style={styles.errorMsg}>{errors.senha}</span>}

              {form.senha && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[25, 50, 75, 100].map(threshold => (
                      <div
                        key={threshold}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: strength.pct >= threshold ? strength.color : 'rgba(255,255,255,0.06)',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 4,
                  }}>
                    <span style={{ fontSize: 12, color: strength.color, fontWeight: 600 }}>
                      {strength.text}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Confirmar senha</label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showCf ? 'text' : 'password'}
                  placeholder="Repete a senha"
                  value={form.confirma}
                  onChange={e => handle('confirma', e.target.value)}
                  style={{
                    ...styles.input,
                    paddingRight: 48,
                    borderColor: errors.confirma
                      ? 'rgba(240,106,106,0.5)'
                      : form.confirma && form.confirma === form.senha
                        ? 'rgba(74,240,196,0.3)'
                        : 'var(--border)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowCf(v => !v)}
                  style={styles.eyeBtn}
                  title={showCf ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showCf ? <EyeOff /> : <EyeOpen />}
                </button>

                {form.confirma && form.confirma === form.senha && (
                  <div style={{
                    position: 'absolute',
                    right: 48,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#4af0c4',
                  }}>
                    <CheckIcon />
                  </div>
                )}
              </div>

              {errors.confirma && <span style={styles.errorMsg}>{errors.confirma}</span>}
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.btnGhost} onClick={() => setStep(1)}>
                ← Voltar
              </button>
              <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={nextStep}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ width: '100%' }}>
            <div style={styles.plansGrid}>
              {plans.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    ...styles.planCard,
                    background: selectedPlan === p.id ? p.glow : 'rgba(10,21,48,0.6)',
                    border: `1.5px solid ${selectedPlan === p.id ? p.border : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: selectedPlan === p.id ? `0 0 40px ${p.glow}` : 'none',
                  }}
                >
                  {p.tag && (
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: p.highlight ? p.color : 'rgba(10,21,48,0.9)',
                      color: p.highlight ? '#fff' : p.color,
                      border: `1px solid ${p.border}`,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: 20,
                      whiteSpace: 'nowrap',
                      letterSpacing: 0.5,
                    }}>
                      {p.tag}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${selectedPlan === p.id ? p.color : 'rgba(255,255,255,0.15)'}`,
                      background: selectedPlan === p.id ? p.color : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {selectedPlan === p.id && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                      )}
                    </div>
                  </div>

                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 8,
                    letterSpacing: 0.3,
                  }}>
                    {p.name}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <span style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 24,
                      fontWeight: 800,
                      color: p.color,
                      letterSpacing: -1,
                    }}>
                      {p.price}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>
                      {p.period}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14 }}>
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: p.color, flexShrink: 0, marginTop: 1 }}>
                          <CheckIcon />
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(240,246,255,0.7)', lineHeight: 1.4 }}>
                          {f}
                        </span>
                      </div>
                    ))}

                    {p.limits.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: 1 }}>
                          <MinusIcon />
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.btnGhost} onClick={() => setStep(2)}>
                ← Voltar
              </button>
              <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={nextStep}>
                Continuar com {selectedPlanData?.name}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.card}>
            <div style={{
              ...styles.selectedPlanBox,
              background: `${selectedPlanData?.color}10`,
              border: `1px solid ${selectedPlanData?.border}`,
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>
                  Plano selecionado
                </div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: selectedPlanData?.color,
                }}>
                  {selectedPlanData?.name}
                </div>
              </div>

              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 16,
                fontWeight: 800,
                color: selectedPlanData?.color,
              }}>
                {selectedPlanData?.price}
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
                  {selectedPlanData?.period}
                </span>
              </div>
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Renda mensal aproximada</label>
              <select
                style={styles.select}
                value={form.renda}
                onChange={e => handle('renda', e.target.value)}
              >
                <option value="">Seleciona uma faixa</option>
                <option>Até R$ 2.000</option>
                <option>R$ 2.000 – R$ 5.000</option>
                <option>R$ 5.000 – R$ 10.000</option>
                <option>Acima de R$ 10.000</option>
                <option>Prefiro não informar</option>
              </select>
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Objetivo financeiro</label>
              <select
                style={styles.select}
                value={form.objetivo}
                onChange={e => handle('objetivo', e.target.value)}
              >
                <option value="">Seleciona um objetivo</option>
                <option>Economizar mais todo mês</option>
                <option>Sair das dívidas</option>
                <option>Guardar para uma meta específica</option>
                <option>Investir melhor</option>
                <option>Apenas organizar os gastos</option>
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.btnGhost} onClick={() => setStep(3)}>
                ← Voltar
              </button>

              <button
                style={{ ...styles.btnPrimary, flex: 1, opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }} />
                    Criando conta...
                  </span>
                ) : 'Criar minha conta'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(122,154,191,0.4); }
        select option { background: #0a1530; }
        input:focus, select:focus {
          border-color: rgba(46,99,232,0.45) !important;
          box-shadow: 0 0 0 3px rgba(46,99,232,0.1) !important;
        }
      `}</style>
    </div>
  )
}

function InputField({ label, type = 'text', placeholder, value, onChange, error, styles }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          ...styles.input,
          borderColor: error ? 'rgba(240,106,106,0.5)' : 'var(--border)',
        }}
      />
      {error && <span style={styles.errorMsg}>{error}</span>}
    </div>
  )
}