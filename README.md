<div align="center">
  <img src="https://capsule-render.vercel.app/render?type=waving&color=gradient&customColorList=18,19,20&height=180&section=header&text=Docker%20Control%20Center&fontSize=38&fontColor=ffffff" width="100%" />

  <p align="center">
    <b>A lightweight, collapsible, and dynamic Docker container dashboard controller.</b>
  </p>
</div>

---

## 🚀 Features

* 📦 **Auto-Detect Stacks**: Auto-groups containers based on name prefix (e.g., `sppg`, `smii`, `udin`).
* 🔽 **Collapsible Cards**: Clean UI with toggleable container details.
* 🔗 **Live Interactive Port Links**: Automatically parses published ports (`:8000`, `:8080`) and creates one-click browser links.
* ⚡ **One-Click Power Control**: Turn stacks ON/OFF or stop all containers instantly.

---

## 🛠️ Installation & Setup

### Prerequisites
* **Node.js** (v18+)
* **Docker** running on host system

### Quick Start

```fish
# 1. Clone Repository
git clone [https://github.com/mhmdhfisali/docker-dashboard.git](https://github.com/mhmdhfisali/docker-dashboard.git)
cd docker-dashboard

# 2. Install Dependencies
npm install

# 3. Start Dashboard Server
node server.js
