// Create a simple donut chart implementation
class DonutChart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.render();
  }

  render() {
    const { width, height } = this.ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Increase chart size
    const outerRadius = Math.min(width, height) / 2.1; 
    const innerRadius = outerRadius * 0.65;
    const fontSize = Math.min(width, height) / 12; // Larger text size

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;
    const total = this.config.data.datasets[0].data.reduce((a, b) => a + b, 0);

    // Draw donut segments using shades of green
    this.config.data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (2 * Math.PI * value) / total;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      this.ctx.closePath();

      this.ctx.fillStyle = this.config.data.datasets[0].backgroundColor[index];
      this.ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw labels
    startAngle = -Math.PI / 2;
    this.config.data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (2 * Math.PI * value) / total;
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = outerRadius * 1.3; // Push labels further out
      const x = centerX + Math.cos(midAngle) * labelRadius;
      const y = centerY + Math.sin(midAngle) * labelRadius;

      // Draw value with larger text
      this.ctx.fillStyle = this.config.data.datasets[0].backgroundColor[index];
      this.ctx.font = `bold ${fontSize * 0.9}px Inter, Arial, sans-serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(`${value}${this.config.data.units[index]}`, x, y);

      // Draw label with increased size
      this.ctx.font = `${fontSize * 0.5}px Inter, Arial, sans-serif`;
      this.ctx.fillText(this.config.data.labels[index], x, y + fontSize * 0.7);

      startAngle += sliceAngle;
    });

    // Draw center text
    this.ctx.fillStyle = '#1a202c';
    this.ctx.font = `${fontSize * 1.5}px Inter, Arial, sans-serif`; // Larger center text
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Nutrition", centerX, centerY);
  }
}

// Function to render the chart
export function renderNutritionChart(canvasId, protein, carbs, calories) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas with id ${canvasId} not found!`);
    return;
  }

  const container = canvas.parentElement;
  
  // Increase canvas size for a larger chart
  canvas.width = container.clientWidth;
  canvas.height = 350; // Increased height

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not found!");
    return;
  }

  new DonutChart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Protein", "Carbs", "Calories"],
      units: ["g", "g", "kcal"],
      datasets: [
        {
          data: [protein, carbs, calories],
          backgroundColor: ["#2E7D32", "#66BB6A", "#A5D6A7"], // Shades of green
        },
      ],
    },
  });
}
