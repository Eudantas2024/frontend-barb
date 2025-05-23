async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return false;
  }

  try {
    if (typeof API_URL === "undefined") throw new Error("API_URL não definido");

    const res = await fetch(`${API_URL}/api/conteudo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Token inválido ou expirado");

    const restrictedContent = document.getElementById("restrictedContent");
    if (restrictedContent) {
      restrictedContent.style.display = "block";
    }
    return true;
  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    return false;
  }
}

async function carregarReclamacoes() {
  try {
    if (typeof API_URL === "undefined") throw new Error("API_URL não definido");

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

    data.forEach(rec => {
      const div = document.createElement("div");
      div.className = "reclamacao";
      div.innerHTML = `<p><strong>${rec.empresa}</strong><br>${rec.comentario}</p>`;
      container.appendChild(div);
    });
  } catch (error) {
    const container = document.getElementById("listaReclamacoes");
    if (container) container.textContent = "Erro ao carregar opiniões.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const autorizado = await checkAuth();
  if (autorizado) {
    carregarReclamacoes();
  }
});
