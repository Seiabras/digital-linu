/* Digital Linu (6/11/2026; a linha do tempo de edição em 07/11/2026): tema com a foto, menu do celular, as trilhas
   (mostrar só uma), a sequência que se monta com a estimativa, o formulário que escreve a mensagem, a régua com a
   agulha que anda com a rolagem, as entradas ao rolar e o Raio-X. Sem biblioteca; sem JavaScript, a página continua
   legível (sem a régua, o filtro, o pacote e o Raio-X). */
(function () {
  "use strict";
  var raiz = document.documentElement;
  var menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  // Os textos no idioma da página (o bloco textos-js, escrito pelo ferramentas/gerar-idiomas.mjs) e o dinheiro na moeda
  // dela (data-moeda no <html>). {n}, {v}… são as partes que mudam.
  var T = {};
  try { T = JSON.parse(document.getElementById("textos-js").textContent); } catch (e) {}
  function tx(k, dados) {
    var s = T[k] === undefined ? k : T[k];
    Object.keys(dados || {}).forEach(function (d) { s = s.split("{" + d + "}").join(String(dados[d])); });
    return s;
  }

  /* 1. Tema: sem escolha, segue o sistema; o botão alterna e guarda */
  var botaoTema = document.querySelector("[data-tema]");
  var sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
  function escuroAgora() { return raiz.dataset.theme ? raiz.dataset.theme === "dark" : sistemaEscuro.matches; }
  function rotularTema() {
    var escuro = escuroAgora();
    botaoTema.setAttribute("aria-label", tx(escuro ? "tema_claro_rotulo" : "tema_escuro_rotulo"));
    botaoTema.title = tx(escuro ? "tema_claro" : "tema_escuro");
  }
  botaoTema.addEventListener("click", function () {
    raiz.dataset.theme = escuroAgora() ? "light" : "dark";
    guardar("tema", raiz.dataset.theme);
    rotularTema();
    fotografar(raiz.dataset.theme === "dark");
  });
  sistemaEscuro.addEventListener("change", rotularTema);
  rotularTema();

  /* 1b. A foto ao trocar o tema: o Linu, com a câmera na mão, tira a foto: o obturador fecha e abre, o flash, o Linu
        se mexe e a legenda conta a tomada. Se o
        visor estiver fora da tela, a mesma cena aparece num cartão no canto e some sozinha. Só ao toque, nunca em
        loop; com "reduzir movimento", só a legenda muda. */
  var visor = document.querySelector(".visor-tela");
  var legenda = document.querySelector("[data-visor-legenda]");
  var tempo = visor.querySelector(".visor-tempo");
  var trilhoAgulha = document.querySelector("[data-trilho-agulha]");
  var tomada = 1, segundos = 12, cartao = null, sumirCartao;
  function visorNaTela() {
    var r = visor.getBoundingClientRect();
    return r.bottom > 80 && r.top < window.innerHeight - 40;
  }
  function clicar(tela) {
    tela.classList.remove("clique");
    void tela.offsetWidth; // recomeça a animação se tocarem de novo no meio
    tela.classList.add("clique");
  }
  function fotografar(escuro) {
    tomada++;
    segundos += 3;
    var codigo = "00:00:" + String(segundos % 60).padStart(2, "0") + ":" + String((tomada * 7) % 24).padStart(2, "0");
    tempo.textContent = codigo;
    legenda.textContent = tx(escuro ? "tomada_escuro" : "tomada_claro", { n: tomada });
    // a agulha da barra de reprodução avança um passo a cada tomada (entre a entrada e a saída)
    trilhoAgulha.style.setProperty("--passo", String(10 + ((tomada - 1) * 12) % 90));
    if (menosMovimento.matches) return;
    if (visorNaTela()) { clicar(visor); return; }
    if (!cartao) {
      cartao = document.createElement("div");
      cartao.className = "visor-cartao";
      cartao.setAttribute("aria-hidden", "true");
      cartao.appendChild(visor.cloneNode(true));
      document.body.appendChild(cartao);
    }
    cartao.querySelector(".visor-tempo").textContent = codigo;
    cartao.classList.add("aberto");
    clicar(cartao.firstChild);
    clearTimeout(sumirCartao);
    sumirCartao = setTimeout(function () { cartao.classList.remove("aberto"); }, 1800);
  }

  /* 2. Menu do celular */
  var abrir = document.querySelector(".menu-abrir");
  var links = document.getElementById("menu-links");
  function fecharMenu() { abrir.setAttribute("aria-expanded", "false"); links.classList.remove("aberto"); }
  abrir.addEventListener("click", function () {
    var aberto = abrir.getAttribute("aria-expanded") === "true";
    abrir.setAttribute("aria-expanded", String(!aberto));
    abrir.setAttribute("aria-label", tx(aberto ? "menu_abrir" : "menu_fechar"));
    links.classList.toggle("aberto", !aberto);
  });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) fecharMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });

  /* 3. As trilhas: tocar no nome mostra só aquela trilha (as outras ficam caladas, só com o nome); tocar de novo, ou em
        "Todas as trilhas", volta tudo. O nome tocado fica no mesmo lugar da tela. */
  var timeline = document.querySelector("[data-timeline]");
  var trilhas = Array.prototype.slice.call(document.querySelectorAll(".trilha"));
  var servicos = Array.prototype.slice.call(document.querySelectorAll(".servico"));
  var botaoTodas = timeline.querySelector('[data-area="todas"]');
  botaoTodas.hidden = false;
  // a largura de cada clipe no computador acompanha o valor (o mais caro é o mais longo), de 1 a 1,8 vez
  servicos.forEach(function (s) {
    var v = Math.min(1500, Math.max(250, Number(s.dataset.preco) || 400));
    s.style.setProperty("--peso", (1 + (v - 250) / 1250 * 0.8).toFixed(2));
  });
  function filtrar(area, ancora) {
    var antes = ancora ? ancora.getBoundingClientRect().top : 0;
    timeline.querySelectorAll("[data-area]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.area === area));
    });
    trilhas.forEach(function (t) {
      var calar = area !== "todas" && t.dataset.trilha !== area;
      var voltou = !calar && t.classList.contains("muda");
      t.classList.toggle("muda", calar);
      if (voltou) {
        var clipes = t.querySelectorAll(".clipe");
        clipes.forEach(function (c) { c.classList.add("chegando"); });
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          clipes.forEach(function (c) { c.classList.remove("chegando"); });
        }); });
      }
    });
    if (ancora) window.scrollBy(0, ancora.getBoundingClientRect().top - antes);
  }
  timeline.addEventListener("click", function (e) {
    var b = e.target.closest("[data-area]");
    if (!b) return;
    var area = b.dataset.area;
    if (area !== "todas" && b.getAttribute("aria-pressed") === "true") area = "todas";
    filtrar(area, b.classList.contains("trilha-cabeca") ? b : null);
  });

  /* 4. O pacote: guardado no navegador, mostrado na sequência embaixo das trilhas (presa embaixo da tela no
        computador), na barra de baixo (celular e tablet) e no formulário */
  var nomes = {};
  var precos = {};
  var areaDe = {};
  servicos.forEach(function (s) {
    nomes[s.dataset.id] = s.querySelector("h3").textContent;
    areaDe[s.dataset.id] = s.dataset.cat;
    precos[s.dataset.id] = { valor: Number(s.dataset.preco) || 0, mensal: s.dataset.tipo === "mensal" };
  });
  // a estimativa "a partir de": o que é entrega única e o que é por mês, somados à parte
  var moeda = raiz.dataset.moeda || "BRL";
  var formato = null;
  try { formato = new Intl.NumberFormat(raiz.lang, { style: "currency", currency: moeda, maximumFractionDigits: 0 }); } catch (e) {}
  function dinheiro(v) { return formato ? formato.format(v) : moeda + "\u00a0" + v; }
  // a soma sem o “a partir de” (a barra de baixo usa assim) e com ele
  function soma(ids) {
    var unico = 0, mensal = 0;
    ids.forEach(function (id) { var p = precos[id]; if (!p) return; if (p.mensal) mensal += p.valor; else unico += p.valor; });
    var partes = [];
    if (unico) partes.push(dinheiro(unico));
    if (mensal) partes.push(tx("por_mes", { v: dinheiro(mensal) }));
    return partes.join(" + ");
  }
  function estimativa(ids) {
    var s = soma(ids);
    return s ? tx("a_partir", { v: s }) : "";
  }
  var escolhidos = [];
  try { escolhidos = (JSON.parse(ler("digital-pacote")) || []).filter(function (id) { return nomes[id]; }); } catch (e) {}

  var lista = document.querySelector("[data-pacote-lista]");
  var vazio = document.querySelector("[data-pacote-vazio]");
  var limpar = document.querySelector("[data-pacote-limpar]");
  var barra = document.querySelector("[data-barra]");
  var barraTexto = document.querySelector("[data-barra-texto]");
  var noFormulario = document.querySelector("[data-formulario-pacote]");
  var total = document.querySelector("[data-pacote-total]");
  var totalFormulario = document.querySelector("[data-formulario-total]");

  function nomesDoPacote() { return escolhidos.map(function (id) { return nomes[id]; }).join(tx("juncao")); }
  function contagem(n) { return tx(n === 1 ? "servicos_1" : "servicos_n", { n: n }); }
  function mostrarPacote() {
    guardar("digital-pacote", JSON.stringify(escolhidos));
    servicos.forEach(function (s) {
      var dentro = escolhidos.indexOf(s.dataset.id) >= 0;
      var b = s.querySelector("[data-adicionar]");
      b.setAttribute("aria-pressed", String(dentro));
      b.querySelector("[data-rotulo]").textContent = tx(dentro ? "no_pacote" : "adicionar");
      b.querySelector("use").setAttribute("href", dentro ? "#i-ok" : "#i-mais");
      s.classList.toggle("escolhido", dentro);
    });
    lista.textContent = "";
    escolhidos.forEach(function (id) {
      var li = document.createElement("li");
      li.dataset.cat = areaDe[id];
      li.style.setProperty("--peso", servicos.filter(function (s) { return s.dataset.id === id; })[0].style.getPropertyValue("--peso"));
      var tirar = document.createElement("button");
      tirar.type = "button";
      tirar.className = "pacote-tirar";
      tirar.dataset.tirar = id;
      tirar.setAttribute("aria-label", tx("tirar", { nome: nomes[id] }));
      tirar.textContent = "×";
      li.appendChild(document.createTextNode(nomes[id]));
      li.appendChild(tirar);
      lista.appendChild(li);
    });
    var n = escolhidos.length;
    vazio.hidden = n > 0;
    limpar.hidden = n === 0;
    barra.hidden = false;
    barra.classList.toggle("vazia", n === 0);   // vazia, só no celular (no tablet, o topo já tem o pedir)
    var est = estimativa(escolhidos);
    total.hidden = totalFormulario.hidden = !est;
    total.textContent = est ? tx("estimativa", { v: est }) : "";
    totalFormulario.textContent = est ? tx("estimativa_form", { v: est }) : "";
    barraTexto.textContent = !n ? tx("barra_vazia")
      : est ? tx("barra_total", { servicos: contagem(n), v: soma(escolhidos) }) : tx("barra_sem", { servicos: contagem(n) });
    noFormulario.textContent = n ? nomesDoPacote() : tx("pacote_nenhum");
    escreverMensagem();
  }
  function alternar(id) {
    var i = escolhidos.indexOf(id);
    if (i >= 0) escolhidos.splice(i, 1); else escolhidos.push(id);
    mostrarPacote();
  }
  timeline.addEventListener("click", function (e) {
    var b = e.target.closest("[data-adicionar]");
    if (b) alternar(b.closest(".servico").dataset.id);
  });
  lista.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tirar]");
    if (b) alternar(b.dataset.tirar);
  });
  limpar.addEventListener("click", function () { escolhidos = []; mostrarPacote(); });
  document.querySelectorAll("[data-escolher-pacote]").forEach(function (b) {
    b.addEventListener("click", function () {
      escolhidos = b.dataset.escolherPacote.split(" ");
      mostrarPacote();
      filtrar("todas");
      var alvo = document.getElementById("servicos");
      alvo.scrollIntoView({ behavior: menosMovimento.matches ? "auto" : "smooth" });
    });
  });
  // a barra de baixo some quando a sequência ou o formulário já estão à vista (não mostra o pacote duas vezes)
  if ("IntersectionObserver" in window) {
    var aVista = new Map();
    var olhar = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) { aVista.set(item.target, item.isIntersecting); });
      var algum = false;
      aVista.forEach(function (v) { algum = algum || v; });
      barra.classList.toggle("escondida", algum);
    }, { threshold: 0.15 });
    olhar.observe(document.getElementById("contato"));
    olhar.observe(document.getElementById("inicio"));
    olhar.observe(document.querySelector("[data-pacote]"));
  }

  /* 5. Formulário: validação na hora; “Enviar pelo formulário” manda daqui mesmo (chega no e-mail e no /admin da
        Família, desde 11/11/2026) e o WhatsApp abre com a mensagem pronta */
  var form = document.querySelector("[data-formulario]");
  function campo(k) { return document.getElementById(k); }
  var campos = { nome: campo("nome"), negocio: campo("negocio"), email: campo("email") };
  var avisos = { nome: tx("aviso_nome"), negocio: tx("aviso_negocio"), email: tx("aviso_email") };
  var EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
  // o que foi digitado não se perde ao recarregar
  ["nome", "email", "negocio", "mensagem"].forEach(function (k) {
    var v = ler("digital-" + k);
    if (v) campo(k).value = v;
    campo(k).addEventListener("input", function () { guardar("digital-" + k, campo(k).value); escreverMensagem(); });
  });
  function conferir(k, mostrar) {
    var v = campos[k].value.trim();
    var ok = k === "email" ? EMAIL.test(v) : v.length >= 2;
    if (mostrar || ok) {
      document.getElementById(k + "-erro").textContent = ok ? "" : avisos[k];
      campos[k].setAttribute("aria-invalid", String(!ok));
    }
    return ok;
  }
  Object.keys(campos).forEach(function (k) {
    campos[k].addEventListener("blur", function () { if (campos[k].value) conferir(k, true); });
    campos[k].addEventListener("input", function () { conferir(k, false); });
  });
  function texto() {
    var partes = [tx("msg_ola")];
    if (campo("nome").value.trim()) partes.push(tx("msg_nome", { v: campo("nome").value.trim() }));
    if (campo("negocio").value.trim()) partes.push(tx("msg_negocio", { v: campo("negocio").value.trim() }));
    if (escolhidos.length) {
      partes.push(tx("msg_pacote", { v: nomesDoPacote() }));
      partes.push(tx("msg_estimativa", { v: estimativa(escolhidos) }));
    }
    if (campo("mensagem").value.trim()) partes.push(campo("mensagem").value.trim());
    return partes.join("\n");
  }
  var whats = form.querySelector('[data-enviar="whatsapp"]');
  var enviar = form.querySelector('[data-enviar="formulario"]');
  var estado = form.querySelector("[data-formulario-status]");
  function escreverMensagem() {
    whats.href = "https://wa.me/5524981013398?text=" + encodeURIComponent(texto());
  }
  // o pedido também fica registrado (linuarquivos/servidor/linu-pedidos): sendBeacon não atrasa a abertura do WhatsApp
  // nem do e-mail e segue mesmo se a página fechar; se falhar, a conversa continua igual
  function dadosDo(canal) {
    var robo = form.querySelector('[name="site_extra"]');
    return {
      nome: campo("nome").value.trim(), negocio: campo("negocio").value.trim(), email: campo("email").value.trim(),
      pacote: nomesDoPacote(),
      estimativa: escolhidos.length ? estimativa(escolhidos) : "",
      mensagem: campo("mensagem").value.trim(), canal: canal, site_extra: robo ? robo.value : ""
    };
  }
  function registrar(canal) {
    try {
      var robo = form.querySelector('[name="site_extra"]');
      var dados = {
        nome: campo("nome").value.trim(), negocio: campo("negocio").value.trim(),
        pacote: nomesDoPacote(),
        estimativa: escolhidos.length ? estimativa(escolhidos) : "",
        mensagem: campo("mensagem").value.trim(), canal: canal, site_extra: robo ? robo.value : ""
      };
      if (navigator.sendBeacon) navigator.sendBeacon("/api/pedido", new Blob([JSON.stringify(dados)], { type: "application/json" }));
    } catch (e) {}
  }
  whats.addEventListener("click", function (e) {
    var ok = conferir("nome", true) & conferir("negocio", true);
    if (!ok) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    registrar("whatsapp");
    whats.classList.add("enviado");
    setTimeout(function () { whats.classList.remove("enviado"); }, 1600);
  });
  // o formulário: o e-mail passa a ser obrigatório; enquanto envia, o botão diz “Enviando…”; deu certo, a confirmação
  // fica escrita embaixo; falhou, o que foi digitado continua e o WhatsApp segue como saída
  enviar.addEventListener("click", function () {
    var ok = conferir("nome", true) & conferir("email", true) & conferir("negocio", true);
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    enviar.disabled = true;
    enviar.textContent = tx("enviando");
    estado.className = "formulario-status";
    estado.textContent = "";
    fetch("/api/pedido", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(dadosDo("formulario")) })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        enviar.textContent = tx("enviado");
        estado.className = "formulario-status ok";
        estado.textContent = tx("recebido", { email: campo("email").value.trim() });
        setTimeout(function () { enviar.disabled = false; enviar.textContent = tx("enviar_formulario"); }, 4000);
      })
      .catch(function () {
        enviar.disabled = false;
        enviar.textContent = tx("enviar_formulario");
        estado.className = "formulario-status erro";
        estado.textContent = tx("erro_envio");
      });
  });

  /* 6. Voltar ao topo, sem deixar o # no endereço */
  document.querySelector("[data-voltar]").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: menosMovimento.matches ? "auto" : "smooth" });
  });

  /* 7. Entradas ao rolar: js/movimento.js (o kit do linuarquivos), pelos atributos data-mov do index.html */

  /* 8. A régua do editor: a página é uma sequência. Cada seção com data-tc começa num tempo (em segundos); a agulha
        anda com a rolagem entre esses tempos, a leitura mostra o timecode (24 quadros por segundo) e a seção, e o link
        do menu da seção atual fica marcado. Só transform, só ao rolar (nada roda sozinho). */
  var faixa = document.querySelector("[data-regua-faixa]");
  var agulha = document.querySelector("[data-agulha]");
  var leituraTc = document.querySelector("[data-regua-tc]");
  var leituraSecao = document.querySelector("[data-regua-secao]");
  var secoes = Array.prototype.slice.call(document.querySelectorAll("main [data-tc]"));
  var tempoFim = Number(document.querySelector("[data-tc-fim]").dataset.tcFim);
  var linksMenu = {};
  links.querySelectorAll('a[href^="#"]:not(.botao)').forEach(function (a) { linksMenu[a.getAttribute("href").slice(1)] = a; });
  var marcas = secoes.map(function (s) {
    var m = document.createElement("span");
    m.className = "regua-marca";
    m.textContent = s.dataset.curto || s.dataset.nome;
    m.style.setProperty("--x", String(Number(s.dataset.tc) / tempoFim));
    if (Number(s.dataset.tc) > 0) faixa.insertBefore(m, agulha);
    return m;
  });
  function dois(n) { return String(n).padStart(2, "0"); }
  function timecode(t) {
    var s = Math.floor(t);
    return "00:" + dois(Math.floor(s / 60)) + ":" + dois(s % 60) + ":" + dois(Math.floor((t - s) * 24));
  }
  var atual = -1, pedido = false;
  function andar() {
    pedido = false;
    var topo = 104;
    var maximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progresso = Math.min(1, window.scrollY / maximo);
    // a linha de leitura desce de 104 px até o pé da tela conforme a página chega ao fim
    var linha = topo + progresso * (window.innerHeight - topo);
    var i = 0;
    for (var k = 0; k < secoes.length; k++) if (secoes[k].getBoundingClientRect().top <= linha) i = k;
    var r = secoes[i].getBoundingClientRect();
    var fimTrecho = i + 1 < secoes.length ? secoes[i + 1].getBoundingClientRect().top : document.querySelector("[data-tc-fim]").getBoundingClientRect().bottom;
    var t0 = Number(secoes[i].dataset.tc);
    var t1 = i + 1 < secoes.length ? Number(secoes[i + 1].dataset.tc) : tempoFim;
    var parte = Math.min(1, Math.max(0, (linha - r.top) / Math.max(1, fimTrecho - r.top)));
    var t = t0 + (t1 - t0) * parte;
    agulha.style.transform = "translateX(" + (t / tempoFim * faixa.clientWidth).toFixed(1) + "px)";
    leituraTc.textContent = timecode(t);
    if (i !== atual) {
      if (atual >= 0) {
        marcas[atual].classList.remove("atual");
        var antigo = linksMenu[secoes[atual].id];
        if (antigo) antigo.removeAttribute("aria-current");
      }
      atual = i;
      marcas[i].classList.add("atual");
      leituraSecao.textContent = secoes[i].dataset.nome;
      var novo = linksMenu[secoes[i].id];
      if (novo) novo.setAttribute("aria-current", "true");
    }
  }
  function pedirAndar() { if (!pedido) { pedido = true; requestAnimationFrame(andar); } }
  window.addEventListener("scroll", pedirAndar, { passive: true });
  window.addEventListener("resize", pedirAndar);
  andar();

  /* 9. Raio-X: cada "não" (ou "sim", no site) aponta um serviço, com o motivo; o resultado vai para o pacote */
  var RAIOX = {
    maps: { nao: ["meu-negocio", tx("rx_maps")] },
    perfil: { nao: ["perfil", tx("rx_perfil")] },
    posta: { nao: ["gestao", tx("rx_posta")] },
    video: { nao: ["reels", tx("rx_video")] },
    anuncio: { nao: ["meta", tx("rx_anuncio")] },
    marca: { nao: ["identidade", tx("rx_marca")] },
    whats: { nao: ["whatsapp", tx("rx_whats")] },
    site: { sim: ["seo", tx("rx_site_sim")] }
  };
  var perguntas = document.querySelectorAll("[data-pergunta]");
  var rxLista = document.querySelector("[data-raiox-lista]");
  var rxVazio = document.querySelector("[data-raiox-vazio]");
  var rxContagem = document.querySelector("[data-raiox-contagem]");
  var rxSite = document.querySelector("[data-raiox-site]");
  var rxUsar = document.querySelector("[data-raiox-usar]");
  var rxTotal = document.querySelector("[data-raiox-total]");
  var medidor = document.querySelectorAll("[data-medidor] span");
  var medidorMini = document.querySelectorAll("[data-medidor-mini] span");
  var rxMini = document.querySelector("[data-raiox-mini]");
  var rxMiniTexto = document.querySelector("[data-raiox-mini-texto]");
  rxMini.hidden = false;
  var rxIds = [];
  var respostas = {};
  try { respostas = JSON.parse(ler("digital-raiox")) || {}; } catch (e) {}
  function lerRaiox() {
    var n = 0;
    rxIds = [];
    rxLista.textContent = "";
    perguntas.forEach(function (f, i) {
      var k = f.dataset.pergunta;
      var marcada = f.querySelector("input:checked");
      var rec = marcada && RAIOX[k][marcada.value];
      // uma barra por pergunta: apagada sem resposta, clara sem falta, laranja quando falta algo
      medidor[i].className = medidorMini[i].className = !marcada ? "" : rec ? "falta" : "sim";
      if (!marcada) return;
      n++;
      respostas[k] = marcada.value;
      if (!rec) return;
      rxIds.push(rec[0]);
      var li = document.createElement("li");
      var b = document.createElement("b");
      b.textContent = nomes[rec[0]];
      li.appendChild(b);
      li.appendChild(document.createTextNode(rec[1]));
      rxLista.appendChild(li);
    });
    guardar("digital-raiox", JSON.stringify(respostas));
    rxContagem.textContent = tx("rx_contagem", { n: n, t: perguntas.length });
    rxMiniTexto.textContent = tx("rx_mini", { n: n, t: perguntas.length });
    if (n === perguntas.length && rxIds.length === 0) {
      rxIds = ["google-ads"];
      var li = document.createElement("li");
      var b = document.createElement("b");
      b.textContent = nomes["google-ads"];
      li.appendChild(b);
      li.appendChild(document.createTextNode(tx("rx_em_dia")));
      rxLista.appendChild(li);
    }
    rxVazio.hidden = rxIds.length > 0;
    rxTotal.hidden = rxIds.length === 0;
    rxTotal.textContent = rxIds.length ? tx("rx_total", { v: estimativa(rxIds) }) : "";
    rxSite.hidden = respostas.site !== "nao";
    rxUsar.hidden = rxIds.length === 0;
  }
  perguntas.forEach(function (f) {
    var k = f.dataset.pergunta;
    if (respostas[k]) {
      var r = f.querySelector('input[value="' + respostas[k] + '"]');
      if (r) r.checked = true;
    }
    f.addEventListener("change", lerRaiox);
  });
  rxUsar.addEventListener("click", function () {
    rxIds.forEach(function (id) { if (escolhidos.indexOf(id) < 0) escolhidos.push(id); });
    mostrarPacote();
    filtrar("todas");
    var rotulo = rxUsar.querySelector("[data-rotulo]");
    var icone = rxUsar.querySelector("use");
    rotulo.textContent = tx("no_pacote");
    icone.setAttribute("href", "#i-ok");
    setTimeout(function () { rotulo.textContent = tx("levar"); icone.setAttribute("href", "#i-mais"); }, 1600);
    document.getElementById("servicos").scrollIntoView({ behavior: menosMovimento.matches ? "auto" : "smooth" });
  });
  lerRaiox();

  // No celular (11/11/2026): as perguntas em cartões de lado, uma por vez. Responder leva à próxima sem resposta;
  // as setas e o deslizar também andam. No tablet e no computador fica a lista de antes.
  var faixaPerguntas = document.querySelector(".perguntas");
  var nav = document.querySelector("[data-perguntas-nav]");
  var pos = document.querySelector("[data-perguntas-pos]");
  var setas = document.querySelectorAll("[data-perguntas-ir]");
  var celular = window.matchMedia("(max-width: 699px)");
  function inicio(i) { return perguntas[i].offsetLeft - perguntas[0].offsetLeft; }
  function perguntaAtual() {
    var melhor = 0;
    for (var i = 1; i < perguntas.length; i++) if (Math.abs(inicio(i) - faixaPerguntas.scrollLeft) < Math.abs(inicio(melhor) - faixaPerguntas.scrollLeft)) melhor = i;
    return melhor;
  }
  function irPara(i) {
    i = Math.max(0, Math.min(perguntas.length - 1, i));
    faixaPerguntas.scrollTo({ left: inicio(i), behavior: menosMovimento.matches ? "auto" : "smooth" });
  }
  function marcar() {
    var i = perguntaAtual();
    pos.textContent = tx("rx_pos", { n: i + 1, t: perguntas.length });
    setas[0].disabled = i === 0;
    setas[1].disabled = i === perguntas.length - 1;
  }
  function modo() {
    faixaPerguntas.classList.toggle("em-cartoes", celular.matches);
    nav.hidden = !celular.matches;
    if (celular.matches) marcar();
  }
  setas.forEach(function (b) {
    b.addEventListener("click", function () {
      irPara(perguntaAtual() + Number(b.dataset.perguntasIr));
    });
  });
  faixaPerguntas.addEventListener("scroll", function () { if (celular.matches) marcar(); }, { passive: true });
  perguntas.forEach(function (f, i) {
    f.addEventListener("change", function () {
      if (!celular.matches) return;
      // a próxima sem resposta (depois desta; se não houver, a primeira sem resposta antes)
      var ordem = Array.prototype.slice.call(perguntas, i + 1).concat(Array.prototype.slice.call(perguntas, 0, i));
      var prox = ordem.filter(function (p) { return !p.querySelector("input:checked"); })[0];
      if (prox) setTimeout(function () { irPara(Array.prototype.indexOf.call(perguntas, prox)); }, 280);
    });
  });
  if (celular.addEventListener) celular.addEventListener("change", modo);
  modo();

  mostrarPacote();
})();
