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
    await carregarReclamacoes();
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
