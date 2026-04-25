import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = {
  name: "Patrimoine Nouvelle Generation",
  shortName: "PNG Patrimoine",
  url: "https://patrimoine-nouvelle-generation.onrender.com",
  email: "contact@patrimoine-generation.fr",
  phone: "+33 1 89 70 45 18",
  author: "Camille Durand",
  updated: "Mis a jour en avril 2026",
  description:
    "Blog patrimoine nouvelle generation pour mieux gerer son argent, investir, reduire ses impots et preparer son avenir.",
};

const ensure = (p) => fs.mkdirSync(path.join(root, p), { recursive: true });
["assets/css", "assets/js", "assets/images", "articles"].forEach(ensure);

const write = (file, content) =>
  fs.writeFileSync(path.join(root, file), content.trimStart(), "utf8");

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const wordsToReading = (html) => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(6, Math.round(text.split(" ").length / 220));
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/images/logo-png.svg`,
  email: site.email,
  founder: site.author,
  sameAs: ["https://www.linkedin.com/", "https://x.com/"],
};

const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: "2026-04-25",
  dateModified: "2026-04-25",
  author: { "@type": "Person", name: site.author },
  publisher: {
    "@type": "Organization",
    name: site.name,
    logo: { "@type": "ImageObject", url: `${site.url}/assets/images/logo-png.svg` },
  },
  image: `${site.url}/assets/images/${article.image || "og-default.svg"}`,
  mainEntityOfPage: `${site.url}/articles/${article.slug}.html`,
  articleSection: article.category,
  keywords: article.keywords.join(", "),
  wordCount: article.body.replace(/<[^>]+>/g, " ").split(/\s+/).length,
});

const head = ({ title, description, canonical, image = "og-default.svg", type = "website", level = 0, schemas = [] }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.url}/assets/images/${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${site.url}/assets/images/${image}">
  <meta name="theme-color" content="#0f2743">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${level ? "../assets/css/style.css" : "assets/css/style.css"}">
  ${schemas
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n  ")}
</head>`;

const header = (level = 0) => {
  const prefix = level ? "../" : "";
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${prefix}index.html">
      <span class="brand-mark">PN</span>
      <span class="brand-text"><strong>Patrimoine</strong><em>Nouvelle Generation</em></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu">
      <span></span><span></span><span></span>
    </button>
    <nav id="site-nav" class="site-nav">
      <a href="${prefix}index.html">Accueil</a>
      <a href="${prefix}articles/index.html">Articles</a>
      <a href="${prefix}a-propos.html">A propos</a>
      <a href="${prefix}contact.html">Contact</a>
      <a href="${prefix}politique-confidentialite.html">Confidentialite</a>
    </nav>
  </div>
  <div class="container header-tools">
    <form class="search-shell" role="search">
      <label class="sr-only" for="site-search">Rechercher</label>
      <input id="site-search" type="search" placeholder="Rechercher un article, un mot-cle, un sujet" data-search-input>
      <button type="button" aria-label="Lancer la recherche">Recherche</button>
    </form>
    <div class="category-links">
      <a href="${prefix}articles/index.html#placements">Placements</a>
      <a href="${prefix}articles/index.html#immobilier">Immobilier</a>
      <a href="${prefix}articles/index.html#fiscalite">Fiscalite</a>
    </div>
  </div>
</header>`;
};

const footer = (level = 0) => {
  const prefix = level ? "../" : "";
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <h2>${site.name}</h2>
      <p>Des contenus patrimoniaux concrets, lisibles et orientés action pour une nouvelle generation d'investisseurs et d'epargnants.</p>
    </div>
    <div>
      <h2>Liens utiles</h2>
      <ul>
        <li><a href="${prefix}mentions-legales.html">Mentions legales</a></li>
        <li><a href="${prefix}politique-confidentialite.html">Politique de confidentialite</a></li>
        <li><a href="${prefix}plan-du-site.html">Plan du site</a></li>
        <li><a href="${prefix}contact.html">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2>Confiance</h2>
      <ul>
        <li>Contenus signes et dates de mise a jour affichees</li>
        <li>Approche pedagogique, non sensationnaliste</li>
        <li>Consentement cookies avant publicites</li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; 2026 ${site.name}. Tous droits reserves.</p>
  </div>
</footer>
<div class="mobile-anchor-ad" aria-label="Publicite mobile">Publicite</div>
<div class="cookie-banner" data-cookie-banner hidden>
  <div class="cookie-banner__content">
    <p>Nous utilisons des cookies necessaires au fonctionnement du site, ainsi que des cookies de mesure d'audience et, avec votre accord, des cookies publicitaires pour Google AdSense.</p>
    <div class="cookie-banner__actions">
      <button type="button" class="button button-primary" data-consent-action="accept">Tout accepter</button>
      <button type="button" class="button button-secondary" data-consent-action="reject">Refuser</button>
      <button type="button" class="button button-tertiary" data-consent-action="customize">Personnaliser</button>
    </div>
    <div class="cookie-banner__custom" data-cookie-custom hidden>
      <label><input type="checkbox" checked disabled> Cookies necessaires</label>
      <label><input type="checkbox" data-consent-analytics> Mesure d'audience</label>
      <label><input type="checkbox" data-consent-ads> Publicites personnalisees</label>
      <button type="button" class="button button-primary" data-consent-action="save-custom">Enregistrer mes choix</button>
    </div>
  </div>
</div>
<script src="${level ? "../assets/js/main.js" : "assets/js/main.js"}" defer></script>`;
};

const layout = ({ title, description, canonical, content, level = 0, image, type, schemas }) => `${head({
  title,
  description,
  canonical,
  image,
  type,
  level,
  schemas,
})}
<body>
${header(level)}
${content}
${footer(level)}
</body>
</html>
`;

const shareButtons = (url, title) => `<div class="share-buttons">
  <span>Partager</span>
  <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">Twitter</a>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
</div>`;

const articleCard = (article, level = 0) => {
  const prefix = level ? "" : "articles/";
  return `<article class="post-card" data-search-item data-search-text="${esc(
    `${article.title} ${article.description} ${article.category} ${article.keywords.join(" ")}`
  )}">
    <div class="post-card__meta"><span>${article.category}</span><span>${site.updated}</span></div>
    <h3><a href="${prefix}${article.slug}.html">${article.title}</a></h3>
    <p>${article.description}</p>
    <div class="post-card__footer">
      <span>${article.readingTime} min de lecture</span>
      <a href="${prefix}${article.slug}.html">Lire l'article</a>
    </div>
  </article>`;
};

const sourceList = (sources) =>
  `<section class="sources"><h2>Sources utiles</h2><ul>${sources
    .map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a></li>`)
    .join("")}</ul></section>`;

const faqSection = (items) => `<section class="faq-box">
  <h2>Questions frequentes</h2>
  ${items
    .map(
      (item) => `<details><summary>${item.q}</summary><p>${item.a}</p></details>`
    )
    .join("")}
</section>`;

const warning = `<section class="warning-box">
  <h2>Avertissement</h2>
  <p>Ce contenu est fourni a titre informatif uniquement et ne constitue pas un conseil en investissement.</p>
