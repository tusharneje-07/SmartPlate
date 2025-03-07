export function OrderPlaced() {
    const menuContainer = document.getElementById("OrderContainer");

    if (!menuContainer) {
        console.error("OrderContainer not found.");
        return;
    }

    // Retrieve mess info and cart data from session storage
    const messInfo = JSON.parse(sessionStorage.getItem("selectedMess")) || {};
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    // document.getElementById("messName").textContent = messInfo.messName;
    // Generate order details dynamically
    let orderHTML = `
        <div class="rounded-t-xl bg-accent border-black p-10">
            <h1 class="text-4xl font-extrabold">${messInfo.id || "A001"}</h1>
        </div>
        <div class="p-8 justify-center">
            <h2 class="text-2xl font-bold mb-10">Order Confirmed!</h2>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6" id="messname">${messInfo.messName}</h3>
            <ul class="text-lg mb-10">
    `;

    let totalPrice = 0;
    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        orderHTML += `
            <li class="flex justify-between">
                <span class="flex items-center">
                    <svg class="w-5 h-5 mr-2 text-accent dark:text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z"></path>
                    </svg>
                    ${item.name} x ${item.quantity}
                </span>
                <span>₹${item.price * item.quantity}</span>
            </li>
        `;
    });

    orderHTML += `
            </ul>
            <div class="font-bold text-xl mb-6">Total: ₹${totalPrice}</div>
            <div class="text-md ">Date: ${new Date().toLocaleDateString()}</div>
        </div>
    `;

    menuContainer.innerHTML = orderHTML + menuContainer.innerHTML;
}

const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            console.log("Back button clicked");
            window.location.href = "paymentPage.html";
        });
    } else {
        console.warn("Back button not found in the DOM");
    }
    
