document.addEventListener('DOMContentLoaded', function () {
    fetchCurrencies()
    document
        .getElementById('currency-form')
        .addEventListener('submit', function (event) {
            event.preventDefault()
            const amount = document.getElementById('amount').value
            const baseCurrency = document.getElementById('base-currency').value
            const targetCurrency =
                document.getElementById('target-currency').value

            if (!amount) {
                alert('Veuillez entrer une valeur pour le montant.')
                return
            }

            if (amount <= 0) {
                alert('Veuillez entrer un montant positif.')
                return
            }

            if (baseCurrency === targetCurrency) {
                alert(
                    'La devise de base et la devise cible doivent être différentes.'
                )
                return
            }

            convertCurrency(amount, baseCurrency, targetCurrency)
        })
})

function fetchCurrencies() {
    fetch('https://api.frankfurter.app/currencies')
        .then((response) => response.json())
        .then((data) => {
            const baseCurrencySelect = document.getElementById('base-currency')
            const targetCurrencySelect =
                document.getElementById('target-currency')

            Object.keys(data).forEach((key) => {
                baseCurrencySelect.innerHTML += `<option value="${key}">${key}</option>`
                targetCurrencySelect.innerHTML += `<option value="${key}">${key}</option>`
            })
        })
        .catch((error) => {
            alert(
                'Problème lors de la récupération des devises. Veuillez réessayer plus tard.'
            )
            console.error('Erreur:', error)
        })
}

function convertCurrency(amount, base, target) {
    fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${target}`
    )
        .then((response) => response.json())
        .then((data) => {
            const result = data.rates[target]
            document.getElementById(
                'result'
            ).innerText = `Résultat : ${amount} ${base} = ${result} ${target}`
        })
        .catch((error) => {
            alert(
                'Problème lors de la conversion. Veuillez réessayer plus tard.'
            )
            console.error('Erreur:', error)
        })
}
