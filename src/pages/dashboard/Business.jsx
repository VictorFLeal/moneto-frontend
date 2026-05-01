import { useState } from 'react'

const kpis = [
  { label: 'Receita do mês',   value: 'R$ 18.500', icon: '💰', color: 'var(--accent)',  glow: 'rgba(74,240,196,0.2)',  change: '↑ 12% vs mês ant.', up: true },
  { label: 'Despesas totais',  value: 'R$ 15.590', icon: '📤', color: 'var(--red)',     glow: 'rgba(240,106,106,0.2)', change: '↑ 8% vs mês ant.',  up: false },
  { label: 'Lucro líquido',    value: 'R$ 2.910',  icon: '💎', color: 'var(--accent)',  glow: 'rgba(74,240,196,0.2)',  change: 'Margem: 16%',        up: true },
  { label: 'Caixa atual',      value: 'R$ 7.240',  icon: '🏦', color: 'var(--blue-l)', glow: 'rgba(91,139,245,0.2)', change: '↑ Positivo',         up: true },
]

const tabs = [
  { id: 'overview',     label: 'Visão Geral',   icon: '📊', desc: 'KPIs principais e receitas vs despesas da empresa' },
  { id: 'cashflow',     label: 'Fluxo de Caixa',icon: '💸', desc: 'Entradas e saídas por semana — previsão dos próximos 30 dias' },
  { id: 'payables',     label: 'Contas',        icon: '🧾', desc: 'Contas a pagar e receber com status e alertas' },
  { id: 'dre',          label: 'DRE',           icon: '📈', desc: 'Demonstrativo de resultado simplificado da empresa' },
  { id: 'distribution', label: 'Distribuição',  icon: '🎯', desc: 'Como a IA sugere distribuir o lucro do mês' },
  { id: 'taxes',        label: 'Impostos',      icon: '🏛️', desc: 'Obrigações fiscais, vencimentos e alertas' },
  { id: 'ai',           label: 'IA Empresarial',icon: '🤖', desc: 'Insights, alertas e recomendações exclusivas para a tua empresa' },
]

const payables = [
  { name: 'Fornecedor Silva & Cia',  due: '10 Abr', val: 2400,  status: 'pendente', type: 'pagar' },
  { name: 'Aluguel do espaço',       due: '15 Abr', val: 3500,  status: 'pendente', type: 'pagar' },
  { name: 'Energia elétrica',        due: '18 Abr', val: 480,   status: 'pendente', type: 'pagar' },
  { name: 'Cliente Empresa ABC',     due: '05 Abr', val: 8500,  status: 'recebido', type: 'receber' },
  { name: 'Cliente Freelance XYZ',   due: '12 Abr', val: 2200,  status: 'pendente', type: 'receber' },
  { name: 'Serviço Consultoria DEF', due: '20 Abr', val: 4800,  status: 'pendente', type: 'receber' },
]

const dreItems = [
  { label: 'Receita Bruta',       val: 18500, type: 'in',      bold: true },
  { label: 'Impostos (DAS)',       val: -925,  type: 'out',     indent: true },
  { label: 'Receita Líquida',     val: 17575, type: 'in',      bold: true, separator: true },
  { label: 'Custos Fixos',        val: -8490, type: 'out',     bold: true },
  { label: '↳ Aluguel',           val: -3500, type: 'out',     indent: true },
  { label: '↳ Funcionários',      val: -4990, type: 'out',     indent: true },
  { label: 'Custos Variáveis',    val: -6175, type: 'out',     bold: true },
  { label: '↳ Fornecedores',      val: -4200, type: 'out',     indent: true },
  { label: '↳ Marketing',         val: -1200, type: 'out',     indent: true },
  { label: '↳ Outros',            val: -775,  type: 'out',     indent: true },
  { label: 'Lucro Operacional',   val: 2910,  type: 'result',  bold: true, separator: true },
  { label: 'Pró-labore',          val: -3500, type: 'out',     indent: true },
  { label: 'Resultado Final',     val: -590,  type: 'danger',  bold: true, separator: true },
]

const distribution = [
  { label: 'Reserva da empresa (20%)',  val: 582, color: 'var(--blue-l)',  icon: '🏦', pct: 20 },
  { label: 'Reinvestimento (30%)',      val: 873, color: 'var(--accent)',  icon: '📈', pct: 30 },
  { label: 'Pró-labore (25%)',          val: 728, color: 'var(--accent2)', icon: '👤', pct: 25 },
  { label: 'Fundo de emergência (15%)', val: 437, color: 'var(--blue-xl)', icon: '🛡️', pct: 15 },
  { label: 'Disponível (10%)',          val: 291, color: 'var(--muted)',   icon: '💳', pct: 10 },
]

