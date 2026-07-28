/**
 * ROSBRI DESIGN - Announcement Bar Component Controller
 * Controls persistence via sessionStorage and WhatsApp redirection.
 */
(function () {
  function initAnnouncementBar() {
    const bar = document.getElementById("announcement-bar");
    const closeBtn = document.getElementById("announcement-bar-close");

    if (sessionStorage.getItem("rosbri_announcement_closed") === "true") {
      if (bar) bar.style.display = "none";
      return;
    }

    if (closeBtn && bar) {
      closeBtn.addEventListener("click", () => {
        bar.style.display = "none";
        sessionStorage.setItem("rosbri_announcement_closed", "true");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initAnnouncementBar);
  document.addEventListener("components:loaded", initAnnouncementBar);
})();
