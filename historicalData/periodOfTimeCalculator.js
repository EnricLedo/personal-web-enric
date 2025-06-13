// Función para cargar la variable desde el archivo JSON seleccionado
function cargarVariable(nombreVariable) {
    return fetch('/historicalData/data/formatedToJson/' + nombreVariable + '.json')
        .then(response => response.json())
        .then(data => data.stock)
        .catch(error => {
            console.error("Error cargando el archivo JSON:", error);
            return null;
        });
}


document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    let nDays = parseInt(document.getElementById('numero').value);

    let variableSeleccionada = document.getElementById('selector').value;

    cargarVariable(variableSeleccionada)
        .then(stock => {
            if (stock !== null) {
                document.getElementById('resultado').innerText = calculoMenorRentabilidad(nDays, stock);
            } else {
                document.getElementById('resultado').innerText = 'Hubo un error al cargar la variable.';
            }
        });
});

function mostrarPrimerYUltimo(nombreVariable) {
    fetch('/historicalData/data/formatedToJson/' + nombreVariable + '.json')
        .then(response => response.json())
        .then(data => {
            const stockObj = data.stock;
            const fechas = Object.keys(stockObj);
            if (fechas.length > 0) {
                // Ordena las fechas para asegurar el orden cronológico
                fechas.sort((a, b) => {
                    // Formato MM/DD/YYYY, conviértelo a YYYY-MM-DD para comparar
                    const [ma, da, ya] = a.split('/');
                    const [mb, db, yb] = b.split('/');
                    const dateA = new Date(`${ya}-${ma}-${da}`);
                    const dateB = new Date(`${yb}-${mb}-${db}`);
                    return dateA - dateB;
                });
                const primeraFecha = fechas[0];
                const ultimaFecha = fechas[fechas.length - 1];
                const primerValor = stockObj[primeraFecha];
                const ultimoValor = stockObj[ultimaFecha];
                document.getElementById('infoValores').innerText =
                    `Primer valor: ${primerValor} (${primeraFecha})\nÚltimo valor: ${ultimoValor} (${ultimaFecha})`;
            } else {
                document.getElementById('infoValores').innerText = 'No hay datos disponibles.';
            }
        })
        .catch(error => {
            document.getElementById('infoValores').innerText = 'Error al cargar datos.';
        });
}

document.getElementById('selector').addEventListener('change', function() {
    mostrarPrimerYUltimo(this.value);
});

// Opcional: mostrar los valores del primer elemento al cargar la página
window.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById('selector');
    if (selector.value) {
        mostrarPrimerYUltimo(selector.value);
    }
});


function cargarVariablesDisponibles() {
    fetch('/historicalData/lista_valores.json')
        .then(response => response.json())
        .then(variables => {
            const selector = document.getElementById('selector');
            selector.innerHTML = '';
            variables.forEach(variable => {
                const option = document.createElement('option');
                option.value = variable;
                option.textContent = variable;
                selector.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error cargando la lista de variables:", error);
        });
}

window.addEventListener('DOMContentLoaded', cargarVariablesDisponibles);


//Este método pretende calcular cual ha sido el peor momento para invertir en un activo en nDays.
function calculoMenorRentabilidad(nDays, stockAlReves) {
    
    let fechas = Object.keys(stockAlReves);
    fechas.sort((a, b) => new Date(a) - new Date(b));

    const stock = Object.fromEntries(
        Object.entries(stockAlReves)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    );

    let peorResultado = 10000000;
    let mejorResultado = -10000000;
    let peorFechaInicial;
    let peorFechaFinal;
    let mejorFechaInicial;
    let mejorFechaFinal;

    for (let i = 0; i < fechas.length; i++) { //Si restas nDays, puesto que los findes esta cerrada la bolsa y ese valor no se muestra, acaban faltando muchos datos.

        let firstDate = fechas[i];

        let fechaInicial = new Date(firstDate);
        fechaInicial.setDate(fechaInicial.getDate() + nDays);

        let secondDate = findNextAvailableDate(fechaInicial, stock);

        if (!secondDate) {
            if(i===0){
                console.warn("No ha pasado tanto tiempo!");
                return "No ha pasado tanto tiempo!";
            }
            console.warn("Ja no hi ha més dades.");
            break;
        } else {
            const firstValue = parseFloat(stock[firstDate].replace(',', ''));
            const secondValue = parseFloat(stock[secondDate].replace(',', ''));

            let rentabilidad = calcularRentabilidadAnualizada(firstValue, secondValue, nDays)
            console.log(rentabilidad);

            if(rentabilidad < peorResultado){
                peorResultado = rentabilidad;
                peorFechaInicial = firstDate;
                peorFechaFinal = secondDate;
            }
            if (rentabilidad > mejorResultado){
                mejorResultado = rentabilidad;
                mejorFechaInicial = firstDate;
                mejorFechaFinal = secondDate;
            }
        }
    }

    return "La mejor rentabilidad anualizada en " + nDays + " días ha sido de: " + mejorResultado.toFixed(2) + "%, entre " + mejorFechaInicial + " y " + mejorFechaFinal + ". \n" +
        "La peor rentabilidad anualizada en " + nDays + " días ha sido de: " + peorResultado.toFixed(2) + "%, entre " + peorFechaInicial + " y " + peorFechaFinal + "."
}

function calcularRentabilidadAnualizada(valorInicial, valorFinal, nDays) {
    if (valorInicial <= 0 || nDays <= 0) {
        throw new Error("El valor inicial y los días deben ser mayores que cero.");
    }

    let ratio = valorFinal / valorInicial;
    let rentabilidad = Math.pow(ratio, 365 / nDays) - 1;
    return Number((rentabilidad * 100));
}

function formatDateToMDY(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-indexed)
    const dd = String(date.getDate()).padStart(2, '0');       // Día
    const yyyy = date.getFullYear();                          // Año
    return `${mm}/${dd}/${yyyy}`;
}

function findNextAvailableDate(fechaInicial, stock, maxDiasBuscar = 10) {
    let intentos = 0;
    let fechaFormateada = formatDateToMDY(fechaInicial);

    while (!stock.hasOwnProperty(fechaFormateada) && intentos < maxDiasBuscar) {
        fechaInicial.setDate(fechaInicial.getDate() + 1);
        fechaFormateada = formatDateToMDY(fechaInicial);
        intentos++;
    }

    // Si se encontró una fecha válida, devuélvela; si no, devuelve null.
    return stock.hasOwnProperty(fechaFormateada) ? fechaFormateada : null;
}
