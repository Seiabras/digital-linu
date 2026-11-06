# Digital Linu

Vídeo, redes sociais, anúncios, marca e automação para pequenos negócios: **https://digital.linupedia.com.br**.
Da mesma equipe do [Linu Sites](https://sites.linupedia.com.br) e da [LinuPedia](https://linupedia.com.br).

Uma página só, sem dependências: HTML, CSS e um pouco de JavaScript. O site é publicado junto com o Linu Sites: a cópia
que vai ao ar fica em `sitios/digital-linu/` do repositório `Seiabras/linu-sites`, que a entrega na VM da Oracle, e o
Caddy serve o subdomínio. Mudou aqui, leve para lá (e o contrário).

## Como está organizado

| Arquivo / pasta | O que tem |
|---|---|
| `index.html` | A página: abertura com o visor, serviços (17, em seis áreas), pacotes prontos, como funciona, dúvidas, orçamento e identidade visual. |
| `404.html` | Página de erro (o Caddy mostra em qualquer endereço que não existe). |
| `css/estilo.css` | Visual, com as três versões (celular até 699 px, tablet até 1099 px, computador) e o modo claro e escuro. |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/digital.js` | Tema, menu, filtro por área, o pacote, o formulário, voltar ao topo, entradas ao rolar e o copiar das cores. |
| `img/` | O Linu (`linu-frente.png`, em pixel art) e os ícones do site. |
| `fontes/` | Nunito (licença OFL, `OFL.txt`), servida pelo próprio site. |
| `robots.txt`, `sitemap.xml` | Para os buscadores. |
| `IDENTIDADE.md` | As decisões de identidade (o objeto, as cores, as fontes, a voz, o que evitar). Ler antes de mexer em tela. |
| `DIRETRIZES-UX.md` | As diretrizes de interface e desempenho de todos os projetos. |

## O que a página faz

- **Monte o seu pacote:** cada serviço tem “Adicionar”; o pacote fica guardado no navegador (`localStorage`,
  `digital-pacote`) e aparece ao lado (computador) ou numa barra presa embaixo (celular e tablet).
- **Pacotes prontos:** Começar, Crescer e Completo marcam os serviços de uma vez; o quarto leva ao Linu Sites.
- **Orçamento:** nome e negócio validados na hora; a mensagem sai escrita no WhatsApp ou no e-mail, com o pacote.
  O que foi digitado fica guardado no navegador.
- **Identidade visual:** o Linu, as cores da família (tocar copia o código), as letras, o objeto de cada site e o que
  nunca entra. A mesma seção está no Linu Sites.
- **A faixa de ida e volta:** no alto, “Procurando um site ou aplicativo? Conheça o Linu Sites”; lá, a mesma faixa
  aponta para cá.

## Ver no computador

```bash
python3 -m http.server 8000
```

## Números (06/11/2026, celular 390 × 844)

7 arquivos e 127 KB na abertura, medidos sem compressão (HTML, CSS, 2 scripts, a fonte, o logo e o Linu; o orçamento das
diretrizes é de 25 arquivos e 300 KB), 475 elementos na página e nenhuma rolagem lateral em 390, 820 e 1280 px. Preços ainda não publicados: o orçamento é pela mensagem.
