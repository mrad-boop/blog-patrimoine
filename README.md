# Patrimoine Nouvelle Generation

Site statique HTML, CSS et JavaScript vanilla, pret a etre deploye sur GitHub puis Render Static Site.

## Structure

```
/assets/
  /css/style.css
  /js/main.js
  /images/
/articles/
index.html
a-propos.html
contact.html
mentions-legales.html
politique-confidentialite.html
plan-du-site.html
robots.txt
sitemap.xml
```

## Lancer en local

Le site fonctionne sans build. Ouvrez simplement [index.html](./index.html) dans votre navigateur.

## Deployer sur GitHub

1. Creez un nouveau depot GitHub vide.
2. Ajoutez tous les fichiers du projet dans le depot.
3. Initialisez git si besoin :

```bash
git init
git add .
git commit -m "Initial static patrimonial blog"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

## Deployer sur Render

1. Connectez-vous a Render.
2. Cliquez sur **New +** puis **Static Site**.
3. Connectez votre depot GitHub.
4. Renseignez les champs ainsi :
   - **Build command** : laisser vide
   - **Publish directory** : `.`
5. Lancez le deploiement.

## Domaine personnalise

1. Dans Render, ouvrez le service statique.
2. Allez dans **Settings > Custom Domains**.
3. Ajoutez votre domaine et suivez les enregistrements DNS proposes.
4. Une fois le domaine actif, pensez a mettre a jour les URLs canoniques, les URLs Open Graph et `sitemap.xml`.

## Points a configurer avant mise en production

1. Remplacer l'URL canonique par votre domaine final si besoin.
2. Remplacer l'action Formspree dans [contact.html](./contact.html).
3. Inserer votre code Google AdSense dans les emplacements `.ad`.
4. Completer le chargement conditionnel du script AdSense dans [assets/js/main.js](./assets/js/main.js) selon votre configuration.

## Monetisation et conformite

- Emplacements publicitaires prets a l'emploi sur les articles.
- Banniere de consentement cookies avec acceptation, refus et personnalisation.
- Pages legales et RGPD incluses.
- `robots.txt` et `sitemap.xml` inclus.
