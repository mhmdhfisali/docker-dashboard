<div align="center">

  <!-- Header Banner -->
  <img src="https://capsule-render.vercel.app/render?type=waving&color=gradient&customColorList=18,19,20&height=200&section=header&text=Docker%20Control%20Center&fontSize=42&fontColor=ffffff&animation=twinkling" width="100%" />

  <p align="center">
    <b>A lightweight, interactive, dynamic & collapsible Docker container dashboard controller.</b>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Version-v3.6%20Pro-sky?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-v18%2B-emerald?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Tunnel-Cloudflare-orange?style=for-the-badge&logo=cloudflare&logoColor=white" />
    <img src="https://img.shields.io/badge/UI-Tailwind%20CSS-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" />
  </p>

</div>

<hr />

## 🚀 Key Features

- 📦 **Smart Stack Auto-Grouping**: Automatically groups containers into isolated stack cards using precise prefix matching (e.g., `sppg`, `smii`, and `smii-ipc` without cross-stack conflicts).
- 🌐 **Instant Per-Container Public Tunnel**: One-click Cloudflare Tunnel launcher per port (`:8000`, `:8001`, `:8080`) to generate instant HTTPS links for mobile/remote testing.
- 🏷️ **Quick Filter Chips & Search**: Instantly filter between active project stacks (`ALL`, `SMII`, `SPPG`, etc.) or search specific containers on the fly.
- 🔽 **Collapsible Cards & Global Toggle**: Collapsible container list per stack card with working global _Expand All / Collapse All_ controls.
- 📊 **Real-time System Metrics**: Live CPU load percentage and total RAM memory consumption monitoring.
- 💻 **Terminal Logs Modal**: Inspect real-time container output logs directly inside a sleek built-in terminal modal.
- ⚡ **One-Click Power Control**: Gracefully turn individual stack groups ON/OFF or stop all running containers instantly.

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
````

⚙️ Tech Stack

- **Backend**: Node.js, Express.js (`child_process` execution for Docker CLI & Cloudflare Tunnel management)
- **Frontend**: HTML5, Tailwind CSS, FontAwesome Icons, Vanilla JS (Polling & Event Interception)
- **Tunnel Provider**: Cloudflare (`cloudflare/cloudflared:latest`)
- **Runtime**: Node.js & Docker Engine
