const id = new URLSearchParams(location.search).get("id");
const p = PRODUTOS.find(x => x.id === id);
const alvo = $("produto");
let ordem = "preco";

// Outros produtos da categoria: primeiro os do mesmo tipo
// (mesma primeira palavra do nome, como "Geladeira") e depois os de preço mais próximo.
function parecidos() {
  const tipo = x => norm(x.nome).split(" ")[0];
  const lista = PRODUTOS
    .filter(x => x.cat === p.cat && x.id !== p.id)
    .sort((a, b) =>
      (tipo(b) === tipo(p)) - (tipo(a) === tipo(p)) ||
      Math.abs(menor(a) - menor(p)) - Math.abs(menor(b) - menor(p))
    )
    .slice(0, 4);

  if (!lista.length) return "";

  const cards = lista.map(x => `
    <a class="produto-card" href="produto.html?id=${x.id}">
      ${foto(x)}
      <div class="info"><b>${x.nome}</b><small>a partir de ${brl(menor(x))}</small></div>
    </a>`
  ).join("");

  return `
    <section class="parecidos">
      <h2>Produtos parecidos</h2>
      <div class="grade-produtos">${cards}</div>
    </section>`;
}

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

  // Mostra só a data: as observações de "conferido" são anotações internas.
  const dataConferida = (p.conferido || "").match(/\d{2}\/\d{2}\/\d{4}/);
  const conferido = dataConferida
    ? `<p class="conferido">Preços conferidos em ${dataConferida[0]}. Os valores podem ter mudado; confirme na loja antes de comprar.</p>`
    : "";

  const descricao = DESCRICOES[p.id]
    ? `<section class="descricao"><h2>Descrição do produto</h2><p>${DESCRICOES[p.id]}</p></section>`
    : "";

  alvo.innerHTML = `
    <a class="voltar" href="pesquisa.html?cat=${p.cat}">← ${categoria.nome}</a>
    <div class="produto-topo">
      ${foto(p)}
      <div class="produto-info">
        <h1>${p.nome}</h1>
        <button type="button" class="btn-fav" id="fav"></button>
        <p class="best-line">Menor preço <strong>${brl(min)}</strong>Economize até ${brl(max - min)} escolhendo a loja certa.</p>
        ${conferido}
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
    </div>
    ${descricao}
    ${parecidos()}`;

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