// 🚀 Página de acesso público sem login
const API_URL = "https://backend-goaq.onrender.com"; // ✅ Substituímos localhost pela URL do Render

function carregarReclamacoes() {
  fetch(`${API_URL}/api/opinioes`)
    .then((res) => res.json())
    .then((reclamacoes) => {
      const container = document.getElementById("listaReclamacoes");
      container.innerHTML = "";
      reclamacoes.forEach((rec) => {
        const data = new Date(rec.data);
        const dataFormatada = data.toLocaleDateString("pt-BR");
        const horaFormatada = data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `
          <br>
            <span3> ${rec.empresa}</span3>
            <p><strong>Cliente </strong><span>${rec.nome}</span></p>
          <p><span2> ${dataFormatada}, ${rec.cidade} - ${rec.uf}</span2>.</p><br>
          <p><strong>Opinião:</strong> <br>${rec.comentario}</p>
          <br>
          <hr/>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      document.getElementById("listaReclamacoes").innerText =
        "Erro ao carregar reclamações.";
    });
}

// 🚀 Aqui na página de visualização pública não tem o botão delete

window.onload = carregarReclamacoes;
