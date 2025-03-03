import { search_page } from './search_mess.js';

// Function to initialize event listeners
export function initEventListeners() {
    document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", filterMessCards);
    });

    document.addEventListener("DOMContentLoaded", () => {
        displayMesses(search_page);
       
    });
}

// Function to filter mess cards based on selected checkboxes
export function filterMessCards() {
    const selectFilters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    let filteredMesses = selectFilters.length === 0
        ? search_page
        : search_page.filter(mess => {
            return (
                (!selectFilters.includes("Top Rated") || mess.messRating >= 4) &&
                (!selectFilters.includes("Open") || mess.keyword.includes("Open")) &&
                (!selectFilters.includes("Veg") || mess.keyword.includes("Veg")) &&
                (!selectFilters.includes("Crowd") || mess.crowdStatus === 0)
            );
        });

    filteredMesses = filteredMesses.sort((a, b) => parseFloat(b.messRating) - parseFloat(a.messRating));
    displayMesses(filteredMesses);
}

// Function to find crowd dot color
function finddotColor(crowdStatus) {
    return crowdStatus === -1 ? 'bg-green-600' :
           crowdStatus === 0  ? 'bg-yellow-500' :
                                'bg-red-500';
}

// Function to find rating color
function findRatingColor(ratingValue) {
    return ratingValue <= 2   ? 'bg-red-500' :
           ratingValue <= 3.5 ? 'bg-yellow-500' :
                               'bg-green-500';
}

// Function to display mess cards dynamically
export function displayMesses(messes) {
    const messContainer = document.getElementById("messContainer1");
    
    if (!messContainer) { 
        console.error("Element messContainer not found.");
        return; 
    }

   
    messContainer.innerHTML = ""; // Clear previous content

    messes.forEach(mess => {
        let dotColor = finddotColor(mess.crowdStatus);
        let ratingColor = findRatingColor(parseFloat(mess.messRating));

        const cardHTML = `
           <div class="relative w-full max-w-xl min-h-[220px] rounded-lg overflow-hidden bg-white flex flex-col">
               <div class="w-full h-[155px] bg-gray-700 flex items-center justify-center text-white text-xl">
                   <img class="w-full h-full object-cover" src="${mess.imgs}" alt="Mess Image">
               </div>

               <div class="absolute top-0 w-full h-40 bg-gradient-to-b from-black via-black/10 to-transparent text-white z-10">
                   <div class="absolute top-2 left-2 text-xs font-semibold px-4 py-1">
                       ${mess.openTime.replace(/&/g, '<br>')}
                   </div>
                   <div class="absolute top-2 right-4 ${ratingColor} text-white text-xs font-semibold px-3 py-2 rounded-full">
                       ⭐${mess.messRating}
                   </div>
               </div>

               <div class="bg-secbackgroundLight dark:bg-secbackgroundDark p-2 flex flex-col justify-between h-[100px]">
                   <div class="text-white flex flex-col space-y-0">
                       <h3 class="font-semibold text-textPrimaryLight dark:text-textPrimaryDark text-lg">${mess.messName}</h3>
                       <p class="text-sm text-textPrimaryLight dark:text-textPrimaryDark">${mess.messAddress}</p>
                   </div>

                   <div class="flex justify-between items-center mt-0 flex-row">
                       <div class="flex items-center bg-secbackgroundDark dark:bg-secbackgroundLight text-white dark:text-textPrimaryLight text-xs px-3 py-1 rounded-lg w-max">
                           <span class="mr-2">Crowd</span>
                           <div class="w-3 h-3 rounded-full ${dotColor} animate-pulse"></div>
                       </div>

                       <div class="flex gap-2">
                           <a href="https://maps.google.com/?q=${mess.geocodes}" target="_blank" 
                               class="bg-green-600 text-white text-xs px-2 py-2 rounded-lg">
                               Go to Maps
                           </a>
                           <button class="view-menu-btn bg-green-600 text-white text-xs px-2 py-2 rounded-lg">
                               🍽 View Menu
                           </button>
                       </div>
                   </div>
               </div>
           </div>
        `;

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col-span-1');
        cardDiv.innerHTML = cardHTML;
        messContainer.appendChild(cardDiv);


        const viewMenuBtn = cardDiv.querySelector(".view-menu-btn");
        viewMenuBtn.addEventListener("click", () => storeMessAndRedirect(mess));
        console.log(mess);

    });
}

// Store mess data in sessionStorage and redirect
export function storeMessAndRedirect(mess) {
    console.log("Storing mess data:", mess);
    sessionStorage.setItem("selectedMess", JSON.stringify(mess));
    console.log("Stored data:", sessionStorage.getItem("selectedMess"));  // Debugging
    window.location.href = "order2.html";
}

// Function to display the selected mess details


// Initialize event listeners when the script loads
initEventListeners();
