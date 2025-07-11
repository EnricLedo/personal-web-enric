//Esta web tiene graficas muy chulas: https://www.properstar.es/suiza/conton-de-zurich/precio-vivienda
function calculateCompoundInterest() {
    // Retrieve input values from the form
    var principal = parseFloat(document.getElementById("principal").value);
    var anualRate = parseFloat(document.getElementById("rate").value) / 100;
    var months = parseFloat(document.getElementById("months").value);
    var frequency = parseInt(document.getElementById("frequency").value);
    var monthlyAddition = parseInt(document.getElementById("monthly-addition").value);

    if (isNaN(principal)){
        principal = 0;
    } 
    if (isNaN(anualRate)){
        anualRate = 0;
    } 
    if(isNaN(frequency)){
        frequency = 0;
    } 
    if(isNaN(months) || (isNaN(anualRate))) {
        var amount = 420.69; 
        var interest = 420.69;
    } else {

        /*
        Sumem l'interés que s'ha afegit mensualment, 
        i després li sumem el càlcul de l'interés del capital inicial
        
          10.000€ 10y 10% = 25.937,42€
          0€ 10y 10% (+10.000€/y) =  17,531.17€
          10.000€ 10y 10% (+10.000€/y) =  43,468.59€
        */
        amount = 0;
        for (let i = 0; i < months; i++) {
            amount = calculateOneMonthInterest(amount, anualRate);
            amount += monthlyAddition;
        }

        amount += principal * Math.pow(1 + anualRate / frequency, frequency * (months / 12));
        interest = amount - principal -(monthlyAddition * months);
    }

    function formatNumber(num) {
        // Convert number to string with two decimals and separate parts
        const parts = num.toFixed(2).split(".");
        
        // Apply thousand separator to the integer part
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        // Return integer part with dots and decimal part with a comma
        return integerPart + "," + parts[1];
    }
    
    // Use the function in the output
    document.getElementById("result").innerHTML = `
        <h2>Results:</h2>
        <p style="margin-top: 10px">Final Amount: ${formatNumber(amount)}€</p>
        <p>Total Interest: ${formatNumber(interest)}€</p>
    `;

    function calculateOneMonthInterest(amount, anualRate) {
        const monthlyRate = Math.pow(1 + anualRate, 1 / 12) - 1;
        return amount * (1 + monthlyRate);
    }    
}
