document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();

  const form = document.querySelector("#blog-newsletter-form");
  const response = document.querySelector("#blog-newsletter-response");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    response.innerHTML = `<span class="tag-chip">Merci. La newsletter blog est prete a etre branchee.</span>`;
    form.reset();
  });
});
