# SparkDeck - Startup Ideation Platform

A modern, interactive platform for showcasing startup ideas with carousel navigation and detailed previews.

## 🚀 Features

- **Interactive Carousel**: Swipe through startup ideas with smooth animations
- **Grid View**: Alternative view for browsing all ideas at once
- **Category Filtering**: Filter ideas by tech, SaaS, AI, social, etc.
- **Detailed Previews**: Click any idea for full-page detailed view
- **Demo Integration**: Each idea links to a live demo/page
- **Submission System**: Visitors can submit their own startup ideas
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js + Express
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter, Space Grotesk)
- **Build Tool**: npm scripts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sparkdeck.git
   cd sparkdeck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`

## 🚀 Quick Start

### Development Mode
```bash
npm run dev
```
Uses `nodemon` for automatic server restart on file changes.

### Production Mode
```bash
npm start
```

### Build
```bash
npm run build
```
(Currently a placeholder; static assets are pre-built)

## 📁 Project Structure

```
sparkdeck/
├── public/                 # Static files served to clients
│   ├── index.html         # Main entry point
│   ├── js/
│   │   ├── app.js         # Core application logic (SparkDeckApp class)
│   │   ├── carousel.js    # Carousel component for slide navigation
│   │   └── api-client.js  # API communication & caching
│   ├── styles/
│   │   ├── main.css       # Core styles with CSS variables
│   │   └── animations.css # Animation definitions
│   ├── assets/
│   │   └── sample-ideas.json  # Sample data for ideas
│   ├── demo/              # Individual demo pages per idea
│   └── images/            # Logos and thumbnails
├── server.js              # Express server configuration
├── package.json           # Dependencies and scripts
├── app.yaml               # Google Cloud App Engine config
├── dockerfile             # Docker containerization
└── .env                   # Environment variables (not committed)
```

## 🏗️ Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Uses vanilla JavaScript with a class-based architecture
- **Main App Class**: `SparkDeckApp` (in `app.js`) manages state, data loading, and view rendering
- **Component Model**: `Carousel` class handles slide navigation with touch/mouse support
- **API Layer**: `ApiClient` class provides caching and error handling

### Data Flow
1. User loads `index.html`
2. `SparkDeckApp` initializes and loads ideas from `/api/ideas`
3. Ideas are rendered in carousel and grid views
4. User interactions (filter, sort, navigate) update filtered view
5. Clicking an idea navigates to demo page at `demoUrl`

### Backend
- **Express Server** serves static files from `/public`
- **Security**: Helmet.js for CSP, CORS enabled
- **Performance**: Compression middleware enabled
- **Health Check**: `/health` endpoint for monitoring

## 🎨 Key Components & Files

### `app.js` - Main Application
- **SparkDeckApp Class**: Central controller
  - `loadIdeas()`: Fetches from `/api/ideas`
  - `filterByCategory()`: Client-side filtering
  - `renderCarousel()`, `renderGrid()`: View rendering
  - Event listener setup for navigation and submission

### `carousel.js` - Carousel Component
- **Carousel Class**: Handles slide transitions
  - Touch events (swipe on mobile)
  - Mouse drag on desktop
  - Smooth CSS transitions (500ms, cubic-bezier easing)
  - Wrap-around navigation (infinite loop)

### `api-client.js` - API Client
- **ApiClient Class**: Communication layer
  - 5-minute response caching
  - Fallback to sample data on failure
  - Error handling and retry logic
  - Query parameter support

### `main.css` - Styling System
- **CSS Variables** for theming:
  - Colors: `--primary`, `--secondary`, `--accent`, `--danger`
  - Spacing scale: `--spacing-xs` through `--spacing-2xl`
  - Transitions: `--transition-fast/normal/slow`
  - Shadows and border-radius utilities
- **Responsive Design**: Mobile-first with breakpoints at tablet and desktop
- **Gradient Text**: Used for hero section emphasis

## 💾 Data Structure

Ideas follow this schema (from `sample-ideas.json`):
```javascript
{
  id: number,
  title: string,
  subtitle: string,
  category: "tech" | "saas" | "ai" | "social",
  complexity: 1-5,
  rating: 1-5,
  description: string,
  features: string[],
  problem: string,
  solution: string,
  tags: string[],
  demoUrl: string,  // Path to demo page
  color: string,    // Hex color for card
  icon: string,     // Font Awesome class
  createdAt: ISO date,
  updatedAt: ISO date
}
```

## 🔌 API Endpoints

### Implemented
- `GET /api/ideas` - Returns all ideas (currently loads from sample-ideas.json)
- `GET /health` - Health check endpoint

### To Implement (see server.js comments)
- `POST /api/ideas` - Submit new idea
- `GET /api/ideas/:id` - Get specific idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/stats` - Platform statistics

## 🎯 Common Tasks

### Adding a New Startup Idea
1. Add entry to `public/assets/sample-ideas.json`
2. Create demo page in `public/demo/[name].html`
3. Add icon from Font Awesome to `icon` field
4. Choose color and category

### Filtering Ideas
- **Client-side**: Modify `.filterByCategory()` in `app.js`
- **Server-side**: Implement filtering in `/api/ideas` endpoint
- Filter by `category` field (tech, saas, ai, social)

### Styling Changes
- **Color theme**: Update CSS variables in `:root` in `main.css`
- **Layout**: Modify grid/flex properties in component sections
- **Animations**: Add/modify keyframes in `animations.css`

## 🚀 Deployment

### Google Cloud App Engine
```bash
npm run deploy:gcloud
```
Uses `app.yaml` configuration.

### Google Cloud Run
```bash
npm run deploy:cloud-run
```
Uses Docker container.

### Docker Build
```bash
docker build -t sparkdeck .
docker run -p 8080:8080 sparkdeck
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: "development" or "production"
- `PORT`: Server port (default: 8080)

### CSP (Content Security Policy)
Configured in `server.js` Helmet middleware:
- Allows Google Fonts and Font Awesome
- Restricts inline scripts (use `unsafe-inline` only in dev)
- Modify `contentSecurityPolicy` directives as needed

## ✅ Testing & Validation

### Manual Testing
1. Test carousel navigation (prev/next buttons)
2. Test touch swipe on mobile
3. Test category filters
4. Test grid/carousel view toggle
5. Verify all demo links work

### Browser DevTools
- Test responsive design at breakpoints
- Check Network tab for API calls
- Monitor Console for JavaScript errors

## 📝 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API returns 404 | Ensure `/api/ideas` endpoint is implemented in `server.js` |
| Styles not loading | Check that `/styles` path is correctly served in `app.yaml` |
| Carousel doesn't respond to touch | Verify touch event listeners in `carousel.js` |
| CORS errors | Ensure `cors()` middleware is enabled in `server.js` |
| Static files 404 | Verify `app.use(express.static(...))` path is correct |

## 🔐 Security

- **Helmet.js**: Protects against XSS, clickjacking, etc.
- **CORS**: Configured to allow cross-origin requests
- **CSP**: Strict content security policy (relaxed only where needed)
- **Input Validation**: To be implemented in submission endpoint

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Font Awesome Icons](https://fontawesome.com/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For questions or issues, please open a GitHub issue or contact the team.