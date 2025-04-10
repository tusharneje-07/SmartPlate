let menuData = [
    { menuName: "Special Thali", chapatiQty: 3, numSabjis: 2, sabjiNames: ["Paneer", "Aloo"], otherItems: "Raita", price: 120, dalRice: true, menuImage: "" },
    { menuName: "Regular Thali", chapatiQty: 2, numSabjis: 1, sabjiNames: ["Mixed Veg"], otherItems: "", price: 100, dalRice: false, menuImage: "" }
];

// Function to add or update a menu
// if the menu name is alreday used it simply update the existing menu rather than adding new one
function addOrUpdateMenu(newMenu) {
    const existingIndex = menuData.findIndex(menu => menu.menuName.toLowerCase() === newMenu.menuName.toLowerCase());

    if (existingIndex !== -1) {
        menuData[existingIndex] = newMenu;
        console.log(`Updated Menu: ${newMenu.menuName}`);
    } else {
        menuData.push(newMenu);
        console.log(`Added New Menu: ${newMenu.menuName}`);
    }

    console.log("Current Menu Data:", menuData);
}


// Export the functions and menuData array
export { menuData, addOrUpdateMenu};
