let myChart; // Global chart instance

export function Adminchart() {
    const canvas = document.getElementById('myChart');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    var ctx = canvas.getContext('2d');

    // ✅ Get current theme mode
    const isDarkMode = document.documentElement.classList.contains('dark');

    // ✅ Define colors dynamically
    const textColor = isDarkMode ? '#ffffff' : '#000000';
    const axisLineColor = isDarkMode ? '#ffffff' : '#000000'; // Axis line color

    // ✅ Destroy existing chart before creating a new one (only if it's already initialized)
    if (myChart instanceof Chart) {
        myChart.destroy(); // Safely destroy the chart instance
    }

    // ✅ Create a new chart instance
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Dummy Data',
                data: [12, 19, 3, 5, 2, 3],
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
                        color: textColor // ✅ Labels now change correctly
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor }, // ✅ X-axis label color updates
                    grid: { display: false }, // ✅ X-axis grid color
                    borderColor: axisLineColor, // ✅ X-axis line color
                    borderWidth: 4 // ✅ X-axis line thickness
                },
                y: {
                    ticks: { color: textColor }, // ✅ Y-axis label color updates
                    grid: { display: false }, // ✅ Y-axis grid color
                    borderColor: axisLineColor, // ✅ Y-axis line color
                    borderWidth: 4 // ✅ Y-axis line thickness
                }
            }
        }
    });
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
