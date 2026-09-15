# Appointment Booking System — Backend

A complete REST API backend (Node.js + Express + MongoDB/Mongoose) built to
power a doctor appointment booking application — matching the React
frontend pages: Login/Signup, My Profile, Doctors list, Doctor details &
booking, and My Appointments. It also includes a Doctor panel and Admin
panel API, so a separate admin dashboard frontend can plug straight in.

## Tech Stack
- Node.js, Express 4
- MongoDB with Mongoose
- JWT authentication (separate tokens for User, Doctor, Admin)
- bcrypt password hashing
- Multer + Cloudinary for image uploads (profile pictures, doctor photos)
- Razorpay-ready (optional online payments)

## Project Structure
```
backend/
├── server.js
├── package.json
├── .env.example
├── config/
│   ├── mongodb.js
│   └── cloudinary.js
├── models/
│   ├── userModel.js
│   ├── doctorModel.js
│   └── appointmentModel.js
├── controllers/
│   ├── userController.js
│   ├── doctorController.js
│   └── adminController.js
├── middleware/
│   ├── authUser.js
│   ├── authDoctor.js
│   ├── authAdmin.js
│   └── multer.js
├── routes/
│   ├── userRoute.js
│   ├── doctorRoute.js
│   └── adminRoute.js
└── seed/
    └── seedDoctors.js
```

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
- `MONGODB_URI` — MongoDB connection string (MongoDB Atlas recommended)
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the admin panel login
- `CLOUDINARY_*` — free Cloudinary account for image uploads
- `RAZORPAY_*` — optional, only needed for online payments

3. (Optional but recommended) Seed the database with the 15 doctors used
   in the frontend mock data, so the Doctors / booking pages work
   immediately:
```bash
node seed/seedDoctors.js
```
Each seeded doctor can log in to the doctor panel with
`doctorN@prescripto.com` / `doctor123` (N = 1..15).

4. Run the server:
```bash
npm run server   # nodemon, auto-restart
# or
npm start
```
Server runs on `http://localhost:4000` by default.

## API Reference

All responses are JSON: `{ success: boolean, message?, ...data }`.

### Auth headers
| Role   | Header   | Value                  |
|--------|----------|------------------------|
| User   | `token`  | JWT from user login    |
| Doctor | `dtoken` | JWT from doctor login  |
| Admin  | `atoken` | JWT from admin login   |

### User (Patient) — `/api/user`
| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/register`           | -    | `{ name, email, password }` → register & get token |
| POST   | `/login`              | -    | `{ email, password }` → get token |
| GET    | `/get-profile`        | user | Get logged-in user's profile |
| POST   | `/update-profile`     | user | multipart/form-data: `name, phone, address (JSON string), dob, gender, image?` |
| POST   | `/book-appointment`   | user | `{ docId, slotDate, slotTime }` |
| GET    | `/appointments`       | user | List logged-in user's appointments |
| POST   | `/cancel-appointment` | user | `{ appointmentId }` |

### Doctor — `/api/doctor`
| Method | Endpoint                 | Auth   | Description |
|--------|--------------------------|--------|-------------|
| GET    | `/list`                  | -      | Public list of all doctors (for Doctors/Home pages) |
| POST   | `/login`                 | -      | `{ email, password }` → get dtoken |
| GET    | `/appointments`          | doctor | Doctor's own appointments |
| POST   | `/complete-appointment`  | doctor | `{ appointmentId }` |
| POST   | `/cancel-appointment`    | doctor | `{ appointmentId }` |
| GET    | `/dashboard`             | doctor | Earnings, appointment count, patient count |
| GET    | `/profile`               | doctor | Doctor's own profile |
| POST   | `/update-profile`        | doctor | `{ fees, address, available }` |
| POST   | `/change-availability`   | doctor | Toggle availability |

### Admin — `/api/admin`
| Method | Endpoint                 | Auth  | Description |
|--------|--------------------------|-------|-------------|
| POST   | `/login`                 | -     | `{ email, password }` → get atoken |
| POST   | `/add-doctor`            | admin | multipart/form-data: doctor fields + `image` |
| GET    | `/all-doctors`           | admin | List all doctors |
| POST   | `/change-availability`   | admin | `{ docId }` |
| GET    | `/appointments`          | admin | All appointments |
| POST   | `/cancel-appointment`    | admin | `{ appointmentId }` |
| GET    | `/dashboard`             | admin | Global stats |

## Connecting the React Frontend

In your frontend `.env`:
```
VITE_BACKEND_URL=http://localhost:4000
```

Then in `AppContext.jsx`, replace the static `doctors` import with a real
fetch to `${backendUrl}/api/doctor/list`, and implement the Login page's
`onSubmitHandler` to call `/api/user/register` or `/api/user/login`,
storing the returned `token` (e.g. in `localStorage`) and sending it as
the `token` header on subsequent requests.

## Notes on Data Model
- `slotDate` format used throughout: `"D_M_YYYY"` (e.g. `"21_7_2025"`),
  matching the date format generated by the booking calendar UI.
- `slots_booked` on the Doctor document is a map of `slotDate -> [slotTime, ...]`
  used to prevent double-booking.
- Appointments store snapshots (`userData`, `docData`) at booking time so
  history remains intact even if the user/doctor later edits their profile.