</section>`;

const makeArticleBody = (sections) => sections.join("\n");

const articles = [
  {
    slug: "investir-bourse-debutant-guide-complet-2026",
    title: "Investir en bourse pour les debutants : le guide complet 2026",
    description:
      "Compte-titres, PEA, ETF, gestion du risque, erreurs a eviter : le mode d'emploi concret pour commencer en bourse en 2026.",
    category: "Placements",
    image: "hero-marche.svg",
    keywords: ["investir en bourse debutant", "PEA", "ETF", "actions", "guide 2026"],
    intro:
      `<p>Commencer en bourse en 2026 n'a plus grand-chose a voir avec l'image d'Epinal du trader colle a six ecrans. Pour la plupart des particuliers, investir signifie surtout organiser une epargne reguliere, l'exposer intelligemment a la croissance de l'economie mondiale et tenir sur la duree. Dit autrement : la bourse n'est pas un casino si vous l'abordez avec une methode, un horizon clair et un cadre de risque respecte.</p>
      <p>Ce qui destabilise souvent les debutants, ce n'est pas la difficulte technique. C'est l'abondance de messages contradictoires. D'un cote, on vous promet des rendements a deux chiffres sans effort. De l'autre, on vous repete qu'il faut un niveau expert pour acheter la moindre action. La verite se situe entre les deux. Il faut comprendre quelques mecanismes essentiels, puis mettre en place un systeme simple que vous serez capable de suivre meme lorsque les marches reculent.</p>
      <p>En 2025, l'Autorite des marches financiers constatait encore une progression de l'activite des particuliers sur les actions et les ETF, avec plusieurs dizaines de milliers de nouveaux investisseurs chaque trimestre. Ce mouvement montre que la democratisation est reelle, mais il rappelle aussi un enjeu : il faut apprendre avant de cliquer. L'outil est devenu simple. La discipline, elle, reste la cle.</p>`,
    body: makeArticleBody([
      `<h2>Les fondations : pourquoi investir en bourse</h2>
      <p>La bourse sert a financer les entreprises cotees. Lorsque vous achetez une action, vous devenez proprietaire d'une fraction du capital d'une societe. Votre rendement peut venir de deux sources : la progression du cours et le dividende distribue. Selon l'AMF, investir en actions revient donc a parier sur la croissance des benefices des entreprises dans le temps. C'est un placement utile pour battre l'inflation a long terme, mais il expose a des fluctuations parfois fortes a court terme.</p>
      <p>Pour un epargnant de 25 a 45 ans, la logique patrimoniale est puissante. Si vous disposez d'un horizon d'au moins huit a dix ans, la volatilite a court terme devient plus supportable. Une baisse de 10 % ou 15 % sur une annee n'est pas agreable, mais elle n'a pas le meme impact si votre plan est construit sur quinze ans avec des versements mensuels.</p>`,
      `<h2>Quel support choisir : PEA ou compte-titres</h2>
      <p>Le compte-titres ordinaire est le plus souple. Il permet d'acheter des actions du monde entier, des ETF internationaux, des obligations, voire des produits plus complexes. En contrepartie, sa fiscalite est generalement moins avantageuse : les gains entrent dans le regime du PFU a 30 %, sauf option pour le bareme progressif.</p>
      <p>Le PEA, lui, reste le vehicule privilegie pour beaucoup d'investisseurs particuliers. L'AMF rappelle qu'il permet d'investir en actions europeennes et dans certains fonds eligibles avec une fiscalite allegee apres cinq ans. Le cadre est plus limite, mais il est parfaitement adapte a une strategie de long terme sobre et efficace.</p>
      <table>
        <thead><tr><th>Support</th><th>Atout principal</th><th>Limite principale</th></tr></thead>
        <tbody>
          <tr><td>PEA</td><td>Fiscalite attractive apres 5 ans</td><td>Univers d'investissement plus restreint</td></tr>
          <tr><td>Compte-titres</td><td>Acces mondial sans restriction majeure</td><td>Fiscalite moins douce</td></tr>
        </tbody>
      </table>`,
      `<h2>ETF, actions en direct, fonds : que choisir quand on debute</h2>
      <p>La plupart des debutants surestiment leur capacite a selectionner des actions individuelles. Or choisir quelques titres demande du temps, de la lecture financiere, une bonne gestion emotionnelle et une vraie capacite a accepter d'avoir tort. Les ETF simplifient radicalement le probleme. Un ETF indiciel replique un indice, par exemple le MSCI World ou le S&amp;P 500, ce qui permet d'investir dans des centaines d'entreprises en un seul ordre.</p>
      <p>Les ETF conviennent tres bien a une approche de pilotage patrimonial. Vous achetez la diversification, vous reduisez le risque specifique a une seule entreprise et vous limitez le besoin de suivre l'actualite heure par heure. L'AMF note d'ailleurs que l'interet des particuliers pour les ETF s'est fortement renforce ces dernieres annees, en particulier chez les investisseurs les plus jeunes.</p>
      <p>Les actions en direct ne sont pas interdites aux debutants, mais elles devraient rester une poche satellite. Une base en ETF, puis une petite enveloppe pour apprendre sur quelques titres, constitue souvent un meilleur compromis qu'un portefeuille entierement concentre sur trois valeurs a la mode.</p>`,
      `<h2>Combien investir et a quel rythme</h2>
      <p>Le meilleur montant est celui que vous pouvez tenir. Avant de penser rendement, construisez un socle : epargne de precaution, tresorerie disponible et absence de dette toxique. Ensuite, definissez un versement automatique mensuel. La regularite compte plus que le coup d'eclat. Cent euros investis tous les mois pendant dix ans valent mieux qu'une belle intention jamais executee.</p>
      <p>L'investissement progressif a aussi un interet psychologique. Il evite d'entrer en une seule fois juste avant une correction et vous habitue a voir les marches monter et baisser sans remettre en cause votre plan. Pour beaucoup d'actifs patrimoniaux, la reussite tient moins au point d'entree qu'au temps passe investi.</p>`,
      `<h2>La gestion du risque que tout debutant devrait connaitre</h2>
      <p>Votre vrai risque n'est pas seulement la volatilite. C'est l'abandon du plan au pire moment. Pour l'eviter, il faut definir une allocation adaptee a votre situation. Un profil qui achete un ETF actions a 100 % sans avoir jamais connu de baisse de marche peut paniquer au premier choc. Mieux vaut parfois demarrer avec 60 % actions et 40 % poches defensives, puis ajuster apres un ou deux cycles boursiers.</p>
      <p>La diversification geographique, sectorielle et monetaire reste un principe cardinal. Il faut aussi surveiller les frais : droits de garde, frais d'ordre, spread, frais annuels de l'ETF. Des frais apparemment faibles rongent fortement la performance au bout de quinze ans.</p>
      <p>Enfin, n'utilisez pas d'argent dont vous pourriez avoir besoin dans moins de trois ans. La bourse n'est pas le bon support pour un apport immobilier proche, des etudes a payer dans douze mois ou une tresorerie professionnelle sensible.</p>`,
      `<h2>Les erreurs classiques des nouveaux investisseurs</h2>
      <h3>Suivre les modes</h3>
      <p>Les debutants entrent souvent apres une hausse spectaculaire, quand le recit mediatico-commercial est deja partout. C'est vrai pour certaines valeurs technologiques, certaines cryptos et certains themes de niche. Un bon plan d'investissement ne depend pas d'un buzz du moment.</p>
      <h3>Multiplier les lignes sans logique</h3>
      <p>Avoir vingt lignes ne signifie pas etre diversifie si elles sont toutes exposees au meme secteur ou au meme type de risque. Mieux vaut un coeur de portefeuille simple et compréhensible.</p>
      <h3>Confondre horizon long et inertie</h3>
      <p>Investir long terme ne veut pas dire ne rien suivre. Il faut revoir son allocation, verifier les frais, garder une trace de ses objectifs et reevaluer sa capacite de risque apres un changement de vie.</p>`,
      `<h2>Une feuille de route simple pour demarrer en 30 jours</h2>
      <ol>
        <li>Constituez trois a six mois de depenses de securite sur des supports liquides.</li>
        <li>Choisissez votre enveloppe prioritaire : le plus souvent, le PEA si votre strategie le permet.</li>
        <li>Selectionnez un ou deux ETF larges, comprehensibles et a frais moderes.</li>
        <li>Mettez en place un versement automatique mensuel.</li>
        <li>Decidez a l'avance de votre comportement en cas de baisse de 15 %, 25 % et 35 %.</li>
        <li>Tenez un journal d'investissement pour noter vos regles et vos arbitrages.</li>
      </ol>`,
      `<h2>Ce qu'un debutant devrait retenir en 2026</h2>
      <p>La bourse reste un formidable outil de constitution patrimoniale, a condition de la sortir du registre de l'excitation. Les meilleurs investisseurs particuliers ne sont pas ceux qui devinent l'actualite du mois prochain. Ce sont ceux qui ont une methode, des frais contenus, des supports adaptes et une discipline simple. Si vous comprenez pourquoi vous investissez, sur quoi vous investissez et combien de temps vous pouvez rester investi, vous avez deja franchi l'essentiel du chemin.</p>`,
    ]),
    faq: [
      { q: "Faut-il attendre le bon moment pour commencer ?", a: "Pour un investisseur de long terme, mieux vaut surtout commencer avec une methode, puis investir regulierement plutot que d'attendre un point d'entree parfait." },
      { q: "Le PEA suffit-il pour debuter ?", a: "Oui, dans de nombreux cas. Il offre un bon cadre fiscal et permet d'utiliser des ETF et fonds eligibles adaptes a une strategie simple." },
      { q: "Peut-on commencer avec 100 euros par mois ?", a: "Oui. La cle est la regularite, pas le montant spectaculaire du premier versement." },
    ],
    sources: [
      { label: "AMF - Investir en actions cotees en bourse", url: "https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/actions-obligations/actions/investir-en-actions-cotees-en-bourse" },
      { label: "AMF - Activite des investisseurs particuliers en 2025", url: "https://www.amf-france.org/fr/actualites-publications/actualites/lactivite-des-investisseurs-particuliers-de-nouveau-en-progression" },
    ],
  },
  {
    slug: "assurance-vie-comparatif-meilleurs-contrats-en-ligne",
    title: "Assurance-vie : comparatif des meilleurs contrats en ligne",
    description:
      "Comment comparer Linxea, Yomoni et les autres contrats en ligne : frais, fonds euros, ETF, gestion pilotee et fiscalite.",
    category: "Placements",
    image: "hero-assurance-vie.svg",
    keywords: ["assurance vie en ligne", "Linxea", "Yomoni", "frais assurance vie", "comparatif"],
    intro:
      `<p>L'assurance-vie reste l'un des outils patrimoniaux les plus polyvalents du marche francais. Elle permet de loger une poche securisee, d'investir sur des unites de compte, d'organiser une transmission et, dans certains cas, de preparer un complement de revenus. Sa popularite n'est pas un hasard : bien utilisee, elle sait repondre a plusieurs objectifs avec un seul cadre juridique et fiscal.</p>
      <p>Le probleme, c'est que tous les contrats ne se valent pas. La difference entre un contrat bancassurance charge en frais et un contrat en ligne bien calibre peut representer des milliers d'euros sur quinze ans. Pour un epargnant de 25 a 45 ans, le vrai sujet n'est donc pas de savoir s'il faut une assurance-vie, mais laquelle choisir selon ses usages.</p>
      <p>Le ministere de l'Economie rappelle que la fiscalite de l'assurance-vie devient particulierement interessante en cas de rachat apres huit ans, mais encore faut-il que le support soit performant et flexible. C'est sur ce point que les contrats en ligne ont nettement fait bouger le marche.</p>`,
    body: makeArticleBody([
      `<h2>Pourquoi l'assurance-vie reste un pilier patrimonial</h2>
      <p>Un bon contrat d'assurance-vie remplit trois fonctions. D'abord, il offre une poche de stabilite via le fonds en euros, utile pour une epargne de moyen terme ou une reserve moins volatile que les actions. Ensuite, il ouvre l'acces a des unites de compte : OPCVM, SCPI, ETF, private assets selon les contrats. Enfin, il dispose d'un cadre successoral specifique qui peut etre tres utile dans une strategie de transmission.</p>
      <p>Cette polyvalence en fait un excellent outil de second rang apres l'epargne de precaution et, selon les profils, en parallele du PEA. L'assurance-vie n'est pas necessairement le support le plus agressif pour chercher de la performance pure, mais c'est souvent l'un des meilleurs pour mixer souplesse, fiscalite et architecture de portefeuille.</p>`,
      `<h2>Les criteres qui comptent vraiment dans un comparatif</h2>
      <h3>Les frais</h3>
      <p>Les frais sur versement doivent idealement etre nuls en ligne. Les frais de gestion annuels doivent rester competitifs, en particulier sur les unites de compte. Regardez aussi les frais d'arbitrage, les frais specifiques des supports et, en gestion pilotee, les frais additionnels du mandat.</p>
      <h3>La qualite des supports</h3>
      <p>Un contrat moderne doit proposer autre chose qu'une vitrine de fonds charges et redondants. La presence d'ETF, de SCPI, d'obligations datées ou de profils geres de facon lisible change beaucoup la donne. Ce n'est pas la quantite brute de supports qui compte, mais leur pertinence et leur cout.</p>
      <h3>Le fonds en euros</h3>
      <p>Le rendement passe, meme utile a regarder, ne doit pas etre le seul critere. Il faut aussi verifier les conditions d'acces, les contraintes de part en unites de compte, la politique de bonus, le niveau de reserve et la regularite historique.</p>`,
      `<h2>Lecture pratique des principaux profils de contrats</h2>
      <table>
        <thead><tr><th>Profil de contrat</th><th>Ideal pour</th><th>Point de vigilance</th></tr></thead>
        <tbody>
          <tr><td>Contrat en ligne ouvert</td><td>Autonomes cherchant ETF et faibles frais</td><td>Demande un minimum de pilotage</td></tr>
          <tr><td>Gestion pilotee digitale</td><td>Epargnants deleguant les arbitrages</td><td>Frais parfois plus eleves</td></tr>
          <tr><td>Contrat bancaire traditionnel</td><td>Clients voulant tout centraliser</td><td>Frais et architecture souvent moins competitifs</td></tr>
        </tbody>
      </table>
      <p>Dans ce paysage, des noms comme Linxea sont souvent cites pour la profondeur de l'offre et les frais maitrises. Yomoni, de son cote, est frequemment retenu pour la simplicite de l'experience utilisateur et la delegation via gestion pilotee. Le bon choix depend donc moins de la marque que de la facon dont vous voulez gerer votre argent.</p>`,
      `<h2>Linxea, Yomoni et les autres : comment se positionner</h2>
      <p>Linxea convient bien aux profils qui aiment construire leur allocation. L'interet tient a l'acces a plusieurs contrats, a une gamme large de supports et a des frais competitifs. C'est un bon terrain pour un investisseur qui veut assembler lui-meme un portefeuille avec ETF, fonds euros et parfois SCPI.</p>
      <p>Yomoni s'adresse davantage a ceux qui veulent une experience plus encadree. Le parcours de souscription est simple, l'allocation est pilotee, les arbitrages sont geres par la maison et le discours patrimonial est clair. En contrepartie, la personnalisation est plus faible qu'avec un contrat ultra-ouvert. Pour un investisseur debordé ou peu interesse par le suivi, cette simplicite peut etre un vrai avantage.</p>
      <p>D'autres contrats en ligne peuvent etre tres pertinents, notamment lorsque vous cherchez un fonds en euros particulier, une offre SCPI solide ou une architecture ETF plus complete. La bonne pratique consiste a comparer au moins cinq axes : frais, fonds euros, univers d'investissement, souplesse des arbitrages, qualite du service client.</p>`,
      `<h2>Quelle allocation pour un epargnant de 30 ou 40 ans</h2>
      <p>Un contrat d'assurance-vie n'a pas vocation a etre rempli uniformement de fonds euros. Pour un investisseur avec un horizon long, la poche en unites de compte doit souvent jouer un role central. Vous pouvez imaginer une ossature simple : une part de fonds euros pour la stabilite, une poche ETF monde pour la croissance, puis eventuellement une brique immobiliere ou obligataire selon votre tolerance au risque.</p>
      <p>Le danger classique est de choisir le contrat sur la seule base du rendement du fonds euros, puis de laisser dormir l'ensemble a 100 % en support securise pendant dix ans. Patrimonialement, cela peut etre coherent pour une epargne de projet proche, mais beaucoup moins pour une epargne de long terme.</p>`,
      `<h2>Fiscalite : ce qu'il faut vraiment comprendre</h2>
      <p>Le ministere de l'Economie rappelle que seule la part de gains comprise dans un rachat est imposable. La fiscalite depend notamment de l'anciennete du contrat et du montant des primes versees. Avant huit ans, le PFU domine generalement. Apres huit ans, le regime devient plus favorable, notamment dans la limite de certains seuils. Cette dimension incite a ouvrir tot un bon contrat, meme avec un montant modeste, afin de faire courir l'anciennete fiscale.</p>
      <p>Autre point cle : l'assurance-vie n'est pas seulement un outil de rendement. C'est aussi un contenant patrimonial. Ouvrir un contrat aujourd'hui peut etre judicieux meme si vous n'y versez que quelques centaines d'euros au depart, a condition d'avoir choisi une bonne enveloppe.</p>`,
      `<h2>Les erreurs a eviter</h2>
      <p>Erreur numero un : garder un vieux contrat a frais sur versement par simple inertie. Erreur numero deux : confondre securite et immobilisme. Erreur numero trois : multiplier les contrats sans logique ni allocation globale. Erreur numero quatre : ignorer la clause beneficiaire, alors qu'elle fait partie integrante de la valeur patrimoniale du produit.</p>
      <p>Un bon contrat mal pilote peut faire moins bien qu'un contrat moyen correctement utilise. L'outil compte, mais la coherence d'ensemble compte encore plus.</p>`,
      `<h2>Mon cadre de lecture en 2026</h2>
      <p>Si vous aimez gerer vous-meme et optimiser les frais, privilegiez un contrat en ligne ouvert, notamment ceux souvent compares autour de Linxea. Si vous voulez une solution deleguee, lisible et rapide a mettre en place, les offres type Yomoni peuvent convenir. Dans tous les cas, ouvrez tot, surveillez les frais, regardez la qualite des supports et n'oubliez jamais que l'assurance-vie est un outil au service d'un objectif, pas un produit a acheter parce qu'il est populaire.</p>`,
    ]),
    faq: [
      { q: "Faut-il avoir plusieurs assurances-vie ?", a: "Oui, cela peut avoir du sens pour diversifier les assureurs, les fonds euros et les styles de gestion, a condition de garder une vision d'ensemble." },
      { q: "L'assurance-vie remplace-t-elle le PEA ?", a: "Non. Le PEA est souvent plus adapte pour les actions europeennes a long terme, tandis que l'assurance-vie est plus polyvalente sur le plan patrimonial." },
      { q: "Peut-on ouvrir une assurance-vie avec peu d'argent ?", a: "Oui. Beaucoup de contrats en ligne sont accessibles avec quelques centaines d'euros, parfois moins." },
    ],
    sources: [
      { label: "Ministere de l'Economie - Fiscalite de l'assurance-vie", url: "https://www.economie.gouv.fr/particuliers/quelle-fiscalite-lassurance-vie" },
      { label: "Service Public - Assurance-vie et fiscalite", url: "https://www.service-public.fr/" },
    ],
  },
  {
    slug: "etf-comment-investir-sans-se-ruiner-et-sans-stress",
    title: "ETF : comment investir sans se ruiner et sans stress",
    description:
      "Pourquoi les ETF seduisent les investisseurs en 2026 et comment les utiliser simplement pour construire un portefeuille robuste.",
    category: "Placements",
    image: "hero-etf.svg",
    keywords: ["ETF", "investir ETF", "ETF monde", "portefeuille passif", "PEA ETF"],
    intro:
      `<p>Les ETF ont change la facon dont les particuliers investissent. Ils permettent d'acheter en une seule ligne l'equivalent d'un panier d'actions ou d'obligations, avec des frais generalement plus faibles que de nombreux fonds actifs. Ce succes n'est pas un effet de mode : il repond a un besoin concret de simplicite, de diversification et de lisibilite.</p>
      <p>L'AMF observe d'ailleurs une forte progression de l'activite des particuliers sur les ETF, avec un attrait marque chez les nouveaux investisseurs. Cela s'explique facilement. Quand on veut se constituer un patrimoine sans passer ses soirees a analyser des bilans, les ETF offrent un raccourci puissant.</p>
      <p>Encore faut-il savoir les utiliser avec bon sens. Tous les ETF ne se ressemblent pas, et la simplicite apparente peut masquer des choix importants : indice suivi, devise, mode de replication, frais, enveloppe fiscale. L'objectif de ce guide est de vous aider a investir avec moins de stress et plus de methode.</p>`,
    body: makeArticleBody([
      `<h2>Qu'est-ce qu'un ETF, concretement</h2>
      <p>Un ETF, ou fonds indiciel cote, cherche a reproduire la performance d'un indice. Au lieu de choisir vous-meme cinquante ou cent entreprises, vous achetez un produit qui suit par exemple un indice mondial, europeen, americain ou sectoriel. Le resultat, c'est un acces tres large au marche avec peu d'ordres a passer.</p>
      <p>Cette logique a deux consequences utiles. D'abord, elle reduit le risque lie a une entreprise particuliere. Ensuite, elle diminue la tentation de vouloir battre le marche en permanence. Pour beaucoup d'epargnants, c'est un gain de serenite plus important encore que le gain de performance.</p>`,
      `<h2>Pourquoi les ETF conviennent bien aux 25-45 ans</h2>
      <p>Entre 25 et 45 ans, la priorite patrimoniale consiste souvent a empiler plusieurs objectifs en meme temps : constituer un apport, preparer la retraite, garder de la souplesse, absorber les changements de vie. Les ETF repondent bien a cette phase parce qu'ils permettent de construire rapidement une poche de croissance mondiale sans immobiliser du temps de gestion excessive.</p>
      <p>Ils s'integrent aussi facilement a un schema d'investissement programme. Vous pouvez acheter chaque mois le meme ETF monde dans votre PEA ou votre compte-titres, sans essayer d'anticiper le prochain mouvement de marche. Cette repetition simple est une force.</p>`,
      `<h2>Les criteres essentiels pour choisir un ETF</h2>
      <table>
        <thead><tr><th>Critere</th><th>Pourquoi c'est important</th><th>Bon reflexe</th></tr></thead>
        <tbody>
          <tr><td>Indice suivi</td><td>Determine votre diversification</td><td>Comprendre ce que vous achetez avant tout</td></tr>
          <tr><td>Frais annuels</td><td>Impact direct sur la performance nette</td><td>Comparer les ETF similaires</td></tr>
          <tr><td>Enveloppe</td><td>Influence fiscalite et accessibilite</td><td>Verifier l'eligibilite PEA si c'est votre support</td></tr>
          <tr><td>Taille et liquidite</td><td>Confort d'execution et perennite du produit</td><td>Privilegier les emetteurs solides</td></tr>
        </tbody>
      </table>
      <p>Un investisseur debutant n'a pas besoin d'une collection d'ETF exotiques. Un ou deux produits larges bien choisis suffisent souvent pour couvrir l'essentiel du portefeuille. La sophistication prematuree est rarement une source de meilleure gestion.</p>`,
      `<h2>ETF capitalisant ou distribuant</h2>
      <p>Un ETF distribuant verse les dividendes perçus, tandis qu'un ETF capitalisant les reinvestit automatiquement. Pour une logique de capitalisation a long terme, beaucoup d'epargnants prefèrent les versions capitalisantes, car elles simplifient la gestion et automatisent le reinvestissement. Un ETF distribuant peut toutefois convenir si vous cherchez deja a completer des revenus.</p>
      <p>Le bon choix depend donc moins d'un soi-disant meilleur format que de votre objectif. Pour accumuler, la capitalisation est souvent plus confortable. Pour piloter des flux, la distribution peut faire sens.</p>`,
      `<h2>Combien d'ETF faut-il vraiment</h2>
      <p>Le mythe du portefeuille parfait pousse souvent a empiler un ETF monde, un ETF Europe, un ETF S&amp;P 500, un ETF dividendes, un ETF technologies propres, un ETF IA, un ETF small caps et un ETF immobilier. Le resultat n'est pas toujours une meilleure diversification : c'est parfois juste un portefeuille plus difficile a comprendre.</p>
      <p>Pour beaucoup de foyers, une construction a deux etages suffit : un coeur de portefeuille tres large, puis une poche satellite eventuelle pour des convictions ou des biais assumés. Le coeur doit porter l'essentiel du capital. C'est lui qui assure la robustesse dans la duree.</p>`,
      `<h2>Les risques a ne pas sous-estimer</h2>
      <p>Un ETF reste expose au marche qu'il suit. Si l'indice baisse, l'ETF baisse. L'outil n'annule donc pas le risque actions. Il le rend simplement plus diversifie. Il faut aussi comprendre la devise de cotation, la devise des actifs sous-jacents et les implications d'une couverture de change lorsque celle-ci existe.</p>
      <p>Autre point pratique : n'achetez pas un ETF que vous ne seriez pas capable d'expliquer en deux phrases. Si vous ne savez pas dire ce qu'il contient, quel indice il replique et pourquoi il a sa place dans votre portefeuille, c'est probablement qu'il est trop complexe pour votre besoin actuel.</p>`,
      `<h2>Une methode sans stress pour investir en ETF</h2>
      <p>La meilleure methode est souvent la plus sobre : definir votre horizon, choisir l'enveloppe, selectionner un ETF coeur, programmer un investissement recurrent, puis revisiter l'allocation une ou deux fois par an. Cette approche evite la fatigue decisionnelle et limite les arbitrages emotionnels.</p>
      <p>Si vous avez peur d'investir juste avant une baisse, etalez votre entree en plusieurs fois. Si vous avez peur de manquer le bon moment, rappelez-vous que la plupart des grandes strategies patrimoniales gagnent avant tout grace a la duree d'exposition, pas grace a un timing parfait.</p>`,
      `<h2>Ce qu'il faut retenir</h2>
      <p>Les ETF ne sont pas magiques, mais ils rendent l'investissement beaucoup plus accessible. Leur force tient a trois mots : diversification, cout, discipline. Dans un patrimoine moderne, ce triptyque a beaucoup de valeur. Si vous restez simple, coherent et patient, les ETF peuvent devenir l'une des briques les plus efficaces de votre strategie a long terme.</p>`,
    ]),
    faq: [
      { q: "Un ETF est-il moins risque qu'une action ?", a: "Oui sur le risque specifique, car il diversifie sur plusieurs actifs. Non si l'on parle du risque global du marche qu'il suit." },
      { q: "Puis-je avoir un seul ETF monde ?", a: "Oui, c'est meme une approche parfaitement defendable pour une base de portefeuille simple." },
      { q: "Les ETF sont-ils adaptes au PEA ?", a: "Oui, certains ETF sont specifiquement eligibles au PEA et permettent une bonne exposition diversifiee." },
    ],
    sources: [
      { label: "AMF - Les ETF seduisent les nouveaux investisseurs", url: "https://www.amf-france.org/en/news-publications/news-releases/amf-news-releases/etfs-win-over-newcomers-they-invest-stock-market" },
      { label: "AMF - Activite des investisseurs particuliers sur les ETF", url: "https://www.amf-france.org/fr/actualites-publications/actualites/etf-lactivite-des-investisseurs-particuliers-en-forte-progression-en-2024" },
    ],
  },
  {
    slug: "credit-immobilier-negocier-son-taux-comme-un-pro-en-2026",
    title: "Credit immobilier : negocier son taux comme un pro en 2026",
    description:
      "Taux, assurance emprunteur, apport, DPE, dossier bancaire : les leviers concrets pour negocier votre credit immobilier en 2026.",
    category: "Immobilier",
    image: "hero-credit.svg",
    keywords: ["credit immobilier 2026", "negocier son taux", "assurance emprunteur", "TAEG"],
    intro:
      `<p>Negocier un credit immobilier en 2026 ne se resume pas a demander une meilleure ligne de taux au banquier. Le cout total du financement depend d'un ensemble de variables : taux nominal, assurance, frais de dossier, modularite, penalites de remboursement, qualite du bien finance et profil de l'emprunteur. Les bons negocient un package complet, pas seulement une decimale.</p>
      <p>Depuis le choc de remontee des taux, le rapport de force s'est nuance. Les banques veulent du volume, mais elles arbitrent davantage la qualite des dossiers. Cela signifie qu'un emprunteur bien prepare peut encore obtenir de bonnes conditions, surtout s'il comprend quels elements rassurent un comite de credit.</p>
      <p>La bonne nouvelle, c'est que la plupart des gains se jouent avant le premier rendez-vous. Plus votre dossier est clair, plus vous augmentez vos chances de negocier vite et bien. Ce guide sert justement a cela : preparer un dossier qui inspire confiance et savoir sur quels curseurs appuyer.</p>`,
    body: makeArticleBody([
      `<h2>Le taux n'est qu'une partie de l'histoire</h2>
      <p>Beaucoup d'acheteurs se focalisent sur le taux facial. C'est compréhensible, mais incomplet. Ce qui doit retenir votre attention, c'est le TAEG, c'est-a-dire le cout global du credit incluant notamment certains frais annexes. Deux offres avec le meme taux nominal peuvent afficher des couts totaux sensiblement differents selon l'assurance, les frais de dossier ou la modularite.</p>
      <p>Autrement dit, une banque peut vous donner l'impression de faire un effort sur le taux tout en se rattrapant ailleurs. A l'inverse, une offre legerement moins agressive sur le nominal peut etre meilleure une fois l'assurance deleguee et les frais negocies.</p>`,
      `<h2>Ce que la banque regarde vraiment</h2>
      <p>Votre reste a vivre, la stabilite de vos revenus, votre apport, votre tenue de compte, votre taux d'endettement, votre anciennete professionnelle et la coherence du projet immobilier. Un dossier qui montre une epargne reguliere, peu d'incidents, peu de credit conso et une vraie preparation inspire davantage confiance qu'un dossier techniquement solvable mais brouillon.</p>
      <p>Le bien lui-meme compte aussi. Un appartement bien situe, facilement revendable et avec un DPE correct rassure plus qu'un actif atypique ou charge en travaux energetiques. En 2026, la qualite du bien et sa liquidite potentielle restent des variables tres concretes de la discussion bancaire.</p>`,
      `<h2>Les leviers de negociation les plus efficaces</h2>
      <h3>L'apport</h3>
      <p>Un apport solide diminue le risque pour la banque. Il ne s'agit pas toujours d'apporter un maximum absolu, mais d'avoir un apport suffisant pour couvrir frais de notaire, frais de garantie et eventuellement une part du prix selon votre profil.</p>
      <h3>L'assurance emprunteur</h3>
      <p>C'est souvent le levier le plus sous-estime. La delegation d'assurance peut faire economiser des milliers d'euros sur la duree du pret. Il faut comparer tot, pas a la fin, et integrer ce poste dans votre negociation globale.</p>
      <h3>La concurrence</h3>
      <p>Une offre concurrente serieuse, comparable et datée change le ton d'un echange. Elle ne garantit pas une baisse, mais elle oblige la banque a se positionner clairement.</p>`,
      `<table>
        <thead><tr><th>Levier</th><th>Impact potentiel</th><th>Quand l'activer</th></tr></thead>
        <tbody>
          <tr><td>Dossier prepare</td><td>Fort</td><td>Avant le premier rendez-vous</td></tr>
          <tr><td>Delegation d'assurance</td><td>Tres fort</td><td>En parallele des simulations</td></tr>
          <tr><td>Mise en concurrence</td><td>Fort</td><td>Apres obtention d'une premiere offre</td></tr>
          <tr><td>Apport</td><td>Moyen a fort</td><td>Des le depart</td></tr>
        </tbody>
      </table>`,
      `<h2>Negocier comme un pro : la methode</h2>
      <p>La premiere etape est de monter un dossier impeccable : revenus, charges, avis d'imposition, releves, epargne, justificatifs du projet. La deuxieme consiste a clarifier votre objectif. Voulez-vous la mensualite la plus basse, la duree la plus courte, ou le cout total le plus faible ? Sans reponse claire, vous negociez dans le flou.</p>
      <p>Ensuite, posez les bonnes questions : quelle modularite des echeances, quelle possibilite de report, quelles penalites de remboursement anticipe, quelles conditions sur l'assurance, quel cout exact de la garantie, quel calendrier de validite de l'offre ? Le professionnel n'est pas celui qui parle le plus. C'est celui qui compare mieux.</p>`,
      `<h2>Le cas particulier des primo-accedants</h2>
      <p>Les primo-accedants ont souvent un projet plus tendu financierement, mais pas forcement un plus mauvais profil. Une trajectoire professionnelle solide, une epargne reguliere et un projet cohérent peuvent faire la difference. Le vrai risque, c'est d'acheter au maximum de sa capacite theorique et de ne plus avoir de marge pour les travaux, la copropriete ou un changement de revenu.</p>
      <p>Le bon montage ne se contente pas d'etre accordable. Il doit rester vivable. Cette nuance compte enormement quand on construit un patrimoine plutot qu'une simple operation de financement.</p>`,
      `<h2>Faut-il passer par un courtier</h2>
      <p>Un bon courtier peut vous faire gagner du temps, acceder a plusieurs banques et vous aider a decoder les offres. Mais il ne remplace pas votre vigilance. Il faut comprendre sa remuneration, savoir s'il travaille avec un panel large, et comparer vous-meme le cout final des propositions. Pour les dossiers atypiques ou tres charges, son accompagnement peut etre precieux. Pour un dossier simple, vous pouvez aussi faire une partie du travail en direct.</p>`,
      `<h2>Ce qu'il faut retenir</h2>
      <p>Negocier son credit immobilier en 2026, c'est d'abord soigner son dossier, puis elargir la negociation au cout total et a la flexibilite du contrat. Le taux est important, mais l'assurance, la modularite et la qualite du bien le sont presque autant. Plus votre lecture est globale, plus votre negociation devient professionnelle.</p>`,
    ]),
    faq: [
      { q: "Faut-il toujours choisir la mensualite la plus basse ?", a: "Pas necessairement. Une mensualite trop basse allonge la duree et le cout global. Tout depend de votre marge de securite." },
      { q: "La delegation d'assurance vaut-elle l'effort ?", a: "Oui, tres souvent. C'est l'un des gisements d'economie les plus importants d'un financement immobilier." },
      { q: "Un courtier est-il indispensable ?", a: "Non, mais il peut etre utile selon votre profil, votre temps disponible et la complexite du dossier." },
    ],
    sources: [
      { label: "Service Public - Informations generales sur le credit immobilier", url: "https://www.service-public.fr/" },
    ],
  },
  {
    slug: "fiscalite-crypto-monnaies-declaration-imposition-optimisations-legales",
    title: "Fiscalite des crypto-monnaies : declaration, imposition et optimisations legales",
    description:
      "Comprendre la fiscalite crypto en France en 2026 : PFU, formulaires 2086 et 3916-bis, erreurs a eviter et arbitrages utiles.",
    category: "Fiscalite",
    image: "hero-crypto.svg",
    keywords: ["fiscalite crypto 2026", "declaration crypto", "2086", "3916-bis", "plus value crypto"],
    intro:
      `<p>La fiscalite des crypto-monnaies est l'un des sujets les plus souvent mal compris par les investisseurs particuliers. Entre les notions de cession imposable, d'echange, de flat tax, de comptes a l'etranger et de statut professionnel, il est facile de se perdre. Pourtant, les regles se sont clarifiees au fil des annees, et l'administration fiscale publie des indications de plus en plus precises.</p>
      <p>En 2026, l'objectif n'est pas d'etre plus malin que la loi. C'est d'etre propre, documente et anticipe. Un investisseur qui tient ses historiques, comprend ce qui declenche l'impot et declare les bons formulaires dort beaucoup mieux que celui qui espere que personne ne regardera ses flux.</p>
      <p>La vraie optimisation, ici, commence par la conformite. Une bonne tenue de preuves, une comprehension du regime applicable et quelques arbitrages legaux bien pensés peuvent eviter a la fois des erreurs couteuses et des nuits agitees.</p>`,
    body: makeArticleBody([
      `<h2>Le point de depart : particulier ou professionnel</h2>
      <p>Impots.gouv.fr rappelle que, depuis le 1er janvier 2023, le regime depend du statut de l'activite. Si vous intervenez dans le cadre de votre patrimoine prive, vous relevez du regime des particuliers. Si votre activite prend un caractere professionnel, avec des conditions et des moyens assimilables a ceux d'un trader, la qualification change et le traitement fiscal aussi.</p>
      <p>Cette distinction est majeure. Beaucoup d'investisseurs pensent qu'un grand nombre d'operations suffit a les faire basculer automatiquement. En realite, l'administration regarde un faisceau d'indices. Il faut donc se garder des simplifications excessives et, si votre cas devient complexe, demander un avis professionnel.</p>`,
      `<h2>Ce qui est impose chez le particulier</h2>
      <p>Dans le cadre du patrimoine prive, les plus-values sur actifs numeriques relevent, selon la fiche mise a jour par l'administration, du PFU, sauf option pour le bareme progressif lorsqu'elle est pertinente. Ce qui compte, c'est la cession imposable. Il faut donc distinguer la simple detention, certains transferts entre wallets, et les operations qui cristallisent fiscalement une plus-value ou une moins-value.</p>
      <p>Le formulaire 2086 sert au detail des plus ou moins-values. Les montants sont ensuite reportes dans la declaration principale. Les comptes d'actifs numeriques detenus a l'etranger doivent aussi etre declares via le formulaire 3916-3916 bis lorsqu'ils entrent dans le champ de l'obligation declarative.</p>`,
      `<h2>Les documents a ne jamais negliger</h2>
      <table>
        <thead><tr><th>Document</th><th>A quoi il sert</th><th>Bon reflexe</th></tr></thead>
        <tbody>
          <tr><td>Historique de transactions</td><td>Reconstituer les mouvements</td><td>Exporter regulierement depuis les plateformes</td></tr>
          <tr><td>Formulaire 2086</td><td>Declarer les plus et moins-values</td><td>Verifier le calcul global avant validation</td></tr>
          <tr><td>Formulaire 3916-3916 bis</td><td>Declarer certains comptes a l'etranger</td><td>Lister toutes les plateformes concernees</td></tr>
        </tbody>
      </table>
      <p>Le point de douleur classique est la qualite des donnees. Plus vous attendez, plus les historiques deviennent difficiles a reconstituer. Un investisseur qui exporte ses mouvements tous les trimestres, conserve les confirmations d'ouverture de compte et classe ses retraits fiat se facilite enormement la vie.</p>`,
      `<h2>Les optimisations legales qui ont du sens</h2>
      <p>La premiere optimisation est administrative : documenter proprement. La deuxieme est calendaires : ne pas attendre la derniere semaine de declaration pour essayer de recomposer trois ans d'historique. La troisieme est strategique : savoir si l'option pour le bareme progressif peut etre avantageuse dans votre situation globale, ce qui demande une vision d'ensemble de vos revenus mobiliers.</p>
      <p>Il est aussi utile d'eviter les bricolages entre comptes personnels, comptes joints et wallets non traces. La lisibilite patrimoniale n'est pas un luxe. C'est une assurance contre le stress fiscal. Enfin, si vous investissez des montants significatifs, faites relire votre situation par un fiscaliste habitue aux actifs numeriques avant la declaration, pas apres un controle.</p>`,
      `<h2>Les erreurs les plus frequentes</h2>
      <p>Erreur numero un : penser que l'administration ne verra jamais les comptes et les flux. Erreur numero deux : confondre gains latents et gains imposables. Erreur numero trois : oublier de declarer des comptes etrangers. Erreur numero quatre : melanger activite occasionnelle et activite quasi-professionnelle sans se poser la question du regime applicable.</p>
      <p>Une autre erreur plus subtile consiste a croire qu'une plus-value crypto est un sujet purement technique. En realite, elle touche la gestion patrimoniale globale : disponibilite de tresorerie pour payer l'impot, allocation du portefeuille, preuve de l'origine des fonds et impact sur vos autres objectifs.</p>`,
      `<h2>Comment rester serein en 2026</h2>
      <p>Si vous investissez en crypto, acceptez l'idee que la comptabilite minimale fait partie du jeu. Tenez un tableau de bord, archivez vos exports, gardez les justificatifs d'entree des fonds, et distinguez clairement ce qui releve d'une strategie de long terme de ce qui tient au trading opportuniste. Plus votre pratique est structurée, plus la declaration devient une formalite.</p>
      <p>La fiscalite crypto n'est pas un obstacle a l'investissement. C'est une contrainte de pilotage. Ceux qui la traitent en amont gardent une vraie liberte d'action. Ceux qui la decouvrent en avril au moment de declarer paient souvent leur improvisation.</p>`,
    ]),
    faq: [
      { q: "Doit-on declarer un compte crypto a l'etranger ?", a: "Dans les cas prevus par la reglementation, oui. Le formulaire 3916-3916 bis est alors a remplir." },
      { q: "Une moins-value peut-elle aider ?", a: "Elle doit etre correctement declaree et s'apprecie selon les regles du regime applicable. Il faut verifier la mecanique precise pour votre situation." },
      { q: "Quand faut-il consulter un fiscaliste ?", a: "Des que les flux deviennent nombreux, que les montants grossissent ou que votre activite ressemble a une pratique professionnelle." },
    ],
    sources: [
      { label: "Impots.gouv.fr - Declarer les plus ou moins-values sur actifs numeriques", url: "https://www.impots.gouv.fr/particulier/questions/comment-declarer-les-plus-ou-moins-values-sur-cessions-dactifs-numeriques" },
      { label: "Impots.gouv.fr - Formulaire 2086", url: "https://www.impots.gouv.fr/formulaire/2086/declaration-des-plus-ou-moins-values-de-cessions-dactifs-numeriques" },
    ],
  },
  {
    slug: "defiscaliser-loi-pinel-en-2026",
    title: "Peut-on encore defiscaliser avec la loi Pinel en 2026 ?",
    description:
      "Pinel classique, Pinel+, fin du dispositif, alternatives et grille de decision pour savoir si l'investissement locatif defiscalisant a encore du sens.",
    category: "Fiscalite",
    image: "hero-pinel.svg",
    keywords: ["loi Pinel 2026", "Pinel+", "defiscalisation immobiliere", "alternative Pinel"],
    intro:
      `<p>La question revient sans cesse : la loi Pinel existe-t-elle encore en 2026 et peut-on encore l'utiliser pour reduire ses impots ? La reponse courte est qu'il faut distinguer le Pinel classique de ses prolongements et verifier finement la date et les conditions de l'operation. Beaucoup d'articles melangent les regimes ou recyclent des informations devenues inexactes.</p>
      <p>L'ANIL rappelle que le dispositif Pinel s'applique aux operations realisees entre septembre 2014 et le 31 decembre 2024, avec des conditions specifiques et une transition vers le Pinel+. Cela signifie qu'en 2026, pour un nouvel investisseur, la reflexion ne peut plus se limiter a la promesse marketing de reduction d'impot : il faut regarder ce qui est encore mobilisable et surtout si cela reste patrimonialement solide.</p>
      <p>La bonne question n'est donc pas seulement fiscale. C'est : l'investissement a-t-il du sens sans la reduction d'impot ? Si la reponse est non, le projet est probablement fragile.</p>`,
    body: makeArticleBody([
      `<h2>Ce que dit le cadre officiel</h2>
      <p>Selon l'ANIL, le Pinel classique s'appliquait aux operations realisees jusqu'au 31 decembre 2024 dans certaines zones, avec des taux progressivement reduits et des conditions renforcées pour le Pinel+. En 2026, la reference a utiliser est donc celle du calendrier legal et des operations deja engagees, pas un fantasme de dispositif indéfiniment reconduit.</p>
      <p>Pour un investisseur qui decouvre le sujet aujourd'hui, il est essentiel de verifier la nature exacte du bien, la date de realisation, les engagements de location et les conditions techniques eventuellement liees au Pinel+. Les raccourcis commerciaux du type "defiscalisez encore avec le Pinel" doivent donc etre pris avec beaucoup de recul.</p>`,
      `<h2>Pourquoi tant d'investisseurs se sont trompes sur le Pinel</h2>
      <p>Parce que la reduction d'impot est concrete, immediate et facile a vendre. En face, les risques sont plus diffus : surpayer le bien neuf, sous-estimer les charges, mal evaluer la demande locative, acheter dans un secteur banalement sur-offert, ou immobiliser une capacite d'endettement sur un actif moyen. Beaucoup de programmes ont ete vendus comme des produits fiscaux avant d'etre vendus comme des biens immobiliers.</p>
      <p>Or la hierarchie devrait toujours etre inverse. On achète d'abord un actif coherent, bien place, a un prix defendable, avec une liquidite probable. L'avantage fiscal vient ensuite. Si l'avantage fiscal est l'unique justification, il masque souvent une faiblesse de fond.</p>`,
      `<h2>Comment analyser un dossier Pinel ou ex-Pinel en 2026</h2>
      <table>
        <thead><tr><th>Point de controle</th><th>Question a poser</th><th>Pourquoi c'est crucial</th></tr></thead>
        <tbody>
          <tr><td>Prix d'achat</td><td>Quel ecart avec l'ancien comparable du secteur ?</td><td>Eviter la surcote du neuf fiscal</td></tr>
          <tr><td>Tension locative</td><td>La demande est-elle durable ou artificielle ?</td><td>Un bien vacant annule vite l'avantage</td></tr>
          <tr><td>Charges et fiscalite</td><td>Quel cash-flow reel apres tout ?</td><td>Mesurer l'effort d'epargne veritable</td></tr>
          <tr><td>Sortie</td><td>Qui achetera ce bien dans 9 ans ?</td><td>Ne pas raisonner uniquement a l'entree</td></tr>
        </tbody>
      </table>`,
      `<h2>Pinel+ : meilleure protection ou simple reconditionnement</h2>
      <p>Le Pinel+ a eu pour ambition de maintenir des avantages sous condition de qualite superieure, notamment energetique et d'usage. Sur le papier, c'est un progres. En pratique, cela ne dispense jamais d'une analyse economique du bien. Une bonne norme ne compense pas un mauvais emplacement. Une belle plaquette ne compense pas une zone mediocre. Un avantage fiscal plein ne compense pas une sortie difficile.</p>
      <p>Pour l'investisseur de 2026, le Pinel+ peut eventuellement concerner des dossiers deja structures ou des cas bien particuliers, mais il ne doit pas etre traite comme un raccourci vers la richesse immobiliere.</p>`,
      `<h2>Quelles alternatives regarder</h2>
      <p>Selon votre situation, plusieurs pistes peuvent etre plus saines : immobilier ancien avec travaux dans un secteur tendu, location nue bien achetee avec fiscalite maitrisee, LMNP sous reserve d'un examen complet des regles du moment, SCPI pour une exposition plus passive, ou simplement arbitrage vers des enveloppes financieres si votre capacite d'endettement doit rester disponible.</p>
      <p>Le bon arbitrage depend de votre tranche marginale, de votre horizon, de votre rapport au risque locatif et de votre charge mentale disponible. Il n'existe pas de dispositif miracle qui surclasse tous les autres en toutes circonstances.</p>`,
      `<h2>Ce qu'un investisseur lucide retient en 2026</h2>
      <p>Oui, on peut encore parler du Pinel en 2026, mais surtout pour analyser l'heritage du dispositif, les dossiers déjà engages et la logique patrimoniale a retenir. Pour un nouveau projet, la reduction d'impot ne doit plus jamais etre la colonne vertebrale du raisonnement. La colonne vertebrale doit etre : emplacement, prix, demande, rendement reel, revente future et qualite intrinsèque du bien. Si ces cases sont cochees, la fiscalite devient un bonus. Sinon, elle devient un piege joliment emballe.</p>`,
    ]),
    faq: [
      { q: "Le Pinel classique est-il encore ouvert aux nouveaux dossiers en 2026 ?", a: "Il faut verifier le calendrier legal et la date precise de l'operation. Le dispositif classique est lie aux operations realisees jusqu'a fin 2024 selon l'ANIL." },
      { q: "Le Pinel+ garantit-il un bon investissement ?", a: "Non. Il peut renforcer certains criteres de qualite, mais ne remplace ni le bon prix ni le bon emplacement." },
      { q: "La defiscalisation suffit-elle a justifier un achat ?", a: "Non. Un actif mediocre reste mediocre, meme fiscalement aide." },
    ],
    sources: [
      { label: "ANIL - Reduction d'impot Pinel", url: "https://www.anil.org/votre-projet/vous-achetez-vous-construisez/investissement-locatif/reduction-dimpot-pinel/" },
    ],
  },
  {
    slug: "per-plan-epargne-retraite-avantages-fiscaux-et-pieges",
    title: "PER (Plan d'Epargne Retraite) : avantages fiscaux et pieges a eviter",
    description:
      "Deduction, sortie en capital, plafond, mutualisation et erreurs frequentes : comment utiliser le PER sans se raconter d'histoires.",
    category: "Fiscalite",
    image: "hero-per.svg",
    keywords: ["PER 2026", "plan epargne retraite", "deduction fiscale PER", "plafond PER"],
    intro:
      `<p>Le PER est devenu le grand receptacle des discours sur la retraite et la baisse d'impot. Il faut dire que la promesse est seduisante : vous versez aujourd'hui, vous deduisez vos cotisations selon votre plafond, et vous organisez un capital de long terme. Sur le papier, tout est propre. Dans la realite, l'interet du PER depend fortement de votre fiscalite actuelle, de votre situation future et du type de support choisi.</p>
      <p>Service-Public rappelle que le PER individuel donne droit a des avantages fiscaux et que les versements volontaires sont soumis a un plafond de deduction. C'est une bonne base, mais ce n'est pas un feu vert universel. Un PER peut etre excellent pour certains foyers et mediocrement utile pour d'autres.</p>
      <p>Autrement dit : la deduction immediate fait souvent oublier la question la plus importante. Quel sera votre vrai gain patrimonial net, une fois integrees la duree de blocage, les frais et la fiscalite de sortie ?</p>`,
    body: makeArticleBody([
      `<h2>Le vrai atout du PER : la deduction a l'entree</h2>
      <p>Le principal argument du PER reside dans la deduction des versements volontaires, dans la limite du plafond disponible figurant notamment sur votre avis d'imposition. Plus votre tranche marginale d'imposition est elevee, plus cet avantage peut etre puissant. Pour un foyer fortement impose, le PER peut donc devenir un outil de lissage fiscal tres pertinent.</p>
      <p>Mais une reduction d'impot aujourd'hui ne signifie pas automatiquement une victoire patrimoniale. Il faut la comparer a la fiscalite de sortie, aux frais du contrat, a la qualite des supports et a l'alternative possible : assurance-vie, PEA, investissement immobilier ou meme conservation de liquidites selon vos projets.</p>`,
      `<h2>Ce que Service-Public rappelle sur le plafond</h2>
      <p>Le plafond de deduction est individualise, avec des regles qui dependent du statut, et il peut etre majore par les plafonds non utilises des trois annees precedentes. Pour les couples soumis a imposition commune, la mutualisation peut aussi changer la donne. Cette mecanique n'est pas un detail : elle determine votre marge de manoeuvre et peut transformer un versement classique en excellente operation d'optimisation.</p>
      <p>Le bon reflexe consiste a regarder systematiquement votre plafond disponible avant tout versement de fin d'annee. Beaucoup de contribuables alimentent un PER au hasard, sans savoir s'ils saturent efficacement leur enveloppe ni quel gain fiscal ils en retirent vraiment.</p>`,
      `<h2>Les deux grandes familles de pieges</h2>
      <h3>Le piege fiscal</h3>
      <p>Un contribuable peu impose peut surestimer l'avantage de la deduction. S'il economise peu d'impot a l'entree mais subira une fiscalite ou une rigidite importante a la sortie, l'operation devient beaucoup moins convaincante.</p>
      <h3>Le piege produit</h3>
      <p>Un PER charge en frais, avec une offre de supports mediocre et une gestion pilotée peu transparente, peut neutraliser une partie du benefice fiscal. Le choix du contrat reste donc crucial. Le PER n'est pas une idee abstraite : c'est un produit concret, avec une couche de frais bien reelle.</p>`,
      `<table>
        <thead><tr><th>Situation</th><th>PER souvent pertinent ?</th><th>Pourquoi</th></tr></thead>
        <tbody>
          <tr><td>TMI elevee et horizon long</td><td>Oui</td><td>La deduction peut etre puissante</td></tr>
          <tr><td>TMI faible et besoin de souplesse</td><td>Pas toujours</td><td>Le blocage peut peser plus que le gain fiscal</td></tr>
          <tr><td>Fin de carriere et objectif retraite</td><td>Souvent</td><td>Le produit colle bien a l'usage</td></tr>
        </tbody>
      </table>`,
      `<h2>Sortie en capital, sortie en rente : que privilegier</h2>
      <p>Le PER a l'avantage de permettre, selon les cas, des sorties en capital ou en rente. Cette souplesse est utile, mais il faut l'anticiper des l'entree. Si vous imaginez financer un projet ponctuel, la logique de sortie ne sera pas la meme que si vous visez un complement de revenus regulier a la retraite.</p>
      <p>La qualite d'une strategie PER tient justement a cette coherence entre le moment du versement, l'avantage fiscal recherche et la forme de restitution attendue plus tard. Sans cela, on achete une carotte fiscale de court terme en oubliant la destination finale.</p>`,
      `<h2>Comment l'utiliser intelligemment</h2>
      <p>Le meilleur usage du PER consiste souvent a l'inserer dans une architecture plus large. Le PEA peut jouer la croissance action, l'assurance-vie la souplesse patrimoniale et le PER la deduction et la retraite. Cette complementarite evite de tout concentrer dans un seul outil. Elle permet aussi de garder des poches liquides pour les projets de vie plus proches.</p>
      <p>Une autre bonne pratique consiste a verser au fil de l'eau plutot qu'en urgence fin decembre, sauf si vous utilisez une strategie d'ajustement fiscal de fin d'annee parfaitement calculee. Le versement panique est rarement le meilleur ami du patrimoine.</p>`,
      `<h2>Conclusion pratique</h2>
      <p>Le PER est un excellent outil pour certains profils, pas une obligation patrimoniale universelle. Plus votre imposition est forte, plus l'avantage de l'entree est significatif. Mais cet avantage doit toujours etre confronte aux frais, a la qualite du contrat, a votre besoin de disponibilite et a la fiscalite future. Un PER bien choisi peut etre redoutablement efficace. Un PER choisi uniquement pour payer moins d'impot cette annee peut se reveler decevant pendant vingt ans.</p>`,
    ]),
    faq: [
      { q: "Faut-il remplir son PER en decembre pour reduire son impôt ?", a: "Seulement si cela s'inscrit dans une vraie strategie et que le plafond disponible ainsi que le gain reel ont ete verifiés." },
      { q: "Le PER est-il adapte aux jeunes actifs ?", a: "Oui dans certains cas, surtout si la fiscalite est deja significative et si l'horizon de placement est long." },
      { q: "Un PER remplace-t-il l'assurance-vie ?", a: "Non. Les deux outils ont des usages differents et se completent souvent tres bien." },
    ],
    sources: [
      { label: "Service Public - PER individuel", url: "https://www.service-public.fr/particuliers/vosdroits/F36526/0" },
      { label: "Service Public - Cotisations d'epargne retraite", url: "https://www.service-public.fr/particuliers/vosdroits/F14709" },
    ],
  },
  {
    slug: "declarer-ses-revenus-locatifs-micro-foncier-vs-reel",
    title: "Comment declarer ses revenus locatifs : micro-foncier vs reel",
    description:
      "Seuil de 15 000 euros, charges deductibles, deficit foncier et arbitrage concret entre micro-foncier et reel.",
    category: "Fiscalite",
    image: "hero-locatif.svg",
    keywords: ["micro foncier", "regime reel revenus fonciers", "declarer loyers", "2044"],
    intro:
      `<p>Declarer ses revenus locatifs semble simple jusqu'au moment ou il faut choisir entre micro-foncier et regime reel. C'est souvent la premiere grande bifurcation fiscale de l'investisseur immobilier. Or un mauvais choix ne se voit pas toujours tout de suite : il peut vous faire perdre une deduction utile, ou au contraire vous embarquer dans une complexite inutile.</p>
      <p>Service-Public rappelle que, pour les revenus locatifs en location nue, le seuil de 15 000 euros de revenus fonciers annuels constitue un point de bascule important. En dessous, le micro-foncier s'applique en principe automatiquement. Au-dessus, le regime reel devient la norme.</p>
      <p>Mais en patrimoine, la vraie question n'est pas seulement de savoir quel regime s'applique. C'est de savoir lequel est le plus intelligent au regard de vos charges, de vos travaux et de votre strategie a moyen terme.</p>`,
    body: makeArticleBody([
      `<h2>Le micro-foncier : simple, rapide, lisible</h2>
      <p>Le micro-foncier s'applique en principe lorsque vos revenus fonciers bruts n'excedent pas 15 000 euros par an et que vous remplissez les conditions. Son grand avantage est la simplicite. Vous declarez le montant brut des loyers et beneficiez d'un abattement forfaitaire. Pour un bien peu charge en travaux, avec des frais contenus, ce regime peut etre tres confortable.</p>
      <p>Sa limite, c'est justement son caractere forfaitaire. Si vos charges reelles sont sensiblement superieures a l'abattement, vous laissez potentiellement de l'argent sur la table. C'est le cas dans les annees de travaux, de gros interets d'emprunt ou de copropriete couteuse.</p>`,
      `<h2>Le regime reel : plus exigeant, mais souvent plus puissant</h2>
      <p>Au reel, vous declarez vos recettes et deduisez les charges effectivement supportees selon les regles applicables : interets d'emprunt, assurance, taxe fonciere, travaux eligibles, frais de gestion, etc. La contrepartie, c'est une plus grande exigence documentaire et declarative, notamment via le formulaire adapte.</p>
      <p>Le regime reel devient particulierement interessant lorsque le bien a un effort de remise a niveau, lorsque l'emprunt reste important ou lorsque la structure de charges est elevee. Il permet aussi, dans certaines limites et selon les regles en vigueur, de mobiliser le deficit foncier, ce qui peut etre un outil patrimonial puissant lorsqu'il est utilise intelligemment.</p>`,
      `<table>
        <thead><tr><th>Regime</th><th>Avantage</th><th>Inconvenient</th></tr></thead>
        <tbody>
          <tr><td>Micro-foncier</td><td>Simplicite et gain de temps</td><td>Abattement parfois insuffisant</td></tr>
          <tr><td>Reel</td><td>Deduction fine des charges</td><td>Comptabilite et declaration plus lourdes</td></tr>
        </tbody>
      </table>`,
      `<h2>Comment choisir rationnellement</h2>
      <p>La bonne methode consiste a faire un calcul comparatif, pas a choisir par habitude. Reprenez vos loyers bruts annuels, estimez vos charges deductibles reelles, ajoutez les travaux prevus, regardez les interets restants et mesurez l'impact sur votre resultat foncier. Ce petit travail de prevision vaut largement le temps investi.</p>
      <p>Il faut aussi raisonner sur plusieurs annees. Un regime qui semble meilleur cette annee peut devenir moins pertinent l'an prochain si les travaux s'achevent et que les charges se normalisent. La fiscalite locative est une trajectoire, pas une photo unique.</p>`,
      `<h2>Le deficit foncier : puissant, mais a manier proprement</h2>
      <p>Le deficit foncier fait rever parce qu'il permet de neutraliser une partie du revenu imposable sous certaines conditions. Mais il ne faut pas en faire un pretexte pour lancer des travaux mal calibres. Des travaux n'ont de valeur patrimoniale que s'ils ameliorent reellement le bien, son attractivite locative, sa durabilite ou sa revente future.</p>
      <p>Le bon usage du deficit foncier combine une logique fiscale et une logique immobiliere. Si vous financez des travaux purement pour l'avantage fiscal, sans cohesion economique, vous prenez le risque de depenser un euro pour en economiser une fraction seulement.</p>`,
      `<h2>Les erreurs typiques des bailleurs</h2>
      <p>Beaucoup oublient de conserver les justificatifs. D'autres confondent charges deductibles, depenses de travaux et depenses d'amelioration mal qualifiees. D'autres encore choisissent le micro par confort alors que le reel les avantagerait clairement. Enfin, certains regardent uniquement l'impot sans integrer la realite du cash-flow locatif, ce qui fausse l'analyse.</p>
      <p>En pratique, une bonne gestion locative suppose de tenir un dossier annuel : loyers, appels de charges, taxe fonciere, assurance, interets, factures, honoraires et calendrier des travaux. Ce dossier facilite la declaration et renforce la qualite du pilotage patrimonial.</p>`,
      `<h2>Ce qu'il faut retenir</h2>
      <p>Le micro-foncier est parfait quand votre location nue est simple et peu chargee. Le regime reel devient plus interessant quand les charges montent ou quand des travaux significatifs entrent en jeu. Entre les deux, le bon choix est celui que vous pouvez expliquer chiffres a l'appui, pas celui que vous reprenez machinalement d'une annee sur l'autre.</p>`,
    ]),
    faq: [
      { q: "Le micro-foncier est-il toujours le plus avantageux sous 15 000 euros ?", a: "Non. Il est souvent le plus simple, mais le regime reel peut etre meilleur si vos charges reelles sont elevees." },
      { q: "Quand le reel devient-il tres interessant ?", a: "Souvent dans les annees de travaux, de credit encore important ou de charges structurellement fortes." },
      { q: "Faut-il tenir ses justificatifs meme en micro-foncier ?", a: "Oui, pour garder une lecture economique de votre bien et pouvoir arbitrer intelligemment a l'avenir." },
    ],
    sources: [
      { label: "Service Public - Revenus locatifs (location non meublee)", url: "https://www.service-public.fr/particuliers/vosdroits/F1991" },
    ],
  },
  {
    slug: "succession-et-donation-optimiser-transmission-patrimoine",
    title: "Succession et donation : optimiser la transmission de son patrimoine",
    description:
      "Abattements, donation au dernier vivant, reserve hereditaire, nue-propriete : les grands leviers pour transmettre plus sereinement.",
    category: "Fiscalite",
    image: "hero-succession.svg",
    keywords: ["succession", "donation", "transmission patrimoine", "abattement enfants", "usufruit nue propriete"],
    intro:
      `<p>La transmission du patrimoine reste l'un des sujets les plus charges emotionnellement. Pourtant, c'est aussi l'un des domaines ou l'anticipation produit le plus de valeur concrete. Entre donation, demembrement, abattements et organisation du couple, de nombreux leviers existent pour eviter que l'improvisation ne fragilise a la fois la famille et le patrimoine.</p>
      <p>Service-Public rappelle qu'en matiere de succession et de donation, les droits, abattements et regles varient selon le lien de parente. C'est fondamental. La transmission ne se pense pas seulement en montant, mais en architecture familiale et juridique.</p>
      <p>L'objectif ne consiste pas a contourner la loi, mais a utiliser pleinement les options qu'elle prevoit. Bien transmettre, c'est reduire les frottements fiscaux quand c'est possible, tout en gardant une logique de paix familiale et de lisibilite.</p>`,
    body: makeArticleBody([
      `<h2>Premiere idee cle : transmettre de son vivant change tout</h2>
      <p>La donation permet d'organiser une partie de la transmission avant le deces. C'est souvent preferable a une succession entierement subie, car vous gardez la main sur le calendrier, les beneficiaires, les proportions et parfois les modalites d'usage des biens. Cela permet aussi de mobiliser des abattements renouvelables selon les regles en vigueur.</p>
      <p>Pour les enfants, Service-Public rappelle l'existence d'un abattement de 100 000 euros par parent dans certains cadres successoraux. Cette reference seule montre a quel point la temporalite compte. Une transmission bien echelonnée peut fortement lisser la charge fiscale sur la duree.</p>`,
      `<h2>Donation simple, donation partage, don manuel : que choisir</h2>
      <p>La donation simple peut convenir pour transmettre un bien ou une somme a un moment donne. La donation-partage est souvent plus structurante lorsqu'il faut organiser l'equite entre plusieurs enfants et limiter les contestations futures. Le don manuel, lui, peut etre utile pour des transferts de liquidites, a condition de respecter les declarations requises.</p>
      <p>Le bon choix depend de la composition du patrimoine, de l'age des enfants, de la presence d'une entreprise, d'un immobilier familial ou de situations conjugales particulières. Plus la famille est complexe, plus l'anticipation juridique devient precieuse.</p>`,
      `<h2>Le demembrement : un outil central</h2>
      <p>Le couple usufruit / nue-propriete est un levier puissant. Il permet de transmettre progressivement la substance d'un bien tout en conservant certains droits d'usage ou de revenus. Dans une logique patrimoniale, c'est souvent une facon elegante d'avancer la transmission sans se dessaisir brutalement.</p>
      <p>Mais il faut le manier avec precision. Valeur fiscale, objectifs concrets, impact sur les revenus, gouvernance familiale : tout doit etre clarifie en amont. Le demembrement n'est pas un gadget notarial. C'est une vraie technique patrimoniale.</p>`,
      `<h2>Le conjoint survivant et la donation au dernier vivant</h2>
      <p>Service-Public rappelle que les droits du conjoint varient selon la presence d'enfants communs ou non, et qu'une donation au dernier vivant peut elargir ses options. Pour les couples maries, c'est souvent une brique essentielle de protection. Elle peut donner plus de souplesse au conjoint survivant, notamment entre usufruit et pleine propriete selon les cas.</p>
      <p>Encore faut-il articuler cela avec les objectifs des enfants, la reserve hereditaire et la nature des biens. Une protection du conjoint mal pensee peut devenir une source de tension ou de blocage. Une protection bien redigee apaise au contraire beaucoup de situations.</p>`,
      `<table>
        <thead><tr><th>Levier</th><th>Utilite</th><th>Quand y penser</th></tr></thead>
        <tbody>
          <tr><td>Donation simple</td><td>Transmettre un bien ou du cash</td><td>Quand l'objectif est ponctuel</td></tr>
          <tr><td>Donation-partage</td><td>Organiser l'equite familiale</td><td>En presence de plusieurs enfants</td></tr>
          <tr><td>Demembrement</td><td>Transmettre sans tout abandonner</td><td>Quand on veut garder l'usage ou les revenus</td></tr>
          <tr><td>Donation au dernier vivant</td><td>Proteger le conjoint</td><td>Dans une reflexion de couple globale</td></tr>
        </tbody>
      </table>`,
      `<h2>Les erreurs qui coutent cher</h2>
      <p>Ne rien faire, penser qu'un testament suffira a tout regler, oublier la reserve hereditaire, ignorer les familles recomposées, transmettre des liquidites sans preuve ou sans declaration adaptee, et surtout laisser un patrimoine important sans vision d'ensemble. La transmission n'aime pas le flou. Chaque zone d'ombre devient un risque juridique, fiscal ou relationnel.</p>
      <p>Autre erreur frequente : tout regarder sous l'angle de la fiscalite. Oui, les droits comptent. Mais l'utilite concrete des biens, la capacite des heritiers a les gerer, le besoin de protection du conjoint ou la paix familiale comptent tout autant.</p>`,
      `<h2>Ma recommandation pratique</h2>
      <p>Commencez par un audit patrimonial simple : qui doit etre protege, quels biens posent question, quel niveau de liquidite est disponible, quels abattements pouvez-vous mobiliser, et quelle gouvernance souhaitez-vous apres vous. Ensuite seulement, choisissez les outils avec votre notaire et, le cas echeant, votre conseiller patrimonial. Une transmission reussie est rarement spectaculaire. Elle est surtout anticipee, lisible et coherent avec votre histoire familiale.</p>`,
    ]),
    faq: [
      { q: "Peut-on desheriter ses enfants en France ?", a: "Non dans le cadre francais classique, car la reserve hereditaire protege les descendants selon les regles applicables." },
      { q: "La donation au dernier vivant est-elle utile ?", a: "Oui, tres souvent pour renforcer la protection du conjoint survivant, selon la situation familiale." },
      { q: "Faut-il attendre un grand patrimoine pour preparer sa transmission ?", a: "Non. Plus on commence tot, plus on a de leviers et de souplesse." },
    ],
    sources: [
      { label: "Service Public - Droits de succession et de donation", url: "https://www.service-public.fr/particuliers/vosdroits/N31160" },
      { label: "Service Public - Quels droits a payer sur une succession", url: "https://www.service-public.fr/particuliers/vosdroits/F35794" },
      { label: "Service Public - Donation au dernier vivant", url: "https://www.service-public.fr/particuliers/vosdroits/F2767" },
    ],
  },
  {
    slug: "crowdfunding-immobilier-rendement-risques-avis-complet",
    title: "Crowdfunding immobilier : rendement, risques et avis complet",
    description:
      "Rendements affiches, retards, defauts, risque de plateforme : une lecture lucide du crowdfunding immobilier en 2026.",
    category: "Immobilier",
    image: "hero-crowdfunding.svg",
    keywords: ["crowdfunding immobilier", "rendement crowdfunding", "risques crowdfunding", "AMF"],
    intro:
      `<p>Le crowdfunding immobilier a longtemps ete presente comme la rencontre parfaite entre rendement eleve et accessibilite. Quelques centaines d'euros suffisent, les projets sont concrets, les plateformes ont soigne leur interface, et les taux affiches semblent souvent attractifs. C'est justement cette accessibilite qui a seduit de nombreux epargnants.</p>
      <p>Mais depuis que le marche immobilier s'est tendu, le sujet a change de tonalite. L'AMF a appele les investisseurs a la plus grande vigilance face au risque de defaut du porteur de projet ou de cessation d'activite de la plateforme. En clair : le rendement promis ne raconte plus toute l'histoire.</p>
      <p>Pour un patrimoine bien gere, le crowdfunding immobilier peut avoir une place. Pour un patrimoine mal diversifie, il peut devenir un concentré de risques mal compris. Il faut donc le regarder comme un placement a risque, pas comme une extension elegante du livret.</p>`,
    body: makeArticleBody([
      `<h2>Comment fonctionne vraiment le crowdfunding immobilier</h2>
      <p>L'investisseur finance, via une plateforme, une operation immobiliere menee par un promoteur ou un marchand de biens. En echange, il attend un rendement et le remboursement du capital a une echeance donnee. Dans la pratique, il s'agit souvent d'obligations ou de titres assimilés, avec un horizon court ou moyen terme.</p>
      <p>Sur le papier, la proposition est seduisante. Dans la realite, vous etes expose a plusieurs couches de risque : la qualite du projet, la solidite du promoteur, la structure juridique, le calendrier de commercialisation, la conjoncture immobiliere et la solidite operationnelle de la plateforme.</p>`,
      `<h2>Ce que disent les chiffres et les alertes recentes</h2>
      <p>L'AMF a souligne que les rendements affiches sur le marche avaient progresse, dans un contexte pourtant plus degrade pour l'immobilier. Elle note aussi que les retards, les defauts potentiels et le risque de plateforme exigent une vigilance renforcee. Autrement dit, quand le rendement monte dans un marche qui se tend, ce n'est pas gratuitement : c'est souvent la traduction d'un risque plus eleve.</p>
      <p>Les chiffres cles 2024 publies par l'AMF montrent par ailleurs que l'immobilier reste le secteur predominateur du financement participatif, meme si sa part recule. Cette concentration sectorielle doit faire reflechir l'investisseur : beaucoup de portefeuilles particuliers sont deja indirectement exposes a l'immobilier via la residence principale, le locatif ou les SCPI. Ajouter une couche de crowdfunding revient souvent a surconcentrer encore davantage le meme risque macro.</p>`,
      `<h2>Les risques qu'il faut assumer lucidement</h2>
      <table>
        <thead><tr><th>Risque</th><th>Ce qu'il implique</th><th>Reflexe prudent</th></tr></thead>
        <tbody>
          <tr><td>Perte en capital</td><td>Vous pouvez recuperer moins que votre mise</td><td>Limiter la taille des tickets</td></tr>
          <tr><td>Illiquidite</td><td>Sortie difficile avant echeance</td><td>Investir uniquement de l'argent immobilisable</td></tr>
          <tr><td>Retard de remboursement</td><td>Calendrier decale</td><td>Diversifier les echeances</td></tr>
          <tr><td>Risque de plateforme</td><td>Continuité de service et suivi perturbes</td><td>Choisir des acteurs solides et ne pas se concentrer</td></tr>
        </tbody>
      </table>`,
      `<h2>Quand cela peut avoir du sens</h2>
      <p>Le crowdfunding immobilier peut trouver une place en poche satellite pour un investisseur deja diversifie, ayant compris la nature des risques et cherchant un rendement plus eleve sur une petite fraction de son patrimoine. Il peut aussi convenir a un investisseur qui accepte l'illiquidite et suit plusieurs dossiers avec methode.</p>
      <p>En revanche, ce n'est pas un support de reserve de tresorerie, ni un outil a charger avec de l'argent dont vous pourriez avoir besoin rapidement. Ce n'est pas non plus une solution miracle pour battre les fonds euros sans risque. La comparaison est trompeuse.</p>`,
      `<h2>Comment selectionner une plateforme et un projet</h2>
      <p>Commencez par l'acteur : son statut, ses processus de selection, la transparence sur les retards, la qualite des reportings, l'historique des remboursements, la gestion des incidents. Puis examinez le projet : localisation, niveau de precommercialisation, experience du porteur, structure de dette, marge de securite, duree previsionnelle, rang de votre financement et documentation juridique.</p>
      <p>Le vrai test de qualite n'est pas la beaute de l'interface. C'est la facon dont la plateforme parle des dossiers compliques, des retards et des echecs. Une plateforme serieuse n'a pas peur de documenter le risque.</p>`,
      `<h2>Mon avis patrimonial</h2>
      <p>Le crowdfunding immobilier peut etre interessant, mais seulement a dose moderee. Pour un investisseur patrimonial classique, il releve davantage de la poche d'opportunite que du coeur de portefeuille. Son rendement potentiel remunere des risques bien reels, et l'environnement 2025-2026 rappelle brutalement que ces risques finissent par se materialiser.</p>
      <p>Si vous l'utilisez, pensez diversification de projets, de plateformes et d'echeances. Et surtout, refusez la confusion entre rendement affiche et rendement perçu. Sur ce terrain, la prudence n'est pas de la frilosite. C'est du pilotage de patrimoine.</p>`,
    ]),
    faq: [
      { q: "Le crowdfunding immobilier est-il garanti ?", a: "Non. L'AMF rappelle explicitement le risque de perte en capital et le risque de retard ou de defaut." },
      { q: "Peut-on y consacrer une grosse part de son patrimoine ?", a: "Ce n'est generalement pas prudent. Il vaut mieux le cantonner a une poche satellite diversifiee." },
      { q: "Le rendement affiche est-il le rendement reel ?", a: "Pas forcement. Il faut tenir compte des retards, defauts, frais et incidents de recouvrement." },
    ],
    sources: [
      { label: "AMF - Investir via le crowdfunding immobilier", url: "https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/financement-participatif-crowdfunding/investir-le-crowdfunding-immobilier" },
      { label: "AMF - Vigilance sur les risques du financement participatif", url: "https://www.amf-france.org/fr/actualites-publications/actualites/financement-participatif-lamf-appelle-les-investisseurs-la-plus-grande-vigilance-sur-les-risques" },
      { label: "AMF - Chiffres cles 2024", url: "https://www.amf-france.org/fr/actualites-publications/actualites/prestataires-de-services-de-financement-participatif-chiffres-cles-2024" },
    ],
  },
  {
    slug: "livret-a-ldds-lep-match-livrets-reglementes-2026",
    title: "Livret A, LDDS, LEP : le match des livrets reglementes en 2026",
    description:
      "Taux, plafonds, fiscalite et priorites d'usage : comment utiliser intelligemment les livrets reglementes en 2026.",
    category: "Placements",
    image: "hero-livrets.svg",
    keywords: ["Livret A 2026", "LDDS 2026", "LEP 2026", "taux livrets reglementes"],
    intro:
      `<p>Les livrets reglementes occupent souvent une place paradoxale dans les finances personnelles. Tout le monde les connait, mais peu de gens les utilisent vraiment avec une logique patrimoniale claire. On y laisse parfois dormir trop d'argent par inertie, ou au contraire on les neglige alors qu'ils devraient accueillir l'epargne de securite de base.</p>
      <p>Pourtant, en 2026, le trio Livret A, LDDS et LEP merite une lecture fine. Les taux ont bouge en 2025, Service-Public rappelant notamment une baisse du Livret A et du LEP a compter du 1er aout 2025. Au moment d'ecrire ces lignes, les references publiques indiquent notamment un Livret A et un LDDS a 1,7 %, et un LEP a 2,7 % dans le cadre public connu au 1er semestre 2026.</p>
      <p>La conclusion patrimoniale est simple : tous les livrets ne se valent pas, et leur utilite depend a la fois de votre eligibilite et de votre architecture d'epargne globale.</p>`,
    body: makeArticleBody([
      `<h2>Le Livret A : la base universelle</h2>
      <p>Le Livret A conserve trois qualites majeures : disponibilite totale, absence d'impot sur les interets et universalite d'acces. Service-Public rappelle qu'il est ouvert a tous, sans condition de revenus, avec un plafond bien connu. Il constitue donc un receptacle naturel pour l'epargne de precaution de premier niveau.</p>
      <p>Sa faiblesse est egalement evidente : son rendement peut devenir modeste lorsque l'inflation remonte ou que d'autres supports offrent davantage. Il ne faut donc pas lui demander ce qu'il n'est pas cense faire. Le Livret A n'est pas un moteur de performance, c'est un stabilisateur.</p>`,
      `<h2>Le LDDS : le jumeau utile</h2>
      <p>Le LDDS fonctionne de facon tres proche, avec une fiscalite equivalente et une disponibilite immediate. Son plafond est plus bas, mais il joue un role tres pratique : completer l'epargne liquide une fois le Livret A bien rempli, ou segmenter les objectifs de tresorerie. Beaucoup de couples l'utilisent pour separer reserve de securite et reserve de projets a court terme.</p>
      <p>Il ne faut pas le voir comme un produit secondaire. Bien employe, c'est un excellent outil de gestion de cash patrimonial.</p>`,
      `<h2>Le LEP : le meilleur des trois quand on y a droit</h2>
      <p>Le LEP est souvent le plus interessant en rendement net, justement parce qu'il cible les revenus modestes. Service-Public rappelait qu'au 1er aout 2025, son taux etait fixe a 2,7 % apres baisse, tout en restant superieur au Livret A. Pour les foyers eligibles, ne pas ouvrir un LEP revient souvent a laisser une opportunite simple et sans risque sur la table.</p>
      <p>Le vrai enjeu ici n'est pas financierement spectaculaire, mais patrimonialement intelligent : commencer par maximiser les livrets nets les plus favorables avant d'exposer davantage son capital a des placements volatils, surtout si l'epargne disponible reste modeste.</p>`,
      `<table>
        <thead><tr><th>Livret</th><th>Taux public de reference connu</th><th>Public vise</th><th>Usage principal</th></tr></thead>
        <tbody>
          <tr><td>Livret A</td><td>1,7 %</td><td>Tout public</td><td>Epargne de precaution universelle</td></tr>
          <tr><td>LDDS</td><td>1,7 %</td><td>Majeurs</td><td>Complement de tresorerie liquide</td></tr>
          <tr><td>LEP</td><td>2,7 %</td><td>Revenus modestes eligibles</td><td>Epargne liquide la mieux remuneree du trio</td></tr>
        </tbody>
      </table>`,
      `<h2>Quelle priorite d'utilisation</h2>
      <p>La logique la plus simple est la suivante. Si vous etes eligible au LEP, il merite souvent la priorite. Ensuite, le Livret A prend naturellement sa place. Le LDDS vient completer l'enveloppe liquide. Une fois ces poches correctement dimensionnees, il devient pertinent de regarder des supports de moyen ou long terme selon vos objectifs.</p>
      <p>Le mauvais usage consiste a suralimenter indefiniment ces livrets faute de plan. Au-dela d'une epargne de securite et de projets proches, un excedent trop important sur des livrets a rendement modeste peut devenir un cout d'opportunite significatif.</p>`,
      `<h2>Combien garder en livrets</h2>
      <p>La bonne reponse depend du niveau de charges fixes, de la stabilite des revenus et de la visibilite des projets. Pour certains foyers, trois mois de depenses suffisent. Pour d'autres, notamment les independants, six a douze mois peuvent etre plus coherents. Ce n'est pas le livret en soi qui est la question, mais la taille de votre coussin de securite.</p>
      <p>Un bon patrimoine sait distinguer l'argent de protection, l'argent de projet et l'argent de long terme. Les livrets servent admirablement le premier et parfois le second. Beaucoup moins le troisieme.</p>`,
      `<h2>Conclusion</h2>
      <p>En 2026, les livrets reglementes gardent une place essentielle. Le LEP est probablement le premier a regarder si vous y avez droit. Le Livret A reste la base universelle, et le LDDS un excellent complement. Utilises ensemble, ils forment le socle liquide du patrimoine moderne. Utilises sans strategie, ils deviennent simplement une salle d'attente pour de l'argent qui devrait parfois etre affecte ailleurs.</p>`,
    ]),
    faq: [
      { q: "Quel livret ouvrir en premier ?", a: "Le LEP si vous etes eligible. Sinon, le Livret A reste la porte d'entree la plus naturelle." },
      { q: "Les interets sont-ils imposables ?", a: "Non, ces livrets reglementes beneficient d'une exonération d'impot sur le revenu et de prelevements sociaux selon les regles en vigueur." },
      { q: "Peut-on tout laisser sur ses livrets ?", a: "Ce n'est pas optimal au-dela de l'epargne de precaution et des projets proches." },
    ],
    sources: [
      { label: "Service Public - Baisse des taux Livret A et LEP au 1er aout 2025", url: "https://www.service-public.fr/particuliers/actualites/A18000" },
      { label: "Service Public - Livret A", url: "https://www.service-public.fr/particuliers/vosdroits/F2365?question=Les_int" },
      { label: "Service Public - LDDS", url: "https://www.service-public.fr/particuliers/vosdroits/F2368" },
    ],
  },
  {
    slug: "devenir-rentier-avec-les-dividendes-strategie-et-portefeuille-type",
    title: "Devenir rentier avec les dividendes : strategie et portefeuille type",
    description:
      "Ce que signifie vraiment vivre des dividendes, combien il faut viser et comment construire une strategie realiste en 2026.",
    category: "Placements",
    image: "hero-dividendes.svg",
    keywords: ["dividendes", "vivre des dividendes", "portefeuille dividendes", "rentier"],
    intro:
      `<p>Le fantasme du rentier aux dividendes est puissant. Il evoque des revenus passifs, une independance financiere elegante et l'idee rassurante de vivre sans toucher au capital. Le probleme, c'est que ce recit est souvent simplifie jusqu'a devenir trompeur. Vivre des dividendes n'est ni impossible ni facile. C'est une strategie exigeante qui demande un capital significatif, une allocation robuste et une grande lucidite sur le niveau de revenu visé.</p>
      <p>L'AMF rappelle que l'actionnaire a notamment droit au dividende lorsque la societe en distribue. Mais ce versement n'est jamais garanti. Les dividendes peuvent etre maintenus, augmentes, reduits ou supprimes. Construire une vie financiere sur cette variable suppose donc de privilegier la qualite, la diversification et la prudence des hypotheses.</p>
      <p>Le bon angle n'est pas de chercher le rendement le plus spectaculaire. C'est de chercher la durabilite des flux sans sacrifier la solidite du patrimoine.</p>`,
    body: makeArticleBody([
      `<h2>Combien faut-il pour vivre des dividendes</h2>
      <p>La question la plus concrete est la plus souvent eludée. Si vous souhaitez 2 000 euros nets par mois, il faut raisonner a partir d'un rendement prudent, net de fiscalite et compatible avec un portefeuille defendable. Avec un rendement brut de 3 % a 4 % sur un portefeuille diversifie, le capital necessaire devient vite important. Cela montre qu'il vaut mieux parler de complementarite de revenus que de rente integrale dans un premier temps.</p>
      <p>Beaucoup de strateges amateurs oublient aussi que le rendement eleve peut masquer un risque eleve. Une action qui affiche 9 % de rendement n'est pas forcement une belle opportunite. Elle peut simplement signaler un marche qui doute de la soutenabilite du dividende.</p>`,
      `<h2>Le bon portefeuille dividendes n'est pas une chasse au plus gros coupon</h2>
      <p>Un portefeuille robuste privilegie des entreprises capables de distribuer un dividende tout en conservant une structure financiere saine, un business lisible et une capacite a continuer d'investir. Les secteurs defensifs, certaines grandes valeurs internationales, des ETF dividendes bien choisis et des supports complementaires peuvent contribuer a cette stabilite.</p>
      <p>La diversification sectorielle et geographique reste indispensable. Un portefeuille centre sur une seule zone ou un seul secteur peut voir son flux se degrader brutalement en cas de choc reglementaire, de recession sectorielle ou de variation de change.</p>`,
      `<table>
        <thead><tr><th>Brique</th><th>Role</th><th>Vigilance</th></tr></thead>
        <tbody>
          <tr><td>Actions de qualite</td><td>Flux de dividendes direct</td><td>Eviter la concentration excessive</td></tr>
          <tr><td>ETF dividendes</td><td>Diversification simple</td><td>Verifier la qualite de l'indice</td></tr>
          <tr><td>Poche de reserve</td><td>Absorber les coupes de dividendes</td><td>Ne pas la negliger</td></tr>
        </tbody>
      </table>`,
      `<h2>Fiscalite et enveloppes : un sujet central</h2>
      <p>Le compte-titres ordinaire soumet generalement les dividendes au PFU, sauf option pour le bareme. Le PEA peut offrir un cadre plus favorable a long terme pour les titres eligibles. L'assurance-vie peut aussi jouer un role pour certains fonds orientés distribution ou pour une logique plus souple de retraits. La bonne strategie de dividendes n'est donc pas seulement une selection de titres : c'est aussi une question d'enveloppe fiscale.</p>
      <p>La consequence pratique est simple : deux portefeuilles identiques peuvent produire des revenus nets tres differents selon le support juridique retenu.</p>`,
      `<h2>Portefeuille type : une logique plutot qu'une recette</h2>
      <p>Un portefeuille type raisonnable pourrait s'organiser autour d'un coeur de diversification large, d'une poche d'actions de qualite distribuant regulierement, d'un ETF dividendes pour lisser le risque spécifique et d'une reserve de cash ou de supports defensifs. Cette reserve n'est pas un luxe : elle permet de continuer a vivre ou a reinvestir sans vendre au pire moment si plusieurs dividendes sont coupes.</p>
      <p>La logique n'est pas de maximiser le rendement aujourd'hui, mais de rendre le flux plus resilent demain. C'est un changement d'etat d'esprit tres important.</p>`,
      `<h2>Les illusions a eviter</h2>
      <p>Illusion numero un : croire que le dividende est un revenu gratuit. Il provient de l'entreprise et s'accompagne d'un risque action entier. Illusion numero deux : croire qu'un haut rendement est toujours une bonne affaire. Illusion numero trois : oublier l'inflation. Vivre de dividendes pendant vingt ans exige des entreprises capables de faire croitre leurs distributions ou au moins de proteger un peu le pouvoir d'achat.</p>
      <p>Enfin, illusion numero quatre : ne pas prevoir de phase d'accumulation suffisamment longue. La rente ne se decrete pas. Elle se construit.</p>`,
      `<h2>Conclusion</h2>
      <p>Oui, les dividendes peuvent financer une partie importante d'un train de vie. Mais devenir rentier ne repose pas sur une liste miracle de valeurs. Cela repose sur un capital suffisant, une enveloppe adaptee, des hypotheses prudentes et une tres forte diversification. Si vous partez de ce cadre, la strategie dividendes peut devenir un levier serieux. Si vous partez du fantasme du rendement a deux chiffres, vous risquez surtout de fabriquer une rente fragile.</p>`,
    ]),
    faq: [
      { q: "Peut-on vraiment vivre uniquement des dividendes ?", a: "Oui, mais cela suppose generalement un capital important et une strategie tres prudente." },
      { q: "Un rendement eleve est-il toujours preferable ?", a: "Non. Un rendement trop eleve peut signaler un risque de coupe ou une faiblesse du dossier." },
      { q: "Le PEA est-il utile pour une strategie dividendes ?", a: "Oui, pour les titres eligibles et dans une logique de long terme." },
    ],
    sources: [
      { label: "AMF - Investir en actions cotees", url: "https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/actions-obligations/actions/investir-en-actions-cotees-en-bourse" },
      { label: "AMF - Actionnaire individuel et dividendes", url: "https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/etre-un-actionnaire-individuel/etre-un-actionnaire-vigilant" },
    ],
  },
];

