// This script ensures all products display the same detailed modal format as the Adidas D-Rose example

document.addEventListener("DOMContentLoaded", () => {
  // Immediately override the showProductModal function when the page loads
  overrideProductModal()

  // Also override any product card click handlers to ensure they use our detailed modal
  setupProductCardListeners()

  function overrideProductModal() {
    // Store the original function reference if it exists
    const originalShowProductModal = window.showProductModal

    // Replace with our enhanced version
    window.showProductModal = (product) => {
      // Create or get the detailed modal
      ensureDetailedModalExists()

      // Set product details
      const modal = document.getElementById("product-detail-modal")
      if (!modal) return

      console.log("Showing detailed modal for:", product.name) // Debug log

      // Set basic product info
      document.getElementById("detail-product-name").textContent = product.name
      document.getElementById("detail-product-price").textContent = `$${product.price.toFixed(2)}`

      // Set product description - use the product's description if available
      const shortDescription =
        product.description ||
        `Experience premium comfort and style with the ${product.name}. Featuring the latest in shoe technology, these versatile shoes are perfect for any occasion, offering both style and comfort.`

      document.getElementById("detail-product-description").textContent = shortDescription

      // Set product image
      document.getElementById("detail-product-image").src = product.image

      // Generate detailed content based on product type
      generateDetailedContent(product)

      // Reset color overlay
      const colorOverlay = document.getElementById("detail-color-overlay")
      if (colorOverlay) colorOverlay.style.opacity = "0"

      // Reset size selection
      const sizeOptions = document.querySelectorAll(".size-option")
      sizeOptions.forEach((option) => option.classList.remove("selected"))

      // Reset quantity
      document.getElementById("quantity-value").value = 1

      // Reset color selection
      const colorOptions = document.querySelectorAll(".color-option-detail")
      colorOptions.forEach((option) => {
        option.classList.remove("active")
        if (option.getAttribute("data-color") === "blue") {
          option.classList.add("active")
        }
      })

      // Reset active tab
      const tabButtons = document.querySelectorAll(".tab-button")
      const tabPanels = document.querySelectorAll(".tab-panel")

      if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanels.forEach((panel) => panel.classList.remove("active"))

        // Set first tab as active
        tabButtons[0].classList.add("active")
        tabPanels[0].classList.add("active")
      }

      // Show modal
      modal.style.display = "block"
    }
  }

  // Function to set up product card listeners
  function setupProductCardListeners() {
    // Wait a short time to ensure all other scripts have loaded
    setTimeout(() => {
      // Get all product cards
      const productCards = document.querySelectorAll(".product-card, .card, [data-product-id]")

      if (productCards.length > 0) {
        console.log(`Found ${productCards.length} product cards to update`) // Debug log

        productCards.forEach((card) => {
          // Remove existing click handlers by cloning and replacing the element
          const newCard = card.cloneNode(true)
          card.parentNode.replaceChild(newCard, card)

          // Add our click handler
          newCard.addEventListener("click", function (e) {
            // Don't show modal if clicking the add to cart button
            if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
              return
            }

            // Get product info
            const productId = this.getAttribute("data-product-id") || ""
            const productName = this.querySelector("h3, .product-name")?.textContent || "Product"
            const productPriceText = this.querySelector(".product-price, .price")?.textContent || "$0"
            const productPrice = Number.parseFloat(productPriceText.replace(/[^0-9.]/g, "")) || 0
            const productImage = this.querySelector("img")?.src || "/placeholder.svg?height=400&width=400"
            const productDescription = this.querySelector(".product-description, .description")?.textContent || ""

            // Create product object
            const product = {
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage,
              description: productDescription,
            }

            // Show our detailed product modal
            window.showProductModal(product)

            // Prevent default action
            e.preventDefault()
            e.stopPropagation()
          })
        })
      }

      // Also handle any "Quick View" or similar buttons
      const quickViewButtons = document.querySelectorAll('.quick-view, .view-details, [data-action="view"]')
      quickViewButtons.forEach((button) => {
        // Remove existing click handlers
        const newButton = button.cloneNode(true)
        button.parentNode.replaceChild(newButton, button)

        // Add our click handler
        newButton.addEventListener("click", function (e) {
          // Get product info from the button's data attributes or parent card
          const card = this.closest(".product-card, .card")
          if (!card) return

          const productId = card.getAttribute("data-product-id") || ""
          const productName = card.querySelector("h3, .product-name")?.textContent || "Product"
          const productPriceText = card.querySelector(".product-price, .price")?.textContent || "$0"
          const productPrice = Number.parseFloat(productPriceText.replace(/[^0-9.]/g, "")) || 0
          const productImage = card.querySelector("img")?.src || "/placeholder.svg?height=400&width=400"
          const productDescription = card.querySelector(".product-description, .description")?.textContent || ""

          // Create product object
          const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            description: productDescription,
          }

          // Show our detailed product modal
          window.showProductModal(product)

          // Prevent default action
          e.preventDefault()
          e.stopPropagation()
        })
      })

      // Override any existing modal open functions
      if (typeof window.openProductModal === "function") {
        const originalOpenModal = window.openProductModal
        window.openProductModal = (productId) => {
          // Find the product in the global products object
          const product = findProductById(productId)
          if (product) {
            window.showProductModal(product)
          } else {
            // Fallback to original function
            originalOpenModal(productId)
          }
        }
      }

      // Override any existing quick view functions
      if (typeof window.quickView === "function") {
        const originalQuickView = window.quickView
        window.quickView = (productId) => {
          // Find the product in the global products object
          const product = findProductById(productId)
          if (product) {
            window.showProductModal(product)
          } else {
            // Fallback to original function
            originalQuickView(productId)
          }
        }
      }
    }, 500) // Wait 500ms to ensure all other scripts have loaded
  }

  // Helper function to find a product by ID in the global products object
  function findProductById(productId) {
    // Check if window.products exists
    if (!window.products) return null

    // Search through all brands and categories
    for (const brand in window.products) {
      for (const category in window.products[brand]) {
        const products = window.products[brand][category]
        const product = products.find((p) => p.id === productId)
        if (product) return product
      }
    }

    return null
  }

  // Function to ensure the detailed modal exists in the DOM
  function ensureDetailedModalExists() {
    if (document.getElementById("product-detail-modal")) return

    const modalHTML = `
        <div id="product-detail-modal" class="product-detail-modal">
            <div class="product-detail-content">
                <button class="close-product-detail">&times;</button>
                <div class="product-detail-grid">
                    <div class="product-detail-image">
                        <img id="detail-product-image" src="/placeholder.svg?height=400&width=400" alt="Product">
                        <div class="product-detail-color-overlay" id="detail-color-overlay"></div>
                    </div>
                    <div class="product-detail-info">
                        <h2 class="product-detail-name" id="detail-product-name">Product Name</h2>
                        <div class="product-detail-price" id="detail-product-price">$0.00</div>
                        
                        <div class="product-detail-description-container">
                            <p class="product-detail-description" id="detail-product-description">
                                Product description will appear here.
                            </p>
                            
                            <div class="product-detail-tabs">
                                <div class="tab-buttons">
                                    <button class="tab-button active" data-tab="description">Description</button>
                                    <button class="tab-button" data-tab="specifications">Specifications</button>
                                    <button class="tab-button" data-tab="materials">Materials</button>
                                    <button class="tab-button" data-tab="care">Care Instructions</button>
                                </div>
                                
                                <div class="tab-content">
                                    <div class="tab-panel active" id="description-panel">
                                        <p id="extended-description">
                                            Experience unparalleled comfort and style with our premium footwear. Designed with the modern athlete in mind, these shoes combine cutting-edge technology with sleek aesthetics.
                                        </p>
                                    </div>
                                    
                                    <div class="tab-panel" id="specifications-panel">
                                        <ul class="specs-list">
                                            <li><strong>Weight:</strong> <span id="product-weight">10.5 oz (298 g)</span></li>
                                            <li><strong>Drop:</strong> <span id="product-drop">10mm</span></li>
                                            <li><strong>Arch Support:</strong> <span id="product-arch">Neutral</span></li>
                                            <li><strong>Closure Type:</strong> <span id="product-closure">Lace-up</span></li>
                                            <li><strong>Terrain:</strong> <span id="product-terrain">Road, Track</span></li>
                                        </ul>
                                    </div>
                                    
                                    <div class="tab-panel" id="materials-panel">
                                        <p id="product-materials">
                                            Upper: Engineered mesh provides targeted support with a lightweight feel.<br>
                                            Midsole: Responsive foam cushioning delivers a smooth, energized ride.<br>
                                            Outsole: Durable rubber with strategic traction pattern for grip on various surfaces.
                                        </p>
                                    </div>
                                    
                                    <div class="tab-panel" id="care-panel">
                                        <p id="product-care">
                                            • Clean with a soft, damp cloth and mild soap<br>
                                            • Air dry naturally, away from direct heat<br>
                                            • Do not machine wash or tumble dry<br>
                                            • Remove insoles to dry separately if necessary<br>
                                            • Use specialized shoe deodorizers to maintain freshness
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="product-detail-color">
                            <div class="size-label">Color:</div>
                            <div class="color-options-detail" id="detail-color-options">
                                <div class="color-option-detail color-red" data-color="red" data-name="Crimson Red"></div>
                                <div class="color-option-detail color-blue active" data-color="blue" data-name="Ocean Blue"></div>
                                <div class="color-option-detail color-green" data-color="green" data-name="Forest Green"></div>
                                <div class="color-option-detail color-yellow" data-color="yellow" data-name="Sunshine Yellow"></div>
                                <div class="color-option-detail color-purple" data-color="purple" data-name="Royal Purple"></div>
                                <div class="color-option-detail color-black" data-color="black" data-name="Classic Black"></div>
                            </div>
                        </div>
                        
                        <div class="product-detail-sizes">
                            <div class="size-label">Select Size:</div>
                            <div class="size-options" id="size-options">
                                <div class="size-option" data-size="7">7</div>
                                <div class="size-option" data-size="8">8</div>
                                <div class="size-option" data-size="9">9</div>
                                <div class="size-option" data-size="10">10</div>
                                <div class="size-option" data-size="11">11</div>
                                <div class="size-option" data-size="12">12</div>
                            </div>
                            <div class="error-message" id="size-error">Please select a size before adding to cart</div>
                        </div>
                        
                        <div class="quantity-selector">
                            <div class="quantity-label">Quantity:</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" id="decrease-quantity">-</button>
                                <input type="text" class="quantity-value" id="quantity-value" value="1" readonly>
                                <button class="quantity-btn" id="increase-quantity">+</button>
                            </div>
                        </div>
                        
                        <div class="product-detail-features">
                            <ul class="feature-list">
                                <li class="feature-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                    Premium quality materials
                                </li>
                                <li class="feature-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                    Comfortable cushioning
                                </li>
                                <li class="feature-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                    Durable construction
                                </li>
                            </ul>
                        </div>
                        
                        <div class="product-detail-actions">
                            <button class="buy-now-btn" id="buy-now-btn">
                                Buy Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </button>
                            <button class="add-to-cart-btn" id="detail-add-to-cart">
                                Add to Cart
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    // Append modal to body
    const modalContainer = document.createElement("div")
    modalContainer.innerHTML = modalHTML
    document.body.appendChild(modalContainer.firstElementChild)

    // Add event listeners to the modal
    setupModalEventListeners()
  }

  // Function to generate detailed content based on product type
  function generateDetailedContent(product) {
    const name = product.name
    const lowerName = name.toLowerCase()

    // Determine product type based on name and description
    const isRunning =
      lowerName.includes("running") ||
      lowerName.includes("runner") ||
      (product.description && product.description.toLowerCase().includes("running"))

    const isBasketball =
      lowerName.includes("basketball") ||
      lowerName.includes("court") ||
      lowerName.includes("d-rose") ||
      (product.description && product.description.toLowerCase().includes("basketball"))

    const isCasual =
      lowerName.includes("casual") ||
      lowerName.includes("lifestyle") ||
      lowerName.includes("sneaker") ||
      (product.description && product.description.toLowerCase().includes("casual"))

    const isTraining =
      lowerName.includes("training") ||
      lowerName.includes("trainer") ||
      lowerName.includes("gym") ||
      (product.description && product.description.toLowerCase().includes("training"))

    const isTennis =
      lowerName.includes("tennis") || (product.description && product.description.toLowerCase().includes("tennis"))

    const isAirMax =
      lowerName.includes("air max") || (product.description && product.description.toLowerCase().includes("air max"))

    // Default content
    let extendedDesc = `The ${name} combines innovative design with premium materials to deliver exceptional comfort and style. Whether you're looking for performance or fashion, these versatile shoes are crafted to exceed your expectations. The attention to detail is evident in every stitch, with thoughtful features that enhance both functionality and aesthetics. Experience the perfect blend of technology and craftsmanship that makes these shoes stand out from the crowd.`

    let specifications = {
      weight: "10.5 oz (298 g)",
      drop: "10mm",
      arch: "Neutral",
      closure: "Lace-up",
      terrain: "Multiple surfaces",
    }

    let materials = `Upper: Premium materials selected for comfort and durability.<br>
                        Midsole: Cushioning technology that adapts to your stride.<br>
                        Outsole: Durable rubber compound designed for traction and longevity.`

    let care = `• Clean with a soft, damp cloth and mild soap<br>
                    • Air dry naturally, away from direct heat<br>
                    • Do not machine wash or tumble dry<br>
                    • Remove insoles to dry separately if necessary<br>
                    • Use specialized shoe deodorizers to maintain freshness`

    // Customize content based on product type
    if (isAirMax) {
      extendedDesc = `Experience legendary comfort with the ${name}, featuring Nike's iconic Air Max cushioning technology. The visible Air unit in the heel provides responsive cushioning and impact protection with every step. The carefully engineered upper combines style and breathability, while the durable outsole delivers excellent traction on various surfaces. Whether you're hitting the streets or making a fashion statement, these shoes deliver the perfect blend of performance, comfort, and head-turning style.`

      specifications = {
        weight: "12.0 oz (340 g)",
        drop: "10mm",
        arch: "Neutral",
        closure: "Lace-up",
        terrain: "Urban, Casual wear",
      }

      materials = `Upper: Combination of mesh, synthetic materials, and leather for optimal support and breathability.<br>
                        Midsole: Signature visible Air Max cushioning unit for responsive impact protection.<br>
                        Outsole: Waffle-inspired pattern rubber for durability and multi-surface traction.`

      care = `• Clean surface with a soft brush or cloth<br>
                    • Use mild soap and water for stubborn stains<br>
                    • Air dry at room temperature<br>
                    • Store in a cool, dry place away from direct sunlight<br>
                    • Use shoe trees to maintain shape when not worn`
    } else if (isRunning) {
      extendedDesc = `Engineered for speed and endurance, the ${name} delivers exceptional performance for runners of all levels. The responsive cushioning absorbs impact while returning energy with each stride, making long runs feel effortless. The breathable upper adapts to your foot's shape for a personalized fit that reduces irritation and blisters, even during marathon distances. Whether you're training for your next race or enjoying a casual jog, these shoes provide the perfect balance of comfort, support, and durability.`

      specifications = {
        weight: "8.5 oz (241 g)",
        drop: "8mm",
        arch: "Neutral",
        closure: "Lace-up",
        terrain: "Road, Track",
      }

      materials = `Upper: Lightweight, breathable mesh with targeted support zones for a secure fit.<br>
                        Midsole: Responsive foam with energy-return technology for a springy feel.<br>
                        Outsole: High-abrasion rubber in high-wear areas for durability, with flex grooves for natural movement.`

      care = `• Clean with a soft brush to remove dirt<br>
                    • Hand wash with mild soap and cold water if necessary<br>
                    • Air dry at room temperature away from direct heat or sunlight<br>
                    • Replace insoles regularly for maximum comfort<br>
                    • Rotate with another pair of running shoes to extend lifespan`
    } else if (isBasketball) {
      extendedDesc = `Dominate the court with the ${name}, designed for serious basketball players who demand peak performance. The high-top design provides exceptional ankle support during quick cuts and jumps, while the cushioned midsole absorbs landing impact to reduce fatigue during long games. The herringbone traction pattern gives you confident grip on any court surface, allowing for explosive movements without slipping. Strategic reinforcement in high-wear areas ensures these shoes can handle the intensity of your game.`

      specifications = {
        weight: "13.2 oz (374 g)",
        drop: "10mm",
        arch: "Medium",
        closure: "Lace-up with strap",
        terrain: "Indoor court, Outdoor court",
      }

      materials = `Upper: Synthetic leather and textile combination for durability and support.<br>
                        Midsole: Multi-density foam with heel and forefoot cushioning units for impact protection.<br>
                        Outsole: Solid rubber with multidirectional traction pattern for superior grip on court surfaces.`

      care = `• Wipe clean with a damp cloth after each use<br>
                    • Use a soft brush to clean the outsole traction pattern<br>
                    • Allow shoes to fully air dry between games<br>
                    • Store in a cool, dry place away from direct sunlight<br>
                    • Use shoe deodorizers to maintain freshness`
    } else if (isCasual) {
      extendedDesc = `Elevate your everyday style with the ${name}, where fashion meets comfort in perfect harmony. These versatile shoes transition seamlessly from casual office settings to weekend outings, complementing any outfit with their clean, contemporary design. The cushioned footbed provides all-day comfort for extended wear, while the durable construction ensures they'll remain a staple in your wardrobe for seasons to come. Premium materials and attention to detail make these shoes stand out from ordinary casual footwear.`

      specifications = {
        weight: "11.0 oz (312 g)",
        drop: "6mm",
        arch: "Neutral",
        closure: "Lace-up",
        terrain: "Everyday wear, Urban",
      }

      materials = `Upper: Premium leather or suede with textile accents for style and durability.<br>
                        Midsole: Lightweight cushioning foam for all-day comfort.<br>
                        Outsole: Flexible rubber with subtle traction pattern suitable for various surfaces.`

      care = `• Clean with a soft, damp cloth and mild soap<br>
                    • Use specialized leather or suede cleaner as appropriate<br>
                    • Apply leather conditioner or suede protector regularly<br>
                    • Use shoe trees to maintain shape when not worn<br>
                    • Protect from water and extreme temperatures`
    } else if (isTraining) {
      extendedDesc = `Take your workouts to the next level with the ${name}, specifically engineered for versatile training sessions. The stable platform provides a secure base for weightlifting, while the responsive cushioning supports high-intensity interval training and plyometric exercises. The durable upper offers lateral support during side-to-side movements, and the flexible forefoot allows natural motion for agility drills. From box jumps to battle ropes, these training shoes deliver the performance you need for your most challenging workouts.`

      specifications = {
        weight: "10.8 oz (306 g)",
        drop: "4mm",
        arch: "Medium to High",
        closure: "Lace-up with midfoot strap",
        terrain: "Gym, Indoor training",
      }

      materials = `Upper: Abrasion-resistant mesh with reinforced zones for durability during rope climbs and intense training.<br>
                        Midsole: Firm, stable foam with additional heel support for lifting sessions.<br>
                        Outsole: Multi-surface rubber with targeted traction patterns for various training movements.`

      care = `• Wipe clean after each workout<br>
                    • Remove excess dirt with a soft brush<br>
                    • Hand wash with mild soap if necessary<br>
                    • Air dry completely before next use<br>
                    • Disinfect occasionally to prevent odor buildup`
    } else if (isTennis) {
      extendedDesc = `Step onto the court with confidence in the ${name}, designed specifically for tennis players of all levels. The durable outsole provides excellent traction for quick lateral movements, while the cushioned midsole absorbs impact during intense rallies. The breathable upper keeps your feet cool during long matches, and the reinforced toe area offers protection against drag during serves and volleys. Experience the perfect combination of stability, comfort, and performance that will help elevate your tennis game.`

      specifications = {
        weight: "11.2 oz (317 g)",
        drop: "7mm",
        arch: "Medium",
        closure: "Lace-up",
        terrain: "Hard court, Clay court, Grass court",
      }

      materials = `Upper: Breathable synthetic mesh with reinforced zones for durability during lateral movements.<br>
                        Midsole: Responsive cushioning for impact absorption and energy return.<br>
                        Outsole: Non-marking rubber with court-specific traction pattern for optimal grip.`

      care = `• Clean court debris from outsole after each use<br>
                    • Wipe upper with a damp cloth to remove dirt<br>
                    • Allow to air dry completely before next use<br>
                    • Store in a well-ventilated area<br>
                    • Replace when outsole tread shows significant wear`
    }

    // Set the extended description
    document.getElementById("extended-description").innerHTML = extendedDesc

    // Set specifications
    document.getElementById("product-weight").textContent = specifications.weight
    document.getElementById("product-drop").textContent = specifications.drop
    document.getElementById("product-arch").textContent = specifications.arch
    document.getElementById("product-closure").textContent = specifications.closure
    document.getElementById("product-terrain").textContent = specifications.terrain

    // Set materials and care
    document.getElementById("product-materials").innerHTML = materials
    document.getElementById("product-care").innerHTML = care
  }

  // Function to set up event listeners for the modal
  function setupModalEventListeners() {
    const modal = document.getElementById("product-detail-modal")
    const closeBtn = document.querySelector(".close-product-detail")
    const sizeOptions = document.querySelectorAll(".size-option")
    const colorOptions = document.querySelectorAll(".color-option-detail")
    const decreaseBtn = document.getElementById("decrease-quantity")
    const increaseBtn = document.getElementById("increase-quantity")
    const quantityInput = document.getElementById("quantity-value")
    const addToCartBtn = document.getElementById("detail-add-to-cart")
    const buyNowBtn = document.getElementById("buy-now-btn")
    const sizeError = document.getElementById("size-error")

    // Close modal when clicking the close button
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (modal) modal.style.display = "none"
      })
    }

    // Close modal when clicking outside the content
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none"
        }
      })
    }

    // Size selection
    if (sizeOptions) {
      sizeOptions.forEach((option) => {
        option.addEventListener("click", function () {
          // Remove selected class from all options
          sizeOptions.forEach((opt) => opt.classList.remove("selected"))

          // Add selected class to clicked option
          this.classList.add("selected")

          // Hide error message if shown
          if (sizeError) sizeError.classList.remove("show")
        })
      })
    }

    // Color selection
    if (colorOptions) {
      colorOptions.forEach((option) => {
        option.addEventListener("click", function () {
          // Remove active class from all options
          colorOptions.forEach((opt) => opt.classList.remove("active"))

          // Add active class to clicked option
          this.classList.add("active")

          // Apply color to product image
          const color = this.getAttribute("data-color")
          applyColorToDetailImage(color)
        })
      })
    }

    // Quantity controls
    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        if (quantity > 1) {
          quantityInput.value = quantity - 1
        }
      })
    }

    if (increaseBtn && quantityInput) {
      increaseBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        quantityInput.value = quantity + 1
      })
    }

    // Add to cart button
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addProductToCart()
      })
    }

    // Buy now button
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const success = addProductToCart()
        if (success) {
          // Redirect to checkout page
          window.location.href = "cart.html"
        }
      })
    }

    // Tab functionality for product description
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabPanels = document.querySelectorAll(".tab-panel")

    if (tabButtons.length > 0) {
      tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all buttons and panels
          tabButtons.forEach((btn) => btn.classList.remove("active"))
          tabPanels.forEach((panel) => panel.classList.remove("active"))

          // Add active class to clicked button
          this.classList.add("active")

          // Show corresponding panel
          const tabId = this.getAttribute("data-tab")
          document.getElementById(`${tabId}-panel`).classList.add("active")
        })
      })
    }
  }

  // Function to apply color to detail image
  function applyColorToDetailImage(color) {
    const colorOverlay = document.getElementById("detail-color-overlay")
    if (!colorOverlay) return

    // Color map with RGB values
    const colorMap = {
      red: "rgba(231, 76, 60, 0.7)",
      blue: "rgba(52, 152, 219, 0.7)",
      green: "rgba(46, 204, 113, 0.7)",
      yellow: "rgba(241, 196, 15, 0.7)",
      purple: "rgba(155, 89, 182, 0.7)",
      orange: "rgba(230, 126, 34, 0.7)",
      black: "rgba(44, 62, 80, 0.7)",
      white: "rgba(236, 240, 241, 0.3)",
    }

    // Apply color overlay
    colorOverlay.style.backgroundColor = colorMap[color]
    colorOverlay.style.opacity = "1"
  }

  // Function to add product to cart
  function addProductToCart() {
    // Get selected size
    const selectedSize = document.querySelector(".size-option.selected")
    const sizeError = document.getElementById("size-error")

    // Check if size is selected
    if (!selectedSize) {
      if (sizeError) {
        sizeError.classList.add("show")
        setTimeout(() => {
          sizeError.classList.remove("show")
        }, 3000)
      }
      return false
    }

    // Get product details
    const productName = document.getElementById("detail-product-name").textContent
    const productPrice = Number.parseFloat(document.getElementById("detail-product-price").textContent.replace("$", ""))
    const productImage = document.getElementById("detail-product-image").src
    const productSize = selectedSize.getAttribute("data-size")
    const productQuantity = Number.parseInt(document.getElementById("quantity-value").value)
    const selectedColor = document.querySelector(".color-option-detail.active")
    const productColor = selectedColor ? selectedColor.getAttribute("data-color") : null
    const colorName = selectedColor ? selectedColor.getAttribute("data-name") : null

    // Create product object
    const product = {
      id: "product-" + Date.now(),
      name: productName,
      price: productPrice,
      image: productImage,
      size: productSize,
      quantity: productQuantity,
      color: productColor,
      colorName: colorName,
    }

    // Add to cart using existing function or fallback
    if (typeof window.addToCart === "function") {
      window.addToCart(product)
    } else {
      // Fallback if addToCart function is not available
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

      // Check if item already exists with same size and color
      const existingItemIndex = cartItems.findIndex(
        (item) => item.name === product.name && item.size === product.size && item.color === product.color,
      )

      if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        cartItems[existingItemIndex].quantity += productQuantity
      } else {
        // Add new item
        cartItems.push(product)
      }

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems))

      // Update cart display if functions are available
      if (typeof window.updateCartDisplay === "function") {
        window.updateCartDisplay()
      } else {
        // Update cart count manually
        const cartCount = document.querySelector(".cart-count")
        if (cartCount) {
          let totalItems = 0
          cartItems.forEach((item) => {
            totalItems += item.quantity || 1
          })
          cartCount.textContent = totalItems
        }

        // Update cart amount
        const cartAmount = document.querySelector(".cart-amount")
        if (cartAmount) {
          const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
          cartAmount.textContent = `$${total.toFixed(2)}`
        }
      }

      // Show notification
      showNotification(`${product.name} (Size ${product.size}) added to cart!`)
    }

    // Close modal
    const modal = document.getElementById("product-detail-modal")
    if (modal) modal.style.display = "none"

    return true
  }

  // Function to show notification
  function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector(".cart-notification")
    if (!notification) {
      notification = document.createElement("div")
      notification.className = "cart-notification"
      document.body.appendChild(notification)

      // Add styles if not already added
      if (!document.getElementById("notification-styles")) {
        const style = document.createElement("style")
        style.id = "notification-styles"
        style.textContent = `
                    .cart-notification {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 4px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        z-index: 1000;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }
                    .cart-notification.show {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `
        document.head.appendChild(style)
      }
    }

    // Set message and show
    notification.textContent = message
    notification.classList.add("show")

    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
})

