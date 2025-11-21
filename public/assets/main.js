// Default fallback
const defaultCloak = {
  title: "Home",
  icon: "https://ssl.gstatic.com/classroom/favicon.png"
};

// --- Storage Helpers ---
function getCloak() {
  return JSON.parse(localStorage.getItem("tabCloak")) || defaultCloak;
}

function saveCloak(data) {
  localStorage.setItem("tabCloak", JSON.stringify(data));
}

// --- Apply Cloak to Current Page ---
function applyCloak() {
  const { title, icon } = getCloak();

  // Title
  document.title = title || defaultCloak.title;

  // Remove existing favicon(s)
  document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach(link => link.remove());

  // Add new favicon
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = icon || defaultCloak.icon;
  document.head.appendChild(favicon);
}

// --- Settings Page Controls ---
function setCloak() {
  const selection = document.getElementById("premadecloaks").value;
  const cloakOptions = {
    classroom: { title: "Home", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
    search: { title: "Google", icon: "https://www.google.com/favicon.ico" },
    drive: { title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" },
    search: { title: "calculator - Google Search", icon: "https://www.google.com/favicon.ico" },
    gmail: { title: "Gmail", icon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" },
    youtube: { title: "YouTube", icon: "https://www.youtube.com/s/desktop/ce69dda5/img/favicon.ico" },
    calendar: { title: "Google Calendar", icon: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_32.png" },
    meets: { title: "Google Meet", icon: "/assets/favicons/meets.ico" },
    canvas: { title: "Dashboard - Canvas", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
    zoom: { title: "Zoom Meeting", icon: "https://st1.zoom.us/zoom.ico" },
    khan: { title: "Khan Academy", icon: "https://cdn.kastatic.org/images/favicon.ico" },
    ixl: { title: "IXL | Math, Language Arts, Science, Social Studies, and Spanish", icon: "https://www.ixl.com/ixl-favicon.png" },
    blooket: { title: "Blooket – Fun, Free, Educational Games for Everyone", icon: "https://www.blooket.com/favicon.ico" },
    gimkit: { title: "Gimkit - live learning game show", icon: "https://www.gimkit.com/favicon.png" },
    harmony: { title: "Harmony Family Access", icon: "https://harmony.rbbcsc.k12.in.us/favicon.ico" },
    desmos: { title: "Desmos | Scientific Calculator", icon: "https://www.desmos.com/assets/img/apps/scientific/favicon.ico" },
    canva: { title: "Canva", icon: "https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico" },
  };

  const newCloak = cloakOptions[selection] || defaultCloak;
  saveCloak(newCloak);
  applyCloak();
  showNotification("Tab cloak applied!");
}

function resetTab() {
  localStorage.removeItem("tabCloak");
  applyCloak();
  showNotification("Tab cloak reset to default.");
}

// For live custom inputs
function setTitle(value) {
  const current = getCloak();
  current.title = value || defaultCloak.title;
  saveCloak(current);
  applyCloak();
}

function setFavicon(url) {
  const current = getCloak();
  current.icon = url || defaultCloak.icon;
  saveCloak(current);
  applyCloak();
}

// --- Apply cloak automatically on load ---
window.addEventListener("DOMContentLoaded", applyCloak);

/* -------------------------
   Particle toggle + loader
   ------------------------- */

function particlesDisabledInStorage() {
  try {
    const tab = JSON.parse(localStorage.getItem("tab")) || {};
    return tab.noparticles === "true";
  } catch {
    return false;
  }
}

function destroyParticlesInstances() {
  if (window.pJSDom && Array.isArray(window.pJSDom)) {
    window.pJSDom.forEach(inst => {
      try {
        inst.pJS.fn.vendors.destroypJS();
      } catch {}
    });
    window.pJSDom = [];
  }
}

function removeParticlesDOM() {
  const el = document.getElementById("particles-js");
  if (el) el.remove();
  document.querySelectorAll("canvas").forEach(c => {
    const rect = c.getBoundingClientRect();
    if (rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9) {
      c.remove();
    }
  });
}

// Apply soft grey background when particles are off
function applyNoParticlesBackground() {
  document.body.style.background = "#000000ff"; // change color here
  document.body.style.backgroundImage = "none";
  console.log("Applied gray background");
}

// Remove the gray background when particles are re-enabled
function removeNoParticlesBackground() {
  document.body.style.background = "";
  console.log("Restored normal background");
}

function removeAndDestroyAllParticles() {
  destroyParticlesInstances();
  removeParticlesDOM();
  applyNoParticlesBackground();
}

// Disable particles
function DisableParticles() {
  const tabData = JSON.parse(localStorage.getItem("tab")) || {};
  tabData.noparticles = "true";
  localStorage.setItem("tab", JSON.stringify(tabData));
  removeAndDestroyAllParticles();
  showNotification("Particles disabled");
}

// Enable particles
function EnableParticles() {
  const tabData = JSON.parse(localStorage.getItem("tab")) || {};
  tabData.noparticles = "false";
  localStorage.setItem("tab", JSON.stringify(tabData));
  removeNoParticlesBackground();
  showNotification("Particles enabled!");
  window.location.reload();
}

// Conditionally load particles.js
function conditionalLoadParticles() {
  if (particlesDisabledInStorage()) {
    console.log("Particles disabled — skipping load.");
    removeAndDestroyAllParticles();
    return;
  }

  removeNoParticlesBackground();

  const script = document.createElement("script");
  script.src = "/assets/particles.js";
  script.async = true;
  script.onload = () => {
    console.log("particles.js loaded.");
    if (typeof initParticles === "function") initParticles();
  };
  document.head.appendChild(script);
}

// Run on load
window.addEventListener("DOMContentLoaded", conditionalLoadParticles);

function getCloakSafe() {
  try {
    if (typeof getCloak === "function") return getCloak();
  } catch (e) { /* ignore */ }

  try {
    return JSON.parse(localStorage.getItem("tabCloak")) || { title: "Home", icon: "/favicon.ico" };
  } catch {
    return { title: "Home", icon: "/favicon.ico" };
  }
}

/**
 * Redirect current tab to a decoy URL determined by the saved tab cloak.
 * If tabCloak.url exists it will be used first.
 * Otherwise it will try to match cloak.title to a sensible decoy mapping.
 * Falls back to Google Classroom if nothing matches.
 */
function redirectToDecoyFromCloak() {
  const cloak = getCloakSafe();

  // If you store a real url in tabCloak, prefer it:
  if (cloak.url && typeof cloak.url === "string" && cloak.url.trim()) {
    window.location.replace(cloak.url);
    return;
  }

  // Map common cloak titles -> decoy URLs
  const decoyMap = {
    "Google": "https://www.google.com",
    "My Drive - Google Drive": "https://drive.google.com",
    "Home": "https://classroom.google.com",
    "calculator - Google Search": "https://www.google.com/search?q=calculator",
    "Gmail": "https://mail.google.com",
    "YouTube": "https://www.youtube.com",
    "Google Calendar": "https://calendar.google.com",
    "Google Meet": "https://meet.google.com",
    "Dashboard - Canvas": "https://canvas.instructure.com",
    "Zoom Meeting": "https://zoom.us",
    "Khan Academy": "https://www.khanacademy.org",
    "IXL | Math, Language Arts, Science, Social Studies, and Spanish": "https://www.ixl.com",
    "Blooket – Fun, Free, Educational Games for Everyone": "https://www.blooket.com",
    "Gimkit - live learning game show": "https://www.gimkit.com",
    "Harmony Family Access": "https://harmony.rbbcsc.k12.in.us/familyaccess.nsf/",
    "Desmos | Scientific Calculator": "https://www.desmos.com/scientific",
    "Canva": "https://canva.com"
  };

  // Choose decoy by title match (exact). If no exact match, try a case-insensitive partial match.
  let target = decoyMap[cloak.title];

  if (!target) {
    const titleLower = (cloak.title || "").toLowerCase();
    for (const [k, v] of Object.entries(decoyMap)) {
      if (k.toLowerCase() === titleLower || (k.toLowerCase().includes(titleLower) && titleLower.length > 3) || titleLower.includes(k.toLowerCase())) {
        target = v;
        break;
      }
    }
  }

  // Final fallback
  if (!target) target = "https://classroom.google.com";

  window.location.replace(target);
}

function showNotification(message, duration = 3000) {
    const notifs = document.getElementById('notifs');
    if (!notifs) return;

    const notification = document.createElement('div');
    notification.textContent = message;

    // Styling
    notification.style.background = '#111';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.border = '2px solid #6A03A7';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    notification.style.transform = 'translateY(-10px)';
    notification.style.position = 'relative';

    notifs.prepend(notification);

    // Fade in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.addEventListener('transitionend', () => notification.remove());
    }, duration);
}

// SETTINGS PAGE - search engine chooser using notification system
document.addEventListener("DOMContentLoaded", () => {
  const engineSelector = document.getElementById("engine-selector");
  const setBtn = document.getElementById("set-engine");
  const resetBtn = document.getElementById("reset-engine");
  if (!engineSelector) return; // not on settings page

  const defaultEngine = "https://duckduckgo.com/search?q=%s";

  // Load saved engine into dropdown (if any)
  const savedEngine = localStorage.getItem("searchEngine") || defaultEngine;
  engineSelector.value = savedEngine;

  // --- Set Engine (save manually) ---
  if (setBtn) {
    setBtn.addEventListener("click", () => {
      const selected = engineSelector.value;
      localStorage.setItem("searchEngine", selected);
      showNotification(`Search engine set to ${getEngineName(selected)}!`);
    });
  }

  // --- Reset Engine ---
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("searchEngine");
      engineSelector.value = defaultEngine;
      showNotification("Search engine reset to Default!");
    });
  }

  // helper to get readable name
  function getEngineName(url) {
    if (url.includes("google")) return "Google";
    if (url.includes("bing")) return "Bing";
    if (url.includes("brave")) return "Brave";
    if (url.includes("startpage")) return "Startpage";
    return "Duckduckgo";
  }
});

