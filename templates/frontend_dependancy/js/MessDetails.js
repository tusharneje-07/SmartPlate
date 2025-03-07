export function displayMessDetails() {
    const selectedMess = JSON.parse(sessionStorage.getItem("selectedMess"));
    console.log(selectedMess);

    

    if (selectedMess) {
        // Update Crowd Status
        const crowdStatusEl = document.getElementById("crowdStatus");
        crowdStatusEl.style.backgroundColor =
            selectedMess.crowdStatus === -1 ? "green" :
            selectedMess.crowdStatus === 0 ? "yellow" : "red";

        // Update Rating with Dynamic Color
        const ratingValue = parseFloat(selectedMess.messRating);
        let ratingColor = ratingValue <= 2 ? 'bg-red-500' :
                          ratingValue <= 3.5 ? 'bg-yellow-500' :
                                              'bg-green-500';

        // Set Rating Element Content and Color
        const ratingEl = document.getElementById("rating");
        ratingEl.classList.add(ratingColor);  // Add dynamic background color class
        ratingEl.textContent = "⭐ " + selectedMess.messRating;

        // Update Mess Info
        document.getElementById("messName").textContent = selectedMess.messName;
        document.getElementById("messAdd").textContent = selectedMess.messAddress;
        document.getElementById("messImage").src = selectedMess.imgs; // Set image

        // Load existing cart from sessionStorage
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        console.log("Loaded Cart:", cart);

        // Generate Menu Items
        const menuContainer = document.getElementById("menuContainer");
        menuContainer.innerHTML = ""; // Clear existing content

        selectedMess.menuItems.forEach((item, index) => {
            const cartItem = cart.find(cartItem => cartItem.name === item.name);
            const itemQuantity = cartItem ? cartItem.quantity : 0; // Get quantity from cart or default to 0

            const menuItem = document.createElement("div");
            menuItem.classList.add("flex-1", "justify-between", "items-start", "mt-2", "pb-1");

            menuItem.innerHTML = `
                <div class="flex w-full items-center bg-secbackgroundLight dark:bg-secbackgroundDark rounded-lg p-2 mb-0">
                    <!-- Image (Left) -->
                    <div class="w-32 h-32 overflow-hidden rounded-md">
                        <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>

                    <div class="flex-1 pl-4 text-black dark:text-white">
                        <h3 class="text-10xs font-bold">${item.name}</h3>
                        <ul class="text-xs list-none">${item.details.map(food => `<li>${food}</li>`).join("")}</ul>
                    </div>

                    <div class="order-card flex flex-col items-center gap-2">
                        <div class="flex items-center justify-between bg-accenthover opacity-80 text-black dark:text-white border-4 border-accent rounded-md w-24 py-1 min-h-[40px]">
                            <button class="decrease w-5 h-6 flex items-center justify-center hover:bg-accenthover transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13H5v-2h14v2z" />
                                </svg>
                            </button>
                            <span class="quantity text-light-text dark:text-dark-text text-10xs font-bold w-6 h-6 flex items-center justify-center">${itemQuantity}</span>
                            <button class="increase w-5 h-6 flex items-center justify-center hover:bg-accenthover transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </button>
                        </div>
                        <!-- Price -->
                        <p class="text-10xs font-bold mb-8 text-right text-black dark:text-white">
                            <span class="price">₹${item.price}</span>
                        </p>
                    </div>
                </div>
            `;

            menuContainer.appendChild(menuItem);

            // Attach the event listeners for increase and decrease buttons
            menuItem.querySelector(".increase").addEventListener("click", () => handleQuantityChange(item, 1, index));
            menuItem.querySelector(".decrease").addEventListener("click", () => handleQuantityChange(item, -1, index));
        
        });

        const cartButton = document.getElementById("cartButton");

        // Function to handle the quantity change
        function handleQuantityChange(menuItem, change, index) {
            const itemIndex = cart.findIndex(item => item.name === menuItem.name);
            let quantityEl = document.querySelectorAll(".quantity")[index]; // Select the corresponding span

            if (itemIndex >= 0) {
                // Item already in cart, update the quantity
                cart[itemIndex].quantity += change;

                // If quantity is 0 or less, remove the item
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                    quantityEl.textContent = "0"; // Reset displayed quantity
                } else {
                    quantityEl.textContent = cart[itemIndex].quantity; // Update displayed quantity
                }
            } else if (change > 0) {
                // Item not in cart, add it with quantity 1
                cart.push({ ...menuItem, quantity: 1 });
                quantityEl.textContent = "1"; // Set displayed quantity
            }

            console.log("Updated Cart:", cart);
            sessionStorage.setItem("cart", JSON.stringify(cart)); // Update cart in sessionStorage
            updateCartDisplay();
        }

        // Function to update cart display
        function updateCartDisplay() {
            updateCartButtonVisibility(); // Update visibility of the cart button
        }

        // Function to update cart button visibility
        function updateCartButtonVisibility() {
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartButton.style.display = totalQuantity > 0 ? "flex" : "none";
        }

        cartButton.addEventListener("click", () => {
            // Store the cart in sessionStorage
            sessionStorage.setItem("cart", JSON.stringify(cart));

            // Redirect to the payment page
            window.location.href = "paymentPage.html";  // Update with your actual payment page URL
        });

        // Ensure cart button visibility is updated on initial load
        updateCartButtonVisibility();
    }

    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            console.log("Back button clicked");
            window.location.href = "dine2.html";
        });
    } else {
        console.warn("Back button not found in the DOM");
    }
    
    
}
