// Descrição de cada produto, mostrada na página do produto, abaixo dos preços.
// A chave é o id do produto em dados.js. Ao cadastrar um produto novo, adicione uma linha aqui.
const DESCRICOES = {
  // Celulares
  iphone17: "O iPhone 17 traz tela Super Retina XDR de 6,3 polegadas com taxa de atualização de até 120 Hz e chip A19. O conjunto de câmeras de 48 MP e os 256 GB de armazenamento atendem bem quem fotografa, grava vídeos e guarda muitos arquivos no aparelho.",
  galaxys25: "O Galaxy S25 é um smartphone compacto de 6,2 polegadas com 12 GB de RAM, 256 GB de armazenamento e recursos de Galaxy AI. Conta com câmera tripla de 50 MP + 12 MP + 10 MP, bateria de 4.000 mAh e conexão 5G.",
  edge60fusion: "O Motorola Edge 60 Fusion combina conexão 5G, tela de 6,7 polegadas, 256 GB de armazenamento e 8 GB de RAM. A câmera principal de 50 MP com sensor Sony e a selfie de 32 MP são acompanhadas pelos recursos de inteligência artificial moto ai.",
  galaxya56: "O Galaxy A56 é um intermediário com tela Super AMOLED de 6,7 polegadas, 8 GB de RAM e 256 GB de armazenamento. Oferece câmera tripla de até 50 MP, selfie de 12 MP, bateria de 5.000 mAh e certificação IP67 contra água e poeira.",
  razr60: "O Motorola Razr 60 é um celular dobrável com tela interna pOLED de 6,9 polegadas e tela externa de 3,6 polegadas. Tem 256 GB de armazenamento, 12 GB de RAM, câmera principal de 50 MP, selfie de 32 MP e certificação IP48.",

  // Vídeo e áudio
  mibox: "O Xiaomi Mi Box S de 2ª geração transforma uma TV com entrada HDMI em uma smart TV com resolução 4K e sistema Google TV. O controle remoto com comando de voz facilita a busca por filmes, séries e aplicativos.",
  monitor: "O Samsung Odyssey G3 é um monitor gamer de 24 polegadas com resolução Full HD, taxa de atualização de 144 Hz e tempo de resposta de 1 ms. Inclui FreeSync Premium, entradas HDMI e DisplayPort e regulagem de altura.",
  tvtcl55: "A TCL 55P7L é uma smart TV QLED 4K de 55 polegadas com taxa de atualização de 120 Hz e suporte a VRR, recursos úteis para jogos. Usa o sistema Google TV e tem compatibilidade com HDR10+ e Dolby Vision.",
  tvsamsung50: "A Samsung U8600F é uma smart TV Crystal UHD 4K de 50 polegadas, lançada em 2025, com sistema Tizen. Oferece Alexa integrada, 3 entradas HDMI, canais gratuitos do Samsung TV Plus e jogos em nuvem pelo Gaming Hub.",
  tvlg55: "A LG 55UA8550PSA é uma smart TV 4K de 55 polegadas com processador α7 AI de 8ª geração e sistema webOS 25. Conta com HDR10 Pro, Alexa integrada e 3 entradas HDMI.",
  tvtcl43: "A TCL 43S5400A é uma smart TV de 43 polegadas com resolução Full HD e sistema Android TV. Traz Wi-Fi, Bluetooth, Google Assistente, HDR e Dolby Audio, sendo uma opção para quartos e ambientes menores.",
  tvphilips50: "A Philips 50PUG7019 é uma smart TV 4K de 50 polegadas com sistema Google TV. Inclui comando de voz, HDR e Dolby Audio para assistir a filmes, séries e aplicativos de streaming.",
  jbl520bt: "O JBL Tune 520BT é um fone de ouvido sem fio com Bluetooth 5.3 e até 57 horas de bateria. Tem microfone integrado para chamadas, comando de voz e aplicativo para personalizar o som.",
  jblgo4: "A JBL Go 4 é uma caixa de som Bluetooth ultraportátil, resistente à água e à poeira. A bateria dura até 7 horas, o que a torna prática para levar em viagens e passeios.",
  hwc400: "A Samsung HW-C400 é uma soundbar de 2.0 canais e 40 W de potência, com woofer embutido. Conecta-se à TV por Bluetooth ou entrada óptica e reforça o som de filmes, séries e músicas sem precisar de uma caixa externa.",
  sonyxm5: "O Sony WH-1000XM5 é um fone de ouvido sem fio over-ear com cancelamento de ruído e até 30 horas de bateria. Tem microfones para chamadas e é otimizado para os assistentes Alexa e Google Assistente.",

  // Eletrodomésticos
  airfryer: "A Air Fryer Mondial Family tem cesto de 4 litros, potência de 1.500 W e timer. Permite preparar batatas, carnes e outros alimentos com pouco ou nenhum óleo, em uma capacidade adequada para famílias.",
  aspirador: "O Electrolux PowerSpeed Plus é um aspirador de pó vertical com fio e formato 2 em 1, que também pode ser usado como aspirador de mão. É indicado para a limpeza rápida do dia a dia em pisos, móveis e cantos.",
  geladeira: "A Brastemp BRM44HB é uma geladeira duplex Frost Free de 375 litros, na cor branca. Conta com o compartimento extrafrio Fresh Zone, voltado à conservação de carnes e outros alimentos.",
  geladeiraconsul: "A Consul CRM44MB é uma geladeira duplex Frost Free de 377 litros, com tecnologia inverter e acabamento branco. O degelo automático dispensa a limpeza manual do gelo. A voltagem varia conforme o anúncio.",
  geladeiraelectrolux: "A Electrolux TF55 é uma geladeira duplex Frost Free de 431 litros, sendo 303 litros no refrigerador e 128 litros no freezer. Possui prateleira reversível e classificação energética A. A voltagem varia conforme o anúncio.",
  geladeirapanasonic: "A Panasonic NR-BB53 é uma geladeira Frost Free de 425 litros, com freezer na parte inferior e classificação A+++ de eficiência energética. O acabamento e a voltagem variam conforme o anúncio.",
  geladeirasamsung: "A Samsung RT46 é uma geladeira duplex Frost Free de 460 litros, com 348 litros no refrigerador e 112 litros no freezer. Usa tecnologia inverter e tem acabamento Inox Look, com variações conforme o anúncio.",
  lavadora: "A Electrolux LES11 Essencial Care é uma lavadora de roupas de 11 kg, na cor branca. O filtro pega-fiapos ajuda a reduzir os resíduos nas peças, e a capacidade atende bem ao uso de uma família.",
  lavadora15: "A Electrolux LED15 Essential Care é uma lavadora de roupas de 15 kg, com cesto de inox e função Jet Clean. A capacidade maior é indicada para famílias grandes e para lavar peças volumosas. Confirme a voltagem antes da compra.",

  // Peças de computador
  ssd1tb: "O Kingston NV3 é um SSD M.2 2280 NVMe PCIe 4.0 de 1 TB, com velocidades de até 6.000 MB/s de leitura e 4.000 MB/s de gravação. É indicado para reduzir o tempo de carregamento do sistema, de programas e de jogos.",
  i914900k: "O Intel Core i9-14900K é um processador de 14ª geração com 24 núcleos, 32 threads e até 6,0 GHz de frequência. Usa o soquete LGA 1700, tem vídeo integrado e é voltado a jogos e trabalhos pesados, como edição de vídeo.",
  rtx5090: "A GeForce RTX 5090 é uma placa de vídeo topo de linha da NVIDIA, com 32 GB de memória GDDR7, DLSS e ray tracing. É voltada a jogos em 4K e a trabalhos pesados, como renderização. Os modelos e as marcas variam conforme a loja.",
  rtx4060: "A GeForce RTX 4060 é uma placa de vídeo com 8 GB de memória GDDR6, DLSS e ray tracing. É uma opção para jogos em Full HD com bom desempenho e configurações altas.",
  rtx5060: "A GeForce RTX 5060 é uma placa de vídeo com 8 GB de memória GDDR7, barramento de 128 bits, DLSS 4 e ray tracing. É voltada principalmente a jogos em Full HD. Os modelos e as marcas variam conforme a loja.",
  rtx5070: "A GeForce RTX 5070 é uma placa de vídeo com 12 GB de memória GDDR7, barramento de 192 bits, DLSS 4 e ray tracing. É indicada para jogos em resoluções como Quad HD. Os modelos e as marcas variam conforme a loja.",
  rx7600: "A Radeon RX 7600 é uma placa de vídeo da AMD com 8 GB de memória GDDR6, barramento de 128 bits, FSR e ray tracing. É uma alternativa para jogos em Full HD.",
  ramcorsair: "A Corsair Vengeance LPX é um módulo de memória RAM DDR4 de 16 GB, com frequência de 2.400 MHz e latência CL16. É indicada para ampliar a capacidade de computadores compatíveis com DDR4.",
  placamae: "A Gigabyte B760M Gaming X Gen5 é uma placa-mãe Micro-ATX com chipset B760 e soquete LGA 1700, para processadores Intel compatíveis. Oferece suporte a memórias DDR5 e a PCIe 5.0.",
  fonte: "A Corsair CV650 é uma fonte de alimentação de 650 W com certificação 80 Plus Bronze. É uma opção para computadores de uso geral e gamers com consumo compatível com essa potência.",

  // Notebooks
  ideapadslim3: "O Lenovo IdeaPad Slim 3 tem processador Intel Core i5-13420H, 16 GB de RAM, SSD de 512 GB e tela de 15,3 polegadas, com Windows 11. É indicado para estudos, trabalho e tarefas do dia a dia.",
  nitrov15: "O Acer Nitro V15 é um notebook gamer com Intel Core i5-13420H, 16 GB de RAM, SSD de 512 GB e placa de vídeo GeForce RTX 3050 de 6 GB. A tela tem 15,6 polegadas e resolução Full HD. O preço cadastrado é da versão com Linux.",
  macbookairm2: "O MacBook Air de 13 polegadas tem chip Apple M2 com CPU de 8 núcleos e GPU de 10 núcleos, 16 GB de memória unificada e SSD de 256 GB. É leve, silencioso e adequado para estudos, trabalho e edição de imagens e vídeos.",
  vivobook15: "O Asus Vivobook 15 tem processador Intel Core i5-1334U, 8 GB de RAM, SSD de 512 GB e tela Full HD de 15,6 polegadas. Vem com o sistema KeepOS, baseado em Linux, e não inclui Windows.",
  galaxybook4: "O Samsung Galaxy Book4 tem processador Intel Core i5-1335U, 8 GB de RAM, SSD de 512 GB e tela Full HD de 15,6 polegadas, com Windows 11 Home. Pesa cerca de 1,55 kg, o que facilita o transporte no dia a dia.",

  // Wearables
  galaxywatch7: "O Galaxy Watch7 de 40 mm é um smartwatch Bluetooth com tela protegida por cristal de safira, GPS de dupla frequência e recursos de Galaxy AI. Monitora atividades físicas, sono e saúde do coração.",
  xiaomiband9: "A Xiaomi Smart Band 9 é uma pulseira inteligente com tela AMOLED de 1,62 polegada e resistência à água. Acompanha exercícios, sono e notificações do celular em um formato leve e discreto.",
  applewatchse2: "O Apple Watch SE de 2ª geração, com caixa de 40 mm e GPS, tem chip S8, detecção de acidentes e monitoramento de atividades físicas. É compatível apenas com iPhone e funciona como um modelo de entrada da linha.",
  amazfitbip5: "O Amazfit Bip 5 é um smartwatch de 46 mm com GPS, Alexa integrada e chamadas por Bluetooth. A bateria dura até 10 dias, conforme o uso, o que reduz a frequência de recargas.",
  forerunner55: "O Garmin Forerunner 55 é um relógio para corrida com GPS e monitor cardíaco no pulso. Registra treinos e atividades do dia a dia, sendo indicado para quem quer acompanhar a evolução nos exercícios.",

  // Casa inteligente
  echodot5: "O Echo Dot de 5ª geração é uma caixa de som inteligente com a assistente Alexa. Permite tocar músicas, fazer perguntas, criar lembretes e controlar por voz dispositivos compatíveis da casa.",
  echoshow5: "O Echo Show 5 de 3ª geração é um smart display com tela sensível ao toque de 5,5 polegadas e a assistente Alexa. Tem câmera de 2 MP com tampa integrada para mais privacidade, além de mostrar informações e fazer chamadas de vídeo.",
  tapoc200: "A TP-Link Tapo C200 é uma câmera de segurança Wi-Fi para ambientes internos, com giro de 360°, resolução Full HD e visão noturna. Conta com detecção de movimento, áudio de duas vias e compatibilidade com a Alexa.",
  smartplugpositivo: "O Smart Plug Positivo é uma tomada inteligente Wi-Fi de 10 A e até 1.000 W, que permite ligar e desligar aparelhos pelo celular. É compatível com a Alexa e requer rede Wi-Fi de 2,4 GHz.",
  lampadapositivo: "A Smart Lâmpada Positivo é uma lâmpada Wi-Fi de LED, com 9 W, 806 lúmens e funcionamento bivolt. Oferece branco quente e frio e até 16 milhões de cores, com controle por aplicativo, Alexa e Google Assistente."
};