// HOMEPAGE - read engine dynamically and handle search + proxy
document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname !== "/") return;

    const proxyContainer = document.getElementById("proxy-container");
    const sjForm = document.getElementById("sj-form");
    const uvForm = document.getElementById("uv-form");
    const sjInput = document.getElementById("sj-address");
    const sjEngine = document.getElementById("sj-search-engine");
    const uvInput = document.getElementById("uv-address");
    const uvEngine = document.getElementById("uv-search-engine");

    // Determine selected proxy
    const selectedProxy = localStorage.getItem("proxyChoice") || "sj";

    // Initialize forms visibility
    function switchProxy(proxy) {
        if (proxy === "sj") {
            sjForm.classList.remove("hidden");
            uvForm.classList.add("hidden");
        } else {
            sjForm.classList.add("hidden");
            uvForm.classList.remove("hidden");
        }
    }
    switchProxy(selectedProxy);

    // Set search engines
    sjEngine.value = localStorage.getItem("searchEngine") || "https://duckduckgo.com/search?q=%s";
    uvEngine.value = localStorage.getItem("searchEngine") || "https://duckduckgo.com/search?q=%s";

    const { ScramjetController } = $scramjetLoadController();
    const scramjet = new ScramjetController({
        files: {
            wasm: '/scram/scramjet.wasm.wasm',
            all: '/scram/scramjet.all.js',
            sync: '/scram/scramjet.sync.js',
        },
    });
    await scramjet.init();

    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

    function createLoadingOverlay() {
        const overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #6A03A7;
            font-family: 'Quicksand Bold', sans-serif;
        `;
        const logo = document.createElement("img");
        logo.src = "/assets/logo.webp";
        logo.style.width = "80px";
        logo.style.marginBottom = "20px";
        overlay.appendChild(logo);

        const text = document.createElement("div");
        text.textContent = "Loading…";
        text.style.fontSize = "1.2rem";
        text.style.marginBottom = "30px";
        overlay.appendChild(text);

        const spinner = document.createElement("div");
        spinner.style.cssText = `position: relative; width: 80px; height: 80px;`;
        const dotCount = 6;
        const radius = 30;
        const dotSize = 8;
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("div");
            const angle = (360 / dotCount) * i;
            dot.style.cssText = `
                width: ${dotSize}px;
                height: ${dotSize}px;
                background: #6A03A7;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px);
                animation: dot-spin 2s linear infinite;
                animation-delay: ${(i * 0.1)}s;
            `;
            spinner.appendChild(dot);
        }
        overlay.appendChild(spinner);

        const style = document.createElement("style");
        style.textContent = `
            @keyframes dot-spin {
                0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${radius}px); }
                100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${radius}px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        return overlay;
    }

    async function handleSubmit(form, input, engine, frameId, useUV) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const query = input.value.trim();
            if (!query) return;

            let targetUrl;
            try {
                targetUrl = new URL(query).href;
            } catch {
                if (/\S+\.\S+/.test(query) && !/\s/.test(query))
                    targetUrl = "https://" + query;
                else
                    targetUrl = engine.value.replace("%s", encodeURIComponent(query));
            }

            const overlay = createLoadingOverlay();

            // Set iframe
            let frame = document.getElementById(frameId);
            if (!frame) {
                frame = document.createElement("iframe");
                frame.id = frameId;
                frame.style.width = "100%";
                frame.style.height = "100vh";
                frame.style.border = "none";
                document.body.appendChild(frame);
            }

            const startTime = Date.now();
            frame.onload = () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(5000 - elapsed, 0);
                setTimeout(() => {
                    overlay.style.transition = "opacity 0.5s";
                    overlay.style.opacity = "0";
                    setTimeout(() => overlay.remove(), 500);
                }, remaining);
            };

            if (useUV) {
                frame.style.display = "block";
                let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
                if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
                    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                }
                frame.src = __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
            } else {
                frame.style.display = "block";
                let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
                if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
                    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                }
                const sjFrame = scramjet.createFrame();
                sjFrame.frame = frame; // reuse iframe
                sjFrame.go(targetUrl);
            }
        });
    }

    await handleSubmit(sjForm, sjInput, sjEngine, "sj-frame", false);
    await handleSubmit(uvForm, uvInput, uvEngine, "uv-frame", true);

    // Example: dynamically switch proxies from settings
    window.switchProxy = (proxy) => {
        localStorage.setItem("proxyChoice", proxy);
        switchProxy(proxy);
    };
});

