import { useState } from 'react'

const panels = [
  { id:'perfil',       icon:'👤', label:'Perfil' },
  { id:'whatsapp',     icon:'📱', label:'WhatsApp' },
  { id:'orcamento',    icon:'💰', label:'Orçamentos' },
  { id:'notificacoes', icon:'🔔', label:'Notificações' },
  { id:'seguranca',    icon:'🔒', label:'Segurança' },
  { id:'plano',        icon:'⭐', label:'Plano' },
]

const budgets = [
  { icon:'🛒', label:'Alimentação', val:800 },
  { icon:'🚗', label:'Transporte',  val:400 },
  { icon:'🎬', label:'Lazer',       val:500 },
  { icon:'🏠', label:'Moradia',     val:1200 },
  { icon:'💊', label:'Saúde',       val:300 },
]

function Toggle({ checked, onChange }) {
  return (
    <div
      style={{ ...styles.toggleTrack, background: checked ? 'var(--blue)' : 'var(--bg4)', border: `1px solid ${checked ? 'var(--blue)' : 'var(--border)'}` }}
      onClick={() => onChange(!checked)}
    >
      <div style={{ ...styles.toggleThumb, transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
    </div>
  )
}

export default function Settings() {
  const [active, setActive] = useState('perfil')
  const [toggles, setToggles] = useState({
    confirmacao: true, sugestoes: true, foto: true,
    semanal: true, mensal: true, alerta: true, vencimento: true, dicas: false,
  })

  function setToggle(key, val) {
    setToggles(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div style={styles.layout}>

      {/* Nav lateral */}
      <div style={styles.nav}>
        {panels.map(p => (
          <div
            key={p.id}
            style={{ ...styles.navItem, ...(active === p.id ? styles.navItemActive : {}) }}
            onClick={() => setActive(p.id)}
          >
            <span>{p.icon}</span>
            {p.label}
          </div>
        ))}
      </div>

      {/* Painéis */}
      <div style={styles.panel}>

        {/* PERFIL */}
        {active === 'perfil' && (
          <div style={styles.card}>
            <div style={styles.panelTitle}>Informações pessoais</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={styles.bigAvatar}>VS</div>
              <div>
                <button style={styles.btnGhost}>Alterar foto</button>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>JPG, PNG até 2MB</div>
              </div>
            </div>
            <div style={styles.row2}>
              <Field label="NOME"><input style={styles.input} defaultValue="Victor" /></Field>
              <Field label="SOBRENOME"><input style={styles.input} defaultValue="Silva" /></Field>
            </div>
            <Field label="E-MAIL"><input style={styles.input} defaultValue="victor@email.com" /></Field>
            <Field label="WHATSAPP"><input style={styles.input} defaultValue="+55 (11) 99999-9999" /></Field>
            <button style={styles.btnPrimary}>Salvar alterações</button>
          </div>
        )}

        {/* WHATSAPP */}
        {active === 'whatsapp' && (
          <div style={styles.card}>
            <div style={styles.panelTitle}>Conexão WhatsApp</div>
            <div style={styles.waBanner}>
              <div style={{ fontSize: 28 }}>💚</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>WhatsApp conectado</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>+55 (11) 99999-9999 · Ativo desde 1 Jan 2025</div>
              </div>
              <button style={styles.btnDanger}>Desconectar</button>
            </div>
            <div style={styles.sectionLabel}>Comportamento do bot</div>
            {[
              { key:'confirmacao', label:'Confirmação de lançamento', sub:'Confirmar antes de salvar via WhatsApp' },
              { key:'sugestoes',   label:'Sugestões inteligentes',    sub:'IA sugere categorias automaticamente' },
              { key:'foto',        label:'Lançar foto de nota fiscal', sub:'Enviar foto e a IA extrai os dados' },
            ].map(t => (
              <div key={t.key} style={styles.settingRow}>
                <div>
                  <div style={styles.settingLabel}>{t.label}</div>
                  <div style={styles.settingSub}>{t.sub}</div>
                </div>
                <Toggle checked={toggles[t.key]} onChange={v => setToggle(t.key, v)} />
              </div>
            ))}
          </div>
        )}

        {/* ORÇAMENTOS */}
        {active === 'orcamento' && (
          <div style={styles.card}>
            <div style={styles.panelTitle}>Orçamentos mensais</div>
            {budgets.map(b => (
              <div key={b.label} style={styles.settingRow}>
                <div style={styles.settingLabel}>{b.icon} {b.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input style={{ ...styles.input, maxWidth: 90, marginBottom: 0 }} defaultValue={b.val} type="number" />
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$/mês</span>
                </div>
              </div>
            ))}
            <button style={{ ...styles.btnPrimary, marginTop: 16 }}>Salvar orçamentos</button>
          </div>
        )}

        {/* NOTIFICAÇÕES */}
        {active === 'notificacoes' && (
          <div style={styles.card}>
            <div style={styles.panelTitle}>Alertas e notificações</div>
            {[
              { key:'semanal',    label:'Resumo semanal',     sub:'Toda segunda-feira às 08h' },
              { key:'mensal',     label:'Resumo mensal',      sub:'No primeiro dia do mês' },
              { key:'alerta',     label:'Alerta de orçamento',sub:'Quando atingir 80% do limite' },
              { key:'vencimento', label:'Vencimentos',        sub:'3 dias antes de vencer' },
              { key:'dicas',      label:'Dicas da IA',        sub:'Insights financeiros personalizados' },
            ].map(t => (
              <div key={t.key} style={styles.settingRow}>
                <div>
                  <div style={styles.settingLabel}>{t.label}</div>
                  <div style={styles.settingSub}>{t.sub}</div>
                </div>
                <Toggle checked={toggles[t.key]} onChange={v => setToggle(t.key, v)} />
              </div>
            ))}
          </div>
        )}

        {/* SEGURANÇA */}
        {active === 'seguranca' && (
          <div style={styles.card}>
            <div style={styles.panelTitle}>Alterar senha</div>
            <Field label="SENHA ATUAL"><input style={styles.input} type="password" placeholder="••••••••" /></Field>
            <Field label="NOVA SENHA"><input style={styles.input} type="password" placeholder="••••••••" /></Field>
            <Field label="CONFIRMAR SENHA"><input style={styles.input} type="password" placeholder="••••••••" /></Field>
            <button style={styles.btnPrimary}>Alterar senha</button>
            <div style={styles.sectionLabel}>Sessões ativas</div>
            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingLabel}>Chrome · São Paulo, BR</div>
                <div style={styles.settingSub}>Dispositivo atual · Agora</div>
              </div>
              <span style={styles.badgeGreen}>Ativo</span>
            </div>
            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingLabel}>Safari · iPhone 15</div>
                <div style={styles.settingSub}>Última sessão há 2 horas</div>
              </div>
              <button style={styles.btnDanger}>Encerrar</button>
            </div>
            <div style={{ ...styles.sectionLabel, color: 'var(--red)', marginTop: 24 }}>Zona de perigo</div>
            <button style={styles.btnDanger}>🗑️ Excluir conta</button>
          </div>
        )}

        {/* PLANO */}
        {active === 'plano' && (
          <div style={styles.card}>
            <div style={styles.proBanner}>
              <div style={{ fontSize: 32 }}>⭐</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700 }}>Plano Pro</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Renova em 1 Mai 2025 · R$19/mês</div>
              </div>
              <span style={styles.badgeGreen}>Ativo</span>
            </div>
            <div style={styles.panelTitle}>Recursos inclusos</div>
            {['Transações ilimitadas','IA avançada','Relatórios PDF','Metas ilimitadas','Suporte prioritário'].map(r => (
              <div key={r} style={styles.settingRow}>
                <div style={styles.settingLabel}>{r}</div>
                <span style={styles.badgeGreen}>✓</span>
              </div>
            ))}
            <button style={{ ...styles.btnDanger, marginTop: 20 }}>Cancelar assinatura</button>
          </div>
        )}

      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  )
}

