"use strict";

/* =========================================================================
   Configuração do funil — fonte única de verdade.
   Cada etapa é um objeto declarativo; os renderers abaixo apenas o desenham.
   ========================================================================= */

const CHECKOUT_URL = "https://pay.kiwify.com.br/AALp7LS";
const OFFER_MINUTES = 15;

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.94 14.06 4 20m12.06-6.06L20 8m-9.06 1.94L4 4m12.06 5.94L20 16"/><circle cx="12" cy="12" r="3"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
};

const QUIZ = [
  {
    type: "intro",
    eyebrow: { icon: "spark", text: "Exclusivo • Diagnóstico gratuito" },
    title: 'Descobri o passo a passo que faz <span class="hl">iniciantes conseguirem os primeiros clientes</span> de higienização de estofados — sem medo de manchar o sofá.',
    lead: "O mesmo método que pessoas comuns usaram para sair do zero, atender com segurança e transformar sofás encardidos em renda toda semana — mesmo sem nenhuma experiência.",
    cta: "Quero descobrir",
  },
  {
    type: "choice",
    key: "perfil",
    stage: "Etapa 1 / Diagnóstico",
    title: "Qual é o seu caso hoje?",
    helper: "Selecione a opção que melhor descreve seu momento para personalizarmos o seu diagnóstico.",
    options: [
      "Quero começar do zero",
      "Já faço, mas quero cobrar melhor",
      "Tenho equipamento parado em casa",
      "Busco uma renda extra",
    ],
  },
  {
    type: "choice",
    key: "crenca",
    stage: "Etapa 2 / Percepção de mercado",
    title: "Você acredita que higienizar um sofá é só passar produto e esfregar?",
    options: ["Sim", "Não", "Não tenho certeza"],
  },
  {
    type: "insight",
    eyebrow: { icon: "bulb", text: "A verdade do mercado" },
    icon: "bulb",
    quote: "O que estraga um estofado não é a sujeira — é o produto errado, na ordem errada.",
    body: "Quem domina a <b>avaliação do tecido</b> e a <b>sequência correta do serviço</b> entrega resultado, cobra mais caro e nunca precisa devolver dinheiro. É exatamente isso que separa o amador de quem vive disso.",
    cta: "Entendi e quero continuar",
  },
  {
    type: "choice",
    key: "dor",
    stage: "Etapa 3 / O maior obstáculo",
    title: "O que mais te trava hoje?",
    helper: "Sua resposta define o diagnóstico técnico que vamos te entregar no final.",
    options: [
      "Medo de manchar o estofado",
      "Não sei o que cobrar",
      "Não sei quais produtos usar",
      "Não sei como conseguir clientes",
    ],
  },
  {
    type: "projection",
    eyebrow: { icon: "target", text: "Etapa 4 / Projeção de resultados" },
    title: "Imagine seguir um passo a passo que:",
    items: [
      "Avalia o tecido <b>antes</b> de você encostar qualquer produto",
      "Mostra a ordem certa do serviço e evita manchas e retrabalho",
      "Te diz exatamente <b>quanto cobrar</b> em cada atendimento",
      "Te dá confiança para fechar o primeiro cliente ainda esta semana",
      "Transforma sofás encardidos em renda recorrente no seu bairro",
    ],
    cta: "Quero continuar",
  },
  {
    type: "product",
    eyebrow: { icon: "spark", text: "Etapa 5 / O que você recebe" },
    title: "Tudo o que você recebe hoje",
    cover: {
      tag: "Guia prático digital",
      title: "Higienização de Estofados — do zero ao primeiro cliente",
      sub: "Manual completo para iniciantes",
    },
    items: [
      "6 módulos práticos, do zero ao primeiro atendimento",
      "Checklist do primeiro atendimento (PDF para imprimir)",
      "Tabela de precificação para nunca errar o preço",
      "3 bônus para acelerar seus primeiros serviços",
      "Acesso vitalício, em qualquer dispositivo",
    ],
    cta: "Continuar para o diagnóstico",
  },
  {
    type: "diagnosis",
    eyebrow: { icon: "check", text: "Diagnóstico individualizado disponível" },
    title: "Sua análise está pronta",
    image: "assets/resultado.png",
    body: "Com base nas suas respostas, você pode sair do zero e fazer seus primeiros atendimentos com segurança — usando o método certo de avaliação do tecido, escolha de produtos e precificação.",
    cta: "Ver minha recomendação",
  },
  {
    type: "offer",
    eyebrow: { icon: "spark", text: "Oportunidade exclusiva" },
    title: "Libere agora o seu acesso",
    lead: "Receba imediatamente o guia completo que ajuda iniciantes a higienizar estofados do jeito certo e conseguir os primeiros clientes — com total segurança.",
    cover: {
      tag: "Acesso imediato",
      title: "Higienização de Estofados — do zero ao primeiro cliente",
      sub: "Guia + 3 bônus + checklist",
    },
    priceOld: "R$ 97",
    priceNow: "19",
    priceCents: "90",
    benefits: [
      "Liberação e acesso imediato após a compra",
      "6 módulos práticos + checklist + tabela de preços",
      "3 bônus para acelerar seus primeiros serviços",
      "Acesso vitalício, em qualquer dispositivo",
    ],
    cta: "Liberar meu acesso",
    ctaSub: "Por apenas R$ 19,90 no Pix ou cartão",
  },
];

