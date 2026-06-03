(function () {
  const storageKey = "rosbriCmsSettings";
  const tokenKey = "rosbriCmsToken";
  const staticCatalog = Array.isArray(window.ROSBriCatalog) ? window.ROSBriCatalog : [];
  const defaultSettings = window.ROSBriCMS && window.ROSBriCMS.enabled ? {
    supabaseUrl: window.ROSBriCMS.supabaseUrl,
    anonKey: window.ROSBriCMS.anonKey,
    productsTable: window.ROSBriCMS.productsTable || "products"
  } : {};

  let settings = loadSettings();
  let accessToken = sessionStorage.getItem(tokenKey) || "";
  let products = [];
  let query = "";
  let categoryFilter = "Tous";
  let visibilityFilter = "all";

  const byId = (id) => document.getElementById(id);

  function loadSettings() {
    try {
      return {
        ...defaultSettings,
        ...(JSON.parse(localStorage.getItem(storageKey)) || {})
      };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(next) {
    settings = next;
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }

  function configured() {
    return Boolean(settings.supabaseUrl && settings.anonKey && settings.productsTable);
  }

  function endpoint(path) {
    return `${settings.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
  }

  function headers(extra = {}) {
    return {
      apikey: settings.anonKey,
      Authorization: `Bearer ${accessToken || settings.anonKey}`,
      "Content-Type": "application/json",
      ...extra
    };
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

  async function errorMessage(response) {
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.message || data.error_description || data.error || text;
    } catch {
      return text || `Erreur ${response.status}`;
    }
  }

  function setStatus(text, tone = "") {
    const node = byId("cms-status");
    if (!node) return;
    node.textContent = text;
    node.dataset.tone = tone;
  }

  function setAuthStatus(text, tone = "") {
    const node = byId("auth-status");
    if (!node) return;
    node.textContent = text;
    node.dataset.tone = tone;
  }

  function updateAdminView() {
    const connected = Boolean(accessToken);
    const workspace = byId("admin-workspace");
    const publication = byId("publication-panel");
    const loginButton = byId("admin-login");
    const logoutButton = byId("admin-logout");
    if (workspace) workspace.hidden = !connected;
    if (publication) publication.hidden = !connected;
    if (loginButton) loginButton.hidden = connected;
    if (logoutButton) logoutButton.hidden = !connected;
  }

  async function request(path, options = {}) {
    if (!configured()) throw new Error("Configuration Supabase manquante.");
    const response = await fetch(endpoint(path), {
      ...options,
      headers: headers(options.headers)
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Table products introuvable. Ouvrez Supabase > SQL Editor et lancez tools/supabase-products-schema.sql.");
      }
      throw new Error(await errorMessage(response));
    }
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text.trim()) return null;
    return JSON.parse(text);
  }

  function requireAuth() {
    if (!accessToken) throw new Error("Connectez-vous à la session admin avant cette action.");
  }

  async function login() {
    if (!configured()) throw new Error("Configuration Supabase manquante. Ouvrez les réglages techniques.");
    const email = byId("admin-email").value.trim();
    const password = byId("admin-password").value;
    if (!email || !password) throw new Error("Entrez l'email et le mot de passe du compte Supabase Auth.");

    const response = await fetch(`${settings.supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: headers({ Authorization: `Bearer ${settings.anonKey}` }),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error(await errorMessage(response));
    const data = await response.json();
    accessToken = data.access_token || "";
    sessionStorage.setItem(tokenKey, accessToken);
    setAuthStatus("Connecté à Supabase.", "ok");
    setStatus("Session ouverte. Chargement du catalogue...", "ok");
    updateAdminView();

    try {
      await loadProducts();
    } catch (error) {
      setStatus(`Catalogue indisponible : ${error.message}`, "error");
    }
  }

  function logout() {
    accessToken = "";
    products = [];
    sessionStorage.removeItem(tokenKey);
    renderProducts();
    resetForm();
    setAuthStatus("Non connecté.", "");
    setStatus("Connectez-vous avec votre compte Supabase Auth pour gérer le catalogue.");
    updateAdminView();
  }

  function normalizeForDb(item) {
    return {
      id: Number(item.id),
      title: item.title || "Article ROSBRI",
      category: item.category || "Accessoires",
      price: item.price || "Sur devis",
      image: item.image || item.image_url || "",
      description: item.description || "",
      is_pack: Boolean(item.isPack || item.is_pack),
      visible: item.visible !== false,
      reviews: Array.isArray(item.reviews) ? item.reviews : []
    };
  }

  function normalizeFromDb(item) {
    return {
      id: Number(item.id),
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description,
      is_pack: Boolean(item.is_pack),
      visible: item.visible !== false,
      reviews: Array.isArray(item.reviews) ? item.reviews : []
    };
  }

  function ensureCategoryOption(category) {
    const value = String(category || "").trim();
    const select = byId("product-category");
    if (!value || !select) return;
    const exists = Array.from(select.options).some((option) => option.value === value);
    if (!exists) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  }

  function syncCategoryOptions() {
    products.forEach((item) => ensureCategoryOption(item.category));
    renderCategoryFilterOptions();
  }

  function categoriesFromProducts() {
    return [...new Set(products.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  }

  function renderCategoryFilterOptions() {
    const select = byId("admin-category-filter");
    if (!select) return;
    const categories = categoriesFromProducts();
    const current = categoryFilter;
    select.innerHTML = [
      `<option value="Tous">Toutes les catégories</option>`,
      ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    ].join("");
    select.value = categories.includes(current) ? current : "Tous";
    categoryFilter = select.value;
  }

  function renderSummary() {
    const visibleCount = products.filter((item) => item.visible !== false).length;
    const hiddenCount = products.length - visibleCount;
    const values = {
      "admin-total-count": products.length,
      "admin-visible-count": visibleCount,
      "admin-hidden-count": hiddenCount,
      "admin-category-count": categoriesFromProducts().length
    };
    Object.entries(values).forEach(([id, value]) => {
      const node = byId(id);
      if (node) node.textContent = value;
    });
  }

  function filteredProducts() {
    const needle = query.trim().toLowerCase();
    return products.filter((item) => {
      const matchesQuery = !needle || `${item.title} ${item.category} ${item.price} ${item.description}`.toLowerCase().includes(needle);
      const matchesCategory = categoryFilter === "Tous" || item.category === categoryFilter;
      const matchesVisibility = visibilityFilter === "all"
        || (visibilityFilter === "visible" && item.visible !== false)
        || (visibilityFilter === "hidden" && item.visible === false);
      return matchesQuery && matchesCategory && matchesVisibility;
    });
  }

  function updateImagePreview() {
    const target = byId("image-preview");
    const input = byId("product-image");
    if (!target || !input) return;
    const src = input.value.trim();
    target.dataset.state = src ? "loading" : "empty";
    target.innerHTML = src
      ? `<img src="${escapeHtml(src)}" alt=""><span>${escapeHtml(src)}</span><strong>Vérification de l'image...</strong>`
      : `<span>Aperçu image</span>`;
    const image = target.querySelector("img");
    if (!image) return;
    image.addEventListener("load", () => {
      target.dataset.state = "ok";
      const status = target.querySelector("strong");
      if (status) status.textContent = "Image trouvée";
    }, { once: true });
    image.addEventListener("error", () => {
      target.dataset.state = "error";
      const status = target.querySelector("strong");
      if (status) status.textContent = "Image introuvable";
    }, { once: true });
  }

  async function loadProducts() {
    if (!configured()) {
      products = staticCatalog.map(normalizeForDb);
      syncCategoryOptions();
      renderProducts();
      setStatus("Mode aperçu local : configurez Supabase pour enregistrer en ligne.", "warn");
      return;
    }

    const path = accessToken
      ? `${settings.productsTable}?select=*&order=id.asc`
      : `${settings.productsTable}?select=*&visible=eq.true&order=id.asc`;
    products = (await request(path)).map(normalizeFromDb);
    syncCategoryOptions();
    renderProducts();
    setStatus(`${products.length} articles chargés depuis Supabase.`, "ok");
  }

  function nextId() {
    return Math.max(0, ...products.map((item) => Number(item.id) || 0)) + 1;
  }

  function formData() {
    const id = byId("product-id").value || String(nextId());
    const category = byId("product-category").value.trim();
    if (!category) throw new Error("Choisissez une catégorie avant d'enregistrer.");
    return {
      id: Number(id),
      title: byId("product-title").value.trim(),
      category,
      price: byId("product-price").value.trim(),
      image: byId("product-image").value.trim(),
      description: byId("product-description").value.trim(),
      is_pack: byId("product-pack").checked,
      visible: byId("product-visible").checked,
      reviews: []
    };
  }

  function editProduct(item) {
    if (!item) return;
    byId("editor-title").textContent = `Modifier #${item.id}`;
    byId("product-id").value = item.id;
    byId("product-title").value = item.title || "";
    ensureCategoryOption(item.category);
    byId("product-category").value = item.category || "Accessoires";
    byId("product-price").value = item.price || "";
    byId("product-image").value = item.image || "";
    byId("product-description").value = item.description || "";
    byId("product-pack").checked = Boolean(item.is_pack);
    byId("product-visible").checked = item.visible !== false;
    updateImagePreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function duplicateProduct(item) {
    if (!item) return;
    const id = nextId();
    byId("editor-title").textContent = `Dupliquer #${item.id} vers #${id}`;
    byId("product-id").value = id;
    byId("product-title").value = `${item.title || "Article ROSBRI"} - copie`;
    ensureCategoryOption(item.category);
    byId("product-category").value = item.category || "Accessoires";
    byId("product-price").value = item.price || "";
    byId("product-image").value = item.image || "";
    byId("product-description").value = item.description || "";
    byId("product-pack").checked = Boolean(item.is_pack);
    byId("product-visible").checked = false;
    updateImagePreview();
    setStatus("Copie préparée dans le formulaire. Vérifiez le nom, l'image et cochez Visible avant publication.", "warn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    const form = byId("product-form");
    if (!form) return;
    byId("editor-title").textContent = "Nouvel article";
    form.reset();
    byId("product-id").value = "";
    byId("product-visible").checked = true;
    updateImagePreview();
  }

  function renderProducts() {
    const target = byId("admin-products");
    if (!target) return;
    renderSummary();
    renderCategoryFilterOptions();
    const visible = filteredProducts();
    const resultStatus = byId("admin-result-status");
    if (resultStatus) {
      resultStatus.textContent = `${visible.length} article${visible.length > 1 ? "s" : ""} affiché${visible.length > 1 ? "s" : ""} sur ${products.length}.`;
    }

    target.innerHTML = visible.map((item) => `
      <article class="admin-product${item.visible === false ? " muted" : ""}">
        <img src="${escapeHtml(item.image)}" alt="">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.category)} · ${escapeHtml(item.price)}${item.visible === false ? " · masqué" : ""}</span>
          <p>${escapeHtml(item.description)}</p>
        </div>
        <div class="admin-row-actions">
          <button class="secondary-btn" type="button" data-edit="${escapeHtml(item.id)}">Modifier</button>
          <button class="secondary-btn" type="button" data-duplicate="${escapeHtml(item.id)}">Dupliquer</button>
          <button class="secondary-btn" type="button" data-toggle-visible="${escapeHtml(item.id)}">${item.visible === false ? "Afficher" : "Masquer"}</button>
          <button class="secondary-btn danger" type="button" data-delete="${escapeHtml(item.id)}">Supprimer</button>
        </div>
      </article>
    `).join("") || `<p class="admin-status">Aucun article trouvé.</p>`;
  }

  async function saveProduct(event) {
    event.preventDefault();
    setStatus("Enregistrement en cours...", "ok");
    const item = formData();

    if (!configured()) {
      const existing = products.findIndex((entry) => entry.id === item.id);
      if (existing >= 0) products[existing] = item;
      else products.unshift(item);
      renderProducts();
      setStatus("Article modifié en aperçu local. Configurez Supabase pour publier réellement.", "warn");
      resetForm();
      return;
    }

    requireAuth();
    await request(settings.productsTable, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([item])
    });
    await loadProducts();
    resetForm();
    setStatus("Article enregistré en ligne.", "ok");
  }

  async function deleteProduct(id) {
    const item = products.find((entry) => String(entry.id) === String(id));
    if (!item || !confirm(`Supprimer "${item.title}" ?`)) return;

    if (!configured()) {
      products = products.filter((entry) => String(entry.id) !== String(id));
      renderProducts();
      setStatus("Article supprimé en aperçu local seulement.", "warn");
      return;
    }

    requireAuth();
    await request(`${settings.productsTable}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadProducts();
    setStatus("Article supprimé en ligne.", "ok");
  }

  async function toggleVisibility(id) {
    const item = products.find((entry) => String(entry.id) === String(id));
    if (!item) return;
    const nextVisible = item.visible === false;

    if (!configured()) {
      item.visible = nextVisible;
      renderProducts();
      setStatus(`Article ${nextVisible ? "réaffiché" : "masqué"} en aperçu local seulement.`, "warn");
      return;
    }

    requireAuth();
    await request(`${settings.productsTable}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ visible: nextVisible })
    });
    await loadProducts();
    setStatus(`Article ${nextVisible ? "réaffiché" : "masqué"} en ligne.`, "ok");
  }

  async function importStaticCatalog() {
    if (!configured()) {
      setStatus("Configurez Supabase avant d'importer le catalogue.", "warn");
      return;
    }
    requireAuth();
    const rows = staticCatalog.map(normalizeForDb);
    await request(settings.productsTable, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows)
    });
    await loadProducts();
    setStatus(`${rows.length} articles importés dans Supabase.`, "ok");
  }

  function bind() {
    byId("cms-url").value = settings.supabaseUrl || "";
    byId("cms-key").value = settings.anonKey || "";
    byId("cms-table").value = settings.productsTable || "products";

    byId("cms-settings").addEventListener("submit", (event) => {
      event.preventDefault();
      saveSettings({
        supabaseUrl: byId("cms-url").value.trim(),
        anonKey: byId("cms-key").value.trim(),
        productsTable: byId("cms-table").value.trim() || "products"
      });
      setStatus("Configuration enregistrée dans ce navigateur.", "ok");
    });

    byId("cms-test").addEventListener("click", async () => {
      try {
        await loadProducts();
      } catch (error) {
        setStatus(`Connexion impossible : ${error.message}`, "error");
      }
    });

    byId("admin-login").addEventListener("click", () => {
      login().catch((error) => setAuthStatus(`Connexion impossible : ${error.message}`, "error"));
    });

    byId("admin-logout").addEventListener("click", logout);

    byId("product-form").addEventListener("submit", (event) => {
      saveProduct(event).catch((error) => setStatus(`Enregistrement impossible : ${error.message}`, "error"));
    });

    byId("reset-form").addEventListener("click", resetForm);
    byId("import-static").addEventListener("click", () => {
      importStaticCatalog().catch((error) => setStatus(`Import impossible : ${error.message}`, "error"));
    });
    byId("admin-search").addEventListener("input", (event) => {
      query = event.target.value;
      renderProducts();
    });
    byId("admin-category-filter").addEventListener("change", (event) => {
      categoryFilter = event.target.value;
      renderProducts();
    });
    byId("admin-visibility-filter").addEventListener("change", (event) => {
      visibilityFilter = event.target.value;
      renderProducts();
    });
    byId("product-image").addEventListener("input", updateImagePreview);

    document.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      if (edit) editProduct(products.find((item) => String(item.id) === edit.dataset.edit));
      const duplicate = event.target.closest("[data-duplicate]");
      if (duplicate) duplicateProduct(products.find((item) => String(item.id) === duplicate.dataset.duplicate));
      const toggle = event.target.closest("[data-toggle-visible]");
      if (toggle) toggleVisibility(toggle.dataset.toggleVisible).catch((error) => setStatus(`Mise à jour impossible : ${error.message}`, "error"));
      const remove = event.target.closest("[data-delete]");
      if (remove) deleteProduct(remove.dataset.delete).catch((error) => setStatus(`Suppression impossible : ${error.message}`, "error"));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    updateAdminView();
    setAuthStatus(accessToken ? "Session admin active." : "Non connecté.", accessToken ? "ok" : "");
    if (accessToken) {
      loadProducts().catch((error) => setStatus(`Chargement impossible : ${error.message}`, "error"));
    } else {
      setStatus("Connectez-vous avec votre compte Supabase Auth pour gérer le catalogue.");
    }
  });
})();
