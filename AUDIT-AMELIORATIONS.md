# Audit et améliorations — ROSBRI DESIGN

Date : 8 août 2026

## Périmètre audité

Pages publiques, composants partagés, CSS, scripts, catalogue de 467 produits, images référencées, navigation, filtres, panier, fiche produit, responsive, SEO, accessibilité et chaîne de build.

Dépendances principales :

- catalog-data.js contient les produits et leurs identifiants.
- js/taxonomy.js centralise les six catégories publiques et les anciennes appellations.
- catalog.js construit les filtres, cartes, options et recherches.
- js/components.js charge le header, le footer, le menu mobile et le panier.
- js/cart.js gère le panier local et la commande WhatsApp.
- Les feuilles de css/ forment le design system partagé.

## Corrections principales

- Suppression du repli silencieux vers le premier produit pour un identifiant invalide.
- État « Produit introuvable » conservé, avec produits similaires masqués.
- Produits similaires issus en priorité de la même catégorie et exclusion du produit courant.
- Taxonomie centrale : vetements, accessoires, enfants, cadeaux, maison, entreprise.
- Compatibilité avec les anciennes URL, accents, casses et « Sacs & Pochettes ».
- Filtres synchronisés avec l’URL, tris synchronisés, compteur accessible et réinitialisation desktop.
- Squelettes de chargement et états vides propres.
- Accueil réordonné selon le parcours commercial demandé.
- Cartes d’accueil construites avec l’API DOM.
- Univers « Entreprises & Événements » ajouté aux Collections.
- Page Notre histoire rendue plus factuelle et structurée.
- Fiche produit enrichie : statut, galerie, confection, livraison, retouches et JSON-LD.
- Focus restauré pour le panier, les filtres mobiles et la modale ; fermeture avec Échap.
- Lien « Aller au contenu principal » ajouté sur toutes les pages.
- Tailwind CDN remplacé par un CSS local minifié.
- Métadonnées, canoniques, Open Graph, Twitter Card et données structurées ajoutées.
- 467 pages produits SEO statiques générées dans produits/.
- Sitemap généré automatiquement ; page 404 en noindex et sans catalogue.
- CSS intégré de la 404 déplacé dans css/pages.css.

## Commandes

Installer les dépendances :

    npm install

Construire le CSS, les pages produits SEO et le sitemap :

    npm run build

Lancer les tests :

    npm test

Servir localement :

    npm run serve

Puis ouvrir http://127.0.0.1:4173/.

## Tests exécutés

- Syntaxe JavaScript des scripts modifiés.
- Build CSS local minifié.
- Génération de 467 pages produits et du sitemap.
- Produit valide 483 et produit invalide 999999.
- Alias de catégories anciens et nouveaux.
- Unicité des 467 identifiants.
- Existence des images du catalogue.
- Ordre des dix sections de l’accueil.
- Six cartes Collections.
- Métadonnées, canoniques, noindex 404 et absence de Tailwind CDN.

## Points à vérifier en production

- Configurer le serveur pour que 404.html soit envoyé avec le véritable statut HTTP 404.
- Vérifier les aperçus sociaux après publication.
- Contrôler visuellement les formats ordinateur, tablette et mobile dans un navigateur connecté ; le contrôle navigateur intégré n’était pas disponible dans cette session.
- Aucun déploiement, push ou changement du dépôt distant n’a été effectué.