// As fontes de japonês, coreano e chinês: a Noto Sans CJK cortada só com os caracteres que as páginas de cada língua
// usam, em fontes/noto-<pasta>-<peso>.woff2, para o site continuar sem CDN. Roda no fim do gerar-idiomas.mjs e só
// refaz uma fonte quando os caracteres mudam; ferramentas/fontes/<pasta>.txt guarda o que está em cada uma.
//   node ferramentas/gerar-fontes.mjs          refaz o que mudou
//   node ferramentas/gerar-fontes.mjs --tudo   refaz todas (depois de mudar as opções daqui)
// Cópia do linu-sites/ferramentas/gerar-fontes.mjs, para uma página por língua.
// Precisa do pyftsubset com o brotli (ver o README, “Fontes de japonês, coreano e chinês”) e da Noto Sans CJK do pacote
// noto-fonts-cjk. Sem eles, avisa e não muda nada: um caractere novo aparece na fonte do aparelho até a fonte ser refeita.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const publico = path.join(aqui, '..');
const registros = path.join(aqui, 'fontes');
const ORIGEM = process.env.NOTO_CJK || '/usr/share/fonts/noto-cjk';
// a posição de cada língua dentro do .ttc: cada uma tem o desenho certo dos seus caracteres
export const FACES = { ja: 0, ko: 1, 'zh-Hant': 3 };
const PESOS = { 400: 'Regular', 700: 'Bold' };
// sem dicas de tela e sem os recursos que estas páginas não usam: é o que leva o japonês de 563 para 197 KB
const OPCOES = ['--layout-features=kern,palt,halt', '--no-hinting', '--desubroutinize', '--flavor=woff2'];

function acharPyftsubset() {
  const candidatos = [process.env.PYFTSUBSET, 'pyftsubset', path.join(os.homedir(), '.local/share/linu-sites-fontes/bin/pyftsubset')];
  return candidatos.filter(Boolean).find((c) => {
    try { execFileSync(c, ['--help'], { stdio: 'ignore' }); return true; } catch { return false; }
  });
}

// O que aparece nas páginas da língua, nos textos que os scripts escrevem e no CSS. O latim fica com a Archivo.
function caracteres(pasta, lang, moeda) {
  let texto = fs.readFileSync(path.join(publico, pasta, 'index.html'), 'utf8');
  texto += [...fs.readFileSync(path.join(publico, 'css', 'estilo.css'), 'utf8').matchAll(/content:\s*"([^"]*)"/g)].map((m) => m[1]).join('');
  // os preços que o js/digital.js soma e escreve com o Intl (os algarismos e o sinal da moeda de cada língua)
  texto += new Intl.NumberFormat(lang, { style: 'currency', currency: moeda, maximumFractionDigits: 0 }).format(1234567890);
  const usados = [...new Set(texto)].filter((c) => {
    const n = c.codePointAt(0);
    return n >= 0x250 && n <= 0xFFFF && !(n >= 0xFE00 && n <= 0xFE0F);  // sem emoji: esses são os do aparelho
  });
  return usados.sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('');
}

export function gerarFontes({ tudo = false, ativos = null } = {}) {
  const pyftsubset = acharPyftsubset();
  let refeitas = 0;
  for (const [codigo, face] of Object.entries(FACES)) {
    if (ativos && !ativos.includes(codigo)) continue;
    const { pasta, lang, moeda } = JSON.parse(fs.readFileSync(path.join(aqui, 'pagina', 'textos', codigo + '.json'), 'utf8'));
    const registro = path.join(registros, pasta + '.txt');
    const usados = caracteres(pasta, lang, moeda);
    const arquivo = (peso) => path.join(publico, 'fontes', `noto-${pasta}-${peso}.woff2`);
    const emDia = fs.existsSync(registro) && fs.readFileSync(registro, 'utf8') === usados + '\n'
      && Object.keys(PESOS).every((p) => fs.existsSync(arquivo(p)));
    if (emDia && !tudo) continue;
    const origens = Object.values(PESOS).map((n) => path.join(ORIGEM, `NotoSansCJK-${n}.ttc`));
    if (!pyftsubset || !origens.every((o) => fs.existsSync(o))) {
      console.warn(`AVISO: a fonte de ${codigo} está desatualizada: falta ${pyftsubset ? 'a Noto Sans CJK em ' + ORIGEM : 'o pyftsubset'}. Um caractere novo sai na fonte do aparelho.`);
      continue;
    }
    for (const [peso, nome] of Object.entries(PESOS)) {
      execFileSync(pyftsubset, [path.join(ORIGEM, `NotoSansCJK-${nome}.ttc`), `--font-number=${face}`, `--text=${usados}`, ...OPCOES, `--output-file=${arquivo(peso)}`], { stdio: 'pipe' });
    }
    fs.mkdirSync(registros, { recursive: true });
    fs.writeFileSync(registro, usados + '\n');
    const kb = Object.keys(PESOS).reduce((soma, p) => soma + fs.statSync(arquivo(p)).size, 0) / 1024;
    console.log(`fonte de ${codigo}: ${[...usados].length} caracteres, ${Math.round(kb)} KB nos ${Object.keys(PESOS).length} pesos`);
    refeitas++;
  }
  if (refeitas) console.log('Fontes refeitas: suba o ?v= delas no css/estilo.css.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) gerarFontes({ tudo: process.argv.includes('--tudo') });