/* Recomendação técnica dinâmica — mapeada pela dor escolhida na etapa 3. */
const RECOMMENDATION_BY_PAIN = {
  "Medo de manchar o estofado":
    'Comece pelos módulos <b>"A ordem correta"</b> e <b>"Evitando manchas"</b>. Eles eliminam o erro nº 1 dos iniciantes e te dão segurança para não danificar nenhum tecido — reduzindo em até <span class="pop">90% o risco de retrabalho</span>.',
  "Não sei o que cobrar":
    'Vá direto ao módulo <b>"Cobrando certo"</b> + a tabela de precificação. Você deixa de chutar valor e passa a cobrar com confiança já no primeiro cliente — podendo <span class="pop">dobrar o seu ticket</span>.',
  "Não sei quais produtos usar":
    'Priorize o módulo <b>"Produtos sem erro"</b>. Saber o produto certo para cada tecido evita a <span class="pop">causa nº 1 de mancha</span> e ainda te poupa dinheiro com material desperdiçado.',
  "Não sei como conseguir clientes":
    'Foque no <b>checklist do primeiro atendimento</b> e nos bônus de captação. Eles mostram como abordar os primeiros clientes do seu bairro e gerar indicações — o caminho de quem fez <span class="pop">12 clientes fixos em 1 mês</span>.',
};
const DEFAULT_RECOMMENDATION =
  'Comece pela sequência <b>avaliação → produtos → ordem do serviço</b>. É o caminho que dá segurança ao iniciante e evita o erro que faz a maioria desistir no primeiro atendimento.';

/* =========================================================================
   Estado e navegação
   ========================================================================= */

const state = { index: 0, answers: {} };

const els = {
  stage: document.getElementById("stage"),
  fill: document.getElementById("progressFill"),
  pct: document.getElementById("progressPct"),
  back: document.getElementById("backBtn"),
};

const totalSteps = QUIZ.length;

function progressFor(index) {
  return Math.round(((index + 1) / totalSteps) * 100);
}

function goTo(index) {
  state.index = index;
  render();
}

function next() {
  if (state.index < totalSteps - 1) goTo(state.index + 1);
}

function back() {
  if (state.index > 0) goTo(state.index - 1);
}

function selectChoice(key, value) {
  if (key) state.answers[key] = value;
  next();
}

function restart() {
  state.answers = {};
  goTo(0);
}

/* =========================================================================
   Renderers — um por tipo de etapa. Cada um devolve HTML; o wiring de
   eventos é feito por delegação após a inserção no DOM.
   ========================================================================= */

