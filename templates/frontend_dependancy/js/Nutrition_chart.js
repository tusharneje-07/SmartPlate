<script>
    const ctx = document.getElementById('intakeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Protein', 'Carbs', 'Fats', 'Vitamins'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    '#15803D', // Dark Green (Green-700)
                    '#16A34A', // Green-600
                    '#22C55E', // Green-500
                    '#4ADE80'  // Green-400
                ],
                borderColor: '#000',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#000000' // Black for better contrast
                    }
                }
            }
        }
    });
</script>