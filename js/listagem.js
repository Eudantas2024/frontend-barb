async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/api/conteudo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    document.getElementById("restrictedContent").style.display = "block";
    return true;
  } catch {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return false;
  }
}

async function carregarReclamacoes() {
  try {
    const res = await fetch(`${API_URL}/api/empresas`);
    if (!res.ok) throw new Error("Erro ao carregar");
    const data = await res.json();

    const container = document.getElementById("listaReclamacoes");
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.textContent = "Nenhuma opinião registrada.";
      return;
    }

    data.forEach(rec => {
      const div = document.createElement("div");
      div.className = "reclamacao";
      div.innerHTML = `<p><strong>${rec.empresa}</strong><br>${rec.comentario}</p>`;
      container.appendChild(div);
    });
  } catch {
    document.getElementById("listaReclamacoes").textContent = "Erro ao carregar opiniões.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const autorizado = await checkAuth();
  if (autorizado) {
    carregarReclamacoes();
  }
});
