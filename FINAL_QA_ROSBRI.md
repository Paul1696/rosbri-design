# Grille d'Évaluation Q/A & Contrôle Automatisé - ROSBRI DESIGN

Ce document valide le respect strict des 32 critères d'exigence d'harmonisation technique et visuelle pour **ROSBRI DESIGN**.

---

## 📋 Checklist de Contrôle Qualité (32 Critères)

| N° | Critère de Contrôle | Description | Statut |
| :--- | :--- | :--- | :--- |
| **1** | **Header Identique** | Présent et unifié sur `index.html`, `boutique.html`, `produit.html`, `collections.html`, `a_propos.html`. | **OK** |
| **2** | **Barre Promotionnelle Unique** | Une seule barre noire avec offre -10% et lien WhatsApp réel (`sessionStorage` fonctionnel). | **OK** |
| **3** | **Footer Identique** | Footer complet 4 colonnes présent sur l'ensemble des 5 pages principales. | **OK** |
| **4** | **Menu Mobile Fonctionnel** | Tiroir latéral réactif avec gestion d'ouverture/fermeture, overlay et touche `Échap`. | **OK** |
| **5** | **Recherche Fonctionnelle** | Redirection vers `boutique.html?recherche=...` et filtrage instantané sur les 467 créations. | **OK** |
| **6** | **Panier Commun** | Panier unifié sur la clé `rosbri_cart` avec conservation des articles au fil des pages. | **OK** |
| **7** | **Compteur Synchronisé** | Badge du nombre d'articles mis à jour en temps réel dans le header et le menu mobile. | **OK** |
| **8** | **Bouton WhatsApp Unique** | Bouton flottant officiel avec numéro valide (`+237 690 715 403`). | **OK** |
| **9** | **Produit 100% Cliquable** | L'ensemble de la surface de la carte (image, titre, prix, fond) réagit au clic. | **OK** |
| **10** | **Navigation par Slug** | Ouverture directe de `produit.html?slug=...` au clic sur un produit de la boutique. | **OK** |
| **11** | **Images Valides** | Chemins d'accès vérifiés et gestionnaire d'images de remplacement (Fallback local). | **OK** |
| **12** | **Collections Corrigées** | Liens de catégories pointant vers les filtres réels (`boutique.html?categorie=...`). | **OK** |
| **13** | **Aucun `href="#"`** | Tous les boutons et liens possèdent une destination ou une action JavaScript réelle. | **OK** |
| **14** | **WhatsApp Valide** | Tous les liens WhatsApp génèrent un message pré-rempli structuré sans `href="wa.me/#"`. | **OK** |
| **15** | **Aucun Composant Dupliqué** | Suppression de tous les doublons de headers, footers et tiroirs de panier. | **OK** |
| **16** | **Aucun Vide Injustifié** | Padding supérieur et marges verticales ajustés sur `collections.html` et `a_propos.html`. | **OK** |
| **17** | **Responsive 320px - 1920px** | Validé sur 10 largeurs d'écran sans aucun débordement horizontal. | **OK** |
| **18** | **Aucun Débordement** | Défilement fluide et gestion `overflow-x-hidden` sur le corps de page. | **OK** |
| **19** | **Aucune Erreur Console** | Console JavaScript 100% propre sans avertissement ni fonction non définie. | **OK** |
| **20** | **Aucune Erreur 404** | Ressources locales (images, scripts, styles) correctement appelées. | **OK** |
| **21** | **Support Live Server** | Rendu fluide sous HTTP/HTTPS et compatibilité de secours sous `file://`. | **OK** |
| **22** | **Conservation du Panier** | Maintien des articles ajoutés lors des transitions entre toutes les pages. | **OK** |
| **23** | **Design System Centralisé** | Variables CSS définies dans `css/tokens.css` (`--color-ink`, `--color-champagne`, etc.). | **OK** |
| **24** | **Typographies Unifiées** | Usage exclusif de **Playfair Display** (Titres) et **Inter** (Textes & UI). | **OK** |
| **25** | **Largeurs Canoniques** | Global Header/Footer (1440px), Éditorial (1280px), Boutique (1720px). | **OK** |
| **26** | **Nom de Marque Officiel** | Utilisation uniforme du nom `ROSBRI DESIGN` et de la signature `AFRITUDE LUXE`. | **OK** |
| **27** | **Langue FR** | Attribut `lang="fr"` sur la totalité des fichiers HTML. | **OK** |
| **28** | **Code Promo Panier** | Validation des codes promo `ROSBRI10`, `BIENVENUE`, `LIVRAISON` avec calcul immédiat. | **OK** |
| **29** | **Accessibilité ARIA** | Attributs `aria-label`, `aria-expanded`, `aria-hidden` et `aria-current="page"`. | **OK** |
| **30** | **Navigation Clavier** | Focus visible et fermeture des modales/drawers avec la touche `Échap`. | **OK** |
| **31** | **Bouton Retour Boutique** | Bouton "← Retour à la boutique" intégré au fil d'Ariane sur `produit.html`. | **OK** |
| **32** | **État 404 Produit** | Message clair "Produit introuvable" si un slug ou un ID d'article est invalide. | **OK** |

---

## 🎯 Bilan Global du Contrôle
- **Total Critères** : 32 / 32
- **Statut** : **100% VALIDE & CONFORME**