/* --------------------------
   Panic key (replace tab)
   -------------------------- */

/**
 * Settings storage structure:
 * {
 *   combo: "Ctrl+P"        // user-visible string (case-insensitive)
 *   url: "https://..."     // redirect target
 * }
 */
const PANIC_KEY_STORAGE = "panicKeySettings_v2";

// default
const DEFAULT_PANIC = {
  combo: "`",
  url: "https://www.google.com"
};

function loadPanicSettings() {
  try {
    return JSON.parse(localStorage.getItem(PANIC_KEY_STORAGE)) || DEFAULT_PANIC;
  } catch {
    return DEFAULT_PANIC;
  }
}

function savePanicSettings(settings) {
  localStorage.setItem(PANIC_KEY_STORAGE, JSON.stringify(settings));
}

/** Normalize and validate URL: if no scheme, prefix https:// */
function normalizeUrl(u) {
  if (!u || typeof u !== "string") return DEFAULT_PANIC.url;
  const trimmed = u.trim();
  if (!trimmed) return DEFAULT_PANIC.url;
  // allow data:, about:, and normal http(s)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return "https://" + trimmed;
}

/** Parse a combo string like "ctrl+shift+p" into an object for matching */
function parseCombo(comboStr) {
  const parts = comboStr.split("+").map(p => p.trim().toLowerCase()).filter(Boolean);
  const req = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    key: null // the final key name (lowercased)
  };
  for (const p of parts) {
    if (p === "ctrl" || p === "control") req.ctrl = true;
    else if (p === "shift") req.shift = true;
    else if (p === "alt") req.alt = true;
    else if (p === "meta" || p === "cmd" || p === "win" || p === "super") req.meta = true;
    else req.key = p; // last non-modifier becomes the key
  }
  return req;
}

