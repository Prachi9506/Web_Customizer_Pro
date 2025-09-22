# Web Customizer Pro Chrome Extension

A powerful Chrome extension that allows users to customize any website with dark mode, custom fonts, and CSS injection capabilities.

## Features

### 🌙 Dark Mode Everywhere
- Apply dark mode to any website, even if it doesn't natively support it
- Adjustable intensity levels (1-10) for different darkness preferences
- Smart filtering that preserves images and media content
- Smooth transitions for a polished experience

### 📝 Font Customization
- Change font family across all websites or specific sites
- Adjust font size (80%-150%) for better readability
- Customize line height (100%-200%) for improved text spacing
- Preserves monospace fonts for code blocks and icon fonts

### ⚡ Custom CSS Injection
- Write and inject custom CSS for any website
- Site-specific and global CSS rules
- Real-time preview and application
- Built-in CSS editor with syntax highlighting

### 🌐 Site-Specific Settings
- Different settings for each website
- Global fallback settings
- Easy reset options for individual sites or all settings
- Automatic settings persistence

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "Web Customizer Pro"
3. Click "Add to Chrome"
4. Follow the installation prompts

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension will appear in your extensions list

## Usage

### Basic Usage
1. Click the Web Customizer Pro icon in your browser toolbar
2. Use the toggles to enable different features:
   - **Dark Mode**: Toggle the moon icon to enable/disable dark mode
   - **Font Customization**: Toggle the text icon to enable font changes
   - **Custom CSS**: Toggle the lightning icon to enable CSS injection

### Dark Mode
- Enable the toggle to apply dark mode to the current website
- Adjust the intensity slider (1-10) to control darkness level
- Higher values create darker themes, lower values are more subtle

### Font Customization
- Choose from popular web fonts in the dropdown
- Adjust font size using the slider (80%-150%)
- Modify line height for better text readability (100%-200%)

### Custom CSS
- Write CSS in the textarea provided
- Click "Apply CSS" to inject your styles
- Use "Clear" to remove all custom CSS
- CSS is applied immediately and saved automatically

### Site Management
- **Current Site**: Shows the domain of the active tab
- **Reset This Site**: Removes all customizations for the current website
- **Reset All Sites**: Clears all saved settings across all websites

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension standard
- **Content Scripts**: Inject CSS and handle DOM modifications
- **Service Worker**: Manages background tasks and settings
- **Chrome Storage**: Persistent storage for user preferences

### File Structure
```
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic and UI handling
├── content.js            # Content script for DOM manipulation
├── background.js         # Background service worker
├── styles/
│   └── dark-mode.css     # Base dark mode styles
├── icons/                # Extension icons (16px, 32px, 48px, 128px)
└── README.md            # Documentation
```

### Permissions
- `activeTab`: Access to the currently active tab
- `storage`: Save and retrieve user settings
- `scripting`: Inject content scripts into web pages
- `<all_urls>`: Apply customizations to any website

## Privacy Policy

Web Customizer Pro respects your privacy:
- All settings are stored locally using Chrome's sync storage
- No data is collected or transmitted to external servers
- Settings sync across your Chrome browsers when logged into your Google account
- No tracking or analytics are implemented

## Support

If you encounter any issues or have feature requests:
1. Check the console for any error messages
2. Try disabling and re-enabling the extension
3. Reset settings if customizations aren't applying correctly
4. Contact support through the Chrome Web Store page

## Development

### Building from Source
1. Clone the repository
2. No build process required - the extension runs directly from source
3. Load the extension in developer mode for testing

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across different websites
5. Submit a pull request with a detailed description

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release with dark mode, font customization, and CSS injection
- Site-specific settings management
- Responsive popup interface
- Chrome Storage integration