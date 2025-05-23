// js/publico.js

async function carregarReclamacoesPublicas() {
  try {
    const res = await fetch(`${API_URL}/api/empresas`);
    if (!res.ok) throw new Error("Erro ao carregar opiniões.");
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

document.addEventListener("DOMContentLoaded", () => {
  carregarReclamacoesPublicas();
});
