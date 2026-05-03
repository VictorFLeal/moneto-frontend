import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleSubmit(ev) {
    ev.preventDefault()

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Insere um e-mail válido.')
      return
    }

    setError('')
    setSent(true)
  }

  const styles = {
    page: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
    },
    left: {
      position: 'relative',
      overflow: 'hidden',
      display: isMobile ? 'none' : 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px 56px',
      background: 'linear-gradient(160deg, #060d1f 0%, #03070f 100%)',
    },
    blob1: {
      position: 'absolute',
      width: 500,
      height: 500,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(26,75,204,0.4) 0%, transparent 70%)',
      top: -100,
      left: -100,
      filter: 'blur(100px)',
      pointerEvents: 'none',
    },
    blob2: {
      position: 'absolute',
      width: 400,
      height: 400,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74,240,196,0.1) 0%, transparent 70%)',
      bottom: -80,
      right: -80,
      filter: 'blur(100px)',
      pointerEvents: 'none',
    },
    grid: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(91,139,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,139,245,0.04) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    },
    logo: {
      position: 'relative',
      zIndex: 2,
      fontFamily: 'Syne, sans-serif',
      fontSize: 26,
      fontWeight: 800,
    },
    mobileLogo: {
      display: isMobile ? 'block' : 'none',
      fontFamily: 'Syne, sans-serif',
      fontSize: 28,
      fontWeight: 800,
      marginBottom: 28,
      textAlign: 'center',
    },
    leftTitle: {
      position: 'relative',
      zIndex: 2,
      fontFamily: 'Syne, sans-serif',
      fontSize: 36,
      fontWeight: 800,
      letterSpacing: -1.5,
      lineHeight: 1.1,
      marginBottom: 16,
    },
    grad: {
      background: 'linear-gradient(135deg, #93b4fa, #4af0c4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    leftSub: {
      position: 'relative',
      zIndex: 2,
      color: 'var(--muted)',
      fontSize: 15,
      lineHeight: 1.7,
    },
    testimonial: {
      position: 'relative',
      zIndex: 2,
      background: 'rgba(10,21,48,0.75)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px 24px',
      backdropFilter: 'blur(12px)',
    },
    testimonialText: {
      fontSize: 14,
      lineHeight: 1.65,
      marginBottom: 14,
      color: 'var(--white)',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 13,
      flexShrink: 0,
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '28px 18px' : '48px 56px',
      background: 'var(--bg)',
      minHeight: isMobile ? '100vh' : 'auto',
    },
    formBox: {
      width: '100%',
      maxWidth: 400,
      minWidth: 0,
    },
    header: {
      marginBottom: isMobile ? 26 : 32,
      textAlign: isMobile ? 'center' : 'left',
    },
    formTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 25 : 28,
      fontWeight: 800,
      letterSpacing: -1,
      marginBottom: 8,
    },
    field: {
      marginBottom: 18,
    },
    label: {
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      color: 'var(--muted)',
      marginBottom: 7,
    },
    inputWrap: {
      position: 'relative',
      width: '100%',
    },
    inputIcon: {
      position: 'absolute',
      left: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 15,
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(10,21,48,0.8)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 14px 12px 40px',
      color: 'var(--white)',
      fontSize: 15,
      outline: 'none',
    },
    inputError: {
      borderColor: 'rgba(240,106,106,0.6)',
    },
    errorMsg: {
      fontSize: 12,
      color: 'var(--red)',
      marginTop: 5,
      display: 'block',
    },
    btnPrimary: {
      width: '100%',
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: 18,
      boxShadow: '0 0 28px rgba(46,99,232,0.35)',
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      color: 'var(--blue-l)',
      fontSize: 14,
      fontWeight: 600,
      textDecoration: 'none',
    },
    successBox: {
      background: 'rgba(10,21,48,0.8)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 20 : 24,
      textAlign: 'center',
      marginBottom: 18,
    },
    successIcon: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 14px',
      fontWeight: 800,
    },
    successTitle: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 18 : 20,
      marginBottom: 8,
    },
    successText: {
      color: 'var(--muted)',
      fontSize: 14,
      lineHeight: 1.6,
    },
    btnSecondary: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'center',
      background: 'transparent',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 14,
      color: 'var(--white)',
      fontSize: 14,
      fontWeight: 600,
      textDecoration: 'none',
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.grid} />

        <div style={styles.logo}>
          Moneto
        </div>

        <div>
          <h2 style={styles.leftTitle}>
            Recupere o acesso<br />
            à sua <span style={styles.grad}>vida financeira</span>
          </h2>

          <p style={styles.leftSub}>
            Informe seu e-mail e enviaremos instruções para você voltar a acessar sua conta.
          </p>
        </div>

        <div style={styles.testimonial}>
          <p style={styles.testimonialText}>
            “Organização financeira começa com clareza. O Moneto te ajuda a acompanhar seus gastos de forma simples.”
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.avatar}>M</div>

            <div>
              <div style={{ color: '#fbbf24', fontSize: 12, marginBottom: 2 }}>★★★★★</div>
              <strong style={{ fontSize: 13 }}>MONETO</strong>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Controle financeiro inteligente</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.mobileLogo}>
            Moneto
          </div>

          <div style={styles.header}>
            <h1 style={styles.formTitle}>Esqueceu sua senha?</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
              Sem problemas. Digite seu e-mail para continuar.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>E-MAIL</label>

                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>✉</span>
                  <input
                    style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                  />
                </div>

                {error && <span style={styles.errorMsg}>{error}</span>}
              </div>

              <button type="submit" style={styles.btnPrimary}>
                Enviar instruções
              </button>

              <Link to="/login" style={styles.backLink}>
                ← Voltar para login
              </Link>
            </form>
          ) : (
            <div>
              <div style={styles.successBox}>
                <div style={styles.successIcon}>✓</div>

                <h2 style={styles.successTitle}>Solicitação registrada</h2>

                <p style={styles.successText}>
                  Se esse e-mail estiver cadastrado, enviaremos as instruções de recuperação.
                </p>
              </div>

              <Link to="/login" style={styles.btnSecondary}>
                Voltar para login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}