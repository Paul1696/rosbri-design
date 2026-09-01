/** ROSBRI DESIGN — Homepage interactions. */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const faqItems = document.querySelectorAll(".faq-item, .faq-card");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      faqItems.forEach((other) => {
        const otherButton = other.querySelector(".faq-question");
        const otherAnswer = other.querySelector(".faq-answer");
        if (!otherButton || !otherAnswer) return;
        const keepOpen = other === item && !open;
        other.classList.toggle("active", keepOpen);
        otherButton.setAttribute("aria-expanded", String(keepOpen));
        otherAnswer.hidden = !keepOpen;
      });
    });
  });

  const modal = document.getElementById("custom-gift-modal");
  const openButtons = [
    document.getElementById("btn-open-custom-gift-modal"),
    document.getElementById("btn-trigger-customization")
  ].filter(Boolean);
  const closeButton = document.getElementById("btn-close-gift-modal");
  let lastTrigger = null;

  function focusables() {
    if (!modal) return [];
    return Array.from(modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }

  function openModal(trigger) {
    if (!modal) return;
    lastTrigger = trigger || document.activeElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    focusables()[0]?.focus();
  }

  function closeModal() {
    if (!modal || modal.getAttribute("aria-hidden") === "true") return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastTrigger?.focus?.();
  }

  openButtons.forEach((button) => button.addEventListener("click", () => openModal(button)));
  if (window.location.hash === "#custom-gift-modal") openModal();
  closeButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modal?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = focusables();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const giftForm = document.getElementById("custom-gift-form");
  document.querySelectorAll(".product-choice-grid .gift-checkbox-item").forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.className = card.className;
    wrapper.innerHTML = card.innerHTML;
    const parentChoice = wrapper.querySelector(":scope > input");
    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("tabindex", "0");
    const toggleParentChoice = (event) => {
      if (event.target.closest(".gift-subcategories") || event.target.closest(".gift-subchoice") || event.target === parentChoice) return;
      parentChoice.checked = !parentChoice.checked;
      parentChoice.dispatchEvent(new Event("change", { bubbles: true }));
    };
    wrapper.addEventListener("click", toggleParentChoice);
    wrapper.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleParentChoice(event); } });
    card.replaceWith(wrapper);
  });
  const quantityOutput = document.getElementById("gift-quantity");
  let giftQuantity = 1;
  document.querySelector("[data-quantity-minus]")?.addEventListener("click", () => { giftQuantity = Math.max(1, giftQuantity - 1); if (quantityOutput) quantityOutput.value = quantityOutput.textContent = giftQuantity; });
  document.querySelector("[data-quantity-plus]")?.addEventListener("click", () => { giftQuantity += 1; if (quantityOutput) quantityOutput.value = quantityOutput.textContent = giftQuantity; });
  const inspirationInput = document.getElementById("gift-inspiration");
  const previews = document.getElementById("gift-previews");
  inspirationInput?.addEventListener("change", () => { if (!previews) return; previews.innerHTML = ""; Array.from(inspirationInput.files || []).slice(0, 6).forEach((file) => { if (!file.type.startsWith("image/")) return; const image = document.createElement("img"); image.alt = file.name; image.src = URL.createObjectURL(file); previews.appendChild(image); }); });
  document.querySelectorAll(".gift-subcategories, .gift-subcategories input").forEach((node) => node.addEventListener("click", (event) => event.stopPropagation()));
  const clothingCategory = document.querySelector('.product-choice-grid .gift-checkbox-item > input[value="Vêtement"]');
  const clothingSubcategories = document.getElementById("gift-clothing-subcategories");
  clothingCategory?.addEventListener("change", () => { if (clothingSubcategories) clothingSubcategories.hidden = !clothingCategory.checked; });
  clothingSubcategories?.querySelectorAll("input").forEach((input) => input.addEventListener("click", (event) => event.stopPropagation()));
  [["Maroquinerie", "gift-leather-subcategories"], ["Coffret VIP", "gift-vip-subcategories"], ["Collection B2B", "gift-b2b-subcategories"]].forEach(([value, panelId]) => {
    const category = document.querySelector(`.product-choice-grid .gift-checkbox-item > input[value="${value}"]`);
    const panel = document.getElementById(panelId);
    category?.addEventListener("change", () => { if (panel) panel.hidden = !category.checked; });
    panel?.querySelectorAll("input").forEach((input) => input.addEventListener("click", (event) => event.stopPropagation()));
  });
  giftForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.getElementById("gift-form-error");
    const name = document.getElementById("gift-name")?.value || "";
    const phone = document.getElementById("gift-phone")?.value || "";
    const eventType = document.getElementById("gift-event")?.value || "";
    const details = document.getElementById("gift-details")?.value || "";
    const occasion = document.querySelector('input[name="gift-occasion"]:checked')?.value || "";
    const interests = Array.from(document.querySelectorAll('.gift-checkbox-item > input:checked, .gift-clothing-subcategories input:checked'))
      .map((input) => input.value).join(", ");
    if (!name.trim() || !phone.trim() || !interests || !details.trim()) { if (error) { error.textContent = "Merci de renseigner votre nom, votre numéro, un type de création et les détails du projet."; error.hidden = false; } return; }
    if (error) error.hidden = true;
    const filesNote = inspirationInput?.files?.length ? `${inspirationInput.files.length} image(s) d'inspiration sélectionnée(s) : ${Array.from(inspirationInput.files).map((file) => file.name).join(", ")}` : "Aucune image jointe";
    const lines = ["Bonjour ROSBRI DESIGN,", "", "Je souhaite concevoir une création sur mesure.", "", "Nom : " + name, "Téléphone / WhatsApp : " + phone, "Occasion : " + (occasion || eventType || "Non précisée"), "Type(s) de produit : " + interests, "Quantité : " + giftQuantity, "Budget : " + (document.getElementById("gift-budget")?.value || "Non précisé"), "Description : " + details, "Inspiration : " + filesNote];
    const brief = lines.join("\n");
    const file = new Blob([brief], { type: "text/plain;charset=utf-8" });
    const download = document.createElement("a"); download.href = URL.createObjectURL(file); download.download = "rosbri-demande-sur-mesure.txt"; download.click(); setTimeout(() => URL.revokeObjectURL(download.href), 1000);
    window.open("https://wa.me/237690087213?text=" + encodeURIComponent(brief), "_blank", "noopener,noreferrer");
    closeModal();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSelector = ".commitment-card, .collection-card, .product-card, .b2b-card, .faq-card, .story-grid, .section-header";

  function prepareReveal() {
    const elements = document.querySelectorAll(revealSelector);
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    elements.forEach((element) => element.classList.add("reveal-on-scroll"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    elements.forEach((element) => observer.observe(element));
  }

  prepareReveal();
  document.addEventListener("rosbri:home-content-ready", prepareReveal, { once: true });
});