const taxes = [
  { name: 'DAS (Simples Nacional)', due: 'Dia 20', val: 925,  status: 'pendente', daysLeft: 16 },
  { name: 'INSS Funcionários',      due: 'Dia 15', val: 870,  status: 'pago',     daysLeft: 0 },
  { name: 'FGTS',                   due: 'Dia 07', val: 464,  status: 'pago',     daysLeft: 0 },
  { name: 'ISS (Serviços)',         due: 'Dia 25', val: 370,  status: 'pendente', daysLeft: 21 },
]

const aiInsights = [
  { icon: '⚠️', color: 'rgba(240,168,74,0.1)',  border: 'rgba(240,168,74,0.2)',  title: 'Folha acima do ideal', body: 'Custo com funcionários representa 31% do faturamento. O ideal para o teu setor é até 25%. Considera revisar os turnos ou automatizar processos.' },
  { icon: '📉', color: 'rgba(240,106,106,0.1)', border: 'rgba(240,106,106,0.2)', title: 'Resultado negativo', body: 'Após pró-labore, o resultado do mês é negativo em R$ 590. Recomendo reduzir o pró-labore em 20% por 2 meses para equilibrar o caixa.' },
  { icon: '💡', color: 'rgba(46,99,232,0.1)',   border: 'rgba(46,99,232,0.2)',   title: 'Oportunidade em Marketing', body: 'O teu investimento em marketing (R$ 1.200) gerou um retorno estimado de R$ 8.500 em novos clientes. Aumentar 30% pode acelerar o crescimento.' },
  { icon: '🏦', color: 'rgba(74,240,196,0.1)',  border: 'rgba(74,240,196,0.2)',  title: 'Reserva de emergência baixa', body: 'A tua reserva atual cobre apenas 1.8 meses de custos fixos. O recomendado é 3 meses (R$ 25.470). Guarda R$ 500/mês para atingir a meta em 12 meses.' },
  { icon: '🔮', color: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.2)',  title: 'Previsão próximos 30 dias', body: 'Com base no histórico, prevejo receita de R$ 20.000–22.000 e despesas de R$ 15.000–16.000. Saldo projetado: +R$ 4.500 a +R$ 6.000.' },
]

