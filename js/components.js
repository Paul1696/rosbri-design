/**
 * ROSBRI DESIGN - Shared Components Loader
 * Injects Announcement Bar, Header, Mobile Menu, Cart Drawer, and Footer.
 * Compatible with both web servers (fetch) and direct file:// protocol (embedded fallbacks).
 */
(function () {
  const templates = {
    announcementBar: `
<div id="rosbri-announcement-bar" class="site-announcement-bar">
  <div class="site-container announcement-container">
    <div class="announcement-left">
      <span class="material-symbols-outlined announcement-icon">local_shipping</span>
      <span class="announcement-text">Livraison au Cameroun & à l'international · Commande accompagnée sur WhatsApp</span>
    </div>
    <div class="announcement-socials">
      <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋%20Je%20souhaite%20commander." target="_blank" rel="noopener noreferrer" class="announcement-social-link font-semibold text-xs flex items-center gap-1">
        <span>Commander sur WhatsApp</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
      <button id="close-announcement-bar" type="button" aria-label="Fermer l'annonce" class="text-white/60 hover:text-white transition-colors p-1">
        ✕
      </button>
    </div>
  </div>
</div>`,

    header: `
<header class="site-header" id="site-main-header">
  <div class="site-container header-container">
    <a href="index.html" class="header-brand" aria-label="Rosbri Wax Design - Accueil">
      <img src="images/brand/rosbri-logo-horizontal.png" alt="ROSBRI WAX DESIGN" class="header-logo-image">
    </a>

    <nav class="header-nav" aria-label="Navigation principale">
      <a href="index.html" data-nav-link="index.html" class="nav-link">ACCUEIL</a>
      <a href="boutique.html" data-nav-link="boutique.html" class="nav-link">BOUTIQUE</a>
      <a href="collections.html" data-nav-link="collections.html" class="nav-link">COLLECTIONS</a>
      <a href="a_propos.html" data-nav-link="a_propos.html" class="nav-link">À PROPOS</a>
    </nav>

    <div class="header-actions">
      <form id="header-search-form" action="boutique.html" method="GET" class="hidden sm:flex items-center relative w-44 md:w-56">
        <input type="text" name="recherche" id="header-search-input" placeholder="Rechercher..." class="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-all">
        <button type="submit" aria-label="Rechercher un produit" class="absolute left-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center justify-center min-w-[28px] min-h-[28px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>

      <button data-open-cart class="action-btn" type="button" aria-label="Voir mon panier">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span id="cart-count-badge" class="cart-count-badge" style="display:none;">0</span>
      </button>

      <button data-toggle-mobile-menu class="mobile-nav-toggle" type="button" aria-label="Ouvrir le menu mobile">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </div>
</header>`,

    mobileMenu: `
<div id="mobile-menu-drawer" class="mobile-menu-drawer" aria-hidden="true">
  <div data-close-mobile-menu class="drawer-backdrop"></div>
  <div class="mobile-drawer-header">
    <a href="index.html" class="header-brand">
      <img src="images/brand/rosbri-logo-horizontal.png" alt="ROSBRI DESIGN" class="header-logo-image" style="height: 36px;">
    </a>
    <button data-close-mobile-menu type="button" aria-label="Fermer le menu" class="modal-close-btn" style="position:static;">✕</button>
  </div>
  <form action="boutique.html" method="GET" class="mb-6 relative">
    <input type="text" name="recherche" placeholder="Rechercher un article..." class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)]">
    <button type="submit" aria-label="Rechercher" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
      <span class="material-symbols-outlined text-sm">search</span>
    </button>
  </form>
  <nav class="mobile-nav-list">
    <a href="index.html" data-nav-link="index.html" class="mobile-nav-link">Accueil</a>
    <a href="boutique.html" data-nav-link="boutique.html" class="mobile-nav-link">Boutique</a>
    <a href="collections.html" data-nav-link="collections.html" class="mobile-nav-link">Collections</a>
    <a href="a_propos.html" data-nav-link="a_propos.html" class="mobile-nav-link">À Propos</a>
  </nav>
  <div class="space-y-3 pt-6 mt-auto">
    <button data-open-cart type="button" class="button-primary button-full">
      <span class="material-symbols-outlined text-lg">shopping_bag</span>
      <span>Voir mon Panier</span>
    </button>
    <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋%20J%27aimerais%20des%20conseils" target="_blank" rel="noopener noreferrer" class="button-secondary button-full">
      <span class="material-symbols-outlined text-lg text-[#25D366]">chat</span>
      <span>Conseil sur WhatsApp</span>
    </a>
  </div>
</div>`,

    cartDrawer: `
<div class="cart-drawer" id="cart-drawer" aria-hidden="true" style="display:none;">
  <div class="cart-drawer-overlay" data-close-cart></div>
  <aside class="cart-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
    <header class="cart-drawer-header">
      <div>
        <span class="cart-drawer-kicker">Votre sélection</span>
        <h2 id="cart-drawer-title">Mon panier</h2>
      </div>
      <button class="cart-drawer-close" type="button" data-close-cart aria-label="Fermer le panier">×</button>
    </header>
    <div class="cart-drawer-body" id="cart-drawer-items" data-cart-items aria-live="polite"></div>
    <footer class="cart-drawer-footer" id="cart-drawer-footer">
      <div class="cart-order-note">
        <span aria-hidden="true">✦</span>
        <p><strong>Confection sur commande.</strong> Envoyez votre sélection sur WhatsApp pour confirmer la disponibilité et le délai.</p>
      </div>
      <div class="cart-promo">
        <label for="cart-promo-input">Code promotionnel</label>
        <div class="cart-promo-row">
          <input type="text" id="cart-promo-input" placeholder="Ex. ROSBRI10" autocomplete="off">
          <button type="button" id="cart-promo-apply-btn">Appliquer</button>
        </div>
        <p id="cart-promo-message" class="cart-promo-message" hidden></p>
      </div>
      <div class="cart-total-row">
        <span>Total estimé</span>
        <strong id="cart-total-value" data-cart-total>0 FCFA</strong>
      </div>
      <div class="cart-drawer-actions">
        <a class="cart-checkout-button" id="cart-order-btn" href="https://wa.me/237698193880" target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
        <button class="cart-clear-button" id="cart-clear-btn" type="button">Vider le panier</button>
      </div>
    </footer>
  </aside>
</div>`,

    footer: `
<footer class="site-footer">
  <div class="site-container">
    <div class="footer-grid">
      <div>
        <h3 class="footer-brand-title">ROSBRI WAX DESIGN</h3>
        <p class="footer-brand-desc">
          Maison de haute création textile et prêt-à-porter d'inspiration africaine contemporaine. Des pièces artisanales uniques conçues avec soin au Cameroun.
        </p>
        <div class="announcement-socials" style="margin-top: 1rem;">
          <a href="https://wa.me/237698193880" target="_blank" rel="noopener noreferrer" class="announcement-social-link" aria-label="WhatsApp ROSBRI DESIGN">
            <span class="material-symbols-outlined text-lg">chat</span>
          </a>
        </div>
      </div>
      <div>
        <h4 class="footer-column-title">NAVIGATION</h4>
        <ul class="footer-links">
          <li><a href="index.html">Accueil</a></li>
          <li><a href="boutique.html">Boutique</a></li>
          <li><a href="collections.html">Collections</a></li>
          <li><a href="a_propos.html">À Propos de la Maison</a></li>
          <li><a href="boutique.html?categorie=entreprise">Entreprises & B2B</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-column-title">NOS UNIVERS</h4>
        <ul class="footer-links">
          <li><a href="boutique.html?categorie=vetements">Kimonos & Silhouettes</a></li>
          <li><a href="boutique.html?categorie=accessoires">Sacs & Accessoires</a></li>
          <li><a href="boutique.html?categorie=cadeaux">Coffrets & Attentions</a></li>
          <li><a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋%20Je%20souhaite%20personnaliser%20un%20article." target="_blank" rel="noopener">Création Sur Mesure</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-column-title">CONTACT & ATELIER</h4>
        <ul class="footer-links" style="margin-bottom: 1.25rem;">
          <li style="display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-gold); flex: 0 0 auto;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>
            <span>+237 698 193 880</span>
          </li>
          <li style="display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-gold); flex: 0 0 auto;"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>Douala, Cameroun</span>
          </li>
        </ul>
        <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋" target="_blank" rel="noopener noreferrer" class="button-gold" style="min-height: 44px; padding: 0 18px; font-size: 13px;">
          <span>Commander sur WhatsApp</span>
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span id="footer-year">2026</span> ROSBRI WAX DESIGN. Tous droits réservés. Élégance Artisanale & Afritude Luxe.</p>
      <div style="display: flex; gap: 20px;">
        <a href="a_propos.html" style="color: var(--color-text-muted);">Politique de confidentialité</a>
        <a href="a_propos.html" style="color: var(--color-text-muted);">Mentions légales</a>
      </div>
    </div>
  </div>
</footer>`
  };

  async function loadMount(mountIds, componentFile, fallbackHtml) {
    let mountNode = null;
    for (const id of mountIds) {
      const node = document.getElementById(id);
      if (node) {
        mountNode = node;
        break;
      }
    }
    if (!mountNode) return;

    let content = fallbackHtml;
    if (window.location.protocol.startsWith("http")) {
      try {
        const resp = await fetch(`${componentFile}?v=20260828-footer-aligned`);
        if (resp.ok) {
          content = await resp.text();
        } else {
          console.info(`[Components] Chargement HTTP de ${componentFile} indisponible (${resp.status}), utilisation du composant embarqué.`);
        }
      } catch (e) {
        console.info(`[Components] Chargement local de ${componentFile}, utilisation du composant embarqué.`);
      }
    }
    mountNode.innerHTML = content;
  }

  let loaded = false;
  document.addEventListener("DOMContentLoaded", async () => {
    if (loaded) return;
    loaded = true;

    await Promise.all([
      loadMount(["site-announcement", "announcement-bar-mount"], "components/announcement-bar.html", templates.announcementBar),
      loadMount(["site-header", "header-mount"], "components/header.html", templates.header),
      loadMount(["site-mobile-menu", "mobile-menu-mount"], "components/mobile-menu.html", templates.mobileMenu),
      loadMount(["site-cart-drawer", "cart-drawer-mount"], "components/cart-drawer.html", templates.cartDrawer),
      loadMount(["site-footer", "footer-mount"], "components/footer.html", templates.footer)
    ]);

    const yearNode = document.getElementById("footer-year");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());

    // Sticky header translucent effect on scroll
    window.addEventListener("scroll", () => {
      const headerEl = document.querySelector(".site-header");
      if (headerEl) {
        if (window.scrollY > 30) {
          headerEl.classList.add("scrolled");
        } else {
          headerEl.classList.remove("scrolled");
        }
      }
    });

    console.log("ROSBRI DESIGN - Composants V2 chargés avec succès.");
    document.dispatchEvent(new CustomEvent("rosbri:components-loaded"));
    document.dispatchEvent(new CustomEvent("components:loaded"));
  });
})();
