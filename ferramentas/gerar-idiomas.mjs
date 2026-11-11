// Gera a página em cada idioma a partir de um modelo só: index.html (pt-BR, na raiz) e <pasta>/index.html.
// É o gerador do Linu Sites (linu-sites/ferramentas/gerar-idiomas.mjs) adaptado a uma página só. Os idiomas vão em três
// regiões, cada uma com a sua moeda: Brasil (pt-BR, real), Europa (pt-pt, es, ca, nl, en, fr, de, it, euro) e
// Ásia-Pacífico e internacional (intl, ja, ko, zh-hant, dólar). Mudou um texto, um preço ou o HTML, mude em
// ferramentas/pagina/ (ou no precos.json) e rode:
//   node ferramentas/gerar-idiomas.mjs             grava as páginas, o sitemap, as versões (?v=) e as fontes
//   node ferramentas/gerar-idiomas.mjs --conferir  só diz se alguma página gravada está diferente (o Actions roda assim)
// - pagina/modelo.html: o HTML, com {{chave}} no lugar de cada texto. Além dos textos: {{preco.id}} (a linha “a partir
//   de” do serviço), {{n.id}} (o número, para o data-preco) e {{pacote.id id id}} (a soma de um pacote pronto).
// - pagina/textos/<código>.json: a região, a moeda e os textos ("textos" vão no HTML; "js" vão para os scripts, no
//   <script type="application/json" id="textos-js">, e também podem aparecer no HTML). Todo idioma tem todas as chaves
//   do pt-BR, nem mais nem menos. Um idioma com "rascunho": true fica fora do site, do seletor e do sitemap.
// - precos.json: os preços em real ("servicos") e nas outras moedas ("moedas"). Uma moeda com "pendente" gera as
//   páginas, mas o --conferir reprova (não publica); com "provisorio", publica e só avisa.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { FACES, gerarFontes } from './gerar-fontes.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const pagina = path.join(aqui, 'pagina');
const publico = path.join(aqui, '..');
const SITE = 'https://digital.linupedia.com.br/';
const SITES = 'https://sites.linupedia.com.br/';
const CONFERIR = process.argv.includes('--conferir');
// A ordem é a do seletor (agrupado por região, nesta ordem); o pt-BR fica na raiz
const ORDEM = ['pt-BR', 'pt-PT', 'es-ES', 'ca', 'nl', 'en-GB', 'fr', 'de', 'it', 'en-INTL', 'ja', 'ko', 'zh-Hant'];
const REGIOES = ['brasil', 'europa', 'asia'];
// A ordem dos serviços nos dados que o Google lê
const SERVICOS_LD = ['reels', 'youtube', 'institucional', 'cortes', 'gestao', 'artes', 'perfil', 'meta', 'google-ads',
  'meu-negocio', 'seo', 'identidade', 'cartao', 'cardapio', 'whatsapp', 'email', 'ia'];
const arquivoDe = (c) => path.join(pagina, 'textos', c + '.json');
const ATIVOS = ORDEM.filter((c) => {
  if (!fs.existsSync(arquivoDe(c))) { console.warn(`fora: ${c} (ainda sem textos)`); return false; }
  if (JSON.parse(fs.readFileSync(arquivoDe(c), 'utf8')).rascunho) { console.warn(`fora: ${c} (rascunho)`); return false; }
  return true;
});
// Quem não bate com nenhum idioma cai no inglês internacional, em dólar (ou, sem ele, no europeu, ou no pt-BR)
const PADRAO = ['en-INTL', 'en-GB'].find((c) => ATIVOS.includes(c)) || ATIVOS[0];

const modelo = fs.readFileSync(path.join(pagina, 'modelo.html'), 'utf8');
const precos = JSON.parse(fs.readFileSync(path.join(publico, 'precos.json'), 'utf8'));
const idiomas = ATIVOS.map((c) => JSON.parse(fs.readFileSync(arquivoDe(c), 'utf8')));
const erros = [];
const avisos = new Set();
const pendentes = new Set();

