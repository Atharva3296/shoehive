document.addEventListener("DOMContentLoaded", () => {
  // Tab Switcher (Login/Signup)
  const tabButtons = document.querySelectorAll(".tab-button")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")

  if (tabButtons.length > 0 && loginForm && signupForm) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        if (button.dataset.tab === "login") {
          loginForm.classList.add("active")
          signupForm.classList.remove("active")
        } else {
          signupForm.classList.add("active")
          loginForm.classList.remove("active")
        }
      })
    })
  }

  
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  const cartCount = document.querySelector(".cart-count")
  const cartAmount = document.querySelector(".cart-amount")

  
  function updateCartDisplay() {
    if (cartCount && cartAmount) {
      
      let totalItems = 0
      cartItems.forEach((item) => {
        totalItems += item.quantity || 1
      })
      cartCount.textContent = totalItems

      
      const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
      cartAmount.textContent = `$${total.toFixed(2)}`

      
      localStorage.setItem("cartItems", JSON.stringify(cartItems))

      console.log("Cart updated:", cartItems) // Debug log
    }
  }

  // Initialize cart display
  updateCartDisplay()

  
  function showNotification(message) {
    
    let notification = document.querySelector(".cart-notification")
    if (!notification) {
      notification = document.createElement("div")
      notification.className = "cart-notification"
      document.body.appendChild(notification)
    }

    
    notification.textContent = message
    notification.classList.add("show")

    
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }

  
  function addToCart(product) {
    if (!product) return

    
    const variantId = `${product.id}-${product.size || "default"}-${product.color || "default"}`

   
    const existingItemIndex = cartItems.findIndex((item) => item.variantId === variantId)

    if (existingItemIndex !== -1) {
     
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + (product.quantity || 1)
    } else {
      
      const item = {
        id: product.id,
        variantId: variantId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size,
        color: product.color,
        quantity: product.quantity || 1,
      }
      cartItems.push(item)
    }

    
    updateCartDisplay()

    
    let notificationText = `${product.name}`
    if (product.size) notificationText += ` (Size ${product.size})`
    if (product.color) notificationText += ` (${product.color})`
    notificationText += ` added to cart!`

    showNotification(notificationText)
  }

  
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling

        
        const productCard = this.closest(".product-card")
        if (!productCard) return

        const productName = productCard.querySelector("h3")?.textContent || "Product"
        const productPriceText = productCard.querySelector(".product-price")?.textContent || "$0"
        const productPrice = Number.parseFloat(productPriceText.replace("$", "")) || 0
        const productImage =
          productCard.querySelector(".product-image img")?.src || "/placeholder.svg?height=200&width=200"

        
        const product = {
          id: Date.now().toString(), // unique ID
          name: productName,
          price: productPrice,
          image: productImage,
        }

       
        addToCart(product)
      })
    })
  }

  // Image Slider
  const sliderTrack = document.querySelector(".slider-track")
  const slides = document.querySelectorAll(".slide")
  const prevButton = document.querySelector(".slider-nav.prev")
  const nextButton = document.querySelector(".slider-nav.next")
  const dotsContainer = document.querySelector(".slider-dots")

  if (sliderTrack && slides.length > 0) {
    let currentIndex = 0
    let slideWidth = 0
    let slidesPerView = 1
    let autoplayInterval = null
    const autoplayDelay = 5000

    function createDots() {
      if (!dotsContainer) return

      dotsContainer.innerHTML = ""
      const totalDots = Math.ceil(slides.length / slidesPerView)

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div")
        dot.classList.add("dot")
        if (i === currentIndex) {
          dot.classList.add("active")
        }

        dot.addEventListener("click", () => {
          goToSlide(i)
        })

        dotsContainer.appendChild(dot)
      }
    }

    function updateDots() {
      if (!dotsContainer) return

      const dots = document.querySelectorAll(".dot")
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }

    function calculateSlidesPerView() {
      if (window.innerWidth >= 992) return 3
      else if (window.innerWidth >= 768) return 2
      else return 1
    }

    function calculateDimensions() {
      slidesPerView = calculateSlidesPerView()
      slideWidth = sliderTrack.parentElement.clientWidth / slidesPerView

      slides.forEach((slide) => {
        slide.style.minWidth = `${slideWidth}px`
        slide.style.maxWidth = `${slideWidth}px`
      })

      updateSliderPosition()
      createDots()
    }

    function goToSlide(index) {
      const maxIndex = Math.ceil(slides.length / slidesPerView) - 1
      currentIndex = index < 0 ? maxIndex : index > maxIndex ? 0 : index
      updateSliderPosition()
      updateDots()
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
        startAutoplay()
      }
    }

    function updateSliderPosition() {
      const position = -currentIndex * (slideWidth * slidesPerView)
      sliderTrack.style.transform = `translateX(${position}px)`
    }

    function nextSlide() {
      goToSlide(currentIndex + 1)
    }

    function prevSlide() {
      goToSlide(currentIndex - 1)
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, autoplayDelay)
    }

    function initSlider() {
      calculateDimensions()

      if (nextButton) {
        nextButton.addEventListener("click", nextSlide)
      }

      if (prevButton) {
        prevButton.addEventListener("click", prevSlide)
      }

      window.addEventListener("resize", calculateDimensions)

      let touchStartX = 0,
        touchEndX = 0
      sliderTrack.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX
        },
        { passive: true },
      )
      sliderTrack.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX
          handleSwipe()
        },
        { passive: true },
      )

      function handleSwipe() {
        const swipeThreshold = 50
        if (touchStartX - touchEndX > swipeThreshold) nextSlide()
        else if (touchEndX - touchStartX > swipeThreshold) prevSlide()
      }

      sliderTrack.addEventListener("mouseenter", () => clearInterval(autoplayInterval))
      sliderTrack.addEventListener("mouseleave", startAutoplay)
    }

    initSlider()
  }

  // Product Database
  const products = {
    adidas: {
      mens: [
        {
          id: "m1",
          name: "Running Shoes",
          price: 180,
          image: "adidas-menrun.webp",
          description: "Premium running shoes for maximum comfort.",
        },
        {
          id: "m2",
          name: "Puma Atlas",
          price: 90,
          image: "pumaatlas.webp",
          description: "Classic shell-toe sneakers with iconic design for men.",
        },
        {
          id: "m3",
          name: "Adidas D-Rose",
          price: 160,
          image: "basketball.jpeg",
          description:
            "Experience premium comfort and style with the Adidas D-Rose. Featuring the latest in shoe technology, these versatile shoes are perfect for any occasion.",
          details: {
            specifications: "Innovative design with premium materials for exceptional comfort and style.",
            materials: "High-quality synthetic leather, rubber outsole.",
            careInstructions: "Wipe clean with a damp cloth.",
          },
          colors: ["Red", "Blue", "Green", "Yellow", "Purple", "Black"],
          sizes: [7, 8, 9, 10, 11, 12],
          features: ["Premium quality materials", "Comfortable cushioning", "Durable construction"],
        },
      ],
      womens: [
        {
          id: "w1",
          name: "Casual Sneaker",
          price: 70,
          image: "casual-sneaker.webp",
          description: "Comfortable casual sneakers for women.",
        },
        {
          id: "w2",
          name: "Adidas D-Rose Women",
          price: 85,
          image: "Adidas-Rose-womens.jpeg",
          description: "Classic basketball shoes for women.",
        },
        {
          id: "w3",
          name: "Walking sneaker shoes",
          price: 95,
          image: "stylish-sports.webp",
          description:
            "Experience premium comfort and style with the Adidas W-ROSE. Featuring the latest in shoe technology, these versatile shoes are perfect for any occasion.",
          details: {
            specifications: "Innovative design with premium materials for exceptional comfort and style.",
            materials: "High-quality synthetic leather, rubber outsole.",
            careInstructions: "Wipe clean with a damp cloth.",
          },
        },
      ],
      kids: [
        {
          id: "k1",
          name: "Crocs Kids Bayaband Clog",
          price: 50,
          image: "kidscrocs.webp",
          description: "Durable running shoes for kids.",
        },
        {
          id: "k2",
          name: "Adidas Kids superstar Faux",
          price: 45,
          image: "adidas-kids.jpg",
          description: "Classic tennis-inspired shoes for kids.",
        },
      ],
    },

    nike: {
      mens: [
        {
          id: "nm1",
          name: "Jordan Air 1",
          price: 170,
          image: "jordan-air.webp",
          description: "Iconic Air Max cushioning for maximum comfort.",
        },
        {
          id: "nm2",
          name: "Nike Air Force 1 Men",
          price: 100,
          image: "nikeairforce.webp",
          description: "Classic basketball-inspired sneakers for men.",
        },
      ],
      womens: [
        {
          id: "nw1",
          name: "Nike React Women",
          price: 130,
          image: "nikereact.webp",
          description: "Responsive React foam for women runners.",
        },
        {
          id: "nw2",
          name: "Nike Zoom Women",
          price: 120,
          image: "nikezoom.webp",
          description: "Fast and responsive running shoes for women.",
        },
      ],
      kids: [
        {
          id: "nk1",
          name: "Nike Revolution Kids",
          price: 55,
          image: "nikerevolution.webp",
          description: "Lightweight running shoes for kids.",
        },
        {
          id: "nk2",
          name: "Nike Team Hustle Kids",
          price: 50,
          image: "teamhustle.webp",
          description: "Basketball-inspired shoes for kids.",
        },
      ],
    },

    puma: {
      mens: [
        {
          id: "pm1",
          name: "Puma RS-X Men",
          price: 110,
          image: "pumarrxxmen.jpeg",
          description: "Bold retro-inspired design for men.",
        },
        {
          id: "pm2",
          name: "Puma Suede Men",
          price: 70,
          image: "suede.webp",
          description: "Classic suede sneakers for men.",
        },
      ],
      womens: [
        {
          id: "pw1",
          name: "Puma Cali Women",
          price: 80,
          image: "pumacali.webp",
          description: "Tennis-inspired sneakers for women.",
        },
        {
          id: "pw2",
          name: "Puma Mayze Women",
          price: 90,
          image: "pumamayze.webp",
          description: "Platform sneakers for women.",
        },
      ],
      kids: [
        {
          id: "pk1",
          name: "Puma Racer Kids",
          price: 45,
          image: "pumaracerkids.jpg",
          description: "Classic running-inspired shoes for kids.",
        },
        {
          id: "pk2",
          name: "Puma Smash Kids",
          price: 40,
          image: "pumasmash.webp",
          description: "Tennis-inspired shoes for kids.",
        },
      ],
    },

    bata: {
      mens: [
        {
          id: "bm1",
          name: "Bata Running Shoes",
          price: 60,
          image: "batarunning.webp",
          description: "Comfortable formal shoes for men.",
        },
        {
          id: "bm2",
          name: "Bata Sports Shoes",
          price: 55,
          image: "batasports.webp",
          description: "Athletic-inspired casual shoes for men.",
        },
      ],
      womens: [
        {
          id: "bw1",
          name: "Bata Mesh Casual",
          price: 50,
          image: "batamesh.webp",
          description: "Stylish comfort shoes for women.",
        },
        {
          id: "bw2",
          name: "Bata Canvas Shoes",
          price: 45,
          image: "batacanvas.webp",
          description: "Fashion-forward casual shoes for women.",
        },
      ],
      kids: [
        {
          id: "bk1",
          name: "Bata Bubblegummers Kids",
          price: 35,
          image: "bata_bubblegummers.jpeg",
          description: "Fun and comfortable shoes for kids.",
        },
        {
          id: "bk2",
          name: "Bata Power Kids",
          price: 40,
          image: "bata_power_kids.jpeg",
          description: "Durable school shoes for kids.",
        },
      ],
    },
  }

  
  let currentBrand = ""
  let currentCategory = ""

  
  const brandSquares = document.querySelectorAll(".brand-square")
  const categoriesSection = document.getElementById("categories-section")
  const productsSection = document.getElementById("products-section")
  const categoryCards = document.querySelectorAll(".category-card")
  const selectedBrandTitle = document.getElementById("selected-brand")
  const brandNameSpan = document.getElementById("brand-name")
  const categoryNameSpan = document.getElementById("category-name")
  const closeCategoriesBtn = document.getElementById("close-categories")
  const closeProductsBtn = document.getElementById("close-products")
  const productsGrid = document.getElementById("products-grid")
  const modal = document.getElementById("product-modal")
  const modalBody = document.getElementById("modal-body")
  const closeModal = document.querySelector(".close-modal")

  
  function showProductModal(product) {
    if (modalBody && modal) {
      // Define available sizes and colors
      const sizes = product.sizes || [7, 8, 9, 10, 11, 12]
      const colors = product.colors || ["Red", "Blue", "Green", "Yellow", "Purple", "Black"]

      
      let sizeOptionsHTML = ""
      sizes.forEach((size) => {
        sizeOptionsHTML += `<div class="size-option" data-size="${size}">${size}</div>`
      })

      
      let colorOptionsHTML = ""
      colors.forEach((color) => {
        const colorClass = color.toLowerCase()
        colorOptionsHTML += `<div class="color-option color-${colorClass}" data-color="${color}">${color}</div>`
      })

      modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="color-overlay" id="color-overlay"></div>
            </div>
            <div class="modal-details">
                <h2>${product.name}</h2>
                <div class="modal-price">$${product.price}</div>
                <p class="modal-description">${product.description || "No description available."}</p>
                
                <div class="product-sizes">
                    <h4>Select Size:</h4>
                    <div class="size-options">
                        ${sizeOptionsHTML}
                    </div>
                    <div class="size-error">Please select a size</div>
                </div>
                
                <div class="product-colors">
                    <h4>Select Color:</h4>
                    <div class="color-options">
                        ${colorOptionsHTML}
                    </div>
                </div>
                
                <div class="product-quantity">
                    <h4>Quantity:</h4>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">-</button>
                        <input type="text" class="quantity-input" value="1" readonly>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="buy-now-btn">Buy Now</button>
                    <button class="add-to-cart-modal">Add to Cart</button>
                </div>
            </div>
        `

      
      if (!document.getElementById("enhanced-modal-styles")) {
        const style = document.createElement("style")
        style.id = "enhanced-modal-styles"
        style.textContent = `
                .modal-image {
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                }
                
                .color-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    mix-blend-mode: multiply;
                }
                
                .product-sizes, .product-colors, .product-quantity {
                    margin-top: 15px;
                }
                
                .product-sizes h4, .product-colors h4, .product-quantity h4 {
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }
                
                .size-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .size-option {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .size-option:hover {
                    border-color: #333;
                }
                
                .size-option.selected {
                    background-color: #333;
                    color: white;
                    border-color: #333;
                }
                
                .size-error {
                    color: red;
                    font-size: 12px;
                    margin-top: 5px;
                    display: none;
                }
                
                .color-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .color-option {
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    border: 2px solid transparent;
                    background-color: #f5f5f5;
                }
                
                .color-option:hover {
                    transform: scale(1.05);
                }
                
                .color-option.selected {
                    border-color: #333;
                    transform: scale(1.05);
                }
                
                .color-red { color: #e74c3c; }
                .color-blue { color: #3498db; }
                .color-green { color: #2ecc71; }
                .color-yellow { color: #f1c40f; }
                .color-purple { color: #9b59b6; }
                .color-black { color: #333; }
                
                .quantity-selector {
                    display: flex;
                    align-items: center;
                    max-width: 120px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .quantity-btn {
                    width: 36px;
                    height: 36px;
                    background: #f5f5f5;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .quantity-input {
                    width: 40px;
                    height: 36px;
                    border: none;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    text-align: center;
                    font-size: 14px;
                }
                
                .product-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .buy-now-btn, .add-to-cart-modal {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .buy-now-btn {
                    background-color: #ff4d00;
                    color: white;
                    flex: 1;
                }
                
                .buy-now-btn:hover {
                    background-color: #e64500;
                }
                
                .add-to-cart-modal {
                    background-color: white;
                    color: #333;
                    border: 1px solid #333;
                    flex: 1;
                }
                
                .add-to-cart-modal:hover {
                    background-color: #f5f5f5;
                }
                
                @media (max-width: 768px) {
                    .product-actions {
                        flex-direction: column;
                    }
                }
            `
        document.head.appendChild(style)
      }

      modal.style.display = "block"

      // Add event listeners for the modal elements
      const sizeOptions = modal.querySelectorAll(".size-option")
      const colorOptions = modal.querySelectorAll(".color-option")
      const quantityMinus = modal.querySelector(".quantity-btn.minus")
      const quantityPlus = modal.querySelector(".quantity-btn.plus")
      const quantityInput = modal.querySelector(".quantity-input")
      const addToCartBtn = modal.querySelector(".add-to-cart-modal")
      const buyNowBtn = modal.querySelector(".buy-now-btn")
      const sizeError = modal.querySelector(".size-error")
      const colorOverlay = modal.querySelector("#color-overlay")

      // Size selection
      sizeOptions.forEach((option) => {
        option.addEventListener("click", function () {
          sizeOptions.forEach((opt) => opt.classList.remove("selected"))
          this.classList.add("selected")
          if (sizeError.style.display === "block") {
            sizeError.style.display = "none"
          }
        })
      })

      // Color selection
      colorOptions.forEach((option) => {
        option.addEventListener("click", function () {
          colorOptions.forEach((opt) => opt.classList.remove("selected"))
          this.classList.add("selected")

          // Apply color overlay to the product image
          const color = this.getAttribute("data-color")
          applyColorOverlay(colorOverlay, color)
        })
      })

      
      if (colorOptions.length > 0) {
        colorOptions[0].classList.add("selected")
        const defaultColor = colorOptions[0].getAttribute("data-color")
        applyColorOverlay(colorOverlay, defaultColor)
      }

      
      if (quantityMinus) {
        quantityMinus.addEventListener("click", () => {
          const quantity = Number.parseInt(quantityInput.value)
          if (quantity > 1) {
            quantityInput.value = quantity - 1
          }
        })
      }

      if (quantityPlus) {
        quantityPlus.addEventListener("click", () => {
          const quantity = Number.parseInt(quantityInput.value)
          quantityInput.value = quantity + 1
        })
      }

      
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
          const selectedSize = modal.querySelector(".size-option.selected")

          if (!selectedSize) {
            sizeError.style.display = "block"
            return
          }

          const selectedColor = modal.querySelector(".color-option.selected")
          const quantity = Number.parseInt(quantityInput.value)
          const size = selectedSize.getAttribute("data-size")
          const color = selectedColor ? selectedColor.getAttribute("data-color") : null

          
          const productToAdd = {
            ...product,
            size: size,
            color: color,
            quantity: quantity,
          }

          // Add to cart
          addToCart(productToAdd)

          
          modal.style.display = "none"
        })
      }

      
      if (buyNowBtn) {
        buyNowBtn.addEventListener("click", () => {
          const selectedSize = modal.querySelector(".size-option.selected")

          if (!selectedSize) {
            sizeError.style.display = "block"
            return
          }

          const selectedColor = modal.querySelector(".color-option.selected")
          const quantity = Number.parseInt(quantityInput.value)
          const size = selectedSize.getAttribute("data-size")
          const color = selectedColor ? selectedColor.getAttribute("data-color") : null

          
          const productToAdd = {
            ...product,
            size: size,
            color: color,
            quantity: quantity,
          }

          // Add to cart
          addToCart(productToAdd)

          // Redirect to checkout
          window.location.href = "cart.html"
        })
      }
    }
  }

  // Helper function to apply color overlay to product image
  function applyColorOverlay(overlayElement, color) {
    if (!overlayElement) return

    const colorMap = {
      Red: "rgba(231, 76, 60, 0.5)",
      Blue: "rgba(52, 152, 219, 0.5)",
      Green: "rgba(46, 204, 113, 0.5)",
      Yellow: "rgba(241, 196, 15, 0.5)",
      Purple: "rgba(155, 89, 182, 0.5)",
      Black: "rgba(0, 0, 0, 0.5)",
    }

    overlayElement.style.backgroundColor = colorMap[color] || "transparent"
    overlayElement.style.opacity = "1"
  }

  // Check if we're on the shop page
  if (brandSquares.length > 0 && categoriesSection && productsSection) {
    // Event Listeners
    brandSquares.forEach((square) => {
      square.addEventListener("click", () => {
        const brand = square.getAttribute("data-brand")
        showCategories(brand)
      })
    })

    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.getAttribute("data-category")
        showProducts(currentBrand, category)
      })
    })

    if (closeCategoriesBtn) {
      closeCategoriesBtn.addEventListener("click", () => {
        categoriesSection.classList.remove("active")
      })
    }

    if (closeProductsBtn) {
      closeProductsBtn.addEventListener("click", () => {
        productsSection.classList.remove("active")
        categoriesSection.classList.add("active")
      })
    }

    if (closeModal) {
      closeModal.addEventListener("click", () => {
        modal.style.display = "none"
      })
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })

    // Show Categories Function
    function showCategories(brand) {
      currentBrand = brand
      if (selectedBrandTitle) {
        selectedBrandTitle.textContent = brand.toUpperCase()
      }
      categoriesSection.classList.add("active")
      productsSection.classList.remove("active")
    }

    // Show Products Function
    function showProducts(brand, category) {
      currentCategory = category
      if (brandNameSpan) {
        brandNameSpan.textContent = brand.toUpperCase()
      }
      if (categoryNameSpan) {
        categoryNameSpan.textContent = category.toUpperCase()
      }

      if (productsGrid) {
        productsGrid.innerHTML = ""
        const brandProducts = products[brand][category]

        brandProducts.forEach((product) => {
          const productCard = document.createElement("div")
          productCard.className = "product-card"
          productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-actions">
                        <button class="view-details-btn">View Details</button>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `

          // Add event listener for the view details button
          const viewDetailsBtn = productCard.querySelector(".view-details-btn")
          if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener("click", (e) => {
              e.preventDefault()
              e.stopPropagation()
              showProductModal(product)
            })
          }

          // Add event listener for the add to cart button
          const addToCartBtn = productCard.querySelector(".add-to-cart")
          if (addToCartBtn) {
            addToCartBtn.addEventListener("click", (e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(product)
            })
          }

          // Add event listener for the entire card to show modal
          productCard.addEventListener("click", (e) => {
            // Don't show modal if clicking the buttons
            if (e.target.classList.contains("add-to-cart") || e.target.classList.contains("view-details-btn")) {
              return
            }
            showProductModal(product)
          })

          productsGrid.appendChild(productCard)
        })

        categoriesSection.classList.remove("active")
        productsSection.classList.add("active")
      }
    }
  }

  // Create cart page link
  const cartIcon = document.querySelector(".cart")
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html"
    })
  }

  // Function to display all products
  function displayAllProducts() {
    const productContainer = document.createElement("div")
    productContainer.id = "all-products-container"
    productContainer.className = "products-grid"

    // Create a header
    const header = document.createElement("h2")
    header.textContent = "All Products"
    header.className = "all-products-header"

    // Create a container for the products and product details
    const allProductsSection = document.createElement("div")
    allProductsSection.className = "all-products-section"

    // Create a container for product details that will be initially hidden
    const productDetailsContainer = document.createElement("div")
    productDetailsContainer.id = "shop-product-details"
    productDetailsContainer.className = "shop-product-details"
    productDetailsContainer.style.display = "none"

    // Add the header and containers to the section
    allProductsSection.appendChild(header)
    allProductsSection.appendChild(productContainer)
    allProductsSection.appendChild(productDetailsContainer)

    // Add a close button
    const closeBtn = document.createElement("button")
    closeBtn.className = "close-btn"
    closeBtn.innerHTML = "&times;"
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(allProductsSection)
    })

    // Add a back button to return to home page
    const backBtn = document.createElement("button")
    backBtn.className = "back-btn"
    backBtn.innerHTML = "Back to Home"
    backBtn.addEventListener("click", () => {
      window.location.href = "/"
    })

    allProductsSection.appendChild(closeBtn)
    allProductsSection.appendChild(backBtn)

    // Loop through all brands and categories to display all products
    for (const brand in products) {
      for (const category in products[brand]) {
        products[brand][category].forEach((product) => {
          const productCard = document.createElement("div")
          productCard.className = "product-card"
          productCard.setAttribute("data-product-id", product.id)

          productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-brand-category">${brand.toUpperCase()} - ${category.toUpperCase()}</p>
            <div class="product-price">$${product.price}</div>
            <button class="view-details-btn">View Details</button>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        `

          // Add event listener for the entire card
          productCard.addEventListener("click", (e) => {
            // Don't show details if clicking the add to cart button
            if (e.target.classList.contains("add-to-cart")) {
              e.preventDefault()
              e.stopPropagation()

              // Add to cart
              addToCart(product)
              return
            }

            // Don't show details if clicking the view details button (we'll handle that separately)
            if (e.target.classList.contains("view-details-btn")) {
              return
            }

            // Show product details within the shop view
            showProductDetailsInShop(product, productContainer, productDetailsContainer)
          })

          // Add specific event listener for the view details button
          const viewDetailsBtn = productCard.querySelector(".view-details-btn")
          if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener("click", (e) => {
              e.preventDefault()
              e.stopPropagation()

              // Show product details within the shop view
              showProductDetailsInShop(product, productContainer, productDetailsContainer)
            })
          }

          productContainer.appendChild(productCard)
        })
      }
    }

    // Add styles for the premium product display
    const style = document.createElement("style")
    style.textContent = `
  .all-products-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f8f9fa;
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  
  .all-products-header {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2.5rem;
    color: #212529;
    font-weight: 300;
    letter-spacing: -0.5px;
  }
  
  .product-brand-category {
    color: #6c757d;
    font-size: 0.85rem;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #212529;
    transition: color 0.2s ease;
  }
  
  .close-btn:hover {
    color: #000;
  }
  
  .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #212529;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }
  
  .back-btn:hover {
    background-color: #000;
    transform: translateY(-2px);
  }
  
  .product-card {
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px 0;
  }
  
  .view-details-btn {
    background-color: #212529;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 12px;
  }
  
  .view-details-btn:hover {
    background-color: #000;
    transform: translateY(-2px);
  }
  
  .add-to-cart {
    background-color: white;
    color: #212529;
    border: 1px solid #212529;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 12px;
  }
  
  .add-to-cart:hover {
    background-color: #212529;
    color: white;
    transform: translateY(-2px);
  }
  
  .product-info {
    padding: 20px;
  }
  
  .product-info h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: #212529;
    font-weight: 500;
  }
  
  .product-price {
    font-size: 1.3rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 15px;
  }
  
  .product-image {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #f8f9fa;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .product-card:hover .product-image img {
    transform: scale(1.05);
  }
  
  /* Premium Shop Product Details Styles */
  .shop-product-details {
    background: white;
    border-radius: 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 0;
    margin-top: 30px;
    position: relative;
    overflow: hidden;
  }
  
  .shop-product-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 992px) {
    .shop-product-details-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .shop-product-image-container {
    position: relative;
    background: #f8f9fa;
    height: 100%;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .shop-product-image {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  
  .shop-product-image img {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
    transition: transform 0.5s ease;
  }
  
  .shop-product-image:hover img {
    transform: scale(1.05);
  }
  
  .shop-color-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0;
    transition: opacity 0.3s ease;
    mix-blend-mode: multiply;
  }
  
  .shop-product-info {
    padding: 60px;
    display: flex;
    flex-direction: column;
  }
  
  .shop-product-info h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #212529;
    font-weight: 300;
    letter-spacing: -0.5px;
  }
  
  .shop-product-price {
    font-size: 2rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 30px;
  }
  
  .shop-product-description {
    margin-bottom: 30px;
    line-height: 1.8;
    color: #495057;
    font-size: 1.1rem;
  }
  
  .back-to-products {
    background-color: transparent;
    color: #212529;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 40px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .back-to-products:hover {
    color: #000;
    gap: 12px;
  }
  
  .shop-product-options {
    margin-bottom: 30px;
  }
  
  .shop-product-sizes, .shop-product-colors {
    margin-bottom: 25px;
  }
  
  .shop-product-sizes h4, .shop-product-colors h4, .shop-quantity-label {
    margin-bottom: 15px;
    font-weight: 500;
    color: #212529;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
  }
  
  .shop-size-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .shop-size-option {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dee2e6;
    border-radius: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }
  
  .shop-size-option:hover {
    border-color: #212529;
  }
  
  .shop-size-option.selected {
    background-color: #212529;
    color: white;
    border-color: #212529;
  }
  
  .shop-color-options {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .shop-color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    position: relative;
  }
  
  .shop-color-option:hover {
    transform: scale(1.1);
  }
  
  .shop-color-option.selected {
    border-color: #212529;
    transform: scale(1.1);
  }
  
  .shop-color-option.selected:after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 1px solid #dee2e6;
    border-radius: 50%;
  }
  
  .shop-color-red { background-color: #e74c3c; }
  .shop-color-blue { background-color: #3498db; }
  .shop-color-green { background-color: #2ecc71; }
  .shop-color-yellow { background-color: #f1c40f; }
  .shop-color-purple { background-color: #9b59b6; }
  .shop-color-black { background-color: #212529; }
  
  .shop-quantity-selector {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  
  .shop-quantity-controls {
    display: flex;
    align-items: center;
    border: 1px solid #dee2e6;
    overflow: hidden;
  }
  
  .shop-quantity-btn {
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .shop-quantity-btn:hover {
    background-color: #f8f9fa;
  }
  
  .shop-quantity-input {
    width: 60px;
    height: 40px;
    border: none;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    text-align: center;
    font-size: 16px;
  }
  
  .shop-product-actions {
    display: flex;
    gap: 15px;
    margin-top: auto;
  }
  
  .shop-buy-now-btn, .shop-add-to-cart-btn {
    padding: 15px 25px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    flex: 1;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
  }
  
  .shop-buy-now-btn {
    background-color: #212529;
    color: white;
  }
  
  .shop-buy-now-btn:hover {
    background-color: #000;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .shop-add-to-cart-btn {
    background-color: white;
    color: #212529;
    border: 1px solid #212529;
  }
  
  .shop-add-to-cart-btn:hover {
    background-color: #f8f9fa;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .shop-error-message {
    color: #dc3545;
    font-size: 14px;
    margin-top: 8px;
    display: none;
  }

  /* Product Info Tabs */
  .shop-product-tabs {
    margin-bottom: 40px;
    border-bottom: 1px solid #dee2e6;
  }
  
  .shop-tab-buttons {
    display: flex;
    border-bottom: none;
    background-color: transparent;
    margin-bottom: 20px;
  }
  
  .shop-tab-button {
    padding: 15px 0;
    margin-right: 30px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: #6c757d;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
  }
  
  .shop-tab-button:hover {
    color: #212529;
  }
  
  .shop-tab-button.active {
    color: #212529;
    border-bottom: 2px solid #212529;
  }
  
  .shop-tab-content {
    padding: 0;
    background-color: transparent;
  }
  
  .shop-tab-panel {
    display: none;
  }
  
  .shop-tab-panel.active {
    display: block;
  }
  
  .shop-tab-panel h4 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: 500;
    color: #212529;
    font-size: 16px;
  }
  
  .shop-tab-panel p {
    margin-bottom: 20px;
    line-height: 1.8;
    color: #495057;
  }
  
  .shop-product-features ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  
  .shop-product-features li {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #495057;
  }
  
  /* Image Zoom Modal */
  .image-zoom-modal {
    display: none;
    position: fixed;
    z-index: 2000;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
    align-items: center;
    justify-content: center;
  }
  
  .zoom-modal-content {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
  }
  
  .zoom-close {
    position: absolute;
    top: 20px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .zoom-close:hover,
  .zoom-close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .shop-product-info {
      padding: 30px;
    }
    
    .shop-product-image-container {
      min-height: 400px;
    }
    
    .shop-product-tabs {
      margin-bottom: 30px;
    }
    
    .shop-tab-button {
      margin-right: 15px;
      font-size: 12px;
    }
    
    .shop-product-info h2 {
      font-size: 2rem;
    }
    
    .shop-product-price {
      font-size: 1.5rem;
    }
  }
  `

    document.head.appendChild(style)
    document.body.appendChild(allProductsSection)
  }

  // Update the showProductDetailsInShop function to create a premium shopping experience
  function showProductDetailsInShop(product, productContainer, detailsContainer) {
    // Hide the products grid
    productContainer.style.display = "none"

    // Define available sizes and colors
    const sizes = product.sizes || [7, 8, 9, 10, 11, 12]
    const colors = product.colors || ["Red", "Blue", "Green", "Yellow", "Purple", "Black"]

    // Create size options HTML
    let sizeOptionsHTML = ""
    sizes.forEach((size) => {
      sizeOptionsHTML += `<div class="shop-size-option" data-size="${size}">${size}</div>`
    })

    // Create color options HTML
    let colorOptionsHTML = ""
    colors.forEach((color) => {
      const colorClass = color.toLowerCase()
      colorOptionsHTML += `<div class="shop-color-option shop-color-${colorClass}" data-color="${color}"></div>`
    })

    // Get product details if available
    const specifications = product.details?.specifications || "No specifications available."
    const materials = product.details?.materials || "No materials information available."
    const careInstructions = product.details?.careInstructions || "No care instructions available."

    // Create features list if available
    let featuresHTML = ""
    if (product.features && product.features.length > 0) {
      featuresHTML = `
      <div class="shop-product-features">
        <h4>Features</h4>
        <ul>
          ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    `
    }

    // Set the product details HTML with premium design
    detailsContainer.innerHTML = `
    <button class="back-to-products">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Back to Products
    </button>
    
    <div class="shop-product-details-grid">
      <div class="shop-product-image-container">
        <div class="shop-product-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="shop-color-overlay" id="shop-color-overlay"></div>
        </div>
      </div>
      
      <div class="shop-product-info">
        <h2>${product.name}</h2>
        <div class="shop-product-price">$${product.price}</div>
        
        <div class="shop-product-tabs">
          <div class="shop-tab-buttons">
            <button class="shop-tab-button active" data-tab="description">Description</button>
            <button class="shop-tab-button" data-tab="specifications">Specifications</button>
            <button class="shop-tab-button" data-tab="care">Care</button>
          </div>
          
          <div class="shop-tab-content">
            <div class="shop-tab-panel active" id="description-panel">
              <p class="shop-product-description">${product.description || "No description available."}</p>
              ${featuresHTML}
            </div>
            
            <div class="shop-tab-panel" id="specifications-panel">
              <h4>Specifications</h4>
              <p>${specifications}</p>
              
              <h4>Materials</h4>
              <p>${materials}</p>
            </div>
            
            <div class="shop-tab-panel" id="care-panel">
              <h4>Care Instructions</h4>
              <p>${careInstructions}</p>
            </div>
          </div>
        
        <div class="shop-product-options">
          <div class="shop-product-sizes">
            <h4>Size</h4>
            <div class="shop-size-options">
              ${sizeOptionsHTML}
            </div>
            <div class="shop-error-message" id="shop-size-error">Please select a size</div>
          </div>
          
          <div class="shop-product-colors">
            <h4>Color</h4>
            <div class="shop-color-options">
              ${colorOptionsHTML}
            </div>
          </div>
        </div>
        
        <div class="shop-quantity-selector">
          <div class="shop-quantity-label">Quantity</div>
          <div class="shop-quantity-controls">
            <button class="shop-quantity-btn shop-minus">-</button>
            <input type="text" class="shop-quantity-input" value="1" readonly>
            <button class="shop-quantity-btn shop-plus">+</button>
          </div>
        </div>
        
        <div class="shop-product-actions">
          <button class="shop-buy-now-btn">BUY NOW</button>
          <button class="shop-add-to-cart-btn">ADD TO CART</button>
        </div>
      </div>
    </div>
    
    <!-- Image Zoom Modal -->
    <div id="image-zoom-modal" class="image-zoom-modal">
      <span class="zoom-close">&times;</span>
      <img class="zoom-modal-content" id="zoom-img">
    </div>
  `

    // Show the details container
    detailsContainer.style.display = "block"

    // Add event listeners

    // Image zoom functionality
    const productImage = detailsContainer.querySelector(".shop-product-image img")
    const zoomModal = detailsContainer.querySelector("#image-zoom-modal")
    const zoomImg = detailsContainer.querySelector("#zoom-img")
    const zoomClose = detailsContainer.querySelector(".zoom-close")

    if (productImage && zoomModal && zoomImg) {
      productImage.addEventListener("click", () => {
        zoomModal.style.display = "flex"
        zoomImg.src = productImage.src
      })

      zoomClose.addEventListener("click", () => {
        zoomModal.style.display = "none"
      })

      zoomModal.addEventListener("click", (e) => {
        if (e.target === zoomModal) {
          zoomModal.style.display = "none"
        }
      })
    }

    // Back to products button
    const backToProductsBtn = detailsContainer.querySelector(".back-to-products")
    if (backToProductsBtn) {
      backToProductsBtn.addEventListener("click", () => {
        detailsContainer.style.display = "none"
        productContainer.style.display = "grid"
      })
    }

    // Tab switching functionality
    const tabButtons = detailsContainer.querySelectorAll(".shop-tab-button")
    const tabPanels = detailsContainer.querySelectorAll(".shop-tab-panel")

    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons and panels
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanels.forEach((panel) => panel.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Show corresponding panel
        const tabName = this.getAttribute("data-tab")
        const panel = detailsContainer.querySelector(`#${tabName}-panel`)
        if (panel) {
          panel.classList.add("active")
        }
      })
    })

    // Size selection
    const sizeOptions = detailsContainer.querySelectorAll(".shop-size-option")
    const sizeError = detailsContainer.querySelector("#shop-size-error")

    sizeOptions.forEach((option) => {
      option.addEventListener("click", function () {
        sizeOptions.forEach((opt) => opt.classList.remove("selected"))
        this.classList.add("selected")
        if (sizeError && sizeError.style.display === "block") {
          sizeError.style.display = "none"
        }
      })
    })

    // Color selection
    const colorOptions = detailsContainer.querySelectorAll(".shop-color-option")
    const colorOverlay = detailsContainer.querySelector("#shop-color-overlay")

    colorOptions.forEach((option) => {
      option.addEventListener("click", function () {
        colorOptions.forEach((opt) => opt.classList.remove("selected"))
        this.classList.add("selected")

        // Apply color overlay
        const color = this.getAttribute("data-color")
        applyShopColorOverlay(colorOverlay, color)
      })
    })

    // Select first color by default
    if (colorOptions.length > 0) {
      colorOptions[0].classList.add("selected")
      const defaultColor = colorOptions[0].getAttribute("data-color")
      applyShopColorOverlay(colorOverlay, defaultColor)
    }

    // Quantity controls
    const quantityMinus = detailsContainer.querySelector(".shop-minus")
    const quantityPlus = detailsContainer.querySelector(".shop-plus")
    const quantityInput = detailsContainer.querySelector(".shop-quantity-input")

    if (quantityMinus && quantityInput) {
      quantityMinus.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        if (quantity > 1) {
          quantityInput.value = quantity - 1
        }
      })
    }

    if (quantityPlus && quantityInput) {
      quantityPlus.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        quantityInput.value = quantity + 1
      })
    }

    // Add to cart button
    const addToCartBtn = detailsContainer.querySelector(".shop-add-to-cart-btn")

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const selectedSize = detailsContainer.querySelector(".shop-size-option.selected")

        if (!selectedSize) {
          if (sizeError) {
            sizeError.style.display = "block"
          }
          return
        }

        const selectedColor = detailsContainer.querySelector(".shop-color-option.selected")
        const quantity = Number.parseInt(quantityInput.value)
        const size = selectedSize.getAttribute("data-size")
        const color = selectedColor ? selectedColor.getAttribute("data-color") : null

        // Create product object with selected options
        const productToAdd = {
          ...product,
          size: size,
          color: color,
          quantity: quantity,
        }

        // Add to cart
        addToCart(productToAdd)

        // Show success message or notification
        showNotification(`${product.name} added to cart!`)
      })
    }

    // Buy now button
    const buyNowBtn = detailsContainer.querySelector(".shop-buy-now-btn")

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const selectedSize = detailsContainer.querySelector(".shop-size-option.selected")

        if (!selectedSize) {
          if (sizeError) {
            sizeError.style.display = "block"
          }
          return
        }

        const selectedColor = detailsContainer.querySelector(".shop-color-option.selected")
        const quantity = Number.parseInt(quantityInput.value)
        const size = selectedSize.getAttribute("data-size")
        const color = selectedColor ? selectedColor.getAttribute("data-color") : null

        // Create product object with selected options
        const productToAdd = {
          ...product,
          size: size,
          color: color,
          quantity: quantity,
        }

        // Add to cart
        addToCart(productToAdd)

        // Redirect to checkout
        window.location.href = "cart.html"
      })
    }
  }

  // Helper function to apply color overlay to product image in shop view
  function applyShopColorOverlay(overlayElement, color) {
    if (!overlayElement) return

    const colorMap = {
      Red: "rgba(231, 76, 60, 0.5)",
      Blue: "rgba(52, 152, 219, 0.5)",
      Green: "rgba(46, 204, 113, 0.5)",
      Yellow: "rgba(241, 196, 15, 0.5)",
      Purple: "rgba(155, 89, 182, 0.5)",
      Black: "rgba(0, 0, 0, 0.5)",
    }

    overlayElement.style.backgroundColor = colorMap[color] || "transparent"
    overlayElement.style.opacity = "1"
  }

  // Add event listener to the shop link in the navigation
  const shopLink = document.querySelector('.nav-links a[href="/shop"]')
  if (shopLink) {
    shopLink.addEventListener("click", (e) => {
      e.preventDefault()
      displayAllProducts()
    })
  }

  // Also add event listener to the shop button if it exists
  const shopButton = document.querySelector(".shop-button")
  if (shopButton) {
    shopButton.addEventListener("click", (e) => {
      e.preventDefault()
      displayAllProducts()
    })
  }

  function displayProducts(brand, category) {
    const productContainer = document.getElementById("product-container")
    if (!productContainer) return

    productContainer.innerHTML = "" // Clear previous products

    if (products[brand] && products[brand][category]) {
      products[brand][category].forEach((product) => {
        const productCard = `<div class='product-card'>
          <img src='${product.image}' alt='${product.name}' />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class='product-price'>$${product.price}</p>
          <button class='add-to-cart' data-id='${product.id}'>Add to Cart</button>
        </div>`
        productContainer.innerHTML += productCard
      })
    }
  }

  // Event Listener for brand selection
  const brandSelect = document.getElementById("brand-select")
  const categorySelect = document.getElementById("category-select")

  if (brandSelect && categorySelect) {
    brandSelect.addEventListener("change", () => {
      displayProducts(brandSelect.value, categorySelect.value)
    })
    categorySelect.addEventListener("change", () => {
      displayProducts(brandSelect.value, categorySelect.value)
    })
  }

  // Initialize with default brand & category
  if (document.getElementById("product-container")) {
    displayProducts("adidas", "mens")
  }
})

