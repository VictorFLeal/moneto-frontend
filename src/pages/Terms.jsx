export default function Terms() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Termos de Uso - Moneto</h1>

        <p>
          Ao utilizar o Moneto, o usuário concorda com estes Termos de Uso.
        </p>

        <h2>Uso da plataforma</h2>
        <p>
          O Moneto tem como objetivo auxiliar usuários na organização de suas finanças pessoais,
          permitindo o registro de receitas, despesas, metas e informações financeiras.
        </p>

        <h2>Responsabilidade do usuário</h2>
        <p>
          O usuário é responsável pelas informações cadastradas na plataforma e pelas mensagens enviadas
          via WhatsApp para registro financeiro.
        </p>

        <h2>Limitações</h2>
        <p>
          O Moneto não presta consultoria financeira, contábil ou jurídica. As informações apresentadas
          têm caráter organizacional e informativo.
        </p>

        <h2>Integração com WhatsApp</h2>
        <p>
          O usuário pode utilizar o WhatsApp para registrar transações financeiras, como despesas e receitas,
          desde que tenha autorizado e verificado seu número na plataforma.
        </p>

        <h2>Contato</h2>
        <p>
          Para dúvidas sobre estes termos, entre em contato:
          <br />
          <strong>seuemail@email.com</strong>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#020617',
    color: '#f8fafc',
    padding: '40px 20px',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    maxWidth: 850,
    margin: '0 auto',
    background: '#0f172a',
    border: '1px solid rgba(59,130,246,0.25)',
    borderRadius: 20,
    padding: 32,
    lineHeight: 1.7,
  },
}