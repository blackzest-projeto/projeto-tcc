const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
  { id: "casa",             nome: "Casa inteligente" }
];

// Preços de exemplo. Para adicionar um produto, copie um bloco e mude os dados.
// A foto é imagens/ID.jpg (ex.: imagens/s24.jpg). Para outro nome, use img: "imagens/outra.png".
// Para abrir a página exata do produto na loja, descomente "links" e cole os endereços.
const PRODUTOS = [
  { id: "iphone17", cat: "celulares", emoji: "📱",
    nome: "Apple iPhone 17 256GB Preto",
    conferido: "23/10/2026 (KaBuM!: vendido por parceiro; Americanas: preço da página, sem confirmar estoque)",
    precos: { kabum: 5699.00, americanas: 5699.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1016330/iphone-17-256gb-preto",
      americanas: "https://www.americanas.com.br/apple-iphone-17-256gb-preto-63--48mp-ios-5g-8362388/p"
    }
  },
  { id: "galaxys25", cat: "celulares", emoji: "📲",
    nome: "Samsung Galaxy S25 5G 256GB",
    conferido: "23/10/2026 (KaBuM!: vendido por Magalu; Americanas: preço da página, sem confirmar estoque)",
    precos: { kabum: 3999.00, americanas: 3899.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/703063/samsung-galaxy-s25-5g-dual-chip-256gb-galaxy-ai-6-2-12gb-ram-cam-tripla-50-12-10mp-bateria-4000mah-azul",
      americanas: "https://www.americanas.com.br/samsung-galaxy-s25-5g-256gb-galaxy-ai-azul-62--12gb-ram-cam--tripla-50-12-10mp-bateria-4000mah-dual-chip-8299108/p"
    }
  },
  { id: "mibox", cat: "eletronicos", emoji: "📺",
    nome: "Xiaomi Mi Box S 2ª geração 4K",
    conferido: "23/10/2026 (só achei na KaBuM!; dado de busca)",
    precos: { kabum: 599.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1060667/mi-box-s-4k-ultra-hd-2-geracao-com-google-tv-e-outros-apps-incluindo-gratuitos-versao-global"
    }
  },
  { id: "ssd1tb", cat: "pecas", emoji: "💾",
    nome: "SSD Kingston NV3 1TB M.2 NVMe PCIe 4.0",
    conferido: "22/10/2026 (Terabyte: dado de busca, pode estar desatualizado)",
    precos: { kabum: 1149.99, terabyte: 1299.90, pichau: 1084.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/621162/ssd-kingston-nv3-1-tb-m-2-2280-pcie-4-0-x4-nvme-leitura-6000-mb-s-gravacao-4000-mb-s-azul-snv3s-1000g",
      terabyte: "https://www.terabyteshop.com.br/produto/31564/ssd-kingston-nv3-1tb-m2-nvme-2280-pcie-40-leitura-6000mbs-e-gravacao-4000mbs-snv3s1000g",
      pichau: "https://www.pichau.com.br/ssd-kingston-nv3-1tb-m-2-2280-pcie-nvme-leitura-6000mb-s-gravacao-4000mb-s-snv3s-1000g"
    }
  },
  { id: "monitor", cat: "eletronicos", emoji: "🖥️",
    nome: "Monitor Gamer Samsung Odyssey G3 24 polegadas",
    conferido: "23/10/2026 (KaBuM!: vendido por parceiro; Pichau: preço de busca, sem confirmar estoque)",
    precos: { kabum: 1607.71, pichau: 1899.90 },
    links: {
      kabum: "https://www.kabum.com.br/produto/232252/monitor-gamer-samsung-odyssey-g3-24pol-full-hd-144-hz-1ms-hdmi-display-port-vga-freesync-premium-regulagem-de-altura-lf24g35tfwlxzd",
      pichau: "https://www.pichau.com.br/monitor-gamer-samsung-odyssey-g3-24-pol-va-fhd-1ms-144hz-freesync-dp-hdmi-vga-lf24g35tfwlxzd"
    }
  },

  { id: "airfryer", cat: "eletrodomesticos", emoji: "🍟",
    nome: "Air Fryer Mondial Family 4L",
    conferido: "23/10/2026 (Casas Bahia: Pix; Leroy Merlin: Pix, dado de busca; Americanas: preço da página, sem confirmar estoque)",
    precos: { casasbahia: 269.09, americanas: 249.00, leroy: 341.91 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/fritadeira-eletrica-sem-oleo-air-fryer-mondial-afn40bi-family-inox-4l-preta-inox/p/55032021",
      americanas: "https://www.americanas.com.br/air-fryer-mondial-family-afn-40-bi-preto-e-inox-4l-com-timer-8298877/p",
      leroy: "https://www.leroymerlin.com.br/fritadeira-sem-oleo-afn-40-bi-4-litros-1500w-mondial_1567790436"
    }
  },
  { id: "aspirador", cat: "eletrodomesticos", emoji: "🧹",
    nome: "Aspirador de Pó Vertical Electrolux PowerSpeed Plus",
    conferido: "23/10/2026 (Casas Bahia: vendido por parceiro; Leroy Merlin: dado de busca)",
    precos: { casasbahia: 349.00, leroy: 209.90 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/aspirador-de-po-electrolux-powerspeed-plus-stk14-16l-127v/p/1545953559",
      leroy: "https://www.leroymerlin.com.br/aspirador-vertical-com-fio-electrolux-powerspeed-plus-2-em-1--stk14--127v_1567564150"
    }
  },
  { id: "geladeira", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Brastemp Frost Free Duplex 375L",
    conferido: "22/10/2026 (Americanas: preço lido da página, sem confirmar estoque)",
    precos: { casasbahia: 3199.00, americanas: 2071.91, leroy: 2770.24 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/geladeira-brastemp-frost-free-duplex-brm44hb-com-compartimento-extrafrio-fresh-zone-branca-375l/p/12731686",
      americanas: "https://www.americanas.com.br/geladeira-brastemp-375-litros-frost-free-duplex-branco-brm44hb-220v-173b869f134f5194/p",
      leroy: "https://www.leroymerlin.com.br/geladeira-brastemp-220v-frost-free-branco-duplex-375-litros-brm44hbana_1545239702"
    }
  },
  { id: "lavadora", cat: "eletrodomesticos", emoji: "🧺",
    nome: "Lavadora de Roupas Electrolux 11kg",
    conferido: "23/10/2026 (Americanas: preço lido da página, sem confirmar estoque)",
    precos: { casasbahia: 1649.00, americanas: 1649.00, leroy: 1649.00 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/lavadora-de-roupas-electrolux-11kg-les11-essencial-care-com-filtro-pega-fiapos-branca/p/1571299293",
      americanas: "https://www.americanas.com.br/maquina-de-lavar-electrolux-11kg-essencial-care-branco-les11-220v-17z3954t68965m47/p",
      leroy: "https://www.leroymerlin.com.br/lavadora-de-roupas-electrolux-11kg-les11_1567032604"
    }
  },
  { id: "lavadora15", cat: "eletrodomesticos", emoji: "🫧",
    nome: "Lavadora de Roupas Electrolux 15kg",
    conferido: "23/10/2026 (Americanas: preço lido da página; confirme voltagem e estoque)",
    precos: { leroy: 1899.00, americanas: 1899.00 },
    links: {
      leroy: "https://www.leroymerlin.com.br/maquina-de-lavar-electrolux-15kg-branca-essential-care-com-cesto-inox-e-jet-clean--led15--220v_1572274847",
      americanas: "https://www.americanas.com.br/maquina-de-lavar-electrolux-15kg-branca-essential-care-com-cesto-inox-e-jet-clean-led15--k17m38a690774924/p"
    }
  },
    { id: "i914900k", cat: "pecas", emoji: "🧠",
    nome: "Processador Intel Core i9-14900K 14ª geração",
    conferido: "29/10/2026 (preços do Pix lidos de resultados de busca; podem ter mudado)",
    precos: { kabum: 2898.00, terabyte: 2898.90, pichau: 2897.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/497573/processador-intel-core-i9-14900k-3-2ghz-6ghz-max-turbo-cache-36mb-24-nucleos-32-threads-lga-1700-com-video-integrado-bx8071514900k",
      terabyte: "https://www.terabyteshop.com.br/produto/26259/processador-intel-core-i9-14900k-36-ghz-60ghz-turbo-14-geracao-24-cores-32-threads-lga-1700-bx8071514900k",
      pichau: "https://www.pichau.com.br/processador-intel-core-i9-14900k-24-core-32-threads-3-2ghz-5-8ghz-turbo-cache-36mb-lga1700-bx8071514900k"
    }
  },
   { id: "rtx5090", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5090 32GB",
    conferido: "01/11/2026 (KaBuM!: página aberta, modelo ASUS; Terabyte: modelo Zotac, preço informado por você)",
    precos: { kabum: 49999.99, terabyte: 41999.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1052409/placa-de-video-rtx-5090-rog-astral-asus-32gb-gddr7-argb-90yv0nf3-m0na00",
      terabyte: "https://www.terabyteshop.com.br/produto/42587/placa-de-video-zotac-nvidia-geforce-rtx-5090-solid-3x-oc-32gb-gddr7-dlss-ray-tracing-zt-b50900j-10p"
    }
  }, 
   { id: "ramcorsair", cat: "pecas", emoji: "🧩",
    nome: "Memória RAM Corsair Vengeance LPX 16GB 2400MHz DDR4",  
    conferido: "31/10/2026 (KaBuM!: página aberta; Amazon: preço informado por você)",
    precos: { kabum: 1029.99, amazon: 1630.60 },
    links: {
      kabum: "https://www.kabum.com.br/produto/89621/memoria-ram-corsair-vengeance-lpx-16gb-2400mhz-ddr4-cl16-preto-cmk16gx4m1a2400c16",
      amazon: "https://www.amazon.com.br/Mem%C3%B3ria-2400MHZ-Corsair-Vengeance-CMK16GX4M1A2400C16/dp/B01K3LTX8U"
    }
  },
    { id: "placamae", cat: "pecas", emoji: "🔧",
    nome: "Placa-Mãe Gigabyte B760M X GEN5 DDR5",
    conferido: "31/10/2026 (dados de busca: KaBuM! com estoque; Terabyte com dado de cerca de 75 dias)",
    precos: { kabum: 1127.99, terabyte: 1069.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/914298/placa-mae-gigabyte-b760m-gaming-x-gen5-intel-lga-1700-matx-ddr5-pcie-5-0-b760m-gaming-x-gen5",
      terabyte: "https://www.terabyteshop.com.br/produto/38484/placa-mae-gigabyte-b760m-gaming-x-gen5-chipset-b760-intel-lga-1700-m-atx-ddr5"
    }
  },
  { id: "fonte", cat: "pecas", emoji: "🔌",
    nome: "Fonte Corsair CV650 650W",
    conferido: "31/10/2026 (só achei com estoque na Pichau; KaBuM! e Terabyte aparecem esgotadas)",
    precos: { pichau: 499.99 },
    links: {
      pichau: "https://www.pichau.com.br/fonte-corsair-cv-series-cv650-80-plus-bronze-650w-cp-9020236-br"
    }
  },
    { id: "tvtcl55", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV TCL 55 polegadas QLED 4K",
    conferido: "01/11/2026 (Magazine Luiza: Pix, vendido por Negociun Oficial; Fast Shop e Mercado Livre: preços informados por você)",
    precos: { magalu: 2558.40, fastshop: 2629.00, mercadolivre: 3941.01 },
    links: {
      magalu: "https://www.magazineluiza.com.br/smart-tv-tcl-55-polegadas-55p7l-qled-4k-p7l-wifi-bluetooth-google-tv-hdr10-120-hz-vrr-aipq/p/ka4k9a9e4c/et/elit/?seller_id=negociunoficial",
      fastshop: "https://site.fastshop.com.br/smart-tv-4k-tcl-advanced-qled-55%E2%80%9D-polegadas-com-processador-aipq--dolby-vision---hdr10--e-wi-fi---55p7l-tk55p7lpto_prd-170665/p",
      mercadolivre: "https://www.mercadolivre.com.br/smart-tv-tcl-qled-55-polegadas-4k-wifi-google-tv-55p7l/up/MLBU4045274047"
    }
  }, 
   { id: "edge60fusion", cat: "celulares", emoji: "📱",
    nome: "Smartphone Motorola Edge 60 Fusion 5G",
    conferido: "01/11/2026 (preços informados por você)",
    precos: { amazon: 1999.00, carrefour: 2249.98, shopee: 2155.87 },
    links: {
      amazon: "https://www.amazon.com.br/Smartphone-Motorola-Edge-60-Fusion/dp/B0F1HP5JJM",
      carrefour: "https://www.carrefour.com.br/produto/smartphone-motorola-edge-60-fusion-5g-256gb-8gb-ram-tela-67-camera-50mp-selfie-32mp-cinza-334202001",
      shopee: "https://shopee.com.br/Smartphone-Motorola-Edge-60-Fusion-5G-256GB-8GB-RAM-16GB-Ram-Boost-moto-AI-50MP-Sony-Camera-i.1627665738.22494653859"
    }
  },
  { id: "galaxya56", cat: "celulares", emoji: "📲",
    nome: "Samsung Galaxy A56 5G 256GB",
    conferido: "02/11/2026 (KaBuM!: página aberta, preto, vendido por J&J; Magazine Luiza: cinza, Pix, dado de busca; Carrefour: dado de busca)",
    precos: { kabum: 3199.99, magalu: 2609.10, carrefour: 2430.53 },
    links: {
      kabum: "https://www.kabum.com.br/produto/729973/celular-samsung-galaxy-a56-5g-256gb-8gb-ram-camera-50mp-ip67-super-amoled-6-7-recursos-ai-preto",
      magalu: "https://www.magazineluiza.com.br/smartphone-samsung-galaxy-a56-256gb-5g-8gb-ram-cinza-67-cam-tripla-selfie-12mp/p/240097600/te/ga56/",
      carrefour: "https://www.carrefour.com.br/smartphone-samsung-galaxy-a56-5g-256gb-8gb-ram-camera-tripla-ate-50mp-tela-super-amoled-6-7-ip67-nfc-mp951652313/p"
    }
  },
  { id: "razr60", cat: "celulares", emoji: "📱",
    nome: "Motorola Razr 60 5G 256GB Dobrável",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Amazon: preço do Oficina da Net; Casas Bahia e Carrefour: Pix; KaBuM! aparece esgotada)",
    precos: { amazon: 3299.00, casasbahia: 3399.15, carrefour: 3599.10 },
    links: {
      amazon: "https://www.amazon.com.br/Smartphone-Motorola-60-256GB-dobr%C3%A1vel-externa/dp/B0F8LJSC9B",
      casasbahia: "https://www.casasbahia.com.br/smartphone-motorola-razr-60-256gb-24gb-12gb-ram-12gb-ram-boost-tela-dobravel-69-quot-poled-e-externa-36-moto-ai-camera-ip48/p/1572113554",
      carrefour: "https://www.carrefour.com.br/motorola-smartphone-motorola-razr-60-5g-mp951839768/p"
    }
  },
  { id: "jbl520bt", cat: "eletronicos", emoji: "🎧",
    nome: "Fone de Ouvido JBL Tune 520BT Bluetooth",
    conferido: "02/11/2026 (KaBuM!: página aberta, azul, Pix, vendido por Efacini; Pichau: azul, Pix, dado de busca; Amazon: roxo, dado de busca)",
    precos: { kabum: 239.40, pichau: 239.99, amazon: 269.00 },
    links: {
      kabum: "https://www.kabum.com.br/produto/474932/fone-de-ouvido-jbl-tune-520bt-bluetooth-ate-57hrs-app-comando-de-voz-azul-jblt520bt",
      pichau: "https://www.pichau.com.br/fone-de-ouvido-jbl-tune-520bt-wireless-azul-jblt520btblu",
      amazon: "https://www.amazon.com.br/Fone-Ouvido-Bluetooth-JBL-520BT/dp/B0C6STQ1BJ"
    }
  },
  { id: "jblgo4", cat: "eletronicos", emoji: "🔊",
    nome: "Caixa de Som Bluetooth JBL Go 4",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; preto; Mercado Livre: Pix)",
    precos: { mercadolivre: 243.46, amazon: 275.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/jbl-caixa-de-som-go-4-black-prova-dagua-jblgo4blk-cor-preto/p/MLB36386053",
      amazon: "https://www.amazon.com.br/JBL-Alto-falante-ultraport%C3%A1til-imperme%C3%A1vel-profissional/dp/B0CTNWBT1Z"
    }
  },
  { id: "hwc400", cat: "eletronicos", emoji: "🔉",
    nome: "Soundbar Samsung HW-C400 2.0 Canais",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Carrefour: Pix; Americanas: canal Americanas Empresas)",
    precos: { carrefour: 1135.64, mercadolivre: 1199.00, americanas: 1264.84 },
    links: {
      carrefour: "https://www.carrefour.com.br/produto/barra-de-som-samsung-hw-c00-0-canais-0w-com-woofer-embutido-333158350",
      mercadolivre: "https://produto.mercadolivre.com.br/MLB-3862333731-soundbar-samsung-hw-c400-bluetooth-usb-preto-_JM",
      americanas: "https://empresas.americanas.com.br/produto/7513263360/samsung-barra-som-hdmi-bluetooth-hw-c400-2-0-canais-preta"
    }
  },
  { id: "sonyxm5", cat: "eletronicos", emoji: "🎧",
    nome: "Fone de Ouvido Sony WH-1000XM5",
    conferido: "02/11/2026 (KaBuM!: página aberta, prateado, Pix, vendido por Victory; Magazine Luiza: preto, Pix, dado de busca)",
    precos: { kabum: 2499.99, magalu: 2609.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/1064542/sony-fones-de-ouvido-wh-1000xm5-premium-com-cancelamento-de-ruido-bateria-de-30-horas-prateado",
      magalu: "https://www.magazineluiza.com.br/fone-de-ouvido-sony-bluetooth-wh-1000xm5-over-ear-cancelamento-de-ruido-preto-wh-1000xm5-b/p/gh0aa2ek54/ea/fobt/"
    }
  },
  { id: "tvsamsung50", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV Samsung 50 polegadas Crystal UHD 4K U8600F",
    conferido: "02/11/2026 (KaBuM!: página aberta, Pix, vendido por Raro Casa e Decor; Carrefour: Pix, dado de busca; Amazon: dado de busca, outra página mostrou R$ 2.096,10 no Pix)",
    precos: { carrefour: 2374.05, amazon: 2580.00, kabum: 3479.00 },
    links: {
      carrefour: "https://www.carrefour.com.br/samsung-smart-tv-50-crystal-uhd-4k-u8600f-2025-xbox-cloud-gaming-ai-energy-mode-alexa-integrada-3648583/p",
      amazon: "https://www.amazon.com.br/Samsung-Smart-Crystal-U8600F-2025/dp/B0F5X4LL89",
      kabum: "https://www.kabum.com.br/produto/871638/samsung-smart-tv-50-crystal-uhd-4k-u8600f-2025-xbox-cloud-gaming-canais-gratuitos-alexa-50-"
    }
  },
  { id: "ideapadslim3", cat: "notebooks", emoji: "💻",
    nome: "Notebook Lenovo IdeaPad Slim 3 i5-13420H 16GB 512GB SSD",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; modelo 83NS0001BR; Carrefour: Pix; KaBuM! aparece esgotada)",
    precos: { carrefour: 3695.12, mercadolivre: 4999.00 },
    links: {
      carrefour: "https://www.carrefour.com.br/notebook-lenovo-ideapad-slim-3-15irh10-intel-core-i5-13420h-16gb-512gb-ssd-windows-11-15-3-83ns0001b-mp952042127/p",
      mercadolivre: "https://www.mercadolivre.com.br/notebook-lenovo-ideapad-slim-3-15irh10-intel-core-i5-13420h-16gb-512gb-ssd-windows-11-153-83ns0001br-luna-grey/p/MLB51233306"
    }
  },
  { id: "nitrov15", cat: "notebooks", emoji: "💻",
    nome: "Notebook Gamer Acer Nitro V15 i5-13420H 16GB 512GB RTX 3050",
    conferido: "02/11/2026 (só achei com preço na Pichau: Pix, Linux, modelo ANV15-51-582R, dado de busca; KaBuM! aparece esgotada)",
    precos: { pichau: 6499.99 },
    links: {
      pichau: "https://www.pichau.com.br/notebook-gamer-acer-nitro-v15-15-6-pol-intel-core-i5-13420h-fhd-16gb-ddr5-ssd-512gb-linux-rtx-3050-6gb-preto-anv15-51-582r"
    }
  },
  { id: "galaxywatch7", cat: "wearables", emoji: "⌚",
    nome: "Smartwatch Samsung Galaxy Watch7 40mm Bluetooth",
    conferido: "02/11/2026 (KaBuM!: página aberta, Pix, vendido por Shopnext; Casas Bahia: creme, Pix, dado de busca; Amazon: verde, Pix, dado de busca)",
    precos: { casasbahia: 1079.10, amazon: 1272.05, kabum: 1719.07 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/samsung-galaxy-watch7-smartwatch-40mm-bluetooth-galaxy-ai-tela-em-cristal-de-safira-creme/p/1568122189",
      amazon: "https://www.amazon.com.br/Smartwatch-Bluetooth-Frequ%C3%AAncia-Monitoramento-Processador/dp/B0D96W9KJW",
      kabum: "https://www.kabum.com.br/produto/614211/samsung-galaxy-watch7-smartwatch-40mm-bluetooth-galaxy-ai-tela-em-cristal-de-safira"
    }
  },
  { id: "xiaomiband9", cat: "wearables", emoji: "⌚",
    nome: "Pulseira Inteligente Xiaomi Smart Band 9",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; versão global de revendedores; Mercado Livre: preto; Amazon: rosa)",
    precos: { mercadolivre: 362.20, amazon: 365.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/smartwatch-xiaomi-mi-band-9-tela-162-amoled-preto-desenho-da-pulseira-sport/p/MLB39425855",
      amazon: "https://www.amazon.com.br/Mi-smart-band-Inteligente-inteligente-Imperme%C3%A1vel/dp/B0DF5ZSZ9H"
    }
  },
  { id: "echodot5", cat: "casa", emoji: "🗣️",
    nome: "Echo Dot 5ª Geração com Alexa",
    conferido: "02/11/2026 (KaBuM!: página aberta, preto, Pix; Mercado Livre: branco, dado de busca; Magazine Luiza: Pix, dado de busca; Fast Shop aparece indisponível)",
    precos: { mercadolivre: 398.00, magalu: 406.51, kabum: 499.90 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/echo-dot-5-geraco-assistente-virtual-alexa-branco-amazon/p/MLB19795012",
      magalu: "https://www.magazineluiza.com.br/echo-dot-5a-geracao-smart-speaker-com-alexa/p/237395500/ci/sscs/",
      kabum: "https://www.kabum.com.br/produto/460471/echo-dot-5-geracao-amazon-com-alexa-smart-speaker-preto-b09b8vgcr8"
    }
  },
  { id: "tapoc200", cat: "casa", emoji: "📷",
    nome: "Câmera de Segurança Wi-Fi TP-Link Tapo C200 360°",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Pichau: Pix; KaBuM! aparece esgotada)",
    precos: { amazon: 156.00, pichau: 268.43 },
    links: {
      amazon: "https://www.amazon.com.br/C%C3%A2mera-Monitoramento-Tapo-C200-TP-Link/dp/B07XLML2YS",
      pichau: "https://www.pichau.com.br/camera-de-monitoramento-360-tp-link-tapo-c200-full-hd-wi-fi-tapo-c200"
    }
  },
  { id: "macbookairm2", cat: "notebooks", emoji: "💻",
    nome: "Notebook Apple MacBook Air 13 M2 GPU 10 núcleos 16GB 256GB",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Magazine Luiza: Pix; Fast Shop aparece indisponível)",
    precos: { amazon: 9958.80, magalu: 11779.05 },
    links: {
      amazon: "https://www.amazon.com.br/Apple-Macbook-n%C3%BAcleos-256gb-Cinza-espacial/dp/B0G5Q5WFPG",
      magalu: "https://m.magazineluiza.com.br/apple-macbook-air-13-m2-cpu-de-8-nucleos-gpu-de-10-nucleos-16gb-ram-256gb-ssd-cinza-espacial/p/ec8ac6cbe5/in/mack/"
    }
  },
  { id: "vivobook15", cat: "notebooks", emoji: "💻",
    nome: "Notebook Asus Vivobook 15 i5-1334U 8GB 512GB SSD",
    conferido: "02/11/2026 (modelo X1504VA-NJ1741, com Linux/KeepOS; KaBuM!: página aberta, Pix, vendido por Loja Asus; Mercado Livre: Pix, dado de busca; Amazon: dado de busca)",
    precos: { mercadolivre: 3127.08, amazon: 3399.00, kabum: 3484.15 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/notebook-asus-vivobook-15-x1504va-intel-core-i5-1334u-8gb-ram-512gb-ssd-linux-keepos-intel-iris-xe-tela-156-led-fhd-silver-nj1741/p/MLB50363568",
      amazon: "https://www.amazon.com.br/Notebook-ASUS-Vivobook-KeepOS-Silver/dp/B0FS2CVM1T",
      kabum: "https://www.kabum.com.br/produto/877778/notebook-asus-vivobook-15-x1504va-intel-core-i5-1334u-8gb-ram-512gb-ssd-linux-keepos-intel-iris-xe-tela-15-6-led-fhd-silver-nj1741"
    }
  },
  { id: "galaxybook4", cat: "notebooks", emoji: "💻",
    nome: "Notebook Samsung Galaxy Book4 i5 8GB 512GB SSD",
    conferido: "02/11/2026 (KaBuM!: página aberta, Pix, vendido por Magalu; Amazon: dado de busca; Magazine Luiza: Pix, dado de busca)",
    precos: { kabum: 3860.10, amazon: 3860.18, magalu: 3959.10 },
    links: {
      kabum: "https://www.kabum.com.br/produto/586397/notebook-samsung-galaxy-book4-intel-core-i5-8gb-ssd-512-tela-15-6-full-hd-led-windows-11-home-grafite",
      amazon: "https://www.amazon.com.br/Notebook-Samsung-Galaxy-Book4-NP750XGJ-KG3BR/dp/B0D4NRBBMR",
      magalu: "https://www.magazineluiza.com.br/notebook-samsung-galaxy-book4-intel-core-i5-8gb-ram-ssd-512gb-156-full-hd-windows-11-np750xgj-kg3br/p/238406900/in/nsbo/"
    }
  },
  { id: "applewatchse2", cat: "wearables", emoji: "⌚",
    nome: "Apple Watch SE 2ª Geração GPS 40mm",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Mercado Livre: estelar; Carrefour: meia-noite, Pix; KaBuM! aparece esgotada)",
    precos: { mercadolivre: 1849.00, carrefour: 2159.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/apple-watch-se-2-geraco-gps-caixa-e-pulseira-estelar-aluminio-40mm-loop-esportiva/p/MLB27296301",
      carrefour: "https://www.carrefour.com.br/smartwatch-apple-watch-se-2-geracao-40mm-caixa-aluminio-mp937463002/p"
    }
  },
  { id: "amazfitbip5", cat: "wearables", emoji: "⌚",
    nome: "Smartwatch Amazfit Bip 5 46mm",
    conferido: "02/11/2026 (só achei página de produto com preço na Amazon: preto, dado de busca, sem confirmar estoque)",
    precos: { amazon: 405.00 },
    links: {
      amazon: "https://www.amazon.com.br/Amazfit-A2215-Bluetooth-Calling-Battery/dp/B0DHTWWHKP"
    }
  },
  { id: "forerunner55", cat: "wearables", emoji: "⌚",
    nome: "Relógio Garmin Forerunner 55 GPS",
    conferido: "02/11/2026 (KaBuM!: página aberta, preto, Pix, vendido por Foto Centro; Mercado Livre: azul-turquesa, dado de busca)",
    precos: { mercadolivre: 1250.00, kabum: 1359.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/relogio-garmin-forerunner-55-azul-com-monitor-cardiaco-cor-azul-turquesa/p/MLB26450709",
      kabum: "https://www.kabum.com.br/produto/736657/relogio-garmin-forerunner-55-preto-"
    }
  },
  { id: "echoshow5", cat: "casa", emoji: "🖼️",
    nome: "Echo Show 5 3ª Geração com Alexa",
    conferido: "02/11/2026 (KaBuM!: página aberta, branco, Pix, vendido por Smart New Tech Global; Carrefour: preto, Pix, dado de busca, confirmar se o link é o mesmo anúncio; Amazon: preto, dado de busca)",
    precos: { carrefour: 798.30, amazon: 849.00, kabum: 1137.35 },
    links: {
      carrefour: "https://www.carrefour.com.br/alexa-echo-show-5-3-geracao-amazon-com-alexa-alto-falante-de-44mm-preto-b09b2tsnnn-mp940701112/p",
      amazon: "https://www.amazon.com.br/Echo-Show-5-3%C2%AAgera%C3%A7%C3%A3o-Cor-Preta/dp/B09B2TSNNN",
      kabum: "https://www.kabum.com.br/produto/512789/echo-show-5-3-geracao-2023-display-de-5-5-polegadas-com-alexa-e-camera-de-2mp-branco"
    }
  },
  { id: "smartplugpositivo", cat: "casa", emoji: "🔌",
    nome: "Tomada Inteligente Wi-Fi Positivo Smart Plug 10A",
    conferido: "02/11/2026 (KaBuM!: página aberta, Pix, vendido por Dacasa; Amazon: Pix, dado de busca, poucas unidades; Carrefour: Pix, dado de busca; Magazine Luiza: dado de busca)",
    precos: { amazon: 49.11, carrefour: 109.16, kabum: 125.13, magalu: 132.22 },
    links: {
      amazon: "https://www.amazon.com.br/Positivo-Casa-Inteligente-eletrodom%C3%A9sticos-Compat%C3%ADvel/dp/B07S14JHF2",
      carrefour: "https://www.carrefour.com.br/produto/tomada-inteligente-positivo-smart-plug-wi-fi-0a000w-327376904",
      kabum: "https://www.kabum.com.br/produto/127174/smart-plug-wi-fi-positivo-para-smartphones",
      magalu: "https://www.magazineluiza.com.br/tomada-inteligente-10a-positivo-smart-home-smart-plug-wi-fi/p/040354100/cj/asoc/"
    }
  },
  { id: "lampadapositivo", cat: "casa", emoji: "💡",
    nome: "Lâmpada Inteligente Wi-Fi Positivo RGB 9W",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Casas Bahia: Pix, preço pode ser promoção pontual; Amazon: vendido por Clicou Tech)",
    precos: { casasbahia: 37.90, amazon: 77.90 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/smart-lampada-positivo-casa-inteligente-wi-fi-led-9w-branco-quente-e-frio-rgb-bivolt/p/55002718",
      amazon: "https://www.amazon.com.br/L%C3%A2mpada-Positivo-Casa-Inteligente-Compat%C3%ADvel/dp/B082FTRR76"
    }
  },
  { id: "tvlg55", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV LG 55 polegadas 4K UHD 55UA8550PSA",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Mercado Livre: preço varia muito entre vendedores)",
    precos: { mercadolivre: 2499.00, magalu: 2898.00 },
    links: {
      mercadolivre: "https://www.mercadolivre.com.br/smart-tv-lg-uhd-ai-ua85-55-polegadas-hdr10-pro-processador-7-ai-ger-8-webos-25/p/MLB51481327",
      magalu: "https://www.magazineluiza.com.br/smart-tv-55-lg-4k-ultra-hd-55ua8550psa-webos-25-ai-processor-4k-gen8-com-alexa-3-hdmi/p/240243300/et/tv4k/?seller_id=magazineluiza"
    }
  },
  { id: "tvtcl43", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV TCL 43 polegadas Full HD 43S5400A",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Magazine Luiza: Pix; KaBuM! aparece esgotada)",
    precos: { magalu: 1614.05, amazon: 1699.00 },
    links: {
      magalu: "https://www.magazineluiza.com.br/smart-tv-43-full-hd-led-tcl-43s5400a-android-wi-fi-bluetooth-google-assistente-2-hdmi-1-usb/p/237862800/et/tves/",
      amazon: "https://www.amazon.com.br/TCL-LED-SMART-S5400A-ANDROID/dp/B0CC6P9DJJ"
    }
  },
  { id: "tvphilips50", cat: "eletronicos", emoji: "📺",
    nome: "Smart TV Philips 50 polegadas 4K UHD 50PUG7019",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque)",
    precos: { casasbahia: 2429.13, amazon: 2829.90 },
    links: {
      casasbahia: "https://www.casasbahia.com.br/smart-tv-philips-50-4k-uhd-google-tv-dolby-audio-50pug7019-78/p/1569834073",
      amazon: "https://www.amazon.com.br/Philips-50PUG7019-78-Google-Comando/dp/B0DFRSDH9P"
    }
  },
  { id: "rtx4060", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 4060 8GB",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; preços à vista, em promoção)",
    precos: { terabyte: 2167.49, pichau: 2659.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/25235/placa-de-video-gigabyte-nvidia-geforce-rtx-4060-windforce-oc-8gbgddr6-dlss-ray-tracing-gv-n4060wf2oc-8gd",
      pichau: "https://www.pichau.com.br/placa-de-video-gigabyte-geforce-rtx-4060-windforce-oc-8gb-gddr6-128-bit-gv-n4060wf2oc-8gd"
    }
  },
  { id: "rtx5060", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5060 8GB",
    conferido: "02/11/2026 (marcas diferentes; Pichau: Gigabyte Windforce, dado de busca; Terabyte: Gigabyte Gaming OC V2, dado de busca; KaBuM!: página aberta, ASUS Dual, Pix)",
    precos: { pichau: 2599.99, terabyte: 2899.99, kabum: 3059.99 },
    links: {
      pichau: "https://www.pichau.com.br/placa-de-video-gigabyte-geforce-rtx-5060-windforce-8gb-gddr7-128-bit-gv-n5060wf2-8gd",
      terabyte: "https://www.terabyteshop.com.br/produto/43023/placa-de-video-gigabyte-nvidia-geforce-rtx-5060-gaming-oc-v2-8gb-gddr7-dlss-ray-tracing-gv-n5060gaming-ocv2-8gd",
      kabum: "https://www.kabum.com.br/produto/781225/placa-de-video-asus-dual-rtx-5060-o8g-nvidia-geforce-8gb-gddr7-2565mhz-128-bits-opengl-4-6-dlss-4-ray-tracing-dual-rtx5060-o8g"
    }
  },
  { id: "rtx5070", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo GeForce RTX 5070 12GB",
    conferido: "02/11/2026 (marcas diferentes; KaBuM!: página aberta, MSI Ventus 2X OC, Pix; Terabyte: Palit White OC, dado de busca; Pichau: Gigabyte Gaming OC, Pix, dado de busca)",
    precos: { kabum: 5499.99, terabyte: 6199.90, pichau: 6199.99 },
    links: {
      kabum: "https://www.kabum.com.br/produto/725587/placa-de-video-msi-geforce-rtx-5070-12g-ventus-2x-oc-12-gb-gddr7-28gbps-nvidia-geforce-rtx-5070-g5070-12v2c",
      terabyte: "https://www.terabyteshop.com.br/produto/40135/placa-de-video-palit-nvidia-geforce-rtx-5070-white-oc-12gb-gddr7-dlss-ray-tracing-ne75070u19k9-gb2050w",
      pichau: "https://www.pichau.com.br/placa-de-video-gigabyte-geforce-rtx-5070-gaming-oc-12gb-gddr7-192-bit-gv-n5070gaming-oc-12gd"
    }
  },
  { id: "rx7600", cat: "pecas", emoji: "🎮",
    nome: "Placa de Vídeo Radeon RX 7600 8GB",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Pichau: Pix; KaBuM! só achei modelo Gigabyte, esgotado)",
    precos: { terabyte: 2022.92, pichau: 2099.99 },
    links: {
      terabyte: "https://www.terabyteshop.com.br/produto/25101/placa-de-video-xfx-amd-radeon-rx-7600-speedster-qick-308-8gb-gddr6-fsr-ray-tracing-rx-76pqickby",
      pichau: "https://www.pichau.com.br/placa-de-video-xfx-radeon-rx-7600-speedster-qick308-8gb-gddr6-128-bit-rx-76pqickby"
    }
  },
  { id: "geladeiraconsul", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Consul Frost Free Duplex 377L CRM44MB",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Amazon: Pix; Carrefour: 110V, Pix; Leroy Merlin: 220V, Pix)",
    precos: { amazon: 2298.98, carrefour: 2599.00, leroy: 2631.06 },
    links: {
      amazon: "https://www.amazon.com.br/Geladeira-Consul-Litros-Duplex-CRM44MB/dp/B0FTLJNR7L",
      carrefour: "https://www.carrefour.com.br/geladeira-consul-crm44mb-duplex-377-litros-tecnologia-inverter-frost-free-branca-110v-3997189/p",
      leroy: "https://www.leroymerlin.com.br/geladeira-frost-free-duplex-consul-377-litros-branca-crm44mb-220v_1572604385"
    }
  },
  { id: "geladeiraelectrolux", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Electrolux Frost Free Duplex 431L TF55",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; 220V; Magazine Luiza: Pix)",
    precos: { magalu: 3559.00, mercadolivre: 3843.33 },
    links: {
      magalu: "https://m.magazineluiza.com.br/geladeira-top-freezer-electrolux-431-litros-frost-free-branco-tf55-220v/p/dj9j86587a/ed/ref2/",
      mercadolivre: "https://www.mercadolivre.com.br/geladeira-electrolux-frost-free-431l-duplex-branca-tf55-220v/p/MLB15949890"
    }
  },
  { id: "geladeirapanasonic", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Panasonic Frost Free 425L NR-BB53",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; cores diferentes; Americanas: branca, Pix; Mercado Livre e Magazine Luiza: aço)",
    precos: { americanas: 3842.17, mercadolivre: 4443.33, magalu: 4844.00 },
    links: {
      americanas: "https://www.americanas.com.br/produto/2449594865/geladeira-panasonic-frost-free-425l-nr-bb53pv3w-branco",
      mercadolivre: "https://www.mercadolivre.com.br/geladeira-inverter-frost-free-panasonic-nr-bb53pv3-aco-inoxidavel-com-freezer-425l/p/MLB15223031",
      magalu: "https://www.magazineluiza.com.br/geladeira-panasonic-frost-free-425l-a-aco-escovado-nr-bb53pv3x/p/jdbckh69be/ed/rinv/"
    }
  },
  { id: "geladeirasamsung", cat: "eletrodomesticos", emoji: "🧊",
    nome: "Geladeira Samsung Frost Free Inverter Duplex 460L",
    conferido: "02/11/2026 (dados de busca, sem confirmar estoque; Inox Look; Magazine Luiza: à vista; Mercado Livre: confirmar se o link é o mesmo anúncio)",
    precos: { magalu: 4139.10, mercadolivre: 4453.60 },
    links: {
      magalu: "https://www.magazineluiza.com.br/geladeira-refrigerador-samsung-frost-free-duplex-460l-rt46k6a4ks9-fz/p/013091200/ed/ref2/",
      mercadolivre: "https://www.mercadolivre.com.br/geladeira-inverter-frost-free-samsung-rt46k6a4k-inox-look-com-freezer-460l-127v220v/p/MLB17467333"
    }
  },
  

];
const menor = p => Math.min(...Object.values(p.precos));

// Foto do produto. Se o arquivo não existir, aparece o emoji.
const foto = p => `<div class="foto"><span class="foto-emoji" aria-hidden="true">${p.emoji}</span><img src="${p.img || "imagens/" + p.id + ".jpg"}" alt="${p.nome}" loading="lazy" onerror="this.remove()"></div>`;