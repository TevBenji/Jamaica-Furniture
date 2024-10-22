// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Get menu elements
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('header');

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    // Redirect to login if trying to access protected pages
    if (window.location.pathname.includes('invoice.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }

    // Handle login functionality
    if (document.getElementById('loginForm')) {
        const validUsername = 'demo';
        const validPassword = 'password123';
        let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation (you should implement proper validation)
            if (email && password) {
                // Set login status in session storage
                sessionStorage.setItem('loggedIn', 'true');
                // Redirect to main page
                window.location.href = 'index.html';  // or whatever your main page is named
            } else {
                alert('Please fill in all fields');
            }
        });
    }

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation (you should implement proper validation)
        if (email && password) {
            // Set login status in session storage
            sessionStorage.setItem('loggedIn', 'true');
            // Redirect to main page
            window.location.href = 'index.html';  // or whatever your main page is named
        } else {
            alert('Please fill in all fields');
        }
    });
    // Handle invoice functionality
    if (window.location.pathname.includes('invoice.html')) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        if (cartItems.length === 0) {
            // If no items in cart, show message and redirect
            alert('No items in cart. Redirecting to shop...');
            window.location.href = 'index.html#shop';
            return;
        }

        // Generate invoice number
        const invoiceNumber = 'INV-' + new Date().getTime();
        document.getElementById('invoiceNumber').textContent = invoiceNumber;
        document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();

        // Populate customer details (in real app, this would come from user profile)
        const customerName = sessionStorage.getItem('customerName') || 'Guest User';
        const customerEmail = sessionStorage.getItem('customerEmail') || 'guest@example.com';
        document.getElementById('customerName').textContent = customerName;
        document.getElementById('customerEmail').textContent = customerEmail;

        // Populate invoice items
        const tbody = document.getElementById('invoiceItems');
        let subtotal = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.price.replace('BDT ', ''));
            const total = price;
            subtotal += total;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>1</td>
                <td>BDT ${price.toFixed(2)}</td>
                <td>BDT ${total.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `BDT ${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `BDT ${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `BDT ${total.toFixed(2)}`;
    }

    // Toggle menu for mobile devices
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
        });
    }

    // Remove mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuIcon && !menuIcon.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('shadow', window.scrollY > 0);
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (navbar) {
                    navbar.classList.remove('active');
                    menuIcon.classList.remove('bx-x');
                }
            }
        });
    });

    // Shopping cart functionality
    const cartButtons = document.querySelectorAll('.bx-cart');
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                window.location.href = 'login.html';
                return;
            }

            const productBox = this.closest('.box');
            const product = {
                name: productBox.querySelector('h3').textContent,
                price: productBox.querySelector('span').textContent,
                image: productBox.querySelector('img').src
            };
            
            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            showNotification('Item added to cart!');
        });
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.news-box');
    if (newsletterForm) {
        const newsletterInput = newsletterForm.querySelector('input');
        const subscribeButton = newsletterForm.querySelector('.btn');

        subscribeButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!');
                newsletterInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Utility functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease-in'
        });

        setTimeout(() => notification.style.opacity = '1', 100);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});