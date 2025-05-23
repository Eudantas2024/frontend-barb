async function carregarPendentes(token) {
  try {
    const res = await fetch(`${API_URL}/api/moderar`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar opiniões.");

    const opinioes = await res.json();
    const container = document.getElementById("pendentes");
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(opinioes) || opinioes.length === 0) {
      container.textContent = "Nenhuma opinião pendente.";
      return;
    }

    opinioes.forEach(op => {
      const div = document.createElement("div");
      div.className = "reclamacao";
      div.innerHTML = `
        <p><strong>${op.empresa}</strong><br>${op.comentario}</p>
        <button onclick="aprovarOpiniao('${op._id}')">Aprovar</button>
        <button onclick="excluirOpiniao('${op._id}')">Excluir</button>
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    const container = document.getElementById("pendentes");
    if (container) container.textContent = "Erro ao carregar.";
  }
}

async function aprovarOpiniao(id) {
  const token = localStorage.getItem("token");
  const statusMsg = document.getElementById("mensagemStatus");
  if (!statusMsg) return;

  try {
    const res = await fetch(`${API_URL}/api/moderar/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao aprovar.");

    statusMsg.textContent = "✅ Opinião aprovada.";
    await carregarPendentes(token);
    await carregarReclamacoes(token);
  } catch {
    statusMsg.textContent = "❌ Erro ao aprovar.";
  }
}

// Função para excluir opinião pendente
async function excluirOpiniao(id) {
  const token = localStorage.getItem("token");
  const statusMsg = document.getElementById("mensagemStatus");
  if (!statusMsg) return;

  try {
    const res = await fetch(`${API_URL}/api/moderar/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao excluir.");

    statusMsg.textContent = "🗑️ Opinião excluída.";
    await carregarPendentes(token);
  } catch {
    statusMsg.textContent = "❌ Erro ao excluir.";
  }
}

// Função para carregar opiniões já aprovadas, com botão Excluir apenas na área admin
async function carregarReclamacoes(token) {
  try {
    const res = await fetch(`${API_URL}/api/empresas`);
    if (!res.ok) throw new Error("Erro ao carregar");
    const data = await res.json();

    const container = document.getElementById("listaReclamacoes");
    if (!container) return;
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.textContent = "Nenhuma opinião registrada.";
      return;
    }

    // Verifica se o conteúdo restrito está visível
    const areaRestrita = document.getElementById("restrictedContent");
    const isAdmin = areaRestrita && areaRestrita.style.display !== "none";

    data.forEach(rec => {
      const div = document.createElement("div");
      div.className = "reclamacao";

      if (isAdmin) {
        div.innerHTML = `
          <p><strong>${rec.empresa}</strong><br>${rec.comentario}</p>
          <button onclick="excluirOpiniaoAprovada('${rec._id}')">Excluir</button>
          <hr>
        `;
      } else {
        div.innerHTML = `
          <p><strong>${rec.empresa}</strong><br>${rec.comentario}</p>
          <hr>
        `;
      }

      container.appendChild(div);
    });
  } catch {
    const container = document.getElementById("listaReclamacoes");
    if (container) container.textContent = "Erro ao carregar opiniões.";
  }
}

// Função para excluir opinião aprovada (somente na área admin)
async function excluirOpiniaoAprovada(id) {
  const token = localStorage.getItem("token");
  const statusMsg = document.getElementById("mensagemStatus");
  if (!statusMsg) return;

  try {
    const res = await fetch(`${API_URL}/api/empresas/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao excluir.");

    statusMsg.textContent = "🗑️ Opinião excluída.";
    await carregarReclamacoes(token);
  } catch {
    statusMsg.textContent = "❌ Erro ao excluir.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (token) {
    await carregarReclamacoes(token);
    await carregarPendentes(token);
  } else {
    carregarReclamacoes(null);
  }
});
