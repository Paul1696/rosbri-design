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
        window.ROSBriApplyCatalog(rows);
        document.documentElement.dataset.catalogSource = "supabase";
      }
    } catch (error) {
      console.warn("Catalogue Supabase indisponible, catalogue local conservé.", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadRemoteCatalog, { once: true });
  } else {
    loadRemoteCatalog();
  }
})();
