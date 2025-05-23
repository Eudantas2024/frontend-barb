document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastroConsumidor");
  const msg = document.getElementById("mensagemCadastro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const senha = form.senha.value;

    try {
      const res = await fetch(`${API_URL}/consumidor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        msg.textContent = `❌ ${data.message || "Erro no cadastro."}`;
        return;
      }

      msg.textContent = "✅ Cadastro realizado com sucesso! Faça login.";
      form.reset();
    } catch {
      msg.textContent = "❌ Erro ao conectar.";
    }
  });
});


document.getElementById('formCadastroConsumidor').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Aqui você pode adicionar o código para enviar os dados do formulário ao servidor
  // Supondo que o cadastro foi bem-sucedido, você pode redirecionar o usuário

  // Exemplo de código para simular um cadastro bem-sucedido
  setTimeout(function() {
      document.getElementById('mensagemCadastro').textContent = 'Cadastro realizado com sucesso!';
      window.location.href = 'consumidorlogin.html'; // Redireciona para a tela de login
  }, 1000); // Simula um atraso de 1 segundo para o cadastro
});
