// Sample transaction data
export const data = [
    {
        date: "2024-03-17",
        time: "12:30",
        order_id: "ORD001",
        order_details: "Premium Package",
        total: "$150.00",
        status: "Completed"
    },
    {
        date: "2024-03-17",
        time: "12:30",
        order_id: "ORD001",
        order_details: "Premium Package",
        total: "$150.00",
        status: "Completed"
    },
    {
        date: "2024-03-17",
        time: "12:30",
        order_id: "ORD001",
        order_details: "Premium Package",
        total: "$160.00",
        status: "Completed"
    },
    {
        date: "2024-03-17",
        time: "12:30",
        order_id: "ORD001",
        order_details: "Premium Package",
        total: "$170.00",
        status: "Completed"
    },
    {
        date: "2024-03-17",
        time: "12:30",
        order_id: "ORD001",
        order_details: "Premium Package",
        total: "$150.00",
        status: "Completed"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    },
    {
        date: "2024-03-18",
        time: "14:45",
        order_id: "ORD002",
        order_details: "Basic Package",
        total: "$100.00",
        status: "Pending"
    }
];

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredData = [...data];

// Make filteredData accessible to the download functions
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

    filteredData = [...data];

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
            const itemAmount = parseFloat(item.total.replace('$', ''));
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
    generateTable(filteredData);

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
        filteredData = [...data];
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
});