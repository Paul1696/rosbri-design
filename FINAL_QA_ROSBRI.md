# Checklist QA Finale & Assurance Qualité - ROSBRI DESIGN

Ce document constitue le PV d'assurance qualité final suite à la refonte technique et l'harmonisation complète du site **ROSBRI DESIGN (AFRITUDE LUXE)**.

---

## 📋 Table de Recette et de Contrôle Automatisé

| N° | Point de Contrôle | Description & Portée | Statut |
| :--- | :--- | :--- | :---: |
| **1** | **Header Identique** | Présent et unifié sur `index.html`, `boutique.html`, `produit.html`, `collections.html`, `a_propos.html`. | **CORRIGÉ** |
| **2** | **Une seule Barre Promo** | Une seule barre noire partagée (`components/announcement-bar.html`), sans doublons ni doubles marges. | **CORRIGÉ** |
| **3** | **Footer Identique** | Footer 4 colonnes 100% français unifié sur les 5 pages du site. | **CORRIGÉ** |
| **4** | **Menu Mobile Fonctionnel** | Menu tiroir latéral réactif avec `aria-expanded`, overlay backdrop, fermeture `Échap` et verrouillage du scroll. | **CORRIGÉ** |
| **5** | **Recherche Fonctionnelle** | Redirection globale depuis n'importe quelle page vers `boutique.html?recherche=...` et filtrage dynamique. | **CORRIGÉ** |
| **6** | **Panier Commun** | Système de panier centralisé `ROSBriCart` synchronisé via la clé `rosbri_cart` dans `localStorage`. | **CORRIGÉ** |
| **7** | **Compteur Commun** | Badge du panier (`#cart-count-badge`, `data-cart-count`) mis à jour instantanément sur toutes les pages. | **CORRIGÉ** |
| **8** | **WhatsApp Unique** | Bouton WhatsApp flottant unique (`+237 698 193 880`) et messages de commande pré-remplis formatés. | **CORRIGÉ** |
| **9** | **Produit Cliquable** | Toutes les cartes produits de la boutique ouvrent directement la fiche produit. | **CORRIGÉ** |
| **10** | **Navigation par Slug** | Ouverture directe de `produit.html?slug=...` au clic sur un produit de la boutique. | **CORRIGÉ** |
| **11** | **Choix Taille & Couleur T-shirt** | Possibilité de choisir la taille (S, M, L, XL, XXL) et la couleur (Blanc, Noir, Sable, Rose, etc.) sur tous les T-shirts et vêtements. | **CORRIGÉ** |
| **12** | **Code Promo ROSBRI10** | Application d'une réduction de 10%, affichage du sous-total, de la remise et du total final. | **CORRIGÉ** |
| **13** | **Images Valides** | Fallback d'image automatique local (`images/brand/rosbri-wax-design-logo.jpg`) en cas d'image introuvable. | **CORRIGÉ** |
| **14** | **Collections Corrigées** | Images réparées, cartes au ratio 4:5 avec effet hover et liens explicites vers les catégories de la boutique. | **CORRIGÉ** |
| **15** | **Aucun href="#" Invalide** | Tous les boutons et liens possèdent une destination ou une action JavaScript explicite. | **CORRIGÉ** |
| **16** | **Aucun Lien WhatsApp Vide** | Tous les liens WhatsApp utilisent le numéro officiel `+237 698 193 880` avec texte pré-rempli. | **CORRIGÉ** |
| **17** | **Aucun Composant Dupliqué** | Suppression des footers simplified, barres turquoises/blanches isolées et boutons flottants dupliqués. | **CORRIGÉ** |
| **18** | **Aucun Grand Vide Injustifié** | Padding supérieur réajusté (~64px desktop / 36px mobile) sur `a_propos.html` et `collections.html`. | **CORRIGÉ** |
| **19** | **Responsive Validé** | Adaptabilité complète testée de 320px à 1920px (grille boutique 5-col à 1-col). | **OK** |
| **20** | **Aucun Débordement** | Règle `overflow-x: hidden` sur `html, body` empêchant le défilement horizontal parasite. | **OK** |
| **21** | **Console JS Propre** | Code JavaScript résilient avec gardes d'existence (`if (!elem) return;`). | **OK** |
| **22** | **Aucune Erreur 404** | Tous les fichiers JS/CSS et images référencés existent sur le serveur local. | **OK** |
| **23** | **Compatibilité Live Server** | Fonctionnement garanti sous `http://127.0.0.1:5500` avec fallback embarqué si `file://`. | **OK** |
| **24** | **Persistance du Panier** | Les articles ajoutés au panier sont conservés entre toutes les pages du site. | **OK** |

---

## 🧪 Scénarios de Test Utilisateur Exécutés

1. **Scénario 1 (Navigation & Header Unifié)** :
   - Parcours `index.html` -> `boutique.html` -> `collections.html` -> `a_propos.html` -> `produit.html`.
   - Constat : Le composant header reste strictement identique, l'état actif indique la bonne page avec l'indicateur champagne.

2. **Scénario 2 (Sélection T-shirt - Taille & Couleur)** :
   - Ouverture de `produit.html?slug=tshirt-heritage-cameroun`.
   - Sélection de la couleur *Noir* et de la taille *XL*.
   - Clic sur **Pré-commander** ou **Commander sur WhatsApp**.
   - Constat : La taille et la couleur choisies sont directement incluses dans l'article ajouté au panier et dans le message WhatsApp pré-rempli.

3. **Scénario 3 (Code Promo ROSBRI10)** :
   - Ajout d'un produit à 15 000 FCFA dans le panier.
   - Saisie du code promo `ROSBRI10` et clic sur **Appliquer**.
   - Constat : La réduction de 1 500 FCFA (10%) s'affiche, le total passe à 13 500 FCFA et la remise est mentionnée dans le message WhatsApp.

---

## 📌 Points nécessitant une Vérification Manuelle

- **Validation des Réseaux Sociaux** : Remplacer les URLs génériques Facebook (`facebook.com`) et Instagram (`instagram.com`) dans `components/footer.html` par les comptes officiels dès qu'ils seront créés.
