<<<<<<< HEAD
# 🧵 Silk Heritage Loom — Backend & Integration Guide

## What's Included

```
silk-backend/
├── server.js                  ← Express app entry point
├── package.json
├── .env.example               ← Copy to .env and fill in values
├── models/
│   ├── User.js                ← User accounts + wishlist
│   ├── Order.js               ← Orders / checkout
│   └── Preloved.js            ← Pre-loved marketplace listings
├── routes/
│   ├── auth.js                ← Signup, login, profile, wishlist
│   ├── sarees.js              ← Saree catalog (your 100 sarees!)
│   ├── orders.js              ← Place & manage orders
│   ├── preloved.js            ← Pre-loved listings CRUD
│   └── artisans.js            ← Artisan profiles
├── middleware/
│   └── protect.js             ← JWT auth guard
└── seed/
    └── sareeData.js           ← Your frontend data, ready for the API

FRONTEND_FILES/                ← Drop these into your frontend project
├── src/lib/api.ts             ← All API calls in one place
├── src/context/AuthContext.tsx← Global auth state (login/logout)
├── src/pages/Checkout.tsx     ← Working checkout page
└── src/components/AuthModal.tsx← Login/Signup modal
```

---

## 🚀 Setup in 5 Steps

### Step 1 — Get MongoDB (free, 2 minutes)
1. Go to https://cloud.mongodb.com and create a free account
2. Create a **free cluster** (M0 tier)
3. Under "Database Access", create a user with a password
4. Under "Network Access", click "Allow Access from Anywhere"
5. Click "Connect" → "Drivers" → copy your connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### Step 2 — Configure the backend
```bash
# In the silk-backend/ folder:
cp .env.example .env
```
Open `.env` and fill in:
```
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/silk-heritage
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:8080
```

### Step 3 — Install & run the backend
```bash
cd silk-backend
npm install
npm run dev
```
You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### Step 4 — Add frontend files to your project
Copy the files from `FRONTEND_FILES/` into your frontend:
```
src/lib/api.ts              → silk-heritage-loom-main/src/lib/api.ts
src/context/AuthContext.tsx → silk-heritage-loom-main/src/context/AuthContext.tsx
src/pages/Checkout.tsx      → silk-heritage-loom-main/src/pages/Checkout.tsx
src/components/AuthModal.tsx→ silk-heritage-loom-main/src/components/AuthModal.tsx
```

### Step 5 — Update your frontend App.tsx

Make these 3 small changes to `src/App.tsx`:

**a) Add AuthProvider and Checkout route:**
```tsx
import { AuthProvider } from "@/context/AuthContext";
import Checkout from "./pages/Checkout";

// Wrap your app with <AuthProvider>:
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>          {/* ← Add this */}
        <CartProvider>
          ...
          <Routes>
            ...existing routes...
            <Route path="/checkout" element={<Checkout />} />  {/* ← Add this */}
          </Routes>
        </CartProvider>
      </AuthProvider>         {/* ← Add this */}
    </TooltipProvider>
  </QueryClientProvider>
);
```

**b) Create a `.env` file in your frontend root:**
```
VITE_API_URL=http://localhost:5000/api
```

**c) Connect the Checkout button in Cart.tsx:**
```tsx
// Replace the "Proceed to Checkout" button with:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
// ...
<button onClick={() => navigate("/checkout")} className="...existing classes...">
  Proceed to Checkout
</button>
```

**d) Add AuthModal to your Navbar:**
```tsx
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

// Inside Navbar component:
const [authOpen, setAuthOpen] = useState(false);
const { user, isLoggedIn, logout } = useAuth();

// In JSX, add a login button:
{isLoggedIn ? (
  <button onClick={logout} className="...">Sign Out ({user?.name})</button>
) : (
  <button onClick={() => setAuthOpen(true)} className="...">Sign In</button>
)}
<AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | - | Register |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/profile | ✅ | Get my profile |
| PUT | /api/auth/profile | ✅ | Update profile |
| POST | /api/auth/wishlist/:id | ✅ | Toggle wishlist |
| GET | /api/sarees | - | List sarees (with filters) |
| GET | /api/sarees/:id | - | Single saree + artisan |
| GET | /api/artisans | - | All artisans |
| POST | /api/orders | ✅ | Place order |
| GET | /api/orders/my | ✅ | My orders |
| PUT | /api/orders/:id/cancel | ✅ | Cancel order |
| GET | /api/preloved | - | All preloved listings |
| POST | /api/preloved | ✅ | Submit listing |
| GET | /api/preloved/my | ✅ | My listings |
| DELETE | /api/preloved/:id | ✅ | Delete my listing |

---

## Running Both Together

**Terminal 1 — Backend:**
```bash
cd silk-backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd silk-heritage-loom-main && npm run dev
```

Frontend: http://localhost:8080
Backend: http://localhost:5000



## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