const enderecoDe = (i) => SITE + (i.pasta ? i.pasta + '/' : '');
// um & solto num texto ("English (UK & Europe)") sai como &amp;; as entidades que já vêm escritas ficam como estão
const eComercial = (s) => String(s).replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;');
const aspas = (s) => eComercial(s).replaceAll('"', '&quot;');
const hreflangs = (o) => [o.lang, ...(o.hreflang_extra || [])];
for (const i of idiomas) if (!REGIOES.includes(i.regiao)) erros.push(`${i.codigo}: região "${i.regiao}" não existe`);
for (const r of REGIOES) {
  const padroes = idiomas.filter((i) => i.regiao === r && i.padrao).length;
  if (idiomas.some((i) => i.regiao === r) && padroes !== 1) erros.push(`a região ${r} precisa de uma página "padrao" (tem ${padroes})`);
}

// As chaves do pt-BR são a referência: todo idioma tem as mesmas, nem mais nem menos
const chaves = (i) => [...Object.keys(i.textos).map((k) => 't:' + k), ...Object.keys(i.js).map((k) => 'j:' + k)];
const referencia = new Set(chaves(idiomas[0]));
for (const i of idiomas.slice(1)) {
  const deste = new Set(chaves(i));
  for (const k of referencia) if (!deste.has(k)) erros.push(`${i.codigo}: falta ${k}`);
  for (const k of deste) if (!referencia.has(k)) erros.push(`${i.codigo}: sobra ${k}`);
  // as marcas {n}, {v}… de cada texto são as mesmas do pt-BR
  for (const grupo of ['textos', 'js']) for (const [k, v] of Object.entries(i[grupo])) {
    const marcas = (s) => (String(s).match(/\{\{?[a-z_.]+\}?\}/g) || []).sort().join(' ');
    const ref = idiomas[0][grupo][k];
    if (ref !== undefined && marcas(ref) !== marcas(v)) erros.push(`${i.codigo}: ${k} tem as marcas “${marcas(v)}” e o pt-BR tem “${marcas(ref)}”`);
  }
}

// O seletor de região e idioma (o globo no topo), igual ao do Linu Sites
const seletorPara = (i, raiz) => [
  '        <details class="idiomas">',
  `          <summary title="${aspas(i.textos.idioma_rotulo)}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z" /></svg><span class="idiomas-codigo">${i.curto}</span><span class="so-leitor">: ${aspas(i.textos.idioma_rotulo)}, ${aspas(i.nome)}</span></summary>`,
  '          <div class="idiomas-lista">',
  ...REGIOES.filter((r) => idiomas.some((o) => o.regiao === r)).flatMap((r) => [
    `            <p class="idiomas-regiao" id="regiao-${r}">${eComercial(i.textos['regiao_' + r])}</p>`,
    `            <ul aria-labelledby="regiao-${r}">`,
    ...idiomas.filter((o) => o.regiao === r).map((o) => `              <li><a href="${(raiz + (o.pasta ? o.pasta + '/' : '')) || './'}" hreflang="${o.lang}" lang="${o.lang}" data-regiao="${o.regiao}"${o.padrao ? ' data-padrao' : ''} data-sugestao="${aspas(o.sugestao)}" data-fechar="${aspas(o.js.fechar)}"${o === i ? ' aria-current="true"' : ''}>${eComercial(o.nome)}</a></li>`),
    '            </ul>',
  ]),
  '          </div>',
  '        </details>',
].join('\n');
const padrao = idiomas.find((o) => o.codigo === PADRAO);
const alternativas = [
  ...idiomas.flatMap((o) => hreflangs(o).map((h) => `  <link rel="alternate" hreflang="${h}" href="${enderecoDe(o)}">`)),
  `  <link rel="alternate" hreflang="x-default" href="${enderecoDe(padrao)}">`,
].join('\n');

