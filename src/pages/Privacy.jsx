export default function Privacy() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Política de Privacidade - Moneto</h1>

        <p>
          O Moneto é uma aplicação de gestão financeira pessoal que permite ao usuário registrar,
          organizar e acompanhar suas receitas, despesas, metas financeiras e informações relacionadas
          à sua vida financeira.
        </p>

        <h2>Dados coletados</h2>
        <p>
          Podemos coletar informações fornecidas pelo próprio usuário, como nome, e-mail, telefone,
          dados financeiros cadastrados manualmente e mensagens enviadas pelo WhatsApp para registro
          de transações.
        </p>

        <h2>Uso das informações</h2>
        <p>
          As informações são utilizadas exclusivamente para funcionamento da plataforma, organização
          financeira do usuário, envio de confirmações e processamento de comandos enviados pelo WhatsApp.
        </p>

        <h2>Compartilhamento de dados</h2>
        <p>
          O Moneto não vende, aluga ou compartilha dados pessoais dos usuários com terceiros para fins
          comerciais.
        </p>

        <h2>WhatsApp</h2>
        <p>
          Quando o usuário opta por usar a integração com WhatsApp, as mensagens enviadas ao Moneto
          podem ser processadas para identificar receitas, despesas e outras informações financeiras.
        </p>

        <h2>Contato</h2>
        <p>
          Para dúvidas sobre privacidade, entre em contato pelo e-mail:
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