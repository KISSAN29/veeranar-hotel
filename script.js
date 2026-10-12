/* =========================================
   VEERANAR HOTEL - COMPLETE CART SYSTEM
========================================= */

const WHATSAPP_NUMBER = "916369414605";
const CART_STORAGE_KEY = "veeranarCart";

let cart = {};


/* =========================================
   LOAD SAVED CART
========================================= */

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

        if (savedCart && typeof savedCart === "object") {
            cart = savedCart;
        }
    } catch (error) {
        console.error("Unable to load saved cart:", error);
        cart = {};
    }
}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Unable to save cart:", error);
    }
}


/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {
    const countElement =
        document.getElementById("cart-count");

    if (!countElement) return;

    const count = Object.values(cart).reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    countElement.textContent = count;
}


/* =========================================
   FOOD CARD QUANTITY
========================================= */

function changeQuantity(button, change) {
    const card = button.closest(".food-card");

    if (!card) return;

    const quantityElement =
        card.querySelector(".quantity");

    if (!quantityElement) return;

    let quantity =
        Number(quantityElement.textContent) || 1;

    quantity += change;

    if (quantity < 1) {
        quantity = 1;
    }

    quantityElement.textContent = quantity;
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(button) {
    const card = button.closest(".food-card");

    if (!card) return;

    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const quantityElement =
        card.querySelector(".quantity");

    const quantity = Math.max(
        1,
        Number(quantityElement?.textContent) || 1
    );

    if (!name || !Number.isFinite(price) || price < 0) {
        alert("Unable to add this food item.");
        return;
    }

    if (cart[name]) {
        cart[name].quantity += quantity;
    } else {
        cart[name] = {
            name: name,
            price: price,
            quantity: quantity
        };
    }

    saveCart();
    renderCart();
    updateCartCount();

    if (quantityElement) {
        quantityElement.textContent = "1";
    }

    openCart();
}


/* =========================================
   CART TOTAL
========================================= */

function calculateCartTotal() {
    return Object.values(cart).reduce(
        (total, item) =>
            total +
            Number(item.price) * Number(item.quantity),
        0
    );
}


/* =========================================
   RENDER CART ITEMS
========================================= */

function renderCart() {
    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutTotal =
        document.getElementById("checkout-total");

    if (!cartItems) {
        updateCartCount();
        return;
    }

    const items = Object.values(cart);

    cartItems.innerHTML = "";

    if (items.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className = "empty-cart";
        emptyMessage.textContent =
            "Your order is empty.";

        cartItems.appendChild(emptyMessage);
    } else {
        items.forEach(function(item) {
            const itemElement =
                document.createElement("div");

            itemElement.className = "cart-item";

            /* FOOD INFORMATION */

            const info =
                document.createElement("div");

            info.className = "cart-item-info";

            const title =
                document.createElement("h3");

            title.textContent = item.name;

            const price =
                document.createElement("p");

            price.textContent =
                `₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`;

            info.append(title, price);

            /* QUANTITY CONTROLS */

            const controls =
                document.createElement("div");

            controls.className =
                "cart-item-controls";

            const minusButton =
                document.createElement("button");

            minusButton.type = "button";
            minusButton.textContent = "−";
            minusButton.setAttribute(
                "aria-label",
                `Decrease ${item.name} quantity`
            );

            minusButton.addEventListener(
                "click",
                function() {
                    changeCartQuantity(item.name, -1);
                }
            );

            const quantity =
                document.createElement("span");

            quantity.textContent = item.quantity;

            const plusButton =
                document.createElement("button");

            plusButton.type = "button";
            plusButton.textContent = "+";

            plusButton.setAttribute(
                "aria-label",
                `Increase ${item.name} quantity`
            );

            plusButton.addEventListener(
                "click",
                function() {
                    changeCartQuantity(item.name, 1);
                }
            );

            controls.append(
                minusButton,
                quantity,
                plusButton
            );

            /* REMOVE BUTTON */

            const removeButton =
                document.createElement("button");

            removeButton.type = "button";
            removeButton.className = "remove-item";
            removeButton.textContent = "Remove";

            removeButton.addEventListener(
                "click",
                function() {
                    removeFromCart(item.name);
                }
            );

            itemElement.append(
                info,
                controls,
                removeButton
            );

            cartItems.appendChild(itemElement);
        });
    }

    /* UPDATE TOTALS */

    const total = calculateCartTotal();

    if (cartTotal) {
        cartTotal.textContent = `₹${total}`;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = `₹${total}`;
    }

    updateCartCount();
}


/* =========================================
   CHANGE CART QUANTITY
========================================= */

function changeCartQuantity(name, change) {
    if (!cart[name]) return;

    cart[name].quantity += change;

    if (cart[name].quantity <= 0) {
        delete cart[name];
    }

    saveCart();
    renderCart();
}


/* =========================================
   REMOVE CART ITEM
========================================= */

function removeFromCart(name) {
    if (!cart[name]) return;

    delete cart[name];

    saveCart();
    renderCart();
}


/* =========================================
   OPEN CART
========================================= */

function openCart() {
    const drawer =
        document.getElementById("cart-drawer");

    const overlay =
        document.getElementById("cart-overlay");

    if (!drawer || !overlay) {
        console.error("Cart drawer or overlay not found.");
        return;
    }

    drawer.classList.add("active");
    overlay.classList.add("active");

    document.body.classList.add("cart-open");

    renderCart();
}


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {
    const drawer =
        document.getElementById("cart-drawer");

    const overlay =
        document.getElementById("cart-overlay");

    if (drawer) {
        drawer.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.classList.remove("cart-open");
}


/* =========================================
   SHOW ORDER SCREEN
========================================= */

function showOrderStep() {
    const orderStep =
        document.getElementById("order-step");

    const checkoutStep =
        document.getElementById("checkout-step");

    if (!orderStep || !checkoutStep) {
        console.error(
            "Order or checkout section is missing from menu.html."
        );
        return;
    }

    orderStep.hidden = false;
    checkoutStep.hidden = true;

    orderStep.style.display = "flex";
    checkoutStep.style.display = "none";

    renderCart();
}


/* =========================================
   OPEN CHECKOUT SCREEN
========================================= */

function goToCheckout() {
    const orderStep =
        document.getElementById("order-step");

    const checkoutStep =
        document.getElementById("checkout-step");

    if (!orderStep || !checkoutStep) {
        alert(
            "Checkout section not found. Please check menu.html."
        );

        console.error(
            "Missing #order-step or #checkout-step."
        );

        return;
    }

    if (Object.keys(cart).length === 0) {
        alert("Please add items to your order first.");
        return;
    }

    /* HIDE ORDER SCREEN */

    orderStep.hidden = true;
    orderStep.style.display = "none";

    /* SHOW CHECKOUT SCREEN */

    checkoutStep.hidden = false;
    checkoutStep.style.display = "flex";

    /* UPDATE CHECKOUT TOTAL */

    renderCart();

    /* UPDATE DELIVERY ADDRESS */

    toggleAddressField();

    /* SCROLL CHECKOUT TO TOP */

    const checkoutContent =
        checkoutStep.querySelector(".checkout-content");

    if (checkoutContent) {
        checkoutContent.scrollTop = 0;
    }

    console.log("Checkout screen opened.");
}


/* =========================================
   BACK TO ORDER SCREEN
========================================= */

function backToOrder() {
    showOrderStep();
}


/* =========================================
   PICKUP / DELIVERY ADDRESS
========================================= */

function toggleAddressField() {
    const orderType =
        document.getElementById("order-type");

    const addressField =
        document.getElementById("address-field");

    const addressInput =
        document.getElementById("customer-address");

    if (!orderType || !addressField) return;

    const isDelivery =
        orderType.value === "Delivery";

    addressField.hidden = !isDelivery;

    addressField.style.display =
        isDelivery ? "block" : "none";

    if (addressInput) {
        addressInput.required = isDelivery;
    }
}


/* =========================================
   WHATSAPP CHECKOUT
========================================= */

function orderCartOnWhatsApp() {
    const items = Object.values(cart);

    if (items.length === 0) {
        alert("Please add items to your order first.");
        return;
    }

    const nameInput =
        document.getElementById("customer-name");

    const phoneInput =
        document.getElementById("customer-phone");

    const orderTypeInput =
        document.getElementById("order-type");

    const addressInput =
        document.getElementById("customer-address");

    if (!nameInput || !phoneInput || !orderTypeInput) {
        alert("Customer details are missing.");
        return;
    }

    const customerName =
        nameInput.value.trim();

    const customerPhone =
        phoneInput.value.trim();

    const orderType =
        orderTypeInput.value;

    const customerAddress =
        addressInput
            ? addressInput.value.trim()
            : "";

    /* VALIDATE CUSTOMER NAME */

    if (!customerName) {
        alert("Please enter your name.");
        nameInput.focus();
        return;
    }

    /* VALIDATE PHONE */

    const digitsOnly =
        customerPhone.replace(/\D/g, "");

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        alert("Please enter a valid phone number.");
        phoneInput.focus();
        return;
    }

    /* VALIDATE DELIVERY ADDRESS */

    if (orderType === "Delivery" && !customerAddress) {
        alert("Please enter your delivery address.");

        if (addressInput) {
            addressInput.focus();
        }

        return;
    }

    /* CREATE WHATSAPP MESSAGE */

    let message =
        "Hello Veeranar Hotel!\n\n" +
        "YOUR ORDER\n\n" +
        "CUSTOMER DETAILS\n" +
        `Name: ${customerName}\n` +
        `Phone: ${customerPhone}\n` +
        `Order Type: ${orderType}\n`;

    if (orderType === "Delivery") {
        message += `Address: ${customerAddress}\n`;
    }

    message += "\nORDER ITEMS\n\n";

    items.forEach(function(item) {
        const lineTotal =
            item.price * item.quantity;

        message +=
            `${item.name}\n` +
            `₹${item.price} × ${item.quantity} = ₹${lineTotal}\n\n`;
    });

    message +=
        "--------------------\n" +
        `TOTAL = ₹${calculateCartTotal()}\n\n` +
        "Please confirm my order.";

    /* OPEN WHATSAPP */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}


/* =========================================
   INITIALIZE CART
========================================= */

document.addEventListener("DOMContentLoaded", function() {
    loadCart();

    updateCartCount();
    renderCart();

    const orderType =
        document.getElementById("order-type");

    if (orderType) {
        orderType.addEventListener(
            "change",
            toggleAddressField
        );

        toggleAddressField();
    }

    /* INITIAL SCREEN STATE */

    const orderStep =
        document.getElementById("order-step");

    const checkoutStep =
        document.getElementById("checkout-step");

    if (orderStep && checkoutStep) {
        orderStep.hidden = false;
        checkoutStep.hidden = true;

        orderStep.style.display = "flex";
        checkoutStep.style.display = "none";
    }
});