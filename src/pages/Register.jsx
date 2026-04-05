import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nome: '', sobrenome: '', email: '', telefone: '',
    senha: '', confirma: '', renda: '', objetivo: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validateStep1() {
    const e = {}
    if (!form.nome.trim())     e.nome      = 'Insere o teu nome.'
    if (!form.sobrenome.trim()) e.sobrenome = 'Insere o teu sobrenome.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'E-mail inválido.'
    if (!form.telefone.trim()) e.telefone  = 'Insere o teu WhatsApp.'
    return e
  }

  function validateStep2() {
    const e = {}
    if (form.senha.length < 8)          e.senha   = 'Mínimo 8 caracteres.'
    if (form.senha !== form.confirma)   e.confirma = 'As senhas não coincidem.'
    return e
  }

  function nextStep() {
    const e = step === 1 ? validateStep1() : validateStep2()
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(s => s + 1)
  }

  function handleSubmit() {
    setLoading(true)
    setTimeout(() => setDone(true), 2000)
  }

  // Força da senha
  function pwStrength(pw) {
    let s = 0
    if (pw.length >= 8)         s++
    if (/[A-Z]/.test(pw))      s++
    if (/[0-9]/.test(pw))      s++
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
    <div style={{ ...styles.page, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>✅</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800 }}>Conta criada!</h2>
      <p style={{ color: 'var(--muted)', fontSize: 15 }}>Bem-vindo ao Moneto. Redirecionando...</p>
      {setTimeout(() => navigate('/dashboard'), 2000) && null}
    </div>
  )

  return (
    <div style={styles.page}>

      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.grid} />

        <div style={styles.logo}>Mon<span style={{ color: 'var(--accent)' }}>.</span>eto</div>

        <div>
          <h2 style={styles.leftTitle}>
            Comece a<br />controlar seu<br />
            <span style={styles.grad}>dinheiro hoje</span>
          </h2>
          <p style={styles.leftSub}>Cria a tua conta em menos de 2 minutos e conecta o teu WhatsApp.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
            {[
              { icon: '⚡', title: 'Setup em 2 minutos', sub: 'Sem burocracia. Conta criada, pronto.' },
              { icon: '🤖', title: 'IA que entende você', sub: 'Manda qualquer mensagem e a IA categoriza.' },
              { icon: '🔒', title: 'Segurança total', sub: 'Dados criptografados. Nunca vendemos suas informações.' },
            ].map(b => (
              <div key={b.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={styles.benefitIcon}>{b.icon}</div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>{b.title}</strong>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{b.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--muted)', position: 'relative', zIndex: 2 }}>
          <strong style={{ color: 'var(--accent)' }}>2.400+</strong> pessoas já controlam as finanças com o Moneto
        </p>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.formBox}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={styles.formTitle}>Criar conta grátis ✨</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Já tem conta?{' '}
              <Link to="/login" style={{ color: 'var(--blue-l)', fontWeight: 600 }}>Fazer login</Link>
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {[1, 2, 3].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  background: step > n ? 'rgba(74,240,196,0.15)' : step === n ? 'var(--blue)' : 'var(--bg4)',
                  border: `1px solid ${step > n ? 'var(--accent)' : step === n ? 'var(--blue)' : 'var(--border)'}`,
                  color: step > n ? 'var(--accent)' : '#fff',
                  flexShrink: 0,
                }}>
                  {step > n ? '✓' : n}
                </div>
                {i < 2 && (
                  <div style={{ flex: 1, height: 1, background: step > n ? 'var(--blue)' : 'var(--border)', margin: '0 8px' }} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
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

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <Field label="SENHA" error={errors.senha}>
                <Input icon="🔒" placeholder="Mínimo 8 caracteres" type={showPw ? 'text' : 'password'}
                  value={form.senha} onChange={v => handle('senha', v)} error={errors.senha}
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
                <Input icon="🔒" placeholder="Repete a senha" type={showCf ? 'text' : 'password'}
                  value={form.confirma} onChange={v => handle('confirma', v)} error={errors.confirma}
                  eye onEye={() => setShowCf(v => !v)} showPw={showCf} />
              </Field>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={styles.btnGhost} onClick={() => setStep(1)}>←</button>
                <button style={{ ...styles.btnPrimary, flex: 1, marginBottom: 0 }} onClick={nextStep}>Continuar →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
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
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={styles.btnGhost} onClick={() => setStep(2)}>←</button>
                <button
                  style={{ ...styles.btnPrimary, flex: 1, marginBottom: 0, opacity: loading ? 0.7 : 1 }}
                  onClick={handleSubmit} disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar minha conta'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Sub-componentes ───
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 7 }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'block' }}>{error}</span>}
    </div>
  )
}

function Input({ icon, placeholder, type = 'text', value, onChange, error, eye, onEye, showPw }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>
        {icon}
      </span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'rgba(10,21,48,0.8)',
          border: `1px solid ${error ? 'rgba(240,106,106,0.6)' : 'var(--border)'}`,
          borderRadius: 10, padding: `12px 14px 12px ${eye ? '40px' : '40px'}`,
          paddingRight: eye ? 42 : 14,
          color: 'var(--white)', fontSize: 15, outline: 'none',
        }}
      />
      {eye && (
        <button type="button" onClick={onEye}
          style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>
          {showPw ? '🙈' : '👁'}
        </button>
      )}
    </div>
  )
}

const styles = {
  page: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' },
  left: {
    position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '48px 56px',
    background: 'linear-gradient(160deg, #060d1f 0%, #03070f 100%)',
  },
  blob1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,75,204,0.4) 0%, transparent 70%)', top: -100, left: -100, filter: 'blur(100px)', pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,240,196,0.1) 0%, transparent 70%)', bottom: -80, right: -80, filter: 'blur(100px)', pointerEvents: 'none' },
  grid: { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(91,139,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,139,245,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' },
  logo: { position: 'relative', zIndex: 2, fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800 },
  leftTitle: { position: 'relative', zIndex: 2, fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 },
  grad: { background: 'linear-gradient(135deg, #93b4fa, #4af0c4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  leftSub: { position: 'relative', zIndex: 2, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 },
  benefitIcon: { width: 38, height: 38, borderRadius: 10, background: 'rgba(26,75,204,0.2)', border: '1px solid rgba(91,139,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  right: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px', background: 'var(--bg)', overflowY: 'auto' },
  formBox: { width: '100%', maxWidth: 420 },
  formTitle: { fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: -1, marginBottom: 8 },
  btnPrimary: { width: '100%', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 0, boxShadow: '0 0 28px rgba(46,99,232,0.35)' },
  btnGhost: { background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', color: 'var(--white)', fontSize: 15, cursor: 'pointer' },
  select: { width: '100%', background: 'rgba(10,21,48,0.8)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--white)', fontSize: 15, outline: 'none', appearance: 'none' },
}