/**
 * ROSBRI DESIGN - Shared Components Loader
 * Injects Announcement Bar, Header, Mobile Menu, Cart Drawer, and Footer.
 * Compatible with both web servers (fetch) and direct file:// protocol (embedded fallbacks).
 */
(function () {
  const templates = {
    announcementBar: `
<div id="rosbri-announcement-bar" class="bg-ink text-white py-2 px-4 text-xs text-center relative z-[60] flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-300">
  <span>🔥 Offre lancement : -10 % sur votre première commande sur mesure</span>
  <span class="opacity-40">•</span>
  <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋%20Je%20souhaite%20profiter%20de%20l%27offre%20de%20lancement%20-10%25" target="_blank" rel="noopener noreferrer" class="text-champagne hover:underline inline-flex items-center gap-1">
    <span>Commander sur WhatsApp</span>
    <span class="material-symbols-outlined text-sm">arrow_forward</span>
  </a>
  <button id="close-announcement-bar" type="button" aria-label="Fermer l'annonce" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1">
    ✕
  </button>
</div>`,

    header: `
<header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line transition-all duration-300">
  <div class="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
    <a href="index.html" class="flex items-center gap-3 group flex-shrink-0" aria-label="ROSBRI DESIGN - Accueil">
      <img src="images/brand/rosbri-wax-design-logo.jpg" alt="ROSBRI DESIGN" class="h-10 w-auto rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
      <div class="flex flex-col">
        <span class="font-display-accent text-xl font-bold text-ink leading-tight tracking-tight">ROSBRI DESIGN</span>
        <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-champagne">Afritude Luxe</span>
      </div>
    </a>
    <nav class="hidden lg:flex items-center gap-8 font-label-sm uppercase tracking-widest text-xs font-bold text-ink/80" aria-label="Navigation principale">
      <a href="index.html" data-nav-link="index.html" class="hover:text-champagne transition-colors py-1 relative">Accueil</a>
      <a href="boutique.html" data-nav-link="boutique.html" class="hover:text-champagne transition-colors py-1 relative">Boutique</a>
      <a href="collections.html" data-nav-link="collections.html" class="hover:text-champagne transition-colors py-1 relative">Collections</a>
      <a href="a_propos.html" data-nav-link="a_propos.html" class="hover:text-champagne transition-colors py-1 relative">À Propos</a>
      <a href="boutique.html?categorie=Entreprise" data-nav-link="b2b" class="hover:text-champagne transition-colors py-1 relative text-champagne">B2B</a>
    </nav>
    <div class="flex items-center gap-4">
      <form id="header-search-form" action="boutique.html" method="GET" class="hidden sm:flex items-center relative w-48 md:w-64">
        <input type="text" name="recherche" id="header-search-input" placeholder="Rechercher un produit..." class="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-line bg-surface-container-low text-ink placeholder:text-muted focus:outline-none focus:border-champagne focus:bg-white transition-all">
        <button type="submit" aria-label="Lancer la recherche" class="absolute left-3 text-muted hover:text-ink flex items-center justify-center">
          <span class="material-symbols-outlined text-sm">search</span>
        </button>
      </form>
      <button data-open-cart class="relative p-2.5 text-ink hover:text-champagne transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-low" type="button" aria-label="Voir mon panier">
        <span class="material-symbols-outlined text-2xl">shopping_bag</span>
        <span id="cart-count-badge" class="cart-count-badge absolute -top-1 -right-1 bg-champagne text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm" style="display:none;">0</span>
      </button>
      <button data-toggle-mobile-menu class="lg:hidden p-2.5 text-ink hover:text-champagne transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-low" type="button" aria-label="Ouvrir le menu mobile">
        <span class="material-symbols-outlined text-2xl">menu</span>
      </button>
    </div>
  </div>
</header>`,

    mobileMenu: `
<div id="mobile-menu-drawer" class="fixed inset-0 z-[100] transition-all duration-300 pointer-events-none opacity-0" aria-hidden="true" style="display:none;">
  <div data-close-mobile-menu class="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"></div>
  <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 translate-x-full" id="mobile-menu-panel">
    <div>
      <div class="flex items-center justify-between border-b border-line pb-4 mb-6">
        <div class="flex items-center gap-3">
          <img src="images/brand/rosbri-wax-design-logo.jpg" alt="ROSBRI DESIGN" class="h-8 w-auto rounded">
          <span class="font-display-accent text-lg font-bold text-ink">ROSBRI DESIGN</span>
        </div>
        <button data-close-mobile-menu type="button" aria-label="Fermer le menu" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-ink transition-colors">✕</button>
      </div>
      <form action="boutique.html" method="GET" class="mb-6 relative">
        <input type="text" name="recherche" placeholder="Rechercher un article..." class="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-line bg-surface-container-low text-ink placeholder:text-muted focus:outline-none focus:border-champagne focus:bg-white">
        <button type="submit" aria-label="Rechercher" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <span class="material-symbols-outlined text-sm">search</span>
        </button>
      </form>
      <nav class="flex flex-col gap-4 font-label-sm uppercase tracking-widest text-sm font-bold text-ink">
        <a href="index.html" class="hover:text-champagne transition-colors py-2 border-b border-line/50 flex items-center justify-between">
          <span>Accueil</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
        <a href="boutique.html" class="hover:text-champagne transition-colors py-2 border-b border-line/50 flex items-center justify-between">
          <span>Boutique</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
        <a href="collections.html" class="hover:text-champagne transition-colors py-2 border-b border-line/50 flex items-center justify-between">
          <span>Collections</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
        <a href="a_propos.html" class="hover:text-champagne transition-colors py-2 border-b border-line/50 flex items-center justify-between">
          <span>À Propos</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
        <a href="boutique.html?categorie=Entreprise" class="text-champagne hover:underline py-2 border-b border-line/50 flex items-center justify-between">
          <span>Entreprises & B2B</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
      </nav>
    </div>
    <div class="space-y-3 pt-6 border-t border-line">
      <button data-open-cart type="button" class="w-full py-3 rounded-xl bg-ink text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-lg">shopping_bag</span>
        <span>Voir mon Panier</span>
      </button>
      <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋%20J%27aimerais%20des%20conseils" target="_blank" rel="noopener noreferrer" class="w-full py-3 rounded-xl border border-line text-ink font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
        <span class="material-symbols-outlined text-lg text-[#25D366]">chat</span>
        <span>Conseil sur WhatsApp</span>
      </a>
    </div>
  </div>
</div>`,

    cartDrawer: `
<div class="cart-drawer fixed inset-0 z-[100] transition-all duration-300" id="cart-drawer" aria-hidden="true" style="display:none;">
  <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" data-close-cart></div>
  <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
    <div class="px-6 py-4 border-b border-line flex items-center justify-between bg-surface-container-low">
      <h2 class="font-headline-md text-xl text-ink font-bold">Mon Panier</h2>
      <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-ink transition-colors" type="button" data-close-cart aria-label="Fermer le panier">✕</button>
    </div>
    <div class="flex-1 overflow-y-auto p-6 space-y-6" id="cart-drawer-items" data-cart-items></div>
    <div class="p-6 bg-surface-container-low border-t border-line" id="cart-drawer-footer">
      <div class="mb-4 p-4 rounded-xl bg-surface-variant/30 border border-line text-on-surface-variant font-body-sm flex items-start gap-3">
        <span class="text-xl leading-none">💡</span>
        <p class="text-[12.5px] leading-relaxed"><strong>Confection sur commande.</strong> Envoyez votre sélection sur WhatsApp pour obtenir votre délai estimé et valider la commande.</p>
      </div>
      <div class="mb-4">
        <div class="flex gap-2">
          <input type="text" id="cart-promo-input" placeholder="Code promo (ex: ROSBRI10)" class="flex-1 px-3 py-2 text-xs border border-line rounded-lg bg-white uppercase font-bold text-ink focus:outline-none focus:border-champagne">
          <button type="button" id="cart-promo-apply-btn" class="px-4 py-2 text-xs font-bold bg-ink text-white rounded-lg hover:bg-champagne transition-colors">Appliquer</button>
        </div>
        <p id="cart-promo-message" class="text-[11px] mt-1 font-semibold hidden"></p>
      </div>
      <div class="flex justify-between items-center mb-6">
        <span class="font-label-sm uppercase tracking-widest text-muted">Total :</span>
        <strong id="cart-total-value" data-cart-total class="font-display-accent text-2xl text-ink">0 FCFA</strong>
      </div>
      <div class="flex flex-col gap-3">
        <a class="w-full px-6 py-4 rounded-xl bg-[#25D366] text-white font-label-sm uppercase tracking-widest hover:bg-[#20ba5a] transition-colors text-center flex justify-center items-center shadow-lg gap-2 font-bold" id="cart-order-btn" href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋" target="_blank" rel="noopener noreferrer">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>Commander sur WhatsApp</span>
        </a>
        <button class="w-full px-6 py-3 rounded-xl border border-line text-muted font-label-sm uppercase tracking-widest hover:bg-error hover:text-white transition-colors text-xs font-bold" id="cart-clear-btn" type="button">Vider le panier</button>
      </div>
    </div>
  </div>
</div>`,

    footer: `
<footer class="bg-ink text-white w-full py-16 relative overflow-hidden border-t border-line/10">
  <div class="max-w-[1440px] mx-auto px-6 relative z-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <img src="images/brand/rosbri-wax-design-logo.jpg" alt="ROSBRI DESIGN" class="h-10 w-auto invert brightness-0 grayscale rounded">
          <div class="flex flex-col">
            <span class="font-display-accent text-xl font-bold text-white">ROSBRI DESIGN</span>
            <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-champagne">Afritude Luxe</span>
          </div>
        </div>
        <p class="font-body-sm text-white/70 text-xs leading-relaxed">
          Élever le standard des connexions significatives grâce à un design de luxe imprégné d’héritage culturel et d’artisanat d'exception.
        </p>
        <div class="flex items-center gap-3 pt-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-champagne hover:bg-champagne hover:text-white transition-colors" aria-label="Facebook ROSBRI DESIGN">
            <span class="material-symbols-outlined text-sm">public</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-champagne hover:bg-champagne hover:text-white transition-colors" aria-label="Instagram ROSBRI DESIGN">
            <span class="material-symbols-outlined text-sm">photo_camera</span>
          </a>
          <a href="https://wa.me/237698193880" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors" aria-label="WhatsApp ROSBRI DESIGN">
            <span class="material-symbols-outlined text-sm">chat</span>
          </a>
        </div>
      </div>
      <div>
        <h5 class="font-label-sm uppercase tracking-[0.2em] text-champagne text-xs font-bold mb-4">Explorer</h5>
        <ul class="space-y-2.5 text-xs text-white/70">
          <li><a href="index.html" class="hover:text-white transition-colors">Accueil</a></li>
          <li><a href="boutique.html" class="hover:text-white transition-colors">Boutique</a></li>
          <li><a href="collections.html" class="hover:text-white transition-colors">Collections</a></li>
          <li><a href="a_propos.html" class="hover:text-white transition-colors">À Propos</a></li>
          <li><a href="boutique.html?categorie=Entreprise" class="hover:text-white transition-colors">Entreprises & B2B</a></li>
        </ul>
      </div>
      <div>
        <h5 class="font-label-sm uppercase tracking-[0.2em] text-champagne text-xs font-bold mb-4">Services</h5>
        <ul class="space-y-2.5 text-xs text-white/70">
          <li><a href="boutique.html?recherche=personnalise" class="hover:text-white transition-colors">Personnalisation</a></li>
          <li><a href="boutique.html?categorie=Packs%20%26%20Id%C3%A9es%20Cadeaux" class="hover:text-white transition-colors">Cadeaux & occasions</a></li>
          <li><a href="boutique.html?categorie=Entreprise" class="hover:text-white transition-colors">Commandes entreprises</a></li>
          <li><a href="a_propos.html#livraison" class="hover:text-white transition-colors">Livraison et retours</a></li>
          <li><a href="boutique.html" class="hover:text-white transition-colors">Guide des tailles</a></li>
        </ul>
      </div>
      <div>
        <h5 class="font-label-sm uppercase tracking-[0.2em] text-champagne text-xs font-bold mb-4">Contact</h5>
        <ul class="space-y-2.5 text-xs text-white/70 mb-4">
          <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-champagne text-sm">call</span>
            <span>+237 698 193 880</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-champagne text-sm">call</span>
            <span>+237 690 715 403</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-champagne text-sm">language</span>
            <span>www.rosbridesign.ateliersdepaul.com</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-champagne text-sm">location_on</span>
            <span>Douala, Cameroun</span>
          </li>
        </ul>
        <a href="https://wa.me/237698193880?text=Bonjour%20ROSBRI%20DESIGN%20👋" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#20ba5a] transition-all shadow-md">
          <span class="material-symbols-outlined text-sm">chat</span>
          <span>Contact WhatsApp</span>
        </a>
      </div>
    </div>
    <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/50">
      <p>© <span id="footer-year">${new Date().getFullYear()}</span> ROSBRI DESIGN. Tous droits réservés. AFRITUDE LUXE.</p>
      <div class="flex gap-6 uppercase tracking-wider font-bold">
        <a href="a_propos.html" class="hover:text-white transition-colors">Politique de confidentialité</a>
        <a href="a_propos.html" class="hover:text-white transition-colors">Conditions générales</a>
        <a href="a_propos.html" class="hover:text-white transition-colors">Livraison et retours</a>
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
    // Attempt fetch if running over HTTP/HTTPS
    if (window.location.protocol.startsWith("http")) {
      try {
        const resp = await fetch(componentFile);
        if (resp.ok) {
          content = await resp.text();
        }
      } catch (e) {
        // Fallback to inline template
      }
    }
    mountNode.innerHTML = content;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
      loadMount(["site-announcement", "announcement-bar-mount"], "components/announcement-bar.html", templates.announcementBar),
      loadMount(["site-header", "header-mount"], "components/header.html", templates.header),
      loadMount(["site-mobile-menu", "mobile-menu-mount"], "components/mobile-menu.html", templates.mobileMenu),
      loadMount(["site-cart-drawer", "cart-drawer-mount"], "components/cart-drawer.html", templates.cartDrawer),
      loadMount(["site-footer", "footer-mount"], "components/footer.html", templates.footer)
    ]);

    // Update dynamic footer year if present
    const yearNode = document.getElementById("footer-year");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());

    document.dispatchEvent(new CustomEvent("components:loaded"));
  });
})();
