let myChart;

export async function Adminchart() {
    const canvas = document.getElementById('myChart');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    var ctx = canvas.getContext('2d');

    // Get current theme mode
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Define colors dynamically
    const textColor = isDarkMode ? '#ffffff' : '#000000';
    const axisLineColor = isDarkMode ? '#ffffff' : '#000000';

    // Get the mess user ID from the hidden input
    const messUserId = document.getElementById('mess_user_id').value;
    
    try {
        // Fetch order time distribution data
        const response = await fetch(`${messUserId}/get_order_time_distribution/`);
        const data = await response.json();

        if (myChart instanceof Chart) {
            myChart.destroy();
        }

        // Create a new chart instance with fetched data
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Orders per Time Slot',
                    data: data.values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { display: false },
                        borderColor: axisLineColor,
                        borderWidth: 4
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { display: false },
                        borderColor: axisLineColor,
                        borderWidth: 4
                    }
                }
            }
        });

        // Set up interval to update chart every minute
        setInterval(async () => {
            try {
                const newResponse = await fetch(`${messUserId}/get_order_time_distribution/`);
                const newData = await newResponse.json();
                
                if (myChart instanceof Chart) {
                    myChart.data.labels = newData.labels;
                    myChart.data.datasets[0].data = newData.values;
                    myChart.update();
                }
            } catch (error) {
                console.error('Error updating chart data:', error);
            }
        }, 30000); // 60000 milliseconds = 1 minute

    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// ✅ Theme change detection (Fixes dark → light issue)
const updateTheme = () => {
    setTimeout(Adminchart, 10); // Small delay ensures proper update
};

// ✅ Detect Tailwind dark mode class change
const observer = new MutationObserver(updateTheme);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

// ✅ Call function on page load
document.addEventListener('DOMContentLoaded', Adminchart);
