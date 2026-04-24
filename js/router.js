const routes = {
    "intro": "sections/01-intro.html",
    "styles": "sections/02-styles.html",
    "tradeoffs": "sections/03-tradeoffs.html",
    "quality": "sections/04-quality.html",
    "modular": "sections/05-modular.html",
    "layers": "sections/06-layers.html",
    "di": "sections/07-di.html",
    "ddd": "sections/08-ddd.html",
    "limits": "sections/09-limits.html",
    "sync": "sections/10-sync.html",
    "async": "sections/11-async.html",
    "idempotency": "sections/12-idempotency.html",
    "outbox": "sections/13-outbox.html",
    "saga": "sections/14-saga.html",
    "observability": "sections/15-observability.html",
    "security": "sections/16-security.html",
    "testing": "sections/17-testing.html",
    "resilience": "sections/18-resilience.html",
    "testing-adv": "sections/19-testing-adv.html",
    "docs": "sections/20-docs.html",
    "glosario": "sections/21-glosario.html"
};

async function loadPage() {
    const content = document.getElementById("main-content");
    const hash = window.location.hash.replace("#", "") || "intro";
    const url = routes[hash];

    if (url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error();
            content.innerHTML = await response.text();
            window.scrollTo(0, 0);
            
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('href') === `#${hash}`);
            });
        } catch (e) {
            content.innerHTML = "<div class='section'><h2>Error 404</h2><p>No se pudo cargar el módulo.</p></div>";
        }
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

window.addEventListener("hashchange", loadPage);
window.addEventListener("load", loadPage);