const extraArticles = [
  {
    slug: "comment-investir-etf-sans-se-ruiner",
    title: "ETF : comment investir sans se ruiner et sans stress",
  },
];

const additionalArticles = [
  {
    slug: "peut-on-defiscaliser-loi-pinel-en-2026",
  },
];

const bonusArticles = [
  {
    slug: "assurance-vie-comparatif-des-meilleurs-contrats-en-ligne",
  },
];

articles.push(
  {
    slug: "assurance-vie-comparatif-meilleurs-contrats-en-ligne-linxea-yomoni",
    title: "Assurance-vie : comparatif des meilleurs contrats en ligne (Linxea, Yomoni, etc.)",
    description:
      "Comment lire un comparatif assurance-vie en ligne avec un angle patrimonial, sans se laisser hypnotiser par le marketing.",
    category: "Placements",
    image: "hero-assurance-vie.svg",
    keywords: ["assurance vie Linxea Yomoni", "comparatif assurance vie", "frais contrat"],
    intro:
      `<p>Entre le contrat ultra-ouvert, la gestion pilotee elegante et le discours commercial sur le meilleur fonds euros, il n'est pas simple de comparer les assurances-vie en ligne. Pourtant, une grille de lecture patrimoniale suffit souvent a separer les contrats vraiment utiles des produits seulement bien marketes.</p>
      <p>Le point de depart reste le meme : un bon contrat doit servir vos objectifs, pas flatter uniquement votre envie d'optimisation. Pour un epargnant moderne, les bons reflexes consistent a regarder les frais, la qualite des supports, la souplesse de gestion et la capacite du contrat a vivre avec vous pendant longtemps.</p>
      <p>Dans cette logique, des acteurs comme Linxea ou Yomoni reviennent souvent dans les comparatifs, mais ils ne cochent pas les cases de la meme maniere. Il faut donc apprendre a lire au-dela de l'etiquette.</p>`,
    body: makeArticleBody([
      `<h2>Commencer par votre usage reel</h2><p>Un contrat tres riche en supports n'a pas d'interet si vous deleguez tout. A l'inverse, une gestion pilotee ultra-simple n'est pas ideale si vous voulez arbitrer vous-meme entre ETF, SCPI et fonds euros. Le bon contrat depend d'abord de votre niveau d'autonomie.</p><p>Cette question simple permet d'eviter beaucoup de comparatifs steriles. Le meilleur contrat n'existe pas en absolu ; il existe le meilleur contrat pour votre methode de gestion.</p>`,
      `<h2>Les frais, encore et toujours</h2><p>Les contrats en ligne ont fortement tire les frais vers le bas. C'est une excellente nouvelle, mais il faut regarder l'ensemble du cout : frais de versement, gestion, mandat eventuel, frais des supports et arbitrages. Sur quinze ans, la facture finale peut differer sensiblement.</p><p>Le bon contrat n'est pas juste celui qui affiche un chiffre bas en vitrine. C'est celui dont la structure de cout reste competitive pour l'usage que vous en ferez vraiment.</p>`,
      `<h2>Fonds euros, ETF et gestion pilotee</h2><p>Un profil autonome regardera la profondeur de l'offre ETF, l'acces a de bonnes poches immobilières et la qualite du fonds euros. Un profil plus delegant regardera surtout la lisibilite de la gestion sous mandat, la pedagogie et la coherence des profils de risque.</p><p>Le bon comparatif doit donc porter a la fois sur les supports et sur l'experience de gestion.</p>`,
      `<h2>Exemple de lecture</h2><table><thead><tr><th>Critere</th><th>Contrat ouvert type Linxea</th><th>Gestion pilotee type Yomoni</th></tr></thead><tbody><tr><td>Autonomie</td><td>Forte</td><td>Faible a moyenne</td></tr><tr><td>ETF</td><td>Souvent plus riche</td><td>Selection encadree</td></tr><tr><td>Simplicite</td><td>Moyenne</td><td>Forte</td></tr><tr><td>Delegation</td><td>Limitee</td><td>Centrale</td></tr></tbody></table>`,
      `<h2>Conclusion patrimoniale</h2><p>Si vous aimez construire votre allocation, un contrat ouvert a faibles frais est logique. Si vous voulez une solution propre, rapide et pilotée, la gestion digitalisee peut etre plus efficace psychologiquement. Dans les deux cas, ouvrez un contrat que vous comprenez, et pas seulement un contrat qui vous impressionne.</p>`,
    ]),
    faq: [
      { q: "Faut-il absolument choisir entre Linxea et Yomoni ?", a: "Non. Ils illustrent deux styles de contrats, mais l'essentiel est d'identifier votre besoin reel." },
      { q: "La gestion pilotee est-elle moins bonne ?", a: "Pas du tout. Elle peut etre tres pertinente si elle vous aide a rester investi avec regularite." },
      { q: "Un contrat peut-il etre bon meme avec peu de supports ?", a: "Oui, si les supports sont bien choisis et couvrent vos besoins." },
    ],
    sources: [
      { label: "Ministere de l'Economie - Fiscalite de l'assurance-vie", url: "https://www.economie.gouv.fr/particuliers/quelle-fiscalite-lassurance-vie" },
    ],
  },
  {
    slug: "etf-comment-investir-sans-se-ruiner-et-sans-stress-guide-complet",
    title: "ETF : comment investir sans se ruiner et sans stress",
    description:
      "Guide pratique pour batir un portefeuille ETF simple, diversifie et supportable dans la duree.",
    category: "Placements",
    image: "hero-etf.svg",
    keywords: ["ETF monde", "investir passif", "PEA ETF", "ETF 2026"],
    intro:
      `<p>Investir en ETF est souvent l'une des meilleures portes d'entree vers l'investissement de long terme. Le format est simple, les frais peuvent rester contenus, et la diversification est immediate. Le vrai sujet n'est donc pas de savoir si les ETF sont utiles, mais de savoir comment les utiliser sans transformer leur simplicite en confusion.</p>
      <p>Un portefeuille ETF bien pense doit rester supportable psychologiquement. C'est pour cela qu'il faut le dessiner a partir de vos objectifs et non a partir des themes a la mode.</p>
      <p>En 2026, la bonne promesse des ETF n'est pas l'excitation. C'est la regularite.</p>`,
    body: makeArticleBody([
      `<h2>Le format qui simplifie</h2><p>Avec un ETF large, vous accedez a un panier entier d'entreprises plutot qu'a une seule histoire boursiere. C'est une enorme difference pour l'investisseur particulier. La diversification reduit les accidents lies a un titre specifique et vous permet de raisonner en allocation plutot qu'en paris.</p><p>Cette logique est particulierement utile quand on construit un patrimoine en parallele d'une vie professionnelle deja chargee.</p>`,
      `<h2>Les trois questions a poser avant d'acheter</h2><p>Quel indice suit l'ETF ? Dans quelle enveloppe fiscale vais-je l'acheter ? Suis-je capable de garder cette position en cas de forte baisse ? Si vous ne repondez pas calmement a ces trois questions, il vaut mieux attendre un peu avant d'investir.</p>`,
      `<h2>Portefeuille simple</h2><p>Pour beaucoup d'epargnants, un coeur de portefeuille constitue d'un ETF large et d'un rythme d'investissement mensuel suffit deja a faire le travail. La sophistication est utile seulement si elle sert un besoin clair.</p><p>Plus le portefeuille est simple, plus il est souvent executable dans la vraie vie.</p>`,
      `<h2>Conclusion</h2><p>Les ETF permettent d'investir sans se ruiner parce qu'ils mutualisent, diversifient et reduisent le besoin de micro-gestion. Ils permettent d'investir sans stress lorsque le cadre est bien pose des le depart. La discipline compte davantage que la sophistication.</p>`,
    ]),
    faq: [
      { q: "Un ETF suffit-il pour debuter ?", a: "Oui, souvent." },
      { q: "Faut-il investir tous les mois ?", a: "C'est une methode simple et efficace pour beaucoup de profils." },
      { q: "Les ETF evitent-ils les baisses ?", a: "Non, ils les diversifient." },
    ],
    sources: [
      { label: "AMF - ETFs et nouveaux investisseurs", url: "https://www.amf-france.org/en/news-publications/news-releases/amf-news-releases/etfs-win-over-newcomers-they-invest-stock-market" },
    ],
  },
  {
    slug: "devenir-rentier-avec-les-dividendes",
    title: "Devenir rentier avec les dividendes : strategie et portefeuille type",
    description:
      "Une vision realiste de la rente actionnaire : capital requis, rendement prudent et construction du portefeuille.",
    category: "Placements",
    image: "hero-dividendes.svg",
    keywords: ["strategie dividendes", "rente actions", "portefeuille dividendes"],
    intro:
      `<p>Parler de rente avec des dividendes sans parler de capital, de fiscalite et de risque revient a raconter une belle histoire incomplete. La strategie dividendes peut pourtant etre tres serieuse, a condition d'assumer qu'elle demande du temps, un portefeuille diversifie et des attentes realistes.</p>
      <p>Le dividende est un flux potentiel, pas une promesse intangible. C'est pour cela que la qualite de l'entreprise compte bien plus que le pourcentage mis en avant sur une fiche de valeur.</p>
      <p>Une rente solide se construit davantage par la robustesse que par l'euphorie.</p>`,
    body: makeArticleBody([
      `<h2>Viser un flux durable</h2><p>Le coeur d'une strategie dividendes consiste a privilegier des entreprises capables de distribuer sans s'affaiblir. Cela implique des bilans solides, une activite lisible et une discipline de diversification exigeante. Le flux de revenu est le resultat d'une qualite economique, pas un bonus magique.</p>`,
      `<h2>Capital et rendement prudent</h2><p>Plus vos hypothèses sont prudentes, plus votre strategie a des chances d'etre tenable. Beaucoup de portefeuilles « rentiers » sont en fait des portefeuilles trop concentres qui fonctionnent seulement tant que la conjoncture reste ideale.</p>`,
      `<h2>Portefeuille type</h2><p>Un coeur diversifie, une poche d'actions de qualite, une reserve de securite et une enveloppe fiscale adaptee : c'est rarement sexy, mais c'est beaucoup plus durable qu'une chasse aux rendements exotiques.</p>`,
      `<h2>Conclusion</h2><p>La rente par dividendes peut exister, mais elle s'appuie sur la patience, la diversification et le realisme. Le vrai travail n'est pas de trouver le titre miracle ; c'est de construire un systeme qui survive aux mauvaises annees.</p>`,
    ]),
    faq: [
      { q: "Le dividende est-il garanti ?", a: "Non." },
      { q: "Peut-on viser seulement le plus haut rendement ?", a: "Ce serait souvent une erreur." },
      { q: "La diversification est-elle indispensable ?", a: "Oui, absolument." },
    ],
    sources: [
      { label: "AMF - Actionnaire individuel", url: "https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/etre-un-actionnaire-individuel/etre-un-actionnaire-vigilant" },
    ],
  }
);

