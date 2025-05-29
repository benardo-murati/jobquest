# JobQuest

**JobQuest** is a full-stack job listing and application platform built with React, Firebase, and modern web technologies. Employers (admins) can post jobs, review and manage applications; job seekers (users) can browse, search, apply for jobs, upload profiles, and manage their applications.

## 🚀 Features

- **Authentication**: Email/password sign-up, Google OAuth, "Remember me" option
- **User Profiles**: Display name, avatar upload via ImgBB
- **Job Listings**: Browse, search and filter jobs by keyword, salary, and job type
- **Applications**: Users can apply/withdraw; admins can accept/reject
- **Admin Dashboard**: Create, edit, delete job postings; review and manage all applications
- **Responsive UI**: Mobile‑friendly design with Tailwind‐inspired utility classes
- **Dark Mode**: Optional theme toggler (if included)

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Context API
- **Backend-as-a-Service**: Firebase Authentication, Firestore, Firebase Storage
- **Image Upload**: ImgBB API
- **Styling**: CSS Modules or Tailwind‑style classes

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your‑username>/jobquest.git
   cd jobquest
   ```

2. **Install dependencies**

   ```bash
   npm install

   ```

3. **Create a Firebase project**

   - Enable **Authentication** (Email/Password, Google)
   - Enable **Firestore** database
   - Enable **Storage** bucket
   - Copy your Firebase config values

4. **Obtain ImgBB API Key**

   - Sign up at [https://imgbb.com/](https://imgbb.com/)
   - Go to **API** section, generate a key

5. **Configure environment variables**
   Create a `.env` file in the project root with:

   ```ini
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=measurement_id
   REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
   ```

6. **Run locally**

   ```bash
   npm start
   # or
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Folder Structure

```
├── public/                # Static assets
├── src/
│   ├── components/        # Shared UI components (NavBar, Footer)
│   ├── contexts/          # React Context (AuthContext)
│   ├── pages/             # Route components (Home, Jobs, Profile, etc.)
│   ├── services/          # Firebase config and helpers
│   ├── App.js             # Main router
│   ├── index.js           # Entry point
│   └── App.css            # Global styles
├── .env                   # Environment variables (not committed)
├── package.json
└── README.md
```

## 🔧 Scripts

- `npm start` — Run development server
- `npm run build` — Build production assets
- `npm test` — Run tests (if any)

## 🎯 Deployment

You can deploy this project to Firebase Hosting, Vercel, Netlify, or any static site host.

Example (Firebase Hosting):

```bash
npm run build
gcloud init          # if using gcloud CLI
firebase deploy      # with Firebase CLI configured
```

## 📜 License

This project is licensed under the **MIT License**

---

Happy hacking! 🚀
