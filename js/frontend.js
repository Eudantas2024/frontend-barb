const API_URL = "https://backend-barb.onrender.com";

// ========================== FORMULÁRIO DE OPINIÃO ==========================
document.addEventListener("DOMContentLoaded", () => {
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

  const token = localStorage.getItem("token");
  if (document.getElementById("listaReclamacoes")) {
    carregarReclamacoes(token);
  }
  if (document.getElementById("restrictedContent")) {
    checkAuth();
  }
});
