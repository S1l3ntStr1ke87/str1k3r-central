function cloakAbout() {
    var url = window.location.href; // safer
    var win;

    win = window.open();
    win.document.body.style.margin = '0';
    var originalTitle = document.title;
    var faviconElement = document.querySelector('link[rel="icon"]');
    var faviconURL = faviconElement ? faviconElement.href : '';
    win.document.title = originalTitle;

    if (faviconURL) {
        var favicon = win.document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = faviconURL;
        win.document.head.appendChild(favicon);
    }

    var iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.style.overflow = 'hidden';
    iframe.src = url;
    win.document.body.appendChild(iframe);

    if (typeof redirectToDecoyFromCloak === 'function') {
        redirectToDecoyFromCloak();
    }

    var interval = setInterval(function() {
        if (win.closed) {
            clearInterval(interval);
            win = undefined;
        }
    }, 500);
}

function cloakBlob() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const blobURL = URL.createObjectURL(blob);
    const win = window.open(blobURL);

    const interval = setInterval(() => {
        if (!win || win.closed) clearInterval(interval);
    }, 500);
}

document.getElementById("cloaker").onclick = function() {
    const type = document.getElementById("cloak-type").value;

    if (type === "about") {
        cloakAbout();
    } else if (type === "blob") {
        cloakBlob();
    }
};
