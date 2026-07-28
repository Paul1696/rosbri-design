/**
 * ROSBRI DESIGN - Common Utility Script
 * Image fallback handling, console error guards, and global helper functions.
 */
(function () {
  const FALLBACK_IMAGE = "images/brand/rosbri-wax-design-logo.jpg";

  // Global Image Error Handler
  document.addEventListener("error", (event) => {
    if (event.target.tagName === "IMG") {
      const img = event.target;
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = "true";
        img.src = FALLBACK_IMAGE;
      }
    }
  }, true);

  // Safe DOM Helper
  window.safeElement = function (id) {
    return document.getElementById(id);
  };

  console.log("ROSBRI DESIGN Common Environment Initialized.");
})();
