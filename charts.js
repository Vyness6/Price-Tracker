/**
 * Charts module for PriceTrack Pro
 * Handles creation and update of charts
 */

import DataService from './data.js';

const ChartManager = {
  charts: {},
  
  // Initialize charts
  init() {
    this.createPriceTrendsChart();
  },
  
  // Create price trends chart
  createPriceTrendsChart(timeframe = 'week') {
    const canvas = document.getElementById('price-trends-chart');
    if (!canvas) return;
    
    // Get data from data service
    const chartData = DataService.getPriceTrendsData(timeframe);
    
    // Destroy existing chart if it exists
    if (this.charts.priceTrends) {
      this.charts.priceTrends.destroy();
    }
    
    // Create new chart
    this.charts.priceTrends = new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        elements: {
          line: {
            tension: 0.3
          },
          point: {
            radius: 2,
            hoverRadius: 5
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return this.charts.priceTrends;
  },
  
  // Update price trends chart with new timeframe
  updatePriceTrendsChart(timeframe) {
    this.createPriceTrendsChart(timeframe);
  },
  
  // Create a product price comparison chart
  createPriceComparisonChart(containerId, productId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Get comparison data
    const comparison = DataService.getPriceComparison(productId);
    if (!comparison || comparison.length === 0) {
      container.innerHTML = '<p class="text-center">No price data available</p>';
      return;
    }
    
    const labels = comparison.map(item => item.supplierName);
    const data = comparison.map(item => item.price);
    const backgroundColor = comparison.map(item => 
      item.isBestPrice ? 'rgba(48, 209, 88, 0.7)' : 'rgba(10, 132, 255, 0.7)'
    );
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return chart;
  },
  
  // Create price history chart for a product and supplier
  createPriceHistoryChart(containerId, productId, supplierId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Get product data
    const product = DataService.getProduct(productId);
    const supplier = DataService.getSupplier(supplierId);
    
    if (!product || !supplier) {
      container.innerHTML = '<p class="text-center">No data available</p>';
      return;
    }
    
    // Filter history for this supplier
    const history = product.priceHistory
      .filter(h => h.supplierId === supplierId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (history.length === 0) {
      container.innerHTML = '<p class="text-center">No price history available</p>';
      return;
    }
    
    const labels = history.map(item => item.date);
    const data = history.map(item => item.price);
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${product.name} - ${supplier.name}`,
          data: data,
          borderColor: 'rgba(10, 132, 255, 1)',
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 6
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return chart;
  },
  
  // Create savings opportunities chart
  createSavingsOpportunitiesChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Get opportunities data
    const opportunities = DataService.getSavingsOpportunities();
    
    if (opportunities.length === 0) {
      container.innerHTML = '<p class="text-center">No savings opportunities found</p>';
      return;
    }
    
    // Limit to top 5 opportunities
    const topOpportunities = opportunities.slice(0, 5);
    
    const labels = topOpportunities.map(item => item.productName);
    const currentPrices = topOpportunities.map(item => item.currentPrice);
    const bestPrices = topOpportunities.map(item => item.bestPrice);
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Current Price',
            data: currentPrices,
            backgroundColor: 'rgba(255, 69, 58, 0.7)',
            borderColor: 'rgba(255, 69, 58, 1)',
            borderWidth: 1
          },
          {
            label: 'Best Price',
            data: bestPrices,
            backgroundColor: 'rgba(48, 209, 88, 0.7)',
            borderColor: 'rgba(48, 209, 88, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `$${value}`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.y);
                }
                return label;
              },
              afterBody: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                const opportunity = topOpportunities[index];
                return [
                  '',
                  `Supplier: ${opportunity.currentSupplierName} → ${opportunity.bestSupplierName}`,
                  `Savings: ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(opportunity.savings)} (${opportunity.savingsPercent.toFixed(1)}%)`
                ];
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return chart;
  }
};

export default ChartManager;