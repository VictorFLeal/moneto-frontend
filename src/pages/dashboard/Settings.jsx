import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  plan:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  budget:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  bell:    'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  lock:    'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  logout:  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  check:   'M20 6L9 17l-5-5',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff:  'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
}

const NAV = [
  { id: 'perfil',        label: 'Perfil',        icon: icons.user },
  { id: 'plano',         label: 'Plano',          icon: icons.plan },
  { id: 'orcamento',     label: 'Orçamento',      icon: icons.budget },
  { id: 'notificacoes',  label: 'Notificações',   icon: icons.bell },
  { id: 'seguranca',     label: 'Segurança',      icon: icons.lock },
  { id: 'logout',        label: 'Sair da conta',  icon: icons.logout, danger: true },
]

const BUDGET_CATS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Tecnologia',
  'Vestuário',
  'Outros'
]

const INCOME_CATS = [
  'Salário',
  'Freelance',
  'Outros'
]

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        cursor: 'pointer',
        background: checked ? 'var(--blue)' : 'rgba(255,255,255,0.08)',
        border: `1.5px solid ${checked ? 'var(--blue)' : 'rgba(255,255,255,0.1)'}`,
        position: 'relative',
        transition: 'all 0.22s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 2,
        left: checked ? 22 : 2,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        transition: 'left 0.22s ease',
      }} />
    </div>
  )
}

