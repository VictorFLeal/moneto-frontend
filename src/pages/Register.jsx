import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirma: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)

  function handle(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}

    if (!form.nome.trim()) e.nome = 'Digite seu nome'
    if (!form.sobrenome.trim()) e.sobrenome = 'Digite seu sobrenome'

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = 'E-mail inválido'

    if (!form.telefone.trim())
      e.telefone = 'Digite seu WhatsApp'

    if (form.senha.length < 8)
      e.senha = 'Mínimo 8 caracteres'

    if (form.senha !== form.confirma)
      e.confirma = 'Senhas não coincidem'

    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    setLoading(true)

    try {
      const res = await register({
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        password: form.senha,
        telefone: form.telefone,
        perfil: 'USER',
        plano: 'FREE'
      })

      localStorage.setItem('moneto_token', res.data.token)
      localStorage.setItem('moneto_user', JSON.stringify(res.data))

      navigate('/dashboard')

    } catch {
      alert('Erro ao criar conta. O e-mail pode já estar em uso.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>Criar conta ✨</h1>

        <Field label="Nome" error={errors.nome}>
          <Input value={form.nome} onChange={v => handle('nome', v)} />
        </Field>

        <Field label="Sobrenome" error={errors.sobrenome}>
          <Input value={form.sobrenome} onChange={v => handle('sobrenome', v)} />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} onChange={v => handle('email', v)} />
        </Field>

        <Field label="WhatsApp" error={errors.telefone}>
          <Input value={form.telefone} onChange={v => handle('telefone', v)} />
        </Field>

        <Field label="Senha" error={errors.senha}>
          <Input
            type={showPw ? 'text' : 'password'}
            value={form.senha}
            onChange={v => handle('senha', v)}
            eye
            showPw={showPw}
            onEye={() => setShowPw(!showPw)}
          />
        </Field>

        <Field label="Confirmar senha" error={errors.confirma}>
          <Input
            type={showCf ? 'text' : 'password'}
            value={form.confirma}
            onChange={v => handle('confirma', v)}
            eye
            showPw={showCf}
            onEye={() => setShowCf(!showCf)}
          />
        </Field>

        <button onClick={handleSubmit} style={styles.button}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>

        <p style={{ marginTop: 12 }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>

      </div>
    </div>
  )
}

/* ================= COMPONENTES ================= */

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13 }}>{label}</label>
      {children}
      {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
    </div>
  )
}

function Input({ type = 'text', value, onChange, eye, onEye, showPw }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: 8,
          border: '1px solid #333',
          background: '#0b132b',
          color: '#fff'
        }}
      />

            {eye && (
        <button
          type="button"
          onClick={onEye}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}

/* ================= ESTILO ================= */

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#020617'
  },
  card: {
    width: 320,
    padding: 24,
    background: '#0b132b',
    borderRadius: 12
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  }
}