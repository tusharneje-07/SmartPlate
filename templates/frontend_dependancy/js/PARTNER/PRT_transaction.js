// Remove hardcoded data and add API call
let filteredData = [];
let originalData = [];
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

// Function to fetch transaction data from backend
async function fetchTransactionData() {
    try {
        const host = window.location.origin;
        const messIdElement = document.getElementById("mess_user_id");
        
        if (!messIdElement) {
            console.error('mess_user_id element not found. Retrying in 1 second...');
            setTimeout(fetchTransactionData, 1000);
            return;
        }
        
        const id = messIdElement.value;
        if (!id) {
            console.error('mess_user_id value is empty');
            return;
        }
        
        const url = `${host}/partner/${id}/get_all_transaction/`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch transaction data');
        }
        
        const data = await response.json();
        
        // Update to use the correct property name 'transaction'
        originalData = data.transaction || [];
        filteredData = [...originalData];
        
        // Log the data to verify
        console.log('Processed data:', originalData);
        
        generateTable(filteredData);
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        const tableContainer = document.getElementById('tableContainer');
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="text-center p-4 text-red-500">
                    Error loading transaction data. Please try again later.
                </div>
            `;
        }
    }
}

// fetchTransactionData();

window.getAllFilteredData = function() {
    return filteredData;
};

function generateTableHeaders(data) {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map(key =>
        key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    );
}

function calculateColumnWidths(headers, data) {
    return headers.map((header, index) => {
        const headerWidth = header.length;
        const contentWidths = data.map(row => String(Object.values(row)[index]).length);
        return Math.max(headerWidth, ...contentWidths);
    });
}

function updatePaginationInfo() {
    const startRecord = filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);
    const totalRecords = filteredData.length;

    document.getElementById('startRecord').textContent = startRecord;
    document.getElementById('endRecord').textContent = endRecord;
    document.getElementById('totalRecords').textContent = totalRecords;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = endRecord >= totalRecords;
}

function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    const headers = generateTableHeaders(data);
    const columnWidths = calculateColumnWidths(headers, data);

    const table = document.createElement('table');
    table.className = 'w-full border-collapse border dark:border-[color:var(--textPrimaryDark)]';
    table.style.borderColor = 'var(--textPrimaryLight)';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.className = 'border dark:border-[color:var(--textPrimaryDark)] bg-secbackgroundLight dark:bg-secbackgroundDark p-4 text-left text-textPrimaryLight dark:text-textPrimaryDark';
        th.style.minWidth = `${columnWidths[index] * 12}px`;
        th.style.borderColor = 'var(--textPrimaryLight)';
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = headers.length;
        emptyCell.className = 'border dark:border-[color:var(--textPrimaryDark)] p-4 text-center text-textPrimaryLight dark:text-textPrimaryDark';
        emptyCell.style.borderColor = 'var(--textPrimaryLight)';
        emptyCell.textContent = 'No records found';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    } else {
        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach((value, colIndex) => {
                const td = document.createElement('td');
                td.className = 'border dark:border-[color:var(--textPrimaryDark)] p-4 text-textPrimaryLight dark:text-textPrimaryDark';
                td.style.minWidth = `${columnWidths[colIndex] * 12}px`;
                td.style.borderColor = 'var(--textPrimaryLight)';
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
    updatePaginationInfo();
}

function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;
    const amountOperator = document.getElementById('amountOperator').value;
    const amountFilter = document.getElementById('amountFilter').value;

    filteredData = [...originalData];

    if (dateFilter) {
        filteredData = filteredData.filter(item => item.date === dateFilter);
    }

    if (timeFilter) {
        const selectedHour = timeFilter.split(':')[0];
        filteredData = filteredData.filter(item => {
            const itemHour = item.time.split(':')[0];
            return itemHour === selectedHour;
        });
    }

    if (amountFilter) {
        const filterAmount = parseFloat(amountFilter);
        filteredData = filteredData.filter(item => {
            const itemAmount = parseFloat(item.total_price);
            switch (amountOperator) {
                case '=':
                    return itemAmount === filterAmount;
                case '<':
                    return itemAmount < filterAmount;
                case '>':
                    return itemAmount > filterAmount;
                default:
                    return true;
            }
        });
    }

    currentPage = 1;
    generateTable(filteredData);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial data fetch with retry mechanism
    let retryCount = 0;
    const maxRetries = 5;
    
    function tryFetch() {
        if (retryCount < maxRetries) {
            fetchTransactionData();
            retryCount++;
        } else {
            console.error('Failed to initialize after multiple attempts');
        }
    }
    
    tryFetch();

    // Set up filter event listeners
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('timeFilter').addEventListener('change', applyFilters);
    document.getElementById('amountOperator').addEventListener('change', applyFilters);
    document.getElementById('amountFilter').addEventListener('input', applyFilters);

    // Clear filters functionality
    document.getElementById('clearFilters').addEventListener('click', () => {
        // Reset filter inputs
        document.getElementById('dateFilter').value = '';
        document.getElementById('timeFilter').value = '';
        document.getElementById('amountOperator').value = '=';
        document.getElementById('amountFilter').value = '';

        // Reset filtered data to original data
        filteredData = [...originalData];
        currentPage = 1;
        generateTable(filteredData);
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            generateTable(filteredData);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const maxPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (currentPage < maxPage) {
            currentPage++;
            generateTable(filteredData);
        }
    });

    // Live Clock
    const timeDisplay = document.getElementById('currentTime');
    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Refresh data every 30 seconds
    setInterval(fetchTransactionData, 30000);
});