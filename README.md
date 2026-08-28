<div align="center">

  <!-- Header Banner -->
  <img src="https://capsule-render.vercel.app/render?type=waving&color=gradient&customColorList=18,19,20&height=200&section=header&text=Docker%20Control%20Center&fontSize=42&fontColor=ffffff&animation=twinkling" width="100%" />

  <p align="center">
    <b>A lightweight, interactive, and collapsible Docker container dashboard controller.</b>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-v18%2B-emerald?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-Control%20Panel-blue?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/UI-Tailwind%20CSS-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" />
  </p>

</div>

<hr />

## 🚀 Features

- 📦 **Auto-Detect Stacks**: Auto-groups containers based on name prefixes (e.g., `sppg`, `smii`, `udin`).
- 🔽 **Collapsible Cards**: Clean UI with toggleable stack container details and status badges.
- 📊 **Live System Metrics**: Real-time total CPU load percentage & RAM usage monitoring for all active containers.
- 🔗 **Interactive Port Links**: Automatically parses published ports (`:8000`, `:8080`) and generates one-click browser launcher links.
- 💻 **Terminal Log Viewer**: Inspect real-time `docker logs` directly inside a modern dark modal.
- 🔍 **Instant Search & Filter**: Quickly filter stack groups or specific containers on the fly.
- ⚡ **One-Click Power Control**: Turn individual stack groups ON/OFF or gracefully stop all running containers.

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18+)
- **Docker** running on host system

### Quick Start

```fish
# 1. Clone Repository
git clone [https://github.com/mhmdhfisali/docker-dashboard.git](https://github.com/mhmdhfisali/docker-dashboard.git)
cd docker-dashboard

# 2. Install Dependencies
npm install

# 3. Start Dashboard Server
node server.js

```

Dashboard will be accessible at `http://localhost:3000`.

---

## ⚙️ Tech Stack

- **Backend**: Express.js, Node.js (`child_process` execution for Docker CLI)
- **Frontend**: HTML5, Tailwind CSS (via CDN), FontAwesome Icons
- **Runtime**: Node.js & Docker Daemon