/** Compare an event to the parsed combo */
function eventMatchesCombo(e, parsed) {
  // modifiers must exactly match presence (so accidental ctrl won't trigger)
  if (!!e.ctrlKey !== !!parsed.ctrl) return false;
  if (!!e.shiftKey !== !!parsed.shift) return false;
  if (!!e.altKey !== !!parsed.alt) return false;
  if (!!e.metaKey !== !!parsed.meta) return false;

  // Compare key names (normalize)
  // For letters/digits and function keys e.key is descriptive (e.g., "Escape", "F1", "a")
  const evKey = (e.key || "").toString().toLowerCase();

  // If parsed.key is null, we treat it as a pure-modifier combo (rare) -> no match
  if (!parsed.key) return false;

  // Normalize common synonyms
  const norm = (k) => {
    if (k === "esc") return "escape";
    if (k === "del") return "delete";
    if (k === "return") return "enter";
    if (k === "cmd") return "meta";
    return k;
  };

  return norm(evKey) === norm(parsed.key);
}

/** Hide page and replace tab with target URL */
function stealthReplace(url) {
  try {
    // optional: hide content immediately for stealth
    document.documentElement.style.transition = "none";
    document.documentElement.style.opacity = "0";
    // some extra hiding
    document.documentElement.style.pointerEvents = "none";
  } catch (e) {}

  // Use replace to overwrite current history entry
  window.location.replace(url);
}

/** Attach listener (ensures only one listener installed) */
let _panicListenerInstalled = false;
function initPanicKeyListener() {
  if (_panicListenerInstalled) return;
  _panicListenerInstalled = true;

  const settings = loadPanicSettings();
  const parsed = parseCombo(settings.combo || DEFAULT_PANIC.combo);
  const url = normalizeUrl(settings.url || DEFAULT_PANIC.url);

  document.addEventListener("keydown", function(e) {
    // ignore if focus is on input/textarea/contenteditable to avoid accidental triggers while typing
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
      return;
    }

    if (eventMatchesCombo(e, parsed)) {
      e.preventDefault();
      e.stopPropagation();
      stealthReplace(url);
    }
  }, { capture: true });
}

