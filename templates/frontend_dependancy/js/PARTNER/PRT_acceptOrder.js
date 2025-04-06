const orders = [
    { table: 'TC001', orderId: '51686', timeAgo: '2 mins Ago', customer: 'Tushar Neje', items: ['1 X Thali', '2 X Chapati Bhaji', '1 X Dal Rice', '1 X Biryani'] },
    { table: 'TC002', orderId: '51687', timeAgo: '5 mins Ago', customer: 'Pradnya Bhakare', items: ['2 X Pizza', '1 X Pasta'] },
    { table: 'TC002', orderId: '51687', timeAgo: '5 mins Ago', customer: 'Pradnya Bhakare', items: ['2 X Pizza', '1 X Pasta'] },
    { table: 'TC002', orderId: '51687', timeAgo: '5 mins Ago', customer: 'Pradnya Bhakare', items: ['2 X Pizza', '1 X Pasta'] },
    { table: 'TC002', orderId: '51687', timeAgo: '5 mins Ago', customer: 'Pradnya Bhakare', items: ['2 X Pizza', '1 X Pasta'] },
];

function renderOrders() {
    const container = document.getElementById('order-container');
    container.innerHTML = '';

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'dark:bg-secbackgroundDark bg-secbackgroundLight h-52 rounded-lg flex items-stretch';

        orderCard.innerHTML = `
            <div class="w-52 flex items-center">
                <div class="dark:bg-secbackgroundDark bg-secbackgroundLight py-6 rounded-lg flex flex-col justify-between h-full">
                    <div>
                        <div class="text-4xl px-12 dark:text-textPrimaryDark text-textPrimaryLight mb-1 font-extrabold">${order.table}</div>
                        <div class="text-1xl px-10 dark:text-textPrimaryDark text-textPrimaryLight">Order ID - ${order.orderId}</div>
                    </div>
                    <div class="text-sm px-14 dark:text-textPrimaryDark text-textPrimaryLight">${order.timeAgo}</div>
                </div>
            </div>
            <div class="relative flex items-center">
                <div class="h-52 border-l-4 border-dashed dark:border-backgroundDark border-backgroundLight"></div>
            </div>
            <div class="flex-1 pl-8 py-6 relative">
                <div class="text-lg font-bold">From ${order.customer}</div>
                <div class="dark:text-textPrimaryDark text-textPrimaryLight mt-2">
                    ${order.items.join('<br>')}
                </div>
                <button class="absolute top-4 right-4 bg-accent text-textPrimaryLight dark:text-white px-4 py-2">Order Taken</button>
                <button class="absolute bottom-0 right-0 bg-secbackgroundLight dark:bg-secbackgroundDark text-textPrimaryLight dark:text-textPrimaryLight px-2 py-1 rounded-l-md border border-white dark:border-black">&lt;&gt;</button>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

document.addEventListener('DOMContentLoaded', renderOrders);

function toggleFullScreen() {
    const elementsToHide = document.querySelectorAll('.hide-on-fullscreen');
    elementsToHide.forEach(el => el.classList.toggle('hidden'));
}