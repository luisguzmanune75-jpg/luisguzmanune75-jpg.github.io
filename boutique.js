(() => {
  const products = [
    { id: "percarbonate-mariette", name: "Percarbonate de sodium Mariette", category: "Maison", price: 7.59, images: ["https://i.ebayimg.com/images/g/CB4AAeSw9OVqlv~k/s-l1600.webp", "https://i.ebayimg.com/images/g/2IYAAeSwSUNqlt9k/s-l1600.webp"], description: "Percarbonate de sodium pour les usages de nettoyage et d'entretien de la maison." },
    { id: "gommage-coconut-1", name: "Gommage pour le corps Gotta Love Nature Go Coconut", category: "Quotidien", price: 7.59, images: ["https://i.ebayimg.com/images/g/P2AAAeSwS9dqlugC/s-l1600.webp"], description: "Gommage pour le corps à l'esprit tropical, idéal pour une routine de soin." },
    { id: "gommage-coconut-2", name: "Gommage pour le corps Gotta Love Nature Go Coconut", category: "Quotidien", price: 7.59, images: ["https://i.ebayimg.com/images/g/f1QAAeSwJm1qluts/s-l1600.webp"], description: "Gommage pour le corps Gotta Love Nature Go Coconut." },
    { id: "lily-white-75ml", name: "LE Parfum de FRANCE Lily White Eau de toilette femme 75 ml", category: "Quotidien", price: 10.80, images: ["https://i.ebayimg.com/images/g/QkgAAeSwaclqlwHt/s-l1600.webp", "https://i.ebayimg.com/images/g/ZLQAAeSwmKhqlu32/s-l1600.webp", "https://i.ebayimg.com/images/g/EgkAAeSwNXNqlu4K/s-l1600.webp"], description: "Eau de toilette femme Lily White, flacon de 75 ml." },
    { id: "pink-stuff", name: "Pâte de nettoyage The Pink Stuff", category: "Maison", price: 6.52, images: ["https://i.ebayimg.com/images/g/ds0AAeSw0DZqlvDS/s-l1600.webp"], description: "Pâte de nettoyage polyvalente pour l'entretien de la maison." },
    { id: "battletron-charge", name: "Station de charge sans fil Battletron", category: "Tech", price: 12.94, images: ["https://i.ebayimg.com/images/g/3WQAAeSwTtFqlwDu/s-l1600.webp", "https://i.ebayimg.com/images/g/gCgAAeSwhVlqlvIA/s-l1600.webp", "https://i.ebayimg.com/images/g/~5MAAeSw04tqlvIE/s-l1600.webp"], description: "Station de charge sans fil Battletron pour votre espace de travail ou votre maison." },
    { id: "capace-exclusive-himself", name: "Coffret cadeau Capace Exclusive Homme Himself", category: "Quotidien", price: 12.94, images: ["https://i.ebayimg.com/images/g/2jsAAeSwS9dqlvRh/s-l1600.webp"], description: "Coffret cadeau Capace Exclusive Homme Himself." },
    { id: "antikal-tropical-500ml", name: "Détartrant Antikal Tropical 500 ml", category: "Maison", price: 14.01, images: ["https://i.ebayimg.com/images/g/gT8AAeSwKVxqlyw5/s-l1600.webp", "https://i.ebayimg.com/images/g/qqIAAeSw2o5qlvVh/s-l1600.webp"], description: "Détartrant Antikal Tropical en flacon de 500 ml." },
    { id: "acide-citrique", name: "Acide Citrique Multi-Usages Détartreur Puissant pour Nettoyage Maison et Cuisine", category: "Maison", price: 7.59, images: ["https://i.ebayimg.com/images/g/lLsAAeSwRUZqlvbc/s-l1600.webp"], description: "Acide citrique multi-usages pour le nettoyage et l'entretien de la maison et de la cuisine." },
    { id: "bamboo-training-pads", name: "Bamboo Training Pads 10x Couches d'entraînement pour chiens 60x60 cm", category: "Quotidien", price: 6.52, images: ["https://i.ebayimg.com/images/g/lYMAAeSwmmZqlvdY/s-l1600.webp"], description: "Lot de 10 couches d'entraînement pour chiens au format 60 × 60 cm." },
    { id: "bodymass-magnesium", name: "BodyMass Nutrition Magnésium Citrate 200 mg - 60 Tablettes", category: "Quotidien", price: 7.59, images: ["https://i.ebayimg.com/images/g/1uUAAeSwvEZqlwMw/s-l1600.webp", "https://i.ebayimg.com/images/g/xKcAAeSw6RlqlvfK/s-l1600.webp"], description: "Complément alimentaire BodyMass Nutrition au citrate de magnésium, 60 tablettes." },
    { id: "accelerate-creatine", name: "Accelerate Creatine Chewables 45 Tablettes 3g par Dose Saveur Pêche Citron", category: "Quotidien", price: 7.59, images: ["https://i.ebayimg.com/images/g/~iYAAeSwf6xqlvo8/s-l1600.webp"], description: "Créatine à croquer Accelerate, 45 tablettes, saveur pêche citron." }
  ];

  const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  const storageKey = "sng_boutique_cart";
  let activeCategory = "Tous";
  let searchTerm = "";
  let cart = JSON.parse(localStorage.getItem(storageKey) || "[]");
  let selectedProduct = null;
  let selectedImageIndex = 0;

  const grid = document.querySelector("#product-grid");
  const categoryList = document.querySelector("#category-list");
  const count = document.querySelector("#products-count");
  const cartPanel = document.querySelector("#cart-panel");
  const cartScrim = document.querySelector("#cart-scrim");
  const cartItems = document.querySelector("#cart-items");

  const style = document.createElement("style");
  style.textContent = `
    .product-visual { position: relative; min-height: 210px; padding: 12px; overflow: hidden; background: rgba(255,255,255,.04); }
    .product-image { width: 100%; height: 210px; object-fit: contain; display: block; border-radius: 12px; background: rgba(255,255,255,.04); }
    .product-thumbs { position: absolute; left: 12px; right: 12px; bottom: 12px; display: flex; gap: 7px; justify-content: center; }
    .product-thumb { width: 42px; height: 42px; padding: 2px; border: 1px solid rgba(255,255,255,.35); border-radius: 8px; background: rgba(8,15,27,.85); cursor: pointer; }
    .product-thumb img { width: 100%; height: 100%; object-fit: contain; border-radius: 5px; }
    .product-thumb.is-active { border-color: #ff5f8f; box-shadow: 0 0 0 2px rgba(255,95,143,.2); }
    .shop-card { cursor: pointer; }
    .shop-card .add-button, .shop-card .product-thumb { cursor: pointer; }
    .product-modal-scrim { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,.72); backdrop-filter: blur(8px); opacity: 0; visibility: hidden; transition: .25s ease; }
    .product-modal-scrim.is-open { opacity: 1; visibility: visible; }
    .product-modal { position: relative; width: min(100%, 1050px); max-height: min(92vh, 820px); overflow: auto; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr); gap: 28px; padding: 28px; border: 1px solid rgba(255,255,255,.14); border-radius: 28px; background: linear-gradient(145deg, #192438, #101927); box-shadow: 0 30px 90px rgba(0,0,0,.5); }
    .product-modal-close { position: absolute; top: 14px; right: 16px; z-index: 2; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.14); border-radius: 50%; background: rgba(0,0,0,.3); color: #fff; font-size: 25px; cursor: pointer; }
    .product-modal-gallery { min-width: 0; }
    .product-modal-main-image { width: 100%; height: min(58vh, 510px); object-fit: contain; border-radius: 20px; background: rgba(255,255,255,.05); }
    .product-modal-thumbs { display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; }
    .product-modal-thumb { flex: 0 0 72px; width: 72px; height: 72px; padding: 4px; border: 1px solid rgba(255,255,255,.18); border-radius: 12px; background: rgba(255,255,255,.05); cursor: pointer; }
    .product-modal-thumb img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
    .product-modal-thumb.is-active { border-color: #ff5f8f; box-shadow: 0 0 0 2px rgba(255,95,143,.22); }
    .product-modal-info { display: flex; flex-direction: column; justify-content: center; padding: 18px 10px 18px 0; }
    .product-modal-category { color: #f5b6ca; font-size: .78rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
    .product-modal-info h2 { margin: 10px 0 16px; color: #fff; font-size: clamp(1.65rem, 3vw, 2.55rem); line-height: 1.12; }
    .product-modal-description { color: rgba(255,255,255,.7); font-size: 1rem; line-height: 1.7; }
    .product-modal-price { margin: 24px 0; color: #fff; font-size: 1.8rem; font-weight: 900; }
    .product-modal-add { border: 0; border-radius: 14px; padding: 15px 18px; background: linear-gradient(135deg, #ff5f8f, #bd5cc0); color: #fff; font: inherit; font-weight: 900; font-size: 1rem; cursor: pointer; }
    .product-modal-add:hover { filter: brightness(1.08); }
    @media (max-width: 760px) { .product-modal { grid-template-columns: 1fr; gap: 10px; padding: 18px; border-radius: 22px; } .product-modal-main-image { height: 42vh; } .product-modal-info { padding: 8px 4px 12px; } }
  `;
  document.head.appendChild(style);

  const modalScrim = document.createElement("div");
  modalScrim.className = "product-modal-scrim";
  modalScrim.setAttribute("aria-hidden", "true");
  modalScrim.innerHTML = `
    <div class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <button class="product-modal-close" type="button" aria-label="Fermer">×</button>
      <div class="product-modal-gallery">
        <img class="product-modal-main-image" id="product-modal-main-image" alt="">
        <div class="product-modal-thumbs" id="product-modal-thumbs"></div>
      </div>
      <div class="product-modal-info">
        <span class="product-modal-category" id="product-modal-category"></span>
        <h2 id="product-modal-title"></h2>
        <p class="product-modal-description" id="product-modal-description"></p>
        <strong class="product-modal-price" id="product-modal-price"></strong>
        <button class="product-modal-add" id="product-modal-add" type="button">Ajouter au panier</button>
      </div>
    </div>`;
  document.body.appendChild(modalScrim);

  const saveCart = () => localStorage.setItem(storageKey, JSON.stringify(cart));
  const cartQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  function renderCategories() {
    categoryList.innerHTML = "";
    ["Tous", ...new Set(products.map((product) => product.category))].forEach((category) => {
      const button = document.createElement("button");
      button.className = `category-button${category === activeCategory ? " is-active" : ""}`;
      button.type = "button";
      button.textContent = category;
      button.addEventListener("click", () => { activeCategory = category; renderCategories(); renderProducts(); });
      categoryList.append(button);
    });
  }

  function visibleProducts() {
    const term = searchTerm.trim().toLocaleLowerCase("fr");
    return products.filter((product) => (activeCategory === "Tous" || product.category === activeCategory) && (!term || `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("fr").includes(term)));
  }

  function renderProducts() {
    const visible = visibleProducts();
    grid.innerHTML = "";
    count.textContent = `${visible.length} produit${visible.length > 1 ? "s" : ""}`;
    if (!visible.length) { grid.innerHTML = '<p class="empty-products">Aucun produit ne correspond à votre recherche.</p>'; return; }

    visible.forEach((product) => {
      const card = document.createElement("article");
      card.className = "shop-card";
      const imageUrl = product.images[0];
      const thumbnails = product.images.length > 1 ? `<div class="product-thumbs">${product.images.map((image, index) => `<button class="product-thumb${index === 0 ? " is-active" : ""}" type="button" data-image="${image}" aria-label="Voir la photo ${index + 1}"><img src="${image}" alt="" loading="lazy"></button>`).join("")}</div>` : "";
      card.innerHTML = `<div class="product-visual"><img class="product-image" src="${imageUrl}" alt="${product.name.replace(/"/g, '&quot;')}" loading="lazy" referrerpolicy="no-referrer">${thumbnails}</div><div class="product-content"><span class="product-category">${product.category}</span><h3>${product.name}</h3><p>${product.description}</p><div class="product-bottom"><strong class="product-price">${currency.format(product.price)}</strong><button class="add-button" type="button" data-product-id="${product.id}">Ajouter au panier</button></div></div>`;
      grid.append(card);
    });
  }

  function updateCart() {
    const quantity = cartQuantity();
    document.querySelector("#cart-count").textContent = quantity;
    document.querySelector("#cart-total").textContent = currency.format(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    document.querySelector("#checkout-button").disabled = !quantity;
    cartItems.innerHTML = "";
    if (!quantity) { cartItems.innerHTML = '<p class="cart-empty">Votre panier est vide.<br />Ajoutez un produit pour le retrouver ici.</p>'; return; }
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `<div><div class="cart-item-name">${item.name}</div><div class="cart-item-meta">${currency.format(item.price)} × ${item.quantity}</div></div><div class="quantity-controls"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Retirer un ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${item.id}" aria-label="Ajouter un ${item.name}">+</button></div>`;
      cartItems.append(row);
    });
  }

  function addProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item) item.quantity += 1; else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    saveCart(); updateCart(); setCartOpen(true);
  }

  function changeQuantity(id, amount) {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (!item) return;
    item.quantity += amount; cart = cart.filter((cartItem) => cartItem.quantity > 0); saveCart(); updateCart();
  }

  function setCartOpen(open) {
    cartPanel.classList.toggle("is-open", open); cartScrim.classList.toggle("is-visible", open); cartPanel.setAttribute("aria-hidden", String(!open)); document.querySelector("#cart-toggle").setAttribute("aria-expanded", String(open));
  }

  function openProductModal(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    selectedProduct = product; selectedImageIndex = 0;
    document.querySelector("#product-modal-category").textContent = product.category;
    document.querySelector("#product-modal-title").textContent = product.name;
    document.querySelector("#product-modal-description").textContent = product.description;
    document.querySelector("#product-modal-price").textContent = currency.format(product.price);
    renderModalImage();
    modalScrim.classList.add("is-open");
    modalScrim.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderModalImage() {
    if (!selectedProduct) return;
    const mainImage = document.querySelector("#product-modal-main-image");
    mainImage.src = selectedProduct.images[selectedImageIndex];
    mainImage.alt = selectedProduct.name;
    const thumbs = document.querySelector("#product-modal-thumbs");
    thumbs.innerHTML = selectedProduct.images.map((image, index) => `<button class="product-modal-thumb${index === selectedImageIndex ? " is-active" : ""}" type="button" data-modal-image-index="${index}" aria-label="Voir la photo ${index + 1}"><img src="${image}" alt="" loading="lazy"></button>`).join("");
  }

  function closeProductModal() {
    modalScrim.classList.remove("is-open");
    modalScrim.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    selectedProduct = null;
  }

  document.querySelector("#product-search").addEventListener("input", (event) => { searchTerm = event.target.value; renderProducts(); });

  grid.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-image]");
    if (thumb) {
      event.stopPropagation();
      const visual = thumb.closest(".product-visual");
      visual.querySelector(".product-image").src = thumb.dataset.image;
      visual.querySelectorAll(".product-thumb").forEach((button) => button.classList.remove("is-active"));
      thumb.classList.add("is-active");
      return;
    }
    const addButton = event.target.closest("[data-product-id]");
    if (addButton) { event.stopPropagation(); addProduct(addButton.dataset.productId); return; }
    const card = event.target.closest(".shop-card");
    if (card) {
      const productName = card.querySelector("h3")?.textContent;
      const product = products.find((item) => item.name === productName);
      if (product) openProductModal(product.id);
    }
  });

  cartItems.addEventListener("click", (event) => { const button = event.target.closest("[data-action]"); if (button) changeQuantity(button.dataset.id, button.dataset.action === "increase" ? 1 : -1); });
  document.querySelector("#cart-toggle").addEventListener("click", () => setCartOpen(true));
  document.querySelector("#cart-close").addEventListener("click", () => setCartOpen(false));
  cartScrim.addEventListener("click", () => setCartOpen(false));

  modalScrim.addEventListener("click", (event) => { if (event.target === modalScrim) closeProductModal(); });
  modalScrim.querySelector(".product-modal-close").addEventListener("click", closeProductModal);
  document.querySelector("#product-modal-thumbs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-modal-image-index]");
    if (!button) return;
    selectedImageIndex = Number(button.dataset.modalImageIndex);
    renderModalImage();
  });
  document.querySelector("#product-modal-add").addEventListener("click", () => { if (selectedProduct) addProduct(selectedProduct.id); closeProductModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { if (selectedProduct) closeProductModal(); else setCartOpen(false); } });

  document.querySelector("#checkout-button").addEventListener("click", () => { alert("Le paiement Stripe sera activé après la connexion de votre compte Stripe."); });
  const note = document.querySelector(".shop-note");
  if (note) note.textContent = "Cliquez sur un produit pour voir les photos, les détails et l'ajouter au panier.";

  renderCategories(); renderProducts(); updateCart();
})();
