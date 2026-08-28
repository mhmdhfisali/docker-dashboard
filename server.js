const express = require("express")
const { exec } = require("child_process")
const path = require("path")

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

function parsePorts(rawPorts) {
  if (!rawPorts) return []
  const ports = []
  const matches = rawPorts.matchAll(/(?:0\.0\.0\.0|:::):(\d+)->/g)
  for (const match of matches) {
    if (!ports.includes(match[1])) ports.push(match[1])
  }
  return ports
}

// Helper untuk ekstrak prefix stack yang konsisten
function getStackPrefix(name) {
  if (name.includes("-")) {
    const parts = name.split("-")
    return parts.length >= 3 ? `${parts[0]}-${parts[1]}` : parts[0]
  } else if (name.includes("_")) {
    return name.split("_")[0]
  }
  return name
}

// Get Stacks & Stats
app.get("/api/status", (req, res) => {
  exec(
    'docker ps -a --format "{{.Names}}|{{.State}}|{{.Ports}}"',
    (err, stdout) => {
      if (err) return res.status(500).json({ error: err.message })

      const rawContainers = stdout.split("\n").filter(Boolean)
      const stacks = {}
      let totalRunning = 0

      rawContainers.forEach((item) => {
        const [name, state, rawPorts] = item.split("|")
        const isRunning = state.toLowerCase() === "running"
        if (isRunning) totalRunning++

        if (name.startsWith("tunnel-")) return

        const prefix = getStackPrefix(name)

        if (!stacks[prefix]) {
          stacks[prefix] = {
            prefix: prefix,
            name: prefix.toUpperCase() + " Stack",
            containers: [],
            isRunning: false,
          }
        }

        stacks[prefix].containers.push({
          name,
          isRunning,
          ports: parsePorts(rawPorts),
        })

        if (isRunning) stacks[prefix].isRunning = true
      })

      exec(
        'docker stats --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}"',
        (statsErr, statsStdout) => {
          let cpuTotal = 0
          let memSummary = "0B / 0B"

          if (!statsErr && statsStdout) {
            const lines = statsStdout.split("\n").filter(Boolean)
            lines.forEach((l) => {
              const [cpu] = l.split("|")
              cpuTotal += parseFloat(cpu.replace("%", "")) || 0
            })
            if (lines.length > 0) {
              memSummary = lines[0].split("|")[1] || "Active"
            }
          }

          res.json({
            stacks,
            totalRunning,
            totalContainers: rawContainers.length,
            cpuUsage: cpuTotal.toFixed(1) + "%",
            memUsage: memSummary,
          })
        },
      )
    },
  )
})

// Start Dynamic Tunnel per Port Specific
app.post("/api/tunnel/start", (req, res) => {
  const { containerName, port } = req.body
  const tunnelName = `tunnel-${containerName}-${port}`

  exec(`docker ps -a --format "{{.Names}}"`, (err, stdout) => {
    const exists = stdout.split("\n").includes(tunnelName)

    const cmd = exists
      ? `docker start ${tunnelName}`
      : `docker run -d --name ${tunnelName} --net=host --restart=no cloudflare/cloudflared:latest tunnel --url http://127.0.0.1:${port}`

    exec(cmd, (runErr) => {
      if (runErr) return res.status(500).json({ error: runErr.message })
      res.json({ message: "Tunnel starting", tunnelName })
    })
  })
})

// Check Log URL Tunnel Spesifik
app.get("/api/tunnel/url/:tunnelName", (req, res) => {
  const { tunnelName } = req.params
  exec(`docker logs --tail 50 ${tunnelName}`, (err, stdout, stderr) => {
    const logs = (stdout || "") + (stderr || "")
    const match = logs.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/)
    res.json({ url: match ? match[0] : null })
  })
})

// Stop Tunnel Spesifik
app.post("/api/tunnel/stop", (req, res) => {
  const { tunnelName } = req.body
  exec(`docker stop ${tunnelName}`, () => {
    res.json({ message: "Tunnel stopped" })
  })
})

// Logs Container
app.get("/api/logs/:name", (req, res) => {
  const containerName = req.params.name
  exec(`docker logs --tail 100 ${containerName}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ logs: stderr || err.message })
    res.json({ logs: stdout || "Belum ada log tercatat." })
  })
})

// Stacks Toggle Presisi
app.post("/api/toggle", (req, res) => {
  const { prefix, action } = req.body

  if (action === "stop_all") {
    return exec("docker stop $(docker ps -q)", () =>
      res.json({ message: "All stopped" }),
    )
  }

  exec(`docker ps -a --format "{{.Names}}"`, (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message })

    const allNames = stdout.split("\n").filter(Boolean)
    const targetContainers = allNames.filter(
      (name) => getStackPrefix(name).toLowerCase() === prefix.toLowerCase(),
    )

    if (targetContainers.length === 0)
      return res.status(404).json({ error: "Stack not found" })

    const cmd =
      action === "start"
        ? `docker start ${targetContainers.join(" ")}`
        : `docker stop ${targetContainers.join(" ")}`

    exec(cmd, (execErr, execStdout) => {
      if (execErr) return res.status(500).json({ error: execErr.message })
      res.json({ message: "Success", output: execStdout })
    })
  })
})

app.listen(PORT, () =>
  console.log(`🚀 Docker Control Center di http://localhost:${PORT}`),
)
