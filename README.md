# Mkhonto Wesizwe Election Management System

A comprehensive election management and vote tracking system built with Ionic Angular and Firebase, designed for the Mkhonto Wesizwe (MK) political party to manage election data, track votes, and generate statistical reports.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Roles & Permissions](#user-roles--permissions)
- [Key Components](#key-components)
- [Services](#services)
- [Firebase Collections](#firebase-collections)
- [Building & Deployment](#building--deployment)
- [Usage Guide](#usage-guide)

## 🎯 Overview

The Mkhonto Wesizwe Election Management System is a mobile-first web application that enables election officials to:

- Record and track election results in real-time
- Manage voting stations, wards, and municipalities
- Monitor voter turnout and vote counts
- Generate statistical reports and visualizations
- Approve and manage user registrations
- Upload bulk election data via Excel files

The system supports multiple user roles with different access levels and provides comprehensive data validation and fraud detection capabilities.

## 🛠 Technology Stack

### Frontend Framework
- **Ionic 8.0** - Mobile-first UI framework
- **Angular 17** - TypeScript-based web framework
- **TypeScript 5.2** - Programming language

### Backend & Database
- **Firebase** - Backend-as-a-Service
  - Firebase Authentication - User authentication
  - Cloud Firestore - NoSQL database
  - Firebase Hosting - Web hosting

### Mobile Development
- **Capacitor 6.0** - Native mobile runtime
  - Android support
  - iOS support (configured)
  - Camera plugin
  - Haptics plugin
  - Status bar plugin

### Data Visualization
- **Chart.js 4.4** - Charting library
- **ng2-charts** - Angular wrapper for Chart.js
- **chartjs-plugin-zoom** - Chart zoom functionality

### Additional Libraries
- **XLSX** - Excel file parsing and generation
- **RxJS** - Reactive programming

## ✨ Features

### Authentication & User Management
- Email/password authentication via Firebase
- User registration with role-based access
- Account approval workflow (pending → active/denied)
- Password reset functionality
- Session management with route guards

### Election Data Management
- **Voter Turnout Recording**: Track voter turnout per voting station
- **Vote Counting**: Record votes for multiple political parties:
  - MK (Mkhonto Wesizwe)
  - ANC (African National Congress)
  - DA (Democratic Alliance)
  - EFF (Economic Freedom Fighters)
  - IFP (Inkatha Freedom Party)
  - ActionSA
- **Spoilt Ballots Tracking**: Record invalid/spoilt ballots
- **Data Validation**: Prevent duplicate submissions and validate data integrity
- **Bulk Upload**: Import election data from Excel files

### Geographic Hierarchy Management
- **Provinces**: 9 South African provinces
- **Municipalities**: Create and manage municipalities
- **Wards**: Organize wards within municipalities
- **Voting Stations (VD)**: Manage voting stations with voter roll data

### Statistics & Reporting
- **Real-time Statistics Dashboard**:
  - Total votes by party
  - Voter turnout percentages
  - Vote distribution charts
  - Performance comparisons
- **Visual Analytics**:
  - Pie charts for vote distribution
  - Bar charts for party performance
  - Line charts for trends
  - Interactive zoomable charts
- **Fraud Detection**: Alerts for discrepancies (e.g., total votes exceeding voter roll)

### Administrative Features
- **User Approval System**: Approve/deny user registrations
- **Role-based Access Control**: Different interfaces for different user roles
- **Data Export**: Export election data
- **Municipality Management**: Add/edit municipalities, wards, and voting stations

## 📁 Project Structure

```
Mkhonto-Wesizwe/
├── android/                    # Android native project (Capacitor)
├── src/
│   ├── app/
│   │   ├── approve/           # User approval page (SuperAdmin)
│   │   ├── auth.guard.ts     # Route protection guard
│   │   ├── counter/          # Vote counting page (GroundForce)
│   │   ├── election-results/ # Election results entry page
│   │   ├── get-doc/          # Document retrieval utility
│   │   ├── home/             # Landing/splash page
│   │   ├── interfaces/       # TypeScript interfaces
│   │   │   └── ward.interface.ts
│   │   ├── login/            # Login page
│   │   ├── municipality/     # Municipality management
│   │   ├── profile/          # User profile page
│   │   ├── region/           # Region admin dashboard
│   │   ├── region-stats/     # Regional statistics
│   │   ├── register/         # User registration
│   │   ├── reset/            # Password reset
│   │   ├── services/         # Angular services
│   │   │   ├── auth-service.service.ts
│   │   │   ├── firestore.service.ts
│   │   │   └── image-data.service.ts
│   │   ├── slip-take/        # Slip capture functionality
│   │   ├── spoilt-votes/     # Spoilt votes management
│   │   ├── stats/            # Statistics dashboard
│   │   ├── super-admin/      # Super admin dashboard
│   │   ├── upload-file/      # Excel file upload
│   │   ├── validation/       # User validation (RegionAdmin)
│   │   ├── vd/               # Voting station management
│   │   ├── view/             # Data viewing utilities
│   │   ├── app.component.ts  # Root component
│   │   ├── app.module.ts     # Root module
│   │   └── app-routing.module.ts # Routing configuration
│   ├── assets/               # Static assets (images, icons)
│   ├── environments/         # Environment configurations
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── theme/                # SCSS theme variables
│   ├── global.scss           # Global styles
│   ├── index.html            # Main HTML file
│   └── main.ts              # Application entry point
├── angular.json              # Angular CLI configuration
├── capacitor.config.ts       # Capacitor configuration
├── firebase.json             # Firebase hosting configuration
├── ionic.config.json         # Ionic configuration
├── package.json              # NPM dependencies
└── tsconfig.json            # TypeScript configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** (v8 or higher) or **yarn**
- **Angular CLI** (v17.0.0 or higher)
- **Ionic CLI** (v7 or higher)
- **Firebase CLI** (for deployment)
- **Java JDK** (for Android development)
- **Android Studio** (for Android builds)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mkhonto-Wesizwe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Copy your Firebase configuration
   - Update `src/environments/environment.ts` with your Firebase credentials

4. **Run the development server**
   ```bash
   npm start
   # or
   ionic serve
   ```

   The application will be available at `http://localhost:4200`

## ⚙️ Configuration

### Firebase Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### Default Admin Credentials

The system includes a default super admin account:
- **Email**: `admin@mk.com`
- **Password**: `@MK1234`

⚠️ **Important**: Change these credentials in production!

### Capacitor Configuration

Update `capacitor.config.ts` with your app details:

```typescript
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Mkhonto',
  webDir: 'www'
};
```

## 👥 User Roles & Permissions

### 1. SuperAdmin
- **Default Credentials**: `admin@mk.com` / `@MK1234`
- **Access**:
  - Approve/deny all user registrations
  - Access to all features
  - Municipality and ward management
  - Statistics dashboard
  - User management

### 2. RegionAdmin
- **Access**:
  - Approve/deny GroundForce users
  - View regional statistics
  - Manage regional data
  - Access validation page

### 3. GroundForce
- **Access**:
  - Record voter turnout
  - Enter election results
  - View assigned municipality/ward data
  - Submit vote counts
  - Limited to assigned voting stations

## 🔑 Key Components

### Authentication Flow
1. **Login** (`/login`): User authentication
2. **Register** (`/register`): New user registration (status: pending)
3. **Reset** (`/reset`): Password reset functionality
4. **Auth Guard**: Protects routes requiring authentication

### Election Data Entry

#### Counter Page (`/counter`)
- Primary interface for GroundForce users
- Records voter turnout per voting station
- Auto-populates user's assigned municipality/ward
- Validates data before submission
- Prevents duplicate submissions

#### Election Results Page (`/election-results`)
- Records vote counts for all parties
- Tracks spoilt ballots
- Calculates total votes
- Updates existing records with vote increments
- Requires voter turnout to be recorded first

### Administrative Pages

#### Super Admin (`/super-admin`)
- Dashboard for super administrators
- Access to all administrative functions

#### Approve (`/approve`)
- Approve/deny GroundForce user registrations
- Filter users by name, email, or status

#### Validation (`/validation`)
- Approve/deny RegionAdmin and SuperAdmin users
- Filter and manage admin-level users

#### Municipality (`/municipality`)
- Create municipalities
- Add wards to municipalities
- Add voting stations to wards
- Select provinces

### Statistics & Analytics

#### Stats Page (`/stats`)
- Real-time election statistics
- Multiple chart visualizations:
  - Party vote distribution (pie chart)
  - Vote performance comparison (bar chart)
  - Trend analysis (line chart)
  - MK votes by municipality
- Fraud detection alerts
- Total voter roll, turnout, and votes

#### Region Stats (`/region-stats`)
- Regional-level statistics
- Filtered by region/municipality

### Utility Pages

#### Upload File (`/upload-file`)
- Bulk import election data from Excel files
- Validates data format
- Checks for duplicates
- Supports XLSX format

#### View (`/view`)
- View submitted election data
- Data browsing utilities

## 🔧 Services

### AuthServiceService
- Manages user authentication state
- Provides current user email
- Handles Firebase Auth integration

### FirestoreService
- **Municipality Management**:
  - `addMunicipality()`: Create new municipality
  - `addWard()`: Add ward to municipality
  - `updateWard()`: Update ward information
  - `getMunicipalities()`: Retrieve all municipalities
- **Election Data**:
  - `submitElectionFormData()`: Submit election results
  - `getResults()`: Retrieve election data
- **Generic**:
  - `getCollectionRef()`: Get Firestore collection reference

### ImageDataService
- Stores image data temporarily
- Manages voting station images
- Used for slip capture functionality

## 🗄️ Firebase Collections

### Users Collection
```typescript
{
  name: string;
  email: string;
  status: 'pending' | 'active' | 'denied';
  role: 'SuperAdmin' | 'RegionAdmin' | 'GroundForce';
  municipality?: string;
  ward?: string;
  leader: string;
  cellNumber: string;
  counterSubmitsCount: number;
}
```

### Municipalities Collection
```typescript
{
  municipality: string;
  province: string;
  wards: Ward[];
}

interface Ward {
  ward: string;
  votingStations: VotingStation[];
}

interface VotingStation {
  name: string;        // VD Number
  voterRoll: number;
}
```

### ElectionData Collection
```typescript
{
  municipality: string;
  ward: string;
  vdNumber: string;
  voterRoll: number;
  voterTurnout: number;
  mkVotes: number;
  ancVotes: number;
  effVotes: number;
  ifpVotes: number;
  daVotes: number;
  actsaVotes: number;
  spoiltBallots: number;
  totalVotes: number;
  email: string;
  userEmail: string;
  leader: string;
  cellNumber: string;
  timestamp: Date;
  count: number;  // Submission count
}
```

**Document ID Format**: `{municipality}-{ward}-{vdNumber}-{date}`

## 🏗️ Building & Deployment

### Web Build

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production
```

Output directory: `www/`

### Android Build

1. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

2. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

3. **Build APK/AAB** in Android Studio

### Firebase Hosting Deployment

1. **Build for production**
   ```bash
   npm run build -- --configuration production
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

### Environment Configuration

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Update `angular.json` to use production environment:
```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

## 📖 Usage Guide

### For GroundForce Users

1. **Login** with your approved credentials
2. **Navigate to Counter Page** (auto-redirected)
3. **Select Voting Station (VD Number)**
   - Your municipality and ward are pre-filled
   - Voter roll auto-populates
4. **Enter Voter Turnout**
   - Click "Submit Voter Turnout"
   - Confirmation required
5. **Enter Election Results**
   - Navigate to "Election Results" page
   - Select the same voting station
   - Enter vote counts for each party
   - Enter spoilt ballots
   - Submit (can be updated multiple times)

### For RegionAdmin Users

1. **Login** with approved credentials
2. **Access Validation Page**
   - View pending RegionAdmin/SuperAdmin registrations
   - Approve or deny users
3. **View Regional Statistics**
   - Access region-stats page
   - Monitor regional performance

### For SuperAdmin Users

1. **Login** with admin credentials
2. **Manage Users**
   - Approve GroundForce users (`/approve`)
   - Approve admin users (`/validation`)
3. **Manage Municipalities**
   - Add municipalities (`/municipality`)
   - Add wards and voting stations
4. **View Statistics**
   - Access comprehensive stats dashboard (`/stats`)
5. **Upload Bulk Data**
   - Use upload-file page for Excel imports

### Bulk Data Upload

1. **Prepare Excel File**
   - Required columns: `municipality`, `ward`, `vdNumber`
   - Numeric columns: `voterRoll`, `voterTurnout`, `mkVotes`, `ancVotes`, etc.
2. **Navigate to Upload File Page**
3. **Select File** and click "Upload"
4. **System validates** and uploads data
5. **Duplicates are skipped** with notification

## 🔒 Security Features

- **Route Guards**: Protected routes require authentication
- **Role-based Access**: Different interfaces per user role
- **Account Status**: Pending accounts cannot access protected features
- **Data Validation**: Prevents invalid data submission
- **Duplicate Prevention**: Checks for existing records before submission
- **Fraud Detection**: Alerts when votes exceed voter roll

## 📊 Data Validation Rules

1. **Voter Turnout**:
   - Must be recorded before vote counts
   - Cannot be updated after votes are recorded
   - Must be numeric

2. **Vote Counts**:
   - All party votes must be numeric
   - Maximum length: 180 characters
   - Total votes calculated automatically
   - Cannot exceed voter roll (fraud alert)

3. **Voting Station Selection**:
   - Must select valid VD number
   - Must match user's assigned municipality/ward

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify Firebase configuration in `environment.ts`
   - Check Firebase project settings
   - Ensure Firestore rules allow read/write

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Angular cache: `ng cache clean`
   - Update dependencies: `npm update`

3. **Authentication Issues**
   - Verify Firebase Auth is enabled
   - Check user status in Firestore (must be 'active')
   - Verify email/password format

4. **Data Not Loading**
   - Check Firestore security rules
   - Verify collection names match exactly
   - Check browser console for errors

## 📝 Development Notes

- **Lazy Loading**: All feature modules use lazy loading for better performance
- **Reactive Forms**: Form validation using Angular Reactive Forms
- **Observables**: RxJS used throughout for data streams
- **Type Safety**: TypeScript interfaces for all data structures
- **Mobile-First**: Responsive design with Ionic components

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Specify your license here]

## 👤 Author

Mkhonto Wesizwe Development Team

## 📞 Support

For support and questions, contact the development team.

---

**Version**: 0.0.1  
**Last Updated**: 2024
