// This file demonstrates implementation of some of the suggested features
// You can integrate these functions into your main script.js

// 1. Shopping Cart Functionality
function initShoppingCart() {
  // Initialize cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem("shoeHiveCart")) || []
  updateCartDisplay()

  // Add to cart function
  window.addToCart = (product) => {
    // Check if product already in cart
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("shoeHiveCart", JSON.stringify(cart))
    updateCartDisplay()

    // Show mini cart notification
    showMiniCart()
  }

  // Update cart UI
  function updateCartDisplay() {
    const cartCount = document.querySelector(".cart-count")
    const cartAmount = document.querySelector(".cart-amount")

    if (cartCount && cartAmount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

      cartCount.textContent = totalItems
      cartAmount.textContent = `$${totalAmount.toFixed(2)}`
    }
  }

  // Show mini cart
  function showMiniCart() {
    const miniCart = document.getElementById("mini-cart")
    if (miniCart) {
      miniCart.classList.add("active")
      setTimeout(() => {
        miniCart.classList.remove("active")
      }, 3000)
    }
  }

  // Cart page functions
  function renderCartPage() {
    const cartContainer = document.getElementById("cart-items")
    if (!cartContainer) return

    if (cart.length === 0) {
      cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>'
      return
    }

    let cartHTML = ""
    cart.forEach((item) => {
      cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=80&width=80'">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="cart-item-price">$${item.price}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
                </div>
            `
    })

    cartContainer.innerHTML = cartHTML

    // Update cart summary
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 10 : 0
    const total = subtotal + shipping

    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`
    document.getElementById("cart-shipping").textContent = `$${shipping.toFixed(2)}`
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`
  }

  // Expose cart functions to window
  window.updateQuantity = (id, change) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      item.quantity += change
      if (item.quantity <= 0) {
        cart = cart.filter((item) => item.id !== id)
      }
      localStorage.setItem("shoeHiveCart", JSON.stringify(cart))
      updateCartDisplay()
      renderCartPage()
    }
  }

  window.removeFromCart = (id) => {
    cart = cart.filter((item) => item.id !== id)
    localStorage.setItem("shoeHiveCart", JSON.stringify(cart))
    updateCartDisplay()
    renderCartPage()
  }

  window.clearCart = () => {
    cart = []
    localStorage.setItem("shoeHiveCart", JSON.stringify(cart))
    updateCartDisplay()
    renderCartPage()
  }

  // Initialize cart page if we're on it
  if (window.location.pathname.includes("cart.html")) {
    renderCartPage()
  }
}

// 2. Product Search and Filtering
function initProductSearch() {
  const searchInput = document.getElementById("product-search")
  const filterForm = document.getElementById("filter-form")

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      filterProducts(searchTerm)
    })
  }

  if (filterForm) {
    filterForm.addEventListener("change", () => {
      applyFilters()
    })
  }

  function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      const productName = card.querySelector("h3").textContent.toLowerCase()
      const productCategory = card.querySelector(".product-category")?.textContent.toLowerCase() || ""

      if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }

  function applyFilters() {
    const priceRange = document.getElementById("price-range").value
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(
      (input) => input.value,
    )
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(
      (input) => input.value,
    )

    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      const price = Number.parseFloat(card.querySelector(".product-price").textContent.replace("$", ""))
      const brand = card.dataset.brand || ""
      const category = card.querySelector(".product-category")?.textContent.toLowerCase() || ""

      const priceMatch = price <= priceRange
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand)
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category)

      if (priceMatch && brandMatch && categoryMatch) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }
}

// 3. Wishlist Functionality
function initWishlist() {
  // Initialize wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("shoeHiveWishlist")) || []

  // Toggle wishlist item
  window.toggleWishlist = (productId) => {
    const index = wishlist.indexOf(productId)

    if (index === -1) {
      // Add to wishlist
      wishlist.push(productId)
      updateWishlistButton(productId, true)
    } else {
      // Remove from wishlist
      wishlist.splice(index, 1)
      updateWishlistButton(productId, false)
    }

    // Save to localStorage
    localStorage.setItem("shoeHiveWishlist", JSON.stringify(wishlist))
  }

  // Update wishlist button UI
  function updateWishlistButton(productId, isInWishlist) {
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`)

    if (wishlistBtn) {
      if (isInWishlist) {
        wishlistBtn.classList.add("active")
        wishlistBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                `
      } else {
        wishlistBtn.classList.remove("active")
        wishlistBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                `
      }
    }
  }

  // Initialize wishlist buttons
  function initWishlistButtons() {
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      const productId = card.dataset.id
      if (!productId) return

      // Create wishlist button if it doesn't exist
      if (!card.querySelector(".wishlist-btn")) {
        const wishlistBtn = document.createElement("button")
        wishlistBtn.className = "wishlist-btn"
        wishlistBtn.dataset.id = productId
        wishlistBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          toggleWishlist(productId)
        })

        // Set initial state
        const isInWishlist = wishlist.includes(productId)
        updateWishlistButton(productId, isInWishlist)

        // Add to card
        card.querySelector(".product-image").appendChild(wishlistBtn)
      }
    })
  }

  // Render wishlist page
  function renderWishlistPage() {
    const wishlistContainer = document.getElementById("wishlist-items")
    if (!wishlistContainer) return

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>'
      return
    }

    // Get all products from all categories
    let allProducts = []
    for (const brand in window.products) {
      for (const category in window.products[brand]) {
        allProducts = allProducts.concat(window.products[brand][category])
      }
    }

    // Filter products in wishlist
    const wishlistProducts = allProducts.filter((product) => wishlist.includes(product.id))

    let wishlistHTML = ""
    wishlistProducts.forEach((product) => {
      wishlistHTML += `
                <div class="wishlist-item" data-id="${product.id}">
                    <div class="wishlist-item-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='/placeholder.svg?height=120&width=120'">
                    </div>
                    <div class="wishlist-item-details">
                        <h3>${product.name}</h3>
                        <div class="wishlist-item-price">$${product.price}</div>
                        <p class="wishlist-item-description">${product.description || "No description available."}</p>
                        <div class="wishlist-item-actions">
                            <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, "&quot;")})">Add to Cart</button>
                            <button class="remove-wishlist-btn" onclick="toggleWishlist('${product.id}')">Remove</button>
                        </div>
                    </div>
                </div>
            `
    })

    wishlistContainer.innerHTML = wishlistHTML
  }

  // Initialize wishlist
  initWishlistButtons()

  // Initialize wishlist page if we're on it
  if (window.location.pathname.includes("wishlist.html")) {
    renderWishlistPage()
  }
}

