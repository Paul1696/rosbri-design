# Configuration Technique - ROSBRI DESIGN (Douala, Cameroun)

Ce document détaille les composants techniques nécessaires pour lancer votre boutique hybride.

## 1. Stack Technologique (Recommandé)
*   **CMS :** WordPress
*   **E-commerce :** Plugin **WooCommerce** (Gratuit, open-source).
*   **Hébergement :** 
    *   Option locale : [Camoo Hosting](https://www.camoo.hosting/) (serveurs proches, support local).
    *   Option internationale : [SiteGround](https://www.siteground.com/) ou [Hostinger](https://www.hostinger.com/) (très performant pour WooCommerce).
*   **Domaine :** .cm (pour le référencement local) ou .com (international).

## 2. Paiements (Mobile Money & Cartes)
Au Cameroun, le Mobile Money est roi. Voici les meilleures passerelles pour WooCommerce :

| Passerelle | Moyens de paiement | Pourquoi ce choix ? |
| :--- | :--- | :--- |
| **PayUnit** | MTN MoMo, Orange Money, Visa, MC | Très facile à intégrer, développée localement au Cameroun. |
| **My-CoolPay** | MTN MoMo, Orange Money, Cartes | Plugin officiel WordPress disponible, très fiable. |
| **Flutterwave** | MoMo, Cartes, Virement | Solution panafricaine, idéal si vous prévoyez de vendre hors Cameroun plus tard. |

**Action recommandée :** Créer un compte sur **PayUnit** ou **My-CoolPay** pour obtenir vos clés API.

## 3. Gestion du Stock Hybride
Pour mélanger vos propres articles et le dropshipping sur WooCommerce :

*   **Articles en Stock (ROSBRI) :** Utiliser la gestion de stock native de WooCommerce. Configurer "Douala" comme point d'expédition par défaut.
*   **Articles Dropshipping :** 
    *   Utiliser le plugin **AliDropship** ou **DropshipMe** pour importer des produits d'AliExpress.
    *   **Astuce technique :** Créer une "Classe de livraison" spécifique pour ces produits (ex: "Livraison Internationale 15-20 jours") afin de ne pas confondre le client avec vos articles disponibles immédiatement à Douala.

## 4. Logistique et Livraison
*   **Plugin de Livraison :** Configurer les "Zones de livraison" dans WooCommerce.
    *   **Zone 1 : Douala.** Tarif forfaitaire (ex: 1000 - 1500 FCFA) par coursier moto.
    *   **Zone 2 : Autres villes (Yaoundé, Bafoussam...).** Livraison par agences de transport (Buca, Finexs) avec retrait en agence.
    *   **Zone 3 : International.** Livraison via DHL ou EMS.

## 5. Sécurité et Performance
*   **SSL (HTTPS) :** Indispensable pour la confiance et le paiement sécurisé.
*   **Sauvegarde :** Plugin **UpdraftPlus** pour ne pas perdre vos données.
*   **Cache :** Plugin **WP Rocket** ou **LiteSpeed Cache** pour un site rapide même avec une connexion internet moyenne.
