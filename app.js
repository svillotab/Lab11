class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;        
        this.rol = rol;            
        this.habilidades = habilidades; 
        this.imagen = imagen;      
    }

    
    htmlCard() {
        return `
        <div class="agente">
            <img src="${this.imagen}" alt="${this.nombre}" class="imagen">
            <div class="info">
                <h2>${this.nombre}</h2>
                <p>${this.rol}</p>
                <h3>Habilidades:</h3>
                <ul class="habilidades">
                    ${this.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}
                </ul>
            </div>
        </div>
        `;
    }
}

let agentes = [];

async function obtenerAgentes() {
    const response = await fetch('https://valorant-api.com/v1/agents');
    const json = await response.json();
    const data = json["data"];
    const addedNames = new Set();

    for (let agenteJson of data) {
        const rol = agenteJson.role ? agenteJson.role.displayName : null;
        const habilidades = agenteJson.abilities 
            ? agenteJson.abilities.map(habilidad => habilidad.displayName) 
            : [];

        if (rol && rol !== "Unknown Role" && !addedNames.has(agenteJson.displayName)) {
            const agente = new Agente(
                agenteJson.displayName,
                rol,
                habilidades,
                agenteJson.displayIcon
            );
            agentes.push(agente);
            addedNames.add(agenteJson.displayName);
        }
    }
    renderizarAgentes();
}

obtenerAgentes();

function renderizarAgentes() {
    const container = document.getElementById("agents-container");
    container.innerHTML = ""; 

    for (let agente of agentes) {
        container.innerHTML += agente.htmlCard();
    }
}

function filtrarAgentes(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === "") {
        renderizarAgentes();
    } else {
        const agentesFiltrados = agentes.filter(agente => {
            return agente.nombre.toLowerCase().includes(searchTerm);
        });
        renderizarFiltro(agentesFiltrados);
    }
}

function renderizarFiltro(agentesFiltrados) {
    const container = document.getElementById("agents-container");
    container.innerHTML = ""; 

    if (agentesFiltrados.length === 0) {
        container.innerHTML = "<p>No se encontraron agentes.</p>";
    } else {
        for (let agente of agentesFiltrados) {
            container.innerHTML += agente.htmlCard();
        }
    }
}

document.getElementById('search').addEventListener('input', filtrarAgentes);