const styles = {
  layout:       { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 },
  nav:          { display: 'flex', flexDirection: 'column', gap: 2 },
  navItem:      { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--muted)' },
  navItemActive:{ background: 'rgba(46,99,232,0.15)', color: 'var(--white)', fontWeight: 600 },
  panel:        { minWidth: 0 },
  card:         { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 },
  panelTitle:   { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid var(--border)' },
  row2:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input:        { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 13px', color: 'var(--white)', fontSize: 14, outline: 'none', marginBottom: 14 },
  settingRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' },
  settingLabel: { fontSize: 14, fontWeight: 500 },
  settingSub:   { fontSize: 12, color: 'var(--muted)', marginTop: 2 },
  toggleTrack:  { width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 },
  toggleThumb:  { position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 2, left: 2, transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
  bigAvatar:    { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--blue-l))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 },
  waBanner:     { display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, marginBottom: 20 },
  proBanner:    { display: 'flex', alignItems: 'center', gap: 14, padding: 20, background: 'linear-gradient(135deg,rgba(46,99,232,0.2),rgba(74,240,196,0.08))', border: '1px solid rgba(46,99,232,0.3)', borderRadius: 14, marginBottom: 20 },
  btnPrimary:   { background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnGhost:     { background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 16px', color: 'var(--white)', fontSize: 13, cursor: 'pointer' },
  btnDanger:    { background: 'rgba(240,106,106,0.12)', color: 'var(--red)', border: '1px solid rgba(240,106,106,0.2)', borderRadius: 9, padding: '8px 16px', fontSize: 13, cursor: 'pointer' },
  badgeGreen:   { fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'rgba(74,240,196,0.1)', border: '1px solid rgba(74,240,196,0.2)', padding: '3px 10px', borderRadius: 20 },
}