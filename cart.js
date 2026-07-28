/**
 * ROSBRI DESIGN - Legacy Cart Compatibility Adapter
 * Delegates all cart calls to window.ROSBriCart if present, or initialises js/cart.js logic.
 */
(function () {
  if (!window.ROSBriCart) {
    const script = document.createElement("script");
    script.src = "js/cart.js";
    document.head.appendChild(script);
  }
})();
