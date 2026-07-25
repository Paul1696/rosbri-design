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

    // --- CROSS-SELLING LOGIC ---
    // Vérifier si le produit recommandé est déjà dans le panier
    const recommendedItemTitle = "Bob personnalisé Wax";
    const hasRecommended = cart.some(item => item.title === recommendedItemTitle);

    if (!hasRecommended) {
      container.innerHTML += `
        <div class="cart-cross-sell">
          <div class="cross-sell-info">
            <span class="cross-sell-badge">Suggestion</span>
            <strong>${recommendedItemTitle}</strong>
            <span class="cross-sell-price">4 500 FCFA</span>
          </div>
          <button type="button" class="cross-sell-btn" id="add-cross-sell-btn">
            + Ajouter
          </button>
        </div>
      `;
    }
    // ---------------------------

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
    initPrintDevis();
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

      // Add Cross-Sell Item
      if (event.target.id === "add-cross-sell-btn") {
        const cart = getCart();
        cart.push({
          title: "Bob personnalisé Wax",
          price: "4 500 FCFA",
          quantity: 1,
          image: "images/articles-site/sacs/variants/sac-rosbri-wax-29.png", // Image placeholder (adjust to bob image path)
          url: SITE_URL
        });
        saveCart(cart);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleCart(false);
    });
  }

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

  function initDarkMode() {
    const nav = document.querySelector(".topbar .container.nav");
    if (!nav) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "theme-toggle-btn no-print";
    toggleBtn.setAttribute("aria-label", "Changer le thème");
    toggleBtn.innerHTML = `
      <svg class="sun-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg class="moon-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    `;

    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
      nav.insertBefore(toggleBtn, navToggle);
    } else {
      nav.appendChild(toggleBtn);
    }

    const sunIcon = toggleBtn.querySelector(".sun-icon");
    const moonIcon = toggleBtn.querySelector(".moon-icon");

    function setTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
        localStorage.setItem("rosbriTheme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
        localStorage.setItem("rosbriTheme", "light");
      }
    }

    const savedTheme = localStorage.getItem("rosbriTheme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
    }

    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  function initPromoBanner() {
    if (sessionStorage.getItem("rosbriPromoDismissed")) return;

    const banner = document.createElement("div");
    banner.className = "promo-banner no-print";
    banner.innerHTML = `
      <span>🔥 <strong>Offre Lancement :</strong> -10% sur votre première commande sur-mesure ! <a href="https://wa.me/${WHATSAPP_PHONE}?text=Bonjour%20ROSBRI%20DESIGN%20%F0%9F%91%8B%20Je%20souhaite%20b%C3%A9n%C3%A9ficier%20de%20l%27offre%20de%20lancement%20de%20-10%25" target="_blank" rel="noopener noreferrer">Profiter sur WhatsApp</a></span>
      <button type="button" class="promo-banner-close" aria-label="Fermer">&times;</button>
    `;

    document.body.insertBefore(banner, document.body.firstChild);

    banner.querySelector(".promo-banner-close").addEventListener("click", () => {
      banner.remove();
      sessionStorage.setItem("rosbriPromoDismissed", "true");
    });
  }

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
          <div class="chat-msg-bubble">
            Bonjour ! 👋 Comment puis-je vous aider aujourd'hui dans vos choix ou personnalisations ?
          </div>
          <div class="chat-box-actions">
            <button class="chat-action-btn" data-wa-msg="custom">🎨 Devis pour création sur-mesure</button>
            <button class="chat-action-btn" data-wa-msg="delivery">🛵 Question sur les tarifs de livraison</button>
            <button class="chat-action-btn" data-wa-msg="general">General / Conseil style</button>
          </div>
        </div>
      </div>
      <button class="whatsapp-trigger-btn" id="wa-trigger-btn" type="button" aria-label="Contacter sur WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>
    `;

    document.body.appendChild(widget);

    const triggerBtn = widget.querySelector("#wa-trigger-btn");
    const chatBox = widget.querySelector("#wa-chat-box");

    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chatBox.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!widget.contains(e.target)) {
        chatBox.classList.remove("active");
      }
    });

    widget.querySelectorAll(".chat-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        let text = "Bonjour ROSBRI DESIGN 👋 ";
        const type = btn.dataset.waMsg;
        if (type === "custom") {
          text += "Je souhaite un devis personnalisé pour une création (T-shirt, broderie ou flocage de logo).";
        } else if (type === "delivery") {
          text += "Je souhaite connaître vos modalités et tarifs de livraison pour ma ville au Cameroun.";
        } else {
          text += "Je viens de votre site et j'aimerais des conseils sur le choix des modèles.";
        }

        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
        chatBox.classList.remove("active");
      });
    });
  }

  function initPurchaseToasts() {
    const names = ["Marc", "Christian", "Mireille", "Audrey", "Jean-Pierre", "Carine", "Steve", "Yasmine", "Arouna", "Emilie", "Gilles", "Tatiana"];
    const cities = ["Yaoundé", "Douala", "Bafoussam", "Garoua", "Kribi", "Bamenda", "Buea", "Limbe", "Dschang"];
    const items = [
      "un T-shirt Héritage & Culture 🌍",
      "un Bob personnalisé Wax 👒",
      "un Sac cabas Wax assorti 🛍️",
      "une paire de Babouches artisanales 👡",
      "un Ensemble Enfants ROSBRI 👕",
      "deux T-shirts Reine Africaine ✨"
    ];
    const times = ["il y a 10 min", "il y a 25 min", "il y a 1 heure", "il y a 2 heures", "il y a 45 min", "il y a 3 heures"];

    function triggerToast() {
      const drawer = document.getElementById("cart-drawer");
      const lightbox = document.getElementById("lightbox");
      const sizeGuide = document.getElementById("size-guide-modal");

      const isDrawerOpen = drawer && drawer.getAttribute("aria-hidden") === "false";
      const isLightboxOpen = lightbox && lightbox.classList.contains("open");
      const isSizeGuideOpen = sizeGuide && sizeGuide.classList.contains("active");

      if (isDrawerOpen || isLightboxOpen || isSizeGuideOpen) return;

      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const time = times[Math.floor(Math.random() * times.length)];

      const toast = document.createElement("div");
      toast.className = "purchase-toast no-print";
      toast.innerHTML = `
        <span class="purchase-toast-icon">🛍️</span>
        <div class="purchase-toast-content">
          <p><strong>${name}</strong> de <strong>${city}</strong> a commandé ${item}</p>
          <span>${time}</span>
        </div>
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 6500);
    }

    function scheduleNext() {
      const delay = Math.floor(Math.random() * (45000 - 25000 + 1)) + 25000;
      setTimeout(() => {
        triggerToast();
        scheduleNext();
      }, delay);
    }

    setTimeout(() => {
      triggerToast();
      scheduleNext();
    }, 15000);
  }

  function initPrintDevis() {
    const footerActions = document.querySelector(".cart-drawer-actions");
    if (!footerActions) return;
    if (document.getElementById("cart-print-btn")) return;

    const printBtn = document.createElement("button");
    printBtn.type = "button";
    printBtn.id = "cart-print-btn";
    printBtn.className = "secondary-btn no-print";
    printBtn.style.marginTop = "6px";
    printBtn.style.borderColor = "rgba(0, 168, 150, 0.2)";
    printBtn.style.color = "var(--brand-dark)";
    printBtn.style.background = "#fff";
    printBtn.innerHTML = `📄 Imprimer / Devis PDF`;

    footerActions.appendChild(printBtn);

    printBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
      }

      const oldPrint = document.getElementById("print-area");
      if (oldPrint) oldPrint.remove();

      const printArea = document.createElement("div");
      printArea.id = "print-area";
      printArea.className = "print-devis-layout";

      let total = 0;
      let hasQuote = false;
      const dateStr = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

      const itemsHtml = cart.map((item, index) => {
        const parsed = parsePrice(item.price);
        const subtotal = parsed * item.quantity;
        if (parsed > 0) total += subtotal;
        else hasQuote = true;

        const details = [];
        if (item.color) details.push(`Couleur: ${item.color}`);
        if (item.sizeQuantities && item.sizeQuantities.length) {
          details.push(`Tailles: ${item.sizeQuantities.map(s => `${s.size} (x${s.quantity})`).join(", ")}`);
        } else if (item.sizes && item.sizes.length) {
          details.push(`Taille: ${item.sizes.join(", ")}`);
        }
        if (item.shoeSizeQuantities && item.shoeSizeQuantities.length) {
          details.push(`Pointures: ${item.shoeSizeQuantities.map(s => `${s.size} (x${s.quantity})`).join(", ")}`);
        } else if (item.shoeSizes && item.shoeSizes.length) {
          details.push(`Pointures: ${item.shoeSizes.join(", ")}`);
        }

        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ccc;">${index + 1}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ccc;">
              <strong>${item.title}</strong>
              ${details.length ? `<br><small style="color: #666;">${details.join(" · ")}</small>` : ""}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ccc;">${item.price}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ccc; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ccc; text-align: right;">${parsed > 0 ? formatPrice(subtotal) : "Sur devis"}</td>
          </tr>
        `;
      }).join("");

      printArea.innerHTML = `
        <div style="border-bottom: 3px solid #00a896; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; color: #00a896;">ROSBRI DESIGN</h1>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #555;">Customisation pour les personnes qui veulent plus</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #333; font-size: 1.25rem;">DEVIS ESTIMATIF</h2>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #555;">Date: ${dateStr}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f2f2f2; font-weight: bold; border-bottom: 2px solid #ccc;">
              <th style="padding: 12px; text-align: left; width: 5%;">#</th>
              <th style="padding: 12px; text-align: left; width: 50%;">Désignation</th>
              <th style="padding: 12px; text-align: left; width: 15%;">Prix Unitaire</th>
              <th style="padding: 12px; text-align: center; width: 10%;">Qté</th>
              <th style="padding: 12px; text-align: right; width: 20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 40%; border: 1px solid #ccc; border-radius: 8px; padding: 16px; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold; color: #333;">
              <span>Total Estimé :</span>
              <span style="color: #00a896;">${total > 0 ? formatPrice(total) : "Sur devis"}${hasQuote ? " + devis" : ""}</span>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid #ccc; padding-top: 20px; font-size: 0.85rem; color: #666; text-align: center; line-height: 1.5;">
          <p>Ce devis est une estimation basée sur les tarifs de notre boutique en ligne.</p>
          <p>Pour finaliser et confirmer la disponibilité de vos articles, veuillez soumettre votre commande via WhatsApp à partir du site.</p>
          <p style="font-weight: bold; margin-top: 10px;">ROSBRI DESIGN · Mode &amp; Créations Personnalisées · Cameroun</p>
        </div>
      `;

      document.body.appendChild(printArea);
      window.print();
    });
  }

  // Expose updates to catalog.js
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
