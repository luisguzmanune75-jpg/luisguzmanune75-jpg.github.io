const SCHOOL_TASKS_KEY = "sng_school_tasks";

const schoolLevels = [
  {
    id: "ecole",
    label: "Ecole",
    target: "Poser les bases",
    intro:
      "Le plus important ici est de comprendre, lire, compter et prendre confiance avec un rythme regulier et simple.",
    priorities: [
      { title: "Lire tous les jours", copy: "10 a 20 minutes de lecture courte pour enrichir le vocabulaire et la concentration." },
      { title: "Compter sans peur", copy: "Revoir additions, soustractions, tables et petits problemes concrets." },
      { title: "Bien recopier", copy: "Faire proprement ses devoirs aide deja a mieux apprendre." },
    ],
    support: [
      "Fais des sessions courtes puis une petite pause.",
      "Relis la consigne avant de repondre.",
      "Demande a expliquer avec un exemple concret si tu bloques.",
    ],
    methods: [
      "Une routine courte apres l'ecole vaut mieux qu'une longue session rare.",
      "Colorie, souligne et lis a voix haute pour retenir plus facilement.",
    ],
  },
  {
    id: "college",
    label: "College",
    target: "Organiser et comprendre",
    intro:
      "Le college demande surtout plus d'organisation: agenda, fiches simples, devoirs reguliers et methodes de revision.",
    priorities: [
      { title: "Fiches courtes", copy: "Resumer chapitre par chapitre avec dates, formules et definitions utiles." },
      { title: "Verifier les bases", copy: "Francais, maths et anglais doivent rester solides toute l'annee." },
      { title: "Agenda clair", copy: "Note les controles et avance de 2 a 3 jours au lieu d'attendre la veille." },
    ],
    support: [
      "Revois les erreurs de controle, pas seulement la note.",
      "Travaille une matiere difficile au debut de la session.",
      "Alterne apprentissage et exercices.",
    ],
    methods: [
      "Utilise la methode 25 minutes travail / 5 minutes pause.",
      "Prepare une mini fiche par chapitre au lieu de tout relire d'un coup.",
    ],
  },
  {
    id: "lycee",
    label: "Lycee",
    target: "Reviser de facon strategique",
    intro:
      "Le lycee demande plus d'autonomie, des revisions plus longues et une vraie strategie pour les controles et les examens.",
    priorities: [
      { title: "Methodes de dissertation", copy: "Travaille plan, argumentation, introduction et conclusion." },
      { title: "Exercices types", copy: "En maths et sciences, refaire plusieurs exercices standards est crucial." },
      { title: "Planning hebdo", copy: "Bloque des plages fixes pour chaque matiere et garde une marge avant les evaluations." },
    ],
    support: [
      "Fais un sujet type sous chronometre une fois par semaine.",
      "Classe tes chapitres en facile / moyen / urgent.",
      "Apprends a refaire sans regarder le cours.",
    ],
    methods: [
      "Une fiche ne doit garder que l'essentiel a memoriser.",
      "Travaille d'abord les chapitres a plus fort coefficient ou a plus faible maitrise.",
    ],
  },
  {
    id: "universite",
    label: "Universite",
    target: "Autonomie et profondeur",
    intro:
      "A l'universite, il faut gerer volume, autonomie, prises de notes, lectures longues, TD, projets et parfois memoire.",
    priorities: [
      { title: "Planifier le semestre", copy: "Repere partiels, rendus, memoires et deadlines des le debut." },
      { title: "Syntheses efficaces", copy: "Transforme les cours en notes exploitables, schemas, plans et references." },
      { title: "Travail profond", copy: "Bloque des sessions sans distraction pour lectures, exercices ou redaction." },
    ],
    support: [
      "Decoupe un gros travail en livrables hebdomadaires.",
      "Garde une bibliographie propre des que tu lis une source.",
      "Prepare les TD avec les notions avant de venir en cours.",
    ],
    methods: [
      "Le plus dur n'est pas de tout faire, mais de tenir un systeme stable.",
      "Concentre-toi sur comprehension, restitution et production personnelle.",
    ],
  },
];

