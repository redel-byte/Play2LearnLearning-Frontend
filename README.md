```
src/
│
├── graphql/
│   ├── client.js
│   │
│   └── modules/
│       ├── auth/
│       │   ├── queries.js
│       │   ├── mutations.js
│       │   └── fragments.js
│       │
│       ├── user/
│       │   ├── queries.js
│       │   ├── mutations.js
│       │   └── fragments.js
│       │
│       └── post/
│           ├── queries.js
│           ├── mutations.js
│           └── fragments.js
│
├── assets/
│   └── styles/
│       └── global.css
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Spinner.jsx
│   │
│   ├── forms/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   │
│   └── layout/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── Footer.jsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   └── public/
│       ├── Home.jsx
│       ├── About.jsx
│       └── Contact.jsx
│
├── context/
│   └── UIContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── useForm.js
│
├── utils/
│   ├── validators.js
│   └── formatters.js
│
├── routes/
│   ├── AppRouter.jsx
│   └── PrivateRoute.jsx
│
├── App.jsx
├── main.jsx
└── index.html
