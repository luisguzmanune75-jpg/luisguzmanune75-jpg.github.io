(() => {
  const products = [
    {
      id: "percarbonate-mariette",
      name: "Percarbonate de sodium Mariette",
      category: "Maison",
      price: 7.59,
      images: [
        "https://i.ebayimg.com/images/g/CB4AAeSw9OVqlv~k/s-l1600.webp",
        "https://i.ebayimg.com/images/g/2IYAAeSwSUNqlt9k/s-l1600.webp"
      ],
      description: "Percarbonate de sodium pour les usages de nettoyage et d'entretien de la maison."
    },
    {
      id: "gommage-coconut-1",
      name: "Gommage pour le corps Gotta Love Nature Go Coconut",
      category: "Quotidien",
      price: 7.59,
      images: ["https://i.ebayimg.com/images/g/P2AAAeSwS9dqlugC/s-l1600.webp"],
      description: "Gommage pour le corps à l'esprit tropical, idéal pour une routine de soin."
    },
    {
      id: "gommage-coconut-2",
      name: "Gommage pour le corps Gotta Love Nature Go Coconut",
      category: "Quotidien",
      price: 7.59,
      images: ["https://i.ebayimg.com/images/g/f1QAAeSwJm1qluts/s-l1600.webp"],
      description: "Gommage pour le corps Gotta Love Nature Go Coconut."
    },
    {
      id: "lily-white-75ml",
      name: "LE Parfum de FRANCE Lily White Eau de toilette femme 75 ml",
      category: "Quotidien",
      price: 10.80,
      images: [
        "https://i.ebayimg.com/images/g/QkgAAeSwaclqlwHt/s-l1600.webp",
        "https://i.ebayimg.com/images/g/ZLQAAeSwmKhqlu32/s-l1600.webp",
        "https://i.ebayimg.com/images/g/EgkAAeSwNXNqlu4K/s-l1600.webp"
      ],
      description: "Eau de toilette femme Lily White, flacon de 75 ml."
    },
    {
      id: "pink-stuff",
      name: "Pâte de nettoyage The Pink Stuff",
      category: "Maison",
      price: 6.52,
      images: ["https://i.ebayimg.com/images/g/ds0AAeSw0DZqlvDS/s-l1600.webp"],
      description: "Pâte de nettoyage polyvalente pour l'entretien de la maison."
    },
    {
      id: "battletron-charge",
      name: "Station de charge sans fil Battletron",
      category: "Tech",
      price: 12.94,
      images: [
        "https://i.ebayimg.com/images/g/3WQAAeSwTtFqlwDu/s-l1600.webp",
        "https://i.ebayimg.com/images/g/gCgAAeSwhVlqlvIA/s-l1600.webp",
        "https://i.ebayimg.com/images/g/~5MAAeSw04tqlvIE/s-l1600.webp"
      ],
      description: "Station de charge sans fil Battletron pour votre espace de travail ou votre maison."
    },
    {
      id: "capace-exclusive-himself",
      name: "Coffret cadeau Capace Exclusive Homme Himself",
      category: "Quotidien",
      price: 12.94,
      images: ["https://i.ebayimg.com/images/g/2jsAAeSwS9dqlvRh/s-l1600.webp"],
      description: "Coffret cadeau Capace Exclusive Homme Himself."
    },
    {
      id: "antikal-tropical-500ml",
      name: "Détartrant Antikal Tropical 500 ml",
      category: "Maison",
      price: 14.01,
      images: [
        "https://i.ebayimg.com/images/g/gT8AAeSwKVxqlyw5/s-l1600.webp",
        "https://i.ebayimg.com/images/g/qqIAAeSw2o5qlvVh/s-l1600.webp"
      ],
      description: "Détartrant Antikal Tropical en flacon de 500 ml."
    },
    {
      id: "acide-citrique",
      name: "Acide Citrique Multi-Usages Détartreur Puissant pour Nettoyage Maison et Cuisine",
      category: "Maison",
      price: 7.59,
      images: ["https://i.ebayimg.com/images/g/lLsAAeSwRUZqlvbc/s-l1600.webp"],
      description: "Acide citrique multi-usages pour le nettoyage et l'entretien de la maison et de la cuisine."
    },
    {
      id: "bamboo-training-pads",
      name: "Bamboo Training Pads 10x Couches d'entraînement pour chiens 60x60 cm",
      category: "Quotidien",
      price: 6.52,
      images: ["https://i.ebayimg.com/images/g/lYMAAeSwmmZqlvdY/s-l1600.webp"],
      description: "Lot de 10 couches d'entraînement pour chiens au format 60 × 60 cm."
    },
    {
      id: "bodymass-magnesium",
      name: "BodyMass Nutrition Magnésium Citrate 200 mg - 60 Tablettes",
      category: "Quotidien",
      price: 7.59,
      images: [
        "https://i.ebayimg.com/images/g/1uUAAeSwvEZqlwMw/s-l1600.webp",
        "https://i.ebayimg.com/images/g/xKcAAeSw6RlqlvfK/s-l1600.webp"
      ],
      description: "Complément alimentaire BodyMass Nutrition au citrate de magnésium, 60 tablettes."
    },
    {
      id: "accelerate-creatine",
      name: "Accelerate Creatine Chewables 45 Tablettes 3g par Dose Saveur Pêche Citron",
      category: "Quotidien",
      price: 7.59,
      images: ["https://i.ebayimg.com/images/g/~iYAAeSwf6xqlvo8/s-l1600.webp"],
      description: "Créatine à croquer Accelerate, 45 tablettes, saveur pêche citron."
    }
  ];

  const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  const storageKey = "sng_boutique_cart";
  let activeCategory = "Tous";
  let searchTerm = "";
  let cart = JSON.parse(localStorage.getItem(storageKey) || "[]");

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
  `;
  document.head.appendChild(style);

  const saveCart = () => localStorage.setItem(storageKey, JSON.stringify(cart));
  const cartQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  function renderCategories() {
    categoryList.innerHTML = "";
    ["Tous", ...new Set(products.map((product) => product.category))].forEach((category) => {
      const button = document.createElement("button");
      button.className = `category-button${category === activeCategory ? " is-active" : ""}`;
      button.type = "button";
      button.textContent = category;
      button.addEventListener("click", () => {
        activeCategory = category;
        renderCategories();
        renderProducts();
      });
      categoryList.append(button);
    });
  }

  function visibleProducts() {
    const term = searchTerm.trim().toLocaleLowerCase("fr");
    return products.filter((product) =>
      (activeCategory === "Tous" || product.category === activeCategory) &&
      (!term || `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("fr").includes(term))
    );
  }

  function renderProducts() {
    const visible = visibleProducts();
    grid.innerHTML = "";
    count.textContent = `${visible.length} produit${visible.length > 1 ? "s" : ""}`;

    if (!visible.length) {
      grid.innerHTML = '<p class="empty-products">Aucun produit ne correspond à votre recherche.</p>';
      return;
    }

    visible.forEach((product) => {
      const card = document.createElement("article");
      card.className = "shop-card";
      const imageUrl = product.images[0];
      const thumbnails = product.images.length > 1
        ? `<div class="product-thumbs">${product.images.map((image, index) => `<button class="product-thumb${index === 0 ? " is-active" : ""}" type="button" data-image="${image}" aria-label="Voir la photo ${index + 1}"><img src="${image}" alt="" loading="lazy"></button>`).join("")}</div>`
        : "";

      card.innerHTML = `
        <div class="product-visual">
          <img class="product-image" src="${imageUrl}" alt="${product.name.replace(/"/g, '&quot;')}" loading="lazy" referrerpolicy="no-referrer">
          ${thumbnails}
        </div>
        <div class="product-content">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-bottom">
            <strong class="product-price">${currency.format(product.price)}</strong>
            <button class="add-button" type="button" data-product-id="${product.id}">Ajouter au panier</button>
          </div>
        </div>`;
      grid.append(card);
    });
  }

  function updateCart() {
    const quantity = cartQuantity();
    document.querySelector("#cart-count").textContent = quantity;
    document.querySelector("#cart-total").textContent = currency.format(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    document.querySelector("#checkout-button").disabled = !quantity;
    cartItems.innerHTML = "";

    if (!quantity) {
      cartItems.innerHTML = '<p class="cart-empty">Votre panier est vide.<br />Ajoutez un produit pour le retrouver ici.</p>';
      return;
    }

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
    if (item) item.quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    saveCart();
    updateCart();
    setCartOpen(true);
  }

  function changeQuantity(id, amount) {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (!item) return;
    item.quantity += amount;
    cart = cart.filter((cartItem) => cartItem.quantity > 0);
    saveCart();
    updateCart();
  }

  function setCartOpen(open) {
    cartPanel.classList.toggle("is-open", open);
    cartScrim.classList.toggle("is-visible", open);
    cartPanel.setAttribute("aria-hidden", String(!open));
    document.querySelector("#cart-toggle").setAttribute("aria-expanded", String(open));
  }

  document.querySelector("#product-search").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderProducts();
  });

  grid.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-image]");
    if (thumb) {
      const visual = thumb.closest(".product-visual");
      const image = visual.querySelector(".product-image");
      image.src = thumb.dataset.image;
      visual.querySelectorAll(".product-thumb").forEach((button) => button.classList.remove("is-active"));
      thumb.classList.add("is-active");
      return;
    }
    const button = event.target.closest("[data-product-id]");
    if (button) addProduct(button.dataset.productId);
  });

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) changeQuantity(button.dataset.id, button.dataset.action === "increase" ? 1 : -1);
  });

  document.querySelector("#cart-toggle").addEventListener("click", () => setCartOpen(true));
  document.querySelector("#cart-close").addEventListener("click", () => setCartOpen(false));
  cartScrim.addEventListener("click", () => setCartOpen(false));

  document.querySelector("#checkout-button").addEventListener("click", () => {
    alert("Le paiement Stripe sera activé après la connexion de votre compte Stripe.");
  });

  const note = document.querySelector(".shop-note");
  if (note) note.textContent = "Produits proposés par SNG Portal. Les prix affichés sont ceux indiqués dans votre catalogue.";

  renderCategories();
  renderProducts();
  updateCart();
})();
