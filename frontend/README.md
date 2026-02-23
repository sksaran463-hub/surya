# ANPR System - Frontend

A modern, responsive React web application for Automatic Number Plate Recognition.

## Features

- 🚗 **Home Page**: Upload images/videos and detect license plates
- 📊 **History Page**: View all previous detections in a table format
- 🎨 **Modern UI**: Clean, card-based design with gradients and animations
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time**: Loading spinners and error handling
- 🎯 **User-friendly**: Intuitive interface with clear feedback

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://127.0.0.1:5000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure the backend Flask server is running on port 5000

2. Start the React development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Backend Setup

The backend requires Flask-CORS. Install it with:
```bash
pip install flask-cors
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── History.js
│   │   └── History.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## API Endpoints Used

- **POST /detect**: Upload file for plate detection
- **GET /history**: Fetch detection history

## Technologies Used

- React 18
- React Router DOM
- Fetch API
- CSS3 with modern features (Grid, Flexbox, Animations)

## Features Implemented

✅ File upload with preview
✅ Loading spinner during processing
✅ Error handling with user-friendly messages
✅ Disabled button state when no file selected
✅ Green highlight for detected plate numbers
✅ Confidence score display
✅ Processed output image/video display
✅ History table with latest records first
✅ Empty state handling
✅ Responsive design for all screen sizes
✅ Modern card-based UI
✅ Smooth animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
