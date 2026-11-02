// Página inicial: mostra os produtos com a maior economia entre lojas.
(() => {
  const QUANTIDADE = 4;

  const economia = p => {
    const valores = Object.values(p.precos);
    return Math.max(...valores) - Math.min(...valores);
  };

  // Só faz sentido comparar produtos vendidos em pelo menos duas lojas.
  const destaques = PRODUTOS
    .filter(p => Object.keys(p.precos).length >= 2)
    .sort((a, b) => economia(b) - economia(a))
    .slice(0, QUANTIDADE);

  if (!destaques.length) return;

  $("lista-economias").innerHTML = destaques.map(p => `
    <a class="produto-card" href="produto.html?id=${p.id}">
      ${foto(p)}
      <div class="info">
        <b>${p.nome}</b>
        <small>a partir de ${brl(menor(p))}</small>
        <small class="economia">Economize até ${brl(economia(p))}</small>
      </div>
    </a>`
  ).join("");

  $("economias").hidden = false;
})();
