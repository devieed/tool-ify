# Tool-ify.com

A clean, minimalist website offering various free online utility tools that work directly in the browser without any installation.

## Features

- **Pure Frontend Implementation**: Built using only HTML, CSS, and JavaScript.
- **Clean & Minimalist Design**: Focused on simplicity and ease of use with plenty of whitespace.
- **Multiple Language Support**: Available in English, Chinese, and Spanish.
- **Light/Dark Mode**: Automatically adapts to user preferences with manual toggle option.
- **Responsive Design**: Works on all devices from mobile to desktop.

## Tool Categories

The website offers the following categories of tools:

1. **Text Processing Tools**
   - Word Counter
   - Case Converter
   - JSON Formatter
   - Base64 Encoder/Decoder
   - URL Encoder/Decoder
   - HTML Entity Converter
   - Hash Generator

2. **Image Processing Tools**
   - Image Converter (JPG, PNG, WebP)
   - Image Compressor
   - Image to Base64
   - Image Resizer

3. **Developer & Design Tools**
   - Color Converter (HEX, RGB, HSL, CMYK)
   - Password Generator
   - UUID Generator
   - Unix Timestamp Converter
   - CSS Formatter
   - QR Code Generator

4. **Utility Tools**
   - Unit Converter
   - Timer & Stopwatch

## Project Structure

```
tool-ify/
├── index.html             # Main homepage
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # Main JavaScript file
├── locales/               # Language files
│   ├── en.json            # English
│   ├── zh.json            # Chinese
│   └── es.json            # Spanish
└── tools/                 # Individual tool pages
    ├── word-counter.html
    ├── case-converter.html
    └── ...
```

## Setup & Deployment

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tool-ify.git
   ```

2. No build process is required as the site uses pure HTML, CSS, and JavaScript.

3. To deploy on GitHub Pages:
   - Push the code to your GitHub repository
   - Go to repository settings
   - Enable GitHub Pages and select the main branch

4. The site will be available at `https://yourusername.github.io/tool-ify/`

## Adding New Tools

To add a new tool:

1. Create a new HTML file in the `tools/` directory
2. Add the tool's metadata to the language JSON files in `locales/`
3. Add a new card for the tool in the appropriate section of `index.html`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 