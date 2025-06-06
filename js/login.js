

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

      const data = await response.json();
      const messageBox = document.getElementById("registerMessage");

      if (messageBox) {
        if (response.ok && data.token) {
          messageBox.textContent = "✅ Login realizado com sucesso!";
          messageBox.style.color = "green";
          messageBox.style.display = "block";

          localStorage.setItem("token", data.token);
          setTimeout(() => {
            window.location.href = "dantas.html";
          }, 2000);
        } else {
          messageBox.textContent = "❌ Usuário ou senha inválidos.";
          messageBox.style.color = "red";
          messageBox.style.display = "block";
          setTimeout(() => (messageBox.style.display = "none"), 3000);
        }
      }


      if (response.ok && data.message.includes("registrado")) {
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        alert(data.message || "Erro ao registrar.");
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
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
    const messageBox = document.getElementById("loginMessage");

    if (!username || !password) {
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
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);

        if (messageBox) {
          messageBox.textContent = "✅ Login realizado com sucesso!";
          messageBox.style.color = "green";
          messageBox.style.display = "block";
        }

        setTimeout(() => {
          window.location.href = "dantas.html";
        }, 2000);
      } else {
        if (messageBox) {
          messageBox.textContent = "❌ Usuário ou senha inválidos.";
          messageBox.style.color = "red";
          messageBox.style.display = "block";
        }
      }

    } catch (error) {
      if (messageBox) {
        messageBox.textContent = `❌ Erro: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
      }
    }
  });
}


// ========================== VERIFICAÇÃO DE AUTENTICAÇÃO ==========================
async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/conteudo`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const content = document.getElementById("restrictedContent");
    if (content) content.style.display = "block";
  } catch {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

// ========================== LOGOUT ==========================
function logout() {
  localStorage.removeItem("token");
  const msg = document.getElementById("logoutMessage");
  if (msg) msg.style.display = "block";
  setTimeout(() => {
    if (msg) msg.style.display = "none";
    window.location.href = "index.html";
  }, 2000);
}

// ========================== LISTAR OPINIÕES APROVADAS ==========================
function carregarReclamacoes(token = null) {
  const url = `${API_URL}/api/empresas`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  fetch(url, { headers })
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("listaReclamacoes");
      if (!container) return;

      container.innerHTML = "";
      data.forEach((rec) => {
        const div = document.createElement("div");
        div.className = "reclamacao";
        div.innerHTML = `<p><strong>${rec.empresa}</strong> - ${rec.comentario}</p>`;
        container.appendChild(div);
      });
    })
    .catch(() => alert("Erro ao carregar opiniões."));
}
