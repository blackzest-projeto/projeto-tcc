const id = new URLSearchParams(location.search).get("id");
const p = PRODUTOS.find(x => x.id === id);
const alvo = $("produto");
let ordem = "preco";

function desenhar() {
  const linhas = Object.entries(p.precos).map(([k, v]) => ({
    v,
    loja: LOJAS[k],
    link: (p.links && p.links[k]) || LOJAS[k].busca(p.nome)
  }));
  const min = Math.min(...linhas.map(l => l.v));
  const max = Math.max(...linhas.map(l => l.v));

  linhas.sort((a, b) =>
    ordem === "preco" ? a.v - b.v : a.loja.nome.localeCompare(b.loja.nome, "pt-BR")
  );

  const itens = linhas.map(l => {
    const melhor = l.v === min;
    const dif = l.v - min;
    const sub = melhor ? "Menor preço" : `${brl(dif)} a mais (${Math.round(dif / min * 100)}%)`;
    return `<li class="row${melhor ? " best" : ""}">
      <div class="name">${l.loja.nome}<small>${sub}</small></div>
      <div class="track" aria-hidden="true"><div class="fill" style="width:${(l.v / max * 100).toFixed(1)}%"></div></div>
      <div class="price">${brl(l.v)}</div>
      <a class="go" href="${l.link}" target="_blank" rel="noopener noreferrer">Ir à loja<span class="sr"> ${l.loja.nome}</span></a>
    </li>`;
  }).join("");

  const categoria = CATEGORIAS.find(c => c.id === p.cat);

  alvo.innerHTML = `
    <a class="voltar" href="pesquisa.html?cat=${p.cat}">← ${categoria.nome}</a>
    <div class="produto-topo">
      ${foto(p)}
      <div class="produto-info">
        <h1>${p.nome}</h1>
        <button type="button" class="btn-fav" id="fav"></button>
        <p class="best-line">Menor preço <strong>${brl(min)}</strong>Economize até ${brl(max - min)} escolhendo a loja certa.</p>
        <div class="head">
          <h2>Preços por loja</h2>
          <label class="sort">Ordenar por
            <select id="ordem">
              <option value="preco"${ordem === "preco" ? " selected" : ""}>Menor preço</option>
              <option value="loja"${ordem === "loja" ? " selected" : ""}>Loja (A–Z)</option>
            </select>
          </label>
        </div>
        <ul>${itens}</ul>
      </div>
    </div>`;

  $("ordem").addEventListener("change", e => {
    ordem = e.target.value;
    desenhar();
  });

  // Botão de favoritar
  const fav = $("fav");
  function mostrarFav() {
    const ativo = Favoritos.logado() && Favoritos.tem(p.id);
    fav.setAttribute("aria-pressed", ativo);
    fav.textContent = ativo ? "♥ Favoritado" : "♡ Favoritar";
  }
  mostrarFav();
  fav.addEventListener("click", () => {
    if (!Favoritos.logado()) {
      location.href = "login.html";
      return;
    }
    Favoritos.alternar(p.id);
    mostrarFav();
  });
}

if (!p) {
  alvo.innerHTML = `<p class="vazio">Produto não encontrado. <a href="pesquisa.html">Voltar para a pesquisa</a></p>`;
} else {
  document.title = `${p.nome} | Blackzest`;
  desenhar();
}