// FRONTEND (index.js ou script.js)

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

      const data = await response.json();

      const messageBox = document.getElementById("registerMessage");
      if (messageBox) {
        messageBox.textContent = data.message;
        messageBox.style.display = "block";
        setTimeout(() => (messageBox.style.display = "none"), 2000);
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
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      const messageBox = document.getElementById("loginMessage");
      if (messageBox) {
        messageBox.textContent = data.message || "Login realizado!";
        messageBox.style.color = response.ok ? "green" : "red";
        messageBox.style.display = "block";
        setTimeout(() => (messageBox.style.display = "none"), 2000);
      }

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "moderador.html";
        }, 2000);
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
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

function logout() {
  localStorage.removeItem("token");
  const msg = document.getElementById("logoutMessage");
  if (msg) msg.style.display = "block";
  setTimeout(() => {
    if (msg) msg.style.display = "none";
    window.location.href = "index.html";
  }, 2000);
}

// ========================== PÚBLICO / PRIVADO ==========================
function carregarReclamacoes(token = null) {
  const url = `${API_URL}/api/opinioes`;
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
    .catch(() => alert("Erro ao carregar reclamações."));
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (document.getElementById("listaReclamacoes")) {
    carregarReclamacoes(token);
  }
  if (document.getElementById("restrictedContent")) {
    checkAuth();
  }
});
