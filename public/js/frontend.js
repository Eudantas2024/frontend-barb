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
        body: JSON.stringify({ username, password }),
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

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      const messageBox = document.getElementById("loginMessage");
      if (messageBox) {
        messageBox.textContent = "❌ Preencha todos os campos.";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
      }
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: Falha na requisição`);
      }

      const data = await response.json();
      const messageBox = document.getElementById("loginMessage");
      if (messageBox) {
        messageBox.textContent = data.message || "Login realizado!";
        messageBox.style.color = data.token ? "green" : "red";
        messageBox.style.display = "block";

        setTimeout(() => {
          messageBox.style.display = "none";
          if (data.token) {
            window.location.href = "moderador.html";
          }
        }, 2000);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      alert(`Erro ao conectar com o servidor: ${error.message}`);
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
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return;
    }

    const content = document.getElementById("restrictedContent");
    if (content) content.style.display = "block";
  } catch {
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
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar reclamações públicas");
      return res.json();
    })
    .then((reclamacoes) => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      reclamacoes.forEach((rec) => {
        const data = new Date(rec.data);
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `
          <br>
          <span3>${rec.empresa || "-"}</span3>
          <p><strong>Cliente:</strong> ${rec.nome || "Anônimo"}</p>
          <p><span2>${data.toLocaleDateString("pt-BR")}, ${rec.cidade || "-"} - ${rec.uf || "-"}</span2></p><br>
          <p><strong>Opinião:</strong><br>${rec.comentario || "-"}</p><br>
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
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar reclamações privadas");
      return res.json();
    })
    .then((reclamacoes) => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      reclamacoes.forEach((rec) => {
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `
          <p><strong>Registrado em:</strong> ${new Date(rec.data).toLocaleString()}</p>
          <p><strong>Empresa:</strong> ${rec.empresa || "-"}</p>
          <p><strong>Nome:</strong> ${rec.nome || "-"} | <strong>Email:</strong> ${rec.email || "-"}</p>
          <p><strong>Endereço:</strong> ${rec.logradouro || "-"}, ${rec.numero || "-"} - ${rec.bairro || "-"}, ${rec.complemento || "-"}</p>
          <p><strong>Cidade/UF:</strong> ${rec.cidade || "-"} - ${rec.uf || "-"}, <strong>CEP:</strong> ${rec.cep || "-"}</p>
          <p><strong>Comentário:</strong><br>${rec.comentario || "-"}</p>
          <button class="btn-excluir" data-id="${rec._id}">Excluir</button>
          <button class="editar-btn" data-id="${rec._id}">Editar</button>
          <hr/>
        `;
        container.appendChild(div);
      });

      adicionarEventos();
    })
    .catch((error) => {
      console.error("Erro:", error);
      const container = document.getElementById("listaReclamacoes");
      if (container) container.innerText = "Erro ao carregar reclamações.";
    });
}

function adicionarEventos() {
  document.querySelectorAll(".btn-excluir").forEach((btn) => {
    btn.onclick = () => excluirReclamacao(btn.dataset.id);
  });
  document.querySelectorAll(".editar-btn").forEach((btn) => {
    btn.onclick = () => abrirFormularioEdicao(btn.dataset.id);
  });
}

function abrirFormularioEdicao(id) {
  fetch(`${API_URL}/api/opinioes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao carregar dados da reclamação.");
      return res.json();
    })
    .then((data) => {
      document.getElementById("editNome").value = data.nome || "";
      document.getElementById("editEmail").value = data.email || "";
      document.getElementById("editEmpresa").value = data.empresa || "";
      document.getElementById("editLogradouro").value = data.logradouro || "";
      document.getElementById("editNumero").value = data.numero || "";
      document.getElementById("editBairro").value = data.bairro || "";
      document.getElementById("editComplemento").value = data.complemento || "";
      document.getElementById("editCidade").value = data.cidade || "";
      document.getElementById("editUF").value = data.uf || "";
      document.getElementById("editCEP").value = data.cep || "";
      document.getElementById("editComentario").value = data.comentario || "";

      document.getElementById("editId").value = id;

      // Exibir o formulário de edição (supondo que tenha um container)
      const formEdicao = document.getElementById("formEdicao");
      if (formEdicao) formEdicao.style.display = "block";
    })
    .catch((error) => {
      alert(error.message);
    });
}

function excluirReclamacao(id) {
  if (!confirm("Tem certeza que deseja excluir esta reclamação?")) return;

  fetch(`${API_URL}/api/opinioes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Falha ao excluir reclamação.");
      carregarReclamacoesPrivadas();
    })
    .catch((error) => alert(error.message));
}

// ========================== FORMULÁRIO DE EDIÇÃO ==========================
const formEdicao = document.getElementById("formEdicao");
if (formEdicao) {
  formEdicao.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("editId").value;
    const dadosAtualizados = {
      nome: document.getElementById("editNome").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      empresa: document.getElementById("editEmpresa").value.trim(),
      logradouro: document.getElementById("editLogradouro").value.trim(),
      numero: document.getElementById("editNumero").value.trim(),
      bairro: document.getElementById("editBairro").value.trim(),
      complemento: document.getElementById("editComplemento").value.trim(),
      cidade: document.getElementById("editCidade").value.trim(),
      uf: document.getElementById("editUF").value.trim(),
      cep: document.getElementById("editCEP").value.trim(),
      comentario: document.getElementById("editComentario").value.trim(),
    };

    fetch(`${API_URL}/api/opinioes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar reclamação.");
        alert("Reclamação atualizada com sucesso!");
        formEdicao.style.display = "none";
        carregarReclamacoesPrivadas();
      })
      .catch((error) => alert(error.message));
  });
}

// ========================== VALIDAÇÃO VIA CEP ==========================
const cepInput = document.getElementById("cep");
if (cepInput) {
  cepInput.addEventListener("blur", function () {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          alert("CEP inválido.");
          return;
        }

        document.getElementById("logradouro").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("uf").value = data.uf || "";
      })
      .catch(() => alert("Erro ao buscar CEP."));
  });
}

// ========================== CHAMADAS INICIAIS ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaReclamacoes") && !localStorage.getItem("token")) {
    carregarReclamacoesPublicas();
  }

  if (document.getElementById("restrictedContent")) {
    checkAuth();
    carregarReclamacoesPrivadas();
  }
});
