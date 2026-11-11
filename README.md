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
| `index.html` e `pt-pt/`, `es/`, `ca/`, `nl/`, `en/`, `fr/`, `de/`, `it/`, `intl/`, `ja/`, `ko/`, `zh-hant/` | A página em cada idioma (geradas), montada como um programa de edição: a régua com a agulha, a abertura com o monitor, o Raio-X, a linha do tempo dos serviços (17 clipes em seis trilhas, com preço) e a sequência do pacote, pacotes prontos, trabalhos, como funciona, dúvidas e orçamento. |
| `404.html` | Página de erro (o Caddy mostra em qualquer endereço que não existe). |
| `css/estilo.css` | Visual, com as três versões (celular até 699 px, tablet até 1099 px, computador) e o modo claro e escuro. |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/idiomas.js` | O seletor de região e idioma e o aviso que sugere a página da região de quem chega (o mesmo do Linu Sites). |
| `js/digital.js` | Os textos vêm do bloco `textos-js` da página e o dinheiro, da moeda dela (`data-moeda`). Tema com a foto, menu, as trilhas (mostrar só uma), a sequência com a estimativa, o formulário, voltar ao topo, entradas ao rolar, a régua do editor e o Raio-X. |
| `img/` | O Linu (`linu-camera.png` e `linu-frente.png`, em pixel art), os ícones do site e a imagem de compartilhar (`compartilhar.png`, 1200 × 630). |
| `fontes/` | Archivo (textos e títulos) e JetBrains Mono (timecodes), licença OFL (`OFL-archivo.txt`, `OFL-jetbrains-mono.txt`), servidas pelo próprio site. |
| `robots.txt`, `sitemap.xml` | Para os buscadores. |
| `ferramentas/conferir-visual.mjs` | A conferência visual que o Actions roda antes de publicar (cópia do `linuarquivos/modelos/ferramentas/`): 390, 820 e 1280 px, claro e escuro; reprova com rolagem lateral, erro no console, arquivo faltando ou falha séria de acessibilidade, e guarda as capturas como artefato. No computador: `node ferramentas/conferir-visual.mjs --raiz . --playwright <pasta do playwright> --axe <axe.min.js>`. |
| `ferramentas/pagina/` e `ferramentas/gerar-idiomas.mjs` | **A página em 13 idiomas** (11/11/2026): o `modelo.html` (o HTML, com `{{chave}}` no lugar de cada texto) e os textos de cada idioma (`textos/<código>.json`). O gerador escreve o `index.html` (pt-BR) e o `<pasta>/index.html` de cada idioma, o `sitemap.xml` e as versões dos arquivos. **O `index.html` é gerado: não edite à mão.** |
| `precos.json` | **Os preços numa fonte só**: em reais em `servicos` e, desde 11/11/2026, em euro e dólar em `moedas`. O gerador escreve o `data-preco`, a linha “a partir de” de cada serviço, os dados que o Google lê e o total dos pacotes prontos. Para mudar um preço: editar o `precos.json` e rodar `node ferramentas/gerar-idiomas.mjs`. O Actions confere (`--conferir`) e não publica se a página discordar. A Família Linu lê este arquivo para as rotas. |
| `ferramentas/gerar-fontes.mjs` | As fontes de japonês, coreano e chinês (`fontes/noto-*.woff2`), cortadas só com os caracteres que cada página usa. Roda no fim do gerador. |
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
- **Raio-X no celular (11/11/2026):** abaixo de 700 px, as oito perguntas viram cartões de lado, um por vez, com “Pergunta 1 de 8” e as setas; responder leva à próxima sem resposta. O raio-X passou a caber em pouco mais de uma tela. Tablet e computador seguem com a grade.
- **Raio-X do negócio:** oito perguntas de sim ou não (Google Maps, perfil, constância, vídeo, anúncio, marca,
  WhatsApp, site). Cada falta mostra o serviço e o motivo; “Levar para o meu pacote” junta tudo ao pacote, e quem não
  tem site recebe o link do Linu Sites. Respostas no navegador (`localStorage`, `digital-raiox`).
- **Preços “a partir de” (07/11/2026):** cada cartão tem `data-preco` e `data-tipo` (`unico` ou `mensal`), e a
  linha do preço. O pacote, a barra de baixo, o formulário, a mensagem, o Raio-X e os pacotes prontos somam à parte o
  que é entrega única e o que é por mês. Para mudar um preço: o `precos.json` e `node ferramentas/gerar-idiomas.mjs`, que acerta o
  cartão, o JSON-LD e o total escrito dos pacotes prontos.
- **Celular mais curto:** desde 07/11/2026 cada trilha mostra o clipe mais pedido (`data-destaque`) primeiro e os
  outros rolando de lado dentro dela, no lugar do antigo “Ver todos os 17 serviços”.
- **Três versões, os acertos de 07/11/2026:** no celular, os quatro pacotes prontos correm de lado, um por vez; a barra
  de baixo fica sempre lá depois da abertura (vazia, só “Pacote vazio” e o Pedir orçamento; no tablet, vazia, some,
  porque o topo já tem o botão); no celular e no tablet, o medidor do raio-X fica preso no alto enquanto a pessoa
  responde, com a contagem e o atalho “Ver o resultado” (no computador, o resultado já fica parado ao lado).
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
  rodadas de ajuste por entrega e o mensal com 30 dias de aviso; desde 11/11/2026, mínimo de 3 meses nos anúncios e na
  automação, e a gravação fora de Brasília com deslocamento e hospedagem à parte.
- **Compartilhar e Google:** `img/compartilhar.png` (1200 × 630, o Linu no monitor e as trilhas embaixo; refeita em
  07/11/2026, renderizada no Playwright) nas etiquetas `og:` e
  `twitter:card`, e os dados estruturados (`ProfessionalService`, com os 17 serviços) no `<head>`.

- **O registro dos pedidos (07/11/2026):** ao tocar em Mandar pelo WhatsApp ou por e-mail, a página manda o pedido (nome,
  negócio, o que escolheu, a estimativa e a mensagem) para `/api/pedido` por `sendBeacon`, sem atrasar a abertura; o
  Caddy encaminha para o `linu-pedidos` (linuarquivos/servidor), que guarda por 12 meses e avisa por e-mail. O aviso de
  privacidade fica embaixo dos botões, e um campo escondido (`site_extra`) separa os robôs.

## Idiomas (11/11/2026)

A página existe em 13 idiomas, nas mesmas pastas do Linu Sites: pt-BR na raiz e `pt-pt/`, `es/`, `ca/`, `nl/`, `en/`,
`fr/`, `de/`, `it/` (Europa, em euro), `intl/`, `ja/`, `ko/` e `zh-hant/` (Ásia-Pacífico e internacional, em dólar).

```bash
node ferramentas/gerar-idiomas.mjs             # grava as páginas, o sitemap, as fontes e as versões
node ferramentas/gerar-idiomas.mjs --conferir  # só confere (é o que o Actions roda)
```

- **Mudar um texto:** no `ferramentas/pagina/textos/<código>.json` de cada idioma (`textos` vão no HTML; `js` vão para
  os scripts). O gerador recusa gravar se um idioma tiver chave a mais ou a menos que o pt-BR, ou uma marca (`{n}`,
  `{v}`) diferente. Pela regra 8, um texto novo nasce no pt-BR e os outros 12 entram numa leva só, depois de aprovado.
- **Mudar o HTML:** no `ferramentas/pagina/modelo.html`. Além dos textos, o modelo usa `{{preco.id}}` (a linha “a
  partir de” do serviço), `{{n.id}}` (o número) e `{{pacote.id id}}` (a soma de um pacote pronto).
- **Preços por região:** real no Brasil, euro na Europa e dólar no resto (`moedas` do `precos.json`). Os valores em euro
  e dólar de 11/11/2026 são uma sugestão a partir de faixas de mercado e estão marcados `provisorio` (publica e avisa);
  com `pendente`, o Actions não publica.
- **O que muda por região, e não só de língua:** o vídeo institucional, que fora do Brasil leva “edição do seu material”
  depois do preço (`sd_institucional`, vazio no pt-BR), o pagamento (Pix no Brasil; fatura em euro por SEPA na Europa;
  transferência em dólar pela Wise no resto), a gravação no local (só no Brasil) e a dúvida “Atendem fora de Brasília?”,
  que fora do Brasil vira “Atendem fora do Brasil?”. Estão nas chaves `faq_pagamento_r`, `faq_gravo_r`, `faq_fora_p` e
  `faq_fora_r` de cada idioma.
- **Seletor e aviso:** o globo no topo lista os idiomas por região; quem chega de outra região (pelo fuso do aparelho) ou
  com o navegador em outra língua vê, uma vez, um aviso com o link. A página nunca troca sozinha.
- **Para o Google:** cada página leva o `hreflang` de todas (o `x-default` é o inglês internacional) e o sitemap lista
  as 13 com as alternativas.
- **Japonês, coreano e chinês:** a Archivo não tem esses caracteres; vem a Noto Sans CJK do próprio site, cortada (precisa
  do `pyftsubset` e da Noto Sans CJK no computador; sem eles o gerador avisa e o caractere novo sai na fonte do aparelho).
- **Traduções sem leitura de nativo:** as 12 línguas foram traduzidas em 11/11/2026 e ainda não passaram por um nativo.
- A página 404 e os pedidos que chegam (`/api/pedido`) continuam em português; a mensagem do pedido sai na língua da página.

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

- **Contador de visitas do Farol (11/11/2026):** `js/farol-visitas.js` é cópia do `linu-farol/v.js` (mudou lá, muda aqui). Conta as visitas sem cookie; o CSP libera `https://farol.linupedia.com.br` no `connect-src` (na página e no Caddy). Os números ficam no painel da casa: https://farol.linupedia.com.br/p/casa-digital/.

- **Contato (11/11/2026):** WhatsApp (24) 98101-3398; o “Mandar por e-mail” virou “Enviar pelo formulário”, que manda o pedido a `/api/pedido` com o e-mail da pessoa (chega no contato@ e no `/admin` da Família Linu; servidor em `linuarquivos/servidor/linu-pedidos`).
