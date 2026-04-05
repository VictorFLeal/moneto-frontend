import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  function validate() {
    const e = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Insere um e-mail válido.'
    if (form.password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 1800)
  }

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
  }

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
            Controle total<br />
            das suas <span style={styles.grad}>finanças</span><br />
            em um lugar só
          </h2>
          <p style={styles.leftSub}>
            Lance gastos pelo WhatsApp, visualize insights no dashboard e tome decisões financeiras com confiança.
          </p>
        </div>

        <div style={styles.testimonial}>
          <p style={styles.testimonialText}>
            "Em 3 meses usando o Moneto, consegui economizar R$ 800 por mês só identificando gastos que nem percebia."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.avatar}>RS</div>
            <div>
              <div style={{ color: '#fbbf24', fontSize: 12, marginBottom: 2 }}>★★★★★</div>
              <strong style={{ fontSize: 13 }}>Rafael Santos</strong>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Designer · São Paulo</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={styles.formTitle}>Bem-vindo de volta 👋</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Não tem conta?{' '}
              <Link to="/register" style={{ color: 'var(--blue-l)', fontWeight: 600 }}>
                Criar conta grátis
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>E-MAIL</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>✉</span>
                <input
                  style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={form.email}
                  onChange={e => handle('email', e.target.value)}
                />
              </div>
              {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
            </div>

            {/* Senha */}
            <div style={styles.field}>
              <label style={styles.label}>SENHA</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  style={{ ...styles.input, paddingRight: 42, ...(errors.password ? styles.inputError : {}) }}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => handle('password', e.target.value)}
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
            </div>

            {/* Extras */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--muted)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--blue)' }} />
                Lembrar de mim
              </label>
              <a href="#" style={{ fontSize: 14, color: 'var(--blue-l)', fontWeight: 500 }}>Esqueci a senha</a>
            </div>

            <button type="submit" style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na conta'}
            </button>
          </form>

          <div style={styles.divider}><span style={styles.dividerText}>ou continue com</span></div>

          <button style={styles.btnGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' },
  left: {
    position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '48px 56px',
    background: 'linear-gradient(160deg, #060d1f 0%, #03070f 100%)',
  },
  blob1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,75,204,0.4) 0%, transparent 70%)',
    top: -100, left: -100, filter: 'blur(100px)', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(74,240,196,0.1) 0%, transparent 70%)',
    bottom: -80, right: -80, filter: 'blur(100px)', pointerEvents: 'none',
  },
  grid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(91,139,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,139,245,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
  logo: {
    position: 'relative', zIndex: 2,
    fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800,
  },
  leftTitle: {
    position: 'relative', zIndex: 2,
    fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800,
    letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16,
  },
  grad: {
    background: 'linear-gradient(135deg, #93b4fa, #4af0c4)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  leftSub: { position: 'relative', zIndex: 2, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 },
  testimonial: {
    position: 'relative', zIndex: 2,
    background: 'rgba(10,21,48,0.75)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '20px 24px', backdropFilter: 'blur(12px)',
  },
  testimonialText: { fontSize: 14, lineHeight: 1.65, marginBottom: 14, color: 'var(--white)' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 13,
  },
  right: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 56px', background: 'var(--bg)',
  },
  formBox: { width: '100%', maxWidth: 400 },
  formTitle: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: -1, marginBottom: 8 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 7 },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' },
  input: {
    width: '100%', background: 'rgba(10,21,48,0.8)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 14px 12px 40px', color: 'var(--white)',
    fontSize: 15, outline: 'none',
  },
  inputError: { borderColor: 'rgba(240,106,106,0.6)' },
  eyeBtn: {
    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--muted)',
  },
  errorMsg: { fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'block' },
  btnPrimary: {
    width: '100%', background: 'var(--blue)', color: '#fff',
    border: 'none', borderRadius: 10, padding: '14px', fontSize: 15,
    fontWeight: 600, cursor: 'pointer', marginBottom: 18,
    boxShadow: '0 0 28px rgba(46,99,232,0.35)',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 16px' },
  dividerText: { color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap', padding: '0 4px',
    borderTop: 'none',
    background: 'linear-gradient(var(--border), var(--border)) no-repeat center / 100% 1px',
  },
  btnGoogle: {
    width: '100%', background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px', color: 'var(--white)', fontSize: 14,
    fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
}