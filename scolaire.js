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
    roadmap: [
      { subject: "Francais", title: "Lecture, ecriture et vocabulaire", copy: "Travailler les sons, comprendre de petits textes, enrichir le vocabulaire et produire des phrases claires." },
      { subject: "Maths", title: "Calcul et logique", copy: "Renforcer les tables, les problemes concrets, les longueurs, les mesures et les premieres fractions." },
      { subject: "Decouverte du monde", title: "Observer et expliquer", copy: "Identifier les saisons, les animaux, le corps humain, l'environnement et les reperes du quotidien." },
    ],
    milestones: [
      "Lire une consigne sans aide puis expliquer ce qu'il faut faire.",
      "Resoudre un petit probleme en montrant les etapes.",
      "Memoriser progressivement les tables et le vocabulaire frequent.",
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
    roadmap: [
      { subject: "Francais", title: "Grammaire, redaction et analyse", copy: "Revoir les classes grammaticales, les conjugaisons, l'argumentation simple et la lecture suivie des oeuvres." },
      { subject: "Maths", title: "Calcul, geometrie et fonctions", copy: "Fractions, proportionnalite, equations, geometrie plane et lecture de graphiques." },
      { subject: "Histoire-Geographie", title: "Reperes et methodes", copy: "Apprendre les dates, localiser les espaces, comprendre les documents et repondre avec des paragraphes organises." },
    ],
    milestones: [
      "Savoir faire une fiche claire apres chaque chapitre.",
      "Expliquer une notion avec un exemple personnel ou concret.",
      "Commencer les revisions plusieurs jours avant un controle.",
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
    roadmap: [
      { subject: "Francais-Philo", title: "Analyse, commentaire et dissertation", copy: "Structurer des arguments, analyser un texte, mobiliser les references et defendre une idee avec precision." },
      { subject: "Maths", title: "Modelisation et raisonnement", copy: "Fonctions, probabilites, suites, derivation, statistiques et resolution pas a pas." },
      { subject: "Sciences", title: "Demonstration et interpretation", copy: "Comprendre les mecanismes, exploiter des experiences, rediger une demarche et analyser des donnees." },
    ],
    milestones: [
      "Tenir un planning hebdomadaire avec objectifs par matiere.",
      "Refaire un exercice type sans regarder la correction.",
      "Produire une copie structuree dans le temps imparti.",
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
    roadmap: [
      { subject: "Methodologie", title: "Notes, bibliographie et synthese", copy: "Organiser les cours, citer correctement les sources, produire des plans et des syntheses exploitables." },
      { subject: "Analyse disciplinaire", title: "Approfondir les concepts", copy: "Relier theorie, TD, cas pratiques, lectures scientifiques et applications du domaine etudie." },
      { subject: "Production", title: "Memoire, expose et projet", copy: "Construire une problematique, argumenter, rediger, presenter et tenir les delais du semestre." },
    ],
    milestones: [
      "Transformer chaque cours en support reutilisable sous 24 heures.",
      "Planifier les gros rendus en sous-taches hebdomadaires.",
      "Relier les lectures aux concepts vus en cours et aux exercices.",
    ],
  },
];

const schoolThemes = [
  { id: "fractions", level: "ecole", subject: "Maths", theme: "Fractions", summary: "Comprendre moitie, tiers et quarts avec des objets ou des dessins.", skills: ["Partager une quantite", "Comparer des fractions simples", "Passer du dessin a l'ecriture"], methods: ["Utilise des pizzas, bandes ou rectangles", "Refais 3 exemples concrets avant l'exercice"], keywords: ["fractions", "moitie", "tiers", "quarts", "partage"] },
  { id: "lecture", level: "ecole", subject: "Francais", theme: "Lecture et comprehension", summary: "Lire un court texte, reperer le personnage, le lieu et l'action principale.", skills: ["Lire avec fluidite", "Trouver les informations importantes", "Repondre par phrase complete"], methods: ["Lire une premiere fois en entier", "Surligner les mots importants"], keywords: ["lecture", "texte", "comprehension", "vocabulaire"] },
  { id: "vivant", level: "ecole", subject: "Sciences", theme: "Le vivant et l'environnement", summary: "Observer les animaux, les plantes, le corps humain et les besoins pour vivre.", skills: ["Classer par categories", "Nommer les parties essentielles", "Expliquer avec ses mots"], methods: ["Dessine un schema simple", "Associe chaque notion a un exemple concret"], keywords: ["animaux", "plantes", "corps humain", "environnement", "sciences"] },
  { id: "proportionnalite", level: "college", subject: "Maths", theme: "Proportionnalite", summary: "Relier tableaux, pourcentages, echelles et situations de la vie courante.", skills: ["Trouver le coefficient", "Passer au pourcentage", "Verifier la coherence du resultat"], methods: ["Pose toujours le tableau", "Teste une regle de trois puis controle ton resultat"], keywords: ["proportionnalite", "pourcentage", "echelle", "tableau"] },
  { id: "grammaire", level: "college", subject: "Francais", theme: "Grammaire et conjugaison", summary: "Identifier les fonctions, les temps et accorder correctement dans la phrase.", skills: ["Reconnaitre sujet, verbe, complement", "Conjuguer aux temps frequents", "Corriger une phrase"], methods: ["Repere le verbe en premier", "Refais des phrases courtes avant les phrases complexes"], keywords: ["grammaire", "conjugaison", "accord", "phrase"] },
  { id: "rep-hg", level: "college", subject: "Histoire-Geographie", theme: "Reperes historiques et geographiques", summary: "Maitriser dates, cartes, frises et paragraphes argumentes.", skills: ["Memoriser des reperes", "Lire un document", "Construire un paragraphe organise"], methods: ["Fais une mini frise par chapitre", "Associe chaque date a un evenement et a un lieu"], keywords: ["histoire", "geographie", "dates", "cartes", "frise"] },
  { id: "dissertation", level: "lycee", subject: "Francais-Philo", theme: "Dissertation et commentaire", summary: "Construire une problematique, un plan clair et des arguments relies au texte ou au sujet.", skills: ["Analyser la question", "Trouver 2 ou 3 axes solides", "Rediger des transitions efficaces"], methods: ["Fais d'abord un brouillon tres structure", "Apprends des formulations pour introduire et conclure"], keywords: ["dissertation", "commentaire", "philosophie", "argumentation", "texte"] },
  { id: "probabilites", level: "lycee", subject: "Maths", theme: "Probabilites et statistiques", summary: "Comprendre variables, tableaux, arbres, moyenne, ecart et prise de decision.", skills: ["Lire un tableau", "Representer avec un arbre", "Interpreter un resultat"], methods: ["Note clairement les evenements", "Verifie toujours l'unite et la somme des probabilites"], keywords: ["probabilites", "statistiques", "moyenne", "arbre", "evenement"] },
  { id: "energie", level: "lycee", subject: "Sciences", theme: "Energie, forces et transformations", summary: "Expliquer les lois physiques de base, les conversions et les applications experimentales.", skills: ["Identifier les grandeurs", "Appliquer une formule", "Interpreter un graphique"], methods: ["Refais les experiences sous forme de schema", "Associe chaque formule a une unite"], keywords: ["energie", "forces", "physique", "graphique", "formule"] },
  { id: "methodo-univ", level: "universite", subject: "Methodologie", theme: "Recherche documentaire", summary: "Trouver, trier et citer des sources fiables pour un dossier, un memoire ou un expose.", skills: ["Poser une problematique", "Chercher avec des mots-cles", "Construire une bibliographie"], methods: ["Classe les sources des la premiere lecture", "Note resume, citation utile et idee centrale"], keywords: ["recherche", "bibliographie", "memoire", "sources", "documentaire"] },
  { id: "analyse-univ", level: "universite", subject: "Analyse disciplinaire", theme: "Analyse de cas et synthese", summary: "Comparer des theories, argumenter et produire une synthese personnelle sur un sujet complexe.", skills: ["Comparer plusieurs points de vue", "Extraire l'essentiel", "Construire une synthese claire"], methods: ["Fais un tableau auteur / idee / limite", "Termine chaque lecture par 5 lignes de synthese"], keywords: ["analyse", "synthese", "cas pratique", "theorie", "universite"] },
  { id: "oral", level: "universite", subject: "Production", theme: "Expose oral et presentation", summary: "Preparer un support clair, parler avec structure et repondre aux questions du public.", skills: ["Construire un plan oral", "Selectionner les idees essentielles", "Gerer le temps"], methods: ["Repete a voix haute avec chronometre", "Utilise une slide = une idee"], keywords: ["oral", "presentation", "expose", "slides", "universite"] },
];

const schoolState = {
  levelId: "college",
  tasks: JSON.parse(localStorage.getItem(SCHOOL_TASKS_KEY) ?? "[]"),
  searchTerm: "",
  searchLevel: "all",
  searchSubject: "all",
  activeThemeId: schoolThemes[0].id,
};

function activeLevel() {
  return schoolLevels.find((item) => item.id === schoolState.levelId) ?? schoolLevels[0];
}

function getThemeResults() {
  const query = schoolState.searchTerm.trim().toLowerCase();

  return schoolThemes.filter((theme) => {
    const matchesLevel = schoolState.searchLevel === "all" || theme.level === schoolState.searchLevel;
    const matchesSubject = schoolState.searchSubject === "all" || theme.subject === schoolState.searchSubject;
    const haystack = [theme.theme, theme.subject, theme.summary, ...theme.skills, ...theme.methods, ...theme.keywords].join(" ").toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesLevel && matchesSubject && matchesQuery;
  });
}

function activeTheme() {
  const results = getThemeResults();
  return schoolThemes.find((item) => item.id === schoolState.activeThemeId) ?? results[0] ?? schoolThemes[0];
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
      <span>Themes</span>
      <strong>${SITE.escapeHTML(String(schoolThemes.length))}</strong>
      <p>Fiches recherchables</p>
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

function renderRoadmap() {
  const root = document.querySelector("#school-roadmap");
  const level = activeLevel();

  root.innerHTML = level.roadmap
    .map(
      (item) => `
        <article class="study-card study-card-detailed">
          <p class="article-tag">${SITE.escapeHTML(item.subject)}</p>
          <h3>${SITE.escapeHTML(item.title)}</h3>
          <p>${SITE.escapeHTML(item.copy)}</p>
        </article>
      `,
    )
    .join("");
}

function renderMilestones() {
  const root = document.querySelector("#school-milestones");
  const level = activeLevel();

  root.innerHTML = `
    <h3>Objectifs de progression</h3>
    <ul class="feature-list">
      ${level.milestones.map((item) => `<li>${SITE.escapeHTML(item)}</li>`).join("")}
    </ul>
  `;
}

function renderSearchFilters() {
  const levelSelect = document.querySelector("#school-search-level");
  const subjectSelect = document.querySelector("#school-search-subject");
  const levelOptions = schoolLevels
    .map((level) => `<option value="${SITE.escapeHTML(level.id)}">${SITE.escapeHTML(level.label)}</option>`)
    .join("");
  const subjects = [...new Set(schoolThemes.map((theme) => theme.subject))];
  const subjectOptions = subjects
    .map((subject) => `<option value="${SITE.escapeHTML(subject)}">${SITE.escapeHTML(subject)}</option>`)
    .join("");

  levelSelect.innerHTML = `<option value="all">Tous les niveaux</option>${levelOptions}`;
  subjectSelect.innerHTML = `<option value="all">Toutes les matieres</option>${subjectOptions}`;
  levelSelect.value = schoolState.searchLevel;
  subjectSelect.value = schoolState.searchSubject;
}

function renderSearchResults() {
  const summary = document.querySelector("#school-search-summary");
  const root = document.querySelector("#school-search-results");
  const results = getThemeResults();

  if (!results.some((item) => item.id === schoolState.activeThemeId)) {
    schoolState.activeThemeId = results[0]?.id ?? schoolThemes[0].id;
  }

  const filters = [];
  if (schoolState.searchLevel !== "all") {
    filters.push(`niveau ${schoolLevels.find((level) => level.id === schoolState.searchLevel)?.label ?? schoolState.searchLevel}`);
  }
  if (schoolState.searchSubject !== "all") {
    filters.push(`matiere ${schoolState.searchSubject}`);
  }
  if (schoolState.searchTerm.trim()) {
    filters.push(`mot-cle \"${schoolState.searchTerm.trim()}\"`);
  }

  summary.textContent = `${results.length} theme(s) trouve(s)${filters.length ? ` pour ${filters.join(" / ")}` : " sur l'ensemble des fiches"}.`;

  if (!results.length) {
    root.innerHTML = '<div class="empty-state">Aucun theme ne correspond. Essaie un autre mot-cle, un autre niveau ou une autre matiere.</div>';
    renderThemeDetail();
    return;
  }

  root.innerHTML = results
    .map(
      (theme) => `
        <button class="theme-result-card ${theme.id === schoolState.activeThemeId ? "is-active" : ""}" type="button" data-theme-id="${SITE.escapeHTML(theme.id)}">
          <span>${SITE.escapeHTML(theme.subject)}</span>
          <h3>${SITE.escapeHTML(theme.theme)}</h3>
          <p>${SITE.escapeHTML(theme.summary)}</p>
          <small>${SITE.escapeHTML(schoolLevels.find((level) => level.id === theme.level)?.label ?? theme.level)}</small>
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.addEventListener("click", () => {
      schoolState.activeThemeId = button.dataset.themeId ?? schoolState.activeThemeId;
      renderSearchResults();
      renderThemeDetail();
    });
  });

  renderThemeDetail();
}

function renderThemeDetail() {
  const root = document.querySelector("#school-theme-detail");
  const theme = activeTheme();

  if (!theme || !getThemeResults().length) {
    root.innerHTML = `
      <h3>Fiche de travail</h3>
      <p>Selectionne ou recherche un theme pour afficher une fiche detaillee.</p>
    `;
    return;
  }

  const levelLabel = schoolLevels.find((level) => level.id === theme.level)?.label ?? theme.level;

  root.innerHTML = `
    <p class="article-tag">${SITE.escapeHTML(levelLabel)} - ${SITE.escapeHTML(theme.subject)}</p>
    <h3>${SITE.escapeHTML(theme.theme)}</h3>
    <p>${SITE.escapeHTML(theme.summary)}</p>
    <div class="theme-detail-block">
      <strong>Competences a travailler</strong>
      <ul class="feature-list">
        ${theme.skills.map((skill) => `<li>${SITE.escapeHTML(skill)}</li>`).join("")}
      </ul>
    </div>
    <div class="theme-detail-block">
      <strong>Methode conseillee</strong>
      <ul class="feature-list">
        ${theme.methods.map((method) => `<li>${SITE.escapeHTML(method)}</li>`).join("")}
      </ul>
    </div>
    <p><strong>Mots-cles utiles:</strong> ${SITE.escapeHTML(theme.keywords.join(", "))}</p>
  `;
}

function setupThemeSearch() {
  const form = document.querySelector("#school-search-form");
  const searchInput = document.querySelector("#school-search-input");
  const levelSelect = document.querySelector("#school-search-level");
  const subjectSelect = document.querySelector("#school-search-subject");
  const resetButton = document.querySelector("#school-search-reset");

  searchInput.addEventListener("input", () => {
    schoolState.searchTerm = searchInput.value;
    renderSearchResults();
  });

  levelSelect.addEventListener("change", () => {
    schoolState.searchLevel = levelSelect.value;
    renderSearchResults();
  });

  subjectSelect.addEventListener("change", () => {
    schoolState.searchSubject = subjectSelect.value;
    renderSearchResults();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    schoolState.searchTerm = searchInput.value;
    schoolState.searchLevel = levelSelect.value;
    schoolState.searchSubject = subjectSelect.value;
    renderSearchResults();
  });

  resetButton.addEventListener("click", () => {
    schoolState.searchTerm = "";
    schoolState.searchLevel = "all";
    schoolState.searchSubject = "all";
    searchInput.value = "";
    levelSelect.value = "all";
    subjectSelect.value = "all";
    renderSearchResults();
  });
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
  renderRoadmap();
  renderMilestones();
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderAllSchool();
  renderSearchFilters();
  renderSearchResults();
  renderStudyPlan();
  renderTasks();
  setupThemeSearch();
  setupStudyPlan();
  setupTasks();
});
