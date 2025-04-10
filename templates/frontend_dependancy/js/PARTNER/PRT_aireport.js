import orders from './PRT_orders.js' 

  
// function for generateExpectedCustomerChart parameter wll be the output from genAI model
function generateExpectedCustomerChart(expectedNumbers,predictedNumbers,formattedDates) {
    const ctx = document.getElementById('expectedCustomersChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedDates,
            datasets: [{
                label: 'Visited Customers',
                data: expectedNumbers,
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'Predicted Customers',
                data: predictedNumbers,
                borderColor: 'red',
                fill: false
            }]
        },
        options: { responsive: true }
    });
}

// function for generateExpectedPlateChart parameter wll be the output from genAI model
function generateExpectedPlateChart(expectedNumbers,data2,formattedDates) {
    const ctx = document.getElementById('expectedPlatesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedDates,
            datasets: [{
                label: 'Sold Plates',
                data: expectedNumbers,
                borderColor: 'green',
                fill: false
            },
            {
                label: 'Predicted Plates',
                data: data2,
                borderColor: 'red',
                fill: false
            }]
        },
        options: { responsive: true }
    });
}


// function for rating graph aggregating all the ratings and then generating the graph

function generateCustomerRatingChart(orderData) {
    // Define fixed rating intervals (0 to 5 with step of 0.5)
    const ratingIntervals = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

    // Aggregate rating counts
    const ratingCounts = ratingIntervals.reduce((acc, rating) => {
        acc[rating] = 0; // Initialize count for all ratings
        return acc;
    }, {});

    // Count actual ratings from orderData
    orderData.forEach(order => {
        const rating = order.rating.toFixed(1); // Convert to string to match keys
        if (ratingCounts.hasOwnProperty(rating)) {
            ratingCounts[rating]++;
        }
    });

    // Extract labels (x-axis) and counts (y-axis)
    const labels = Object.keys(ratingCounts); // ["0.0", "0.5", ..., "5.0"]
    const counts = Object.values(ratingCounts); // Count of ratings

    const ctx = document.getElementById('customerRatingChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // X-axis (Ratings from 0 to 5)
            datasets: [{
                label: 'Number of Ratings',
                data: counts, // Y-axis (Count of ratings)
                backgroundColor: 'red'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Ratings' },
                    ticks: {
                        autoSkip: false, // ✅ Force Chart.js to display all labels
                        maxRotation: 0, // ✅ Prevent diagonal labels
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Ratings' },
                    ticks: {
                        stepSize: 10 // ✅ Y-axis increments by 10
                    }
                }
            }
        }
    });
}



// function for myFavoritePlateChart which aggregate the data and then sort it give top 5 sold dishes with its frequency

function generateFavoritePlateChart(names,counts) {
    // if (!orderData || !Array.isArray(orderData)) {
    //     console.error("Invalid order data:", orderData);
    //     return;
    // }
    
    // const menuCounts = orderData.reduce((acc, order) => {
    //     if (!order.menu || !order.quantity) {
    //         console.warn("Skipping order due to missing menu or quantity:", order);
    //         return acc;
    //     }

    //     // Count dish frequency
    //     acc[order.menu] = (acc[order.menu] || 0) + order.quantity;

    //     return acc;
    // }, {});

    // // Sort and get top 5 dishes
    // const sortedDishes = Object.entries(menuCounts)
    //     .sort((a, b) => b[1] - a[1])
    //     .slice(0, 5);

    // const dishNames = sortedDishes.map(item => item[0]);
    // const dishFrequencies = sortedDishes.map(item => item[1]);

    const ctx = document.getElementById('favoritePlateChart')?.getContext('2d');
    if (!ctx) {
        console.error("Canvas element for favoritePlateChart not found!");
        return;
    }

    if (window.myFavoritePlateChart) {
        window.myFavoritePlateChart.destroy();
    }

    window.myFavoritePlateChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Orders Frequency',
                data: counts,
                backgroundColor: 'orange'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}



// default function which we are calling from html inside function all the rest of the functions are called
function initializeCharts() {
    
    async function fetchData() {
        try {
            document.getElementById('analysisText').classList.add('animate-pulse')
            const id = document.getElementById('mess_user_id').value;
            const response = await fetch(`${window.location.origin}/partner/${id}/fetch_ai_report_data/`);
            const data = await response.json();
            
            generateExpectedCustomerChart(data.customer_data,data.predicted_data.predicted_customers_next_week,data.formatted_dates);
            generateExpectedPlateChart(data.plate_count,data.predicted_data.predicted_plates_next_week,data.formatted_dates);
            // generateCustomerRatingChart(data.orders);
            generateFavoritePlateChart(data.predicted_data.popular_dishes,data.popular_dish_counts);
            document.getElementById('analysisText').innerHTML = data.predicted_data.suggestions;
        } catch (error) {
            console.error('Error fetching AI report data:', error);
            generateExpectedCustomerChart([100,120,130,140,100,90,80]);
            generateExpectedPlateChart([100,120,130,140,100,90,80],[10,12,13,14,10,9,8]);
            generateCustomerRatingChart(orders);
            generateFavoritePlateChart(orders);
        }
    }
    fetchData();
}

export { initializeCharts };