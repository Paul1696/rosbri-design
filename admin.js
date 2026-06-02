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
    return response.json();
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

  async function loadProducts() {
    if (!configured()) {
      products = staticCatalog.map(normalizeForDb);
      renderProducts();
      setStatus("Mode aperçu local : configurez Supabase pour enregistrer en ligne.", "warn");
      return;
    }

    const path = accessToken
      ? `${settings.productsTable}?select=*&order=id.asc`
      : `${settings.productsTable}?select=*&visible=eq.true&order=id.asc`;
    products = (await request(path)).map(normalizeFromDb);
    renderProducts();
    setStatus(`${products.length} articles chargés depuis Supabase.`, "ok");
  }

  function nextId() {
    return Math.max(0, ...products.map((item) => Number(item.id) || 0)) + 1;
  }

  function formData() {
    const id = byId("product-id").value || String(nextId());
    return {
      id: Number(id),
      title: byId("product-title").value.trim(),
      category: byId("product-category").value,
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
    byId("product-category").value = item.category || "Accessoires";
    byId("product-price").value = item.price || "";
    byId("product-image").value = item.image || "";
    byId("product-description").value = item.description || "";
    byId("product-pack").checked = Boolean(item.is_pack);
    byId("product-visible").checked = item.visible !== false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    const form = byId("product-form");
    if (!form) return;
    byId("editor-title").textContent = "Nouvel article";
    form.reset();
    byId("product-id").value = "";
    byId("product-visible").checked = true;
  }

  function renderProducts() {
    const target = byId("admin-products");
    if (!target) return;
    const needle = query.trim().toLowerCase();
    const visible = products.filter((item) => {
      return !needle || `${item.title} ${item.category} ${item.price} ${item.description}`.toLowerCase().includes(needle);
    });

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
          <button class="secondary-btn danger" type="button" data-delete="${escapeHtml(item.id)}">Supprimer</button>
        </div>
      </article>
    `).join("") || `<p class="admin-status">Aucun article trouvé.</p>`;
  }

  async function saveProduct(event) {
    event.preventDefault();
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

    document.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      if (edit) editProduct(products.find((item) => String(item.id) === edit.dataset.edit));
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