const renderers = {
  intro: (s) => `
    <div class="step stagger">
      ${eyebrow(s.eyebrow)}
      <h1 class="q">${s.title}</h1>
      <p class="lead">${s.lead}</p>
      ${primaryButton(s.cta)}
      <div class="safe">${ICONS.lock}<span>Diagnóstico gratuito • Leva menos de 1 minuto</span></div>
    </div>`,

  choice: (s) => `
    <div class="step">
      ${stageLabel(s.stage)}
      <h2 class="q">${s.title}</h2>
      ${s.helper ? `<p class="helper">${s.helper}</p>` : ""}
      <div class="options stagger" role="group">
        ${s.options.map((opt) => optionButton(s.key, opt)).join("")}
      </div>
    </div>`,

  insight: (s) => `
    <div class="step">
      ${eyebrow(s.eyebrow, "warn")}
      <div class="insight">
        <div class="insight__ic">${ICONS[s.icon]}</div>
        <p class="insight__quote">${s.quote}</p>
        <p class="insight__body">${s.body}</p>
      </div>
      ${primaryButton(s.cta)}
    </div>`,

  projection: (s) => `
    <div class="step">
      ${eyebrow(s.eyebrow)}
      <h2 class="q">${s.title}</h2>
      <ul class="checklist stagger">
        ${s.items.map((it) => `<li><span class="ic">${ICONS.check}</span><span>${it}</span></li>`).join("")}
      </ul>
      ${primaryButton(s.cta)}
    </div>`,

  product: (s) => `
    <div class="step">
      ${eyebrow(s.eyebrow)}
      <h2 class="q">${s.title}</h2>
      ${coverBlock(s.cover)}
      <ul class="checklist stagger">
        ${s.items.map((it) => `<li><span class="ic">${ICONS.check}</span><span>${it}</span></li>`).join("")}
      </ul>
      ${primaryButton(s.cta)}
    </div>`,

  diagnosis: (s) => `
    <div class="step stagger">
      ${eyebrow(s.eyebrow)}
      <h2 class="q">${s.title}</h2>
      <div class="media" style="background-image:url('${s.image}')"></div>
      <div class="tags">
        <span class="tag tag--accent">${ICONS.user}${state.answers.perfil || "Quero começar do zero"}</span>
        <span class="tag tag--warn">${ICONS.alert}Dor: ${state.answers.dor || "Medo de manchar o estofado"}</span>
      </div>
      <p class="lead">${s.body}</p>
      <div class="reco">
        <span class="reco__ic">${ICONS.check}</span>
        <p class="reco__txt"><b>Recomendação técnica:</b> ${recommendation()}</p>
      </div>
      ${primaryButton(s.cta)}
    </div>`,

  offer: (s) => `
    <div class="step">
      <div class="timer">
        <span class="timer__label">${ICONS.clock} Desconto por tempo limitado!</span>
        <span class="timer__clock" id="timerClock">${formatClock(OFFER_MINUTES * 60)}</span>
      </div>
      <div class="stagger">
        ${eyebrow(s.eyebrow)}
        <h2 class="q">${s.title}</h2>
        <p class="lead">${s.lead}</p>
        ${coverBlock(s.cover)}
        <div class="price">
          <span class="price__badge">Oferta única</span>
          <span class="price__label">De ${s.priceOld} por apenas</span>
          <div class="price__row">
            <span class="price__old">${s.priceOld}</span>
            <span class="price__now">R$ ${s.priceNow}<span class="cents">,${s.priceCents}</span></span>
          </div>
          <p class="price__note">Pagamento único • Sem mensalidade • Pix ou cartão</p>
        </div>
        <ul class="checklist">
          ${s.benefits.map((b) => `<li><span class="ic">${ICONS.check}</span><span>${b}</span></li>`).join("")}
        </ul>
        <a class="cta" href="${CHECKOUT_URL}" target="_blank" rel="noopener">
          <span class="cta__main">${s.cta} ${ICONS.arrow}</span>
          <span class="cta__sub">${s.ctaSub}</span>
        </a>
        <div class="safe">${ICONS.lock}<span>Ambiente seguro</span><span class="sep">•</span>${ICONS.shield}<span>Garantia de 7 dias</span></div>
        <p class="helper" style="text-align:center;margin:14px auto 0;">Sua compra é protegida. Se as receitas e o método não funcionarem para você, é só pedir o reembolso integral em até 7 dias.</p>
        <div style="text-align:center;">
          <button class="restart" type="button" data-action="restart">${ICONS.refresh} Refazer diagnóstico</button>
        </div>
      </div>
    </div>`,
};

/* ---------- helpers de markup ---------- */

function eyebrow(eb, variant) {
  if (!eb) return "";
  const cls = variant === "warn" ? "eyebrow eyebrow--warn" : "eyebrow";
  return `<span class="${cls}">${ICONS[eb.icon] || ""}${eb.text}</span>`;
}

function stageLabel(text) {
  return text ? `<span class="eyebrow">${text}</span>` : "";
}

function optionButton(key, label) {
  return `<button class="option" type="button" data-choice="${key || ""}" data-value="${escapeAttr(label)}">
    <span class="option__tick">${ICONS.check}</span>
    <span>${label}</span>
  </button>`;
}

function primaryButton(label) {
  return `<button class="cta" type="button" data-action="next">
    <span class="cta__main">${label} ${ICONS.arrow}</span>
  </button>`;
}

function coverBlock(cover) {
  if (!cover) return "";
  return `<div class="cover">
    <div class="cover__tag">${cover.tag}</div>
    <div class="cover__title">${cover.title}</div>
    <div class="cover__sub">${cover.sub}</div>
    <div class="cover__rule"></div>
  </div>`;
}

function recommendation() {
  return RECOMMENDATION_BY_PAIN[state.answers.dor] || DEFAULT_RECOMMENDATION;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

/* =========================================================================
   Render principal + efeitos colaterais (progresso, botão voltar, timer)
   ========================================================================= */

let timerHandle = null;

function render() {
  const step = QUIZ[state.index];
  els.stage.innerHTML = renderers[step.type](step);

  const pct = progressFor(state.index);
  els.fill.style.width = pct + "%";
  els.pct.textContent = pct + "%";
  els.back.classList.toggle("is-visible", state.index > 0);

  window.scrollTo({ top: 0, behavior: "smooth" });

  stopTimer();
  if (step.type === "offer") startCountdown(OFFER_MINUTES * 60);
}

/* ---------- contador regressivo da oferta ---------- */

function formatClock(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startCountdown(seconds) {
  const clockEl = document.getElementById("timerClock");
  if (!clockEl) return;
  let remaining = seconds;
  timerHandle = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    clockEl.textContent = formatClock(remaining);
    if (remaining === 0) stopTimer();
  }, 1000);
}

function stopTimer() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
}

/* ---------- delegação de eventos ---------- */

els.stage.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-choice]");
  if (choice) { selectChoice(choice.dataset.choice, choice.dataset.value); return; }

  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "next") next();
  if (action.dataset.action === "restart") restart();
});

els.back.addEventListener("click", back);

render();
