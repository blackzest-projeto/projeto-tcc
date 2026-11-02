const params = new URLSearchParams(location.search);
const estado = {
  busca: params.get("q") || "",
  cat: params.get("cat") || "todas"
};
if (!CATEGORIAS.some(c => c.id === estado.cat)) estado.cat = "todas";

function visiveis() {
  const q = norm(estado.busca.trim());
  return PRODUTOS.filter(p =>
    (estado.cat === "todas" || p.cat === estado.cat) && norm(p.nome).includes(q)
  );
}

function desenharChips() {
  $("chips").innerHTML = CATEGORIAS.map(c =>
    `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === estado.cat}">${c.nome}</button>`
  ).join("");
}

function desenharProdutos() {
  const lista = visiveis();
  if (!lista.length) {
    $("produtos").innerHTML = `<p class="vazio">Nenhum produto encontrado. Escolha uma das categorias acima.</p>`;
    return;
  }
  $("produtos").innerHTML = lista.map(p => `
    <a class="produto-card" href="produto.html?id=${p.id}">
      ${foto(p)}
      <div class="info"><b>${p.nome}</b><small>a partir de ${brl(menor(p))}</small></div>
    </a>`
  ).join("");
}

function desenhar() {
  desenharChips();
  desenharProdutos();
}

$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  estado.busca = ""; // limpa o filtro dos links do rodapé (?q=...)
  estado.cat = b.dataset.cat;
  desenhar();
});

desenhar();