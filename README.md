# Digital Linu

Vídeo, redes sociais, anúncios, marca e automação para pequenos negócios: **https://digital.linupedia.com.br**.
Da mesma equipe do [Linu Sites](https://sites.linupedia.com.br) e da [LinuPedia](https://linupedia.com.br).

Uma página só, sem dependências: HTML, CSS e um pouco de JavaScript. O site tem publicação própria, separada do
Linu Sites: a cada push na `main`, o GitHub Actions entrega o site na VM da Oracle e o Caddy serve o subdomínio
(detalhes em [`deploy/ORACLE.md`](deploy/ORACLE.md)). O Linu Sites é o serviço irmão, em `Seiabras/linu-sites`: os dois
apontam um para o outro, mas cada um vive no seu repositório.

## Como está organizado

| Arquivo / pasta | O que tem |
|---|---|
| `index.html` | A página, montada como um programa de edição: a régua com a agulha, a abertura com o monitor, o Raio-X, a linha do tempo dos serviços (17 clipes em seis trilhas, com preço) e a sequência do pacote, pacotes prontos, trabalhos, como funciona, dúvidas e orçamento. |
| `404.html` | Página de erro (o Caddy mostra em qualquer endereço que não existe). |
| `css/estilo.css` | Visual, com as três versões (celular até 699 px, tablet até 1099 px, computador) e o modo claro e escuro. |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/digital.js` | Tema com a foto, menu, as trilhas (mostrar só uma), a sequência com a estimativa, o formulário, voltar ao topo, entradas ao rolar, a régua do editor e o Raio-X. |
| `img/` | O Linu (`linu-camera.png` e `linu-frente.png`, em pixel art), os ícones do site e a imagem de compartilhar (`compartilhar.png`, 1200 × 630). |
| `fontes/` | Archivo (textos e títulos) e JetBrains Mono (timecodes), licença OFL (`OFL-archivo.txt`, `OFL-jetbrains-mono.txt`), servidas pelo próprio site. |
| `robots.txt`, `sitemap.xml` | Para os buscadores. |
| `ferramentas/conferir-visual.mjs` | A conferência visual que o Actions roda antes de publicar (cópia do `linuarquivos/modelos/ferramentas/`): 390, 820 e 1280 px, claro e escuro; reprova com rolagem lateral, erro no console, arquivo faltando ou falha séria de acessibilidade, e guarda as capturas como artefato. No computador: `node ferramentas/conferir-visual.mjs --raiz . --playwright <pasta do playwright> --axe <axe.min.js>`. |
| `precos.json` e `ferramentas/precos-servicos.py` | **Os preços numa fonte só** (07/11/2026): o `precos.json` é a fonte; o script escreve no `index.html` o `data-preco`/`data-tipo`, a linha “a partir de” de cada serviço, o `minPrice` do JSON-LD e o total dos pacotes prontos. Para mudar um preço: editar o `precos.json` e rodar `python3 ferramentas/precos-servicos.py`. O Actions confere (`--conferir`) e não publica se a página discordar. A Família Linu lê este arquivo para as rotas. |
| `deploy/` | A publicação na VM: o `receber.sh`, a preparação, o bloco do Caddy, a conferência das páginas e o `ORACLE.md`. |
| `IDENTIDADE.md` | As decisões de identidade (o objeto, as cores, as fontes, a voz, o que evitar). Ler antes de mexer em tela. |
| `DIRETRIZES-UX.md` | As diretrizes de interface e desempenho de todos os projetos. |

## O que a página faz

- **A linha do tempo de edição (07/11/2026):** a página inteira é um editor de vídeo (detalhes no `IDENTIDADE.md`).
  A régua embaixo do topo mostra o timecode e a seção, e a agulha anda com a rolagem: cada seção tem `data-tc` (o
  tempo em segundos) e `data-nome` (e `data-curto`, se o nome não cabe na régua); o rodapé tem o fim em `data-tc-fim`.
  Seção nova: pôr esses atributos, e a régua cria o marcador sozinha.
- **Monte o seu pacote:** cada serviço é um clipe com “Adicionar”; o pacote fica guardado no navegador
  (`localStorage`, `digital-pacote`) e aparece na sequência embaixo das trilhas (presa embaixo da tela no computador) e
  numa barra presa embaixo (celular e tablet), que some quando a sequência ou o formulário estão à vista.
- **As trilhas:** cada área é uma trilha (V1 Vídeo, V2 Redes sociais, V3 Marca, A1 Anúncios, A2 Ser encontrado, A3
  Automação). Tocar no nome mostra só ela; tocar de novo ou em “Todas as trilhas” volta tudo. No celular e no tablet os
  clipes rolam de lado só dentro da trilha; no computador cabem todos. Serviço novo: um `<article class="clipe servico">`
  dentro da `trilha-faixa` da área, com `data-cat` igual ao `data-trilha`, e a contagem do nome da trilha.
- **Raio-X do negócio:** oito perguntas de sim ou não (Google Maps, perfil, constância, vídeo, anúncio, marca,
  WhatsApp, site). Cada falta mostra o serviço e o motivo; “Levar para o meu pacote” junta tudo ao pacote, e quem não
  tem site recebe o link do Linu Sites. Respostas no navegador (`localStorage`, `digital-raiox`).
- **Preços “a partir de” (07/11/2026):** cada cartão tem `data-preco` e `data-tipo` (`unico` ou `mensal`), e a
  linha do preço. O pacote, a barra de baixo, o formulário, a mensagem, o Raio-X e os pacotes prontos somam à parte o
  que é entrega única e o que é por mês. Para mudar um preço: o `precos.json` e `python3 ferramentas/precos-servicos.py`, que acerta o
  cartão, o JSON-LD e o total escrito dos pacotes prontos.
- **Celular mais curto:** desde 07/11/2026 cada trilha mostra o clipe mais pedido (`data-destaque`) primeiro e os
  outros rolando de lado dentro dela, no lugar do antigo “Ver todos os 17 serviços”.
- **Pacotes prontos:** Começar, Crescer e Completo marcam os serviços de uma vez, com o total; o quarto leva ao Linu
  Sites.
- **Trabalhos:** só o que é de verdade: a identidade da família Linu e os sites do Linu Sites. O terceiro arquivo espera
  os primeiros clientes de vídeo e redes, que entram com permissão.
- **Orçamento:** nome e negócio validados na hora; a mensagem sai escrita no WhatsApp ou no e-mail, com o pacote.
  O que foi digitado fica guardado no navegador.
- **Identidade visual:** mora na Família Linu (https://familia.linupedia.com.br/identidade) desde 07/11/2026; o
  `/identidade` daqui leva para lá (um `redir` no bloco do Caddy), e o rodapé e os Trabalhos apontam direto.
- **A foto ao trocar o tema (07/11/2026):** o botão do sol e da lua faz a câmera fotografar o Linu: o obturador fecha e
  abre, vem o flash, o Linu posa e a legenda conta a tomada (“Tomada 2: clique!”). Com o visor fora da tela, a cena
  aparece num cartão no canto e some sozinha. Só ao toque, nunca em loop; com “reduzir movimento”, só a legenda muda.
- **A faixa da família (07/11/2026):** no alto, “Parte da família Linu, com …”, levando para a Família Linu
  (https://familia.linupedia.com.br). Todos os irmãos apontam para lá, e não mais um para o outro.
- **Dúvidas com os termos simples:** pagamento (metade no aceite e metade na entrega; mensal no começo do mês), duas
  rodadas de ajuste por entrega e o mensal sem fidelidade, com 30 dias de aviso. As mesmas regras do Linu Sites.
- **Compartilhar e Google:** `img/compartilhar.png` (1200 × 630, o Linu no monitor e as trilhas embaixo; refeita em
  07/11/2026, renderizada no Playwright) nas etiquetas `og:` e
  `twitter:card`, e os dados estruturados (`ProfessionalService`, com os 17 serviços) no `<head>`.

- **O registro dos pedidos (07/11/2026):** ao tocar em Mandar pelo WhatsApp ou por e-mail, a página manda o pedido (nome,
  negócio, o que escolheu, a estimativa e a mensagem) para `/api/pedido` por `sendBeacon`, sem atrasar a abertura; o
  Caddy encaminha para o `linu-pedidos` (linuarquivos/servidor), que guarda por 12 meses e avisa por e-mail. O aviso de
  privacidade fica embaixo dos botões, e um campo escondido (`site_extra`) separa os robôs.

## Ver no computador

```bash
python3 -m http.server 8000
```

## Números (06/11/2026, celular 390 × 844)

7 arquivos e 127 KB na abertura, medidos sem compressão (HTML, CSS, 2 scripts, a fonte, o logo e o Linu; o orçamento das
diretrizes é de 25 arquivos e 300 KB), 475 elementos na página e nenhuma rolagem lateral em 390, 820 e 1280 px. Em 07/11/2026, com os seis serviços do celular, a página caiu de
10.930 px para 8.598 px de altura em 390 px.

Em 07/11/2026, com a linha do tempo: 390 px com 9.983 px de altura, 820 px com 7.519 px e 1280 px com 6.775 px, nenhuma
rolagem lateral nas três larguras, claro e escuro. As fontes passaram de 39 KB (Nunito) para 121 KB (Archivo variável
com o eixo de largura + JetBrains Mono).
