
// ========================== VIA CEP ==========================
const cepInput = document.getElementById("cep");
if (cepInput) {
  cepInput.addEventListener("blur", async function () {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      alert("❌ CEP inválido. Deve conter 8 dígitos.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("❌ CEP não encontrado.");
        return;
      }

      const logradouro = document.getElementById("logradouro");
      const bairro = document.getElementById("bairro");
      const cidade = document.getElementById("cidade");
      const estado = document.getElementById("estado");

      if (logradouro) logradouro.value = data.logradouro || "";
      if (bairro) bairro.value = data.bairro || "";
      if (cidade) cidade.value = data.localidade || "";
      if (estado) estado.value = data.uf || "";
    } catch (error) {
      alert("Erro ao buscar o CEP.");
    }
  });
}