// 4. Product Reviews
function initProductReviews() {
  // Get reviews from localStorage
  function getProductReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem("shoeHiveReviews")) || {}
    return allReviews[productId] || []
  }

  // Save review to localStorage
  function saveProductReview(productId, review) {
    const allReviews = JSON.parse(localStorage.getItem("shoeHiveReviews")) || {}

    if (!allReviews[productId]) {
      allReviews[productId] = []
    }

    allReviews[productId].push(review)
    localStorage.setItem("shoeHiveReviews", JSON.stringify(allReviews))
  }

  // Render reviews for a product
  function renderProductReviews(productId) {
    const reviewsContainer = document.getElementById("product-reviews")
    if (!reviewsContainer) return

    const reviews = getProductReviews(productId)

    if (reviews.length === 0) {
      reviewsContainer.innerHTML = '<div class="no-reviews">No reviews yet. Be the first to review this product!</div>'
      return
    }

    let reviewsHTML = ""
    reviews.forEach((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating)

      reviewsHTML += `
                <div class="review">
                    <div class="review-header">
                        <div class="review-author">${review.name}</div>
                        <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                    </div>
                    <div class="review-rating">${stars}</div>
                    <div class="review-title">${review.title}</div>
                    <div class="review-content">${review.content}</div>
                </div>
            `
    })

    reviewsContainer.innerHTML = reviewsHTML

    // Update average rating
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const avgRatingElement = document.getElementById("average-rating")
    if (avgRatingElement) {
      avgRatingElement.textContent = avgRating.toFixed(1)
    }
  }

  // Handle review form submission
  const reviewForm = document.getElementById("review-form")
  if (reviewForm) {
    reviewForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const productId = this.dataset.productId
      const name = document.getElementById("review-name").value
      const email = document.getElementById("review-email").value
      const rating = Number.parseInt(document.querySelector('input[name="rating"]:checked').value)
      const title = document.getElementById("review-title").value
      const content = document.getElementById("review-content").value

      const review = {
        name,
        email,
        rating,
        title,
        content,
        date: new Date().toISOString(),
      }

      saveProductReview(productId, review)
      renderProductReviews(productId)

      // Reset form
      this.reset()

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "review-success"
      successMessage.textContent = "Your review has been submitted successfully!"
      this.appendChild(successMessage)

      setTimeout(() => {
        successMessage.remove()
      }, 3000)
    })
  }

  // Initialize reviews for product page
  const productPage = document.querySelector(".product-page")
  if (productPage) {
    const productId = productPage.dataset.productId
    renderProductReviews(productId)
  }
}

// 5. Size Guide
function initSizeGuide() {
  const sizeGuideBtn = document.getElementById("size-guide-btn")
  const sizeGuideModal = document.getElementById("size-guide-modal")

  if (sizeGuideBtn && sizeGuideModal) {
    sizeGuideBtn.addEventListener("click", () => {
      sizeGuideModal.style.display = "block"
    })

    const closeBtn = sizeGuideModal.querySelector(".close-modal")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        sizeGuideModal.style.display = "none"
      })
    }

    window.addEventListener("click", (e) => {
      if (e.target === sizeGuideModal) {
        sizeGuideModal.style.display = "none"
      }
    })
  }
}

// 6. Dark Mode Toggle
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle")

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("shoeHiveTheme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark")
    if (darkModeToggle) darkModeToggle.checked = true
  }

  // Toggle dark mode
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("shoeHiveTheme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("shoeHiveTheme", "light")
      }
    })
  }
}

// Initialize all features
document.addEventListener("DOMContentLoaded", () => {
  // Initialize features
  initShoppingCart()
  initProductSearch()
  initWishlist()
  initProductReviews()
  initSizeGuide()
  initDarkMode()
})

