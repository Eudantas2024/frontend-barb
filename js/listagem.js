


document.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_URL}/api/empresas`)
        .then(res => res.json())
        .then(data => {
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
        })
        .catch(() => {
            document.getElementById("listaReclamacoes").textContent = "Erro ao carregar opiniões.";
        });
});