// In the showProducts function, update the product card HTML to include the buttons
function showProducts(brand, category) {
  currentCategory = category
  if (brandNameSpan) {
    brandNameSpan.textContent = brand.toUpperCase()
  }
  if (categoryNameSpan) {
    categoryNameSpan.textContent = category.toUpperCase()
  }

  if (productsGrid) {
    productsGrid.innerHTML = ""
    const brandProducts = products[brand][category]

    brandProducts.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-actions">
                        <button class="view-details-btn">View Details</button>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `

      // Add event listener for the view details button
      const viewDetailsBtn = productCard.querySelector(".view-details-btn")
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          showProductModal(product)
        })
      }

      // Add event listener for the add to cart button
      const addToCartBtn = productCard.querySelector(".add-to-cart")
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          addToCart(product)
        })
      }

      // Add event listener for the entire card to show modal
      productCard.addEventListener("click", (e) => {
        // Don't show modal if clicking the buttons
        if (e.target.classList.contains("add-to-cart") || e.target.classList.contains("view-details-btn")) {
          return
        }
        showProductModal(product)
      })

      productsGrid.appendChild(productCard)
    })

    categoriesSection.classList.remove("active")
    productsSection.classList.add("active")
  }
}

// Add some CSS for the product actions in the product card
// Add this to the existing styles or create a new style element
if (!document.getElementById("product-card-styles")) {
  const style = document.createElement("style")
  style.id = "product-card-styles"
  style.textContent = `
    .product-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    
    .view-details-btn {
      background-color: #212529;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      flex: 1;
      font-size: 12px;
    }
    
    .view-details-btn:hover {
      background-color: #000;
    }
    
    .add-to-cart {
      background-color: white;
      color: #212529;
      border: 1px solid #212529;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      flex: 1;
      font-size: 12px;
    }
    
    .add-to-cart:hover {
      background-color: #f8f9fa;
    }
  `
  document.head.appendChild(style)
}
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.className = 'mobile-menu-toggle';
  mobileMenuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  
  const navbar = document.querySelector('.navbar');
  const logo = document.querySelector('.logo');
  const navLinks = document.querySelector('.nav-links');
  
  if (navbar && logo && !document.querySelector('.mobile-menu-toggle')) {
    navbar.insertBefore(mobileMenuToggle, logo.nextSibling);
  }
  
  mobileMenuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
  
  // Handle dropdown menus on mobile
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu-toggle')) {
      navLinks.classList.remove('active');
    }
  });
  
  // Contact form functionality
  const contactLink = document.querySelector('a[href="/contact"]');
  const contactModal = document.getElementById('contact-modal');
  
  if (contactLink && contactModal) {
    contactLink.addEventListener('click', function(e) {
      e.preventDefault();
      contactModal.style.display = 'block';
    });
    
    const closeContactModal = document.querySelector('.close-contact-modal');
    if (closeContactModal) {
      closeContactModal.addEventListener('click', function() {
        contactModal.style.display = 'none';
      });
    }
    
    window.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Contact form functionality
  const contactLink = document.querySelector('a[href="/contact"]');
  const contactModal = document.getElementById('contact-modal');
  const closeContactModal = document.querySelector('.close-contact-modal');
  
  if (contactLink && contactModal) {
    contactLink.addEventListener('click', function(e) {
      e.preventDefault();
      contactModal.style.display = 'block';
      // Add active class after a small delay to trigger animation
      setTimeout(() => {
        contactModal.classList.add('active');
      }, 10);
    });
  }
  
  if (closeContactModal && contactModal) {
    closeContactModal.addEventListener('click', function() {
      contactModal.classList.remove('active');
      // Hide the modal after animation completes
      setTimeout(() => {
        contactModal.style.display = 'none';
      }, 300);
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === contactModal) {
      contactModal.classList.remove('active');
      setTimeout(() => {
        contactModal.style.display = 'none';
      }, 300);
    }
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
});
