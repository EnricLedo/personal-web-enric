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
                let resultado = calculoMayorMenorRentabilidad(nDays, stock);
                document.getElementById('resultado').innerText = 'El resultado de la suma es: ' + resultado;
            } else {
                document.getElementById('resultado').innerText = 'Hubo un error al cargar la variable.';
            }
        });
});


//Este método pretende calcular cual ha sido el mayor o peor momento para invertir en un activo en nDays.
function calculoMayorMenorRentabilidad(nDays, stock) {
    return nDays + stock; 
}
