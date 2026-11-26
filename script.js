const params = new URLSearchParams(location.search);
const estado = {
  busca: params.get("q") || "",
  cat: params.get("cat") || "todas",
  ordem: "padrao"
};
if (!CATEGORIAS.some(c => c.id === estado.cat)) estado.cat = "todas";

// Diferença entre a loja mais cara e a mais barata
function economia(p) {
  const v = Object.keys(p.precos).map(k => p.precos[k]);
  return Math.max(...v) - Math.min(...v);
}

function visiveis() {
  const q = norm(estado.busca.trim());
  const lista = PRODUTOS.filter(p =>
    (estado.cat === "todas" || p.cat === estado.cat) && norm(p.nome).includes(q)
  );
  if (estado.ordem === "menor") lista.sort((a, b) => menor(a) - menor(b));
  if (estado.ordem === "maior") lista.sort((a, b) => menor(b) - menor(a));
  if (estado.ordem === "economia") lista.sort((a, b) => economia(b) - economia(a));
  return lista;
}


function desenharChips() {
  $("chips").innerHTML = CATEGORIAS.map(c =>
    `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === estado.cat}">${c.nome}</button>`
  ).join("");
}

function desenharProdutos() {
  const lista = visiveis();
  $("total").textContent = lista.length === 1 ? "1 resultado" : `${lista.length} resultados`;
  if (!lista.length) {
    $("produtos").innerHTML = `<p class="vazio">Nenhum produto encontrado. Escolha uma das categorias acima.</p>`;
    return;
  }
  $("produtos").innerHTML = lista.map(p => {
    const eco = estado.ordem === "economia" && economia(p) > 0
      ? `<small class="economia">economize até ${brl(economia(p))}</small>` : "";
    return `
    <a class="produto-card" href="produto.html?id=${p.id}">
      ${foto(p)}
      <div class="info"><b>${p.nome}</b><small>a partir de <span class="preco">${brl(menor(p))}</span></small>${emLojas(p)}${eco}</div>
    </a>`;
  }).join("");
}

function desenhar() {
  desenharChips();
  desenharProdutos();
}

$("ordem").addEventListener("change", e => {
  estado.ordem = e.target.value;
  desenharProdutos();
});

$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  estado.busca = ""; // limpa o filtro dos links do rodapé (?q=...)
  estado.cat = b.dataset.cat;
  desenhar();
});

desenhar();