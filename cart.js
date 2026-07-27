(function () {
  const WHATSAPP_PHONE = "237690087213";
  const SITE_URL = "https://rosbridesign.ateliersdepaul.com/";

  /* ──────────────────────────────────────────────────────
     Helpers
  ────────────────────────────────────────────────────── */
  function getCart() {
    try { return JSON.parse(localStorage.getItem("rosbriCart") || "[]"); }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem("rosbriCart", JSON.stringify(cart));
    updateCartUi();
  }

  function parsePrice(priceStr) {
    if (!priceStr || priceStr.toLowerCase().includes("devis")) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function formatPrice(value) {
    return value.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
  }

  /* ──────────────────────────────────────────────────────
     Cart UI
  ────────────────────────────────────────────────────── */
  function renderCartItem(item, index) {
    const opt = [];
    if (item.color) opt.push(`Couleur : ${item.color}`);
    if (item.sizeQuantities && item.sizeQuantities.length) {
      opt.push(`Tailles : ${item.sizeQuantities.map(s => `${s.size}(×${s.quantity})`).join(", ")}`);
    } else if (item.sizes && item.sizes.length) {
      opt.push(`Taille : ${item.sizes.join(", ")}`);
    }
    if (item.shoeSizeQuantities && item.shoeSizeQuantities.length) {
      opt.push(`Pointures : ${item.shoeSizeQuantities.map(s => `${s.size}(×${s.quantity})`).join(", ")}`);
    } else if (item.shoeSizes && item.shoeSizes.length) {
      opt.push(`Pointure : ${item.shoeSizes.join(", ")}`);
    }
    const optText = opt.join(" · ");
    const img = item.image || "images/brand/rosbri-wax-design-logo.jpg";

    return `
      <div class="cart-item" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);">
        <img src="${escapeHtml(img)}" alt="" style="width:64px;height:80px;object-fit:cover;border-radius:6px;flex-shrink:0;background:#f3f5f2;">
        <div style="flex:1;min-width:0;">
          <strong style="display:block;font-size:0.92rem;line-height:1.3;margin-bottom:3px;">${escapeHtml(item.title)}</strong>
          ${optText ? `<span style="display:block;font-size:0.78rem;color:var(--muted);margin-bottom:4px;">${optText}</span>` : ""}
          <span style="display:block;font-size:0.88rem;font-weight:700;color:#775a19;margin-bottom:8px;">${escapeHtml(item.price)}</span>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="display:flex;align-items:center;border:1px solid var(--line);border-radius:6px;overflow:hidden;">
              <button type="button" data-cart-qty-step="-1" data-cart-index="${index}" style="width:28px;height:28px;border:none;background:transparent;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">−</button>
              <span style="width:32px;text-align:center;font-weight:700;font-size:0.9rem;">${item.quantity}</span>
              <button type="button" data-cart-qty-step="1" data-cart-index="${index}" style="width:28px;height:28px;border:none;background:transparent;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">+</button>
            </div>
            <button type="button" data-cart-remove="${index}" style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;" aria-label="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  let activePromo = null; // { code: 'ROSBRI10', discountPercent: 10, note: '-10% sur votre commande' }

  function getPromoCode(code) {
    const clean = String(code || "").trim().toUpperCase();
    if (clean === "ROSBRI10") return { code: "ROSBRI10", discountPercent: 10, note: "Offre Lancement -10%" };
    if (clean === "BIENVENUE") return { code: "BIENVENUE", discountPercent: 15, note: "Offre Bienvenue -15%" };
    if (clean === "LIVRAISON") return { code: "LIVRAISON", discountPercent: 0, freeShipping: true, note: "Livraison offerte" };
    return null;
  }

  function generateWhatsAppMessage(cart) {
    let msg = "Bonjour ROSBRI DESIGN 👋\n\nJe souhaite passer commande :\n\n🛒 *Mon Panier :*\n";
    let totalVal = 0;
    cart.forEach((item, i) => {
      msg += `${i + 1}. 🛍️ *${item.title}*\n`;
      msg += `   - Prix : *${item.price}*\n`;
      if (item.color) msg += `   - Couleur : *${item.color}*\n`;
      if (item.sizeQuantities && item.sizeQuantities.length) {
        msg += `   - Tailles : *${item.sizeQuantities.map(s => `${s.size} (×${s.quantity})`).join(", ")}*\n`;
      } else if (item.sizes && item.sizes.length) {
        msg += `   - Taille : *${item.sizes.join(", ")}*\n`;
      }
      if (item.shoeSizeQuantities && item.shoeSizeQuantities.length) {
        msg += `   - Pointures : *${item.shoeSizeQuantities.map(s => `${s.size} (×${s.quantity})`).join(", ")}*\n`;
      } else if (item.shoeSizes && item.shoeSizes.length) {
        msg += `   - Pointure : *${item.shoeSizes.join(", ")}*\n`;
      }
      msg += `   - Quantité : *${item.quantity}*\n\n`;

      const p = parsePrice(item.price);
      if (p > 0) totalVal += p * (item.quantity || 1);
    });

    if (activePromo) {
      msg += `🏷️ *Code Promo Appliqué :* ${activePromo.code} (${activePromo.note})\n`;
      if (activePromo.discountPercent > 0 && totalVal > 0) {
        const discountedTotal = Math.round(totalVal * (1 - activePromo.discountPercent / 100));
        msg += `💰 *Montant Total Réduit :* ~${formatPrice(totalVal)}~ ➡️ *${formatPrice(discountedTotal)}*\n\n`;
      }
    }

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  function updateCartUi() {
    const cart = getCart();
    const count = cart.reduce((n, item) => n + (item.quantity || 1), 0);

    // Badges
    ["cart-count-badge", "cart-count-badge-floating"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });

    // Drawer items
    const container = document.getElementById("cart-drawer-items");
    if (container) {
      if (cart.length === 0) {
        container.innerHTML = `
          <div style="padding:40px 20px;text-align:center;color:var(--muted);">
            <div style="font-size:2.5rem;margin-bottom:12px;">🛍️</div>
            <p style="font-weight:700;margin-bottom:6px;">Votre panier est vide</p>
            <p style="font-size:0.88rem;">Ajoutez des articles depuis la boutique.</p>
          </div>`;
      } else {
        container.innerHTML = cart.map((item, i) => renderCartItem(item, i)).join("");

        // Cross-sell suggestion
        const hasRecommended = cart.some(item => item.title === "Bob personnalisé Wax");
        if (!hasRecommended) {
          container.innerHTML += `
            <div style="margin-top:16px;padding:12px;background:rgba(119,90,25,0.06);border:1px solid rgba(119,90,25,0.18);border-radius:10px;display:flex;align-items:center;gap:10px;">
              <div style="flex:1;min-width:0;">
                <span style="display:inline-block;background:#c5a059;color:#fff;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Suggestion</span>
                <strong style="display:block;font-size:0.88rem;">Bob personnalisé Wax</strong>
                <span style="font-size:0.82rem;color:#775a19;font-weight:700;">4 500 FCFA</span>
              </div>
              <button type="button" id="add-cross-sell-btn" style="flex-shrink:0;padding:8px 14px;border-radius:8px;background:#c5a059;color:#fff;border:none;font-weight:700;font-size:0.8rem;cursor:pointer;">+ Ajouter</button>
            </div>`;
        }
      }
    }

    // Total
    let totalVal = 0;
    let hasQuote = false;
    cart.forEach(item => {
      const p = parsePrice(item.price);
      if (p > 0) totalVal += p * (item.quantity || 1);
      else hasQuote = true;
    });

    const totalEl = document.getElementById("cart-total-value");
    if (totalEl) {
      if (activePromo && activePromo.discountPercent > 0 && totalVal > 0) {
        const discounted = Math.round(totalVal * (1 - activePromo.discountPercent / 100));
        totalEl.innerHTML = `<span style="text-decoration:line-through;font-size:0.9rem;color:var(--muted);margin-right:6px;">${formatPrice(totalVal)}</span><span style="color:#775a19;">${formatPrice(discounted)}</span>`;
      } else {
        totalEl.textContent = totalVal > 0
          ? `${formatPrice(totalVal)}${hasQuote ? " + devis" : ""}`
          : (hasQuote ? "Sur devis" : "0 FCFA");
      }
    }

    // WhatsApp order button
    const orderBtn = document.getElementById("cart-order-btn");
    if (orderBtn) {
      orderBtn.href = cart.length > 0 ? generateWhatsAppMessage(cart) : "#";
    }
  }

  /* ──────────────────────────────────────────────────────
     Cart Drawer Toggle
  ────────────────────────────────────────────────────── */
  function toggleCart(show) {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    if (show === undefined) {
      show = drawer.style.display === "none" || drawer.getAttribute("aria-hidden") === "true";
    }
    if (show) {
      drawer.style.display = "block";
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      updateCartUi();
    } else {
      drawer.style.display = "none";
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }
  window.toggleCart = toggleCart;

  /* ──────────────────────────────────────────────────────
     Event Bindings
  ────────────────────────────────────────────────────── */
  function bind() {
    // Floating + header cart button
    ["cart-floating-btn", "header-cart-btn"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", () => toggleCart(true));
    });

    document.addEventListener("click", (event) => {
      // Close cart drawer
      if (event.target.closest("[data-close-cart]")) toggleCart(false);

      // Quantity change in cart
      const qtyBtn = event.target.closest("[data-cart-qty-step]");
      if (qtyBtn) {
        const index = parseInt(qtyBtn.dataset.cartIndex, 10);
        const step = parseInt(qtyBtn.dataset.cartQtyStep, 10);
        const cart = getCart();
        if (cart[index]) {
          const nextQty = cart[index].quantity + step;
          if (nextQty <= 0) {
            cart.splice(index, 1);
          } else {
            cart[index].quantity = nextQty;
          }
          saveCart(cart);
        }
      }

      // Remove item
      const removeBtn = event.target.closest("[data-cart-remove]");
      if (removeBtn) {
        const index = parseInt(removeBtn.dataset.cartRemove, 10);
        const cart = getCart();
        if (cart[index]) { cart.splice(index, 1); saveCart(cart); }
      }

      // Clear cart
      if (event.target.id === "cart-clear-btn") {
        if (confirm("Vider complètement votre panier ?")) saveCart([]);
      }

      // Cross-sell add
      if (event.target.id === "add-cross-sell-btn") {
        const cart = getCart();
        cart.push({ title: "Bob personnalisé Wax", price: "4 500 FCFA", quantity: 1, image: "", url: SITE_URL });
        saveCart(cart);
      }

      // Promo Code Apply
      if (event.target.id === "cart-promo-apply-btn") {
        const input = document.getElementById("cart-promo-input");
        const msg = document.getElementById("cart-promo-message");
        if (!input || !msg) return;
        const code = input.value.trim();
        const promo = getPromoCode(code);
        if (promo) {
          activePromo = promo;
          msg.textContent = `✓ Code ${promo.code} appliqué : ${promo.note}`;
          msg.style.color = "#775a19";
          msg.classList.remove("hidden");
          updateCartUi();
        } else {
          activePromo = null;
          msg.textContent = "❌ Code promo non valide";
          msg.style.color = "#ba1a1a";
          msg.classList.remove("hidden");
          updateCartUi();
        }
      }
    });

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });
  }

  /* ──────────────────────────────────────────────────────
     Mobile Menu
  ────────────────────────────────────────────────────── */
  function bindMobileMenu() {
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }
  }

  /* ──────────────────────────────────────────────────────
     Dark Mode
  ────────────────────────────────────────────────────── */
  function initDarkMode() {
    const savedTheme = localStorage.getItem("rosbriTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  /* ──────────────────────────────────────────────────────
     Promo Banner
  ────────────────────────────────────────────────────── */
  function initPromoBanner() {
    if (sessionStorage.getItem("rosbriPromoDismissed")) return;
    const banner = document.createElement("div");
    banner.className = "promo-banner no-print";
    banner.innerHTML = `
      <span>🔥 <strong>Offre Lancement :</strong> -10% sur votre première commande sur-mesure !
      <a href="https://wa.me/${WHATSAPP_PHONE}?text=Bonjour%20ROSBRI%20DESIGN%20👋%20Je%20souhaite%20bénéficier%20de%20l'offre%20de%20lancement%20de%20-10%25"
         target="_blank" rel="noopener noreferrer">Profiter sur WhatsApp</a></span>
      <button type="button" class="promo-banner-close" aria-label="Fermer">&times;</button>`;
    document.body.insertBefore(banner, document.body.firstChild);
    banner.querySelector(".promo-banner-close").addEventListener("click", () => {
      banner.remove();
      sessionStorage.setItem("rosbriPromoDismissed", "true");
    });
  }

  /* ──────────────────────────────────────────────────────
     WhatsApp Widget
  ────────────────────────────────────────────────────── */
  function initWhatsAppWidget() {
    const oldLink = document.querySelector("a.whatsapp");
    if (oldLink) oldLink.remove();

    const widget = document.createElement("div");
    widget.className = "whatsapp-chat-widget no-print";
    widget.innerHTML = `
      <div class="whatsapp-chat-box" id="wa-chat-box">
        <div class="chat-box-header">
          <img src="images/brand/rosbri-wax-design-logo.jpg" alt="ROSBRI DESIGN Logo">
          <div class="chat-box-header-title">
            <strong>Atelier ROSBRI DESIGN</strong>
            <span>En ligne (Réponse rapide)</span>
          </div>
        </div>
        <div class="chat-box-body">
          <div class="chat-msg-bubble">Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?</div>
          <div class="chat-box-actions">
            <button class="chat-action-btn" data-wa-msg="custom">🎨 Devis création sur-mesure</button>
            <button class="chat-action-btn" data-wa-msg="delivery">🛵 Tarifs de livraison</button>
            <button class="chat-action-btn" data-wa-msg="general">💬 Conseil style</button>
          </div>
        </div>
      </div>
      <button class="whatsapp-trigger-btn" id="wa-trigger-btn" type="button" aria-label="Contacter sur WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>`;
    document.body.appendChild(widget);

    const triggerBtn = widget.querySelector("#wa-trigger-btn");
    const chatBox = widget.querySelector("#wa-chat-box");
    triggerBtn.addEventListener("click", (e) => { e.stopPropagation(); chatBox.classList.toggle("active"); });
    document.addEventListener("click", (e) => { if (!widget.contains(e.target)) chatBox.classList.remove("active"); });

    widget.querySelectorAll(".chat-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const msgs = {
          custom: "Je souhaite un devis personnalisé pour une création (T-shirt, broderie ou flocage de logo).",
          delivery: "Je souhaite connaître vos modalités et tarifs de livraison pour ma ville.",
          general: "Je viens de votre site et j'aimerais des conseils sur le choix des modèles."
        };
        const text = `Bonjour ROSBRI DESIGN 👋 ${msgs[btn.dataset.waMsg] || ""}`;
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
        chatBox.classList.remove("active");
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     Purchase Toasts (social proof)
  ────────────────────────────────────────────────────── */
  function initPurchaseToasts() {
    const names = ["Marc","Christian","Mireille","Audrey","Jean-Pierre","Carine","Steve","Yasmine","Arouna","Emilie"];
    const cities = ["Yaoundé","Douala","Bafoussam","Garoua","Kribi","Bamenda","Buea","Limbe","Dschang"];
    const items = ["un T-shirt Héritage & Culture 🌍","un Bob personnalisé Wax 👒","un Sac cabas Wax assorti 🛍️","une paire de Babouches artisanales 👡","un Ensemble Enfants ROSBRI 👕"];

    function triggerToast() {
      const lightbox = document.getElementById("lightbox");
      const cartDrawer = document.getElementById("cart-drawer");
      if (lightbox && lightbox.classList.contains("open")) return;
      if (cartDrawer && cartDrawer.getAttribute("aria-hidden") === "false") return;

      const toast = document.createElement("div");
      toast.className = "purchase-toast no-print";
      toast.innerHTML = `
        <span class="purchase-toast-icon">🛍️</span>
        <div class="purchase-toast-content">
          <p><strong>${names[Math.floor(Math.random()*names.length)]}</strong> de <strong>${cities[Math.floor(Math.random()*cities.length)]}</strong> a commandé ${items[Math.floor(Math.random()*items.length)]}</p>
          <span>il y a ${[10,25,45,"1h","2h","3h"][Math.floor(Math.random()*6)]} min</span>
        </div>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 6500);
    }

    function scheduleNext() {
      setTimeout(() => { triggerToast(); scheduleNext(); }, 25000 + Math.random() * 20000);
    }
    setTimeout(() => { triggerToast(); scheduleNext(); }, 15000);
  }

  /* ──────────────────────────────────────────────────────
     Expose & Init
  ────────────────────────────────────────────────────── */
  window.updateCartUi = updateCartUi;

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    bindMobileMenu();
    updateCartUi();
    initDarkMode();
    initPromoBanner();
    initWhatsAppWidget();
    initPurchaseToasts();
  });
})();
