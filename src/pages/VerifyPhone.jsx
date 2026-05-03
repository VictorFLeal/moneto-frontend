import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { verifyPhone, resendCode } from '../services/api'

export default function VerifyPhone() {
  const navigate = useNavigate()
  const location = useLocation()

  const telefoneInicial = location.state?.telefone || ''

  const [telefone, setTelefone] = useState(telefoneInicial)
  const [codigo, setCodigo] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(30)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer(t => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  async function handleVerify(e) {
    e.preventDefault()

    if (!telefone.trim()) {
      setError('Telefone não informado.')
      return
    }

    if (!codigo.trim()) {
      setError('Digite o código recebido no WhatsApp.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await verifyPhone({
        telefone,
        codigo,
      })

      setMessage('WhatsApp verificado com sucesso ✅')

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)

    } catch (err) {
      setError(err.response?.data?.error || 'Código inválido ou expirado.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (timer > 0) return

    if (!telefone.trim()) {
      setError('Telefone não informado.')
      return
    }

    try {
      setResending(true)
      setError('')
      setMessage('')

      await resendCode(telefone)

      setMessage('Novo código enviado no WhatsApp 📩')
      setTimer(30)

    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao reenviar código.')
    } finally {
      setResending(false)
    }
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '24px 16px' : '40px 20px',
      overflowX: 'hidden',
      position: 'relative',
    },
    blob1: {
      position: 'fixed',
      width: isMobile ? 360 : 600,
      height: isMobile ? 360 : 600,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(26,75,204,0.25) 0%, transparent 70%)',
      top: -160,
      left: -160,
      filter: 'blur(120px)',
      pointerEvents: 'none',
    },
    blob2: {
      position: 'fixed',
      width: isMobile ? 300 : 420,
      height: isMobile ? 300 : 420,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74,240,196,0.08) 0%, transparent 70%)',
      bottom: -120,
      right: -100,
      filter: 'blur(100px)',
      pointerEvents: 'none',
    },
    card: {
      width: '100%',
      maxWidth: 430,
      background: 'rgba(10,21,48,0.72)',
      border: '1px solid rgba(91,139,245,0.14)',
      borderRadius: 20,
      padding: isMobile ? '24px 18px' : '32px 28px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.32)',
      position: 'relative',
      zIndex: 2,
      boxSizing: 'border-box',
    },
    logo: {
      fontFamily: 'Syne, sans-serif',
      fontSize: 22,
      fontWeight: 800,
      textAlign: 'center',
      marginBottom: 26,
      letterSpacing: 3,
      color: 'var(--white)',
    },
    iconBox: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: 'rgba(46,99,232,0.12)',
      border: '1px solid rgba(91,139,245,0.22)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 28,
      margin: '0 auto 18px',
    },
    title: {
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? 23 : 26,
      fontWeight: 800,
      letterSpacing: -0.5,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      color: 'var(--muted)',
      fontSize: 14,
      lineHeight: 1.6,
      textAlign: 'center',
      marginBottom: 26,
    },
    field: {
      marginBottom: 16,
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
      boxSizing: 'border-box',
    },
    codeInput: {
      width: '100%',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '14px 16px',
      color: 'var(--white)',
      fontSize: 22,
      fontWeight: 800,
      fontFamily: 'Syne, sans-serif',
      letterSpacing: 8,
      textAlign: 'center',
      outline: 'none',
      boxSizing: 'border-box',
    },
    primaryBtn: {
      width: '100%',
      background: 'var(--blue)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      boxShadow: '0 0 28px rgba(46,99,232,0.35)',
      marginTop: 4,
    },
    resendBtn: {
      width: '100%',
      background: 'transparent',
      border: '1px solid rgba(91,139,245,0.18)',
      borderRadius: 10,
      padding: 12,
      color: timer > 0 ? 'var(--muted)' : 'var(--blue-l)',
      fontSize: 14,
      fontWeight: 600,
      cursor: timer > 0 || resending ? 'not-allowed' : 'pointer',
      marginTop: 12,
    },
    alertSuccess: {
      marginTop: 16,
      background: 'rgba(74,240,196,0.08)',
      border: '1px solid rgba(74,240,196,0.22)',
      color: 'var(--accent)',
      borderRadius: 10,
      padding: 12,
      fontSize: 13,
      lineHeight: 1.5,
      textAlign: 'center',
    },
    alertError: {
      marginTop: 16,
      background: 'rgba(240,106,106,0.08)',
      border: '1px solid rgba(240,106,106,0.22)',
      color: 'var(--red)',
      borderRadius: 10,
      padding: 12,
      fontSize: 13,
      lineHeight: 1.5,
      textAlign: 'center',
    },
    footer: {
      marginTop: 22,
      textAlign: 'center',
      fontSize: 14,
      color: 'var(--muted)',
    },
    link: {
      color: 'var(--blue-l)',
      fontWeight: 600,
      textDecoration: 'none',
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.logo}>MONETO</div>

        <div style={styles.iconBox}>🔐</div>

        <h1 style={styles.title}>Verifique seu WhatsApp</h1>

        <p style={styles.subtitle}>
          Enviamos um código para o WhatsApp informado no cadastro.
          Digite o código abaixo para ativar os recursos do MONETO.
        </p>

        <form onSubmit={handleVerify}>
          <div style={styles.field}>
            <label style={styles.label}>WHATSAPP</label>
            <input
              style={styles.input}
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="5567999999999"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>CÓDIGO DE VERIFICAÇÃO</label>
            <input
              style={styles.codeInput}
              value={codigo}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setCodigo(value)
              }}
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
            />
          </div>

          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar WhatsApp'}
          </button>
        </form>

        <button
          type="button"
          style={styles.resendBtn}
          onClick={handleResend}
          disabled={timer > 0 || resending}
        >
          {resending
            ? 'Reenviando...'
            : timer > 0
              ? `Reenviar código em ${timer}s`
              : 'Reenviar código'}
        </button>

        {message && <div style={styles.alertSuccess}>{message}</div>}
        {error && <div style={styles.alertError}>{error}</div>}

        <div style={styles.footer}>
          Já verificou?{' '}
          <Link to="/login" style={styles.link}>
            Entrar na conta
          </Link>
        </div>
      </div>

      <style>{`
        input::placeholder {
          color: rgba(122,154,191,0.35);
        }

        input:focus {
          border-color: rgba(46,99,232,0.45) !important;
          box-shadow: 0 0 0 3px rgba(46,99,232,0.1) !important;
        }
      `}</style>
    </div>
  )
}