const schoolState = {
  levelId: "college",
  tasks: JSON.parse(localStorage.getItem(SCHOOL_TASKS_KEY) ?? "[]"),
};

function activeLevel() {
  return schoolLevels.find((item) => item.id === schoolState.levelId) ?? schoolLevels[0];
}

function saveTasks() {
  localStorage.setItem(SCHOOL_TASKS_KEY, JSON.stringify(schoolState.tasks));
}

function renderPulse() {
  const root = document.querySelector("#school-pulse");
  const level = activeLevel();

  root.innerHTML = `
    <div class="pulse-card">
      <span>Niveau</span>
      <strong>${SITE.escapeHTML(level.label)}</strong>
      <p>${SITE.escapeHTML(level.target)}</p>
    </div>
    <div class="pulse-card">
      <span>Priorites</span>
      <strong>${SITE.escapeHTML(String(level.priorities.length))}</strong>
      <p>Axes de progression</p>
    </div>
    <div class="pulse-card">
      <span>Methode</span>
      <strong>${SITE.escapeHTML(String(level.methods.length))}</strong>
      <p>Conseils utiles</p>
    </div>
    <div class="pulse-card">
      <span>Taches</span>
      <strong>${SITE.escapeHTML(String(schoolState.tasks.length))}</strong>
      <p>Checklist locale</p>
    </div>
  `;
}