const desiredSlugs = new Set([
  "investir-bourse-debutant-guide-complet-2026",
  "assurance-vie-comparatif-meilleurs-contrats-en-ligne-linxea-yomoni",
  "etf-comment-investir-sans-se-ruiner-et-sans-stress-guide-complet",
  "credit-immobilier-negocier-son-taux-comme-un-pro-en-2026",
  "fiscalite-crypto-monnaies-declaration-imposition-optimisations-legales",
  "defiscaliser-loi-pinel-en-2026",
  "per-plan-epargne-retraite-avantages-fiscaux-et-pieges",
  "declarer-ses-revenus-locatifs-micro-foncier-vs-reel",
  "succession-et-donation-optimiser-transmission-patrimoine",
  "crowdfunding-immobilier-rendement-risques-avis-complet",
  "livret-a-ldds-lep-match-livrets-reglementes-2026",
  "devenir-rentier-avec-les-dividendes",
]);

const finalArticles = articles.filter((article) => desiredSlugs.has(article.slug));

for (const article of finalArticles) {
  const faq = faqSection(article.faq);
  article.readingTime = wordsToReading(`${article.intro}${article.body}${faq}`);
  article.html = layout({
    title: `${article.title} | ${site.name}`,
    description: article.description,
    canonical: `${site.url}/articles/${article.slug}.html`,
    image: article.image,
    type: "article",
    level: 1,
    schemas: [
      orgSchema,
      breadcrumbSchema([
        { name: "Accueil", url: `${site.url}/index.html` },
        { name: "Articles", url: `${site.url}/articles/index.html` },
        { name: article.title, url: `${site.url}/articles/${article.slug}.html` },
      ]),
      articleSchema(article),
      faqSchema(article.faq),
    ],
    content: `<main class="article-page">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane">
          <a href="../index.html">Accueil</a>
          <span>/</span>
          <a href="./index.html">Articles</a>
          <span>/</span>
          <span>${article.title}</span>
        </nav>
        <div class="content-grid">
          <article class="article-content">
            <header class="article-hero">
              <p class="article-updated">${site.updated}</p>
              <h1>${article.title}</h1>
              <div class="post-meta">
                <span>Par ${site.author}</span>
                <span>25 avril 2026</span>
                <span>${article.readingTime} min de lecture</span>
                <span>${article.category}</span>
              </div>
              <!-- Bloc AdSense - Emplacement sous le titre -->
              <div class="ad adsense-title">
                <!-- Remplacez par votre code AdSense -->
              </div>
            </header>
            <figure class="hero-figure">
              <img src="../assets/images/${article.image}" alt="${article.title}" loading="lazy">
            </figure>
            ${article.intro}
            <!-- Bloc AdSense - Emplacement apres le 2e paragraphe -->
            <div class="ad adsense-inline">
              <!-- Remplacez par votre code AdSense in-article -->
            </div>
            ${article.body}
            ${faq}
            ${sourceList(article.sources)}
            ${warning}
            <!-- Bloc AdSense - Fin d'article avant commentaires -->
            <div class="ad adsense-end">
              <!-- Remplacez par votre code AdSense -->
            </div>
            <section class="comments-box">
              <h2>Commentaires</h2>
              <p>Section reservee a l'integration future d'un systeme de commentaires modere.</p>
            </section>
            ${shareButtons(`${site.url}/articles/${article.slug}.html`, article.title)}
          </article>
          <aside class="sidebar">
            <div class="sidebar-box">
              <h2>A retenir</h2>
              <p>Chaque article est ecrit pour aider a prendre de meilleures decisions, pas pour pousser a l'action impulsive.</p>
            </div>
            <!-- Bloc AdSense - Sidebar desktop / in-content mobile -->
            <div class="ad adsense-sidebar">
              <!-- Remplacez par votre code AdSense -->
            </div>
            <div class="sidebar-box">
              <h2>Articles lies</h2>
              <ul>
                ${finalArticles
                  .filter((item) => item.slug !== article.slug)
                  .slice(0, 4)
                  .map(
                    (item) =>
                      `<li><a href="${item.slug}.html">${item.title}</a></li>`
                  )
                  .join("")}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>`,
  });
  write(`articles/${article.slug}.html`, article.html);
}

