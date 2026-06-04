(function () {
  const storageKey = "rosbriCmsSettings";
  const tokenKey = "rosbriCmsToken";
  const staticCatalog = Array.isArray(window.ROSBriCatalog) ? window.ROSBriCatalog : [];
  const defaultSettings = window.ROSBriCMS && window.ROSBriCMS.enabled ? {
    supabaseUrl: window.ROSBriCMS.supabaseUrl,
    anonKey: window.ROSBriCMS.anonKey,
    productsTable: window.ROSBriCMS.productsTable || "products",
    storageBucket: window.ROSBriCMS.storageBucket || "product-images"
  } : {};

  let settings = loadSettings();
  let accessToken = sessionStorage.getItem(tokenKey) || "";
  let selectedImage = null;
  let mediaFiles = [];
  let mediaItems = [];
  let activeProductId = "";
  let products = [];
  let query = "";
  let categoryFilter = "Tous";
  let visibilityFilter = "all";

  const byId = (id) => document.getElementById(id);

  function loadSettings() {
    try {
      return {
        storageBucket: "product-images",
        ...defaultSettings,
        ...(JSON.parse(localStorage.getItem(storageKey)) || {})
      };
    } catch {
      return { storageBucket: "product-images", ...defaultSettings };
    }
  }

  function saveSettings(next) {
    settings = next;
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }

  function configured() {
    return Boolean(settings.supabaseUrl && settings.anonKey && settings.productsTable);
  }

  function storageConfigured() {
    return Boolean(configured() && settings.storageBucket);
  }

  function endpoint(path) {
    return `${settings.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
  }

  function storageEndpoint(path) {
    return `${settings.supabaseUrl.replace(/\/$/, "")}/storage/v1/${path}`;
  }

  function headers(extra = {}) {
    return {
      apikey: settings.anonKey,
      Authorization: `Bearer ${accessToken || settings.anonKey}`,
      "Content-Type": "application/json",
      ...extra
    };
  }

  function storageHeaders(extra = {}) {
    return {
      apikey: settings.anonKey,
      Authorization: `Bearer ${accessToken || settings.anonKey}`,
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

  function slugify(value, fallback = "image") {
    const slug = String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    return slug || fallback;
  }

  function categoryFolder(category) {
    const folders = {
      Heritage: "heritage",
      Anime: "anime",
      Maman: "maman",
      Customisation: "customisation",
      Tshirts: "tshirts",
      Sacs: "sacs",
      Ensembles: "ensembles",
      Babouches: "babouches",
      Sandales: "sandales",
      Chapeaux: "chapeaux",
      Bobs: "bobs",
      Pochettes: "pochettes",
      GantsCuisine: "gants-cuisine",
      Maniques: "maniques",
      Accessoires: "accessoires",
      Coussins: "coussins",
      Robes: "robes",
      Chemises: "chemises"
    };
    return folders[category] || slugify(category || "accessoires", "accessoires");
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 Ko";
    const units = ["o", "Ko", "Mo", "Go"];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit++;
    }
    return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
  }

  function fileExtension(file) {
    const fromName = String(file?.name || "").match(/\.([a-z0-9]+)$/i)?.[1];
    const fromType = String(file?.type || "").split("/")[1];
    const ext = (fromName || fromType || "png").toLowerCase().replace("jpeg", "jpg");
    return ["png", "jpg", "webp", "gif"].includes(ext) ? ext : "png";
  }

  function normalizeImageInput(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
    const clean = raw
      .replace(/^["']|["']$/g, "")
      .replace(/\\/g, "/")
      .replace(/^\.?\//, "")
      .replace(/^.*?(images\/)/i, "images/")
      .replace(/\s+/g, "%20");
    return clean;
  }

  function selectedImageSlug() {
    return slugify(byId("product-title")?.value || selectedImage?.file?.name || "article", "article");
  }

  function suggestedImagePath(file = selectedImage?.file, remote = false) {
    if (!file) return "";
    const category = byId("product-category")?.value || "Accessoires";
    const folder = categoryFolder(category);
    const ext = fileExtension(file);
    const base = `${selectedImageSlug()}-${selectedImage?.pathStamp || Date.now().toString(36)}`;
    return remote
      ? `${folder}/${base}.${ext}`
      : `images/articles-site/${folder}/variants/${base}.${ext}`;
  }

  function publicStorageUrl(path) {
    const encodedPath = String(path || "")
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    return storageEndpoint(`object/public/${encodeURIComponent(settings.storageBucket)}/${encodedPath}`);
  }

  function storageObjectPath(file, stamp = Date.now().toString(36)) {
    const category = byId("product-category")?.value || "Accessoires";
    const folder = categoryFolder(category);
    const name = String(file?.name || "").replace(/\.[^.]+$/, "");
    const title = byId("product-title")?.value || name || "article";
    return `${folder}/${slugify(title, "article")}-${stamp}.${fileExtension(file)}`;
  }

  function imageImportStatus(text, tone = "") {
    const node = byId("image-import-details");
    if (!node) return;
    node.textContent = text;
    node.dataset.tone = tone;
  }

  function mediaStatus(text, tone = "") {
    const node = byId("media-status");
    if (!node) return;
    node.textContent = text;
    node.dataset.tone = tone;
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
    document.body.dataset.adminConnected = connected ? "true" : "false";
  }

  function setAdminTab(tabName) {
    document.querySelectorAll("[data-admin-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.adminTab === tabName);
    });
    document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.adminPanel === tabName);
    });
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
      await loadMediaLibrary();
    } catch (error) {
      setStatus(`Catalogue indisponible : ${error.message}`, "error");
    }
  }

  function logout() {
    accessToken = "";
    products = [];
    mediaFiles = [];
    mediaItems = [];
    sessionStorage.removeItem(tokenKey);
    renderProducts();
    renderMediaLibrary();
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
    const src = normalizeImageInput(input.value);
    if (input.value !== src) input.value = src;
    const previewSrc = selectedImage?.previewUrl || src;
    const label = selectedImage
      ? `${selectedImage.file.name} - ${formatBytes(selectedImage.file.size)}`
      : src;
    target.dataset.state = previewSrc ? "loading" : "empty";
    target.innerHTML = previewSrc
      ? `<img src="${escapeHtml(previewSrc)}" alt=""><span>${escapeHtml(label)}</span><strong>Verification de l'image...</strong>`
      : `<span>Apercu image</span>`;
    const image = target.querySelector("img");
    if (!image) return;
    image.addEventListener("load", () => {
      target.dataset.state = "ok";
      const status = target.querySelector("strong");
      const dimensions = image.naturalWidth && image.naturalHeight
        ? `${image.naturalWidth} x ${image.naturalHeight}px`
        : "Image trouvee";
      if (status) status.textContent = selectedImage
        ? `${dimensions} - prete a importer`
        : dimensions;
    }, { once: true });
    image.addEventListener("error", () => {
      target.dataset.state = "error";
      const status = target.querySelector("strong");
      if (status) status.textContent = "Image introuvable";
    }, { once: true });
  }

  function clearSelectedImage(options = {}) {
    if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl);
    selectedImage = null;
    const fileInput = byId("product-image-file");
    if (fileInput) fileInput.value = "";
    const uploadButton = byId("upload-image");
    const pathButton = byId("use-suggested-path");
    if (uploadButton) uploadButton.disabled = true;
    if (pathButton) pathButton.disabled = true;
    if (!options.keepStatus) imageImportStatus("Selectionnez un fichier pour preparer son import.");
  }

  function selectImageFile(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif)$/i.test(file.type)) {
      imageImportStatus("Format non pris en charge. Utilisez PNG, JPG, WebP ou GIF.", "error");
      return;
    }
    if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl);
    selectedImage = {
      file,
      previewUrl: URL.createObjectURL(file),
      pathStamp: Date.now().toString(36)
    };
    selectedImage.suggestedPath = suggestedImagePath(file);
    const uploadButton = byId("upload-image");
    const pathButton = byId("use-suggested-path");
    if (uploadButton) uploadButton.disabled = !storageConfigured();
    if (pathButton) pathButton.disabled = false;
    imageImportStatus(`${file.name} (${formatBytes(file.size)}) pret. Chemin conseille : ${selectedImage.suggestedPath}`, "ok");
    updateImagePreview();
  }

  function useSuggestedPath() {
    if (!selectedImage) return;
    selectedImage.suggestedPath = suggestedImagePath(selectedImage.file);
    byId("product-image").value = selectedImage.suggestedPath;
    imageImportStatus(`Chemin local applique. Copiez le fichier dans : ${selectedImage.suggestedPath}`, "warn");
    updateImagePreview();
  }

  async function uploadSelectedImage() {
    if (!selectedImage?.file) {
      imageImportStatus("Selectionnez une image avant l'upload.", "warn");
      return;
    }
    if (!storageConfigured()) {
      imageImportStatus("Renseignez un bucket images dans les reglages techniques.", "warn");
      return;
    }
    requireAuth();
    const objectPath = storageObjectPath(selectedImage.file, selectedImage.pathStamp);
    imageImportStatus("Upload de l'image en cours...", "ok");
    const url = await uploadFileToStorage(selectedImage.file, objectPath);
    byId("product-image").value = url;
    clearSelectedImage({ keepStatus: true });
    imageImportStatus(`Image chargee dans Supabase : ${objectPath}`, "ok");
    await loadMediaLibrary().catch(() => {});
    updateImagePreview();
  }

  function imageFilesFromList(files) {
    return Array.from(files || []).filter((file) => /^image\/(png|jpeg|webp|gif)$/i.test(file.type));
  }

  async function uploadFileToStorage(file, objectPath) {
    const response = await fetch(storageEndpoint(`object/${encodeURIComponent(settings.storageBucket)}/${objectPath}`), {
      method: "POST",
      headers: storageHeaders({
        "Content-Type": file.type || "application/octet-stream",
        "Cache-Control": "3600",
        "x-upsert": "true"
      }),
      body: file
    });
    if (!response.ok) throw new Error(await errorMessage(response));
    return publicStorageUrl(objectPath);
  }

  function selectMediaFiles(files) {
    mediaFiles = imageFilesFromList(files);
    const button = byId("upload-media-files");
    if (button) button.disabled = !mediaFiles.length || !storageConfigured() || !accessToken;
    if (!mediaFiles.length) {
      mediaStatus("Aucune image valide selectionnee. Utilisez PNG, JPG, WebP ou GIF.", "warn");
      return;
    }
    const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0);
    mediaStatus(`${mediaFiles.length} image${mediaFiles.length > 1 ? "s" : ""} prete${mediaFiles.length > 1 ? "s" : ""} a charger (${formatBytes(totalSize)}).`, "ok");
  }

  async function uploadMediaFiles() {
    if (!mediaFiles.length) {
      mediaStatus("Selectionnez au moins une image.", "warn");
      return;
    }
    if (!storageConfigured()) {
      mediaStatus("Renseignez le bucket images dans les reglages techniques.", "warn");
      return;
    }
    requireAuth();
    const uploaded = [];
    for (let index = 0; index < mediaFiles.length; index++) {
      const file = mediaFiles[index];
      const stamp = `${Date.now().toString(36)}-${index + 1}`;
      const objectPath = storageObjectPath(file, stamp);
      mediaStatus(`Chargement ${index + 1}/${mediaFiles.length} : ${file.name}`, "ok");
      const url = await uploadFileToStorage(file, objectPath);
      uploaded.push({ name: objectPath, url, size: file.size, updated_at: new Date().toISOString() });
    }
    mediaFiles = [];
    const input = byId("media-files");
    if (input) input.value = "";
    const button = byId("upload-media-files");
    if (button) button.disabled = true;
    mediaItems = [...uploaded, ...mediaItems.filter((item) => !uploaded.some((entry) => entry.name === item.name))];
    renderMediaLibrary();
    mediaStatus(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} chargee${uploaded.length > 1 ? "s" : ""}. Cliquez sur Utiliser pour l'associer a l'article.`, "ok");
  }

  function normalizeStorageItem(item, prefix = "") {
    const rawName = item.name || item.path || "";
    const name = rawName && prefix && !rawName.includes("/") ? `${prefix}/${rawName}` : rawName;
    if (!name || !/\.(png|jpe?g|webp|gif)$/i.test(name)) return null;
    return {
      name,
      url: publicStorageUrl(name),
      size: item.metadata?.size || item.size || 0,
      updated_at: item.updated_at || item.created_at || ""
    };
  }

  async function loadMediaLibrary() {
    if (!storageConfigured() || !accessToken) {
      renderMediaLibrary();
      mediaStatus("Connectez-vous pour charger et voir les images.", "warn");
      return;
    }
    const prefix = categoryFolder(byId("product-category")?.value || "Accessoires");
    mediaStatus(`Chargement des images ${prefix}...`, "ok");
    const response = await fetch(storageEndpoint(`object/list/${encodeURIComponent(settings.storageBucket)}`), {
      method: "POST",
      headers: storageHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        prefix,
        limit: 100,
        offset: 0,
        sortBy: { column: "updated_at", order: "desc" }
      })
    });
    if (!response.ok) throw new Error(await errorMessage(response));
    const rows = await response.json();
    mediaItems = (Array.isArray(rows) ? rows : [])
      .map((item) => normalizeStorageItem(item, prefix))
      .filter(Boolean);
    renderMediaLibrary();
    mediaStatus(mediaItems.length
      ? `${mediaItems.length} image${mediaItems.length > 1 ? "s" : ""} disponible${mediaItems.length > 1 ? "s" : ""} dans ${prefix}.`
      : `Aucune image dans ${prefix}. Chargez vos fichiers ci-dessus.`, mediaItems.length ? "ok" : "warn");
  }

  function renderMediaLibrary() {
    const target = byId("media-grid");
    if (!target) return;
    target.innerHTML = mediaItems.map((item) => `
      <article class="admin-media-card">
        <img src="${escapeHtml(item.url)}" alt="">
        <div>
          <strong>${escapeHtml(item.name.split("/").pop())}</strong>
          <span>${escapeHtml(item.name)}${item.size ? ` - ${escapeHtml(formatBytes(item.size))}` : ""}</span>
        </div>
        <button class="secondary-btn" type="button" data-use-media="${escapeHtml(item.url)}">Utiliser</button>
      </article>
    `).join("") || `<p class="admin-status">Aucune image chargee pour cette categorie.</p>`;
  }

  function useMedia(url) {
    byId("product-image").value = url;
    clearSelectedImage();
    mediaStatus("Image appliquee au formulaire produit.", "ok");
    updateImagePreview();
    setAdminTab("products");
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
    const image = normalizeImageInput(byId("product-image").value);
    if (selectedImage && !image) throw new Error("Importez l'image dans Supabase ou appliquez le chemin conseille avant d'enregistrer.");
    if (/^blob:/i.test(image)) throw new Error("L'apercu local ne peut pas etre publie. Uploadez l'image ou utilisez un chemin du site.");
    return {
      id: Number(id),
      title: byId("product-title").value.trim(),
      category,
      price: byId("product-price").value.trim(),
      image,
      description: byId("product-description").value.trim(),
      is_pack: byId("product-pack").checked,
      visible: byId("product-visible").checked,
      reviews: []
    };
  }

  function editProduct(item) {
    if (!item) return;
    clearSelectedImage();
    activeProductId = String(item.id);
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
    markActiveProduct();
  }

  function duplicateProduct(item) {
    if (!item) return;
    clearSelectedImage();
    const id = nextId();
    activeProductId = String(id);
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
    markActiveProduct();
  }

  function resetForm() {
    const form = byId("product-form");
    if (!form) return;
    clearSelectedImage();
    byId("editor-title").textContent = "Nouvel article";
    activeProductId = "";
    form.reset();
    byId("product-id").value = "";
    byId("product-visible").checked = true;
    updateImagePreview();
    markActiveProduct();
  }

  function markActiveProduct() {
    document.querySelectorAll(".admin-product").forEach((node) => {
      node.classList.toggle("active", Boolean(activeProductId) && node.dataset.productId === activeProductId);
    });
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
      <article class="admin-product${item.visible === false ? " muted" : ""}${String(item.id) === activeProductId ? " active" : ""}" data-product-id="${escapeHtml(item.id)}">
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
    byId("cms-bucket").value = settings.storageBucket || "product-images";

    byId("cms-settings").addEventListener("submit", (event) => {
      event.preventDefault();
      saveSettings({
        supabaseUrl: byId("cms-url").value.trim(),
        anonKey: byId("cms-key").value.trim(),
        productsTable: byId("cms-table").value.trim() || "products",
        storageBucket: byId("cms-bucket").value.trim() || "product-images"
      });
      const uploadButton = byId("upload-image");
      if (uploadButton && selectedImage) uploadButton.disabled = !storageConfigured();
      const mediaButton = byId("upload-media-files");
      if (mediaButton) mediaButton.disabled = !mediaFiles.length || !storageConfigured() || !accessToken;
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
    document.querySelectorAll("[data-admin-tab]").forEach((button) => {
      button.addEventListener("click", () => setAdminTab(button.dataset.adminTab));
    });
    byId("product-image-file").addEventListener("change", (event) => {
      selectImageFile(event.target.files && event.target.files[0]);
      setAdminTab("images");
    });
    byId("upload-image").addEventListener("click", () => {
      uploadSelectedImage().catch((error) => imageImportStatus(`Upload impossible : ${error.message}`, "error"));
    });
    byId("use-suggested-path").addEventListener("click", useSuggestedPath);
    byId("media-files").addEventListener("change", (event) => {
      selectMediaFiles(event.target.files);
    });
    byId("upload-media-files").addEventListener("click", () => {
      uploadMediaFiles().catch((error) => mediaStatus(`Chargement impossible : ${error.message}`, "error"));
    });
    byId("refresh-images").addEventListener("click", () => {
      loadMediaLibrary().catch((error) => mediaStatus(`Images indisponibles : ${error.message}`, "error"));
    });
    const mediaDrop = byId("media-drop");
    mediaDrop.addEventListener("dragover", (event) => {
      event.preventDefault();
      mediaDrop.dataset.drag = "true";
    });
    mediaDrop.addEventListener("dragleave", () => {
      mediaDrop.dataset.drag = "";
    });
    mediaDrop.addEventListener("drop", (event) => {
      event.preventDefault();
      mediaDrop.dataset.drag = "";
      selectMediaFiles(event.dataTransfer && event.dataTransfer.files);
    });
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
    byId("product-title").addEventListener("input", () => {
      if (!selectedImage) return;
      selectedImage.suggestedPath = suggestedImagePath(selectedImage.file);
      imageImportStatus(`${selectedImage.file.name} (${formatBytes(selectedImage.file.size)}) pret. Chemin conseille : ${selectedImage.suggestedPath}`, "ok");
    });
    byId("product-category").addEventListener("change", () => {
      if (!selectedImage) return;
      selectedImage.suggestedPath = suggestedImagePath(selectedImage.file);
      imageImportStatus(`${selectedImage.file.name} (${formatBytes(selectedImage.file.size)}) pret. Chemin conseille : ${selectedImage.suggestedPath}`, "ok");
    });
    byId("product-category").addEventListener("change", () => {
      loadMediaLibrary().catch((error) => mediaStatus(`Images indisponibles : ${error.message}`, "error"));
    });

    document.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      if (edit) editProduct(products.find((item) => String(item.id) === edit.dataset.edit));
      const duplicate = event.target.closest("[data-duplicate]");
      if (duplicate) duplicateProduct(products.find((item) => String(item.id) === duplicate.dataset.duplicate));
      const toggle = event.target.closest("[data-toggle-visible]");
      if (toggle) toggleVisibility(toggle.dataset.toggleVisible).catch((error) => setStatus(`Mise à jour impossible : ${error.message}`, "error"));
      const remove = event.target.closest("[data-delete]");
      if (remove) deleteProduct(remove.dataset.delete).catch((error) => setStatus(`Suppression impossible : ${error.message}`, "error"));
      const media = event.target.closest("[data-use-media]");
      if (media) useMedia(media.dataset.useMedia);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bind();
    updateAdminView();
    setAuthStatus(accessToken ? "Session admin active." : "Non connecté.", accessToken ? "ok" : "");
    if (accessToken) {
      loadProducts()
        .then(() => loadMediaLibrary())
        .catch((error) => setStatus(`Chargement impossible : ${error.message}`, "error"));
    } else {
      setStatus("Connectez-vous avec votre compte Supabase Auth pour gérer le catalogue.");
      renderMediaLibrary();
    }
  });
})();