const saidas = [];  // [arquivo, html, idioma]
for (const i of idiomas) {
  // os preços desta moeda: o real vem de "servicos"; as outras, de "moedas"
  const outra = i.moeda === precos.moeda ? null : (precos.moedas || {})[i.moeda];
  if (i.moeda !== precos.moeda && !outra) { erros.push(`${i.codigo}: moeda ${i.moeda} sem preços no precos.json`); continue; }
  if (outra && outra.pendente) { avisos.add(`PENDENTE ${i.moeda}: ${outra.pendente}`); pendentes.add(i.moeda); }
  if (outra && outra.provisorio) avisos.add(`PROVISÓRIO ${i.moeda}: ${outra.provisorio}`);
  const valor = {};
  for (const [id, s] of Object.entries(precos.servicos)) {
    valor[id] = outra ? outra.valores[id] : s.valor;
    if (typeof valor[id] !== 'number') erros.push(`${i.codigo}: o serviço ${id} não tem preço em ${i.moeda}`);
  }
  const formato = new Intl.NumberFormat(i.lang, { style: 'currency', currency: i.moeda, maximumFractionDigits: 0 });
  const dinheiro = (v) => '<b>' + formato.format(v).replace(/[\u00a0\u202f]/g, '&nbsp;') + '</b>';
  const raiz = i.pasta ? '../' : '';
  const sitesUrl = SITES + (i.pasta ? i.pasta + '/' : '');
  const chave = (id) => id.replaceAll('-', '_');
  // a linha “a partir de”: o que é entrega única e o que é por mês, somados à parte (a mesma conta do js/digital.js)
  const aPartir = (unico, mensal) => {
    const partes = [];
    if (unico) partes.push(dinheiro(unico));
    if (mensal) partes.push(i.js.por_mes.replace('{v}', () => dinheiro(mensal)));
    return i.js.a_partir.replace('{v}', () => partes.join(' + '));
  };
  const linhaDoServico = (id) => {
    const s = precos.servicos[id];
    if (!s) { erros.push(`${i.codigo}: {{preco.${id}}} não existe no precos.json`); return ''; }
    const detalhe = i.textos['sd_' + chave(id)];
    // o detalhe do precos.json tem de ter texto em todo idioma; um idioma pode ter um detalhe a mais, só da região
    // (fora do Brasil, o vídeo institucional é a edição do material do cliente: a equipe só grava no Brasil)
    if (s.detalhe && !detalhe) erros.push(`${i.codigo}: falta sd_${chave(id)} (o precos.json tem detalhe)`);
    return aPartir(s.tipo === 'mensal' ? 0 : valor[id], s.tipo === 'mensal' ? valor[id] : 0)
      + (detalhe ? ' <span>' + eComercial(i.textos.entre_parenteses.replace('{v}', () => detalhe)) + '</span>' : '');
  };
  const linhaDoPacote = (ids) => {
    let unico = 0, mensal = 0;
    for (const id of ids.split(' ')) {
      const s = precos.servicos[id];
      if (!s) { erros.push(`${i.codigo}: o pacote pede ${id}, que não existe`); continue; }
      if (s.tipo === 'mensal') mensal += valor[id]; else unico += valor[id];
    }
    return aPartir(unico, mensal);
  };

  const extras = {
    lang: i.lang,
    moeda: i.moeda,
    og_locale: i.og_locale,
    raiz,
    url: enderecoDe(i),
    sites_url: sitesUrl,
    alternativas,
    og_alternativas: idiomas.filter((o) => o !== i).map((o) => `  <meta property="og:locale:alternate" content="${o.og_locale}">`).join('\n'),
    seletor: seletorPara(i, raiz),
    textos_js: JSON.stringify(i.js).replaceAll('</', '<\\/'),
    dados_estruturados: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Digital Linu',
      url: enderecoDe(i),
      description: i.textos.ld_descricao,
      image: SITE + 'img/compartilhar.png',
      logo: SITE + 'img/linu-logo.png',
      telephone: '+55-24-98101-3398',
      email: 'contato@linupedia.com.br',
      areaServed: i.area_servida,
      inLanguage: i.lang,
      availableLanguage: idiomas.map((o) => o.lang),
      parentOrganization: { '@type': 'Organization', name: 'Linu Sites', url: sitesUrl },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: i.textos.ld_servicos,
        itemListElement: SERVICOS_LD.map((id) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: i.textos['s_' + chave(id)] },
          priceSpecification: {
            '@type': 'UnitPriceSpecification', minPrice: valor[id], priceCurrency: i.moeda,
            ...(precos.servicos[id].tipo === 'mensal' ? { unitText: i.textos.ld_mes } : {}),
          },
        })),
      },
    }).replaceAll('</', '<\\/'),
  };

  const html = modelo
    .replace(/\{\{preco\.([a-z-]+)\}\}/g, (_, id) => linhaDoServico(id))
    .replace(/\{\{n\.([a-z-]+)\}\}/g, (_, id) => (id in valor ? String(valor[id]) : (erros.push(`${i.codigo}: {{n.${id}}} não existe`), '')))
    .replace(/\{\{pacote\.([a-z -]+)\}\}/g, (_, ids) => linhaDoPacote(ids))
    .replace(/\{\{([a-z0-9_]+)\}\}/g, (_, k, pos, todo) => {
      if (k in extras) return extras[k];
      const v = k in i.textos ? i.textos[k] : i.js[k];
      if (!v) { erros.push(`${i.codigo}: {{${k}}} sem texto`); return ''; }
      // dentro de um atributo (número ímpar de aspas desde o último <), o texto entra com as aspas escapadas
      const tag = todo.slice(todo.lastIndexOf('<', pos), pos);
      const texto = eComercial(v).replaceAll('{{sites_url}}', () => sitesUrl);
      return (tag.split('"').length % 2 === 0) ? texto.replaceAll('"', '&quot;') : texto;
    });
  saidas.push([path.join(i.pasta, 'index.html'), html, i]);
}

