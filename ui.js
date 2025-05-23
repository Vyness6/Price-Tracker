/**
 * UI module for PriceTrack Pro
 * Handles UI interactions, rendering, and updates
 */

import DataService from './data.js';

const UI = {
  activeView: 'dashboard',
  
  // Initialize UI
  init() {
    this.setupEventListeners();
    this.renderDashboard();
    this.setupModals();
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });
    
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
    
    // Time filter buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const timeframe = e.currentTarget.getAttribute('data-time');
        this.updateDashboardTimeframe(timeframe);
      });
    });
    
    // Add product buttons
    document.getElementById('add-product-btn')?.addEventListener('click', () => {
      this.openModal('add-product-modal');
    });
    
    document.getElementById('add-product-btn-alt')?.addEventListener('click', () => {
      this.openModal('add-product-modal');
    });
    
    // Add supplier button
    document.getElementById('add-supplier-btn')?.addEventListener('click', () => {
      this.openModal('add-supplier-modal');
    });
    
    // Add supplier price button in product form
    document.getElementById('add-supplier-price-btn')?.addEventListener('click', () => {
      this.addSupplierPriceRow();
    });
    
    // Form submissions
    document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddProduct();
    });
    
    document.getElementById('add-supplier-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddSupplier();
    });
    
    // Category and sort filters
    document.getElementById('category-filter')?.addEventListener('change', () => {
      this.filterProducts();
    });
    
    document.getElementById('sort-by')?.addEventListener('change', () => {
      this.filterProducts();
    });
    
    // Export data button
    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      this.exportData();
    });
  },
  
  // Switch between views
  switchView(view) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(el => {
      el.classList.remove('active-view');
    });
    
    // Show selected view
    document.getElementById(`${view}-view`).classList.add('active-view');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === view) {
        item.classList.add('active');
      }
    });
    
    // Store active view
    this.activeView = view;
    
    // Render view content
    switch (view) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'products':
        this.renderProducts();
        break;
      case 'suppliers':
        this.renderSuppliers();
        break;
      case 'price-alerts':
        this.renderAlerts();
        break;
      case 'reports':
        // Reports view is static for now
        break;
    }
    
    // Apply staggered animations
    this.applyStaggeredAnimations();
  },
  
  // Apply staggered animations to elements
  applyStaggeredAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .supplier-card, .alert-card, .report-card, .product-grid-card, .stat-card');
    
    animatedElements.forEach((el, index) => {
      el.style.setProperty('--index', index);
      el.style.opacity = '0';
      
      // Force reflow
      void el.offsetWidth;
      
      // Apply animation
      el.style.opacity = '';
    });
  },
  
  // Render dashboard
  renderDashboard() {
    this.renderDashboardStats();
    this.renderRecentPriceUpdates();
  },
  
  // Render dashboard statistics
  renderDashboardStats() {
    const stats = DataService.getPriceChangeStats();
    
    // Update stats values
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.priceDrops;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.priceIncreases;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(stats.totalSavings);
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.opportunitiesCount;
  },
  
  // Update dashboard based on timeframe
  updateDashboardTimeframe(timeframe) {
    const stats = DataService.getPriceChangeStats(timeframe);
    
    // Update stats values with animation
    this.animateCounterUpdate('.stat-card:nth-child(1) .stat-value', stats.priceDrops);
    this.animateCounterUpdate('.stat-card:nth-child(2) .stat-value', stats.priceIncreases);
    this.animateCounterUpdate('.stat-card:nth-child(3) .stat-value', stats.totalSavings, true);
    this.animateCounterUpdate('.stat-card:nth-child(4) .stat-value', stats.opportunitiesCount);
    
    // Update timeframe text
    document.querySelectorAll('.stat-caption').forEach(el => {
      const text = el.textContent;
      if (text.includes('week') || text.includes('month') || text.includes('quarter')) {
        el.textContent = text.replace(/(week|month|quarter)/, timeframe);
      }
    });
    
    // Update chart
    if (window.ChartManager) {
      window.ChartManager.updatePriceTrendsChart(timeframe);
    }
  },
  
  // Animate counter updates
  animateCounterUpdate(selector, endValue, isCurrency = false) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    let startValue;
    if (isCurrency) {
      startValue = parseFloat(element.textContent.replace(/[^0-9.-]+/g, ''));
      if (isNaN(startValue)) startValue = 0;
    } else {
      startValue = parseInt(element.textContent);
      if (isNaN(startValue)) startValue = 0;
    }
    
    const duration = 1000; // ms
    const startTime = performance.now();
    
    const updateCounter = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = progress * (2 - progress);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuad;
      
      if (isCurrency) {
        element.textContent = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(currentValue);
      } else {
        element.textContent = Math.round(currentValue);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  },
  
  // Render recent price updates
  renderRecentPriceUpdates() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    const updates = DataService.getRecentPriceUpdates();
    
    // Clear current content
    productList.innerHTML = '';
    
    if (updates.length === 0) {
      productList.innerHTML = '<p class="text-center">No recent price updates</p>';
      return;
    }
    
    // Group updates by product
    const groupedUpdates = {};
    
    updates.forEach(update => {
      if (!groupedUpdates[update.productId]) {
        groupedUpdates[update.productId] = {
          productId: update.productId,
          productName: update.productName,
          updates: []
        };
      }
      
      groupedUpdates[update.productId].updates.push({
        supplierId: update.supplierId,
        supplierName: update.supplierName,
        price: update.price,
        date: update.date
      });
    });
    
    // Analyze price changes and render each product card
    Object.values(groupedUpdates).forEach(product => {
      // Sort updates by date (newest first)
      product.updates.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Get the two most recent updates from the same supplier if available
      const latestUpdate = product.updates[0];
      let previousUpdate = null;
      
      for (let i = 1; i < product.updates.length; i++) {
        if (product.updates[i].supplierId === latestUpdate.supplierId) {
          previousUpdate = product.updates[i];
          break;
        }
      }
      
      // Calculate price change if previous update exists
      let priceChange = null;
      let changeClass = '';
      
      if (previousUpdate) {
        priceChange = ((latestUpdate.price - previousUpdate.price) / previousUpdate.price) * 100;
        changeClass = priceChange < 0 ? 'price-decreased' : 'price-increased';
      }
      
      // Get all unique suppliers for this product
      const suppliers = [...new Set(product.updates.map(u => u.supplierId))];
      
      // Find best price
      let bestPrice = Infinity;
      let bestSupplier = '';
      
      suppliers.forEach(supplierId => {
        const supplierUpdates = product.updates.filter(u => u.supplierId === supplierId);
        if (supplierUpdates.length > 0) {
          const latestPrice = supplierUpdates[0].price;
          if (latestPrice < bestPrice) {
            bestPrice = latestPrice;
            bestSupplier = supplierUpdates[0].supplierName;
          }
        }
      });
      
      // Create product card
      const card = document.createElement('div');
      card.className = 'product-card';
      
      card.innerHTML = `
        <div class="product-info">
          <div class="product-name">${product.productName}</div>
          <div class="supplier-prices">
            Best price: <span class="best-price">$${bestPrice.toFixed(2)}</span> (${bestSupplier})
          </div>
        </div>
        ${priceChange !== null ? `
          <div class="product-change ${changeClass}">
            ${priceChange < 0 ? '↓' : '↑'} ${Math.abs(priceChange).toFixed(1)}%
          </div>
        ` : ''}
      `;
      
      productList.appendChild(card);
    });
  },
  
  // Render products
  renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Get filter values
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const sortBy = document.getElementById('sort-by')?.value || 'name';
    
    // Get products and suppliers
    let products = DataService.getProducts();
    const suppliers = DataService.getSuppliers();
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      products = products.filter(product => product.category === categoryFilter);
    }
    
    // Apply sorting
    products.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          // Sort by lowest price
          const aMinPrice = Math.min(...a.prices.map(p => p.price));
          const bMinPrice = Math.min(...b.prices.map(p => p.price));
          return aMinPrice - bMinPrice;
        case 'price-high':
          // Sort by highest price
          const aMaxPrice = Math.max(...a.prices.map(p => p.price));
          const bMaxPrice = Math.max(...b.prices.map(p => p.price));
          return bMaxPrice - aMaxPrice;
        case 'updated':
          // Sort by most recently updated
          const aLatestDate = Math.max(...a.prices.map(p => new Date(p.lastUpdated).getTime()));
          const bLatestDate = Math.max(...b.prices.map(p => new Date(p.lastUpdated).getTime()));
          return bLatestDate - aLatestDate;
        default:
          return 0;
      }
    });
    
    // Clear current content
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
      productsGrid.innerHTML = '<p class="text-center">No products found</p>';
      return;
    }
    
    // Render each product
    products.forEach(product => {
      // Find best price
      let bestPrice = Infinity;
      let bestSupplierId = null;
      
      product.prices.forEach(price => {
        if (price.price < bestPrice) {
          bestPrice = price.price;
          bestSupplierId = price.supplierId;
        }
      });
      
      const card = document.createElement('div');
      card.className = 'product-grid-card';
      
      let pricesHTML = '';
      
      product.prices.forEach(price => {
        const supplier = suppliers.find(s => s.id === price.supplierId);
        if (supplier) {
          pricesHTML += `
            <div class="price-item">
              <div class="supplier-name">${supplier.name}</div>
              <div class="price-info">
                <span class="price-value">$${price.price.toFixed(2)}</span>
                ${price.supplierId === bestSupplierId ? '<span class="best-supplier">Best</span>' : ''}
              </div>
            </div>
          `;
        }
      });
      
      card.innerHTML = `
        <div class="product-grid-header">
          <h3>${product.name}</h3>
          <div class="product-category">${this.formatCategory(product.category)}</div>
        </div>
        <div class="product-grid-body">
          <div class="product-sku">SKU: ${product.sku || 'N/A'}</div>
          <div class="price-list">
            ${pricesHTML || '<p>No prices available</p>'}
          </div>
        </div>
        <div class="product-grid-footer">
          <button class="btn btn-text edit-product" data-id="${product.id}">Edit</button>
          <button class="btn btn-text delete-product" data-id="${product.id}">Delete</button>
        </div>
      `;
      
      productsGrid.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-id');
        // TODO: Implement edit product functionality
        console.log('Edit product', productId);
      });
    });
    
    document.querySelectorAll('.delete-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-id');
        // TODO: Implement delete product functionality
        console.log('Delete product', productId);
      });
    });
  },
  
  // Format category name for display
  formatCategory(category) {
    if (!category) return 'Uncategorized';
    
    // Convert kebab-case to title case
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // Filter products based on selected options
  filterProducts() {
    this.renderProducts();
  },
  
  // Render suppliers
  renderSuppliers() {
    const suppliersList = document.querySelector('.suppliers-list');
    if (!suppliersList) return;
    
    const suppliers = DataService.getSuppliers();
    
    // Clear current content
    suppliersList.innerHTML = '';
    
    if (suppliers.length === 0) {
      suppliersList.innerHTML = '<p class="text-center">No suppliers found</p>';
      return;
    }
    
    // Render each supplier
    suppliers.forEach(supplier => {
      const card = document.createElement('div');
      card.className = 'supplier-card';
      
      card.innerHTML = `
        <div class="supplier-header">
          <h3>${supplier.name}</h3>
        </div>
        <div class="supplier-body">
          <div class="supplier-info">
            ${supplier.contact ? `
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${supplier.contact}
              </div>
            ` : ''}
            
            ${supplier.phone ? `
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ${supplier.phone}
              </div>
            ` : ''}
            
            ${supplier.email ? `
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                ${supplier.email}
              </div>
            ` : ''}
            
            ${supplier.notes ? `
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                ${supplier.notes}
              </div>
            ` : ''}
          </div>
          
          <div class="supplier-stats">
            <div class="stat-item">
              <div class="stat-item-label">Products</div>
              <div class="stat-item-value">${supplier.productCount}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-item-label">Avg. Price Change</div>
              <div class="stat-item-value ${supplier.avgPriceChange < 0 ? 'text-success' : supplier.avgPriceChange > 0 ? 'text-error' : ''}">
                ${supplier.avgPriceChange < 0 ? '↓' : supplier.avgPriceChange > 0 ? '↑' : ''}
                ${Math.abs(supplier.avgPriceChange).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        <div class="product-grid-footer">
          <button class="btn btn-text edit-supplier" data-id="${supplier.id}">Edit</button>
          <button class="btn btn-text delete-supplier" data-id="${supplier.id}">Delete</button>
        </div>
      `;
      
      suppliersList.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-supplier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const supplierId = e.currentTarget.getAttribute('data-id');
        // TODO: Implement edit supplier functionality
        console.log('Edit supplier', supplierId);
      });
    });
    
    document.querySelectorAll('.delete-supplier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const supplierId = e.currentTarget.getAttribute('data-id');
        // TODO: Implement delete supplier functionality
        console.log('Delete supplier', supplierId);
      });
    });
  },
  
  // Render alerts
  renderAlerts() {
    const alertsContainer = document.querySelector('.alerts-container');
    if (!alertsContainer) return;
    
    const alerts = DataService.getAlerts();
    
    // Clear current content
    alertsContainer.innerHTML = '';
    
    if (alerts.length === 0) {
      alertsContainer.innerHTML = '<p class="text-center">No alerts found</p>';
      return;
    }
    
    // Sort alerts by date (newest first) and unread first
    alerts.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.date) - new Date(a.date);
    });
    
    // Render each alert
    alerts.forEach(alert => {
      const product = DataService.getProduct(alert.productId);
      const supplier = DataService.getSupplier(alert.supplierId);
      
      if (!product || !supplier) return;
      
      const card = document.createElement('div');
      card.className = 'alert-card';
      if (!alert.read) {
        card.classList.add('unread');
      }
      
      let alertIconClass = '';
      let alertTitle = '';
      let alertMessage = '';
      
      switch (alert.type) {
        case 'price-drop':
          alertIconClass = 'price-drop-alert';
          alertTitle = 'Price Drop';
          alertMessage = `${supplier.name} dropped the price of ${product.name} from $${alert.oldPrice.toFixed(2)} to $${alert.newPrice.toFixed(2)}.`;
          break;
          
        case 'price-increase':
          alertIconClass = 'price-increase-alert';
          alertTitle = 'Price Increase';
          alertMessage = `${supplier.name} increased the price of ${product.name} from $${alert.oldPrice.toFixed(2)} to $${alert.newPrice.toFixed(2)}.`;
          break;
          
        case 'opportunity':
          alertIconClass = 'opportunity-alert';
          alertTitle = 'Savings Opportunity';
          alertMessage = `You can save $${alert.savings.toFixed(2)} on ${product.name} by switching to ${supplier.name}.`;
          break;
      }
      
      card.innerHTML = `
        <div class="alert-icon ${alertIconClass}">
          ${alert.type === 'price-drop' ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          ` : alert.type === 'price-increase' ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m18 15-6-6-6 6"></path>
            </svg>
          ` : `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"></path>
              <path d="M12 18v2"></path>
              <path d="M12 6V4"></path>
            </svg>
          `}
        </div>
        <div class="alert-content">
          <div class="alert-title">${alertTitle}</div>
          <div class="alert-message">${alertMessage}</div>
          <div class="alert-meta">
            <div class="alert-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              ${this.formatDate(alert.date)}
            </div>
          </div>
        </div>
        <div class="alert-actions">
          <button class="btn btn-text mark-read" data-id="${alert.id}" ${alert.read ? 'style="display:none"' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </button>
          <button class="btn btn-text delete-alert" data-id="${alert.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
      
      alertsContainer.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-id');
        DataService.markAlertAsRead(alertId);
        e.currentTarget.style.display = 'none';
        e.currentTarget.closest('.alert-card').classList.remove('unread');
      });
    });
    
    document.querySelectorAll('.delete-alert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-id');
        DataService.deleteAlert(alertId);
        e.currentTarget.closest('.alert-card').remove();
      });
    });
  },
  
  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  // Set up modals
  setupModals() {
    // Close modal buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAllModals();
        }
      });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    // Initialize supplier select in add product modal
    this.updateSupplierSelects();
    
    // Remove supplier row button
    document.addEventListener('click', (e) => {
      if (e.target.closest('.remove-supplier-btn')) {
        const row = e.target.closest('.supplier-price-row');
        if (row && row.parentElement.querySelectorAll('.supplier-price-row').length > 1) {
          row.remove();
        }
      }
    });
  },
  
  // Open modal
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Reset form if present
      const form = modal.querySelector('form');
      if (form) form.reset();
      
      // Show modal
      modal.classList.add('active');
      
      // Focus first input
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
      
      // Update supplier selects if product modal
      if (modalId === 'add-product-modal') {
        this.updateSupplierSelects();
      }
    }
  },
  
  // Close all modals
  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  },
  
  // Update supplier selects in add product modal
  updateSupplierSelects() {
    const selects = document.querySelectorAll('.supplier-select');
    if (selects.length === 0) return;
    
    const suppliers = DataService.getSuppliers();
    
    selects.forEach(select => {
      // Save current value
      const currentValue = select.value;
      
      // Clear options except the first one
      while (select.options.length > 1) {
        select.remove(1);
      }
      
      // Add supplier options
      suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.id;
        option.textContent = supplier.name;
        select.appendChild(option);
      });
      
      // Restore selected value if it still exists
      if (currentValue) {
        select.value = currentValue;
      }
    });
  },
  
  // Add a new supplier price row to the product form
  addSupplierPriceRow() {
    const container = document.getElementById('supplier-prices-container');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'supplier-price-row';
    
    row.innerHTML = `
      <select class="supplier-select" required>
        <option value="">Select Supplier</option>
        <!-- Suppliers will be added by JavaScript -->
      </select>
      <input type="number" class="price-input" placeholder="Price" min="0" step="0.01" required>
      <button type="button" class="remove-supplier-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    `;
    
    container.appendChild(row);
    
    // Update supplier options
    this.updateSupplierSelects();
    
    // Focus the new select
    const newSelect = row.querySelector('select');
    if (newSelect) newSelect.focus();
  },
  
  // Handle add product form submission
  handleAddProduct() {
    const form = document.getElementById('add-product-form');
    if (!form) return;
    
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const sku = document.getElementById('product-sku').value.trim();
    
    // Get supplier prices
    const prices = [];
    const rows = document.querySelectorAll('.supplier-price-row');
    
    rows.forEach(row => {
      const supplierId = row.querySelector('.supplier-select').value;
      const price = parseFloat(row.querySelector('.price-input').value);
      
      if (supplierId && !isNaN(price)) {
        prices.push({
          supplierId,
          price,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    // Validate form
    if (!name || !category || prices.length === 0) {
      // Show validation error
      alert('Please fill out all required fields and add at least one supplier price.');
      return;
    }
    
    // Create new product
    const product = {
      name,
      category,
      sku,
      prices,
      priceHistory: []
    };
    
    DataService.addProduct(product);
    
    // Close modal and refresh view
    this.closeAllModals();
    
    // Refresh current view
    if (this.activeView === 'products') {
      this.renderProducts();
    } else if (this.activeView === 'dashboard') {
      this.renderDashboard();
    }
  },
  
  // Handle add supplier form submission
  handleAddSupplier() {
    const form = document.getElementById('add-supplier-form');
    if (!form) return;
    
    const name = document.getElementById('supplier-name').value.trim();
    const contact = document.getElementById('supplier-contact').value.trim();
    const phone = document.getElementById('supplier-phone').value.trim();
    const email = document.getElementById('supplier-email').value.trim();
    const notes = document.getElementById('supplier-notes').value.trim();
    
    // Validate form
    if (!name) {
      // Show validation error
      alert('Please enter a supplier name.');
      return;
    }
    
    // Create new supplier
    const supplier = {
      name,
      contact,
      phone,
      email,
      notes
    };
    
    DataService.addSupplier(supplier);
    
    // Close modal and refresh view
    this.closeAllModals();
    
    // Refresh current view
    if (this.activeView === 'suppliers') {
      this.renderSuppliers();
    }
    
    // Update supplier selects in product form
    this.updateSupplierSelects();
  },
  
  // Handle search
  handleSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
      // If search is cleared, reset to current view
      this.switchView(this.activeView);
      return;
    }
    
    switch (this.activeView) {
      case 'products':
        this.searchProducts(query);
        break;
      case 'suppliers':
        this.searchSuppliers(query);
        break;
      case 'price-alerts':
        this.searchAlerts(query);
        break;
      default:
        // For dashboard and reports, search across all data
        this.searchAll(query);
        break;
    }
  },
  
  // Search products
  searchProducts(query) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const products = DataService.getProducts();
    const suppliers = DataService.getSuppliers();
    
    // Filter products by query
    const filteredProducts = products.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query)) ||
        // Search in supplier names that provide this product
        product.prices.some(price => {
          const supplier = suppliers.find(s => s.id === price.supplierId);
          return supplier && supplier.name.toLowerCase().includes(query);
        })
      );
    });
    
    // Clear current content
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = '<p class="text-center">No products found matching your search</p>';
      return;
    }
    
    // Render filtered products
    filteredProducts.forEach(product => {
      // Use the same rendering logic as in renderProducts
      // Find best price
      let bestPrice = Infinity;
      let bestSupplierId = null;
      
      product.prices.forEach(price => {
        if (price.price < bestPrice) {
          bestPrice = price.price;
          bestSupplierId = price.supplierId;
        }
      });
      
      const card = document.createElement('div');
      card.className = 'product-grid-card';
      
      let pricesHTML = '';
      
      product.prices.forEach(price => {
        const supplier = suppliers.find(s => s.id === price.supplierId);
        if (supplier) {
          pricesHTML += `
            <div class="price-item">
              <div class="supplier-name">${supplier.name}</div>
              <div class="price-info">
                <span class="price-value">$${price.price.toFixed(2)}</span>
                ${price.supplierId === bestSupplierId ? '<span class="best-supplier">Best</span>' : ''}
              </div>
            </div>
          `;
        }
      });
      
      card.innerHTML = `
        <div class="product-grid-header">
          <h3>${product.name}</h3>
          <div class="product-category">${this.formatCategory(product.category)}</div>
        </div>
        <div class="product-grid-body">
          <div class="product-sku">SKU: ${product.sku || 'N/A'}</div>
          <div class="price-list">
            ${pricesHTML || '<p>No prices available</p>'}
          </div>
        </div>
        <div class="product-grid-footer">
          <button class="btn btn-text edit-product" data-id="${product.id}">Edit</button>
          <button class="btn btn-text delete-product" data-id="${product.id}">Delete</button>
        </div>
      `;
      
      productsGrid.appendChild(card);
    });
  },
  
  // Search suppliers
  searchSuppliers(query) {
    const suppliersList = document.querySelector('.suppliers-list');
    if (!suppliersList) return;
    
    const suppliers = DataService.getSuppliers();
    
    // Filter suppliers by query
    const filteredSuppliers = suppliers.filter(supplier => {
      return (
        supplier.name.toLowerCase().includes(query) ||
        (supplier.contact && supplier.contact.toLowerCase().includes(query)) ||
        (supplier.phone && supplier.phone.toLowerCase().includes(query)) ||
        (supplier.email && supplier.email.toLowerCase().includes(query)) ||
        (supplier.notes && supplier.notes.toLowerCase().includes(query))
      );
    });
    
    // Clear current content
    suppliersList.innerHTML = '';
    
    if (filteredSuppliers.length === 0) {
      suppliersList.innerHTML = '<p class="text-center">No suppliers found matching your search</p>';
      return;
    }
    
    // Render filtered suppliers using the same logic from renderSuppliers
    // (Code similar to renderSuppliers but with filteredSuppliers)
    filteredSuppliers.forEach(supplier => {
      const card = document.createElement('div');
      card.className = 'supplier-card';
      
      // Same card HTML as in renderSuppliers
      // ...
    });
  },
  
  // Search alerts
  searchAlerts(query) {
    // Similar to searchProducts and searchSuppliers
    // Filter alerts based on query, then render filtered results
  },
  
  // Search across all data
  searchAll(query) {
    // Implement global search across products, suppliers, and alerts
    // Show results in current view or switch to a combined search results view
  },
  
  // Export data to CSV
  exportData() {
    const data = DataService.data;
    
    // Prepare products data for CSV
    const productsData = [];
    
    data.products.forEach(product => {
      // Create a base row for the product
      const baseRow = {
        'Product ID': product.id,
        'Product Name': product.name,
        'Category': product.category,
        'SKU': product.sku || ''
      };
      
      // Add a row for each supplier price
      product.prices.forEach(price => {
        const supplier = data.suppliers.find(s => s.id === price.supplierId);
        if (supplier) {
          productsData.push({
            ...baseRow,
            'Supplier ID': supplier.id,
            'Supplier Name': supplier.name,
            'Price': price.price,
            'Last Updated': price.lastUpdated
          });
        }
      });
      
      // If no prices, add a row with empty supplier info
      if (product.prices.length === 0) {
        productsData.push({
          ...baseRow,
          'Supplier ID': '',
          'Supplier Name': '',
          'Price': '',
          'Last Updated': ''
        });
      }
    });
    
    // Convert to CSV
    const productsCSV = this.convertToCSV(productsData);
    
    // Create download link
    this.downloadCSV(productsCSV, 'price-track-pro-export.csv');
  },
  
  // Convert data to CSV
  convertToCSV(data) {
    if (data.length === 0) return '';
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Handle special characters and quotes
        if (value === null || value === undefined) return '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  },
  
  // Download CSV file
  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default UI;