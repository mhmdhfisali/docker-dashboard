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

        // Parsing prefix pintar untuk membedakan 'smii' dan 'smii-ipc'
        let prefix = name
        if (name.includes("-")) {
          const parts = name.split("-")
          prefix =
            parts.length > 2 && isNaN(parts[1])
              ? `${parts[0]}-${parts[1]}`
              : parts[0]
        } else if (name.includes("_")) {
          prefix = name.split("_")[0]
        }

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

app.get("/api/logs/:name", (req, res) => {
  const containerName = req.params.name
  exec(`docker logs --tail 100 ${containerName}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ logs: stderr || err.message })
    res.json({ logs: stdout || "Belum ada log tercatat." })
  })
})

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
    const targetContainers = allNames.filter((n) =>
      n.toLowerCase().includes(prefix.toLowerCase()),
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

app.listen(PORT, () => {
  console.log(`🚀 Docker Control Center di http://localhost:${PORT}`)
})
