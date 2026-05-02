import { useEffect, useState } from 'react'
// import { updateUser } from '../../services/api'  // depois você cria isso

export default function Settings() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 pega do localStorage (igual você já faz no login)
    const stored = localStorage.getItem('moneto_user')

    if (stored) {
      const parsed = JSON.parse(stored)

      setUser(parsed)

      setForm({
        nome: parsed.nome || '',
        sobrenome: parsed.sobrenome || '',
        email: parsed.email || '',
        telefone: parsed.telefone || '',
      })
    }

    setLoading(false)
  }, [])

  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSave() {
    try {
      setLoading(true)

      // 🔥 ATUALIZA FRONT
      const updatedUser = {
        ...user,
        ...form,
      }

      localStorage.setItem('moneto_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      // 🔥 FUTURO BACK (quando tiver endpoint)
      /*
      await updateUser({
        nome: form.nome,
        sobrenome: form.sobrenome,
        telefone: form.telefone,
      })
      */

      alert('Dados atualizados com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar alterações')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: 30 }}>⏳</div>
        <div style={{ color: 'var(--muted)' }}>Carregando perfil...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Informações pessoais</div>

        <div style={styles.row}>
          <div style={styles.avatar}>
            {form.nome?.[0] || 'U'}
            {form.sobrenome?.[0] || ''}
          </div>

          <div>
            <button style={styles.btnGhost}>Alterar foto</button>
            <div style={styles.helper}>JPG, PNG até 2MB</div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Nome</label>
            <input
              value={form.nome}
              onChange={e => handleChange('nome', e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Sobrenome</label>
            <input
              value={form.sobrenome}
              onChange={e => handleChange('sobrenome', e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={styles.label}>E-mail</label>
          <input
            value={form.email}
            disabled
            style={{ ...styles.input, opacity: 0.6 }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={styles.label}>WhatsApp</label>
          <input
            value={form.telefone}
            onChange={e => handleChange('telefone', e.target.value)}
            style={styles.input}
          />
        </div>

        <button style={styles.btnPrimary} onClick={handleSave}>
          Salvar alterações
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 24,
  },

  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
  },

  helper: {
    fontSize: 11,
    color: 'var(--muted)',
    marginTop: 6,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  label: {
    fontSize: 12,
    color: 'var(--muted)',
    marginBottom: 6,
    display: 'block',
  },

  input: {
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px',
    color: 'var(--white)',
    fontSize: 14,
    outline: 'none',
  },

  btnPrimary: {
    marginTop: 20,
    background: 'var(--blue)',
    border: 'none',
    borderRadius: 10,
    padding: '12px',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },

  btnGhost: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 12px',
    color: 'var(--white)',
    cursor: 'pointer',
  },

  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40vh',
    flexDirection: 'column',
    gap: 12,
  },
}