document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim(); // ✅ Remove espaços extras
    const password = document.getElementById("password").value.trim();

    // 🚀 Verifica se os campos estão preenchidos
    if (!username || !password) {
        alert("❌ Preencha todos os campos antes de continuar.");
        return;
    }

    // ✅ URL correta do backend no Render
    const API_URL = "https://backend-goaq.onrender.com/api/users/register";

    try {
        console.log(`🔍 Enviando requisição de cadastro para: ${API_URL}`);
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        // ✅ Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            console.error(`❌ Erro ao registrar usuário. Status: ${response.status}`);
            const errorText = await response.text(); // Captura mais detalhes do erro
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Resposta do servidor:", data);

        // 🚀 Mostra mensagem de sucesso se a resposta for válida
        if (data.message) {
            const messageBox = document.getElementById("registerMessage");
            messageBox.textContent = data.message;
            messageBox.style.display = "block";

            setTimeout(() => {
                messageBox.style.display = "none"; // Oculta a mensagem após 2 segundos
            }, 2000);

            // ✅ Redireciona apenas se o cadastro for bem-sucedido
            if (data.message.includes("Usuário registrado com sucesso")) {
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }
        } else {
            alert("❌ Erro inesperado ao registrar usuário. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("❌ Erro ao registrar usuário:", error);
        alert(`Erro ao conectar com o servidor: ${error.message}`);
    }
});
