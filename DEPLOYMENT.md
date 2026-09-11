# FQore — Production Deployment & Configuration Guide

This guide details how to deploy the **FQore** educational and digital blueprint platform to **Render** (Backend REST API) and **Vercel** (Frontend Next.js App) with **MongoDB Atlas** and **Cloudinary**.

---

## 1. Cloudinary Setup (Live Media & File Storage)

Cloudinary stores all uploaded images, video lessons, PDF blueprints, and Excel spreadsheets.

Credentials configured in your environment:
* **Cloud Name**: `xbvjx6qb`
* **API Key**: `312782684283273`
* **API Secret**: `m_xLdjxrYN3NsAT78tg-_o9TnTU`
* **CLOUDINARY_URL**: `cloudinary://312782684283273:m_xLdjxrYN3NsAT78tg-_o9TnTU@xbvjx6qb`

---

## 2. MongoDB Atlas Setup (Database)

Your live MongoDB Atlas connection URI:
```env
MONGODB_URI=mongodb+srv://FQoreadmin:HM2506@cluster0.oue58pu.mongodb.net/fqore_db?retryWrites=true&w=majority&appName=Cluster0
```

Network Access: Ensure `0.0.0.0/0` is added under Atlas **Network Access** so Render can connect.

The database is already pre-seeded with:
* **Admin Account**: `fqorein@gmail.com`
* **Admin Password**: `sunny005`
* **Categories**: Trading, Price Action, E-Commerce Startup, Business Strategies, Company Analysis, Case Studies, Investing, Resources.
* **Curriculum Content**: 10 high-value educational modules, downloadable PDF blueprints, and Excel financial models.
* **Pricing Plans**: Starter (₹59), Growth (₹99), Premium (₹149).

---

## 3. Render Deployment (Backend REST API)

1. Push code to your GitHub repo: `https://github.com/hasibmallick947933-netizen/fqorenew.git`
2. Sign in to [Render](https://render.com/).
3. Click **New +** &rarr; **Web Service**.
4. Connect your GitHub repository `fqorenew`.
5. Configure the service settings:
   - **Name**: `fqore-backend-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter
6. Add **Environment Variables** in Render:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production environment |
   | `PORT` | `10000` | Render port |
   | `MONGODB_URI` | `mongodb+srv://FQoreadmin:HM2506@cluster0.oue58pu.mongodb.net/fqore_db?retryWrites=true&w=majority&appName=Cluster0` | Live MongoDB Atlas cluster |
   | `JWT_SECRET` | `super_secret_jwt_key_edux_production_secure_778899` | Secret key for JWT auth |
   | `JWT_EXPIRE` | `30d` | Token expiration |
   | `CLOUDINARY_CLOUD_NAME` | `xbvjx6qb` | Cloudinary Cloud Name |
   | `CLOUDINARY_API_KEY` | `312782684283273` | Cloudinary API Key |
   | `CLOUDINARY_API_SECRET` | `m_xLdjxrYN3NsAT78tg-_o9TnTU` | Cloudinary API Secret |
   | `CLIENT_URL` | `https://your-fqore-frontend.vercel.app` | Your Vercel frontend URL |

7. Click **Create Web Service**. Once deployed, copy your API URL (e.g. `https://fqore-backend-api.onrender.com`).

---

## 4. Vercel Deployment (Frontend Next.js App)

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** &rarr; **Project**.
3. Import the `fqorenew` GitHub repository.
4. In the configuration screen:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click edit and select `frontend`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://fqore-backend-api.onrender.com/api` |
   *(Replace with your live Render backend URL)*
6. Click **Deploy**.

---

## 5. Local Development Instructions

### Backend
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### Admin Access
1. Visit `http://localhost:3000/login` (or on your live Vercel URL)
2. Log in with:
   - **Email**: `fqorein@gmail.com`
   - **Password**: `sunny005`
3. Navigate to `/admin` to manage content, upload media to Cloudinary, configure pricing plans, or manage users without modifying any code.
