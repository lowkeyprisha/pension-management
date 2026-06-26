# 🏦 Pension Management System

A full-stack web application for managing pensioners, tracking monthly pension credits, and generating dynamic financial-year-wise credit sheets — built for administrative and government-style pension disbursement workflows.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Overview

PensionMS streamlines the entire lifecycle of pension management — from onboarding pensioners to processing monthly credits in bulk and generating auditable, financial-year-wise credit sheets (April–March, as per Indian FY conventions).

### Core Features

- **Pensioner Registration** — Onboard pensioners with personal, identity, banking, and nominee details
- **Search & Profile View** — Search by name, ID, or PPO number to view full profile + complete credit history
- **Bulk Monthly Credit Entry** — Batch-process pension credits for all active pensioners in one go, pre-filled with base pension amounts and editable per row
- **Financial Year Credit Sheet** — Auto-grouped by FY (Apr–Mar), with monthly breakdown, total disbursed, months paid, and average payout
- **Export** — Download credit sheets as CSV for auditing
- **Audit Trail** — Tracks who entered/updated each credit record and when
- **Status Lifecycle** — Active / Suspended / Deceased tracking per pensioner

---

## 🛠️ Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, Lucide React, React Router DOM, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose, dotenv, CORS

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/lowkeyprisha/pension-management.git
cd pension-management
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
