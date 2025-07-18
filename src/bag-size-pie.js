// Pie chart for bag size proportions using Chart.js and PapaParse
let pieChart = null;
let allData = [];

function renderPieChart(year) {
  let small = 0, large = 0, xlarge = 0;
  allData.forEach(row => {
    if (year === 'all' || row.year === year) {
      small += parseFloat(row['Small Bags']) || 0;
      large += parseFloat(row['Large Bags']) || 0;
      xlarge += parseFloat(row['XLarge Bags']) || 0;
    }
  });
  const chartCanvas = document.getElementById('bagSizePieChart');
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext('2d');
  if (pieChart) pieChart.destroy();
  // Always show all bag sizes
  const dataArr = [small, large, xlarge];
  const labelArr = ['Small Bags', 'Large Bags', 'XLarge Bags'];
  const colorArr = ['#81C784', '#4CAF50', '#FF6F61'];
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labelArr,
      datasets: [{
        data: dataArr,
        backgroundColor: colorArr,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false }
      }
    }
  });
}

Papa.parse('data/avocado.csv', {
  download: true,
  header: true,
  complete: function(results) {
    allData = results.data;
    // Populate year select
    const yearSet = new Set(allData.map(row => row.year).filter(Boolean));
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      yearSelect.innerHTML = '<option value="all">All Years</option>' +
        Array.from(yearSet).sort().map(y => `<option value="${y}">${y}</option>`).join('');
      yearSelect.addEventListener('change', function() {
        renderPieChart(this.value);
      });
    }
    // No bag size checkboxes to listen for
    renderPieChart('all');
  }
});
