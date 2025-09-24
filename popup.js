class WebCustomizerPro {
  constructor() {
    this.currentTab = null;
    this.currentSite = null;
    this.init();
  }

  async init() {
    await this.getCurrentTab();
    this.loadSettings();
    this.bindEvents();
    this.updateUI();
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
    this.currentSite = new URL(tab.url).hostname;
    
    // Update current site display
    const currentSiteElement = document.getElementById('currentSite');
    if (currentSiteElement) {
      currentSiteElement.textContent = this.currentSite;
    }
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get([
      `settings_${this.currentSite}`,
      'globalSettings'
    ]);
    
    const siteSettings = result[`settings_${this.currentSite}`] || {};
    const globalSettings = result.globalSettings || {};
    
    this.settings = {
      darkMode: siteSettings.darkMode ?? globalSettings.darkMode ?? false,
      darkModeIntensity: siteSettings.darkModeIntensity ?? globalSettings.darkModeIntensity ?? 5,
      fontEnabled: siteSettings.fontEnabled ?? globalSettings.fontEnabled ?? false,
      fontFamily: siteSettings.fontFamily ?? globalSettings.fontFamily ?? 'system-ui',
      fontSize: siteSettings.fontSize ?? globalSettings.fontSize ?? 100,
      lineHeight: siteSettings.lineHeight ?? globalSettings.lineHeight ?? 150,
      cssEnabled: siteSettings.cssEnabled ?? globalSettings.cssEnabled ?? false,
      customCSS: siteSettings.customCSS ?? globalSettings.customCSS ?? ''
    };
  }

  async saveSettings() {
    await chrome.storage.sync.set({
      [`settings_${this.currentSite}`]: this.settings
    });
  }

  bindEvents() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIntensity = document.getElementById('darkModeIntensity');
    const intensityValue = document.getElementById('intensityValue');

    darkModeToggle.addEventListener('change', (e) => {
      this.settings.darkMode = e.target.checked;
      this.saveAndApply();
    });

    darkModeIntensity.addEventListener('input', (e) => {
      this.settings.darkModeIntensity = parseInt(e.target.value);
      intensityValue.textContent = e.target.value;
      if (this.settings.darkMode) {
        this.saveAndApply();
      }
    });

    // Font Customization
    const fontToggle = document.getElementById('fontToggle');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const lineHeight = document.getElementById('lineHeight');
    const lineHeightValue = document.getElementById('lineHeightValue');

    fontToggle.addEventListener('change', (e) => {
      this.settings.fontEnabled = e.target.checked;
      this.saveAndApply();
    });

    fontFamily.addEventListener('change', (e) => {
      this.settings.fontFamily = e.target.value;
      if (this.settings.fontEnabled) {
        this.saveAndApply();
      }
    });

    fontSize.addEventListener('input', (e) => {
      this.settings.fontSize = parseInt(e.target.value);
      fontSizeValue.textContent = e.target.value + '%';
      if (this.settings.fontEnabled) {
        this.saveAndApply();
      }
    });

    lineHeight.addEventListener('input', (e) => {
      this.settings.lineHeight = parseInt(e.target.value);
      lineHeightValue.textContent = e.target.value + '%';
      if (this.settings.fontEnabled) {
        this.saveAndApply();
      }
    });

    // Custom CSS
    const cssToggle = document.getElementById('cssToggle');
    const customCSS = document.getElementById('customCSS');
    const applyCSSBtn = document.getElementById('applyCSSBtn');
    const clearCSSBtn = document.getElementById('clearCSSBtn');

    cssToggle.addEventListener('change', (e) => {
      this.settings.cssEnabled = e.target.checked;
      this.saveAndApply();
    });

    customCSS.addEventListener('input', (e) => {
      this.settings.customCSS = e.target.value;
      this.saveSettings(); // Save but don't apply until user clicks apply
    });

    applyCSSBtn.addEventListener('click', () => {
      this.settings.customCSS = customCSS.value;
      this.saveAndApply();
      this.showNotification('Custom CSS applied!');
    });

    clearCSSBtn.addEventListener('click', () => {
      customCSS.value = '';
      this.settings.customCSS = '';
      this.saveAndApply();
      this.showNotification('Custom CSS cleared!');
    });

    // Site Actions
    const resetSiteBtn = document.getElementById('resetSiteBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');

    resetSiteBtn.addEventListener('click', async () => {
      await chrome.storage.sync.remove(`settings_${this.currentSite}`);
      await this.loadSettings();
      this.updateUI();
      this.applySettings();
      this.showNotification('Site settings reset!');
    });

    resetAllBtn.addEventListener('click', async () => {
      await chrome.storage.sync.clear();
      await this.loadSettings();
      this.updateUI();
      this.applySettings();
      this.showNotification('All settings reset!');
    });
  }

  updateUI() {
    // Update toggles
    document.getElementById('darkModeToggle').checked = this.settings.darkMode;
    document.getElementById('darkModeIntensity').value = this.settings.darkModeIntensity;
    document.getElementById('intensityValue').textContent = this.settings.darkModeIntensity;

    document.getElementById('fontToggle').checked = this.settings.fontEnabled;
    document.getElementById('fontFamily').value = this.settings.fontFamily;
    document.getElementById('fontSize').value = this.settings.fontSize;
    document.getElementById('fontSizeValue').textContent = this.settings.fontSize + '%';
    document.getElementById('lineHeight').value = this.settings.lineHeight;
    document.getElementById('lineHeightValue').textContent = this.settings.lineHeight + '%';

    document.getElementById('cssToggle').checked = this.settings.cssEnabled;
    document.getElementById('customCSS').value = this.settings.customCSS;
  }

  async saveAndApply() {
    await this.saveSettings();
    await this.applySettings();
  }

  async applySettings() {
    try {
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'applySettings',
        settings: this.settings
      });
    } catch (error) {
      console.log('Content script not ready, injecting...');
      await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        files: ['content.js']
      });
      
      // Try again after a short delay
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(this.currentTab.id, {
            action: 'applySettings',
            settings: this.settings
          });
        } catch (e) {
          console.error('Failed to apply settings:', e);
        }
      }, 100);
    }
  }

  showNotification(message) {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WebCustomizerPro();
});
