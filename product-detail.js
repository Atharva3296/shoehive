document.addEventListener("DOMContentLoaded", () => {
  // Create the enhanced product detail modal
  createEnhancedProductDetailModal()

  // Override the existing showProductModal function
  if (typeof window.showProductModal === "function") {
    const originalShowProductModal = window.showProductModal
    window.showProductModal = (product) => {
      showEnhancedProductDetail(product)
    }
  }

  // Function to create the enhanced product detail modal
  function createEnhancedProductDetailModal() {
    // Check if modal already exists
    if (document.getElementById("enhanced-product-modal")) return

    // Create modal element
    const modal = document.createElement("div")
    modal.id = "enhanced-product-modal"
    modal.className = "enhanced-product-modal"

    modal.innerHTML = `
      <div class="enhanced-product-content">
        <button class="close-enhanced-product">&times;</button>
        <div class="enhanced-product-grid">
          <div class="enhanced-product-image-container">
            <div class="enhanced-product-image">
              <img id="enhanced-product-img" src="/placeholder.svg?height=500&width=500" alt="Product">
            </div>
          </div>
          
          <div class="enhanced-product-info">
            <h2 class="enhanced-product-name" id="enhanced-product-name">Product Name</h2>
            <div class="enhanced-product-price" id="enhanced-product-price">$0.00</div>
            
            <div class="enhanced-product-description-container">
              <p class="enhanced-product-description" id="enhanced-product-description">
                Product description will appear here.
              </p>
              
              <div class="enhanced-product-tabs">
                <div class="tab-buttons">
                  <button class="tab-button active" data-tab="description">Description</button>
                  <button class="tab-button" data-tab="specifications">Specifications</button>
                  <button class="tab-button" data-tab="reviews">Reviews</button>
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
                  
                  <div class="tab-panel" id="reviews-panel">
                    <div class="reviews-container" id="reviews-container">
                      <div class="review-item">
                        <div class="review-header">
                          <div class="review-author">John D.</div>
                          <div class="review-rating">
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star">★</span>
                          </div>
                        </div>
                        <div class="review-content">Great shoes! Very comfortable for daily use and running.</div>
                      </div>
                      
                      <div class="review-item">
                        <div class="review-header">
                          <div class="review-author">Sarah M.</div>
                          <div class="review-rating">
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                            <span class="star filled">★</span>
                          </div>
                        </div>
                        <div class="review-content">Perfect fit and extremely durable. Would definitely recommend!</div>
                      </div>
                    </div>
                    
                    <div class="write-review-container">
                      <h4>Write a Review</h4>
                      <form id="review-form">
                        <input type="hidden" id="review-product-id" name="productId">
                        <input type="hidden" id="review-product-name" name="productName">
                        
                        <div class="form-group">
                          <label for="review-name">Your Name</label>
                          <input type="text" id="review-name" name="name" required>
                        </div>
                        
                        <div class="form-group">
                          <label for="review-email">Your Email</label>
                          <input type="email" id="review-email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                          <label>Rating</label>
                          <div class="rating-selector">
                            <span class="rating-star" data-rating="1">★</span>
                            <span class="rating-star" data-rating="2">★</span>
                            <span class="rating-star" data-rating="3">★</span>
                            <span class="rating-star" data-rating="4">★</span>
                            <span class="rating-star" data-rating="5">★</span>
                          </div>
                          <input type="hidden" id="review-rating" name="rating" value="5">
                        </div>
                        
                        <div class="form-group">
                          <label for="review-comment">Your Review</label>
                          <textarea id="review-comment" name="comment" rows="5" required></textarea>
                        </div>
                        
                        <button type="submit" class="submit-review-btn">Submit Review</button>
                      </form>
                      
                      <div class="review-success-message">
                        Thank you for your review! It has been submitted to the website owner.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="enhanced-product-sizes">
              <div class="size-label">Select Size:</div>
              <div class="size-options" id="enhanced-size-options">
                <div class="size-option" data-size="7">7</div>
                <div class="size-option" data-size="8">8</div>
                <div class="size-option" data-size="9">9</div>
                <div class="size-option" data-size="10">10</div>
                <div class="size-option" data-size="11">11</div>
                <div class="size-option" data-size="12">12</div>
              </div>
              <div class="error-message" id="enhanced-size-error">Please select a size before adding to cart</div>
            </div>
            
            <div class="quantity-selector">
              <div class="quantity-label">Quantity:</div>
              <div class="quantity-controls">
                <button class="quantity-btn" id="enhanced-decrease-quantity">-</button>
                <input type="text" class="quantity-value" id="enhanced-quantity-value" value="1" readonly>
                <button class="quantity-btn" id="enhanced-increase-quantity">+</button>
              </div>
            </div>
            
            <div class="enhanced-product-features">
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
            
            <div class="enhanced-product-actions">
              <button class="buy-now-btn" id="enhanced-buy-now-btn">
                Buy Now
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
              <button class="add-to-cart-btn" id="enhanced-add-to-cart">
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
    `

    // Add the modal to the body
    document.body.appendChild(modal)

    // Add event listeners for the modal
    setupEnhancedModalEventListeners()

    // Add CSS for the enhanced modal
    addEnhancedModalStyles()
  }

  // Function to set up event listeners for the enhanced modal
  function setupEnhancedModalEventListeners() {
    const modal = document.getElementById("enhanced-product-modal")
    const closeBtn = modal.querySelector(".close-enhanced-product")

    // Close button functionality
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })

    // Close when clicking outside the modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })

    // Tab switching functionality
    const tabButtons = modal.querySelectorAll(".tab-button")
    const tabPanels = modal.querySelectorAll(".tab-panel")

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

    // Size selection
    const sizeOptions = modal.querySelectorAll(".size-option")
    const sizeError = document.getElementById("enhanced-size-error")

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

    // Quantity controls
    const decreaseBtn = document.getElementById("enhanced-decrease-quantity")
    const increaseBtn = document.getElementById("enhanced-increase-quantity")
    const quantityInput = document.getElementById("enhanced-quantity-value")

    decreaseBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      if (quantity > 1) {
        quantityInput.value = quantity - 1
      }
    })

    increaseBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value)
      quantityInput.value = quantity + 1
    })

    // Star rating selection
    const ratingStars = modal.querySelectorAll(".rating-star")
    const ratingInput = document.getElementById("review-rating")

    ratingStars.forEach((star) => {
      star.addEventListener("mouseover", function () {
        const rating = this.getAttribute("data-rating")
        highlightStars(rating)
      })

      star.addEventListener("mouseout", () => {
        const currentRating = ratingInput.value
        highlightStars(currentRating)
      })

      star.addEventListener("click", function () {
        const rating = this.getAttribute("data-rating")
        ratingInput.value = rating
        highlightStars(rating)
      })
    })

    function highlightStars(rating) {
      ratingStars.forEach((star) => {
        const starRating = star.getAttribute("data-rating")
        if (starRating <= rating) {
          star.classList.add("active")
        } else {
          star.classList.remove("active")
        }
      })
    }

    // Initial star highlight
    highlightStars(5)

    // Add to cart button
    const addToCartBtn = document.getElementById("enhanced-add-to-cart")

    addToCartBtn.addEventListener("click", () => {
      addEnhancedProductToCart()
    })

    // Buy now button
    const buyNowBtn = document.getElementById("enhanced-buy-now-btn")

    buyNowBtn.addEventListener("click", () => {
      const success = addEnhancedProductToCart()
      if (success) {
        // Redirect to checkout page
        window.location.href = "cart.html"
      }
    })

    // Review form submission
    const reviewForm = document.getElementById("review-form")
    const reviewSuccess = modal.querySelector(".review-success-message")

    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(reviewForm)
      const reviewData = {
        productId: formData.get("productId"),
        productName: formData.get("productName"),
        name: formData.get("name"),
        email: formData.get("email"),
        rating: formData.get("rating"),
        comment: formData.get("comment"),
        date: new Date().toLocaleDateString(),
      }

      // Send review data to website owner
      sendReviewToOwner(reviewData)

      // Show success message
      reviewSuccess.style.display = "block"

      // Reset form
      reviewForm.reset()
      setTimeout(() => {
        reviewSuccess.style.display = "none"
      }, 3000)
    })
  }

  // Function to send review to website owner
  function sendReviewToOwner(reviewData) {
    // Store review in localStorage for demonstration purposes
    // In a real application, you would send this data to a server
    const storedReviews = JSON.parse(localStorage.getItem("productReviews")) || {}

    if (!storedReviews[reviewData.productId]) {
      storedReviews[reviewData.productId] = []
    }

    storedReviews[reviewData.productId].push(reviewData)
    localStorage.setItem("productReviews", JSON.stringify(storedReviews))

    // Email functionality would be implemented here in a real scenario
    console.log("Review submitted:", reviewData)

    // Optional: You could also use a service like EmailJS or a simple form submission service
    // For example:
    /*
    emailjs.send("service_id", "template_id", {
      product_id: reviewData.productId,
      product_name: reviewData.productName,
      name: reviewData.name,
      email: reviewData.email,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: reviewData.date
    });
    */
  }

  // Function to add product to cart from enhanced modal
  function addEnhancedProductToCart() {
    // Get selected size
    const selectedSize = document.querySelector("#enhanced-product-modal .size-option.selected")
    const sizeError = document.getElementById("enhanced-size-error")

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
    const productName = document.getElementById("enhanced-product-name").textContent
    const productPrice = Number.parseFloat(
      document.getElementById("enhanced-product-price").textContent.replace("$", ""),
    )
    const productImage = document.getElementById("enhanced-product-img").src
    const productSize = selectedSize.getAttribute("data-size")
    const productQuantity = Number.parseInt(document.getElementById("enhanced-quantity-value").value)

    // Create product object
    const product = {
      id: "product-" + Date.now(),
      name: productName,
      price: productPrice,
      image: productImage,
      size: productSize,
      quantity: productQuantity,
    }

    // Add to cart using existing function or fallback
    if (typeof window.addToCart === "function") {
      window.addToCart(product)
    } else {
      // Fallback if addToCart function is not available
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

      // Check if item already exists with same size
      const existingItemIndex = cartItems.findIndex((item) => item.name === product.name && item.size === product.size)

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
    const modal = document.getElementById("enhanced-product-modal")
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

  // Function to show enhanced product detail
  function showEnhancedProductDetail(product) {
    const modal = document.getElementById("enhanced-product-modal")
    if (!modal) return

    // Set product details
    document.getElementById("enhanced-product-name").textContent = product.name
    document.getElementById("enhanced-product-price").textContent = `$${product.price.toFixed(2)}`
    document.getElementById("enhanced-product-img").src = product.image

    // Set product description
    const description =
      product.description ||
      `Experience premium comfort and style with the ${product.name}. Featuring the latest in shoe technology, these versatile shoes are perfect for any occasion.`
    document.getElementById("enhanced-product-description").textContent = description

    // Set extended description
    const extendedDesc = generateExtendedDescription(product)
    document.getElementById("extended-description").innerHTML = extendedDesc

    // Set specifications
    const specs = generateSpecifications(product)
    document.getElementById("product-weight").textContent = specs.weight
    document.getElementById("product-drop").textContent = specs.drop
    document.getElementById("product-arch").textContent = specs.arch
    document.getElementById("product-closure").textContent = specs.closure
    document.getElementById("product-terrain").textContent = specs.terrain

    // Set product ID in review form
    document.getElementById("review-product-id").value = product.id || `product-${Date.now()}`
    document.getElementById("review-product-name").value = product.name

    // Load existing reviews if available
    loadProductReviews(product.id)

    // Reset size selection
    const sizeOptions = modal.querySelectorAll(".size-option")
    sizeOptions.forEach((option) => option.classList.remove("selected"))

    // Reset quantity
    document.getElementById("enhanced-quantity-value").value = 1

    // Reset active tab
    const tabButtons = modal.querySelectorAll(".tab-button")
    const tabPanels = modal.querySelectorAll(".tab-panel")

    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabPanels.forEach((panel) => panel.classList.remove("active"))

    // Set first tab as active
    tabButtons[0].classList.add("active")
    tabPanels[0].classList.add("active")

    // Show modal
    modal.style.display = "block"
  }

  // Function to load product reviews
  function loadProductReviews(productId) {
    const reviewsContainer = document.getElementById("reviews-container")
    if (!reviewsContainer) return

    // Clear existing reviews except the sample ones
    const existingReviews = reviewsContainer.querySelectorAll(".review-item:not(.sample)")
    existingReviews.forEach((review) => review.remove())

    // Get stored reviews
    const storedReviews = JSON.parse(localStorage.getItem("productReviews")) || {}
    const productReviews = storedReviews[productId] || []

    if (productReviews.length > 0) {
      // Remove sample reviews
      reviewsContainer.innerHTML = ""

      // Add actual reviews
      productReviews.forEach((review) => {
        const reviewItem = document.createElement("div")
        reviewItem.className = "review-item"

        // Create star rating HTML
        let starsHtml = ""
        for (let i = 1; i <= 5; i++) {
          if (i <= review.rating) {
            starsHtml += `<span class="star filled">★</span>`
          } else {
            starsHtml += `<span class="star">★</span>`
          }
        }

        reviewItem.innerHTML = `
          <div class="review-header">
            <div class="review-author">${review.name}</div>
            <div class="review-date">${review.date}</div>
            <div class="review-rating">
              ${starsHtml}
            </div>
          </div>
          <div class="review-content">${review.comment}</div>
        `

        reviewsContainer.appendChild(reviewItem)
      })
    }
  }

  // Helper function to generate extended description based on product type
  function generateExtendedDescription(product) {
    const name = product.name
    const lowerName = name.toLowerCase()

    // Default description for all shoes
    let extendedDesc = `The ${name} combines innovative design with premium materials to deliver exceptional comfort and style. Whether you're looking for performance or fashion, these versatile shoes are crafted to exceed your expectations.`

    // Add specific details based on shoe type
    if (lowerName.includes("running") || lowerName.includes("runner")) {
      extendedDesc += ` Engineered specifically for runners, these shoes feature responsive cushioning that absorbs impact while returning energy with each stride, making your runs feel effortless.`
    } else if (lowerName.includes("basketball") || lowerName.includes("jordan")) {
      extendedDesc += ` Designed for the court, these basketball shoes offer excellent ankle support and traction to help you dominate the game with confidence and style.`
    } else if (lowerName.includes("casual") || lowerName.includes("lifestyle")) {
      extendedDesc += ` Perfect for everyday wear, these casual shoes combine comfort and style for a versatile addition to your wardrobe that pairs well with any outfit.`
    } else if (lowerName.includes("training") || lowerName.includes("workout")) {
      extendedDesc += ` Built for intense training sessions, these workout shoes provide stability and support for a variety of exercises, helping you perform at your best.`
    }

    return extendedDesc
  }

  // Helper function to generate specifications based on product type
  function generateSpecifications(product) {
    const name = product.name
    const lowerName = name.toLowerCase()

    // Default specifications
    let specs = {
      weight: "10.5 oz (298 g)",
      drop: "10mm",
      arch: "Neutral",
      closure: "Lace-up",
      terrain: "Multiple surfaces",
    }

    // Customize based on shoe type
    if (lowerName.includes("running") || lowerName.includes("runner")) {
      specs = {
        weight: "8.5 oz (241 g)",
        drop: "8mm",
        arch: "Neutral",
        closure: "Lace-up",
        terrain: "Road, Track",
      }
    } else if (lowerName.includes("basketball") || lowerName.includes("jordan")) {
      specs = {
        weight: "13.2 oz (374 g)",
        drop: "10mm",
        arch: "Medium",
        closure: "Lace-up with strap",
        terrain: "Indoor court, Outdoor court",
      }
    } else if (lowerName.includes("casual") || lowerName.includes("lifestyle")) {
      specs = {
        weight: "11.0 oz (312 g)",
        drop: "6mm",
        arch: "Neutral",
        closure: "Lace-up",
        terrain: "Everyday wear, Urban",
      }
    } else if (lowerName.includes("training") || lowerName.includes("workout")) {
      specs = {
        weight: "10.8 oz (306 g)",
        drop: "4mm",
        arch: "Medium to High",
        closure: "Lace-up",
        terrain: "Gym, Indoor training",
      }
    }

    return specs
  }

  // Add styles for the enhanced modal
  function addEnhancedModalStyles() {
    const style = document.createElement("style")
    style.textContent = `
      /* Enhanced Product Modal Styles */
      .enhanced-product-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 2000;
        overflow-y: auto;
      }
      
      .enhanced-product-content {
        background: white;
        margin: 30px auto;
        width: 90%;
        max-width: 1200px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        position: relative;
      }
      
      .close-enhanced-product {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 28px;
        font-weight: bold;
        color: #777;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 10;
      }
      
      .close-enhanced-product:hover {
        color: #333;
      }
      
      .enhanced-product-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
      }
      
      @media (max-width: 992px) {
        .enhanced-product-grid {
          grid-template-columns: 1fr;
        }
      }
      
      /* Enhanced Product Image */
      .enhanced-product-image-container {
        background: #f8f9fa;
        position: relative;
        height: 100%;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .enhanced-product-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 30px;
      }
      
      .enhanced-product-image img {
        max-width: 100%;
        max-height: 90%;
        object-fit: contain;
        transition: transform 0.5s ease;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
      }
      
      .enhanced-product-image:hover img {
        transform: scale(1.05);
      }
      
      /* Enhanced Product Info */
      .enhanced-product-info {
        padding: 40px;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
      }
      
      .enhanced-product-name {
        font-size: 2.2rem;
        font-weight: 600;
        margin-bottom: 10px;
        color: #212529;
      }
      
      .enhanced-product-price {
        font-size: 1.8rem;
        font-weight: 700;
        color: #212529;
        margin-bottom: 20px;
      }
      
      .enhanced-product-description {
        color: #6c757d;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      
      /* Tabs */
      .enhanced-product-tabs {
        margin-bottom: 30px;
      }
      
      .tab-buttons {
        display: flex;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 20px;
      }
      
      .tab-button {
        padding: 10px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: #6c757d;
        transition: all 0.3s ease;
      }
      
      .tab-button:hover {
        color: #212529;
      }
      
      .tab-button.active {
        color: #212529;
        border-bottom: 2px solid #ff4d00;
      }
      
      .tab-panel {
        display: none;
      }
      
      .tab-panel.active {
        display: block;
      }
      
      #extended-description {
        line-height: 1.8;
        color: #495057;
      }
      
      .specs-list {
        list-style: none;
        padding: 0;
      }
      
      .specs-list li {
        padding: 8px 0;
        border-bottom: 1px solid #f1f1f1;
      }
      
      .specs-list li:last-child {
        border-bottom: none;
      }
      
      /* Size Selection */
      .enhanced-product-sizes {
        margin-bottom: 20px;
      }
      
      .size-label {
        font-weight: 600;
        margin-bottom: 10px;
        color: #212529;
      }
      
      .size-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .size-option {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .size-option:hover {
        border-color: #212529;
      }
      
      .size-option.selected {
        background-color: #212529;
        color: white;
        border-color: #212529;
      }
      
      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 10px;
        display: none;
      }
      
      .error-message.show {
        display: block;
      }
      
      /* Quantity Selector */
      .quantity-selector {
        margin-bottom: 30px;
      }
      
      .quantity-controls {
        display: flex;
        align-items: center;
        max-width: 120px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 10px;
      }
      
      .quantity-btn {
        width: 36px;
        height: 36px;
        background: #f8f9fa;
        border: none;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .quantity-value {
        width: 40px;
        height: 36px;
        border: none;
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;
        text-align: center;
        font-size: 14px;
      }
      
      /* Product Features */
      .enhanced-product-features {
        margin-bottom: 30px;
      }
      
      .feature-list {
        list-style: none;
        padding: 0;
      }
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #495057;
      }
      
      /* Action Buttons */
      .enhanced-product-actions {
        display: flex;
        gap: 15px;
        margin-top: auto;
      }
      
      .buy-now-btn, .add-to-cart-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
        flex: 1;
      }
      
      .buy-now-btn {
        background-color: #ff4d00;
        color: white;
      }
      
      .buy-now-btn:hover {
        background-color: #e64500;
      }
      
      .add-to-cart-btn {
        background-color: white;
        color: #212529;
        border: 1px solid #212529;
      }
      
      .add-to-cart-btn:hover {
        background-color: #f8f9fa;
      }
      
      /* Reviews Tab Styles */
      .reviews-container {
        margin-bottom: 30px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .review-item {
        padding: 15px;
        border-bottom: 1px solid #f1f1f1;
      }
      
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      
      .review-author {
        font-weight: 600;
        color: #212529;
      }
      
      .review-date {
        color: #6c757d;
        font-size: 0.875rem;
      }
      
      .review-rating {
        display: flex;
      }
      
      .star {
        color: #d5d5d5;
        font-size: 1.25rem;
      }
      
      .star.filled {
        color: #ffc107;
      }
      
      .review-content {
        line-height: 1.6;
        color: #495057;
      }
      
      /* Write Review Form */
      .write-review-container {
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
      }
      
      .write-review-container h4 {
        margin-bottom: 15px;
        color: #212529;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #212529;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 1rem;
      }
      
      .rating-selector {
        display: flex;
        gap: 5px;
      }
      
      .rating-star {
        font-size: 1.5rem;
        color: #d5d5d5;
        cursor: pointer;
        transition: color 0.3s ease;
      }
      
      .rating-star:hover,
      .rating-star.active {
        color: #ffc107;
      }
      
      .submit-review-btn {
        background-color: #ff4d00;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .submit-review-btn:hover {
        background-color: #e64500;
      }
      
      .review-success-message {
        display: none;
        padding: 15px;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
        margin-top: 15px;
      }
      
      /* Responsive Adjustments */
      @media (max-width: 992px) {
        .enhanced-product-image-container {
          min-height: 400px;
        }
        
        .enhanced-product-info {
          padding: 30px;
        }
        
        .enhanced-product-name {
          font-size: 1.8rem;
        }
        
        .enhanced-product-actions {
          flex-direction: column;
        }
      }
      
      @media (max-width: 768px) {
        .enhanced-product-content {
          margin: 0;
          width: 100%;
          height: 100%;
          border-radius: 0;
        }
        
        .tab-buttons {
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 10px;
        }
      }
    `

    document.head.appendChild(style)
  }
  
})