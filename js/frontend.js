const API_URL = "https://backend-barb.onrender.com"; // sem barra no final

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
        const resposta = await fetch(`${API_URL}/api/empresas`, { // só uma barra
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

// ========================== LISTAR OPINIÕES APROVADAS ==========================
function carregarReclamacoes(token = null) {
  const url = `${API_URL}/api/empresas`; // só uma barra
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  fetch(url, { headers })
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      data.forEach((rec) => {
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `<p><strong>${rec.empresa}</strong> - ${rec.comentario}</p>`;
        container.appendChild(div);
      });
    })
    .catch(() => alert("Erro ao carregar opiniões."));
}

// ========================== VIA CEP ==========================
const cepInput = document.getElementById("cep");
if (cepInput) {
  cepInput.addEventListener("blur", async function () {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      alert("❌ CEP inválido. Deve conter 8 dígitos.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("❌ CEP não encontrado.");
        return;
      }

      const logradouro = document.getElementById("logradouro");
      const bairro = document.getElementById("bairro");
      const cidade = document.getElementById("cidade");
      const estado = document.getElementById("estado");

      if (logradouro) logradouro.value = data.logradouro || "";
      if (bairro) bairro.value = data.bairro || "";
      if (cidade) cidade.value = data.localidade || "";
      if (estado) estado.value = data.uf || "";
    } catch (error) {
      alert("Erro ao buscar o CEP.");
    }
  });
}
