document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLoginConsumidor");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const senha = form.senha.value;

      try {
        const res = await fetch(`${API_URL}/consumidor/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        });

        const data = await res.json();
        const msg = document.getElementById("mensagemLogin");

        if (!res.ok) {
          msg.textContent = "❌ " + (data.message || "Erro no login.");
          return;
        }

        localStorage.setItem("token", data.token);
        msg.textContent = "✅ Login realizado com sucesso!";
        window.location.href = "consumidorarea.html"; // redireciona após login
      } catch {
        document.getElementById("mensagemLogin").textContent = "❌ Erro ao conectar.";
      }
    });
  }
});
