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
| `index.html` | A página: abertura com o visor, o Raio-X, serviços (17, em seis áreas, com preço), pacotes prontos, trabalhos, como funciona, dúvidas e orçamento. |
| `404.html` | Página de erro (o Caddy mostra em qualquer endereço que não existe). |
| `css/estilo.css` | Visual, com as três versões (celular até 699 px, tablet até 1099 px, computador) e o modo claro e escuro. |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/digital.js` | Tema, menu, filtro por área, o “ver todos” do celular, o pacote com a estimativa, o formulário, voltar ao topo, entradas ao rolar e o Raio-X. |
| `img/` | O Linu (`linu-frente.png`, em pixel art), os ícones do site e a imagem de compartilhar (`compartilhar.png`, 1200 × 630). |
| `fontes/` | Nunito (licença OFL, `OFL.txt`), servida pelo próprio site. |
| `robots.txt`, `sitemap.xml` | Para os buscadores. |
| `deploy/` | A publicação na VM: o `receber.sh`, a preparação, o bloco do Caddy, a conferência das páginas e o `ORACLE.md`. |
| `IDENTIDADE.md` | As decisões de identidade (o objeto, as cores, as fontes, a voz, o que evitar). Ler antes de mexer em tela. |
| `DIRETRIZES-UX.md` | As diretrizes de interface e desempenho de todos os projetos. |

## O que a página faz

- **Monte o seu pacote:** cada serviço tem “Adicionar”; o pacote fica guardado no navegador (`localStorage`,
  `digital-pacote`) e aparece ao lado (computador) ou numa barra presa embaixo (celular e tablet).
- **Raio-X do negócio:** oito perguntas de sim ou não (Google Maps, perfil, constância, vídeo, anúncio, marca,
  WhatsApp, site). Cada falta mostra o serviço e o motivo; “Levar para o meu pacote” junta tudo ao pacote, e quem não
  tem site recebe o link do Linu Sites. Respostas no navegador (`localStorage`, `digital-raiox`).
- **Preços “a partir de” (07/11/2026):** cada cartão tem `data-preco` e `data-tipo` (`unico` ou `mensal`), e a
  linha do preço. O pacote, a barra de baixo, o formulário, a mensagem, o Raio-X e os pacotes prontos somam à parte o
  que é entrega única e o que é por mês. Para mudar um preço: o `data-preco`, a linha do cartão e o `minPrice` do
  JSON-LD no `<head>`; os totais dos pacotes prontos se refazem sozinhos (o texto fixo vale só sem JavaScript).
- **Celular mais curto:** com “Todas”, só os seis mais pedidos (`data-destaque`) e os já escolhidos aparecem, até
  tocar em “Ver todos os 17 serviços”.
- **Pacotes prontos:** Começar, Crescer e Completo marcam os serviços de uma vez, com o total; o quarto leva ao Linu
  Sites.
- **Trabalhos:** só o que é de verdade: a identidade da família Linu e os sites do Linu Sites. O terceiro cartão espera
  os primeiros clientes de vídeo e redes, que entram com permissão.
- **Orçamento:** nome e negócio validados na hora; a mensagem sai escrita no WhatsApp ou no e-mail, com o pacote.
  O que foi digitado fica guardado no navegador.
- **Identidade visual:** mora na Família Linu (https://familia.linupedia.com.br/identidade) desde 07/11/2026; o
  `/identidade` daqui leva para lá (um `redir` no bloco do Caddy), e o rodapé e os Trabalhos apontam direto.
- **A foto ao trocar o tema (07/11/2026):** o botão do sol e da lua faz a câmera fotografar o Linu: o obturador fecha e
  abre, vem o flash, o Linu posa e a legenda conta a tomada (“Tomada 2: clique!”). Com o visor fora da tela, a cena
  aparece num cartão no canto e some sozinha. Só ao toque, nunca em loop; com “reduzir movimento”, só a legenda muda.
- **A faixa de ida e volta:** no alto, “Procurando um site ou aplicativo? Conheça o Linu Sites”; lá, a mesma faixa
  aponta para cá.
- **Dúvidas com os termos simples:** pagamento (metade no aceite e metade na entrega; mensal no começo do mês), duas
  rodadas de ajuste por entrega e o mensal sem fidelidade, com 30 dias de aviso. As mesmas regras do Linu Sites.
- **Compartilhar e Google:** `img/compartilhar.png` (1200 × 630, o Linu no visor) nas etiquetas `og:` e
  `twitter:card`, e os dados estruturados (`ProfessionalService`, com os 17 serviços) no `<head>`.

## Ver no computador

```bash
python3 -m http.server 8000
```

## Números (06/11/2026, celular 390 × 844)

7 arquivos e 127 KB na abertura, medidos sem compressão (HTML, CSS, 2 scripts, a fonte, o logo e o Linu; o orçamento das
diretrizes é de 25 arquivos e 300 KB), 475 elementos na página e nenhuma rolagem lateral em 390, 820 e 1280 px. Em 07/11/2026, com os seis serviços do celular, a página caiu de
10.930 px para 8.598 px de altura em 390 px.
