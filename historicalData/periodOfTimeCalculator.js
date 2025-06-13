// Función para cargar la variable desde el archivo JSON seleccionado
function cargarVariable(nombreVariable) {
    return fetch('/historicalData/data/' + nombreVariable + '.json')
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
                let resultado = calculoMenorRentabilidad(nDays, stock);
                document.getElementById('resultado').innerText = 'El resultado de la suma es: ' + resultado;
            } else {
                document.getElementById('resultado').innerText = 'Hubo un error al cargar la variable.';
            }
        });
});


//Este método pretende calcular cual ha sido el peor momento para invertir en un activo en nDays.
function calculoMenorRentabilidad(nDays, stock) {
    
    let fechas = Object.keys(stock);
    fechas.sort((a, b) => new Date(a) - new Date(b));
    
    for (let i = 0; i < fechas.length-nDays; i++) {
        
        //Lineas insulsas
        let fechaInicial = new Date(firstDate);
        fechaInicial.setDate(fechaInicial.getDate() + nDays);
        
        
        let firstDate = fechas[i];
        let secondDate = formatDateToMDY(fechaInicial);


        let valorInicial = stock[firstDate];
        if()

    }
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

