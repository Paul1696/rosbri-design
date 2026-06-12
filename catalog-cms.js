(function () {
  function localSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("rosbriCmsSettings")) || {};
      if (!saved.supabaseUrl || !saved.anonKey) return {};
      return {
        enabled: true,
        supabaseUrl: saved.supabaseUrl,
        anonKey: saved.anonKey,
        productsTable: saved.productsTable || "products"
      };
    } catch {
      return {};
    }
  }

  const config = (window.ROSBriCMS && window.ROSBriCMS.enabled)
    ? window.ROSBriCMS
    : localSettings();
  const table = config.productsTable || "products";

  function configured() {
    return Boolean(config.enabled && config.supabaseUrl && config.anonKey);
  }

  function endpoint(path) {
    return `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
  }

  function setCatalogSource(source) {
    document.documentElement.dataset.catalogSource = source;
    document.dispatchEvent(new CustomEvent("catalog:source-change", { detail: { source } }));
  }

  async function loadRemoteCatalog() {
    if (!configured() || typeof window.ROSBriApplyCatalog !== "function") return;
    try {
      const response = await fetch(endpoint(`${table}?select=*&visible=eq.true&order=id.asc`), {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        }
      });
      if (!response.ok) throw new Error(`Supabase ${response.status}`);
      const rows = await response.json();
      if (Array.isArray(rows) && rows.length) {
        const localCatalog = window.ROSBriCatalogApi && window.ROSBriCatalogApi.catalog;
        const localCount = Array.isArray(localCatalog) ? localCatalog.length : 0;
        const hasCommercialOffers = rows.some((row) => row && row.commercialOffer);
        if (localCount && rows.length < localCount && !hasCommercialOffers) {
          setCatalogSource("supabase-stale");
          console.warn("Catalogue Supabase plus ancien, catalogue local complet conservé.");
          return;
        }
        setCatalogSource("supabase");
        window.ROSBriApplyCatalog(rows);
      } else {
        setCatalogSource("supabase-empty");
      }
    } catch (error) {
      setCatalogSource("supabase-error");
      console.warn("Catalogue Supabase indisponible, catalogue local conservé.", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadRemoteCatalog, { once: true });
  } else {
    loadRemoteCatalog();
  }
})();
