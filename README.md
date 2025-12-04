# HR Workflow Designer

<a href="https://your-live-link-here.com" target="_blank"><img src="https://img.shields.io/badge/LIVE_DEMO-000?style=for-the-badge&logo=vercel&logoColor=white" /></a>

A clean and concise prototype of an **HR Workflow Builder** built using **React, Redux Toolkit, React Flow**, and **TailwindCSS**. This tool allows HR teams to visually design workflows like onboarding, approvals, and automated steps.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 Features

- Drag‑and‑drop **workflow canvas** (React Flow)
- **Five node types:** Start, Task, Approval, Automated, End
- **Node configuration panel** with editable forms
- **Validation:** start/end requirements, no cycles, no orphan nodes
- **Simulation panel** with mock API (`/simulate`)
- **Export & Import** workflow JSON
- **Redux Toolkit** for global workflow state
- Toast notifications for all actions

---

## 🛠 Tech Stack

- React 18
- Redux Toolkit
- React Flow
- TailwindCSS
- Vite
- Lucide Icons

---

## 📂 Structure

```
src/
├── components/
│   ├── workflow/
│   ├── nodes/
│   └── forms/
├── store/ (Redux Toolkit)
├── services/ (Mock API)
└── utils/
```

---

## ▶️ Run Locally

```
npm install
npm run dev
```

Build:

```
npm run build
```

---

## 🔧 Mock API

**GET /automations** → returns available automated actions

**POST /simulate** → returns workflow execution steps

---

## 📌 Overview

A lightweight, scalable workflow designer built with a focus on:

- clean modular architecture
- extendable node system
- accurate workflow graph validation
- smooth UX with drag-and-drop + form editing

---
