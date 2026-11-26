const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const $ = id => document.getElementById(id);
const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Cada loja sabe montar o endereço da busca pelo nome do produto.
// Isso é usado quando o produto ainda não tem o link exato (campo "links").
const LOJAS = {
  kabum:      { nome: "KaBuM!",       busca: t => `https://www.kabum.com.br/busca/${slug(t)}` },
  terabyte:   { nome: "Terabyte",     busca: t => `https://www.terabyteshop.com.br/busca?str=${encodeURIComponent(t)}` },
  pichau:     { nome: "Pichau",       busca: t => `https://www.pichau.com.br/search?q=${encodeURIComponent(t)}` },
  casasbahia: { nome: "Casas Bahia",  busca: t => `https://www.casasbahia.com.br/${slug(t)}/b` },
  americanas: { nome: "Americanas",   busca: t => `https://www.americanas.com.br/busca/${slug(t)}` },
  leroy:      { nome: "Leroy Merlin", busca: t => `https://www.leroymerlin.com.br/search?term=${encodeURIComponent(t)}` },
    amazon:       { nome: "Amazon",        busca: t => `https://www.amazon.com.br/s?k=${encodeURIComponent(t)}` },
  mercadolivre: { nome: "Mercado Livre", busca: t => `https://lista.mercadolivre.com.br/${slug(t)}` },
    fastshop:     { nome: "Fast Shop",     busca: t => `https://www.fastshop.com.br/web/s/${encodeURIComponent(t)}` },
    shopee:       { nome: "Shopee",        busca: t => `https://shopee.com.br/search?keyword=${encodeURIComponent(t)}` },
  carrefour:    { nome: "Carrefour",     busca: t => `https://www.carrefour.com.br/busca/${encodeURIComponent(t)}` },
  magalu:       { nome: "Magazine Luiza", busca: t => `https://www.magazineluiza.com.br/busca/${encodeURIComponent(t)}/` }
};

const CATEGORIAS = [
  { id: "todas",            nome: "Todas" },
  { id: "eletronicos",      nome: "Vídeo e áudio" },
  { id: "celulares",        nome: "Celulares" },
  { id: "eletrodomesticos", nome: "Eletrodomésticos" },
  { id: "pecas",            nome: "Peças de computador" },
  { id: "notebooks",        nome: "Notebooks" },
  { id: "wearables",        nome: "Wearables" },
  { id: "casa",             nome: "Casa inteligente" },
  { id: "games",            nome: "Games" },
  { id: "perifericos",      nome: "Periféricos" },
  { id: "climatizacao",     nome: "Climatização" }
];