function renderLevelTabs() {
  const root = document.querySelector("#school-level-tabs");

  root.innerHTML = schoolLevels
    .map(
      (level) => `
        <button class="pill-button ${level.id === schoolState.levelId ? "is-active" : ""}" type="button" data-level-id="${SITE.escapeHTML(level.id)}">
          ${SITE.escapeHTML(level.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-level-id]").forEach((button) => {
    button.addEventListener("click", () => {
      schoolState.levelId = button.dataset.levelId ?? schoolState.levelId;
      renderAllSchool();
    });
  });
}

function renderBriefing() {
  const root = document.querySelector("#school-briefing");
  const level = activeLevel();

  root.innerHTML = `
    <h3>${SITE.escapeHTML(level.label)} - cap principal</h3>
    <p>${SITE.escapeHTML(level.intro)}</p>
    <p>
      Objectif du moment:
      <strong>${SITE.escapeHTML(level.target)}</strong>.
    </p>
  `;
}

function renderMethods() {
  const root = document.querySelector("#school-methods");
  const level = activeLevel();

  root.innerHTML = `
    <h3>Methode de travail</h3>
    <ul class="feature-list">
      ${level.methods.map((method) => `<li>${SITE.escapeHTML(method)}</li>`).join("")}
    </ul>
  `;
}

function renderFocus() {
  const root = document.querySelector("#school-focus");
  const level = activeLevel();

  root.innerHTML = level.priorities
    .map(
      (item) => `
        <article class="study-card">
          <p class="article-tag">Priorite</p>
          <h3>${SITE.escapeHTML(item.title)}</h3>
          <p>${SITE.escapeHTML(item.copy)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSupport() {
  const root = document.querySelector("#school-support");
  const level = activeLevel();

  root.innerHTML = level.support
    .map(
      (item) => `
        <article class="study-card">
          <p class="article-tag">Astuce</p>
          <p>${SITE.escapeHTML(item)}</p>
        </article>
      `,
    )
    .join("");
}

function buildStudyPlan(days, hours, goal) {
  const level = activeLevel();
  const totalHours = days * hours;
  const reviewShare = goal === "controle" ? 0.55 : goal === "memoire" ? 0.4 : 0.45;
  const practiceShare = goal === "projet" ? 0.4 : 0.35;
  const productionShare = 1 - reviewShare - practiceShare;

  return {
    totalHours,
    reviewHours: Math.round(totalHours * reviewShare),
    practiceHours: Math.round(totalHours * practiceShare),
    productionHours: Math.max(Math.round(totalHours * productionShare), 1),
    dailyBlocks: Math.max(Math.round(hours * 2), 1),
    level,
  };
}

function renderStudyPlan(days = 14, hours = 2, goal = "devoirs") {
  const root = document.querySelector("#study-plan-result");
  const plan = buildStudyPlan(days, hours, goal);

  root.innerHTML = `
    <h3>Plan suggere</h3>
    <p>
      Sur <strong>${SITE.escapeHTML(String(days))} jours</strong> avec
      <strong>${SITE.escapeHTML(String(hours))} h/jour</strong>, tu peux viser
      environ <strong>${SITE.escapeHTML(String(plan.totalHours))} heures</strong>
      de travail utile.
    </p>
    <div class="study-card-grid">
      <article class="study-card">
        <p class="article-tag">Revision</p>
        <h3>${SITE.escapeHTML(String(plan.reviewHours))} h</h3>
        <p>Relire, comprendre, refaire les notions.</p>
      </article>
      <article class="study-card">
        <p class="article-tag">Exercices</p>
        <h3>${SITE.escapeHTML(String(plan.practiceHours))} h</h3>
        <p>S'entrainer sur exercices, annales ou applications.</p>
      </article>
      <article class="study-card">
        <p class="article-tag">Production</p>
        <h3>${SITE.escapeHTML(String(plan.productionHours))} h</h3>
        <p>Rendre, rediger, finaliser ou s'entrainer a restituer.</p>
      </article>
    </div>
    <p>
      Vise <strong>${SITE.escapeHTML(String(plan.dailyBlocks))} blocs</strong>
      de travail par jour et garde au moins un court temps de recap final.
    </p>
    <p>
      Conseil adapte au niveau ${SITE.escapeHTML(plan.level.label)}:
      <strong>${SITE.escapeHTML(plan.level.methods[0])}</strong>
    </p>
  `;
}

function renderTasks() {
  const root = document.querySelector("#study-task-list");

  if (!schoolState.tasks.length) {
    root.innerHTML = '<div class="empty-state">Ajoute une tache pour commencer ton organisation.</div>';
    return;
  }

  root.innerHTML = schoolState.tasks
    .map(
      (task, index) => `
        <div class="task-item">
          <span>${SITE.escapeHTML(task)}</span>
          <button class="ghost-button" type="button" data-task-index="${SITE.escapeHTML(String(index))}">
            Retirer
          </button>
        </div>
      `,
    )
    .join("");

  root.querySelectorAll("[data-task-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.taskIndex);
      schoolState.tasks.splice(index, 1);
      saveTasks();
      renderPulse();
      renderTasks();
    });
  });
}

function setupStudyPlan() {
  const form = document.querySelector("#study-plan-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const days = Number(document.querySelector("#study-days").value) || 14;
    const hours = Number(document.querySelector("#study-hours").value) || 2;
    const goal = document.querySelector("#study-goal").value || "devoirs";
    renderStudyPlan(days, hours, goal);
  });
}

function setupTasks() {
  const form = document.querySelector("#study-task-form");
  const input = document.querySelector("#study-task-input");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();

    if (!value) {
      input.focus();
      return;
    }

    schoolState.tasks.unshift(value);
    schoolState.tasks = schoolState.tasks.slice(0, 12);
    input.value = "";
    saveTasks();
    renderPulse();
    renderTasks();
  });
}

function renderAllSchool() {
  renderPulse();
  renderLevelTabs();
  renderBriefing();
  renderMethods();
  renderFocus();
  renderSupport();
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderAllSchool();
  renderStudyPlan();
  renderTasks();
  setupStudyPlan();
  setupTasks();
});
