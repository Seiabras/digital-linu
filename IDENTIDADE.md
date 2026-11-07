# Identidade do Digital Linu

Lido antes de mexer em qualquer tela, junto com o `DIRETRIZES-UX.md`. O que é comum à família (o Linu, as cores, o que
nunca entra) está no `IDENTIDADE-LINU.md` do linuarquivos; aqui fica só o que é deste site. Primeira decisão em
06/11/2026; refeita em 07/11/2026 (a linha do tempo de edição).

## O que o site é, numa frase
Vídeo, redes sociais, anúncios, marca e automação para pequenos negócios, feitos pela mesma equipe do Linu Sites, com o
pacote montado na própria página e o orçamento pelo WhatsApp.

## O que mudou em 07/11/2026, e por quê
Os sites da família (Linu Sites, Digital Linu, Linu Seguro, Família Linu) tinham ficado com o mesmo esqueleto: topo e
abertura grafite com uma faixa colorida, botões em pílula, cartões brancos com borda de 2 px e canto de 18 px, Nunito.
Só a cor mudava. O objeto do Digital (a ilha de edição) aparecia só na abertura e no “Como funciona”. Agora o objeto dá
forma à página inteira: **a página é um programa de edição de vídeo**, genérico e próprio (sem nome, logo ou ícone de
programa real).

## O objeto: a linha do tempo de edição
- **A régua** presa embaixo do topo: o timecode (`00:00:35:12`, 24 quadros por segundo), o nome da seção e os
  marcadores de cada seção. A agulha anda com a rolagem (só `transform`, nada roda sozinho) e o link do menu da seção
  atual fica marcado. Cada seção diz o seu tempo em `data-tc` (segundos) e o rodapé o fim em `data-tc-fim`.
- **O monitor de programa** na abertura: o visor da câmera com o Linu de câmera na mão, o REC, o timecode, as marcas de
  enquadramento e a barra de reprodução com entrada, saída e a agulha (que anda um passo a cada foto do tema).
- **Os marcadores**: cada título de seção tem a bandeira laranja com o timecode, sobre uma régua de traços.
- **Os serviços são clipes nas trilhas.** Seis trilhas, uma por área: V1 Vídeo, V2 Redes sociais e V3 Marca (com a
  tira de quadros embaixo do clipe), A1 Anúncios, A2 Ser encontrado e A3 Automação (com a forma de onda). Tocar no nome
  da trilha mostra só ela (as outras ficam caladas, só com o nome); tocar de novo, ou em “Todas as trilhas”, volta tudo.
  No computador, o clipe mais caro é o mais longo (de 1 a 1,8 vez).
- **A sequência** embaixo das trilhas é o pacote sendo montado: os clipes escolhidos na cor da trilha, com a estimativa
  (única + por mês). No computador fica presa embaixo da tela enquanto a linha do tempo está à vista.
- **O Raio-X** é o painel de medição: oito barras, uma por pergunta (apagada sem resposta, clara sem falta, laranja
  quando falta algo).
- **Pacotes prontos** são sequências montadas, uma por linha, com os clipes coloridos; **Trabalhos** são os arquivos do
  projeto, em lista com miniatura; **Como funciona** é a trilha das etapas com o tempo na régua; **Dúvidas** são os
  marcadores (losango); o **orçamento** é a janela de exportar.

## Tema
- **Claro: o papel do roteiro** (`#F7F3EC`, seções em `#EFE7DA`) em volta dos painéis escuros do editor (o monitor, a
  linha do tempo, a medição e a janela de exportar), que são escuros porque são a tela do programa, não por enfeite.
- **Escuro: a sala de edição à noite** (`#100E0C`, seções em `#17130F`); os painéis continuam em `#1C1815`, separados
  pela borda.
- Topo, régua e rodapé no escuro quente do editor (`#1C1815`, `#241F1B`, `#0E0C0B`), não no grafite da família.

## Cores
- **Dominante: o fogo**, `#EA580C`. Nos botões, o **fogo escuro** `#C2410C` com texto branco (5,2:1); no modo escuro,
  `#FB923C` com texto `#1C0A02` (8,5:1). Laranja em texto pequeno sobre o papel usa `#9A3412` (6,6:1).
