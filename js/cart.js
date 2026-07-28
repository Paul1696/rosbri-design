/**
 * ROSBRI DESIGN - Unified Cart Engine
 * Manages cart state in localStorage under 'rosbri_cart', drawer UI, count badges, and WhatsApp checkout generation.
 */
(function () {
  const STORAGE_KEY = "rosbri_cart";
  const WHATSAPP_PHONE = "237698193880";

  function getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("rosbriCart");
      return JSON.parse(data || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem("rosbriCart", JSON.stringify(cart));
    } catch (e) {}
    updateCartUi();
  }

  function parsePrice(priceStr) {
    if (!priceStr || String(priceStr).toLowerCase().includes("devis")) return 0;
    const num = parseInt(String(priceStr).replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  }

  function formatPrice(val) {
    return val.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function getItemTotalCount(cart) {
    return cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
  }

  function calculateCartTotal(cart) {
    return cart.reduce((sum, item) => {
      const p = parsePrice(item.price);
      return sum + p * (parseInt(item.quantity, 10) || 1);
    }, 0);
  }

  function generateWhatsAppMessage(cart) {
    if (!cart.length) return "Bonjour ROSBRI DESIGN 👋 J'aimerais en savoir plus sur vos créations.";
    let msg = "Bonjour ROSBRI DESIGN 👋\n\nJe souhaite passer commande :\n\n🛒 *Mon Panier :*\n";
    let totalVal = 0;
    cart.forEach((item, i) => {
      msg += `${i + 1}. 🛍️ *${item.title}*\n`;
      msg += `   - Prix unitaire : *${item.price}*\n`;
      if (item.color) msg += `   - Couleur : *${item.color}*\n`;
      if (item.size) msg += `   - Taille : *${item.size}*\n`;
      if (item.sizeQuantities && item.sizeQuantities.length) {
        msg += `   - Tailles : *${item.sizeQuantities.map(s => `${s.size} (×${s.quantity})`).join(", ")}*\n`;
      } else if (item.sizes && item.sizes.length) {
        msg += `   - Tailles : *${item.sizes.join(", ")}*\n`;
      }
      if (item.customization) msg += `   - Personnalisation : *${item.customization}*\n`;
      msg += `   - Quantité : *${item.quantity}*\n\n`;

      const unitP = parsePrice(item.price);
      totalVal += unitP * (parseInt(item.quantity, 10) || 1);
    });

    msg += `💳 *TOTAL ESTIMÉ : ${formatPrice(totalVal)}*\n\n`;
    msg += "Merci de me confirmer la disponibilité et les modalités de confection et livraison !";
    return msg;
  }

  function updateCartUi() {
    const cart = getCart();
    const totalCount = getItemTotalCount(cart);
    const totalAmount = calculateCartTotal(cart);

    // 1. Update count badges
    document.querySelectorAll(".cart-count-badge, #cart-count-badge, [data-cart-count]").forEach((badge) => {
      badge.textContent = String(totalCount);
      if (totalCount > 0) {
        badge.style.display = "flex";
        badge.classList.remove("hidden");
      } else {
        badge.style.display = "none";
      }
    });

    // 2. Update totals
    document.querySelectorAll("#cart-total-value, [data-cart-total]").forEach((node) => {
      node.textContent = formatPrice(totalAmount);
    });

    // 3. Render Items in Drawer
    const drawerContainers = document.querySelectorAll("#cart-drawer-items, [data-cart-items]");
    drawerContainers.forEach((container) => {
      if (!cart.length) {
        container.innerHTML = `
          <div class="py-12 text-center text-muted flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-5xl mb-3 opacity-40">shopping_bag</span>
            <p class="text-sm font-semibold mb-4">Votre panier est actuellement vide.</p>
            <a href="boutique.html" class="px-6 py-2.5 rounded-full bg-ink text-white text-xs uppercase tracking-widest font-bold hover:bg-champagne transition-colors">Découvrir la boutique</a>
          </div>`;
        return;
      }

      container.innerHTML = cart.map((item, index) => {
        const options = [];
        if (item.color) options.push(`Couleur: ${item.color}`);
        if (item.size) options.push(`Taille: ${item.size}`);
        if (item.sizes && item.sizes.length) options.push(`Tailles: ${item.sizes.join(", ")}`);
        if (item.customization) options.push(`Spec: ${item.customization}`);

        const img = item.image || "images/brand/rosbri-wax-design-logo.jpg";
        const unitP = parsePrice(item.price);
        const subtotal = unitP * (parseInt(item.quantity, 10) || 1);

        return `
          <div class="flex gap-4 py-4 border-b border-line items-center">
            <img src="${escapeHtml(img)}" alt="${escapeHtml(item.title)}" class="w-16 h-20 object-cover rounded-lg border border-line bg-surface-container-low flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-xs text-ink truncate">${escapeHtml(item.title)}</h4>
              ${options.length ? `<p class="text-[11px] text-muted truncate mt-0.5">${escapeHtml(options.join(" · "))}</p>` : ""}
              <p class="text-xs font-bold text-champagne mt-1">${escapeHtml(item.price)}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border border-line rounded-lg overflow-hidden bg-white">
                  <button type="button" data-cart-action="dec" data-cart-index="${index}" class="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-container-low font-bold text-sm" aria-label="Diminuer la quantité">-</button>
                  <span class="w-8 text-center text-xs font-bold text-ink">${item.quantity}</span>
                  <button type="button" data-cart-action="inc" data-cart-index="${index}" class="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-container-low font-bold text-sm" aria-label="Augmenter la quantité">+</button>
                </div>
                <button type="button" data-cart-action="remove" data-cart-index="${index}" class="text-muted hover:text-error text-xs font-semibold p-1" aria-label="Supprimer cet article">
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>`;
      }).join("");
    });

    // 4. Update WhatsApp checkout button
    const whatsappMsg = generateWhatsAppMessage(cart);
    const encodedMsg = encodeURIComponent(whatsappMsg);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;

    document.querySelectorAll("#cart-order-btn, [data-cart-checkout]").forEach((btn) => {
      btn.href = whatsappUrl;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    });
  }

  function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer") || document.querySelector(".cart-drawer");
    if (!drawer) return;
    drawer.style.display = "block";
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateCartUi();
  }

  function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer") || document.querySelector(".cart-drawer");
    if (!drawer) return;
    drawer.style.display = "none";
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function addToCart(productItem) {
    const cart = getCart();
    const existingIndex = cart.findIndex((item) => {
      return item.id === productItem.id &&
        item.size === productItem.size &&
        item.color === productItem.color &&
        item.customization === productItem.customization;
    });

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (parseInt(cart[existingIndex].quantity, 10) || 1) + (parseInt(productItem.quantity, 10) || 1);
    } else {
      cart.push({
        id: productItem.id || String(Date.now()),
        title: productItem.title || "Produit ROSBRI DESIGN",
        price: productItem.price || "Sur devis",
        image: productItem.image || "images/brand/rosbri-wax-design-logo.jpg",
        color: productItem.color || "",
        size: productItem.size || "",
        sizes: productItem.sizes || [],
        customization: productItem.customization || "",
        quantity: parseInt(productItem.quantity, 10) || 1
      });
    }

    saveCart(cart);
    openCartDrawer();
  }

  // Global Event Delegation
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-cart]")) {
      openCartDrawer();
    }
    if (event.target.closest("[data-close-cart]")) {
      closeCartDrawer();
    }
    if (event.target.closest("#cart-clear-btn")) {
      saveCart([]);
    }

    const actionBtn = event.target.closest("[data-cart-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.cartAction;
      const index = parseInt(actionBtn.dataset.cartIndex, 10);
      const cart = getCart();

      if (!isNaN(index) && cart[index]) {
        if (action === "inc") {
          cart[index].quantity = (parseInt(cart[index].quantity, 10) || 1) + 1;
        } else if (action === "dec") {
          cart[index].quantity = (parseInt(cart[index].quantity, 10) || 1) - 1;
          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }
        } else if (action === "remove") {
          cart.splice(index, 1);
        }
        saveCart(cart);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCartDrawer();
    }
  });

  // Export API globally
  window.ROSBriCart = {
    getCart,
    saveCart,
    addToCart,
    openCartDrawer,
    closeCartDrawer,
    updateCartUi
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateCartUi();
  });

  document.addEventListener("components:loaded", () => {
    updateCartUi();
  });
})();
