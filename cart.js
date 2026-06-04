(function () {
  const WHATSAPP_PHONE = "237690087213";
  const SITE_URL = "https://rosbridesign.ateliersdepaul.com/";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("rosbriCart") || "[]");
    } catch {
      return [];
    }
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
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function formatPrice(value) {
    return value.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";
  }

  function generateWhatsAppMessage(cart) {
    let msg = `Bonjour ROSBRI DESIGN 👋\n\n`;
    msg += `Je souhaite passer commande pour mon panier d'achats depuis votre site :\n\n`;
    msg += `🛒 *Mon Panier :*\n`;

    let total = 0;
    let hasQuote = false;

    cart.forEach((item, index) => {
      msg += `${index + 1}. 🛍️ *${item.title}*\n`;
      msg += `   - Prix : *${item.price}*\n`;
      if (item.color) msg += `   - Couleur : *${item.color}*\n`;
      
      if (item.sizeQuantities && item.sizeQuantities.length) {
        const sizesStr = item.sizeQuantities.map(sq => `${sq.size} (x${sq.quantity})`).join(", ");
        msg += `   - Taille(s) : *${sizesStr}*\n`;
      } else if (item.sizes && item.sizes.length) {
        msg += `   - Taille(s) : *${item.sizes.join(", ")}*\n`;
      }
      
      if (item.shoeSizeQuantities && item.shoeSizeQuantities.length) {
        const shoesStr = item.shoeSizeQuantities.map(sq => `${sq.size} (x${sq.quantity})`).join(", ");
        msg += `   - Pointure(s) : *${shoesStr}*\n`;
      } else if (item.shoeSizes && item.shoeSizes.length) {
        msg += `   - Pointure(s) : *${item.shoeSizes.join(", ")}*\n`;
      }

      // If no size/shoe quantities, display total item quantity if more than 1
      const individualQty = (item.sizeQuantities && item.sizeQuantities.length) || (item.shoeSizeQuantities && item.shoeSizeQuantities.length);
      if (item.quantity > 1 && !individualQty) {
        msg += `   - Quantité : *${item.quantity}*\n`;
      }

      msg += `   🔗 Lien : ${item.url}\n\n`;

      const parsed = parsePrice(item.price);
      if (parsed > 0) {
        total += parsed * item.quantity;
      } else {
        hasQuote = true;
      }
    });

    if (total > 0) {
      msg += `💰 *Total Estimé :* *${formatPrice(total)}*${hasQuote ? " (hors articles sur devis)" : ""}\n\n`;
    }

    msg += `Merci de me confirmer la disponibilité et le délai de livraison 🛵.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  function updateCartUi() {
    const cart = getCart();
    
    // Update badges
    const badge = document.getElementById("cart-count-badge");
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) {
      badge.textContent = totalQty;
      badge.style.display = totalQty > 0 ? "flex" : "none";
    }

    // Render items in drawer
    const container = document.getElementById("cart-drawer-items");
    const footer = document.getElementById("cart-drawer-footer");
    
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-message">
          <p>Votre panier est vide.</p>
          <a class="primary-btn" href="boutique.html" style="margin-top: 14px;">Parcourir la boutique</a>
        </div>
      `;
      if (footer) footer.style.display = "none";
      return;
    }

    if (footer) footer.style.display = "block";

    let totalVal = 0;
    let hasQuote = false;

    container.innerHTML = cart.map((item, index) => {
      const parsed = parsePrice(item.price);
      const subtotal = parsed * item.quantity;
      if (parsed > 0) {
        totalVal += subtotal;
      } else {
        hasQuote = true;
      }

      // Options summary
      const opt = [];
      if (item.color) opt.push(`Couleur : ${escapeHtml(item.color)}`);
      
      if (item.sizeQuantities && item.sizeQuantities.length) {
        opt.push(`Tailles : ${item.sizeQuantities.map(s => `${s.size}(${s.quantity})`).join(", ")}`);
      } else if (item.sizes && item.sizes.length) {
        opt.push(`Taille : ${item.sizes.join(", ")}`);
      }

      if (item.shoeSizeQuantities && item.shoeSizeQuantities.length) {
        opt.push(`Pointures : ${item.shoeSizeQuantities.map(s => `${s.size}(${s.quantity})`).join(", ")}`);
      } else if (item.shoeSizes && item.shoeSizes.length) {
        opt.push(`Pointure : ${item.shoeSizes.join(", ")}`);
      }

      const optText = opt.length ? opt.join(" · ") : "";
      const displayImg = item.image || "images/brand/rosbri-wax-design-logo.jpg";

      return `
        <div class="cart-item">
          <img class="cart-item-image" src="${escapeHtml(displayImg)}" alt="">
          <div class="cart-item-details">
            <strong>${escapeHtml(item.title)}</strong>
            ${optText ? `<span class="cart-item-meta">${optText}</span>` : ""}
            <span class="cart-item-price">${item.price}</span>
            <div class="cart-item-actions">
              <div class="cart-item-quantity-control">
                <button type="button" class="qty-btn" data-cart-qty-step="-1" data-cart-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="qty-btn" data-cart-qty-step="1" data-cart-index="${index}">+</button>
              </div>
              <button class="cart-item-remove" type="button" data-cart-remove="${index}" aria-label="Supprimer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const totalText = document.getElementById("cart-total-value");
    if (totalText) {
      totalText.textContent = totalVal > 0 
        ? `${formatPrice(totalVal)}${hasQuote ? " + devis" : ""}`
        : "Sur devis";
    }

    const orderBtn = document.getElementById("cart-order-btn");
    if (orderBtn) {
      orderBtn.href = generateWhatsAppMessage(cart);
    }
  }

  function toggleCart(show) {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    if (show) {
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent background scroll
      updateCartUi();
    } else {
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  function bind() {
    const floatingBtn = document.getElementById("cart-floating-btn");
    if (floatingBtn) {
      floatingBtn.addEventListener("click", () => toggleCart(true));
    }

    document.addEventListener("click", (event) => {
      // Close drawer
      if (event.target.closest("[data-close-cart]")) {
        toggleCart(false);
      }

      // Quantity change
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
            
            // Pro-rate individual sizes if present
            if (cart[index].sizeQuantities && cart[index].sizeQuantities.length) {
              const mainSize = cart[index].sizeQuantities[0];
              if (mainSize) {
                const newSizeQty = mainSize.quantity + step;
                if (newSizeQty <= 0) {
                  cart[index].sizeQuantities = cart[index].sizeQuantities.filter(s => s.size !== mainSize.size);
                } else {
                  mainSize.quantity = newSizeQty;
                }
              }
            }
            if (cart[index].shoeSizeQuantities && cart[index].shoeSizeQuantities.length) {
              const mainShoeSize = cart[index].shoeSizeQuantities[0];
              if (mainShoeSize) {
                const newShoeQty = mainShoeSize.quantity + step;
                if (newShoeQty <= 0) {
                  cart[index].shoeSizeQuantities = cart[index].shoeSizeQuantities.filter(s => s.size !== mainShoeSize.size);
                } else {
                  mainShoeSize.quantity = newShoeQty;
                }
              }
            }
          }
          saveCart(cart);
        }
      }

      // Remove item
      const removeBtn = event.target.closest("[data-cart-remove]");
      if (removeBtn) {
        const index = parseInt(removeBtn.dataset.cartRemove, 10);
        const cart = getCart();
        if (cart[index]) {
          cart.splice(index, 1);
          saveCart(cart);
        }
      }

      // Clear cart
      if (event.target.id === "cart-clear-btn") {
        if (confirm("Vider complètement votre panier ?")) {
          saveCart([]);
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleCart(false);
    });
  }

  // Expose updates to catalog.js
  window.updateCartUi = updateCartUi;

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    updateCartUi();
  });
})();