if (erros.length) {
  console.error((CONFERIR ? 'As páginas não fecham:\n  ' : 'Nada foi gravado:\n  ') + [...new Set(erros)].join('\n  '));
  process.exit(1);
}

// O que está gravado leva a versão dos arquivos (?v=, do versao-arquivos.py): a comparação é sem ela
const semVersao = (s) => s.replace(/(\.(?:png|jpg|jpeg|webp|gif|svg|css|js|ico))\?v=[0-9a-f]{8}"/g, '$1"');
const arquivoSitemap = path.join(publico, 'sitemap.xml');
const sitemapAntes = fs.readFileSync(arquivoSitemap, 'utf8');
const hoje = new Date().toISOString().slice(0, 10);
const datas = {};
const mudadas = [];
for (const [arquivo, html, i] of saidas) {
  const destino = path.join(publico, arquivo);
  const url = enderecoDe(i);
  const antes = fs.existsSync(destino) ? semVersao(fs.readFileSync(destino, 'utf8')) : null;
  const anterior = sitemapAntes.match(new RegExp(`<loc>${url.replaceAll('.', '\\.')}</loc>\\s*(?:<xhtml:link[^>]*>\\s*)*<lastmod>([\\d-]+)</lastmod>`));
  if (antes === html && anterior) { datas[url] = anterior[1]; continue; }
  datas[url] = antes === html && anterior ? anterior[1] : hoje;
  if (antes !== html) mudadas.push(arquivo);
  if (CONFERIR) continue;
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  if (antes !== html) fs.writeFileSync(destino, html);
}

// O sitemap: a página em cada idioma, com todas as alternativas
const links = idiomas.flatMap((o) => hreflangs(o).map((h) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${enderecoDe(o)}"/>`)).join('\n')
  + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${enderecoDe(padrao)}"/>`;
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...idiomas.map((i) => `  <url>\n    <loc>${enderecoDe(i)}</loc>\n${links}\n    <lastmod>${datas[enderecoDe(i)]}</lastmod>\n  </url>`),
  '</urlset>',
  '',
].join('\n');

for (const a of avisos) console.warn(a);
if (CONFERIR) {
  if (mudadas.length) { console.error(`Páginas diferentes do modelo e dos textos: ${mudadas.join(', ')}. Rode: node ferramentas/gerar-idiomas.mjs`); process.exit(1); }
  if (pendentes.size) { console.error(`Moeda com preço pendente (${[...pendentes].join(', ')}): não publica.`); process.exit(1); }
  console.log(`As ${saidas.length} páginas batem com o modelo, os textos e o precos.json.`);
  process.exit(0);
}
console.log(`${mudadas.length} páginas gravadas (${saidas.length} idiomas)`);
if (sitemap !== sitemapAntes) { fs.writeFileSync(arquivoSitemap, sitemap); console.log('gravado sitemap.xml'); }
// As fontes de japonês, coreano e chinês saem das páginas gravadas: refaz a que tiver caractere novo (ou a menos)
if (Object.keys(FACES).some((c) => ATIVOS.includes(c))) gerarFontes({ ativos: ATIVOS });
// A versão dos arquivos volta a todas as páginas (?v=<hash>, ferramentas/versao-arquivos.py)
execFileSync('python3', [path.join(aqui, 'versao-arquivos.py'), publico, ...saidas.map(([a]) => path.join(publico, a)), path.join(publico, '404.html')], { stdio: 'inherit' });
