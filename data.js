/**
 * Data management module for PriceTrack Pro
 * Handles data storage, retrieval, and manipulation
 */

// Initialize local storage with sample data if empty
const initializeData = () => {
    if (!localStorage.getItem('priceTrackData')) {
      const sampleData = {
        suppliers: [
          {
            id: 's1',
            name: 'Global Supplies Inc.',
            contact: 'John Smith',
            phone: '+1 (555) 123-4567',
            email: 'john@globalsupplies.com',
            notes: 'Reliable supplier with good prices. Orders must be placed 3 days in advance.',
            productCount: 12,
            avgPriceChange: -2.5
          },
          {
            id: 's2',
            name: 'Value Distributors',
            contact: 'Sarah Johnson',
            phone: '+1 (555) 987-6543',
            email: 'sarah@valuedist.com',
            notes: 'Best prices for electronics. Weekly deliveries on Monday.',
            productCount: 8,
            avgPriceChange: 1.8
          },
          {
            id: 's3',
            name: 'Local Wholesale Co.',
            contact: 'Mike Davis',
            phone: '+1 (555) 456-7890',
            email: 'mike@localwholesale.com',
            notes: 'Same-day delivery available. Minimum order $200.',
            productCount: 15,
            avgPriceChange: -3.2
          },
          {
            id: 's4',
            name: 'Premium Goods Ltd.',
            contact: 'Lisa Wong',
            phone: '+1 (555) 234-5678',
            email: 'lisa@premiumgoods.com',
            notes: 'High quality products but premium prices. 30-day payment terms.',
            productCount: 6,
            avgPriceChange: 0.5
          }
        ],
        products: [
          {
            id: 'p1',
            name: 'Rice (50kg)',
            category: 'grocery',
            sku: 'GRO-RICE-50',
            prices: [
              {
                supplierId: 's1',
                price: 42.50,
                lastUpdated: '2025-01-15'
              },
              {
                supplierId: 's3',
                price: 39.99,
                lastUpdated: '2025-01-18'
              }
            ],
            priceHistory: [
              {
                supplierId: 's1',
                price: 45.00,
                date: '2024-12-20'
              },
              {
                supplierId: 's1',
                price: 42.50,
                date: '2025-01-15'
              },
              {
                supplierId: 's3',
                price: 41.25,
                date: '2024-12-15'
              },
              {
                supplierId: 's3',
                price: 39.99,
                date: '2025-01-18'
              }
            ]
          },
          {
            id: 'p2',
            name: 'Cooking Oil (10L)',
            category: 'grocery',
            sku: 'GRO-OIL-10L',
            prices: [
              {
                supplierId: 's1',
                price: 28.75,
                lastUpdated: '2025-01-12'
              },
              {
                supplierId: 's3',
                price: 27.50,
                lastUpdated: '2025-01-17'
              },
              {
                supplierId: 's4',
                price: 32.99,
                lastUpdated: '2025-01-05'
              }
            ],
            priceHistory: [
              {
                supplierId: 's1',
                price: 26.50,
                date: '2024-12-10'
              },
              {
                supplierId: 's1',
                price: 28.75,
                date: '2025-01-12'
              },
              {
                supplierId: 's3',
                price: 27.50,
                date: '2025-01-17'
              },
              {
                supplierId: 's4',
                price: 30.99,
                date: '2024-12-20'
              },
              {
                supplierId: 's4',
                price: 32.99,
                date: '2025-01-05'
              }
            ]
          },
          {
            id: 'p3',
            name: 'Sugar (25kg)',
            category: 'grocery',
            sku: 'GRO-SUGAR-25',
            prices: [
              {
                supplierId: 's1',
                price: 19.99,
                lastUpdated: '2025-01-10'
              },
              {
                supplierId: 's3',
                price: 18.50,
                lastUpdated: '2025-01-15'
              }
            ],
            priceHistory: [
              {
                supplierId: 's1',
                price: 21.50,
                date: '2024-12-05'
              },
              {
                supplierId: 's1',
                price: 19.99,
                date: '2025-01-10'
              },
              {
                supplierId: 's3',
                price: 18.50,
                date: '2025-01-15'
              }
            ]
          },
          {
            id: 'p4',
            name: 'Basic Smartphone',
            category: 'electronics',
            sku: 'ELE-PHONE-B1',
            prices: [
              {
                supplierId: 's2',
                price: 89.99,
                lastUpdated: '2025-01-18'
              },
              {
                supplierId: 's4',
                price: 99.50,
                lastUpdated: '2025-01-12'
              }
            ],
            priceHistory: [
              {
                supplierId: 's2',
                price: 95.00,
                date: '2024-12-15'
              },
              {
                supplierId: 's2',
                price: 89.99,
                date: '2025-01-18'
              },
              {
                supplierId: 's4',
                price: 99.50,
                date: '2025-01-12'
              }
            ]
          },
          {
            id: 'p5',
            name: 'T-shirts (Pack of 5)',
            category: 'apparel',
            sku: 'APP-TSHIRT-5PK',
            prices: [
              {
                supplierId: 's2',
                price: 12.50,
                lastUpdated: '2025-01-08'
              },
              {
                supplierId: 's3',
                price: 14.75,
                lastUpdated: '2025-01-20'
              }
            ],
            priceHistory: [
              {
                supplierId: 's2',
                price: 10.99,
                date: '2024-12-10'
              },
              {
                supplierId: 's2',
                price: 12.50,
                date: '2025-01-08'
              },
              {
                supplierId: 's3',
                price: 13.25,
                date: '2024-12-20'
              },
              {
                supplierId: 's3',
                price: 14.75,
                date: '2025-01-20'
              }
            ]
          },
          {
            id: 'p6',
            name: 'Cookware Set',
            category: 'home-goods',
            sku: 'HG-COOKSET-B',
            prices: [
              {
                supplierId: 's1',
                price: 65.75,
                lastUpdated: '2025-01-05'
              },
              {
                supplierId: 's4',
                price: 79.99,
                lastUpdated: '2025-01-15'
              }
            ],
            priceHistory: [
              {
                supplierId: 's1',
                price: 68.25,
                date: '2024-12-15'
              },
              {
                supplierId: 's1',
                price: 65.75,
                date: '2025-01-05'
              },
              {
                supplierId: 's4',
                price: 79.99,
                date: '2025-01-15'
              }
            ]
          }
        ],
        alerts: [
          {
            id: 'a1',
            type: 'price-drop',
            productId: 'p1',
            supplierId: 's3',
            oldPrice: 41.25,
            newPrice: 39.99,
            date: '2025-01-18',
            read: false
          },
          {
            id: 'a2',
            type: 'price-increase',
            productId: 'p2',
            supplierId: 's4',
            oldPrice: 30.99,
            newPrice: 32.99,
            date: '2025-01-05',
            read: true
          },
          {
            id: 'a3',
            type: 'opportunity',
            productId: 'p3',
            supplierId: 's3',
            bestPrice: 18.50,
            savings: 1.49,
            date: '2025-01-15',
            read: false
          }
        ]
      };
      
      localStorage.setItem('priceTrackData', JSON.stringify(sampleData));
      return sampleData;
    }
    
    return JSON.parse(localStorage.getItem('priceTrackData'));
  };
  
  // Data service object
  const DataService = {
    data: null,
    
    // Initialize data
    init() {
      this.data = initializeData();
      return this.data;
    },
    
    // Save data to local storage
    saveData() {
      localStorage.setItem('priceTrackData', JSON.stringify(this.data));
    },
    
    // Get all suppliers
    getSuppliers() {
      return this.data.suppliers;
    },
    
    // Get supplier by ID
    getSupplier(id) {
      return this.data.suppliers.find(supplier => supplier.id === id);
    },
    
    // Add new supplier
    addSupplier(supplier) {
      // Generate ID if not provided
      if (!supplier.id) {
        supplier.id = 's' + (this.data.suppliers.length + 1);
      }
      
      // Set default values
      supplier.productCount = 0;
      supplier.avgPriceChange = 0;
      
      this.data.suppliers.push(supplier);
      this.saveData();
      return supplier;
    },
    
    // Update supplier
    updateSupplier(updatedSupplier) {
      const index = this.data.suppliers.findIndex(s => s.id === updatedSupplier.id);
      if (index !== -1) {
        this.data.suppliers[index] = { ...this.data.suppliers[index], ...updatedSupplier };
        this.saveData();
        return this.data.suppliers[index];
      }
      return null;
    },
    
    // Delete supplier
    deleteSupplier(id) {
      const index = this.data.suppliers.findIndex(s => s.id === id);
      if (index !== -1) {
        this.data.suppliers.splice(index, 1);
        
        // Remove supplier prices from products
        this.data.products.forEach(product => {
          product.prices = product.prices.filter(price => price.supplierId !== id);
          product.priceHistory = product.priceHistory.filter(history => history.supplierId !== id);
        });
        
        // Remove alerts related to this supplier
        this.data.alerts = this.data.alerts.filter(alert => alert.supplierId !== id);
        
        this.saveData();
        return true;
      }
      return false;
    },
    
    // Get all products
    getProducts() {
      return this.data.products;
    },
    
    // Get product by ID
    getProduct(id) {
      return this.data.products.find(product => product.id === id);
    },
    
    // Add new product
    addProduct(product) {
      // Generate ID if not provided
      if (!product.id) {
        product.id = 'p' + (this.data.products.length + 1);
      }
      
      // Ensure price history exists
      if (!product.priceHistory) {
        product.priceHistory = [];
        
        // Initialize price history from current prices
        if (product.prices) {
          const today = new Date().toISOString().split('T')[0];
          product.priceHistory = product.prices.map(price => ({
            supplierId: price.supplierId,
            price: price.price,
            date: today
          }));
          
          // Update lastUpdated field for prices
          product.prices.forEach(price => {
            price.lastUpdated = today;
          });
        }
      }
      
      this.data.products.push(product);
      
      // Update supplier product counts
      this._updateSupplierStats();
      
      this.saveData();
      return product;
    },
    
    // Update product
    updateProduct(updatedProduct) {
      const index = this.data.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.data.products[index] = { ...this.data.products[index], ...updatedProduct };
        
        // Update supplier product counts
        this._updateSupplierStats();
        
        this.saveData();
        return this.data.products[index];
      }
      return null;
    },
    
    // Delete product
    deleteProduct(id) {
      const index = this.data.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.data.products.splice(index, 1);
        
        // Remove alerts related to this product
        this.data.alerts = this.data.alerts.filter(alert => alert.productId !== id);
        
        // Update supplier product counts
        this._updateSupplierStats();
        
        this.saveData();
        return true;
      }
      return false;
    },
    
    // Update product price
    updateProductPrice(productId, supplierId, newPrice) {
      const product = this.getProduct(productId);
      if (!product) return null;
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if price exists for this supplier
      const priceIndex = product.prices.findIndex(p => p.supplierId === supplierId);
      
      if (priceIndex !== -1) {
        const oldPrice = product.prices[priceIndex].price;
        
        // Update existing price
        product.prices[priceIndex].price = newPrice;
        product.prices[priceIndex].lastUpdated = today;
        
        // Add to price history
        product.priceHistory.push({
          supplierId,
          price: newPrice,
          date: today
        });
        
        // Create alert if price changed significantly (more than 2%)
        const priceDiff = ((newPrice - oldPrice) / oldPrice) * 100;
        
        if (Math.abs(priceDiff) >= 2) {
          const alertType = priceDiff < 0 ? 'price-drop' : 'price-increase';
          
          this.addAlert({
            type: alertType,
            productId,
            supplierId,
            oldPrice,
            newPrice,
            date: today,
            read: false
          });
        }
        
        // Check if this is now the best price
        this._checkBestPriceOpportunity(product, supplierId, newPrice);
      } else {
        // Add new price
        product.prices.push({
          supplierId,
          price: newPrice,
          lastUpdated: today
        });
        
        // Add to price history
        product.priceHistory.push({
          supplierId,
          price: newPrice,
          date: today
        });
        
        // Check if this is now the best price
        this._checkBestPriceOpportunity(product, supplierId, newPrice);
      }
      
      // Update supplier stats
      this._updateSupplierStats();
      
      this.saveData();
      return product;
    },
    
    // Get all alerts
    getAlerts() {
      return this.data.alerts;
    },
    
    // Get unread alerts count
    getUnreadAlertsCount() {
      return this.data.alerts.filter(alert => !alert.read).length;
    },
    
    // Add new alert
    addAlert(alert) {
      // Generate ID if not provided
      if (!alert.id) {
        alert.id = 'a' + (this.data.alerts.length + 1);
      }
      
      this.data.alerts.push(alert);
      this.saveData();
      return alert;
    },
    
    // Mark alert as read
    markAlertAsRead(id) {
      const alert = this.data.alerts.find(a => a.id === id);
      if (alert) {
        alert.read = true;
        this.saveData();
        return true;
      }
      return false;
    },
    
    // Delete alert
    deleteAlert(id) {
      const index = this.data.alerts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.data.alerts.splice(index, 1);
        this.saveData();
        return true;
      }
      return false;
    },
    
    // Get price trends data for a specific time period
    getPriceTrendsData(timeframe = 'month') {
      const now = new Date();
      let startDate;
      
      // Calculate start date based on timeframe
      switch (timeframe) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          break;
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
      }
      
      startDate = startDate.toISOString().split('T')[0];
      
      // Get top 5 products by price change activity
      const products = this.data.products.slice(0, 5);
      const suppliers = this.data.suppliers;
      
      // Format data for chart.js
      const datasets = [];
      const labels = [];
      
      // Generate date labels
      const labelDate = new Date(startDate);
      const endDate = new Date(now);
      
      while (labelDate <= endDate) {
        labels.push(labelDate.toISOString().split('T')[0]);
        labelDate.setDate(labelDate.getDate() + 7); // Weekly data points
      }
      
      // Generate datasets for each product
      products.forEach((product, index) => {
        const supplierIds = [...new Set(product.priceHistory.map(history => history.supplierId))];
        
        supplierIds.forEach(supplierId => {
          const supplier = suppliers.find(s => s.id === supplierId);
          if (!supplier) return;
          
          const filteredHistory = product.priceHistory
            .filter(history => history.supplierId === supplierId && history.date >= startDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          if (filteredHistory.length > 0) {
            // Generate data points
            const data = [];
            let currentPrice = filteredHistory[0].price;
            
            labels.forEach(label => {
              // Find price for this date or use the most recent price before this date
              const pricePoint = filteredHistory.find(history => history.date === label);
              if (pricePoint) {
                currentPrice = pricePoint.price;
              }
              data.push(currentPrice);
            });
            
            datasets.push({
              label: `${product.name} - ${supplier.name}`,
              data: data,
              borderColor: this._getChartColor(index, supplierIds.indexOf(supplierId)),
              backgroundColor: this._getChartColor(index, supplierIds.indexOf(supplierId), 0.1),
              tension: 0.3
            });
          }
        });
      });
      
      return {
        labels,
        datasets
      };
    },
    
    // Get recent price updates
    getRecentPriceUpdates(limit = 10) {
      const allUpdates = [];
      
      this.data.products.forEach(product => {
        product.priceHistory.forEach(history => {
          const supplier = this.getSupplier(history.supplierId);
          if (supplier) {
            allUpdates.push({
              productId: product.id,
              productName: product.name,
              supplierId: history.supplierId,
              supplierName: supplier.name,
              price: history.price,
              date: history.date
            });
          }
        });
      });
      
      // Sort by date (newest first) and limit
      return allUpdates
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    },
    
    // Get price comparison for all suppliers for a product
    getPriceComparison(productId) {
      const product = this.getProduct(productId);
      if (!product) return null;
      
      const comparison = [];
      let bestPrice = Infinity;
      
      // Find the best price
      product.prices.forEach(price => {
        if (price.price < bestPrice) {
          bestPrice = price.price;
        }
      });
      
      // Build comparison data
      product.prices.forEach(price => {
        const supplier = this.getSupplier(price.supplierId);
        if (supplier) {
          comparison.push({
            supplierId: price.supplierId,
            supplierName: supplier.name,
            price: price.price,
            lastUpdated: price.lastUpdated,
            isBestPrice: price.price === bestPrice
          });
        }
      });
      
      // Sort by price (lowest first)
      return comparison.sort((a, b) => a.price - b.price);
    },
    
    // Get potential savings opportunities
    getSavingsOpportunities() {
      const opportunities = [];
      
      this.data.products.forEach(product => {
        if (product.prices.length < 2) return; // Need at least 2 suppliers to compare
        
        let bestPrice = Infinity;
        let bestSupplierId = null;
        let currentSupplierId = null;
        let currentPrice = null;
        
        // Find current and best prices
        product.prices.forEach(price => {
          if (price.price < bestPrice) {
            bestPrice = price.price;
            bestSupplierId = price.supplierId;
          }
          
          // Assume the most recently updated price is the current one
          if (!currentSupplierId || new Date(price.lastUpdated) > new Date(currentPrice.lastUpdated)) {
            currentSupplierId = price.supplierId;
            currentPrice = price;
          }
        });
        
        // If current supplier is not the best, calculate savings
        if (currentSupplierId !== bestSupplierId) {
          const bestSupplier = this.getSupplier(bestSupplierId);
          const currentSupplier = this.getSupplier(currentSupplierId);
          
          if (bestSupplier && currentSupplier) {
            const savings = currentPrice.price - bestPrice;
            const savingsPercent = (savings / currentPrice.price) * 100;
            
            opportunities.push({
              productId: product.id,
              productName: product.name,
              currentSupplierId,
              currentSupplierName: currentSupplier.name,
              currentPrice: currentPrice.price,
              bestSupplierId,
              bestSupplierName: bestSupplier.name,
              bestPrice,
              savings,
              savingsPercent
            });
          }
        }
      });
      
      // Sort by savings amount (highest first)
      return opportunities.sort((a, b) => b.savings - a.savings);
    },
    
    // Get price drop and increase stats
    getPriceChangeStats(timeframe = 'week') {
      const now = new Date();
      let startDate;
      
      // Calculate start date based on timeframe
      switch (timeframe) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          break;
        default:
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
      }
      
      startDate = startDate.toISOString().split('T')[0];
      
      let priceDrops = 0;
      let priceIncreases = 0;
      let totalSavings = 0;
      
      // Analyze price changes
      this.data.products.forEach(product => {
        // Group price history by supplier
        const supplierHistory = {};
        
        product.priceHistory.forEach(history => {
          if (!supplierHistory[history.supplierId]) {
            supplierHistory[history.supplierId] = [];
          }
          supplierHistory[history.supplierId].push(history);
        });
        
        // For each supplier, find price changes
        Object.values(supplierHistory).forEach(history => {
          // Sort by date
          history.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          // Find the price at the start of the period
          const startPrice = history.find(h => h.date <= startDate);
          
          if (!startPrice) return; // No data for this period
          
          // Find the most recent price
          const endPrice = history[history.length - 1];
          
          // Calculate price change
          const priceDiff = endPrice.price - startPrice.price;
          
          if (priceDiff < 0) {
            priceDrops++;
            totalSavings -= priceDiff; // Convert to positive number
          } else if (priceDiff > 0) {
            priceIncreases++;
          }
        });
      });
      
      // Get best deal opportunities
      const opportunities = this.getSavingsOpportunities();
      
      return {
        priceDrops,
        priceIncreases,
        totalSavings,
        opportunitiesCount: opportunities.length
      };
    },
    
    // Private: Update supplier statistics
    _updateSupplierStats() {
      // Reset counts
      this.data.suppliers.forEach(supplier => {
        supplier.productCount = 0;
        let totalPriceChange = 0;
        let priceChangeCount = 0;
        
        // Count products and calculate price changes
        this.data.products.forEach(product => {
          const prices = product.prices.filter(price => price.supplierId === supplier.id);
          if (prices.length > 0) {
            supplier.productCount++;
            
            // Calculate price change if history exists
            const history = product.priceHistory.filter(h => h.supplierId === supplier.id);
            if (history.length >= 2) {
              // Sort by date
              history.sort((a, b) => new Date(a.date) - new Date(b.date));
              
              // Get oldest and newest prices
              const oldestPrice = history[0].price;
              const newestPrice = history[history.length - 1].price;
              
              // Calculate percentage change
              const priceChange = ((newestPrice - oldestPrice) / oldestPrice) * 100;
              totalPriceChange += priceChange;
              priceChangeCount++;
            }
          }
        });
        
        // Calculate average price change
        supplier.avgPriceChange = priceChangeCount > 0 ? totalPriceChange / priceChangeCount : 0;
      });
    },
    
    // Private: Check if a new price creates a best price opportunity
    _checkBestPriceOpportunity(product, supplierId, newPrice) {
      // Find the current best price excluding this supplier
      let currentBestPrice = Infinity;
      let currentBestSupplierId = null;
      
      product.prices.forEach(price => {
        if (price.supplierId !== supplierId && price.price < currentBestPrice) {
          currentBestPrice = price.price;
          currentBestSupplierId = price.supplierId;
        }
      });
      
      // If this is a new best price with significant savings (>5%)
      if (newPrice < currentBestPrice && currentBestSupplierId) {
        const savings = currentBestPrice - newPrice;
        const savingsPercent = (savings / currentBestPrice) * 100;
        
        if (savingsPercent >= 5) {
          const today = new Date().toISOString().split('T')[0];
          
          this.addAlert({
            type: 'opportunity',
            productId: product.id,
            supplierId,
            bestPrice: newPrice,
            savings,
            date: today,
            read: false
          });
        }
      }
    },
    
    // Private: Generate colors for charts
    _getChartColor(productIndex, supplierIndex, alpha = 1) {
      const colors = [
        `rgba(10, 132, 255, ${alpha})`, // blue
        `rgba(48, 209, 88, ${alpha})`,  // green
        `rgba(255, 159, 10, ${alpha})`, // orange
        `rgba(94, 92, 230, ${alpha})`,  // purple
        `rgba(255, 69, 58, ${alpha})`,  // red
        `rgba(100, 210, 255, ${alpha})` // light blue
      ];
      
      const colorIndex = (productIndex + supplierIndex) % colors.length;
      return colors[colorIndex];
    }
  };
  
  // Initialize data
  DataService.init();
  
  export default DataService;