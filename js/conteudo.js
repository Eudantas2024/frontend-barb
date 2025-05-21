async function checkAuth() {
    const token = localStorage.getItem("token");

    // 🔍 Verifica se há um token salvo
    console.log("🔍 Token no localStorage:", token);

    if (!token) {
        console.error("❌ Usuário não autenticado! Redirecionando...");
        window.location.href = "index.html";
        return;
    }

    // ✅ URL correta do backend
    const API_URL = "https://backend-barb.onrender.com";

    try {
        const response = await fetch(`${API_URL}/api/conteudo`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("❌ Erro na autenticação:", response.status, response.statusText);
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();
        console.log("✅ Conteúdo carregado com sucesso:", data);
        document.getElementById("restrictedContent").style.display = "block"; // Exibe o conteúdo apenas após validação
    } catch (error) {
        console.error("❌ Erro na autenticação:", error);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}

// 🚀 Chama a função para verificar a autenticação
checkAuth();

function logout() {
    localStorage.removeItem("token");
    document.getElementById("logoutMessage").style.display = "block";

    setTimeout(() => {
        document.getElementById("logoutMessage").style.display = "none";
        window.location.href = "index.html";
    }, 2000);
}
