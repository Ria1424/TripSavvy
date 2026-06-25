# TripSavvy | Unified Travel Portal

TripSavvy is a modern, responsive travel planning and itinerary website designed to help users build, schedule, and budget their trips across India. The application features a dynamic design system with multiple travel-inspired color palettes and maintains all states (bookings, plans, expenses, and schedule timelines) directly in the browser's persistent storage.

## 🚀 Live Demo & Hosting
This project is structured as a standalone static **Single Page Application (SPA)**, making it fully compatible with serverless hosting environments like **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 🛠️ Tech Stack
- **Framework**: AngularJS (v1.8.2) for modular routing (`ngRoute`) and interactive client-side controllers
- **Libraries**: jQuery (v3.7.1) and Bootstrap (v5.3.3) for layout grids, interactive components, modals, and overlays
- **Styling**: Modern, responsive CSS with theme variables and smooth view transitions
- **Icons**: Font Awesome (v6.4.0)
- **Data Persistence**: Client-side `localStorage` (serverless, no database required)

---

## ✨ Key Features

1. **Unified Workspace Dashboard (`/dashboard`)**:
   - Manage your active trip's destination state, duration, start/end dates, and budget limits.
   - **Expense Planner**: Log expenses categorized by stay, transport, food, tickets, or guides. Renders a progress indicator warning when you cross your budget threshold.
   - **Day-by-Day Itinerary Builder**: Add and delete custom daily events, schedule them chronologically, and import booked activities/guides.

2. **Travel Calendar Planner (`/calendar`)**:
   - Interactive monthly calendar showing week grids (Sun to Sat) with back/forth month controls.
   - Highlight indicators for days containing scheduled events.
   - Dynamic schedule planner allowing you to view, add, or delete day-specific activities persistently.

3. **Color Theme Switcher**:
   - Toggle themes dynamically from the global navbar dropdown:
     - 🌶️ **Spice Market** (Warm Saffron orange, Teal, and Sand-Beige backgrounds)
     - 🌊 **Ocean Paradise** (Bright blue, Coral-red highlights, and soft Sky-blue backdrops)
     - 🌲 **Earth & Forest** (Deep green, Golden Amber, and warm earthy backdrops)

4. **Destination Explorer & Autocomplete Search (`/explore`)**:
   - Instant search queries with autocomplete suggestions matching Indian states (Rajasthan, Kerala, Maharashtra, Delhi, Gujarat, and Uttar Pradesh).
   - Highlighting seasonal recommendations, local languages, tourist spots, and direct "Add to Itinerary" shortcuts.

5. **Guide Matching (`/guides`)**:
   - Filter qualified local tour guides by specialty (History, Cuisine, Adventure, Culture, Nature), spoken languages, and price limits.
   - Built-in cost calculator based on selected travel dates and 5% service fees.

6. **Local Traditions & Activities matching (`/activities`)**:
   - Categorized database (nature safari, craft pottery classes, folk dance events) with bookmarks and reservation/scheduling modals.

7. **Travel Stories Blog (`/blog`) & Contact Portal (`/contact`)**:
   - Responsive stories reader with category filters and interactive modal full-text viewing.
   - Inquiry submissions with real-time toast feedback.

---
## 📂 Project Directory Structure

E068_MiniProject/
├── index.html                 # Main shell container (navbar, viewport, footer)
├── angular-route.js           # AngularJS Routing library
├── jquery-3.7.1.js            # jQuery library
├── css/
│   └── styles.css             # Consolidated global stylesheet & theme variables
├── js/
│   └── app.js                 # App configuration, routes, and controllers
├── images/                    # Local image files
└── templates/                 # Standalone view templates
    ├── landing.html           # Landing / About Page
    ├── exploredestinations.html
    ├── local.html             # Activities matching page
    ├── guides.html            # Guides booking page
    ├── calendar.html          # Interactive Calendar view
    ├── blog.html              # Travel stories
    ├── contact.html           # Contact form page
    ├── login.html
    ├── signup.html
    └── home.html              # Travel workspace dashboard
