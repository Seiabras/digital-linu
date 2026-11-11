/* Seletor de região e idioma (11/11/2026; o mesmo do Linu Sites): a lista fecha ao tocar fora e com Esc, e a escolha
   fica guardada. Quem chega de outra região, ou com o navegador em outro idioma que o site tem, vê uma vez um aviso
   discreto com o link (sem trocar de página sozinho: o Google visita dos EUA e precisa ver todas as versões). */
(function () {
  "use strict";

  var seletor = document.querySelector(".idiomas");
  if (!seletor) return;
  var links = [].slice.call(seletor.querySelectorAll("a[hreflang]"));
  function guardado(chave, valor) {
    try { if (valor === undefined) return localStorage.getItem(chave); localStorage.setItem(chave, valor); } catch (e) {}
    return null;
  }

  document.addEventListener("click", function (e) {
    if (seletor.open && !seletor.contains(e.target)) seletor.open = false;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && seletor.open) {
      seletor.open = false;
      seletor.querySelector("summary").focus();
    }
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () { guardado("idioma", a.hreflang); });
  });

  // o aviso: só quando a pessoa ainda não escolheu nem fechou. A região vem do fuso horário do aparelho (nada sai do
  // navegador, sem consultar IP) e o idioma, do navegador: primeiro um idioma dela dentro da região, depois o mesmo
  // idioma em outra região e, por fim, a página da região.
  if (guardado("idioma") || guardado("idioma-aviso")) return;
  var fuso = "";
  try { fuso = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var regiao = /^America\/(Sao_Paulo|Bahia|Fortaleza|Recife|Belem|Maceio|Araguaina|Santarem|Manaus|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Eirunepe|Noronha)$/.test(fuso) ? "brasil"
    : /^(Europe\/|Atlantic\/(Azores|Madeira|Canary|Faroe|Reykjavik)$)/.test(fuso) ? "europa"
    : /^(Asia|Australia|Pacific)\//.test(fuso) ? "asia" : "";
  var pedido = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
  var primeiro = function (l) { return l.toLowerCase().split("-")[0]; };
  var exato = function (a) { return a.hreflang.toLowerCase() === pedido; };
  var mesmaLingua = function (a) { return primeiro(a.hreflang) === primeiro(pedido); };
  var daRegiao = links.filter(function (a) { return a.dataset.regiao === regiao; });
  // fora da Europa, as páginas europeias (em euro) são o último recurso: inglês vai para o internacional, e o espanhol
  // do México ainda acha o /es/
  var foraDaEuropa = links.filter(function (a) { return a.dataset.regiao !== "europa"; });
  var alvo = daRegiao.filter(exato)[0] || daRegiao.filter(mesmaLingua)[0]
    || (regiao === "europa" ? null : foraDaEuropa.filter(exato)[0] || foraDaEuropa.filter(mesmaLingua)[0]
      || links.filter(exato)[0] || links.filter(mesmaLingua)[0])
    || daRegiao.filter(function (a) { return a.hasAttribute("data-padrao"); })[0];
  if (!pedido || !alvo || alvo.hasAttribute("aria-current")) return;

  var aviso = document.createElement("div");
  aviso.className = "idioma-aviso";
  aviso.lang = alvo.hreflang;
  var link = document.createElement("a");
  link.href = alvo.getAttribute("href");
  link.hreflang = alvo.hreflang;
  link.textContent = alvo.dataset.sugestao + " \u2192";
  link.addEventListener("click", function () { guardado("idioma", alvo.hreflang); });
  var fechar = document.createElement("button");
  fechar.type = "button";
  fechar.setAttribute("aria-label", alvo.dataset.fechar);
  fechar.textContent = "\u00d7";
  fechar.addEventListener("click", function () {
    guardado("idioma-aviso", "fechado");
    aviso.remove();
  });
  aviso.appendChild(link);
  aviso.appendChild(fechar);
  // acima da régua do editor, dentro do topo
  var topo = document.querySelector(".topo");
  topo.insertBefore(aviso, topo.querySelector(".regua"));
})();