const homeCards = finalArticles.slice(0, 6).map((article) => articleCard(article)).join("");
const allCards = finalArticles.map((article) => articleCard(article, 1)).join("");

const commonSchemas = (title, canonical, description) => [
  orgSchema,
  breadcrumbSchema([
    { name: "Accueil", url: `${site.url}/index.html` },
    { name: title, url: canonical },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
  },
];

write(
  "assets/css/style.css",
  `
:root{--navy:#0f2743;--navy-soft:#163759;--gold:#b79249;--mint:#1f7a62;--bg:#f5f7fb;--white:#fff;--text:#172333;--muted:#5d6978;--line:#d8e0ea;--shadow:0 14px 38px rgba(15,39,67,.08)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:"Open Sans",Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.7}img{max-width:100%;height:auto;display:block}a{color:var(--navy);text-decoration:none}a:hover{text-decoration:underline}.container{width:min(1120px,calc(100% - 2rem));margin:0 auto}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.site-header{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}.header-inner,.header-tools,.post-card__footer,.post-meta,.share-buttons,.footer-bottom,.cta-strip,.hero-actions,.cookie-banner__actions,.content-grid{display:flex;gap:1rem}.header-inner{align-items:center;justify-content:space-between;padding:1rem 0}.brand{display:flex;align-items:center;gap:.8rem;font-weight:700;color:var(--navy)}.brand:hover{text-decoration:none}.brand-mark{width:2.6rem;height:2.6rem;border-radius:.6rem;background:linear-gradient(135deg,var(--navy),var(--mint));display:grid;place-items:center;color:#fff;font-weight:700}.brand-text{display:flex;flex-direction:column;gap:.05rem}.brand-text em{font-style:normal;color:var(--muted);font-size:.86rem}.site-nav{display:flex;gap:1.2rem;align-items:center}.site-nav a{font-weight:600}.header-tools{padding:0 0 1rem;justify-content:space-between;align-items:center;flex-wrap:wrap}.search-shell{display:flex;gap:.6rem;flex:1;min-width:280px}.search-shell input{flex:1;min-height:46px;border:1px solid var(--line);border-radius:.6rem;padding:.8rem .95rem;background:#fff}.search-shell button,.button{border:0;border-radius:.6rem;padding:.8rem 1rem;font-weight:700;cursor:pointer}.search-shell button,.button-primary{background:var(--navy);color:#fff}.button-secondary{background:#e8edf4;color:var(--navy)}.button-tertiary{background:#fff;color:var(--navy);border:1px solid var(--line)}.category-links{display:flex;gap:.65rem;flex-wrap:wrap}.category-links a,.tag{display:inline-flex;align-items:center;min-height:38px;padding:.45rem .8rem;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:.95rem}.hero{padding:3.5rem 0 2rem}.hero-shell{display:grid;grid-template-columns:1.2fr .8fr;gap:2rem;align-items:center}.hero-copy h1,.page-hero h1,.article-hero h1,h2,h3{font-family:"Merriweather",Georgia,serif;line-height:1.25}.hero-copy h1{font-size:clamp(2.2rem,5vw,4rem);margin:.3rem 0 1rem}.eyebrow{display:inline-block;color:var(--gold);font-weight:700;letter-spacing:0;text-transform:uppercase;font-size:.82rem}.hero-copy p,.lead{font-size:1.05rem;color:var(--muted)}.hero-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0}.stat-box,.post-card,.sidebar-box,.info-card,.faq-box,.sources,.comments-box,.form-card{background:var(--white);border:1px solid var(--line);border-radius:.8rem;box-shadow:var(--shadow)}.stat-box{padding:1rem}.stat-box strong{display:block;font-size:1.4rem;color:var(--navy)}.hero-visual{position:relative;min-height:360px}.hero-visual img{width:100%;height:100%;object-fit:cover;border-radius:.8rem;box-shadow:var(--shadow)}.section-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;padding-top:1rem;margin-bottom:1rem}.post-grid,.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.post-card{padding:1.2rem}.post-card__meta,.article-updated{color:var(--gold);font-weight:700;font-size:.88rem}.post-card h3{margin:.45rem 0 .6rem;font-size:1.2rem}.post-card p{margin:0 0 .9rem;color:var(--muted)}.post-card__footer,.post-meta,.share-buttons{justify-content:space-between;align-items:center;flex-wrap:wrap;font-size:.93rem;color:var(--muted)}.page-hero,.article-page{padding:2rem 0 3rem}.page-hero h1{font-size:clamp(2rem,4vw,3rem);margin:.35rem 0}.content-grid{align-items:start}.content-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px}.article-content{background:#fff;border:1px solid var(--line);border-radius:.8rem;padding:1.5rem;box-shadow:var(--shadow)}.article-content p,.article-content li{color:var(--text)}.article-content h2{margin-top:2.2rem;font-size:1.55rem}.article-content h3{margin-top:1.4rem;font-size:1.15rem}.article-content table{width:100%;border-collapse:collapse;margin:1rem 0;background:#fff}.article-content th,.article-content td{border:1px solid var(--line);padding:.8rem;text-align:left;vertical-align:top}.hero-figure{margin:1rem 0 1.4rem}.hero-figure img{width:100%;border-radius:.8rem;border:1px solid var(--line)}.breadcrumb{display:flex;gap:.55rem;flex-wrap:wrap;font-size:.92rem;color:var(--muted);margin-bottom:1rem}.sidebar{display:grid;gap:1rem;position:sticky;top:8.8rem}.sidebar-box{padding:1rem}.sidebar-box h2,.faq-box h2,.sources h2,.comments-box h2{margin-top:0;font-size:1.1rem}.ad{min-height:120px;border:1px dashed #b9c7d7;border-radius:.8rem;background:repeating-linear-gradient(135deg,#f5f7fb,#f5f7fb 10px,#eef3f8 10px,#eef3f8 20px);display:grid;place-items:center;text-align:center;color:var(--muted);font-weight:700;padding:1rem;margin:1.2rem 0}.adsense-title{min-height:100px}.adsense-inline,.adsense-end{min-height:160px}.adsense-sidebar{min-height:250px}.warning-box{border-left:4px solid var(--gold);background:#fff8eb;padding:1rem 1rem 1rem 1.2rem;border-radius:.6rem;margin-top:1.2rem}.faq-box,.sources,.comments-box,.form-card{padding:1.2rem;margin-top:1.4rem}.faq-box details{border-top:1px solid var(--line);padding:.8rem 0}.faq-box details:first-of-type{border-top:0;padding-top:0}.share-buttons{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--line)}.share-buttons a{display:inline-flex;align-items:center;min-height:38px;padding:.35rem .8rem;border-radius:999px;background:#edf2f8}.site-footer{margin-top:2rem;background:#09182b;color:#dfe8f2;padding:2.5rem 0 1rem}.site-footer a{color:#fff}.footer-grid{display:grid;grid-template-columns:1.2fr .8fr .8fr;gap:2rem}.footer-grid h2{font-size:1.05rem;margin-top:0}.footer-grid ul{list-style:none;padding:0;margin:0;display:grid;gap:.55rem}.footer-bottom{padding-top:1rem;border-top:1px solid rgba(255,255,255,.12);justify-content:space-between}.cookie-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:40}.cookie-banner__content{max-width:760px;margin-inline:auto;background:#0d1f35;color:#fff;border-radius:1rem;padding:1rem 1.1rem;box-shadow:0 18px 60px rgba(0,0,0,.28)}.cookie-banner__content p{margin-top:0}.cookie-banner__custom{display:grid;gap:.6rem;margin-top:.8rem}.mobile-anchor-ad{display:none;position:fixed;left:0;right:0;bottom:0;z-index:15;background:rgba(9,24,43,.92);color:#fff;text-align:center;padding:.7rem 1rem;font-size:.86rem;letter-spacing:0}.nav-toggle{display:none;background:transparent;border:0;padding:.4rem;cursor:pointer}.nav-toggle span{display:block;width:24px;height:2px;background:var(--navy);margin:5px 0}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.form-card form{display:grid;gap:.9rem}.form-card input,.form-card textarea{width:100%;border:1px solid var(--line);border-radius:.7rem;padding:.85rem;background:#fff;font:inherit}.note{font-size:.92rem;color:var(--muted)}.list-clean{list-style:none;padding:0;display:grid;gap:.65rem}.anchor-list a{display:block;padding:.75rem 0;border-bottom:1px solid var(--line)}.about-hero{display:grid;grid-template-columns:.8fr 1.2fr;gap:2rem;align-items:center}.about-hero img{border-radius:.8rem;border:1px solid var(--line);box-shadow:var(--shadow)}.cta-strip{background:#fff;border:1px solid var(--line);border-radius:.8rem;box-shadow:var(--shadow);padding:1rem 1.2rem;justify-content:space-between;align-items:center;margin:1.5rem 0}.page-section{padding:1rem 0}.hidden{display:none!important}@media (max-width:980px){.hero-shell,.content-grid,.footer-grid,.about-hero,.post-grid,.info-grid,.grid-two{grid-template-columns:1fr}.sidebar{position:static}.hero-stats{grid-template-columns:1fr}.header-tools{align-items:stretch}.site-nav{position:absolute;top:100%;left:0;right:0;background:#fff;border-bottom:1px solid var(--line);padding:1rem;display:none;flex-direction:column;align-items:flex-start}.site-nav.open{display:flex}.nav-toggle{display:block}.mobile-anchor-ad{display:block}body{padding-bottom:3rem}}@media (max-width:680px){.container{width:min(100% - 1rem,1120px)}.hero{padding-top:2.4rem}.article-content{padding:1rem}.search-shell{min-width:100%}.section-head{align-items:flex-start;flex-direction:column}}
`
);

write(
  "assets/js/main.js",
  `
(()=>{const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];const navBtn=q('.nav-toggle'),nav=q('#site-nav');if(navBtn&&nav){navBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');navBtn.setAttribute('aria-expanded',String(open));});}const search=q('[data-search-input]');if(search){search.addEventListener('input',e=>{const v=e.target.value.toLowerCase().trim();qa('[data-search-item]').forEach(item=>{const text=(item.getAttribute('data-search-text')||'').toLowerCase();item.classList.toggle('hidden',!!v&&!text.includes(v));});});}const banner=q('[data-cookie-banner]'),custom=q('[data-cookie-custom]');const key='png-cookie-consent';const stored=localStorage.getItem(key);const emit=(detail)=>window.dispatchEvent(new CustomEvent('consent:update',{detail}));const save=(value)=>{localStorage.setItem(key,JSON.stringify(value));emit(value);if(banner)banner.hidden=true;};if(banner&&!stored)banner.hidden=false;if(stored){try{emit(JSON.parse(stored));}catch{localStorage.removeItem(key);banner.hidden=false;}}qa('[data-consent-action]').forEach(btn=>btn.addEventListener('click',()=>{const action=btn.getAttribute('data-consent-action');if(action==='accept')save({analytics:true,ads:true,date:new Date().toISOString()});if(action==='reject')save({analytics:false,ads:false,date:new Date().toISOString()});if(action==='customize'&&custom)custom.hidden=!custom.hidden;if(action==='save-custom'){save({analytics:!!q('[data-consent-analytics]')?.checked,ads:!!q('[data-consent-ads]')?.checked,date:new Date().toISOString()});}}));window.addEventListener('consent:update',e=>{const consent=e.detail||{};if(consent.ads){document.documentElement.setAttribute('data-ads-ready','true');/* Inserer ici plus tard le chargement conditionnel du script Google AdSense. */}else{document.documentElement.removeAttribute('data-ads-ready');}});})();
`
);

write(
  "assets/images/logo-png.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#0f2743"/><circle cx="392" cy="120" r="44" fill="#b79249"/><path d="M112 368V132h88c46 0 74 24 74 66 0 29-14 49-39 60l54 110h-58l-46-96h-20v96zm56-140h27c17 0 27-10 27-27s-10-26-27-26h-27z" fill="#fff"/><path d="M310 368V132h56l58 135V132h56v236h-55l-59-138v138z" fill="#6bd0aa"/></svg>`
);

for (const name of ["og-default.svg","hero-marche.svg","hero-assurance-vie.svg","hero-etf.svg","hero-credit.svg","hero-crypto.svg","hero-pinel.svg","hero-per.svg","hero-locatif.svg","hero-succession.svg","hero-crowdfunding.svg","hero-livrets.svg","hero-dividendes.svg","auteur-camille-durand.svg"]) {
  write(
    `assets/images/${name}`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0f2743"/><stop offset="1" stop-color="#1f7a62"/></linearGradient></defs><rect width="1200" height="720" fill="#eef3f8"/><rect x="40" y="40" width="1120" height="640" rx="36" fill="url(#g)"/><circle cx="935" cy="182" r="62" fill="#b79249" opacity=".9"/><rect x="92" y="136" width="360" height="26" rx="13" fill="#ffffff" opacity=".9"/><rect x="92" y="188" width="500" height="22" rx="11" fill="#ffffff" opacity=".78"/><rect x="92" y="232" width="440" height="22" rx="11" fill="#ffffff" opacity=".58"/><rect x="92" y="320" width="640" height="240" rx="26" fill="#ffffff" opacity=".12"/><path d="M136 504h176l84-110 96 66 115-150 122 173h129" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><rect x="800" y="332" width="236" height="154" rx="24" fill="#ffffff" opacity=".15"/><rect x="834" y="366" width="62" height="86" rx="12" fill="#b79249"/><rect x="914" y="392" width="62" height="60" rx="12" fill="#6bd0aa"/><text x="92" y="108" fill="#b8c9dd" font-size="28" font-family="Open Sans, Arial">Patrimoine Nouvelle Generation</text></svg>`
  );
}

