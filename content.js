class WebCustomizer {
  constructor() {
    this.styleElement = null;
    this.darkModeElement = null;
    this.fontElement = null;
    this.cssElement = null;
    this.init();
  }

  init() {
    this.createStyleElements();
    this.loadAndApplySettings();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'applySettings') {
        this.applySettings(message.settings);
        sendResponse({ success: true });
      }
    });
  }

  createStyleElements() {
    // Create style elements for different customizations
    this.darkModeElement = document.createElement('style');
    this.darkModeElement.id = 'web-customizer-dark-mode';
    document.head.appendChild(this.darkModeElement);

    this.fontElement = document.createElement('style');
    this.fontElement.id = 'web-customizer-font';
    document.head.appendChild(this.fontElement);

    this.cssElement = document.createElement('style');
    this.cssElement.id = 'web-customizer-css';
    document.head.appendChild(this.cssElement);
  }

  async loadAndApplySettings() {
    try {
      const currentSite = window.location.hostname;
      const result = await chrome.storage.sync.get([
        `settings_${currentSite}`,
        'globalSettings'
      ]);
      
      const siteSettings = result[`settings_${currentSite}`] || {};
      const globalSettings = result.globalSettings || {};
      
      const settings = {
        darkMode: siteSettings.darkMode ?? globalSettings.darkMode ?? false,
        darkModeIntensity: siteSettings.darkModeIntensity ?? globalSettings.darkModeIntensity ?? 5,
        fontEnabled: siteSettings.fontEnabled ?? globalSettings.fontEnabled ?? false,
        fontFamily: siteSettings.fontFamily ?? globalSettings.fontFamily ?? 'system-ui',
        fontSize: siteSettings.fontSize ?? globalSettings.fontSize ?? 100,
        lineHeight: siteSettings.lineHeight ?? globalSettings.lineHeight ?? 150,
        cssEnabled: siteSettings.cssEnabled ?? globalSettings.cssEnabled ?? false,
        customCSS: siteSettings.customCSS ?? globalSettings.customCSS ?? ''
      };
      
      this.applySettings(settings);
    } catch (error) {
      console.log('Web Customizer: Could not load settings');
    }
  }

  applySettings(settings) {
    this.applyDarkMode(settings.darkMode, settings.darkModeIntensity);
    this.applyFontSettings(settings.fontEnabled, settings.fontFamily, settings.fontSize, settings.lineHeight);
    this.applyCustomCSS(settings.cssEnabled, settings.customCSS);
  }

  applyDarkMode(enabled, intensity) {
    if (!this.darkModeElement) return;

    if (enabled) {
      const brightness = Math.max(0.1, (11 - intensity) / 10);
      const contrast = Math.min(2, 1 + (intensity - 5) / 10);
      
      const darkCSS = `
        html {
          filter: invert(1) hue-rotate(180deg) brightness(${brightness}) contrast(${contrast}) !important;
          transition: filter 0.3s ease !important;
        }
        
        img, video, svg, iframe, canvas, embed, object {
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        [style*="background-image"] {
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        /* Preserve some elements that shouldn't be inverted */
        [data-web-customizer-preserve],
        .web-customizer-preserve {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `;
      
      this.darkModeElement.textContent = darkCSS;
    } else {
      this.darkModeElement.textContent = '';
    }
  }

  applyFontSettings(enabled, family, size, lineHeight) {
    if (!this.fontElement) return;

    if (enabled) {
      const fontCSS = `
        *, *::before, *::after {
          font-family: ${family} !important;
          font-size: ${size}% !important;
          line-height: ${lineHeight}% !important;
        }
        
        /* Preserve monospace fonts for code */
        pre, code, kbd, samp, tt, var {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
        }
        
        /* Preserve icon fonts */
        [class*="icon"], [class*="fa-"], .material-icons {
          font-family: inherit !important;
        }
      `;
      
      this.fontElement.textContent = fontCSS;
    } else {
      this.fontElement.textContent = '';
    }
  }

  applyCustomCSS(enabled, css) {
    if (!this.cssElement) return;

    if (enabled && css.trim()) {
      this.cssElement.textContent = css;
    } else {
      this.cssElement.textContent = '';
    }
  }
}

// Initialize the content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WebCustomizer();
  });
} else {
  new WebCustomizer();
}