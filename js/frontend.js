document.addEventListener("DOMContentLoaded", async () => {
  // Formulário de opinião
  const opiniaoForm = document.getElementById("opiniaoForm");
  if (opiniaoForm) {
    opiniaoForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const empresa = document.getElementById("empresa").value.trim();
      const comentario = document.getElementById("comentario").value.trim();
      const mensagem = document.getElementById("mensagem");

      if (!empresa || !comentario) {
        mensagem.textContent = "Por favor, preencha todos os campos.";
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/api/empresas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ empresa, comentario })
        });

        let dados;
        const text = await resposta.text();
        try {
          dados = JSON.parse(text);
        } catch {
          dados = { message: "Resposta inesperada do servidor." };
        }

        if (resposta.ok) {
          mensagem.textContent = "Opinião enviada com sucesso. Aguarde a aprovação.";
          opiniaoForm.reset();
        } else {
          mensagem.textContent = dados.message || "Erro ao enviar opinião.";
        }
      } catch (erro) {
        console.error("Erro:", erro);
        mensagem.textContent = "Erro ao conectar com o servidor.";
      }
    });
  }

  // Verifica autenticação e carrega conteúdo restrito
  const autorizado = await checkAuth();

  if (autorizado) {
    carregarReclamacoes();               // carrega aprovadas, não precisa token
    const token = localStorage.getItem("token");
    carregarPendentes(token);            // carrega pendentes, token obrigatório
  } else {
    carregarReclamacoes();               // carrega públicas mesmo sem login
  }
});
