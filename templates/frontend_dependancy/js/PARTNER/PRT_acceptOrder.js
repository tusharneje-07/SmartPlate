let lastOrders = null;

async function fetchOrders() {
    const messId = document.getElementById('mess_user_id').value;
    const host = window.location.origin;
    const url = `${host}/partner/${messId}/get_accept_order_data/`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

function renderOrders(orders) {
    // Only render if orders have changed
    if (JSON.stringify(orders) === JSON.stringify(lastOrders)) {
        return;
    }
    
    lastOrders = orders;
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
                <div class="text-sm px-14 dark:text-textPrimaryDark text-textPrimaryLight">${formatTimeAgo(order.time_ago)}</div>
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
            <button class="absolute top-4 right-4 bg-accent text-textPrimaryLight dark:text-white px-4 py-2 rounded" onclick="acceptOrder('${order.table}','${order.mess_id}')">Order Taken</button>
        </div>
    `;
    
        container.appendChild(orderCard);
    });
}

async function updateOrders() {
    const orders = await fetchOrders();
    renderOrders(orders.orders);
}

updateOrders();
setInterval(updateOrders, 1000);

function acceptOrder(table,mess_id) {
    const host = window.location.origin;
    const id = document.getElementById("mess_user_id").value;
    var url = host + "/partner/" + id + "/update_order_status/?order_id=" + table + "&mess_id=" + mess_id;
    fetch(url, {
        method: "GET",
    })
}


document.addEventListener('DOMContentLoaded', renderOrders);

function toggleFullScreen() {
    const elementsToHide = document.querySelectorAll('.hide-on-fullscreen');
    elementsToHide.forEach(el => el.classList.toggle('hidden'));
}

document.addEventListener("DOMContentLoaded", () => {
    const statusRadios = document.querySelectorAll('input[name="status"]');
  
    const statusMap = {
      green: -1,
      yellow: 0,
      red: 1,
    };
  
    statusRadios.forEach(radio => {
      radio.addEventListener('change', (event) => {
        const selectedColor = event.target.value;        
        const statusValue = statusMap[selectedColor];
        var id = document.getElementById("mess_user_id").value;
        const host = window.location.origin;
        var url = host + "/partner/" + id + "/update_crowd_count_data/?crowd_status=" + statusValue;
        fetch(url, {
            method: "GET",
        })
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleAcceptBtn');
    const statusText = document.getElementById('acceptStatusText');
  
    let isAccepting = true;
  
    toggleBtn.addEventListener('click', () => {
      
      isAccepting = !isAccepting;

      statusText.textContent = isAccepting ? "Accepting Orders" : "Not Accepting Orders";
      
      const host = window.location.origin;
      id = document.getElementById("mess_user_id").value;
      var url = host + "/partner/" + id + "/update_order_accepting/?is_accepting=" + isAccepting;
      fetch(url, {
          method: "GET",
      })
      });
  });
  
async function fetchOrderAcceptingStatus() {
    const host = window.location.origin;
    const id = document.getElementById("mess_user_id").value;
    const url = host + "/partner/" + id + "/get_accept_status/";
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const isAccepting = data.is_accepting;
        
        const toggleBtn = document.getElementById('toggleAcceptBtn');
        const statusText = document.getElementById('acceptStatusText');
        
        if (data) {
            statusText.textContent = isAccepting ? "Accepting Orders" : "Not Accepting Orders";
            toggleBtn.classList.toggle('bg-green-500', isAccepting);
            toggleBtn.classList.toggle('bg-red-500', !isAccepting);
        }
    } catch (error) {
        console.error('Error fetching order accepting status:', error);
    }
}
fetchOrderAcceptingStatus();








document.addEventListener('DOMContentLoaded', fetchOrderAcceptingStatus);

function formatTimeAgo(timestamp) {
    const now = new Date();
    
    // Handle time-only format (HH:MM:SS.mmm)
    if (timestamp.includes(':') && !timestamp.includes('T')) {
        const today = new Date();
        const [hours, minutes, seconds] = timestamp.split(':');
        const [sec, ms] = seconds.split('.');
        
        const past = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            parseInt(hours),
            parseInt(minutes),
            parseInt(sec),
            parseInt(ms || 0)
        );
        
        // If the time is in the future (next day), subtract one day
        if (past > now) {
            past.setDate(past.getDate() - 1);
        }
        
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) {
            return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
        }
        
        return 'More than a day ago';
    }
    
    // Handle full timestamp format
    const past = new Date(timestamp);
    if (isNaN(past.getTime())) {
        return 'Invalid time';
    }
    
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
        return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}
  