// Preços de exemplo. Para adicionar um produto, copie um bloco e mude os dados.
// A foto é imagens/ID.jpg (ex.: imagens/s24.jpg). Para outro nome, use img: "imagens/outra.png".
// Para abrir a página exata do produto na loja, descomente "links" e cole os endereços.
// Atualização de 15/11/2026: os preços da KaBuM! foram lidos na página da loja;
// os das outras lojas vieram de resultados de busca e podem estar desatualizados.
const PRODUTOS = [
  // ---------- Celulares ----------
  { id: "iphone17", cat: "celulares", emoji: "📱",
    nome: "Apple iPhone 17 256GB Preto",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix, vendido por Iplace; Amazon e Americanas: dados de busca)",
    precos: { amazon: 5859.00, kabum: 7249.00, americanas: 7999.00 },
    links: {
      amazon: "https://www.amazon.com.br/Apple-iPhone-17-256-GB/dp/B0GQW2J4SK",
      kabum: "https://www.kabum.com.br/produto/1016330/iphone-17-256gb-preto",
      americanas: "https://www.americanas.com.br/apple-iphone-17-256gb-preto-17585c7325b6t073/p"
    }
  },
  { id: "galaxys25", cat: "celulares", emoji: "📲",
    nome: "Samsung Galaxy S25 5G 256GB",
    conferido: "15/11/2026 (KaBuM!: página aberta, azul, Pix, vendido por Magalu; Magazine Luiza: azul-marinho, Pix, dado de busca)",
    precos: { kabum: 3899.00, magalu: 4699.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/703063/samsung-galaxy-s25-5g-dual-chip-256gb-galaxy-ai-6-2-12gb-ram-cam-tripla-50-12-10mp-bateria-4000mah-azul",
      magalu: "https://www.magazineluiza.com.br/samsung-galaxy-s25-5g-256gb-galaxy-ai-azul-marinho-62-12gb-ram-cam-tripla-50-12-10mp-bateria-4000mah-dual-chip/p/238921100/te/gs25/"
    }
  },
  { id: "edge60fusion", cat: "celulares", emoji: "📱",
    nome: "Smartphone Motorola Edge 60 Fusion 5G",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; cinza, 256GB; Carrefour: Pix)",
    precos: { amazon: 1999.00, carrefour: 2069.10, magalu: 2199.00 },
    links: {
      amazon: "https://www.amazon.com.br/Smartphone-Motorola-Edge-60-Fusion/dp/B0F1GVZ8H4",
      carrefour: "https://www.carrefour.com.br/produto/smartphone-motorola-edge-60-fusion-5g-256gb-8gb-ram-tela-67-camera-50mp-selfie-32mp-cinza-334202001",
      magalu: "https://www.magazineluiza.com.br/smartphone-motorola-edge-60-fusion-5g-6-7-octa-core-256gb-8gb-camera-dupla-motorola-celular/p/fg0k231948/te/me6f/"
    }
  },
  { id: "galaxya56", cat: "celulares", emoji: "📲",
    nome: "Samsung Galaxy A56 5G 256GB",
    conferido: "23/11/2026 (Magazine Luiza e Amazon: à vista, print do Buscapé enviado pelo usuário; KaBuM!: preto, Pix, vendido por J&J, conferido em 15/11)",
    precos: { magalu: 2339.10, amazon: 2721.11, kabum: 3199.99 },
    links: {
      magalu: "https://www.magazineluiza.com.br/smartphone-samsung-galaxy-a56-256gb-5g-8gb-ram-cinza-67-cam-tripla-selfie-12mp/p/240097600/te/ga56/",
      kabum: "https://www.kabum.com.br/produto/729973/celular-samsung-galaxy-a56-5g-256gb-8gb-ram-camera-50mp-ip67-super-amoled-6-7-recursos-ai-preto"
    }
  },
  { id: "razr60", cat: "celulares", emoji: "📱",
    nome: "Motorola Razr 60 5G 256GB Dobrável",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Carrefour e Casas Bahia: Pix)",
    precos: { amazon: 2999.00, carrefour: 3386.04, casasbahia: 3399.15 },
    links: {
      amazon: "https://www.amazon.com.br/Smartphone-Motorola-60-256GB-dobr%C3%A1vel-externa/dp/B0F8LJSC9B",
      carrefour: "https://www.carrefour.com.br/smartphone-motorola-razr-60-5g-256gb-24gb-12gb-ram-12gb-ram-boost-tela-dobravel-6-9-poled-e-externa--mp951839768/p",
      casasbahia: "https://www.casasbahia.com.br/smartphone-motorola-razr-60-256gb-24gb-12gb-ram-12gb-ram-boost-tela-dobravel-69-quot-poled-e-externa-36-moto-ai-camera-ip48/p/1572113554"
    }
  },

  // ---------- Vídeo e áudio ----------
  { id: "mibox", cat: "eletronicos", emoji: "📺",
    nome: "Xiaomi Mi Box S 2ª geração 4K",
    conferido: "15/11/2026 (só achei no Mercado Livre: dado de busca, anúncios entre R$ 369 e R$ 499,90; KaBuM! aparece esgotada)",
    precos: { mercadolivre: 474.90 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/xiaomi-mi-box-s-2-geraco-resoluco-4k-ultra-hd-hdr-dolby-vision-hdr10-mdz-28-aa-sistema-google-tv-chromecast-cor-preto/p/MLB23069368"
    }
  },
  { id: "monitor", cat: "eletronicos", emoji: "🖥️",
    nome: "Monitor Gamer Samsung Odyssey G3 24 polegadas",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix, vendido por Magalu; Amazon e Pichau: dados de busca)",
    precos: { kabum: 1529.10, amazon: 1549.90, pichau: 1899.90 },
    links: {
      kabum: "https://www.kabum.com.br/produto/232252/monitor-gamer-samsung-odyssey-g3-24pol-full-hd-144-hz-1ms-hdmi-display-port-vga-freesync-premium-regulagem-de-altura-lf24g35tfwlxzd",
      amazon: "https://www.amazon.com.br/Samsung-Monitor-24-F24G35TFWL-Preto/dp/B098ZM9ZS1",
      pichau: "https://www.pichau.com.br/monitor-gamer-samsung-odyssey-g3-24-pol-va-fhd-1ms-144hz-freesync-dp-hdmi-vga-lf24g35tfwlxzd"
    }
  },
  { id: "tvtcl55", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV TCL 55 polegadas QLED 4K",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; modelo 55P7L; Amazon, Fast Shop e Magazine Luiza: Pix)",
    precos: { amazon: 2462.82, mercadolivre: 2599.00, fastshop: 2699.00, magalu: 2754.05 },
    links: {
      amazon: "https://www.amazon.com.br/Smart-TCL-Polegadas-Bluetooth-Google/dp/B0H4NP2GQY",
      mercadolivre: "https://www.mercadolivre.com.br/smart-tv-tcl-55-polegadas-qled-4k-p7l-wifi-bluetooth-google-tv-hdr10-120-hz-vrr-aipq-55p7l/p/MLB70577035",
      fastshop: "https://site.fastshop.com.br/smart-tv-4k-tcl-advanced-qled-55%E2%80%9D-polegadas-com-processador-aipq--dolby-vision---hdr10--e-wi-fi---55p7l-tk55p7lpto_prd/p",
      magalu: "https://www.magazineluiza.com.br/smart-tv-55-tcl-4k-uhd-qled-55p7l-google-tv-2026/p/241502800/et/tv4k/"
    }
  },
  { id: "tvsamsung50", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV Samsung 50 polegadas Crystal UHD 4K U8600F",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix, vendido por Login Informática; Carrefour: Pix, dado de busca, confirmar se o link é o mesmo anúncio; Amazon: dado de busca)",
    precos: { carrefour: 2469.05, amazon: 2566.66, kabum: 3199.00 },
    links: {
      carrefour: "https://www.carrefour.com.br/produto/samsung-smart-tv-0-crystal-uhd-k-u00f-0-xbox-cloud-gaming-ai-energy-mode-alexa-integrada-334669958",
      amazon: "https://www.amazon.com.br/Samsung-Smart-Crystal-U8600F-2025/dp/B0F5X4LL89",
      kabum: "https://www.kabum.com.br/produto/871638/samsung-smart-tv-50-crystal-uhd-4k-u8600f-2025-xbox-cloud-gaming-canais-gratuitos-alexa-50-"
    }
  },
  { id: "tvlg55", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV LG 55 polegadas 4K UHD 55UA8550PSA",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Mercado Livre e Magazine Luiza: Pix; Magazine Luiza: confirmar se o link é o mesmo anúncio)",
    precos: { mercadolivre: 2195.99, magalu: 3086.55 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/smart-tv-lg-uhd-ai-ua85-55-polegadas-55ua8550psa/p/MLB51481327",
      magalu: "https://www.magazineluiza.com.br/smart-tv-55-lg-4k-ultra-hd-55ua8550psa-webos-25-ai-processor-4k-gen8-com-alexa-3-hdmi/p/240243300/et/tv4k/?seller_id=magazineluiza"
    }
  },
  { id: "tvtcl43", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV TCL 43 polegadas Full HD 43S5400A",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Magazine Luiza: Pix; Mercado Livre: loja oficial TCL)",
    precos: { amazon: 1699.00, mercadolivre: 1744.00, magalu: 1979.99 },
    links: {
      amazon: "https://www.amazon.com.br/TCL-LED-SMART-S5400A-ANDROID/dp/B0CC6P9DJJ",
      mercadolivre: "https://www.mercadolivre.com.br/smart-tv-43-led-full-hd-2-hdmi-wi-fi-bluetooth-43s5400a-tcl/p/MLB27150721",
      magalu: "https://www.magazineluiza.com.br/smart-tv-tcl-s5400a-43-polegadas-led-fhd-hdmi-e-usb-bluetooth-wi-fi-android-dolby-audio-hdr-43s5400a/p/bda2fe2645/et/tled/"
    }
  },
  { id: "tvphilips50", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV Philips 50 polegadas 4K UHD 50PUG7019",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque)",
    precos: { casasbahia: 2429.13, amazon: 2499.00 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/smart-tv-philips-50-4k-uhd-google-tv-dolby-audio-50pug7019-78/p/1569834073",
      amazon: "https://www.amazon.com.br/Philips-50PUG7019-78-Google-Comando/dp/B0DFRSDH9P"
    }
  },
  { id: "jbl520bt", cat: "eletronicos", emoji: "🎧",
    nome: "Fone de Ouvido JBL Tune 520BT Bluetooth",
    conferido: "15/11/2026 (KaBuM!: página aberta, azul, Pix, vendido por Efacini; Pichau: azul, Pix, dado de busca; Amazon: roxo, dado de busca)",
    precos: { kabum: 239.40, pichau: 239.99, amazon: 269.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/474932/fone-de-ouvido-jbl-tune-520bt-bluetooth-ate-57hrs-app-comando-de-voz-azul-jblt520bt",
      pichau: "https://www.pichau.com.br/fone-de-ouvido-jbl-tune-520bt-wireless-azul-jblt520btblu",
      amazon: "https://www.amazon.com.br/Fone-Ouvido-Bluetooth-JBL-520BT/dp/B0C6STQ1BJ"
    }
  },
  { id: "jblgo4", cat: "eletronicos", emoji: "🔊",
    nome: "Caixa de Som Bluetooth JBL Go 4",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; preto; Mercado Livre e Amazon: Pix)",
    precos: { mercadolivre: 243.46, amazon: 283.49 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/jbl-caixa-de-som-go-4-black-prova-dagua-jblgo4blk-cor-preto/p/MLB36386053",
      amazon: "https://www.amazon.com.br/JBL-Bluetooth-Speaker-Preta-JBLGO4BLK/dp/B0CX5C6WP3"
    }
  },
  { id: "hwc400", cat: "eletronicos", emoji: "🔉",
    nome: "Soundbar Samsung HW-C400 2.0 Canais",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Mercado Livre: vendedores entre R$ 899 e R$ 1.100)",
    precos: { mercadolivre: 899.00, americanas: 1025.43 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/barra-de-som-hdmi-bluetooth-samsung-hw-c400-de-20-canais-cor-preta/p/MLB24027407",
      americanas: "https://www.americanas.com.br/soundbar-samsung-hw-c400-bluetooth-bivolt-modelo-2024-preto-7513263372/p"
    }
  },
  { id: "sonyxm5", cat: "eletronicos", emoji: "🎧",
    nome: "Fone de Ouvido Sony WH-1000XM5",
    conferido: "15/11/2026 (KaBuM!: página aberta, prateado, Pix, vendido por Victory; Magazine Luiza: preto, Pix, dado de busca)",
    precos: { kabum: 2499.99, magalu: 2609.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1064542/sony-fones-de-ouvido-wh-1000xm5-premium-com-cancelamento-de-ruido-bateria-de-30-horas-prateado",
      magalu: "https://www.magazineluiza.com.br/fone-de-ouvido-sony-bluetooth-wh-1000xm5-over-ear-cancelamento-de-ruido-preto-wh-1000xm5-b/p/gh0aa2ek54/ea/fobt/"
    }
  },

  // ---------- Eletrodomésticos ----------
  { id: "airfryer", cat: "eletrodomesticos", emoji: "🍟",
    nome: "Air Fryer Mondial Family 4L",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Leroy Merlin: Pix)",
    precos: { casasbahia: 269.00, leroy: 341.91 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/fritadeira-eletrica-sem-oleo-air-fryer-mondial-afn40bi-family-inox-4l-preta-inox/p/55032021",
      leroy: "https://www.leroymerlin.com.br/fritadeira-sem-oleo-afn-40-bi-4-litros-1500w-mondial_1567790436"
    }
  },
  { id: "aspirador", cat: "eletrodomesticos", emoji: "🧹",
    nome: "Aspirador de Pó Vertical Electrolux PowerSpeed Plus",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Casas Bahia: Pix; confirme a voltagem)",
    precos: { casasbahia: 198.00, americanas: 278.53 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/aspirador-de-po-vertical-electrolux-powerspeed-plus-stk14-2-em-1-1300w-denim-blue/p/55026292",
      americanas: "https://www.americanas.com.br/produto/7512181590/aspirador-de-po-electrolux-powerspeed-plus-com-capacidade-de-1-6-litros-filtro-stk14"
    }
  },
  { id: "geladeira", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Brastemp Frost Free Duplex 375L",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; 220V; Americanas: menor oferta do anúncio)",
    precos: { americanas: 2726.24, casasbahia: 3571.45 },
    links: {
      americanas: "https://www.americanas.com.br/geladeira-brastemp-375-litros-frost-free-duplex-branco-brm44hb-220v-173b869f134f5194/p",
      casasbahia: "https://www.casasbahia.com.br/geladeira-brastemp-frost-free-duplex-brm44hb-com-compartimento-extrafrio-fresh-zone-branca-375l/p/12731686"
    }
  },
  { id: "geladeiraconsul", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Consul Frost Free Duplex 377L CRM44MB",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; 110V; preços no Pix)",
    precos: { amazon: 2290.46, casasbahia: 2528.00, carrefour: 2625.80, leroy: 2648.64 },
    links: {
      amazon: "https://www.amazon.com.br/Geladeira-Consul-Litros-Duplex-CRM44MB/dp/B0FTLJNR7L",
      casasbahia: "https://www.casasbahia.com.br/geladeira-consul-crm44mb-duplex-inverter-377l-frost-free-branca/p/55070758",
      carrefour: "https://www.carrefour.com.br/geladeira-consul-crm44mb-duplex-377-litros-tecnologia-inverter-frost-free-branca-110v-3997189/p",
      leroy: "https://www.leroymerlin.com.br/geladeira-frost-free-duplex-consul-377-litros-branca-crm44mb-110v_1572604383"
    }
  },
  { id: "geladeiraelectrolux", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Electrolux Frost Free Duplex 431L TF55",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Magazine Luiza: Pix; Mercado Livre: 220V)",
    precos: { magalu: 3571.06, mercadolivre: 3843.33 },
    links: {
      magalu: "https://www.magazineluiza.com.br/geladeira-refrigerador-electrolux-frost-free-duplex-branca-431l-tf55-top-freezer/p/013016501/ed/ref2/",
      mercadolivre: "https://www.mercadolivre.com.br/geladeira-electrolux-frost-free-431l-duplex-branca-tf55-220v/p/MLB15949890"
    }
  },
  { id: "geladeirapanasonic", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Panasonic Frost Free 425L NR-BB53",
    conferido: "15/11/2026 (só confirmei no Magazine Luiza: aço escovado, Pix, dado de busca)",
    precos: { magalu: 4844.00 },
    links: {
      magalu: "https://www.magazineluiza.com.br/geladeira-panasonic-frost-free-425l-a-aco-escovado-nr-bb53pv3x/p/jdbckh69be/ed/rinv/"
    }
  },
  { id: "geladeirasamsung", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Samsung Frost Free Inverter Duplex 460L",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Inox Look; Magazine Luiza: Pix; Mercado Livre: loja oficial Samsung)",
    precos: { magalu: 4369.05, mercadolivre: 4999.00 },
    links: {
      magalu: "https://www.magazineluiza.com.br/geladeira-samsung-evolution-rt46-com-powervolt-inverter-duplex-460l-inox-look/p/gfc9792930/ed/refr/",
      mercadolivre: "https://www.mercadolivre.com.br/geladeira-inverter-frost-free-samsung-rt46k6a4k-inox-look-com-freezer-460l-127v220v/p/MLB17467333"
    }
  },
  { id: "lavadora", cat: "eletrodomesticos", emoji: "🧺",
    nome: "Lavadora de Roupas Electrolux 11kg",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Americanas: Pix; confirme a voltagem)",
    precos: { casasbahia: 1499.00, americanas: 1519.04, leroy: 1699.00 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/lavadora-de-roupas-electrolux-11kg-les11-essencial-care-com-filtro-pega-fiapos-branca/p/1571299293",
      americanas: "https://www.americanas.com.br/produto/1808805709",
      leroy: "https://www.leroymerlin.com.br/lavadora-de-roupas-electrolux-11kg-les11_1567032604"
    }
  },
  { id: "lavadora15", cat: "eletrodomesticos", emoji: "🫧",
    nome: "Lavadora de Roupas Electrolux 15kg",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Casas Bahia e Americanas: 110V; Leroy Merlin: 220V)",
    precos: { casasbahia: 1749.00, leroy: 1949.00, americanas: 2243.42 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/maquina-de-lavar-15kg-electrolux-led15-essential-care-com-cesto-inox-jet-clean-e-ultra-filter/p/1516914922",
      leroy: "https://www.leroymerlin.com.br/maquina-de-lavar-electrolux-15kg-branca-essential-care-com-cesto-inox-e-jet-clean--led15--220v_1572274847",
      americanas: "https://www.americanas.com.br/maquina-de-lavar-electrolux-15-kg-essencial-care-led15-com-tecnologia-jet-e-clean-branca-110v-3256467122/p"
    }
  },

  // ---------- Peças de computador ----------
  { id: "ssd1tb", cat: "pecas", emoji: "💾",
    nome: "SSD Kingston NV3 1TB M.2 NVMe PCIe 4.0",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix; Terabyte e Pichau: Pix, dados de busca)",
    precos: { terabyte: 1149.90, kabum: 1149.99, pichau: 1149.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/31564/ssd-kingston-nv3-1tb-m2-nvme-2280-pcie-40-leitura-6000mbs-e-gravacao-4000mbs-snv3s1000g",
      kabum: "https://www.kabum.com.br/produto/621162/ssd-kingston-nv3-1-tb-m-2-2280-pcie-4-0-x4-nvme-leitura-6000-mb-s-gravacao-4000-mb-s-azul-snv3s-1000g",
      pichau: "https://www.pichau.com.br/ssd-kingston-nv3-1tb-m-2-2280-pcie-nvme-leitura-6000mb-s-gravacao-4000mb-s-snv3s-1000g"
    }
  },
  { id: "i914900k", cat: "pecas", emoji: "🧠",
    nome: "Processador Intel Core i9-14900K 14ª geração",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix; Terabyte e Pichau: Pix, dados de busca)",
    precos: { terabyte: 2519.99, kabum: 2599.99, pichau: 2699.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/26259/processador-intel-core-i9-14900k-36-ghz-60ghz-turbo-14-geracao-24-cores-32-threads-lga-1700-bx8071514900k",
      kabum: "https://www.kabum.com.br/produto/497573/processador-intel-core-i9-14900k-3-2ghz-6ghz-max-turbo-cache-36mb-24-nucleos-32-threads-lga-1700-com-video-integrado-bx8071514900k",
      pichau: "https://www.pichau.com.br/processador-intel-core-i9-14900k-24-core-32-threads-3-2ghz-6-0ghz-turbo-cache-36mb-lga1700-bx8071514900k"
    }
  },
  { id: "rtx5090", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5090 32GB",
    conferido: "23/11/2026 (KaBuM!: página aberta, Gigabyte Gaming OC, Pix, vendido pela KaBuM!, link enviado pelo usuário; Pichau: ASUS TUF Gaming, Pix, dado de busca de 15/11)",
    precos: { pichau: 28000.00, kabum: 50000.00 },
    links: {
      pichau: "https://www.pichau.com.br/placa-de-video-asus-geforce-rtx-5090-tuf-gaming-32gb-gddr7-512-bit-tuf-rtx5090-32g-gaming-nac",
      kabum: "https://www.kabum.com.br/produto/713218/placa-de-video-rtx-5090-gaming-oc-32g-gigabyte-nvidia-geforce-32gb-gddr7-512bits-rgb-dlss-ray-tracing-gv-n5090gaming-oc-32gd"
    }
  },
  { id: "rtx4060", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 4060 8GB",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Gigabyte Windforce OC nas duas lojas; Terabyte: promoção)",
    precos: { terabyte: 2167.49, pichau: 2659.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/25235/placa-de-video-gigabyte-nvidia-geforce-rtx-4060-windforce-oc-8gbgddr6-dlss-ray-tracing-gv-n4060wf2oc-8gd",
      pichau: "https://www.pichau.com.br/placa-de-video-gigabyte-geforce-rtx-4060-windforce-oc-8gb-gddr6-128-bit-gv-n4060wf2oc-8gd"
    }
  },
  { id: "rtx5060", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5060 8GB",
    conferido: "15/11/2026 (marcas diferentes; Pichau: Gigabyte Windforce OC, Pix, dado de busca; KaBuM!: página aberta, ASUS Dual, Pix)",
    precos: { pichau: 2899.99, kabum: 3624.00 },
    links: {
      pichau: "https://www.pichau.com.br/placa-de-video-gigabyte-geforce-rtx-5060-windforce-oc-8gb-gddr7-128-bit-gv-n5060wf2oc-8gd",
      kabum: "https://www.kabum.com.br/produto/781225/placa-de-video-asus-dual-rtx-5060-o8g-nvidia-geforce-8gb-gddr7-2565mhz-128-bits-opengl-4-6-dlss-4-ray-tracing-dual-rtx5060-o8g"
    }
  },
  { id: "rtx5070", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5070 12GB",
    conferido: "15/11/2026 (marcas diferentes; Terabyte e Pichau: Palit White OC, Pix, dados de busca; KaBuM!: página aberta, MSI Ventus 2X OC, Pix)",
    precos: { terabyte: 3799.90, pichau: 4499.99, kabum: 6099.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/40135/placa-de-video-palit-nvidia-geforce-rtx-5070-white-oc-12gb-gddr7-dlss-ray-tracing-ne75070u19k9-gb2050w",
      pichau: "https://www.pichau.com.br/placa-de-video-palit-geforce-rtx-5070-white-oc-12gb-gddr7-192-bit-ne75070u19k9-gb2050w-nac",
      kabum: "https://www.kabum.com.br/produto/725587/placa-de-video-msi-geforce-rtx-5070-12g-ventus-2x-oc-12-gb-gddr7-28gbps-nvidia-geforce-rtx-5070-g5070-12v2c"
    }
  },
  { id: "rx7600", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo Radeon RX 7600 8GB",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; XFX Speedster Qick 308 nas duas lojas; Terabyte: promoção; Pichau: Pix)",
    precos: { terabyte: 2022.92, pichau: 2099.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/25101/placa-de-video-xfx-amd-radeon-rx-7600-speedster-qick-308-8gb-gddr6-fsr-ray-tracing-rx-76pqickby",
      pichau: "https://www.pichau.com.br/placa-de-video-xfx-radeon-rx-7600-speedster-qick308-8gb-gddr6-128-bit-rx-76pqickby"
    }
  },
  { id: "ramcorsair", cat: "pecas", emoji: "🧩",
    nome: "Memória RAM Corsair Vengeance 16GB DDR4",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix; Pichau e Terabyte: Pix, dados de busca, preços variam entre anúncios)",
    precos: { pichau: 244.99, terabyte: 339.98, kabum: 978.99 },
    links: {
      pichau: "https://www.pichau.com.br/memoria-corsair-vengeance-lpx-16gb-1x16-ddr4-2400mhz-c16-preta-cmk16gx4m1a2400c16",
      terabyte: "https://www.terabyteshop.com.br/produto/7874/memoria-ddr4-corsair-vengeance-lpx-cmk16gx4m1a2400c16-16gb-2400mhz",
      kabum: "https://www.kabum.com.br/produto/89621/memoria-ram-corsair-vengeance-lpx-16gb-2400mhz-ddr4-cl16-preto-cmk16gx4m1a2400c16"
    }
  },
  { id: "placamae", cat: "pecas", emoji: "🔧",
    nome: "Placa-Mãe Gigabyte B760M X GEN5 DDR5",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; preços no Pix; KaBuM! aparece esgotada)",
    precos: { terabyte: 849.99, pichau: 1059.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/38484/placa-mae-gigabyte-b760m-gaming-x-gen5-chipset-b760-intel-lga-1700-m-atx-ddr5",
      pichau: "https://www.pichau.com.br/placa-mae-gigabyte-b760m-gaming-x-gen5-ddr5-lga1700-m-atx-chipset-intel-b760-b760m-gaming-x-ddr5-gen5"
    }
  },
  { id: "fonte", cat: "pecas", emoji: "🔌",
    nome: "Fonte Corsair CV650 650W",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Terabyte: página com valores conflitantes; Pichau e Amazon: Pix)",
    precos: { terabyte: 416.49, pichau: 499.99, amazon: 505.40 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/16662/fonte-corsair-cv650-650w-80-plus-bronze-cp-9020236-br",
      pichau: "https://www.pichau.com.br/fonte-corsair-cv-series-cv650-80-plus-bronze-650w-cp-9020236-br",
      amazon: "https://www.amazon.com.br/Fonte-Corsair-CV650-650W-Bronze-Preto/dp/B08MBBQBRB"
    }
  },

  // ---------- Notebooks ----------
  { id: "ideapadslim3", cat: "notebooks", emoji: "💻",
    nome: "Notebook Lenovo IdeaPad Slim 3 i5-13420H 16GB 512GB SSD",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; modelo 83NS0001BR; preços no Pix; Magazine Luiza: loja oficial Lenovo)",
    precos: { carrefour: 4575.12, mercadolivre: 4672.00, magalu: 4679.10 },
    links: {
      carrefour: "https://www.carrefour.com.br/produto/notebook-lenovo-ideapad-slim-3-15irh10-intel-core-i5-13420h-16gb-512gb-ssd-windows-11-153-83ns0001br-luna-grey-334913965",
      mercadolivre: "https://www.mercadolivre.com.br/notebook-lenovo-ideapad-slim-3-15irh10-intel-core-i5-13420h-16gb-512gb-ssd-windows-11-153-83ns0001br-luna-grey/p/MLB51233306",
      magalu: "https://www.magazineluiza.com.br/notebook-lenovo-ideapad-slim-3-15irh10-intel-core-i5-13420h-16gb-512gb-ssd-windows-11-15-3-83ns0001br-luna-grey/p/ebb4eg9b77/in/leip/?seller_id=lenovooficial"
    }
  },
  { id: "nitrov15", cat: "notebooks", emoji: "💻",
    nome: "Notebook Gamer Acer Nitro V15 i5-13420H 16GB 512GB RTX 3050",
    conferido: "15/11/2026 (só achei com preço na Pichau: Linux, modelo ANV15-51-582R, dado de busca; pode estar esgotado)",
    precos: { pichau: 6499.99 },
    links: {
      pichau: "https://www.pichau.com.br/notebook-gamer-acer-nitro-v15-15-6-pol-intel-core-i5-13420h-fhd-16gb-ddr5-ssd-512gb-linux-rtx-3050-6gb-preto-anv15-51-582r"
    }
  },
  { id: "macbookairm2", cat: "notebooks", emoji: "💻",
    nome: "Notebook Apple MacBook Air 13 M2 GPU 10 núcleos 16GB 256GB",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Amazon: anúncios entre R$ 9.958,80 e R$ 11.199; Magazine Luiza: Pix)",
    precos: { amazon: 9958.80, magalu: 11779.05 },
    links: {
      amazon: "https://www.amazon.com.br/Apple-Macbook-n%C3%BAcleos-256gb-Cinza-espacial/dp/B0G5Q5WFPG",
      magalu: "https://m.magazineluiza.com.br/apple-macbook-air-13-m2-cpu-de-8-nucleos-gpu-de-10-nucleos-16gb-ram-256gb-ssd-cinza-espacial/p/ec8ac6cbe5/in/mack/"
    }
  },
  { id: "vivobook15", cat: "notebooks", emoji: "💻",
    nome: "Notebook Asus Vivobook 15 i5-1334U 8GB 512GB SSD",
    conferido: "15/11/2026 (modelo X1504VA-NJ1741, com Linux/KeepOS; dados de busca; Mercado Livre: Pix; KaBuM! aparece esgotada)",
    precos: { mercadolivre: 3127.08, amazon: 3499.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/notebook-asus-vivobook-15-x1504va-intel-core-i5-1334u-8gb-ram-512gb-ssd-linux-keepos-intel-iris-xe-tela-156-led-fhd-silver-nj1741/p/MLB50363568",
      amazon: "https://www.amazon.com.br/Notebook-ASUS-Vivobook-KeepOS-Silver/dp/B0FS2CVM1T"
    }
  },
  { id: "galaxybook4", cat: "notebooks", emoji: "💻",
    nome: "Notebook Samsung Galaxy Book4 i5 8GB 512GB SSD",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix, vendido por Magalu; Magazine Luiza: Pix, dado de busca)",
    precos: { kabum: 3778.20, magalu: 3778.20 },
    links: {
      kabum: "https://www.kabum.com.br/produto/586397/notebook-samsung-galaxy-book4-intel-core-i5-8gb-ssd-512-tela-15-6-full-hd-led-windows-11-home-grafite",
      magalu: "https://www.magazineluiza.com.br/notebook-samsung-galaxy-book4-intel-core-i5-8gb-ram-ssd-512gb-156-full-hd-windows-11-np750xgj-kg3br/p/238406900/in/nsbo/"
    }
  },

  // ---------- Wearables ----------
  { id: "galaxywatch7", cat: "wearables", emoji: "⌚",
    nome: "Smartwatch Samsung Galaxy Watch7 40mm Bluetooth",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Casas Bahia: creme, Pix, Loja Samsung Oficial; Amazon: verde, Pix; KaBuM! aparece esgotada)",
    precos: { casasbahia: 1079.10, amazon: 1272.05 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/samsung-galaxy-watch7-smartwatch-40mm-bluetooth-galaxy-ai-tela-em-cristal-de-safira-creme/p/1568122189",
      amazon: "https://www.amazon.com.br/Smartwatch-Bluetooth-Frequ%C3%AAncia-Monitoramento-Processador/dp/B0D96W9KJW"
    }
  },
  { id: "xiaomiband9", cat: "wearables", emoji: "⌚",
    nome: "Pulseira Inteligente Xiaomi Smart Band 9",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; versão global de revendedores; Mercado Livre: preto, confirmar se o link é o mesmo anúncio; Amazon: rosa)",
    precos: { mercadolivre: 349.90, amazon: 365.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/pulseira-inteligente-xiaomi-smart-band-9-preto/up/MLBU2580608375",
      amazon: "https://www.amazon.com.br/Mi-smart-band-Inteligente-inteligente-Imperme%C3%A1vel/dp/B0DF5ZSZ9H"
    }
  },
  { id: "applewatchse2", cat: "wearables", emoji: "⌚",
    nome: "Apple Watch SE 2ª Geração GPS 40mm",
    conferido: "15/11/2026 (só achei no Mercado Livre: meia-noite, dado de busca; KaBuM! aparece esgotada)",
    precos: { mercadolivre: 1890.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/apple-watch-se-2-geraco-gps-caixa-azul-meia-noite-de-aluminio-40-mm-pulseira-loop-esportiva-meia-noite/p/MLB27366071"
    }
  },
  { id: "amazfitbip5", cat: "wearables", emoji: "⌚",
    nome: "Smartwatch Amazfit Bip 5 46mm",
    conferido: "15/11/2026 (só achei página de produto com preço na Amazon: preto, dado de busca, sem confirmar estoque)",
    precos: { amazon: 405.00 },
    links: {
      amazon: "https://www.amazon.com.br/Amazfit-A2215-Bluetooth-Calling-Battery/dp/B0DHTWWHKP"
    }
  },
  { id: "forerunner55", cat: "wearables", emoji: "⌚",
    nome: "Relógio Garmin Forerunner 55 GPS",
    conferido: "15/11/2026 (só achei no Mercado Livre: azul-turquesa, dado de busca; KaBuM! aparece esgotada)",
    precos: { mercadolivre: 1250.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/relogio-garmin-forerunner-55-azul-com-monitor-cardiaco-cor-azul-turquesa/p/MLB26450709"
    }
  },

  // ---------- Casa inteligente ----------
  { id: "echodot5", cat: "casa", emoji: "🗣️",
    nome: "Echo Dot 5ª Geração com Alexa",
    conferido: "15/11/2026 (KaBuM!: página aberta, preto, Pix; Mercado Livre: branco, dado de busca, vendedor HNIMPORT)",
    precos: { mercadolivre: 398.47, kabum: 799.99 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/echo-dot-5-geraco-assistente-virtual-alexa-branco-amazon/p/MLB19795012",
      kabum: "https://www.kabum.com.br/produto/460471/echo-dot-5-geracao-amazon-com-alexa-smart-speaker-preto-b09b8vgcr8"
    }
  },
  { id: "echoshow5", cat: "casa", emoji: "🖼️",
    nome: "Echo Show 5 3ª Geração com Alexa",
    conferido: "15/11/2026 (KaBuM!: página aberta, branco, Pix, vendido por Smart New Tech Global; Magazine Luiza: Pix, dado de busca; Amazon: preto, dado de busca)",
    precos: { magalu: 799.00, amazon: 849.00, kabum: 1137.35 },
    links: {
      magalu: "https://www.magazineluiza.com.br/amazon-echo-show-5-3a-geracao-alexa-2023-smart-display-2x-mais-potentes/p/kajg0fg2g2/ci/sdis/",
      amazon: "https://www.amazon.com.br/Echo-Show-5-3%C2%AAgera%C3%A7%C3%A3o-Cor-Preta/dp/B09B2TSNNN",
      kabum: "https://www.kabum.com.br/produto/512789/echo-show-5-3-geracao-2023-display-de-5-5-polegadas-com-alexa-e-camera-de-2mp-branco"
    }
  },
  { id: "tapoc200", cat: "casa", emoji: "📷",
    nome: "Câmera de Segurança Wi-Fi TP-Link Tapo C200 360°",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix, vendido por Miranda; Amazon e Pichau: dados de busca)",
    precos: { amazon: 148.00, kabum: 228.00, pichau: 268.43 },
    links: {
      amazon: "https://www.amazon.com.br/C%C3%A2mera-Monitoramento-Tapo-C200-TP-Link/dp/B07XLML2YS",
      kabum: "https://www.kabum.com.br/produto/589747/camera-de-seguranca-wi-fi-full-hd-tapo-c200",
      pichau: "https://www.pichau.com.br/camera-de-monitoramento-360-tp-link-tapo-c200-full-hd-wi-fi-tapo-c200"
    }
  },
  { id: "smartplugpositivo", cat: "casa", emoji: "🔌",
    nome: "Tomada Inteligente Wi-Fi Positivo Smart Plug 10A",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Magazine Luiza: uma das páginas aparece indisponível; KaBuM! aparece esgotada)",
    precos: { amazon: 78.99, magalu: 132.22 },
    links: {
      amazon: "https://www.amazon.com.br/Positivo-Casa-Inteligente-eletrodom%C3%A9sticos-Compat%C3%ADvel/dp/B07S14JHF2",
      magalu: "https://www.magazineluiza.com.br/tomada-inteligente-10a-positivo-smart-home-smart-plug-wi-fi/p/040354100/cj/asoc/"
    }
  },
  { id: "lampadapositivo", cat: "casa", emoji: "💡",
    nome: "Lâmpada Inteligente Wi-Fi Positivo RGB 9W",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Casas Bahia: Pix; Amazon: preço sem a oferta para membros Prime)",
    precos: { casasbahia: 37.90, amazon: 45.23 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/smart-lampada-positivo-casa-inteligente-wi-fi-led-9w-branco-quente-e-frio-rgb-bivolt/p/55002718",
      amazon: "https://www.amazon.com.br/L%C3%A2mpada-Positivo-Casa-Inteligente-Compat%C3%ADvel/dp/B082FTRR76"
    }
  },

  // ---------- Games ----------
  { id: "ps5slim", cat: "games", emoji: "🎮",
    nome: "Console PlayStation 5 Slim com Leitor de Disco 1TB",
    conferido: "15/11/2026 (só achei página de produto com preço na Amazon: dado de busca, sem confirmar estoque)",
    precos: { amazon: 4749.90 },
    links: {
      amazon: "https://www.amazon.com.br/PlayStation-Slim-Controle-Branco-Sony/dp/B0GWNFMG5L"
    }
  },
  { id: "xboxseriess", cat: "games", emoji: "🎮",
    nome: "Console Xbox Series S 512GB Branco",
    conferido: "15/11/2026 (Carrefour: Pix, dado de busca; KaBuM!: página aberta, Pix, vendido por Mega Gifts, preço muito acima das outras lojas)",
    precos: { carrefour: 2511.00, kabum: 5199.00 },
    links: {
      carrefour: "https://www.carrefour.com.br/produto/console-microsoft-xbox-series-s-512gb-branco-ssd-313100250",
      kabum: "https://www.kabum.com.br/produto/200089/console-microsoft-xbox-series-s-512gb-branco-rrs-00006"
    }
  },
  { id: "switch2", cat: "games", emoji: "🎮",
    nome: "Console Nintendo Switch 2",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix; Amazon: modelo nacional, Pix, dado de busca; Carrefour: Pix, dado de busca)",
    precos: { amazon: 3894.05, carrefour: 4299.00, kabum: 4499.00 },
    links: {
      amazon: "https://www.amazon.com.br/Nintendo-Nacional-Port%C3%A1til-Dom%C3%A9stico-Garantia/dp/B0F6D7MQQB",
      carrefour: "https://www.carrefour.com.br/produto/console-nintendo-switch-2-modelo-nacional-de-tomada-334872677",
      kabum: "https://www.kabum.com.br/produto/777177/console-nintendo-switch-2-256gb-preto-azul-e-vermelho"
    }
  },
  { id: "dualsense", cat: "games", emoji: "🕹️",
    nome: "Controle Sem Fio PlayStation DualSense Branco",
    conferido: "15/11/2026 (KaBuM!: página aberta, Pix; Amazon: dado de busca)",
    precos: { kabum: 398.97, amazon: 399.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1032834/controle-sem-fio-sony-dualsense-playstation-5-bluetooth-branco-3005767",
      amazon: "https://www.amazon.com.br/PlayStation-DualSense-Controle-sem-fio/dp/B0CQKLS4RP"
    }
  },

  // ---------- Periféricos ----------
  { id: "g203", cat: "perifericos", emoji: "🖱️",
    nome: "Mouse Gamer Logitech G203 Lightsync RGB",
    conferido: "15/11/2026 (KaBuM!: página aberta, preto, Pix; Amazon: branco, dado de busca; Terabyte: preto, à vista, dado de busca)",
    precos: { kabum: 99.99, amazon: 102.26, terabyte: 176.79 },
    links: {
      kabum: "https://www.kabum.com.br/produto/112948/mouse-gamer-logitech-g203-lightsync-rgb-efeito-de-ondas-de-cores-6-botoes-programaveis-e-ate-8-000-dpi-preto-910-005793",
      amazon: "https://www.amazon.com.br/Logitech-LIGHTSYNC-Efeito-Bot%C3%B5es-Program%C3%A1veis/dp/B08B459R11",
      terabyte: "https://www.terabyteshop.com.br/produto/13881/mouse-gamer-logitech-g203-lightsync-rgb-6-botoes-progrmaveis-8000-dpi-black-910-005793"
    }
  },
  { id: "kumarak552", cat: "perifericos", emoji: "⌨️",
    nome: "Teclado Mecânico Gamer Redragon Kumara K552 RGB",
    conferido: "15/11/2026 (só achei página de produto com preço na Amazon: switch marrom, ABNT2, Pix, dado de busca)",
    precos: { amazon: 169.38 },
    links: {
      amazon: "https://www.amazon.com.br/Teclado-Gamer-Kumara-K552rgb-1-abnt2/dp/B078PKJB28"
    }
  },
  { id: "cloudstinger2", cat: "perifericos", emoji: "🎧",
    nome: "Headset Gamer HyperX Cloud Stinger 2",
    conferido: "15/11/2026 (KaBuM!: página aberta, preto, Pix; Amazon: preto, dado de busca)",
    precos: { kabum: 209.99, amazon: 258.81 },
    links: {
      kabum: "https://www.kabum.com.br/produto/461160/headset-gamer-hyperx-cloud-stinger-2-drivers-50mm-p3-preto-519t1aa",
      amazon: "https://www.amazon.com.br/HyperX-Cloud-Stinger-Headset-gamer/dp/B0B8PGDMWK"
    }
  },
  { id: "webcamc920", cat: "perifericos", emoji: "📹",
    nome: "Webcam Logitech C920 Full HD 1080p",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Amazon: Pix, loja Logitech)",
    precos: { amazon: 349.04, mercadolivre: 403.94 },
    links: {
      amazon: "https://www.amazon.com.br/Chamadas-Grava%C3%A7%C3%B5es-Widescreen-Logitech-Equipamentos/dp/B006JH8T3S",
      mercadolivre: "https://www.mercadolivre.com.br/webcam-logitech-c920-full-hd-1080p-com-microfone/p/MLB21848979"
    }
  },

  // ---------- Climatização ----------
  { id: "arlg12000", cat: "climatizacao", emoji: "❄️",
    nome: "Ar-Condicionado Split LG Dual Inverter 12.000 BTUs Frio",
    conferido: "15/11/2026 (só achei página de produto com preço na Amazon: 220V, dado de busca; não inclui instalação)",
    precos: { amazon: 2469.00 },
    links: {
      amazon: "https://www.amazon.com.br/Condicionado-Split-12000-Inverter-S3nq12ja31l-eb2gam1-220v/dp/B0GL9FF7Q5"
    }
  },
  { id: "arsamsung9000", cat: "climatizacao", emoji: "❄️",
    nome: "Ar-Condicionado Split Samsung Digital Inverter Ultra 9.000 BTUs Frio",
    conferido: "15/11/2026 (só achei página de produto com preço no Carrefour: 220V, Pix, dado de busca; não inclui instalação)",
    precos: { carrefour: 1798.20 },
    links: {
      carrefour: "https://www.carrefour.com.br/produto/ar-condicionado-split-samsung-digital-inverter-ultra-ai-9000-btuh-frio-ar09dyfzawknaz-220-volts-340176586"
    }
  },
  { id: "ventiladormondial", cat: "climatizacao", emoji: "🌀",
    nome: "Ventilador de Mesa Mondial Turbo 40cm 8 Pás",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; voltagens diferentes: Amazon 220V, Mercado Livre 127V; Magazine Luiza: Pix)",
    precos: { amazon: 128.48, magalu: 184.29, mercadolivre: 269.90 },
    links: {
      amazon: "https://www.amazon.com.br/Ventilador-Turbo-Velocidades-Mondial-VTX-40-8P/dp/B07Z52DPTP",
      magalu: "https://www.magazineluiza.com.br/ventilador-de-mesa-mondial-vtx-40-8p-turbo-40cm-3-velocidades/p/224370100/ar/arvm/",
      mercadolivre: "https://www.mercadolivre.com.br/ventilador-de-mesa-vtx-40-8p-turbo-8-pas-40cm-mondial-pretoprata-127v/p/MLB15714675"
    }
  },
  { id: "climatizadormondial", cat: "climatizacao", emoji: "💨",
    nome: "Climatizador de Ar Mondial CL-03",
    conferido: "15/11/2026 (dados de busca, sem confirmar estoque; Amazon: versão Flash Air, 220V; Mercado Livre: versão Fresh Air)",
    precos: { amazon: 279.90, mercadolivre: 449.00 },
    links: {
      amazon: "https://www.amazon.com.br/Climatizador-Flash-Cl-03-Mondial-220V/dp/B07XQR5LR6",
      mercadolivre: "https://www.mercadolivre.com.br/climatizador-mondial-fresh-air-cl-03-cor-brancopreto/p/MLB15457953"
    }
  }
];
const menor = p => Math.min(...Object.values(p.precos));

// Texto "em 3 lojas" mostrado nos cards
const emLojas = p => {
  const n = Object.keys(p.precos).length;
  return `<small class="em-lojas">${n === 1 ? "em 1 loja" : `em ${n} lojas`}</small>`;
};

// Foto do produto. Se o arquivo não existir, aparece o emoji.
const foto = p => `<div class="foto"><span class="foto-emoji" aria-hidden="true">${p.emoji}</span><img src="${p.img || "imagens/" + p.id + ".jpg"}" alt="${p.nome}" loading="lazy" onerror="this.remove()"></div>`;
  