write(
  "index.html",
  layout({
    title: `${site.name} | Blog patrimoine, investissement, fiscalite et immobilier`,
    description:
      "Le blog patrimoine nouvelle generation pour investir, reduire ses impots, mieux gerer son argent et preparer son avenir.",
    canonical: `${site.url}/index.html`,
    image: "og-default.svg",
    schemas: commonSchemas(
      "Accueil",
      `${site.url}/index.html`,
      "Le blog patrimoine nouvelle generation pour investir, reduire ses impots, mieux gerer son argent et preparer son avenir."
    ),
    content: `<main>
      <section class="hero">
        <div class="container hero-shell">
          <div class="hero-copy">
            <span class="eyebrow">Finance personnelle nouvelle generation</span>
            <h1>Mieux gerer son argent sans perdre de vue la vraie vie</h1>
            <p class="lead">Investissement, immobilier, fiscalite, transmission : un blog patrimonial pense pour les 25-45 ans qui veulent prendre de meilleures decisions avec calme, methode et exigence.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="articles/index.html">Voir tous les articles</a>
              <a class="button button-secondary" href="a-propos.html">Pourquoi nous lire</a>
            </div>
            <div class="hero-stats">
              <div class="stat-box"><strong>12</strong><span>articles piliers optimises SEO</span></div>
              <div class="stat-box"><strong>100 %</strong><span>statique et deployable sans build</span></div>
              <div class="stat-box"><strong>RGPD</strong><span>consentement cookies avant AdSense</span></div>
            </div>
          </div>
          <div class="hero-visual">
            <img src="assets/images/og-default.svg" alt="Illustration du blog patrimoine" loading="lazy">
          </div>
        </div>
      </section>
      <section class="container cta-strip">
        <p>Un site editorial propre, des pages de confiance completes, du maillage interne et des emplacements AdSense deja prevus.</p>
        <a class="button button-primary" href="politique-confidentialite.html">Voir la politique cookies</a>
      </section>
      <section class="container page-section">
        <div class="section-head">
          <div>
            <span class="eyebrow">Derniers articles</span>
            <h2>Nos piliers editoriaux</h2>
          </div>
          <a href="articles/index.html">Tout parcourir</a>
        </div>
        <div class="post-grid">
          ${homeCards}
        </div>
      </section>
      <section class="container page-section">
        <div class="section-head">
          <div>
            <span class="eyebrow">Confiance &amp; E-E-A-T</span>
            <h2>Une promesse editoriale claire</h2>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card post-card"><h3>Experience terrain</h3><p>Chaque article traduit une logique patrimoniale concrete : horizon, cash-flow, fiscalite, risque et arbitrages reels.</p></div>
          <div class="info-card post-card"><h3>Sources publiques privilegiees</h3><p>Service-Public, impots.gouv.fr, AMF, ANIL et Ministere de l'Economie servent de base aux sujets reglementaires ou fiscaux.</p></div>
          <div class="info-card post-card"><h3>Monetisation propre</h3><p>Le site respecte l'experience utilisateur : zones publicitaires identifiees, chargement bloque sans consentement et pages legales completes.</p></div>
        </div>
      </section>
    </main>`,
  })
);

