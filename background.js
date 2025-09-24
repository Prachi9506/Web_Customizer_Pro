// Background script for Web Customizer Pro
class WebCustomizerBackground {
  constructor() {
    this.init();
  }

  init() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Web Customizer Pro installed');
      this.setDefaultSettings();
    });

    // Handle tab updates to reapply settings
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.injectContentScript(tabId);
      }
    });
  }

  async setDefaultSettings() {
    const defaultSettings = {
      globalSettings: {
        darkMode: false,
        darkModeIntensity: 5,
        fontEnabled: false,
        fontFamily: 'system-ui',
        fontSize: 100,
        lineHeight: 150,
        cssEnabled: false,
        customCSS: ''
      }
    };

    try {
      await chrome.storage.sync.set(defaultSettings);
    } catch (error) {
      console.log('Could not set default settings');
    }
  }

  async injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    } catch (error) {
      // Content script might already be injected or tab might not be ready
      console.log('Content script injection skipped');
    }
  }
}

// Initialize background script
new WebCustomizerBackground();
