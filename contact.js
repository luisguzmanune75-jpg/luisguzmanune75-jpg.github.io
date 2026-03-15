function showInlineMessage(root, message) {
  root.innerHTML = `<span class="tag-chip">${SITE.escapeHTML(message)}</span>`;
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();

  const contactForm = document.querySelector("#contact-form");
  const contactResponse = document.querySelector("#contact-response");
  const newsletterForm = document.querySelector("#newsletter-form");
  const newsletterResponse = document.querySelector("#newsletter-response");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name");

    contactResponse.innerHTML = `
      <h3>Message prepare</h3>
      <p>
        Merci ${SITE.escapeHTML(name)}. Le formulaire est pret. Branche maintenant
        une vraie adresse ou un backend pour recevoir les demandes dans ta boite mail.
      </p>
    `;
    contactForm.reset();
  });

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showInlineMessage(newsletterResponse, "Inscription newsletter enregistree localement.");
    newsletterForm.reset();
  });
});
