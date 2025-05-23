async function carregarPendentes(token) {
  try {
    const res = await fetch(`${API_URL}/api/moderar`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar opiniões.");

    const opinioes = await res.json();
    const container = document.getElementById("pendentes");
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
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById("pendentes").textContent = "Erro ao carregar.";
  }
}

async function aprovarOpiniao(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/api/moderar/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao aprovar.");

    document.getElementById("mensagemStatus").textContent = "✅ Opinião aprovada.";
    carregarPendentes(token); // Atualiza lista
    carregarReclamacoes();    // Atualiza lista pública
  } catch {
    document.getElementById("mensagemStatus").textContent = "❌ Erro ao aprovar.";
  }
}
