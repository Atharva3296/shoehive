document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchFormLinks = document.querySelectorAll('.switch-form');
    
    // Error and success messages
    const loginError = document.getElementById('login-error');
    const loginSuccess = document.getElementById('login-success');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (button.dataset.tab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
    
    // Form switching via links
    switchFormLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (link.dataset.form === 'login') {
                tabButtons[0].click();
            } else {
                tabButtons[1].click();
            }
        });
    });
    
    // Check if user is already logged in
    function checkLoggedIn() {
        const user = localStorage.getItem('user');
        if (user) {
            window.location.href = '/profile.html';
        }
    }
    
    checkLoggedIn();
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset messages
        hideMessage(loginError);
        hideMessage(loginSuccess);
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Validate inputs
        if (!email || !password) {
            showMessage(loginError, 'Please fill in all fields');
            return;
        }
        
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showMessage(loginError, 'User not found. Please check your email or sign up.');
            return;
        }
        
        // Simple password check (in a real app, you'd use proper authentication)
        if (user.password !== password) {
            showMessage(loginError, 'Incorrect password. Please try again.');
            return;
        }
        
        // Login successful
        delete user.password; // Don't store password in session
        localStorage.setItem('user', JSON.stringify(user));
        
        showMessage(loginSuccess, 'Login successful! Redirecting to your profile...');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
            window.location.href = '/profile.html';
        }, 1500);
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset messages
        hideMessage(signupError);
        hideMessage(signupSuccess);
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showMessage(signupError, 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage(signupError, 'Passwords do not match');
            return;
        }
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            showMessage(signupError, 'Email already in use. Please use a different email or login.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            address: '',
            phone: '',
            avatar: 'placeholder-avatar.jpg',
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        };
        
        // Save to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create a copy without the password for the session
        const sessionUser = {...newUser};
        delete sessionUser.password;
        localStorage.setItem('user', JSON.stringify(sessionUser));
        
        showMessage(signupSuccess, 'Account created successfully! Redirecting to your profile...');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
            window.location.href = '/profile.html';
        }, 1500);
    });
    
    // Helper functions for showing/hiding messages
    function showMessage(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }
    
    function hideMessage(element) {
        element.textContent = '';
        element.style.display = 'none';
    }
  });