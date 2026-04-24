/**
 * IBS Glossary Tool v1.0
 * Escanea el contenido y activa modales para términos técnicos.
 */

document.addEventListener("DOMContentLoaded", () => {
    const glossaryData = {};
    
    // 1. Capturamos los elementos del Modal
    const modal = document.getElementById("glossary-modal");
    const modalTerm = document.getElementById("modal-term");
    const modalDef = document.getElementById("modal-definition");
    const closeModal = document.querySelector(".close-modal");

    if (!modal) {
        console.warn("Glossary Tool: No se encontró el HTML del modal.");
        return;
    }

    // 2. Extraemos los términos y definiciones de la Sección 19
    const glossaryTerms = document.querySelectorAll("#glosario dt");
    glossaryTerms.forEach(dt => {
        const term = dt.innerText.trim();
        const definition = dt.nextElementSibling ? dt.nextElementSibling.innerHTML : "";
        // Guardamos en minúsculas para una búsqueda insensible a mayúsculas
        glossaryData[term.toLowerCase()] = { term, definition };
    });

    // 3. Función para procesar nodos de texto únicamente (para no romper el HTML)
    function highlightTerms(node) {
        // No procesamos si es un bloque de código, un enlace o el propio glosario
        const skipTags = ['CODE', 'PRE', 'A', 'SCRIPT', 'STYLE', 'DT', 'DD'];
        if (skipTags.includes(node.parentElement.tagName) || node.parentElement.closest('#glosario')) {
            return;
        }

        const terms = Object.keys(glossaryData).sort((a, b) => b.length - a.length);
        let text = node.nodeValue;
        let hasChanges = false;

        terms.forEach(term => {
            // Regex: palabra exacta, insensible a mayúsculas
            const regex = new RegExp(`\\b(${term})\\b`, 'gi');
            if (regex.test(text)) {
                hasChanges = true;
                text = text.replace(regex, `<span class="glossary-link" data-term="$1">$1</span>`);
            }
        });

        if (hasChanges) {
            const tempDiv = document.createElement('span');
            tempDiv.innerHTML = text;
            node.replaceWith(...tempDiv.childNodes);
        }
    }

    // 4. Recorremos el DOM del contenido principal (<main>)
    const mainContent = document.querySelector('main');
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
    
    let textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    // Procesamos de atrás hacia adelante para no perder la referencia de los nodos
    textNodes.reverse().forEach(highlightTerms);

    // 5. Delegación de eventos para abrir el Modal
    mainContent.addEventListener("click", (e) => {
        if (e.target.classList.contains("glossary-link")) {
            const termKey = e.target.getAttribute("data-term").toLowerCase();
            const data = glossaryData[termKey];
            
            if (data) {
                modalTerm.innerText = data.term;
                modalDef.innerHTML = data.definition;
                modal.style.display = "flex";
            }
        }
    });

    // 6. Cerrar el Modal
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
});