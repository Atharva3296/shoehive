document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) {
    window.location.href = "/login.html"
    return
  }

  // DOM Elements - Tabs
  const tabButtons = document.querySelectorAll(".profile-tab")
  const tabContents = document.querySelectorAll(".tab-content")

  // DOM Elements - Profile View
  const profileName = document.getElementById("profile-name")
  const profileEmail = document.getElementById("profile-email")
  const profileImage = document.getElementById("profile-image")
  const profileAddress = document.getElementById("profile-address")
  const profilePhone = document.getElementById("profile-phone")
  const profileDob = document.getElementById("profile-dob")
  const memberSince = document.getElementById("member-since")
  const addressContainer = document.getElementById("address-container")
  const phoneContainer = document.getElementById("phone-container")
  const dobContainer = document.getElementById("dob-container")
  const phoneVerifiedBadge = document.getElementById("phone-verified-badge")

  // DOM Elements - Profile Details View
  const viewName = document.getElementById("view-name")
  const viewEmail = document.getElementById("view-email")
  const viewAddress = document.getElementById("view-address")
  const viewPhone = document.getElementById("view-phone")
  const viewDob = document.getElementById("view-dob")
  const viewPhoneVerified = document.getElementById("view-phone-verified")

  // DOM Elements - Profile Edit
  const editProfileBtn = document.getElementById("edit-profile-btn")
  const profileView = document.getElementById("profile-view")
  const profileEdit = document.getElementById("profile-edit")
  const editProfileForm = document.getElementById("edit-profile-form")
  const cancelEditBtn = document.getElementById("cancel-edit")
  const editName = document.getElementById("edit-name")
  const editEmail = document.getElementById("edit-email")
  const editAddress = document.getElementById("edit-address")
  const editPhone = document.getElementById("edit-phone")
  const editDob = document.getElementById("edit-dob")
  const profileSuccess = document.getElementById("profile-success")
  const profileError = document.getElementById("profile-error")

  // DOM Elements - Phone Verification
  const verifyPhoneBtn = document.getElementById("verify-phone-btn")
  const phoneVerificationContainer = document.getElementById("phone-verification-container")
  const verificationCode = document.getElementById("verification-code")
  const submitCodeBtn = document.getElementById("submit-code-btn")

  // DOM Elements - Password Change
  const changePasswordBtn = document.getElementById("change-password-btn")
  const passwordFormContainer = document.getElementById("password-form-container")
  const changePasswordForm = document.getElementById("change-password-form")
  const cancelPasswordBtn = document.getElementById("cancel-password")
  const passwordSuccess = document.getElementById("password-success")
  const passwordError = document.getElementById("password-error")

  // DOM Elements - Account Deletion
  const deleteAccountBtn = document.getElementById("delete-account-btn")
  const deleteConfirmation = document.getElementById("delete-confirmation")
  const confirmDeleteBtn = document.getElementById("confirm-delete")
  const cancelDeleteBtn = document.getElementById("cancel-delete")

  // DOM Elements - Dark Mode
  const darkModeCheckbox = document.getElementById("dark-mode-checkbox")
  const themeToggle = document.getElementById("theme-toggle")

  // DOM Elements - Avatar Upload
  const avatarUpload = document.getElementById("avatar-upload")

  // DOM Elements - Logout
  const logoutLink = document.getElementById("logout-link")

  // Load user data
  function loadUserData() {
    // Profile sidebar
    profileName.textContent = user.name
    profileEmail.textContent = user.email
    profileImage.src = user.avatar || "placeholder-avatar.jpg"
    memberSince.textContent = user.memberSince

    if (user.address) {
      profileAddress.textContent = user.address
    } else {
      addressContainer.style.display = "none"
    }

    if (user.phone) {
      profilePhone.textContent = user.phone

      if (user.phoneVerified) {
        phoneVerifiedBadge.style.display = "inline-block"
        viewPhoneVerified.style.display = "inline-block"
      } else {
        phoneVerifiedBadge.style.display = "none"
        viewPhoneVerified.style.display = "none"
      }
    } else {
      phoneContainer.style.display = "none"
    }

    if (user.dob) {
      const dobDate = new Date(user.dob)
      const formattedDob = dobDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      profileDob.textContent = formattedDob
      viewDob.textContent = formattedDob
    } else {
      dobContainer.style.display = "none"
    }

    // Profile details view
    viewName.textContent = user.name
    viewEmail.textContent = user.email
    viewAddress.textContent = user.address || "Not provided"
    viewPhone.textContent = user.phone || "Not provided"

    // Profile edit form
    editName.value = user.name
    editEmail.value = user.email
    editAddress.value = user.address || ""
    editPhone.value = user.phone || ""

    if (user.dob) {
      // Format date as YYYY-MM-DD for input[type="date"]
      const dobDate = new Date(user.dob)
      const year = dobDate.getFullYear()
      const month = String(dobDate.getMonth() + 1).padStart(2, "0")
      const day = String(dobDate.getDate()).padStart(2, "0")
      editDob.value = `${year}-${month}-${day}`
    }

    // Dark mode
    if (user.darkMode) {
      document.body.classList.add("dark-mode")
      darkModeCheckbox.checked = true
      themeToggle.checked = true
    }
  }

  loadUserData()

  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show corresponding tab content
      const tabId = button.dataset.tab + "-tab"
      tabContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === tabId) {
          content.classList.add("active")
        }
      })
    })
  })

  // Edit Profile
  editProfileBtn.addEventListener("click", () => {
    profileView.classList.add("hidden")
    profileEdit.classList.remove("hidden")
  })

  cancelEditBtn.addEventListener("click", () => {
    profileView.classList.remove("hidden")
    profileEdit.classList.add("hidden")
    phoneVerificationContainer.classList.add("hidden")
    hideMessage(profileSuccess)
    hideMessage(profileError)

    // Reset form values
    editName.value = user.name
    editEmail.value = user.email
    editAddress.value = user.address || ""
    editPhone.value = user.phone || ""

    if (user.dob) {
      const dobDate = new Date(user.dob)
      const year = dobDate.getFullYear()
      const month = String(dobDate.getMonth() + 1).padStart(2, "0")
      const day = String(dobDate.getDate()).padStart(2, "0")
      editDob.value = `${year}-${month}-${day}`
    } else {
      editDob.value = ""
    }
  })

  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault()

    hideMessage(profileSuccess)
    hideMessage(profileError)

    // Validate inputs
    if (!editName.value || !editEmail.value) {
      showMessage(profileError, "Name and email are required")
      return
    }

    // Check if email is already in use by another user
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const otherUserWithEmail = users.find((u) => u.id !== user.id && u.email === editEmail.value)

    if (otherUserWithEmail) {
      showMessage(profileError, "Email is already in use by another account")
      return
    }

    // Update user data
    user.name = editName.value
    user.email = editEmail.value
    user.address = editAddress.value
    user.phone = editPhone.value
    user.dob = editDob.value ? new Date(editDob.value).toISOString() : null

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user))

    // Update users array
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          dob: user.dob,
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Show success message
    showMessage(profileSuccess, "Profile updated successfully")

    // Update UI
    loadUserData()

    // Switch back to view mode after a delay
    setTimeout(() => {
      profileView.classList.remove("hidden")
      profileEdit.classList.add("hidden")
      phoneVerificationContainer.classList.add("hidden")
      hideMessage(profileSuccess)
    }, 2000)
  })

  // Phone Verification
  verifyPhoneBtn.addEventListener("click", () => {
    if (!editPhone.value) {
      showMessage(profileError, "Please enter a phone number first")
      return
    }

    // In a real app, you would send a verification code to the phone number
    // For this demo, we'll simulate it
    phoneVerificationContainer.classList.remove("hidden")

    // Generate a random 6-digit code for demo purposes
    window.verificationCodeSent = Math.floor(100000 + Math.random() * 900000).toString()

    // Show the code to the user (for demo purposes only)
    showMessage(
      profileSuccess,
      `Verification code sent! For demo purposes, your code is: ${window.verificationCodeSent}`,
    )

    console.log("Verification code (for demo):", window.verificationCodeSent)
  })

  submitCodeBtn.addEventListener("click", () => {
    const code = verificationCode.value.trim()

    if (!code) {
      showMessage(profileError, "Please enter the verification code")
      return
    }

    if (code === window.verificationCodeSent) {
      user.phoneVerified = true
      showMessage(profileSuccess, "Phone number verified successfully")

      // Update users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          return { ...u, phoneVerified: true }
        }
        return u
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      localStorage.setItem("user", JSON.stringify(user))

      // Hide verification container after a delay
      setTimeout(() => {
        phoneVerificationContainer.classList.add("hidden")
      }, 2000)
    } else {
      showMessage(profileError, "Invalid verification code")
    }
  })

  // Avatar Upload
  avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imgData = event.target.result

        // Update profile image
        profileImage.src = imgData

        // Save to user data
        user.avatar = imgData
        localStorage.setItem("user", JSON.stringify(user))

        // Update users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((u) => {
          if (u.id === user.id) {
            return { ...u, avatar: imgData }
          }
          return u
        })

        localStorage.setItem("users", JSON.stringify(updatedUsers))
      }
      reader.readAsDataURL(file)
    }
  })

  // Dark Mode Toggle
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode")
    const isDarkMode = document.body.classList.contains("dark-mode")

    // Sync both toggles
    darkModeCheckbox.checked = isDarkMode
    themeToggle.checked = isDarkMode

    // Save preference to user data
    user.darkMode = isDarkMode
    localStorage.setItem("user", JSON.stringify(user))

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, darkMode: isDarkMode }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  darkModeCheckbox.addEventListener("change", toggleDarkMode)
  themeToggle.addEventListener("change", toggleDarkMode)

  // Change Password
  changePasswordBtn.addEventListener("click", () => {
    passwordFormContainer.classList.remove("hidden")
    changePasswordBtn.classList.add("hidden")
  })

  cancelPasswordBtn.addEventListener("click", () => {
    passwordFormContainer.classList.add("hidden")
    changePasswordBtn.classList.remove("hidden")
    hideMessage(passwordSuccess)
    hideMessage(passwordError)
    changePasswordForm.reset()
  })

  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault()

    hideMessage(passwordSuccess)
    hideMessage(passwordError)

    const currentPassword = document.getElementById("current-password").value
    const newPassword = document.getElementById("new-password").value
    const confirmNewPassword = document.getElementById("confirm-new-password").value

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showMessage(passwordError, "All fields are required")
      return
    }

    if (newPassword !== confirmNewPassword) {
      showMessage(passwordError, "New passwords do not match")
      return
    }

    // Get user with password from users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userWithPassword = users.find((u) => u.id === user.id)

    if (!userWithPassword || userWithPassword.password !== currentPassword) {
      showMessage(passwordError, "Current password is incorrect")
      return
    }

    // Update password
    userWithPassword.password = newPassword

    // Save to localStorage
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return userWithPassword
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Show success message
    showMessage(passwordSuccess, "Password updated successfully")

    // Reset form and hide after a delay
    setTimeout(() => {
      passwordFormContainer.classList.add("hidden")
      changePasswordBtn.classList.remove("hidden")
      hideMessage(passwordSuccess)
      changePasswordForm.reset()
    }, 2000)
  })

  // Delete Account
  deleteAccountBtn.addEventListener("click", () => {
    deleteConfirmation.classList.remove("hidden")
    deleteAccountBtn.classList.add("hidden")
  })

  cancelDeleteBtn.addEventListener("click", () => {
    deleteConfirmation.classList.add("hidden")
    deleteAccountBtn.classList.remove("hidden")
  })

  confirmDeleteBtn.addEventListener("click", () => {
    // Remove user from users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.filter((u) => u.id !== user.id)

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Clear session
    localStorage.removeItem("user")

    // Redirect to home page
    window.location.href = "/index.html"
  })

  // Logout
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("user")
    window.location.href = "/index.html"
  })

  // Save notification preferences
  const saveNotificationsBtn = document.querySelector(".save-notifications")
  saveNotificationsBtn.addEventListener("click", () => {
    const orderUpdates = document.getElementById("order-updates").checked
    const promotions = document.getElementById("promotions").checked
    const newProducts = document.getElementById("new-products").checked

    // Save preferences to user data
    user.notifications = {
      orderUpdates,
      promotions,
      newProducts,
    }

    localStorage.setItem("user", JSON.stringify(user))

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, notifications: user.notifications }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    alert("Notification preferences saved!")
  })

  // Helper functions for showing/hiding messages
  function showMessage(element, message) {
    element.textContent = message
    element.style.display = "block"
  }

  function hideMessage(element) {
    element.textContent = ""
    element.style.display = "none"
  }
})