write(
  "a-propos.html",
  layout({
    title: `A propos | ${site.name}`,
    description: "Presentation de l'auteur fictif, de la ligne editoriale et des signaux E-E-A-T du blog.",
    canonical: `${site.url}/a-propos.html`,
    schemas: commonSchemas("A propos", `${site.url}/a-propos.html`, "Presentation de l'auteur fictif et de la ligne editoriale du blog."),
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="index.html">Accueil</a><span>/</span><span>A propos</span></nav>
        <div class="about-hero">
          <img src="assets/images/auteur-camille-durand.svg" alt="Portrait illustre de Camille Durand" loading="lazy">
          <div>
            <span class="eyebrow">Auteure fictive</span>
            <h1>Camille Durand</h1>
            <p class="lead">Conseillere patrimoniale fictive, specialisee en finances personnelles, investissement de long terme et strategie fiscale des particuliers.</p>
            <ul class="list-clean">
              <li>12 ans d'experience editoriale sur les finances personnelles</li>
              <li>Certification fictive AMF et formation fictive en ingenierie patrimoniale</li>
              <li>Interventions regulieres dans des webinaires grand public sur l'epargne et la transmission</li>
            </ul>
          </div>
        </div>
        <section class="article-content" style="margin-top:1.5rem">
          <h2>Mission editoriale</h2>
          <p>Le but du site est simple : traduire des sujets patrimoniaux parfois intimidants en decisions concretement utiles. Ici, pas de promesses de richesse rapide, pas de sensationnalisme, pas de raccourcis trompeurs. Nous cherchons a aider les lecteurs a construire des systemes durables : une epargne de precaution solide, des enveloppes bien choisies, des investissements compris et une fiscalite anticipee.</p>
          <h2>Pourquoi ces contenus sont credibles</h2>
          <p>Chaque page affiche un auteur, une date de mise a jour et une logique de verification. Les sujets reglementaires s'appuient prioritairement sur des sources publiques. Les recommandations restent prudentes, contextualisees et tournées vers l'autonomie du lecteur.</p>
          <h2>Nos engagements E-E-A-T</h2>
          <ul>
            <li>Experience : exemples concrets, grilles de decision, arbitrages realistes.</li>
            <li>Expertise : vocabulaire juste, fiscalite contextualisee, differenciation entre information et conseil personnalise.</li>
            <li>Autorite : liens vers sources publiques et structure editoriale coherente.</li>
            <li>Fiabilite : pages legales, contact clair, politique de confidentialite detaillee.</li>
          </ul>
        </section>
      </div>
    </main>`,
  })
);

write(
  "contact.html",
  layout({
    title: `Contact | ${site.name}`,
    description: "Contactez la redaction pour une question editoriale, un signalement ou une demande de partenariat.",
    canonical: `${site.url}/contact.html`,
    schemas: commonSchemas("Contact", `${site.url}/contact.html`, "Page de contact du blog."),
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="index.html">Accueil</a><span>/</span><span>Contact</span></nav>
        <h1>Contact</h1>
        <p class="lead">Une question, une remarque ou une proposition de partenariat editorial ? Ecrivez-nous.</p>
        <div class="grid-two">
          <section class="form-card">
            <h2>Formulaire de contact</h2>
            <form action="https://formspree.io/f/your-form-id" method="POST">
              <label>Nom<input type="text" name="nom" required></label>
              <label>Email<input type="email" name="email" required></label>
              <label>Sujet<input type="text" name="sujet" required></label>
              <label>Message<textarea name="message" rows="7" required></textarea></label>
              <input type="hidden" name="_subject" value="Nouveau message depuis Patrimoine Nouvelle Generation">
              <button class="button button-primary" type="submit">Envoyer</button>
            </form>
            <p class="note">Remplacez <code>your-form-id</code> par votre identifiant Formspree ou Getform avant mise en ligne.</p>
          </section>
          <section class="form-card">
            <h2>Coordonnees</h2>
            <p><strong>Email :</strong> <a href="mailto:${site.email}">${site.email}</a></p>
            <p><strong>Telephone :</strong> ${site.phone}</p>
            <p><strong>Adresse editoriale :</strong> 10 rue de la Bourse, 75002 Paris, France</p>
            <p>Temps de reponse habituel : 2 a 3 jours ouvres.</p>
          </section>
        </div>
      </div>
    </main>`,
  })
);

