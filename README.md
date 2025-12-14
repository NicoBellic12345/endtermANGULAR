Angular PWA with Firebase, custom API, and complete feature set for the final term project

✨ Key Features
🔐 Smart Authentication System
Firebase Authentication with email/password

Password validation: 8+ chars, 1 number, 1 special character

Email format validation

Route protection with Auth Guards

Observable authentication state

🌐 Custom REST API Integration
Personal API endpoints for menu management

List endpoint: 20+ menu items

Details endpoint: 7+ fields per item

Search with query parameters

Real-time data synchronization

🔍 Advanced Search & Filtering
Real-time search with debouncing (300ms)

Multi-category filtering

URL query parameter support

RxJS operators: debounceTime, distinctUntilChanged, switchMap

Pagination with customizable page sizes

⭐ Dual-Mode Favorites System
For guests: Saves to localStorage with persistence

For logged users: Syncs with Firestore under user UID

Automatic data merging on first login

Offline availability

UI notifications for all actions

📱 Full PWA Implementation
Service worker with active caching

App shell pre-caching strategy

Data caching for offline access

Custom offline message component

Manifest with app icons

👤 Profile Management
Profile picture upload (.jpg/.png)

Image compression via Web Worker

Firebase Storage integration

Firestore profile data storage

Automatic UI updates

📊 Data Management
TypeScript interfaces for all API responses

Reactive programming with RxJS

Error handling with catchError

Route parameters with ActivatedRoute

Form validation and state management

🚀 Technology Stack
Technology	Version	Purpose
Angular	20.3.4	Core framework
TypeScript	5.3+	Type-safe development
Firebase	Latest	Auth, Firestore, Storage
RxJS	7.8+	Reactive programming
Angular PWA	Built-in	Progressive Web App
📁 Project Structure
text
src/app/
├── core/                    # Core services, guards, interceptors
├── pages/                   # Application pages
│   ├── home/               # Home/About page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── items-list/         # Menu items list
│   ├── item-details/       # Item details view
│   ├── favorites/          # Favorites page
│   └── profile/            # User profile (protected)
├── models/                  # TypeScript interfaces
├── shared/                  # Reusable components
│   ├── navbar/             # Navigation bar
│   ├── header/             # App header
│   ├── favorite-button/    # Favorite toggle
│   └── offline-message/    # Offline status
└── workers/                 # Web Workers
    └── image-compressor/   # Image compression
🔧 Setup & Installation
Prerequisites
bash
Node.js 18+
Angular CLI 20+
Firebase account
Custom API endpoint
Installation
bash
# Clone repository
git clone https://github.com/NicoBellic12345/endtermANGULAR.git

# Install dependencies
npm install

# Configure environment
cp src/environments/environment.example.ts src/environments/environment.ts

# Set your Firebase config and API URL
# in environment.ts

# Run development server
ng serve

# Build for production
ng build --prod
Firebase Setup
Create Firebase project at console.firebase.google.com

Enable Authentication (Email/Password)

Enable Firestore Database

Enable Storage

Add web app and copy configuration

Update environment.ts with your config

API Configuration
Update API URL in environment files

Ensure endpoints match expected structure

Configure CORS if necessary

📱 Application Pages
1. Home/About (/)
Application introduction

Feature highlights

Navigation hub

2. Login (/login)
Email/password authentication

Form validation

Error handling

Redirect to profile after login

3. Signup (/signup)
Email validation

Password complexity check

Password confirmation match

Firebase user creation

4. Menu Items List (/menu)
Displays 5+ items per view

Search with debouncing

Filtering by categories

Pagination controls

URL query parameters

5. Item Details (/menu/:id)
Shows 7+ detailed fields

Add to favorites button

Related items suggestion

Share functionality

6. Favorites (/favorites)
Guest mode: localStorage

User mode: Firestore sync

Merge notification on login

Remove/clear functionality

7. Profile (/profile) Protected
Profile picture upload

Image compression via Web Worker

Firebase Storage integration

Picture display in header
