// =======================
// FORCE BASIC STYLES
// =======================
document.body.style.cursor = "none";
document.body.style.background = "#ffffff";

// =======================
// NEXUS BRIDGE (IMPORTANT)
// =======================
function nexusMouseMove(x, y) {
    const evt = new MouseEvent("mousemove", {
        clientX: x,
        clientY: y,
        bubbles: true
    });
    document.dispatchEvent(evt);
}

// =======================
// AUTO CONNECT BUTTON
// =======================
const connectBtn = document.createElement("button");
connectBtn.innerText = "Connect micro:bit";

Object.assign(connectBtn.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "999999999",
    padding: "10px 15px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
});

document.body.appendChild(connectBtn);

// =======================
// VARIABLES
// =======================
let started = false;
let buttons = [];
let selectedIndex = 0;
let buffer = "";

// =======================
// CURSOR SYSTEM
// =======================
let cursor, light;
let targetX = window.innerWidth - 60;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

// =======================
// CREATE CURSOR
// =======================
function createCursor() {
    if (cursor) return;

    cursor = document.createElement("div");
    Object.assign(cursor.style, {
        position: "fixed",
        width: "14px",
        height: "14px",
        background: "cyan",
        borderRadius: "50%",
        zIndex: "99999999",
        pointerEvents: "none",
        boxShadow: "0 0 20px cyan"
    });

    document.body.appendChild(cursor);

    light = document.createElement("div");
    Object.assign(light.style, {
        position: "fixed",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(0,0,0,0) 70%)",
        zIndex: "99999998"
    });

    document.body.appendChild(light);

    animateCursor();
}

// =======================
// ANIMATION LOOP
// =======================
function animateCursor() {
    currentX += (targetX - currentX) * 0.25;
    currentY += (targetY - currentY) * 0.25;

    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";

    light.style.left = (currentX - 100) + "px";
    light.style.top = (currentY - 100) + "px";

    // 🔥 MAKE NEXUS FX WORK
    nexusMouseMove(currentX, currentY);

    // 🔥 HOVER SIMULATION
    const hoverEl = document.elementFromPoint(currentX, currentY);
    if (hoverEl) {
        hoverEl.dispatchEvent(new MouseEvent("mouseover", {
            bubbles: true,
            clientX: currentX,
            clientY: currentY
        }));
    }

    // TRAIL DOT
    const dot = document.createElement("div");
    Object.assign(dot.style, {
        position: "fixed",
        left: currentX + "px",
        top: currentY + "px",
        width: "6px",
        height: "6px",
        background: "cyan",
        borderRadius: "50%",
        pointerEvents: "none",
        opacity: "0.6",
        zIndex: "99999997",
        transition: "all 0.4s linear"
    });

    document.body.appendChild(dot);

    setTimeout(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(0.3)";
    }, 10);

    setTimeout(() => dot.remove(), 400);

    requestAnimationFrame(animateCursor);
}

// =======================
// MOVE CURSOR
// =======================
function moveCursor(dx, dy) {
    targetX += dx * 8;
    targetY += dy * 8;

    targetX = Math.max(0, Math.min(window.innerWidth, targetX));
    targetY = Math.max(0, Math.min(window.innerHeight, targetY));
}

// =======================
// BUTTON SYSTEM
// =======================
function waitForButtons() {
    const check = setInterval(() => {
        buttons = Array.from(document.querySelectorAll(".mega-btn"));

        if (buttons.length > 0) {
            clearInterval(check);
            selectedIndex = 0;
            highlightSelected();
        }
    }, 300);
}

function highlightSelected() {
    buttons.forEach((btn, i) => {
        btn.style.outline = (i === selectedIndex) ? "3px solid cyan" : "";
        btn.style.boxShadow = (i === selectedIndex) ? "0 0 15px cyan" : "";
    });
}

// =======================
// BUTTON ACTIONS
// =======================
function selectNext() {
    buttons = Array.from(document.querySelectorAll(".mega-btn"));
    if (buttons.length === 0) return;

    selectedIndex++;
    if (selectedIndex >= buttons.length) selectedIndex = 0;

    highlightSelected();
}

function clickSelected() {
    if (buttons.length === 0) return;

    const el = buttons[selectedIndex];

    ["mousedown", "mouseup", "click"].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, {
            bubbles: true
        }));
    });

    selectedIndex = 0;
    highlightSelected();
}

// =======================
// CURSOR CLICK
// =======================
function cursorClick() {
    const el = document.elementFromPoint(currentX, currentY);
    if (!el) return;

    ["mousedown", "mouseup", "click"].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, {
            bubbles: true,
            clientX: currentX,
            clientY: currentY
        }));
    });

    cursor.style.background = "white";
    setTimeout(() => cursor.style.background = "cyan", 100);
}

// =======================
// LOAD NEXUS
// =======================
function launchNexus() {
    if (document.getElementById("nexus-script")) return;

    const script = document.createElement("script");
    script.id = "nexus-script";
    script.src = "https://cdn.jsdelivr.net/gh/hsuxy8uxi/nexustools@latest/nexustools.js";
    document.body.appendChild(script);

    createCursor();
    waitForButtons();
}

// =======================
// SERIAL
// =======================
connectBtn.onclick = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const reader = port.readable.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);

        let lines = buffer.split("\n");
        buffer = lines.pop();

        for (let line of lines) {
            const text = line.trim();
            if (!text) continue;

            console.log("Received:", text);

            if (!started && text === "A") {
                started = true;
                launchNexus();
                continue;
            }

            if (!started) continue;

            if (text === "A") {
                selectNext();
                continue;
            }

            if (text === "B") {
                clickSelected();
                continue;
            }

            if (text === "AB") {
                cursorClick();
                continue;
            }

            if (text.startsWith("TILT:")) {
                const data = text.split(":")[1];
                if (!data) continue;

                const parts = data.split(",");
                if (parts.length < 2) continue;

                const dx = parseInt(parts[0]);
                const dy = parseInt(parts[1]);

                if (isNaN(dx) || isNaN(dy)) continue;

                moveCursor(dx, dy);
            }
        }
    }
};