write(
  "mentions-legales.html",
  layout({
    title: `Mentions legales | ${site.name}`,
    description: "Informations sur l'editeur, l'hebergeur, la propriete intellectuelle et les credits du site.",
    canonical: `${site.url}/mentions-legales.html`,
    schemas: commonSchemas("Mentions legales", `${site.url}/mentions-legales.html`, "Mentions legales du site."),
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="index.html">Accueil</a><span>/</span><span>Mentions legales</span></nav>
        <h1>Mentions legales</h1>
        <section class="article-content">
          <h2>Editeur du site</h2>
          <p>Patrimoine Nouvelle Generation, publication editee par Camille Durand, entrepreneure individuelle fictive pour ce modele editorial.</p>
          <p>Adresse : 10 rue de la Bourse, 75002 Paris, France</p>
          <p>Email : <a href="mailto:${site.email}">${site.email}</a></p>
          <h2>Directrice de la publication</h2>
          <p>Camille Durand</p>
          <h2>Hebergeur</h2>
          <p>Render - Static Site. Site web : <a href="https://render.com/" target="_blank" rel="noopener noreferrer">render.com</a></p>
          <h2>Propriete intellectuelle</h2>
          <p>L'ensemble des contenus originaux du site, textes, structure, design, illustrations et logos, est protege par le droit d'auteur. Toute reproduction, diffusion ou reutilisation sans autorisation prealable est interdite.</p>
          <h2>Credits</h2>
          <p>Site genere en HTML, CSS et JavaScript vanilla. Illustrations SVG creees pour ce projet. Typographies : Merriweather et Open Sans via Google Fonts.</p>
        </section>
      </div>
    </main>`,
  })
);

write(
  "politique-confidentialite.html",
  layout({
    title: `Politique de confidentialite | ${site.name}`,
    description: "Politique de confidentialite conforme RGPD : cookies, AdSense, droits des utilisateurs et durees de conservation.",
    canonical: `${site.url}/politique-confidentialite.html`,
    schemas: commonSchemas(
      "Politique de confidentialite",
      `${site.url}/politique-confidentialite.html`,
      "Politique de confidentialite et politique cookies du site."
    ),
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="index.html">Accueil</a><span>/</span><span>Politique de confidentialite</span></nav>
        <h1>Politique de confidentialite</h1>
        <section class="article-content">
          <h2>1. Responsable du traitement</h2>
          <p>Le responsable du traitement est Patrimoine Nouvelle Generation, joignable a l'adresse <a href="mailto:${site.email}">${site.email}</a>.</p>
          <h2>2. Donnees collectees</h2>
          <p>Nous pouvons collecter les donnees suivantes : nom, adresse email, message transmis via le formulaire, donnees techniques strictement necessaires au fonctionnement du site, et donnees de consentement cookies.</p>
          <h2>3. Finalites</h2>
          <p>Les donnees sont utilisees pour repondre aux demandes recues, administrer le site, gerer la preuve de consentement et, si vous l'acceptez, mesurer l'audience et afficher des publicites Google AdSense.</p>
          <h2>4. Cookies</h2>
          <p>Le site utilise des cookies necessaires au fonctionnement, des cookies de mesure d'audience et, avec votre consentement, des cookies publicitaires. Aucune annonce personnalisee ne doit etre chargee tant que vous n'avez pas accepte la categorie correspondante.</p>
          <h2>5. Google AdSense</h2>
          <p>Lorsque les publicites seront activees, Google AdSense pourra deposer des cookies pour personnaliser ou mesurer les annonces, sous reserve de votre consentement. Vous pouvez modifier vos choix a tout moment en supprimant le stockage local du navigateur ou via un futur centre de preferences.</p>
          <h2>6. Base legale</h2>
          <p>Le traitement repose sur votre consentement pour les cookies non essentiels, et sur l'interet legitime ou l'execution de mesures precontractuelles pour la gestion des messages et la securite du site.</p>
          <h2>7. Duree de conservation</h2>
          <p>Les demandes de contact peuvent etre conservees jusqu'a 24 mois. Les preferences de consentement cookies sont conservees 6 mois. Les journaux techniques sont conserves selon les necessites de securite et de maintenance.</p>
          <h2>8. Vos droits</h2>
          <p>Conformement au RGPD, vous disposez des droits d'acces, de rectification, d'effacement, d'opposition, de limitation et de portabilite lorsque ces droits s'appliquent. Vous pouvez egalement introduire une reclamation aupres de la CNIL.</p>
          <h2>9. Sous-traitants et hebergement</h2>
          <p>Le site est heberge sur Render. Le formulaire de contact peut etre sous-traite a Formspree ou Getform selon votre configuration effective. Google peut intervenir comme sous-traitant ou responsable distinct pour AdSense selon les cas d'usage.</p>
        </section>
      </div>
    </main>`,
  })
);

write(
  "plan-du-site.html",
  layout({
    title: `Plan du site | ${site.name}`,
    description: "Liste complete de toutes les pages et de tous les articles du site.",
    canonical: `${site.url}/plan-du-site.html`,
    schemas: commonSchemas("Plan du site", `${site.url}/plan-du-site.html`, "Plan du site HTML complet."),
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="index.html">Accueil</a><span>/</span><span>Plan du site</span></nav>
        <h1>Plan du site</h1>
        <section class="article-content anchor-list">
          <a href="index.html">Accueil</a>
          <a href="a-propos.html">A propos</a>
          <a href="contact.html">Contact</a>
          <a href="mentions-legales.html">Mentions legales</a>
          <a href="politique-confidentialite.html">Politique de confidentialite</a>
          <a href="articles/index.html">Index des articles</a>
          ${finalArticles
            .map((article) => `<a href="articles/${article.slug}.html">${article.title}</a>`)
            .join("")}
        </section>
      </div>
    </main>`,
  })
);

write(
  "articles/index.html",
  layout({
    title: `Articles | ${site.name}`,
    description: "Tous les articles placements, immobilier et fiscalite du blog Patrimoine Nouvelle Generation.",
    canonical: `${site.url}/articles/index.html`,
    level: 1,
    schemas: [
      orgSchema,
      breadcrumbSchema([
        { name: "Accueil", url: `${site.url}/index.html` },
        { name: "Articles", url: `${site.url}/articles/index.html` },
      ]),
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Articles", url: `${site.url}/articles/index.html` },
    ],
    content: `<main class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'ariane"><a href="../index.html">Accueil</a><span>/</span><span>Articles</span></nav>
        <h1>Tous les articles</h1>
        <p class="lead">Placements, immobilier, fiscalite, transmission : notre base editoriale complete pour construire un patrimoine solide.</p>
        <div class="post-grid">
          ${allCards}
        </div>
      </div>
    </main>`,
  })
);

write(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`
);

const sitemapPages = [
  "index.html",
  "a-propos.html",
  "contact.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "plan-du-site.html",
  "articles/index.html",
  ...finalArticles.map((article) => `articles/${article.slug}.html`),
];

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map((page) => {
    const priority = page === "index.html" ? "1.0" : page === "articles/index.html" ? "0.9" : page.startsWith("articles/") ? "0.8" : "0.5";
    return `  <url><loc>${site.url}/${page}</loc><lastmod>2026-04-25</lastmod><priority>${priority}</priority></url>`;
  })
  .join("\n")}
</urlset>
`
);

write(
  "README.md",
  [
    `# ${site.name}`,
    "",
    "Site statique HTML, CSS et JavaScript vanilla, pret a etre deploye sur GitHub puis Render Static Site.",
    "",
    "## Structure",
    "",
    "```",
    "/assets/",
    "  /css/style.css",
    "  /js/main.js",
    "  /images/",
    "/articles/",
    "index.html",
    "a-propos.html",
    "contact.html",
    "mentions-legales.html",
    "politique-confidentialite.html",
    "plan-du-site.html",
    "robots.txt",
    "sitemap.xml",
    "```",
    "",
    "## Lancer en local",
    "",
    "Le site fonctionne sans build. Ouvrez simplement [index.html](./index.html) dans votre navigateur.",
    "",
    "## Deployer sur GitHub",
    "",
    "1. Creez un nouveau depot GitHub vide.",
    "2. Ajoutez tous les fichiers du projet dans le depot.",
    "3. Initialisez git si besoin :",
    "",
    "```bash",
    "git init",
    "git add .",
    "git commit -m \"Initial static patrimonial blog\"",
    "git branch -M main",
    "git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git",
    "git push -u origin main",
    "```",
    "",
    "## Deployer sur Render",
    "",
    "1. Connectez-vous a Render.",
    "2. Cliquez sur **New +** puis **Static Site**.",
    "3. Connectez votre depot GitHub.",
    "4. Renseignez les champs ainsi :",
    "   - **Build command** : laisser vide",
    "   - **Publish directory** : `.`",
    "5. Lancez le deploiement.",
    "",
    "## Domaine personnalise",
    "",
    "1. Dans Render, ouvrez le service statique.",
    "2. Allez dans **Settings > Custom Domains**.",
    "3. Ajoutez votre domaine et suivez les enregistrements DNS proposes.",
    "4. Une fois le domaine actif, pensez a mettre a jour les URLs canoniques, les URLs Open Graph et `sitemap.xml`.",
    "",
    "## Points a configurer avant mise en production",
    "",
    "1. Remplacer l'URL canonique par votre domaine final si besoin.",
    "2. Remplacer l'action Formspree dans [contact.html](./contact.html).",
    "3. Inserer votre code Google AdSense dans les emplacements `.ad`.",
    "4. Completer le chargement conditionnel du script AdSense dans [assets/js/main.js](./assets/js/main.js) selon votre configuration.",
    "",
    "## Monetisation et conformite",
    "",
    "- Emplacements publicitaires prets a l'emploi sur les articles.",
    "- Banniere de consentement cookies avec acceptation, refus et personnalisation.",
    "- Pages legales et RGPD incluses.",
    "- `robots.txt` et `sitemap.xml` inclus.",
  ].join("\\n")
);

console.log(`Generated ${finalArticles.length} articles and core pages in ${root}`);
