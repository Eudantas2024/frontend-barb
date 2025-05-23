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
