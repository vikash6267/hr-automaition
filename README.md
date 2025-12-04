# HR Workflow Designer

A clean and concise prototype of an **HR Workflow Builder** built using **React, Redux Toolkit, React Flow**, and **TailwindCSS**. This tool allows HR teams to visually design workflows like onboarding, approvals, and automated steps.

[![My Skills](https://skillicons.dev/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://skillicons.dev)

---

## 🚀 Features

- Drag-and-drop **workflow canvas** (React Flow)
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