- **As trilhas**, todas com texto branco em AA: Vídeo `#C2410C` (5,2:1), Redes `#BE185D` (6,0:1), Marca `#A16207`
  (4,9:1), Anúncios `#0F766E` (5,5:1), Ser encontrado `#1D4ED8` (6,7:1), Automação `#4D7C0F` (5,0:1). As mesmas cores
  marcam os clipes nos pacotes prontos, na sequência e nas miniaturas dos Trabalhos.
- **Neutros:** texto `#1C1917` e `#57534E` no claro (15,8:1 e 6,9:1 sobre o papel); `#EDE7DF` e `#A8A29E` no escuro
  (15,7:1 e 7,6:1). No painel, `#F1ECE6` e `#B5ADA5` (15:1 e 8:1).
- A seleção do título (“aparecendo”) é um trecho selecionado: `#FED7AA` com as bordas de entrada e saída em laranja (no
  escuro, `#7C2D12`).
- Sem gradiente de cor e sem roxo.

## Fontes
- **Archivo** (Omnibus-Type, licença OFL, `fontes/OFL-archivo.txt`): uma família só para títulos e texto, com o eixo de
  largura. Os títulos usam a largura estreita (72 a 80%) e peso 800, como letreiro e crédito de cinema; o texto, a
  largura normal. Arquivo variável `fontes/archivo-latin.woff2` (pesos 400 a 800, largura 62 a 100%, 88 KB).
- **JetBrains Mono** (licença OFL, `fontes/OFL-jetbrains-mono.txt`) nos timecodes, nos nomes das trilhas (V1, A1) e nos
  rótulos dos painéis. `fontes/jetbrains-mono-latin.woff2` (pesos 500 a 700, 31 KB).
- Fora: Nunito (era a do Linu Sites; o Digital ficava igual) e a “lista de IA” (Inter, Poppins, Fraunces, Bricolage,
  Plus Jakarta, Fredoka).

## Formas
- **Controles de editor:** botões retangulares com canto de 4 px e uma sombra interna embaixo, como tecla; os ícones de
  reproduzir, cortar, próximo e exportar desenhados em SVG. Nada de pílula.
- **Clipes** com canto de 4 px, a faixa do nome em cima e borda clara de 1 px; o clipe escolhido ganha o contorno
  amarelo-claro `#FDE68A`, como clipe selecionado.
- **Listas em linhas**, com fios de 1 px, no lugar de cartões: as perguntas do Raio-X, os pacotes prontos, os Trabalhos
  e as Dúvidas. Cartão dentro de cartão não existe; três cartões iguais com ícone em cima também não.

## O Linu
- O mesmo pixel art da LinuPedia (`img/linu-camera.png`, 121 × 190), **sempre em escala inteira**, com
  `image-rendering: pixelated` e tamanho em px (nunca em %): 1× no celular, 2× (242 × 380) do tablet em diante. No cartão
  do canto (a foto com o visor fora da tela), 1× num plano fechado, cortado no peito.

## Ícones e imagens
- **Ícones próprios em SVG** (traço 2, pontas redondas), um por trilha (a claquete, o celular, o pincel, o gráfico que
  sobe, o alfinete do mapa e o raio) e os controles. Ficam no `<symbol>` do começo do `<body>`.
- Nada de foto de banco nem ilustração de IA. Quando houver trabalhos de clientes, entram as capturas reais.
- `img/compartilhar.png` (1200 × 630): o papel do roteiro com o título, o monitor com o Linu em 2× e a linha do tempo
  com as trilhas embaixo.

## Voz
Português do Brasil falado, direto, com o que entra e o que não entra (“O valor que vai para o Meta ou o Google é seu e
é pago direto a eles”). Usa: “a gente”, “o seu negócio”, “pacote”, e o vocabulário de edição só onde ajuda (clipe,
trilha, sequência). Nunca: “transforme”, “eleve”, “alavanque”, “soluções inovadoras”.

## O que evitar neste site
- Emoji como ícone, em título ou em lista.
- Rótulos em maiúsculas espaçadas (REC, V1, A1 e SEQ são siglas do editor, não rótulos).
- Animação que pisca, conta ou roda sozinha: a agulha da régua só anda com a rolagem; a da barra de reprodução, só com a
  foto.
- Marca, nome ou ícone de programa de edição real.
- Prometer prazo, resultado ou número de seguidores sem combinar antes.

## Uma marca de mão
O Linu no visor, “Tomada 1”: o mascote da LinuPedia com a câmera na mão, e o timecode da página inteira andando com quem
lê, como se a visita fosse a sequência sendo assistida.
