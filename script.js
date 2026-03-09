// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // --- Menu Page Logic ---
    const menuList = document.getElementById('menu-list');
    const menuItems = [
        { id: 1, name: "Special Chicken Biryani", description: "Authentic, aromatic Basmati rice cooked with tender chicken pieces, yogurt, and a blend of traditional spices.", price: 450, img: "images/special chicken biryani.jpg" },
        { id: 2, name: "Chicken Karahi (Half)", description: "Succulent chicken cooked in a rich tomato-based gravy with green chilies, ginger, and traditional Pakistani spices.", price: 600, img: "images/Chicken Karahi (Half).jpg" },
        { id: 3, name: "Daal Chawal with Achar", description: "Comforting lentil curry served with steamed rice and a tangy mixed pickle.", price: 280, img: "images/Daal Chawal with Achar.jpg" },
        { id: 4, name: "Shami Kebab (2 Pcs)", description: "Delicious pan-fried patties made from minced meat (beef/chicken) and split chickpeas, seasoned with spices.", price: 200, img: "images/Shami Kebab.jpg" },
        { id: 5, name: "Vegetable Pulao", description: "Fragrant rice dish cooked with fresh seasonal vegetables and mild spices.", price: 320, img: "images/Vegetable Pulao.jpg" },
        { id: 6, name: "Gajar Ka Halwa (Single Serve)", description: "A traditional Pakistani dessert made with grated carrots, milk, sugar, and cardamom, garnished with nuts.", price: 250, img: "images/Gajar Ka Halwa (Single Serve).jpg" }
    ];

    if (menuList) {
        menuItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <span class="price">${item.price.toFixed(2)} PKR</span>
                <button class="btn add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            `;
            menuList.appendChild(menuItemDiv);
        });

        // Add to cart functionality
        menuList.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const id = parseInt(event.target.dataset.id);
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                addToCart({ id, name, price, quantity: 1 });
            }
        });
    }

    // --- Order Page (Cart & Checkout) Logic ---
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutFormSection = document.getElementById('checkout-form');
    const orderForm = document.getElementById('order-form');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(item);
        }
        saveCart();
        alert(`${item.name} added to cart!`);
        renderCart(); // Re-render cart if on order page
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }

    function updateQuantity(id, quantity) {
        const item = cart.find(cartItem => cartItem.id === id);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                removeFromCart(id);
                return;
            }
            saveCart();
            renderCart();
        }
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function renderCart() {
        if (!cartItemsDiv) return; // Only run if on the order page

        cartItemsDiv.innerHTML = ''; // Clear previous items
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty. <a href="menu.html">Browse our menu</a> to add items!</p>';
            checkoutBtn.disabled = true;
            checkoutFormSection.style.display = 'none';
        } else {
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price.toFixed(2)} PKR x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="item-quantity-input">
                        <button data-id="${item.id}" data-action="increase">+</button>
                        <button data-id="${item.id}" data-action="remove" style="color: red; margin-left: 10px;">x</button>
                    </div>
                `;
                cartItemsDiv.appendChild(itemDiv);
            });
            checkoutBtn.disabled = false;
        }
        cartTotalSpan.textContent = `${calculateTotal().toFixed(2)} PKR`;
    }

    // Event listeners for cart actions on the order page
    if (cartItemsDiv) {
        cartItemsDiv.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            const action = event.target.dataset.action;

            if (!id || !action) return;

            if (action === 'increase') {
                const item = cart.find(cartItem => cartItem.id === id);
                if (item) updateQuantity(id, item.quantity + 1);
            } else if (action === 'decrease') {
                const item = cart.find(cartItem => cartItem.id === id);
                if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
                else removeFromCart(id); // Remove if quantity becomes 0
            } else if (action === 'remove') {
                removeFromCart(id);
            }
        });

        cartItemsDiv.addEventListener('change', (event) => {
            if (event.target.classList.contains('item-quantity-input')) {
                const id = parseInt(event.target.dataset.id);
                const quantity = parseInt(event.target.value);
                if (id && !isNaN(quantity)) {
                    updateQuantity(id, quantity);
                }
            }
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                checkoutFormSection.style.display = 'block';
                checkoutBtn.style.display = 'none'; // Hide checkout button once form is shown
            } else {
                alert('Your cart is empty. Please add items before checking out.');
            }
        });

        orderForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const paymentMethod = document.getElementById('payment-method').value;

            if (!name || !phone || !address || !paymentMethod) {
                alert('Please fill in all order details.');
                return;
            }

            const orderDetails = {
                customerName: name,
                customerPhone: phone,
                deliveryAddress: address,
                paymentMethod: paymentMethod,
                items: cart,
                total: calculateTotal()
            };

            // --- IMPORTANT: This is where you'd send order to a backend server ---
            // For this basic frontend, we'll just log it and simulate success.
            console.log("Order Placed:", orderDetails);
            alert(`Order successfully placed! Your total is ${orderDetails.total.toFixed(2)} PKR. We will contact you shortly.`);

            // Clear cart and form after order
            cart = [];
            saveCart();
            renderCart();
            orderForm.reset();
            checkoutFormSection.style.display = 'none';
            checkoutBtn.style.display = 'block';
        });

        renderCart(); // Initial render of the cart when the page loads
    }
});