function Toast({ msg, type, isMobile }) {
  if (!msg) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? 12 : 28,
      right: isMobile ? 12 : 28,
      left: isMobile ? 12 : 'auto',
      zIndex: 999,
      background: type === 'success' ? 'rgba(74,240,196,0.12)' : 'rgba(240,106,106,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(74,240,196,0.35)' : 'rgba(240,106,106,0.35)'}`,
      color: type === 'success' ? '#4af0c4' : '#f06a6a',
      borderRadius: 12,
      padding: '12px 20px',
      fontSize: 13,
      fontWeight: 600,
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      animation: 'slideUp 0.25s ease',
    }}>
      {type === 'success' ? '✓' : '✕'} {msg}
    </div>
  )
}

function SectionCard({ children, isMobile }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: isMobile ? 16 : 24,
      backdropFilter: 'blur(12px)',
      minWidth: 0,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        background: 'rgba(46,99,232,0.12)',
        border: '1px solid rgba(46,99,232,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--blue-l)',
        flexShrink: 0,
      }}>
        <Icon d={icon} size={15} />
      </div>
      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>{label}</span>
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.4,
      color: 'rgba(240,246,255,0.45)',
      marginBottom: 7,
      textTransform: 'uppercase',
    }}>
      {children}
    </label>
  )
}

function Input({ value, onChange, type = 'text', placeholder, disabled, right }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(91,139,245,0.14)',
          borderRadius: 10,
          padding: right ? '11px 44px 11px 14px' : '11px 14px',
          color: disabled ? 'var(--muted)' : 'var(--white)',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {right && (
        <div style={{
          position: 'absolute',
          right: 13,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted)',
          cursor: 'pointer',
        }}>
          {right}
        </div>
      )}
    </div>
  )
}

function SaveButton({ onClick, loading, label = 'Salvar alterações', isMobile }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        background: 'var(--blue)',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        padding: '11px 24px',
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.18s',
        boxShadow: '0 0 20px rgba(46,99,232,0.25)',
        width: isMobile ? '100%' : 'fit-content',
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: 13,
            height: 13,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            display: 'inline-block',
          }} />
          Salvando...
        </>
      ) : label}
    </button>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(91,139,245,0.08)', margin: '14px 0' }} />
}

export default function Settings() {
  const navigate = useNavigate()

  const [active, setActive] = useState('perfil')
  const [data, setData] = useState(null)
  const [plans, setPlans] = useState([])
  const [categories, setCategories] = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [recurringIncomes, setRecurringIncomes] = useState([])

  const [newBudgetCategory, setNewBudgetCategory] = useState('')
  const [newBudgetLimit, setNewBudgetLimit] = useState('')

  const [newIncomeDescricao, setNewIncomeDescricao] = useState('Salário')
  const [newIncomeValor, setNewIncomeValor] = useState('')
  const [newIncomeCategoria, setNewIncomeCategoria] = useState('Salário')
  const [newIncomeRegra, setNewIncomeRegra] = useState('QUINTO_DIA_UTIL')
  const [newIncomeDiaFixo, setNewIncomeDiaFixo] = useState(5)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingBudget, setSavingBudget] = useState(false)
  const [savingIncome, setSavingIncome] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [showSA, setShowSA] = useState(false)
  const [showSN, setShowSN] = useState(false)
  const [showSC, setShowSC] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500)
  }

  async function loadBudgets() {
    try {
      const res = await api.get('/budgets')
      setBudgetItems(res.data || [])
    } catch (err) {
      console.error('Erro ao carregar orçamentos:', err)
      setBudgetItems([])
    }
  }

  async function loadCategories() {
    try {
      const res = await api.get('/categories')
      setCategories(res.data || [])
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setCategories([])
    }
  }

  async function loadRecurringIncomes() {
    try {
      const res = await api.get('/recurring-incomes')
      setRecurringIncomes(res.data || [])
    } catch (err) {
      console.error('Erro ao carregar ganhos fixos:', err)
      setRecurringIncomes([])
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, plansRes, budgetsRes, categoriesRes, recurringRes] = await Promise.all([
          api.get('/settings'),
          api.get('/plans').catch(() => ({ data: [] })),
          api.get('/budgets').catch(() => ({ data: [] })),
          api.get('/categories').catch(() => ({ data: [] })),
          api.get('/recurring-incomes').catch(() => ({ data: [] })),
        ])

        setData(settingsRes.data)
        setPlans(plansRes.data)
        setBudgetItems(budgetsRes.data || [])
        setCategories(categoriesRes.data || [])
        setRecurringIncomes(recurringRes.data || [])
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login')
        } else {
          showToast('Erro ao carregar configurações.', 'error')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [navigate])

  async function save(extra = {}) {
    setSaving(true)

    try {
      const payload = { ...data, ...extra }
      const res = await api.put('/settings', payload)

      setData(res.data)

      const user = JSON.parse(localStorage.getItem('moneto_user') || '{}')

      localStorage.setItem('moneto_user', JSON.stringify({
        ...user,
        nome: res.data.nome,
        email: res.data.email,
        perfil: res.data.perfil,
        plano: res.data.plano,
      }))

      showToast('Alterações salvas com sucesso!')
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      else showToast(err.response?.data?.error || 'Erro ao salvar.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function savePassword() {
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      showToast('Preenche todos os campos de senha.', 'error')
      return
    }

    if (novaSenha.length < 8) {
      showToast('Nova senha deve ter mínimo 8 caracteres.', 'error')
      return
    }

    if (novaSenha !== confirmaSenha) {
      showToast('As senhas não coincidem.', 'error')
      return
    }

    await save({ senhaAtual, novaSenha })

    setSenhaAtual('')
    setNovaSenha('')
    setConfirmaSenha('')
  }

  function doLogout() {
    localStorage.removeItem('moneto_token')
    localStorage.removeItem('moneto_user')
    localStorage.removeItem('moneto_refresh')
    navigate('/login')
  }

  function set(field, value) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  function setNotif(key, value) {
    setData(prev => ({
      ...prev,
      notificacoes: {
        ...(prev.notificacoes || {}),
        [key]: value,
      },
    }))
  }

  function setBudgetLocal(id, field, value) {
    setBudgetItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  function setIncomeLocal(id, field, value) {
    setRecurringIncomes(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  function getBudgetCategoryOptions() {
    const fromBackend = categories
      .filter(c => String(c.tipo || '').toUpperCase() === 'DESPESA')
      .map(c => c.nome)

    const all = [...BUDGET_CATS, ...fromBackend, ...budgetItems.map(b => b.categoria)]
      .filter(Boolean)
      .map(c => String(c).trim())
      .filter(Boolean)

    return [...new Set(all)]
  }

  function getIncomeCategoryOptions() {
    const fromBackend = categories
      .filter(c => String(c.tipo || '').toUpperCase() === 'RECEITA')
      .map(c => c.nome)

    const all = [...INCOME_CATS, ...fromBackend, ...recurringIncomes.map(i => i.categoria)]
      .filter(Boolean)
      .map(c => String(c).trim())
      .filter(Boolean)

    return [...new Set(all)]
  }

  function isDefaultBudget(categoria) {
    return BUDGET_CATS.some(cat => cat.toLowerCase() === String(categoria || '').toLowerCase())
  }

  function formatRule(rule, day) {
    if (rule === 'DIA_FIXO') return `Dia ${day || 5}`
    return '5º dia útil'
  }

  async function updateBudgetItem(item) {
    if (!item?.id) return

    if (!item.categoria || String(item.categoria).trim() === '') {
      showToast('Categoria não pode ficar vazia.', 'error')
      await loadBudgets()
      return
    }

    if (Number(item.limite) < 0) {
      showToast('O limite não pode ser negativo.', 'error')
      await loadBudgets()
      return
    }

    try {
      await api.put(`/budgets/${item.id}`, {
        categoria: String(item.categoria).trim(),
        limite: Number(item.limite || 0),
        icone: item.icone || null,
      })

      await loadCategories()
      showToast('Orçamento atualizado com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar orçamento:', err)
      showToast(err.response?.data?.error || 'Erro ao atualizar orçamento.', 'error')
      await loadBudgets()
    }
  }

  async function createBudgetItem() {
    const categoria = String(newBudgetCategory || '').trim()
    const limite = Number(newBudgetLimit || 0)

    if (!categoria) {
      showToast('Informe uma categoria.', 'error')
      return
    }

    if (!newBudgetLimit || limite < 0) {
      showToast('Informe um limite válido.', 'error')
      return
    }

    setSavingBudget(true)

    try {
      await api.post('/budgets', {
        categoria,
        limite,
        icone: null,
      })

      setNewBudgetCategory('')
      setNewBudgetLimit('')
      await loadBudgets()
      await loadCategories()
      showToast('Orçamento criado com sucesso!')
    } catch (err) {
      console.error('Erro ao criar orçamento:', err)
      showToast(err.response?.data?.error || 'Erro ao criar orçamento.', 'error')
    } finally {
      setSavingBudget(false)
    }
  }

  async function deleteBudgetItem(id) {
    const budget = budgetItems.find(item => item.id === id)

    if (!window.confirm(isDefaultBudget(budget?.categoria) ? 'Esta é uma categoria padrão. O limite será zerado. Deseja continuar?' : 'Deseja excluir este orçamento?')) return

    try {
      await api.delete(`/budgets/${id}`)
      await loadBudgets()
      await loadCategories()
      showToast(isDefaultBudget(budget?.categoria) ? 'Limite zerado com sucesso!' : 'Orçamento excluído com sucesso!')
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err)
      showToast(err.response?.data?.error || 'Erro ao excluir orçamento.', 'error')
    }
  }

  async function createRecurringIncome() {
    const descricao = String(newIncomeDescricao || '').trim()
    const valor = Number(newIncomeValor || 0)
    const categoria = String(newIncomeCategoria || '').trim()

    if (!descricao) {
      showToast('Informe a descrição do ganho fixo.', 'error')
      return
    }

    if (!valor || valor <= 0) {
      showToast('Informe um valor válido.', 'error')
      return
    }

    if (!categoria) {
      showToast('Informe uma categoria.', 'error')
      return
    }

    if (newIncomeRegra === 'DIA_FIXO' && (!newIncomeDiaFixo || Number(newIncomeDiaFixo) < 1 || Number(newIncomeDiaFixo) > 31)) {
      showToast('Informe um dia entre 1 e 31.', 'error')
      return
    }

    setSavingIncome(true)

    try {
      await api.post('/recurring-incomes', {
        descricao,
        valor,
        categoria,
        regraLancamento: newIncomeRegra,
        diaFixo: newIncomeRegra === 'DIA_FIXO' ? Number(newIncomeDiaFixo) : null,
        ativo: true,
      })

      setNewIncomeDescricao('Salário')
      setNewIncomeValor('')
      setNewIncomeCategoria('Salário')
      setNewIncomeRegra('QUINTO_DIA_UTIL')
      setNewIncomeDiaFixo(5)

      await loadRecurringIncomes()
      await loadCategories()
      showToast('Ganho mensal fixo criado com sucesso!')
    } catch (err) {
      console.error('Erro ao criar ganho fixo:', err)
      showToast(err.response?.data?.error || 'Erro ao criar ganho fixo.', 'error')
    } finally {
      setSavingIncome(false)
    }
  }

  async function updateRecurringIncome(item) {
    if (!item?.id) return

    if (!item.descricao || String(item.descricao).trim() === '') {
      showToast('Descrição não pode ficar vazia.', 'error')
      await loadRecurringIncomes()
      return
    }

    if (!item.valor || Number(item.valor) <= 0) {
      showToast('Valor deve ser maior que zero.', 'error')
      await loadRecurringIncomes()
      return
    }

    if (!item.categoria || String(item.categoria).trim() === '') {
      showToast('Categoria não pode ficar vazia.', 'error')
      await loadRecurringIncomes()
      return
    }

    if (item.regraLancamento === 'DIA_FIXO' && (!item.diaFixo || Number(item.diaFixo) < 1 || Number(item.diaFixo) > 31)) {
      showToast('Dia fixo deve estar entre 1 e 31.', 'error')
      await loadRecurringIncomes()
      return
    }

    try {
      await api.put(`/recurring-incomes/${item.id}`, {
        descricao: String(item.descricao).trim(),
        valor: Number(item.valor || 0),
        categoria: String(item.categoria).trim(),
        regraLancamento: item.regraLancamento || 'QUINTO_DIA_UTIL',
        diaFixo: item.regraLancamento === 'DIA_FIXO' ? Number(item.diaFixo || 5) : null,
        ativo: item.ativo !== false,
      })

      await loadRecurringIncomes()
      await loadCategories()
      showToast('Ganho fixo atualizado com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar ganho fixo:', err)
      showToast(err.response?.data?.error || 'Erro ao atualizar ganho fixo.', 'error')
      await loadRecurringIncomes()
    }
  }

  async function toggleRecurringIncome(item) {
    if (!item?.id) return

    try {
      await api.put(`/recurring-incomes/${item.id}`, {
        descricao: item.descricao,
        valor: Number(item.valor || 0),
        categoria: item.categoria,
        regraLancamento: item.regraLancamento || 'QUINTO_DIA_UTIL',
        diaFixo: item.regraLancamento === 'DIA_FIXO' ? Number(item.diaFixo || 5) : null,
        ativo: item.ativo === false,
      })

      await loadRecurringIncomes()
      showToast(item.ativo === false ? 'Ganho fixo ativado!' : 'Ganho fixo pausado!')
    } catch (err) {
      console.error('Erro ao alterar status do ganho fixo:', err)
      showToast(err.response?.data?.error || 'Erro ao alterar ganho fixo.', 'error')
    }
  }

  async function deleteRecurringIncome(id) {
    if (!window.confirm('Deseja excluir este ganho mensal fixo?')) return

    try {
      await api.delete(`/recurring-incomes/${id}`)
      await loadRecurringIncomes()
      showToast('Ganho fixo excluído com sucesso!')
    } catch (err) {
      console.error('Erro ao excluir ganho fixo:', err)
      showToast(err.response?.data?.error || 'Erro ao excluir ganho fixo.', 'error')
    }
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid rgba(255,255,255,0.06)',
        borderTopColor: 'var(--blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Carregando configurações...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const notif = data?.notificacoes || {}
  const curPlan = plans.find(p => p.planId === data?.plano)
  const budgetCategoryOptions = getBudgetCategoryOptions()
  const incomeCategoryOptions = getIncomeCategoryOptions()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '210px 1fr',
      gap: isMobile ? 14 : 20,
      maxWidth: isMobile ? '100%' : 1100,
      width: '100%',
      overflowX: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: 6,
        overflowX: isMobile ? 'auto' : 'visible',
        paddingBottom: isMobile ? 4 : 0,
        scrollbarWidth: 'none',
      }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => n.id === 'logout' ? doLogout() : setActive(n.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: 10,
              padding: isMobile ? '10px 12px' : '10px 14px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              background: active === n.id ? 'rgba(46,99,232,0.15)' : 'transparent',
              color: n.danger ? 'var(--red)' : active === n.id ? 'var(--white)' : 'var(--muted)',
              transition: 'all 0.18s',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Icon d={n.icon} size={15} />
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ minWidth: 0 }}>
        {active === 'perfil' && (
          <SectionCard isMobile={isMobile}>
            <SectionTitle icon={icons.user} label="Informações pessoais" />

            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 16,
              marginBottom: 24,
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--blue), var(--blue-l))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {(data?.nome?.[0] || '?').toUpperCase()}{(data?.sobrenome?.[0] || '').toUpperCase()}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  wordBreak: 'break-word',
                }}>
                  {data?.nome} {data?.sobrenome}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--muted)',
                  marginTop: 3,
                  wordBreak: 'break-word',
                }}>
                  {data?.email}
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 14,
              marginBottom: 14,
            }}>
              <div>
                <FieldLabel>Nome</FieldLabel>
                <Input value={data?.nome} onChange={v => set('nome', v)} placeholder="Nome" />
              </div>

              <div>
                <FieldLabel>Sobrenome</FieldLabel>
                <Input value={data?.sobrenome} onChange={v => set('sobrenome', v)} placeholder="Sobrenome" />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <FieldLabel>E-mail</FieldLabel>
              <Input value={data?.email} onChange={() => {}} disabled placeholder="Email" />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>O e-mail não pode ser alterado.</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <FieldLabel>WhatsApp</FieldLabel>
              <Input value={data?.telefone} onChange={v => set('telefone', v)} placeholder="+55 (11) 99999-9999" />
            </div>

            <div style={{ marginBottom: 22 }}>
              <FieldLabel>Perfil</FieldLabel>
              <div style={{
                display: 'flex',
                gap: 10,
                flexDirection: isMobile ? 'column' : 'row',
              }}>
                {['individual', 'business'].map(p => (
                  <button
                    key={p}
                    onClick={() => set('perfil', p)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: `1.5px solid ${data?.perfil === p ? 'var(--blue)' : 'rgba(255,255,255,0.08)'}`,
                      background: data?.perfil === p ? 'rgba(46,99,232,0.12)' : 'rgba(255,255,255,0.03)',
                      color: data?.perfil === p ? 'var(--white)' : 'var(--muted)',
                      fontSize: 13,
                      fontWeight: data?.perfil === p ? 600 : 400,
                      transition: 'all 0.18s',
                    }}
                  >
                    {p === 'individual' ? '👤 Pessoa física' : '🏢 Empresa'}
                  </button>
                ))}
              </div>
            </div>

            <SaveButton onClick={() => save()} loading={saving} isMobile={isMobile} />
          </SectionCard>
        )}

        {active === 'plano' && (
          <SectionCard isMobile={isMobile}>
            <SectionTitle icon={icons.plan} label="Plano atual" />

            {curPlan && (
              <div style={{
                padding: '18px 20px',
                borderRadius: 14,
                marginBottom: 24,
                background: `${curPlan.cor}12`,
                border: `1.5px solid ${curPlan.cor}44`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 14,
                  flexDirection: isMobile ? 'column' : 'row',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: curPlan.cor }}>
                      {curPlan.nome}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{curPlan.descricao}</div>
                  </div>

                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: curPlan.cor }}>{curPlan.preco}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{curPlan.periodo}</div>
                  </div>
                </div>

                {curPlan.features?.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {curPlan.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'rgba(240,246,255,0.7)' }}>
                        <span style={{ color: curPlan.cor }}><Icon d={icons.check} size={13} /></span> {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {plans.length > 0 && (
              <>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--muted)' }}>
                  Fazer upgrade
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plans.filter(p => p.planId !== data?.plano).map(p => (
                    <div key={p.planId} style={{
                      padding: '16px 18px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      flexDirection: isMobile ? 'column' : 'row',
                    }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: p.cor }}>{p.nome}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{p.descricao}</div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: isMobile ? 'stretch' : 'center',
                        gap: 14,
                        width: isMobile ? '100%' : 'auto',
                        flexDirection: isMobile ? 'column' : 'row',
                      }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 800, color: p.cor }}>{p.preco}</div>

                        <button
                          onClick={() => { set('plano', p.planId); save({ plano: p.planId }) }}
                          disabled={saving}
                          style={{
                            background: p.cor + '20',
                            color: p.cor,
                            border: `1px solid ${p.cor}44`,
                            borderRadius: 8,
                            padding: '7px 16px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            width: isMobile ? '100%' : 'auto',
                          }}
                        >
                          Upgrade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </SectionCard>
        )}

        {active === 'orcamento' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionCard isMobile={isMobile}>
              <SectionTitle icon={icons.budget} label="Orçamentos mensais" />

              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>
                Define o limite de gastos por categoria. Receberás alertas quando atingires 90% do limite.
              </div>

              <div style={{
                padding: isMobile ? 14 : 16,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(91,139,245,0.12)',
                marginBottom: 20,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto',
                  gap: 10,
                  alignItems: 'end',
                }}>
                  <div>
                    <FieldLabel>Categoria</FieldLabel>
                    <input
                      list="budget-categories"
                      value={newBudgetCategory}
                      onChange={e => setNewBudgetCategory(e.target.value)}
                      placeholder="Ex: Academia, Pet, Mercado..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(91,139,245,0.14)',
                        borderRadius: 10,
                        padding: '11px 14px',
                        color: 'var(--white)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />

                    <datalist id="budget-categories">
                      {budgetCategoryOptions.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                  </div>

                  <div>
                    <FieldLabel>Limite mensal</FieldLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$</span>
                      <input
                        type="number"
                        value={newBudgetLimit}
                        onChange={e => setNewBudgetLimit(e.target.value)}
                        placeholder="0,00"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(91,139,245,0.14)',
                          borderRadius: 10,
                          padding: '11px 14px',
                          color: 'var(--white)',
                          fontSize: 14,
                          outline: 'none',
                          textAlign: isMobile ? 'left' : 'right',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={createBudgetItem}
                    disabled={savingBudget}
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '11px 18px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: savingBudget ? 'not-allowed' : 'pointer',
                      opacity: savingBudget ? 0.7 : 1,
                      boxShadow: '0 0 20px rgba(46,99,232,0.25)',
                      width: isMobile ? '100%' : 'fit-content',
                    }}
                  >
                    {savingBudget ? 'Criando...' : '+ Adicionar'}
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                columnGap: 24,
                rowGap: 0,
              }}>
                {budgetItems.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '34px 20px',
                    color: 'var(--muted)',
                    fontSize: 13,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(91,139,245,0.08)',
                    borderRadius: 12,
                  }}>
                    Nenhum orçamento cadastrado ainda. Crie sua primeira categoria acima.
                  </div>
                ) : (
                  budgetItems.map((budget, i) => (
                    <div key={budget.id || i}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 130px 38px',
                        alignItems: 'center',
                        padding: '13px 0',
                        gap: 10,
                      }}>
                        <input
                          value={budget.categoria ?? ''}
                          onChange={e => setBudgetLocal(budget.id, 'categoria', e.target.value)}
                          onBlur={() => updateBudgetItem(budget)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'transparent',
                            border: '1px solid transparent',
                            borderRadius: 8,
                            padding: '8px 0',
                            color: 'var(--white)',
                            fontSize: 14,
                            fontWeight: 500,
                            outline: 'none',
                          }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                          <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$</span>
                          <input
                            type="number"
                            value={budget.limite ?? ''}
                            onChange={e => setBudgetLocal(budget.id, 'limite', e.target.value)}
                            onBlur={() => updateBudgetItem(budget)}
                            style={{
                              width: '100%',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(91,139,245,0.14)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: 'var(--white)',
                              fontSize: 14,
                              outline: 'none',
                              textAlign: 'right',
                            }}
                          />
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>/mês</span>
                        </div>

                        <button
                          onClick={() => deleteBudgetItem(budget.id)}
                          style={{
                            width: isMobile ? '100%' : 36,
                            height: 36,
                            borderRadius: 9,
                            background: 'rgba(240,106,106,0.08)',
                            border: '1px solid rgba(240,106,106,0.2)',
                            color: 'var(--red)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                          }}
                          title="Excluir orçamento"
                        >
                          🗑️
                        </button>
                      </div>

                      {!isMobile && i < budgetItems.length - 2 && <Divider />}
                      {isMobile && i < budgetItems.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard isMobile={isMobile}>
              <SectionTitle icon={icons.budget} label="Ganhos mensais fixos" />

              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>
                Cadastre receitas que entram todo mês, como salário. O MONETO lança automaticamente quando chegar a regra definida.
              </div>

              <div style={{
                padding: isMobile ? 14 : 16,
                borderRadius: 12,
                background: 'rgba(74,240,196,0.05)',
                border: '1px solid rgba(74,240,196,0.14)',
                marginBottom: 20,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 130px 150px',
                  gap: 10,
                  alignItems: 'end',
                  marginBottom: 10,
                }}>
                  <div>
                    <FieldLabel>Descrição</FieldLabel>
                    <input
                      value={newIncomeDescricao}
                      onChange={e => setNewIncomeDescricao(e.target.value)}
                      placeholder="Ex: Salário, Freela fixo..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(91,139,245,0.14)',
                        borderRadius: 10,
                        padding: '11px 14px',
                        color: 'var(--white)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <FieldLabel>Valor</FieldLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$</span>
                      <input
                        type="number"
                        value={newIncomeValor}
                        onChange={e => setNewIncomeValor(e.target.value)}
                        placeholder="0,00"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(91,139,245,0.14)',
                          borderRadius: 10,
                          padding: '11px 14px',
                          color: 'var(--white)',
                          fontSize: 14,
                          outline: 'none',
                          textAlign: 'right',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Categoria</FieldLabel>
                    <input
                      list="income-categories"
                      value={newIncomeCategoria}
                      onChange={e => setNewIncomeCategoria(e.target.value)}
                      placeholder="Ex: Salário"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(91,139,245,0.14)',
                        borderRadius: 10,
                        padding: '11px 14px',
                        color: 'var(--white)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                    <datalist id="income-categories">
                      {incomeCategoryOptions.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 110px auto',
                  gap: 10,
                  alignItems: 'end',
                }}>
                  <div>
                    <FieldLabel>Regra de lançamento</FieldLabel>
                    <select
                      value={newIncomeRegra}
                      onChange={e => setNewIncomeRegra(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(91,139,245,0.14)',
                        borderRadius: 10,
                        padding: '11px 14px',
                        color: 'var(--white)',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    >
                      <option value="QUINTO_DIA_UTIL">5º dia útil</option>
                      <option value="DIA_FIXO">Dia fixo</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Dia</FieldLabel>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      disabled={newIncomeRegra !== 'DIA_FIXO'}
                      value={newIncomeDiaFixo}
                      onChange={e => setNewIncomeDiaFixo(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: newIncomeRegra !== 'DIA_FIXO' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(91,139,245,0.14)',
                        borderRadius: 10,
                        padding: '11px 14px',
                        color: newIncomeRegra !== 'DIA_FIXO' ? 'var(--muted)' : 'var(--white)',
                        fontSize: 14,
                        outline: 'none',
                        textAlign: 'right',
                      }}
                    />
                  </div>

                  <button
                    onClick={createRecurringIncome}
                    disabled={savingIncome}
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '11px 18px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: savingIncome ? 'not-allowed' : 'pointer',
                      opacity: savingIncome ? 0.7 : 1,
                      boxShadow: '0 0 20px rgba(46,99,232,0.25)',
                      width: isMobile ? '100%' : 'fit-content',
                    }}
                  >
                    {savingIncome ? 'Criando...' : '+ Adicionar'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recurringIncomes.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    color: 'var(--muted)',
                    fontSize: 13,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(91,139,245,0.08)',
                    borderRadius: 12,
                  }}>
                    Nenhum ganho fixo cadastrado ainda. Cadastre seu salário para o MONETO lançar automaticamente.
                  </div>
                ) : (
                  recurringIncomes.map((income, i) => (
                    <div key={income.id || i}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 120px 130px 120px 70px 38px',
                        alignItems: 'center',
                        padding: '13px 0',
                        gap: 10,
                      }}>
                        <input
                          value={income.descricao ?? ''}
                          onChange={e => setIncomeLocal(income.id, 'descricao', e.target.value)}
                          onBlur={() => updateRecurringIncome(income)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'transparent',
                            border: '1px solid transparent',
                            borderRadius: 8,
                            padding: '8px 0',
                            color: 'var(--white)',
                            fontSize: 14,
                            fontWeight: 500,
                            outline: 'none',
                          }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                          <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$</span>
                          <input
                            type="number"
                            value={income.valor ?? ''}
                            onChange={e => setIncomeLocal(income.id, 'valor', e.target.value)}
                            onBlur={() => updateRecurringIncome(income)}
                            style={{
                              width: '100%',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(91,139,245,0.14)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: 'var(--white)',
                              fontSize: 14,
                              outline: 'none',
                              textAlign: 'right',
                            }}
                          />
                        </div>

                        <input
                          list="income-categories"
                          value={income.categoria ?? ''}
                          onChange={e => setIncomeLocal(income.id, 'categoria', e.target.value)}
                          onBlur={() => updateRecurringIncome(income)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(91,139,245,0.14)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: 'var(--white)',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />

                        <select
                          value={income.regraLancamento || 'QUINTO_DIA_UTIL'}
                          onChange={e => {
                            const updated = {
                              ...income,
                              regraLancamento: e.target.value,
                              diaFixo: e.target.value === 'DIA_FIXO' ? (income.diaFixo || 5) : null,
                            }

                            setIncomeLocal(income.id, 'regraLancamento', e.target.value)
                            setIncomeLocal(income.id, 'diaFixo', updated.diaFixo)
                            updateRecurringIncome(updated)
                          }}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(91,139,245,0.14)',
                            borderRadius: 8,
                            padding: '8px 10px',
                            color: 'var(--white)',
                            fontSize: 12,
                            outline: 'none',
                          }}
                        >
                          <option value="QUINTO_DIA_UTIL">5º dia útil</option>
                          <option value="DIA_FIXO">Dia fixo</option>
                        </select>

                        <button
                          onClick={() => toggleRecurringIncome(income)}
                          style={{
                            height: 34,
                            borderRadius: 9,
                            background: income.ativo === false ? 'rgba(240,106,106,0.08)' : 'rgba(74,240,196,0.08)',
                            border: `1px solid ${income.ativo === false ? 'rgba(240,106,106,0.2)' : 'rgba(74,240,196,0.2)'}`,
                            color: income.ativo === false ? 'var(--red)' : 'var(--accent)',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          title={income.ativo === false ? 'Ativar' : 'Pausar'}
                        >
                          {income.ativo === false ? 'Pausado' : 'Ativo'}
                        </button>

                        <button
                          onClick={() => deleteRecurringIncome(income.id)}
                          style={{
                            width: isMobile ? '100%' : 36,
                            height: 36,
                            borderRadius: 9,
                            background: 'rgba(240,106,106,0.08)',
                            border: '1px solid rgba(240,106,106,0.2)',
                            color: 'var(--red)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                          }}
                          title="Excluir ganho fixo"
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: -4, marginBottom: 8 }}>
                        Lançamento: {formatRule(income.regraLancamento, income.diaFixo)} · Origem: recorrente
                      </div>

                      {i < recurringIncomes.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {active === 'notificacoes' && (
          <SectionCard isMobile={isMobile}>
            <SectionTitle icon={icons.bell} label="Notificações" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { key: 'app',              label: 'Notificações no app',    sub: 'Alertas dentro da plataforma' },
                { key: 'whatsapp',         label: 'Notificações WhatsApp',  sub: 'Resumos e alertas via WhatsApp' },
                { key: 'alertasOrcamento', label: 'Alertas de orçamento',   sub: 'Avisa quando atingir 90% do limite' },
                { key: 'relatorioSemanal', label: 'Relatório semanal',      sub: 'Todo domingo recebe um resumo da semana' },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    gap: 14,
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{item.sub}</div>
                    </div>
                    <Toggle checked={!!notif[item.key]} onChange={v => setNotif(item.key, v)} />
                  </div>
                  {i < arr.length - 1 && <Divider />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22 }}>
              <SaveButton onClick={() => save()} loading={saving} isMobile={isMobile} />
            </div>
          </SectionCard>
        )}

        {active === 'seguranca' && (
          <SectionCard isMobile={isMobile}>
            <SectionTitle icon={icons.lock} label="Segurança" />

            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Senha atual</FieldLabel>
              <Input
                type={showSA ? 'text' : 'password'}
                value={senhaAtual}
                onChange={setSenhaAtual}
                placeholder="••••••••"
                right={
                  <span onClick={() => setShowSA(v => !v)}>
                    <Icon d={showSA ? icons.eyeOff : icons.eye} size={16} />
                  </span>
                }
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Nova senha</FieldLabel>
              <Input
                type={showSN ? 'text' : 'password'}
                value={novaSenha}
                onChange={setNovaSenha}
                placeholder="Mínimo 8 caracteres"
                right={
                  <span onClick={() => setShowSN(v => !v)}>
                    <Icon d={showSN ? icons.eyeOff : icons.eye} size={16} />
                  </span>
                }
              />

              {novaSenha && novaSenha.length < 8 && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 5 }}>Mínimo 8 caracteres</div>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <FieldLabel>Confirmar nova senha</FieldLabel>
              <Input
                type={showSC ? 'text' : 'password'}
                value={confirmaSenha}
                onChange={setConfirmaSenha}
                placeholder="Repete a nova senha"
                right={
                  <span onClick={() => setShowSC(v => !v)}>
                    <Icon d={showSC ? icons.eyeOff : icons.eye} size={16} />
                  </span>
                }
              />

              {confirmaSenha && novaSenha !== confirmaSenha && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 5 }}>As senhas não coincidem</div>
              )}

              {confirmaSenha && novaSenha === confirmaSenha && novaSenha.length >= 8 && (
                <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 5 }}>✓ Senhas coincidem</div>
              )}
            </div>

            <SaveButton onClick={savePassword} loading={saving} label="Alterar senha" isMobile={isMobile} />

            <Divider />

            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
              Sessão atual
            </div>

            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              background: 'rgba(74,240,196,0.06)',
              border: '1px solid rgba(74,240,196,0.15)',
              borderRadius: 10,
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Este dispositivo</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Sessão activa agora</div>
              </div>

              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'rgba(74,240,196,0.1)',
                border: '1px solid rgba(74,240,196,0.2)',
                padding: '3px 10px',
                borderRadius: 20,
              }}>
                Ativo
              </span>
            </div>

            <Divider />

            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--red)', marginBottom: 14 }}>
              Zona de perigo
            </div>

            <button
              onClick={() => { if (window.confirm('Tens a certeza que queres apagar a conta? Esta ação é irreversível.')) alert('Contacta o suporte para apagar a conta.') }}
              style={{
                background: 'rgba(240,106,106,0.08)',
                border: '1px solid rgba(240,106,106,0.2)',
                color: 'var(--red)',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s',
                width: isMobile ? '100%' : 'fit-content',
              }}
            >
              🗑️ Apagar conta
            </button>
          </SectionCard>
        )}
      </div>

      <Toast msg={toast.msg} type={toast.type} isMobile={isMobile} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none }
        input::placeholder { color: rgba(122,154,191,0.35) !important }
        input:focus, select:focus {
            border-color: rgba(46,99,232,0.45) !important;
            box-shadow: 0 0 0 3px rgba(46,99,232,0.1) !important;
            outline: none !important;
          }

          select {
            background-color: rgba(255,255,255,0.04) !important;
            color: var(--white) !important;
          }

          select option {
            background-color: #0f1328 !important;
            color: #f0f6ff !important;
          }
      `}</style>
    </div>
  )
}