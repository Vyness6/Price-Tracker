/**
 * Main application script for PriceTrack Pro
 * Initializes all components and sets up event listeners
 */

import DataService from './data.js';
import ChartManager from './charts.js';
import UI from './ui.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Make ChartManager available globally for UI module
  window.ChartManager = ChartManager;
  
  // Initialize data service
  DataService.init();
  
  // Initialize UI
  UI.init();
  
  // Initialize charts
  ChartManager.init();
  
  // Apply staggered animations to elements
  setTimeout(() => {
    UI.applyStaggeredAnimations();
  }, 100);
  
  console.log('PriceTrack Pro initialized');
});

// Handle dark mode based on system preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

function handleDarkMode(e) {
  // This would implement dark mode if we had it
  // For now, we're using light mode only
  console.log('Dark mode preference:', e.matches);
}

// Initial check
handleDarkMode(prefersDarkMode);

// Listen for changes
prefersDarkMode.addEventListener('change', handleDarkMode);