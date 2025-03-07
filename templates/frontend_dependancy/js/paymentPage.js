export function selectedItems() {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const messInfo = JSON.parse(sessionStorage.getItem("selectedMess"));

    updateMessInfo(messInfo);
    generateMenuItems(cart);
    updateTotalPrice(cart); // Ensure total price updates correctly
}

function updateMessInfo(messInfo) {
    if (!messInfo) return;

    const ratingValue = parseFloat(messInfo.messRating);
    let ratingColor = ratingValue <= 2 ? 'bg-red-500' :
                      ratingValue <= 3.5 ? 'bg-yellow-500' : 'bg-green-500';

    const ratingEl = document.getElementById("ratingBox");
    ratingEl.classList.add(ratingColor);
    ratingEl.textContent = "⭐ " + messInfo.messRating;

    document.getElementById("messName").textContent = messInfo.messName;
    document.getElementById("messAdd").textContent = messInfo.messAddress;
}

function generateMenuItems(cart) {
    const menuContainer = document.getElementById("parentContainer");
    menuContainer.innerHTML = ""; // Clear existing content

    cart.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("flex-1", "justify-between", "items-start", "mt-2", "pb-1");
        menuItem.innerHTML = getMenuItemHTML(item);
        menuContainer.appendChild(menuItem);
    });

    initializeEventListeners(cart); // Attach event listeners after rendering
}

function getMenuItemHTML(item) {
    return `
        <div class="bg-secbackgroundLight text-textPrimaryLight dark:bg-secbackgroundDark dark:text-textPrimaryDark order-card rounded-lg mb-2" data-item-name="${item.name}">
            <div class="flex items-center p-2">
                <img src="${item.img}" alt="Thali" class="w-32 h-32 rounded-md mr-6 object-cover">
                <div class="flex-1">
                    <h2 class="text-10xs font-bold">${item.name}</h2>
                    <ul class="text-xs list-none">
                        ${item.details.map(food => `<li>${food}</li>`).join("")}
                    </ul>
                </div>
                <div class="order-card flex-col items-end ml-auto space-y-12 pr-4">
                    <div class="flex items-center space-y-1 bg-accenthover opacity-80 text-black dark:text-white border-4 border-accent rounded-md">
                        <button class="minus-btn w-5 h-6 flex items-center justify-center hover:bg-accenthover transition duration-200">-</button>
                        <div class="quantity-display font-bold w-5 h-6 flex items-center justify-center text-10xs">${item.quantity}</div>
                        <button class="plus-btn w-5 h-6 flex items-center justify-center hover:bg-accenthover transition duration-200">+</button>
                    </div>
                    <p class="text-10xs mb-8 font-bold text-right">₹${item.price}</p>
                </div>
            </div>
        </div>
    `;
}

function initializeEventListeners(cart) {
    document.querySelectorAll(".order-card").forEach((card) => {
        const itemName = card.getAttribute("data-item-name");
        const minusBtn = card.querySelector(".minus-btn");
        const plusBtn = card.querySelector(".plus-btn");
        const quantityDisplay = card.querySelector(".quantity-display");

        const menuItem = cart.find(item => item.name === itemName);

        if (menuItem && quantityDisplay) {
            quantityDisplay.innerText = menuItem.quantity;

            plusBtn.addEventListener("click", () => {
                menuItem.quantity++;
                updateOrderedMenu(cart, itemName, menuItem.quantity);
            });

            minusBtn.addEventListener("click", () => {
                if (menuItem.quantity > 1) {
                    menuItem.quantity--;
                    updateOrderedMenu(cart, itemName, menuItem.quantity);
                } else {
                    // Remove item from cart if quantity becomes 0
                    cart = cart.filter(item => item.name !== itemName);
                    sessionStorage.setItem("cart", JSON.stringify(cart));
                    updateCartDisplay(cart);
                }
            });
        }
    });

    updateTotalPrice(cart);
}

// Updates the cart, session storage, and UI
function updateOrderedMenu(cart, itemName, newQuantity) {
    cart = cart.map(item => (item.name === itemName ? { ...item, quantity: newQuantity } : item));
    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay(cart);
}

// Refreshes UI after cart updates
function updateCartDisplay(cart) {
    generateMenuItems(cart);
    updateTotalPrice(cart);
}

// Calculates and updates the total price
function updateTotalPrice(cart) {
    let totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    document.getElementById("price").innerText = `₹${totalPrice}`;
}

// Adds event listener to the Place Order button
function setupPlaceOrderButton() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", () => {
            window.location.href = "OrderPlaced2.html";
        });
    }
}


const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            console.log("Back button clicked");
            window.location.href = "order2.html";
        });
    } else {
        console.warn("Back button not found in the DOM");
    }
    
 
document.addEventListener("DOMContentLoaded", () => {
    setupPlaceOrderButton();

    const addBtn = document.getElementById("addbtn"); // Removed '#'
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            // Ensure cart is up to date
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            sessionStorage.setItem("cart", JSON.stringify(cart));

            // Redirect to order2.html
            window.location.href = "order2.html";
        });
    } else {
        console.error("addbtn not found in the DOM");
    }
});


