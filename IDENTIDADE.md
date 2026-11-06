# Identidade do Digital Linu

Lido antes de mexer em qualquer tela, junto com o `DIRETRIZES-UX.md`. O que é comum à família (o Linu, as cores, o que
nunca entra) está no `IDENTIDADE-LINU.md` do linuarquivos; aqui fica só o que é deste site. Decisão de 06/11/2026.

## O que o site é, numa frase
Vídeo, redes sociais, anúncios, marca e automação para pequenos negócios, feitos pela mesma equipe do Linu Sites, com o
pacote montado na própria página e o orçamento pelo WhatsApp.

## O objeto: a ilha de edição
Cada site da família tem um objeto: a LinuPedia é o caderno de expedição; o Linu Sites, a estação em pixel art com o
lampião. O Digital Linu é a **ilha de edição**:
- **O visor da câmera** na abertura: o Linu em pixel art no quadro, o ponto vermelho do REC, o contador de tempo
  (`00:00:12:04`) e as quatro marcas de enquadramento. Parado: nada pisca nem conta sozinho (sem loop infinito).
- **A linha do tempo** no “Como funciona”: cada etapa é um trecho, com o tempo em fonte mono em cima. Em pé no celular
  e no tablet, deitada no computador.
- **O fio laranja** embaixo da abertura, como a faixa da linha do tempo de um editor.

## Fontes
- **Nunito**, a mesma do Linu Sites (redonda como o Linu, fácil de ler no celular), servida pelo próprio site em
  `fontes/` (licença OFL), pesos de 200 a 1000 num arquivo variável.
- Mono do sistema (`ui-monospace`) só para o tempo do visor e da linha do tempo: não baixa nada.

## Cores
- **Dominante: o fogo**, `#EA580C`, o lampião do Linu Sites. Nos botões e textos sobre o branco, o **fogo escuro**
  `#C2410C` (4,9:1, AA); no modo escuro, `#FB923C` com texto escuro.
- **Base: o grafite da família**, `#1F2A44` (topo, abertura, contato).
- **Neutros:** fundo `#F8FAFC`, seções em `#FFF7ED` (claro) e `#0B1E33` (escuro, o azul-tinta da família), texto
  `#0F172A` e `#475569`. Contraste AA conferido nos dois modos.
- Sem gradiente: a abertura é grafite liso com o fio laranja.

## Formas
- Botões em pílula (`999px`), cartões com canto de 18 px e borda de 2 px, sem sombra (a sombra só aparece ao passar o
  mouse no computador). O cartão escolhido ganha a borda laranja.
- Cartão só para o que se toca sozinho (o serviço, o pacote, a cor). Cartão dentro de cartão não existe.

## Ícones e imagens
- **Ícones próprios em SVG** (traço 2, pontas redondas), um por área: a claquete, o celular, o gráfico que sobe, o
  alfinete do mapa, o pincel e o raio. Ficam no `<symbol>` do começo do `<body>`.
- **O Linu** é o da LinuPedia, em pixel art (`img/linu-frente.png`), nunca redesenhado liso.
- Nada de foto de banco nem ilustração de IA. Quando houver trabalhos de clientes, entram as capturas reais.

## Voz
Português do Brasil falado, direto, com o que entra e o que não entra (“O valor que vai para o Meta ou o Google é seu e
é pago direto a eles”). Usa: “a gente”, “o seu negócio”, “pacote”. Nunca: “transforme”, “eleve”, “alavanque”,
“soluções inovadoras”.

## O que evitar neste site
- Emoji como ícone, em título ou em lista.
- Rótulos em maiúsculas espaçadas (o “REC” do visor é sigla de câmera, não rótulo).
- Animação que pisca ou conta sozinha no visor.
- Prometer prazo, resultado ou número de seguidores sem combinar antes.

## Uma marca de mão
O Linu no visor, “Tomada 1”: o mascote da LinuPedia na frente da câmera, como se estivesse sendo gravado.