/* ---------------------------
   Settings UI wiring
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // wire only if the elements exist on the page
  const keyInput = document.getElementById("panic-key");
  const urlInput = document.getElementById("panic-url");
  const saveBtn = document.getElementById("save-panic-key");
  const resetBtn = document.getElementById("reset-panic-key");

  // populate defaults
  const settings = loadPanicSettings();
  if (keyInput) keyInput.value = settings.combo || DEFAULT_PANIC.combo;
  if (urlInput) urlInput.value = settings.url || DEFAULT_PANIC.url;

  if (saveBtn && keyInput && urlInput) {
    saveBtn.addEventListener("click", () => {
      const comboRaw = (keyInput.value || "").trim();
      const urlRaw = (urlInput.value || "").trim();

      if (!comboRaw) {
        showNotification("Please enter a key or combo (e.g. Escape or Ctrl+P).");
        return;
      }

      const parsed = parseCombo(comboRaw);
      if (!parsed.key) {
        showNotification("Combo must include a non-modifier key (e.g. Ctrl+P or F1).");
        return;
      }

      const normalized = {
        combo: comboRaw,
        url: normalizeUrl(urlRaw || DEFAULT_PANIC.url)
      };

      savePanicSettings(normalized);
      showNotification(`Panic saved: ${normalized.combo} → ${normalized.url}`, 3000);

      // Re-init listener so it uses updated settings:
      // (Easiest approach: reload the page listener by reloading the page. But we can also rebind.)
      // For simplicity, reload so all contexts pick up the new listener:
      setTimeout(() => window.location.reload(), 600);
    });
  }

  if (resetBtn && keyInput && urlInput) {
    resetBtn.addEventListener("click", () => {
      savePanicSettings(DEFAULT_PANIC);
      if (keyInput) keyInput.value = DEFAULT_PANIC.combo;
      if (urlInput) urlInput.value = DEFAULT_PANIC.url;
      showNotification("Panic key reset to default.", 1500);
      setTimeout(() => window.location.reload(), 600);
    });
  }

  // initialize the runtime listener
  initPanicKeyListener();
});

// ----------------------
// Proxy Selector Settings
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const proxySelector = document.getElementById("proxy-selector");
  const saveProxyBtn = document.getElementById("save-proxy");
  const resetProxyBtn = document.getElementById("reset-proxy");

  if (!proxySelector) return; // not on settings page

  // Load saved proxy choice
  const savedProxy = localStorage.getItem("proxyChoice") || "sj";
  proxySelector.value = savedProxy;

  // Save button
  if (saveProxyBtn) {
    saveProxyBtn.addEventListener("click", () => {
      const choice = proxySelector.value || "sj";
      localStorage.setItem("proxyChoice", choice);
      showNotification(`Proxy saved: ${choice.toUpperCase()}!`, 2500);
    });
  }

  // Reset button
  if (resetProxyBtn) {
    resetProxyBtn.addEventListener("click", () => {
      localStorage.removeItem("proxyChoice");
      proxySelector.value = "sj";
      showNotification("Proxy reset to default", 2500);
    });
  }
});

document.querySelectorAll('.request-form').forEach(form => {
    const status = form.nextElementSibling;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const inputs = this.querySelectorAll('input');
        const name = inputs[0].value.trim() || 'Anonymous';
        const title = inputs[1].value.trim();
        const url = inputs[2].value.trim();

        // Only require Game Name
        if (!title) {
            status.textContent = 'Game name is required.';
            status.style.color = '#ff0000';
            return;
        }

        // Build message: include URL only if provided
        let message = '';
        if (url) {
            message = `URL: ${url}`;
        } else {
            message = `(No URL provided)`;
        }

        status.textContent = 'Sending...';
        status.style.color = '#6a03a7';

        try {
            const res = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    subject: `[GAME] ${title}`,
                    message
                })
            });

            if (res.ok) {
                status.textContent = 'Sent!';
                status.style.color = '#00ff00';
                this.reset();
            } else throw new Error();
        } catch (err) {
            console.error(err);
            status.textContent = 'Failed – bot running?';
            status.style.color = '#ff0000';
        }
    });
});

function hideNavbar() {
            document.getElementById('navbar').style.display = 'none';
        }