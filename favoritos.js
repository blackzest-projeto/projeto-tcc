const Favoritos = (() => {
  const CHAVE = "blackzest_favoritos";
  const emailAtual = () => localStorage.getItem("blackzest_sessao");

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch { return {}; }
  }

  // Só vale se existe uma pessoa logada de verdade
  function logado() {
    try {
      const usuarios = JSON.parse(localStorage.getItem("blackzest_usuarios")) || {};
      return Boolean(usuarios[emailAtual()]);
    } catch {
      return false;
    }
  }

  const lista = () => ler()[emailAtual()] || [];
  const tem = id => lista().includes(id);

  // Adiciona ou remove. Devolve true se agora é favorito.
  function alternar(id) {
    const todos = ler();
    const email = emailAtual();
    const atual = todos[email] || [];
    const posicao = atual.indexOf(id);
    if (posicao >= 0) atual.splice(posicao, 1);
    else atual.push(id);
    todos[email] = atual;
    localStorage.setItem(CHAVE, JSON.stringify(todos));
    return posicao < 0;
  }

  return { logado, lista, tem, alternar };
})();