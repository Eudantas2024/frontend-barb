document.getElementById('opiniaoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const empresa = document.getElementById('empresa').value.trim();
  const comentario = document.getElementById('comentario').value.trim();
  const mensagem = document.getElementById('mensagem');

  if (!empresa || !comentario) {
    mensagem.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    const resposta = await fetch('http://localhost:3000/api/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ empresa, comentario })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = 'Opinião enviada com sucesso. Aguarde a aprovação.';
      document.getElementById('opiniaoForm').reset();
    } else {
      mensagem.textContent = dados.message || 'Erro ao enviar opinião.';
    }
  } catch (erro) {
    console.error('Erro:', erro);
    mensagem.textContent = 'Erro ao conectar com o servidor.';
  }
});
