const API_URL = "https://backend-barb.onrender.com";

// ========================== REGISTRO ==========================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("❌ Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const messageBox = document.getElementById("registerMessage");
      if (messageBox) {
        messageBox.textContent = data.message;
        messageBox.style.display = "block";

        setTimeout(() => (messageBox.style.display = "none"), 2000);
      }

      if (data.message.includes("Usuário registrado com sucesso")) {
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    } catch (error) {
      alert(`Erro ao conectar com o servidor: ${error.message}`);
    }
  });
}

// ========================== LOGIN ==========================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: Falha na requisição`);

      const data = await response.json();
      const messageBox = document.getElementById("loginMessage");
      if (messageBox) {
        messageBox.textContent = data.message;
        messageBox.style.display = "block";
        setTimeout(() => (messageBox.style.display = "none"), 2000);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "moderador.html";
        }, 1000);
      } else {
        alert("Erro ao fazer login. Usuário ou senha incorretos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
  });
}

// ========================== AUTENTICAÇÃO ==========================
async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/conteudo`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return;
    }

    const data = await response.json();
    const content = document.getElementById("restrictedContent");
    if (content) content.style.display = "block";
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  const msg = document.getElementById("logoutMessage");
  if (msg) msg.style.display = "block";

  setTimeout(() => {
    if (msg) msg.style.display = "none";
    window.location.href = "index.html";
  }, 2000);
}

// ========================== LISTAGEM PÚBLICA ==========================
function carregarReclamacoesPublicas() {
  fetch(`${API_URL}/api/opinioes`)
    .then(res => res.json())
    .then(reclamacoes => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      reclamacoes.forEach(rec => {
        const data = new Date(rec.data);
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `
          <br>
          <span3>${rec.empresa}</span3>
          <p><strong>Cliente:</strong> ${rec.nome}</p>
          <p><span2>${data.toLocaleDateString("pt-BR")}, ${rec.cidade} - ${rec.uf}</span2></p><br>
          <p><strong>Opinião:</strong><br>${rec.comentario}</p><br>
          <hr/>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      const container = document.getElementById("listaReclamacoes");
      if (container) container.innerText = "Erro ao carregar reclamações.";
    });
}

// ========================== LISTAGEM PROTEGIDA ==========================
function carregarReclamacoesPrivadas() {
  fetch(`${API_URL}/api/opinioes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(reclamacoes => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      reclamacoes.forEach(rec => {
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `
          <p><strong>Registrado em:</strong> ${new Date(rec.data).toLocaleString()}</p>
          <p><strong>Empresa:</strong> ${rec.empresa}</p>
          <p><strong>Nome:</strong> ${rec.nome} | <strong>Email:</strong> ${rec.email}</p>
          <p><strong>Endereço:</strong> ${rec.logradouro}, ${rec.numero} - ${rec.bairro}, ${rec.complemento}</p>
          <p><strong>Cidade/UF:</strong> ${rec.cidade} - ${rec.uf}, <strong>CEP:</strong> ${rec.cep}</p>
          <p><strong>Comentário:</strong><br>${rec.comentario}</p>
          <button class="btn-excluir" data-id="${rec._id}">Excluir</button>
          <button class="editar-btn" data-id="${rec._id}">Editar</button>
          <hr/>
        `;
        container.appendChild(div);
      });

      adicionarEventos();
    })
    .catch(error => {
      console.error("Erro:", error);
      document.getElementById("listaReclamacoes").innerText = "Erro ao carregar reclamações.";
    });
}

function adicionarEventos() {
  document.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.onclick = () => excluirReclamacao(btn.dataset.id);
  });
  document.querySelectorAll(".editar-btn").forEach(btn => {
    btn.onclick = () => abrirFormularioEdicao(btn.dataset.id);
  });
}

function abrirFormularioEdicao(id) {
  fetch(`${API_URL}/api/opinioes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("editNome").value = data.nome || "";
      document.getElementById("editEmail").value = data.email || "";
      document.getElementById("editEmpresa").value = data.empresa || "";
      document.getElementById("editLogradouro").value = data.logradouro || "";
      document.getElementById("editNumero").value = data.numero || "";
      document.getElementById("editBairro").value = data.bairro || "";
      document.getElementById("editComplemento").value = data.complemento || "";
      document.getElementById("editCidade").value = data.cidade || "";
      document.getElementById("editUf").value = data.uf || "";
      document.getElementById("editComentario").value = data.comentario || "";

      document.getElementById("salvarEdicao").setAttribute("data-id", id);
      document.getElementById("editarForm").style.display = "block";
    })
    .catch(() => alert("Erro ao carregar dados."));
}

function excluirReclamacao(id) {
  if (!confirm("Deseja realmente excluir esta reclamação?")) return;

  fetch(`${API_URL}/api/opinioes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      alert("Reclamação excluída!");
      carregarReclamacoesPrivadas();
    })
    .catch(() => alert("Erro ao excluir."));
}

document.getElementById("salvarEdicao")?.addEventListener("click", function () {
  const id = this.dataset.id;
  const atualizados = {
    nome: document.getElementById("editNome").value,
    email: document.getElementById("editEmail").value,
    empresa: document.getElementById("editEmpresa").value,
    logradouro: document.getElementById("editLogradouro").value,
    numero: document.getElementById("editNumero").value,
    bairro: document.getElementById("editBairro").value,
    complemento: document.getElementById("editComplemento").value,
    cidade: document.getElementById("editCidade").value,
    uf: document.getElementById("editUf").value,
    comentario: document.getElementById("editComentario").value,
  };

  fetch(`${API_URL}/api/opinioes/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(atualizados)
  })
    .then(res => {
      if (res.ok) {
        alert("Reclamação atualizada.");
        carregarReclamacoesPrivadas();
        document.getElementById("editarForm").style.display = "none";
      } else {
        alert("Erro ao atualizar.");
      }
    })
    .catch(() => alert("Erro de conexão."));
});

// ========================== LOAD DINÂMICO ==========================
window.onload = function () {
  if (document.getElementById("restrictedContent")) {
    checkAuth();
  }
  if (document.getElementById("editarForm")) {
    document.getElementById("editarForm").style.display = "none";
    carregarReclamacoesPrivadas();
  } else if (document.getElementById("listaReclamacoes")) {
    carregarReclamacoesPublicas();
  }
};