export default function Business() {
  const [activeTab, setActiveTab] = useState('overview')

  const current = tabs.find(t => t.id === activeTab)

  return (
    <div>

      {/* Header do modo empresa */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ background: 'rgba(240,168,74,0.15)', border: '1px solid rgba(240,168,74,0.3)', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>
              🏢 MONETO Business
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{current?.desc}</p>
        </div>
        <button style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Nova transação empresarial
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 3, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <div key={t.id} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: activeTab === t.id ? '#fff' : 'var(--muted)', background: activeTab === t.id ? 'var(--blue)' : 'transparent', fontWeight: activeTab === t.id ? 600 : 400, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.18s' }}
            onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </div>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: k.glow, filter: 'blur(40px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, opacity: 0.5 }}>{k.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 10 }}>{k.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: -1, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 12, marginTop: 8, color: k.up ? 'var(--accent)' : 'var(--red)' }}>{k.change}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>📊 Receitas vs Despesas por categoria</div>
              <div style={{ marginTop: 14 }}>
                {[
                  { icon:'💰', label:'Receita da empresa',  val: 18500, type:'in',  color:'var(--accent)' },
                  { icon:'📦', label:'Fornecedores',        val: 4200,  type:'out', color:'var(--red)' },
                  { icon:'👥', label:'Funcionários',        val: 4990,  type:'out', color:'var(--blue-l)' },
                  { icon:'📣', label:'Marketing',           val: 1200,  type:'out', color:'var(--accent2)' },
                  { icon:'🖥️', label:'Infraestrutura',      val: 890,   type:'out', color:'var(--accent2)' },
                  { icon:'👤', label:'Pró-labore',          val: 3500,  type:'out', color:'var(--blue-xl)' },
                  { icon:'🏛️', label:'Impostos',            val: 925,   type:'out', color:'var(--red)' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1, fontSize: 13 }}>{c.label}</div>
                    <div style={{ flex: 2, height: 6, background: 'rgba(91,139,245,0.1)', borderRadius: 3, overflow: 'hidden', margin: '0 10px' }}>
                      <div style={{ height: '100%', width: `${(c.val / 18500) * 100}%`, background: c.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: c.type === 'in' ? 'var(--accent)' : 'var(--red)', minWidth: 80, textAlign: 'right' }}>
                      {c.type === 'in' ? '+' : '−'}R${c.val.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ ...styles.card, background: 'rgba(240,168,74,0.06)', border: '1px solid rgba(240,168,74,0.2)' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--accent2)' }}>⚠️ Alerta urgente</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Após pró-labore, o resultado do mês está negativo em <strong style={{ color: 'var(--red)' }}>R$ 590</strong>. Clica em <strong style={{ color: 'var(--white)' }}>IA Empresarial</strong> para ver as recomendações.</p>
              </div>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>🔔 Alertas do mês</div>
                {[
                  { icon: '🧾', text: 'DAS vence em 16 dias (R$ 925)', color: 'var(--accent2)' },
                  { icon: '💸', text: 'Aluguel vence em 5 dias (R$ 3.500)', color: 'var(--red)' },
                  { icon: '📈', text: 'Faturamento cresceu 12% vs mês ant.', color: 'var(--accent)' },
                  { icon: '🏦', text: 'Caixa positivo esta semana', color: 'var(--accent)' },
                ].map(a => (
                  <div key={a.text} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(91,139,245,0.07)', alignItems: 'center' }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, color: a.color }}>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLUXO DE CAIXA */}
      {activeTab === 'cashflow' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>📅 Fluxo semanal — Abril 2025</div>
              <div style={{ marginTop: 14 }}>
                {[
                  { week: 'Semana 1 (1–7)',   in: 4200, out: 2100, balance: 5140 },
                  { week: 'Semana 2 (8–14)',  in: 6800, out: 5200, balance: 6740 },
                  { week: 'Semana 3 (15–21)', in: 3500, out: 4800, balance: 5440 },
                  { week: 'Semana 4 (22–30)', in: 4000, out: 3490, balance: 5950 },
                ].map(w => (
                  <div key={w.week} style={{ padding: '14px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{w.week}</span>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>Saldo: R$ {w.balance.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 8 }}>
                      <span style={{ color: 'var(--accent)' }}>▲ R$ {w.in.toLocaleString()}</span>
                      <span style={{ color: 'var(--red)' }}>▼ R$ {w.out.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3 }}>
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--accent)', width: `${(w.in / 7000) * 100}%`, opacity: 0.7 }} />
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--red)', width: `${(w.out / 7000) * 100}%`, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>🔮 Previsão — Próximos 30 dias</div>
              <div style={{ marginTop: 14 }}>
                <div style={{ background: 'rgba(74,240,196,0.06)', border: '1px solid rgba(74,240,196,0.15)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Receita projetada</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>R$ 20.000 – 22.000</div>
                </div>
                <div style={{ background: 'rgba(240,106,106,0.06)', border: '1px solid rgba(240,106,106,0.15)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Despesas projetadas</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--red)' }}>R$ 15.000 – 16.000</div>
                </div>
                <div style={{ background: 'rgba(46,99,232,0.06)', border: '1px solid rgba(46,99,232,0.15)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Lucro projetado</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--blue-l)' }}>R$ 4.500 – 6.000</div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>↑ Melhor que este mês</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTAS A PAGAR/RECEBER */}
      {activeTab === 'payables' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={styles.sectionTitle}>📤 Contas a pagar</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', background: 'rgba(240,106,106,0.1)', border: '1px solid rgba(240,106,106,0.2)', padding: '3px 10px', borderRadius: 20 }}>
                R$ {payables.filter(p => p.type === 'pagar').reduce((s,p) => s+p.val, 0).toLocaleString()} a pagar
              </span>
            </div>
            {payables.filter(p => p.type === 'pagar').map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(240,106,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Vence: {p.due}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>R$ {p.val.toLocaleString()}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent2)', background: 'rgba(240,168,74,0.1)', padding: '2px 7px', borderRadius: 20 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={styles.sectionTitle}>📥 Contas a receber</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'rgba(74,240,196,0.1)', border: '1px solid rgba(74,240,196,0.2)', padding: '3px 10px', borderRadius: 20 }}>
                R$ {payables.filter(p => p.type === 'receber').reduce((s,p) => s+p.val, 0).toLocaleString()} a receber
              </span>
            </div>
            {payables.filter(p => p.type === 'receber').map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(74,240,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Vence: {p.due}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>R$ {p.val.toLocaleString()}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: p.status === 'recebido' ? 'var(--accent)' : 'var(--accent2)', background: p.status === 'recebido' ? 'rgba(74,240,196,0.1)' : 'rgba(240,168,74,0.1)', padding: '2px 7px', borderRadius: 20 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRE */}
      {activeTab === 'dre' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={styles.sectionTitle}>📈 DRE — Demonstrativo de Resultado</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Abril 2025 · Resumo financeiro da empresa</div>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 14px', color: 'var(--white)', fontSize: 12, cursor: 'pointer' }}>📄 Exportar PDF</button>
          </div>
          {dreItems.map((d, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: d.separator ? '14px 0 10px' : '10px 0',
              borderTop: d.separator ? '1px solid var(--border)' : 'none',
              paddingLeft: d.indent ? 20 : 0,
            }}>
              <span style={{ fontSize: d.bold ? 14 : 13, fontWeight: d.bold ? 700 : 400, color: d.type === 'result' ? 'var(--accent)' : d.type === 'danger' ? 'var(--red)' : d.indent ? 'var(--muted)' : 'var(--white)', fontFamily: d.bold ? 'Syne, sans-serif' : 'DM Sans, sans-serif' }}>{d.label}</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: d.bold ? 16 : 14, fontWeight: d.bold ? 800 : 600, color: d.type === 'in' ? 'var(--accent)' : d.type === 'out' ? 'var(--red)' : d.type === 'result' ? 'var(--accent)' : 'var(--red)' }}>
                {d.val >= 0 ? '+' : ''}R$ {Math.abs(d.val).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* DISTRIBUIÇÃO */}
      {activeTab === 'distribution' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>💡 Como distribuir o lucro</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 20px' }}>Lucro operacional: <strong style={{ color: 'var(--white)' }}>R$ 2.910</strong></div>
            {distribution.map(d => (
              <div key={d.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>{d.icon} {d.label}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: d.color }}>R$ {d.val.toLocaleString()}</span>
                </div>
                <div style={{ height: 7, background: 'rgba(91,139,245,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🤖 Recomendação da IA</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '⚠️', color: 'rgba(240,168,74,0.1)', text: 'O pró-labore está acima do lucro operacional. Recomendo reduzir para R$ 2.000 este mês para equilibrar o caixa.' },
                { icon: '💡', color: 'rgba(46,99,232,0.1)', text: 'Com reserva atual de 1.8 meses, aumenta o fundo de emergência para 25% do lucro durante 6 meses.' },
                { icon: '📈', color: 'rgba(74,240,196,0.1)', text: 'O reinvestimento em marketing está a dar retorno. Mantém os 30% e monitora o ROI mensalmente.' },
              ].map(r => (
                <div key={r.text} style={{ display: 'flex', gap: 12, padding: 14, background: r.color, border: `1px solid ${r.color}`, borderRadius: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IMPOSTOS */}
      {activeTab === 'taxes' && (
        <div>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={styles.sectionTitle}>🏛️ Obrigações fiscais — Abril 2025</div>
              <span style={{ fontSize: 12, color: 'var(--accent2)', fontWeight: 600 }}>2 pendentes</span>
            </div>
            {taxes.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(91,139,245,0.07)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: t.status === 'pago' ? 'rgba(74,240,196,0.1)' : 'rgba(240,168,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {t.status === 'pago' ? '✅' : '⏳'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Vence: {t.due} {t.daysLeft > 0 ? `· em ${t.daysLeft} dias` : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: t.status === 'pago' ? 'var(--accent)' : 'var(--accent2)' }}>R$ {t.val.toLocaleString()}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.status === 'pago' ? 'var(--accent)' : 'var(--accent2)', background: t.status === 'pago' ? 'rgba(74,240,196,0.1)' : 'rgba(240,168,74,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                    {t.status === 'pago' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.card, marginTop: 16, background: 'rgba(240,168,74,0.05)', border: '1px solid rgba(240,168,74,0.15)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent2)', marginBottom: 8 }}>⚠️ Atenção</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>O DAS do Simples Nacional vence em <strong style={{ color: 'var(--white)' }}>20 de Abril</strong>. Tens <strong style={{ color: 'var(--accent2)' }}>16 dias</strong> para pagamento. A IA já reservou este valor no fluxo de caixa. Não percas o prazo — multa de 2% + juros diários.</p>
          </div>
        </div>
      )}

      {/* IA EMPRESARIAL */}
      {activeTab === 'ai' && (
        <div>
          <div style={{ ...styles.card, marginBottom: 16, background: 'linear-gradient(135deg, rgba(46,99,232,0.1), rgba(74,240,196,0.05))', border: '1px solid rgba(46,99,232,0.2)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,var(--blue),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🤖</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>MONETO IA — Modo Empresa</div>
                <div style={{ fontSize: 12, color: 'var(--accent)' }}>Análise exclusiva para gestão empresarial</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {aiInsights.map(ins => (
              <div key={ins.title} style={{ display: 'flex', gap: 14, padding: 18, background: ins.color, border: `1px solid ${ins.border}`, borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: ins.color, border: `1px solid ${ins.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{ins.icon}</div>
                <div>
                  <strong style={{ fontSize: 15, display: 'block', marginBottom: 6, fontFamily: 'Syne, sans-serif' }}>{ins.title}</strong>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{ins.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  card:         { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 },
}