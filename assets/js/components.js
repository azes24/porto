/**
 * Component Loader Script
 * Dynamically loads HTML partials into the page placeholders.
 */

async function loadComponent(placeholderId, componentPath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    placeholder.innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load components in parallel
  await Promise.all([
    loadComponent("navbar-placeholder", "components/navbar.html"),
    loadComponent("footer-placeholder", "components/footer.html"),
    loadComponent("cursor-placeholder", "components/cursor.html"),
    loadComponent("modal-placeholder", "components/modal.html")
  ]);

  // Re-initialize scripts that depend on the newly loaded DOM elements
  if (typeof initCursor === "function") initCursor();
  
  // Dispatch custom event when all components are loaded
  document.dispatchEvent(new Event("componentsLoaded"));
});
