"use strict";

// ----- SEARCH FUNCTION (unified) -----
function search(input, template) {
    try {
        return new URL(input).toString();
    } catch {}

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch {}

    return template.replace("%s", encodeURIComponent(input));
}

// ----- REGISTER SERVICE WORKER (unified) -----
async function registerSW(proxyChoice = "sj") {
    if (!navigator.serviceWorker) {
        const swAllowedHostnames = ["localhost", "127.0.0.1"];
        if (location.protocol !== "https:" && !swAllowedHostnames.includes(location.hostname))
            throw new Error("Service workers cannot be registered without https.");
        throw new Error("Your browser doesn't support service workers.");
    }

    let stockSW = proxyChoice === "uv" ? "/uv/sw.js" : "./sw.js";
    await navigator.serviceWorker.register(stockSW);
}

// ----- BAREMUX CONNECTION (shared) -----
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

// ----- SJ FORM HANDLER -----
(function() {
    const form = document.getElementById("sj-form");
    const input = document.getElementById("sj-address");
    const hiddenEngine = document.getElementById("sj-search-engine");
    if (!form || !input || !hiddenEngine) return;

    hiddenEngine.value = localStorage.getItem("searchEngine") || "https://duckduckgo.com/search?q=%s";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try { await registerSW("sj"); } catch (err) { 
            document.getElementById("sj-error").textContent = "Failed to register service worker.";
            document.getElementById("sj-error-code").textContent = err.toString();
            throw err;
        }

        const url = search(input.value, hiddenEngine.value);

        let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }

        const { ScramjetController } = $scramjetLoadController();
        const scramjet = new ScramjetController({
            files: {
                wasm: '/scram/scramjet.wasm.wasm',
                all: '/scram/scramjet.all.js',
                sync: '/scram/scramjet.sync.js',
            },
        });

        await scramjet.init();

        const frame = scramjet.createFrame();
        frame.frame.id = "sj-frame";
        document.body.appendChild(frame.frame);
        frame.go(url);
    });
})();

// ----- UV FORM HANDLER -----
(function() {
    const form = document.getElementById("uv-form");
    const input = document.getElementById("uv-address");
    const hiddenEngine = document.getElementById("uv-search-engine");
    if (!form || !input || !hiddenEngine) return;

    hiddenEngine.value = localStorage.getItem("searchEngine") || "https://duckduckgo.com/search?q=%s";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try { await registerSW("uv"); } catch (err) { 
            document.getElementById("uv-error").textContent = "Failed to register service worker.";
            document.getElementById("uv-error-code").textContent = err.toString();
            throw err;
        }

        const url = search(input.value, hiddenEngine.value);

        let frame = document.getElementById("uv-frame");
        frame.style.display = "block";

        let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }

        frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
})();
