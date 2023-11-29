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
            const mode = document.getElementById('conversion-mode').value

            if (!amount) {
                alert('Veuillez entrer une valeur pour le montant.')
                return
            }

            if (amount <= 0) {
                alert('Veuillez entrer un montant positif.')
                return
            }

            if (mode === 'single') {
                if (baseCurrency === targetCurrency) {
                    alert(
                        'La devise de base et la devise cible doivent être différentes.'
                    )
                    return
                }
                convertCurrency(amount, baseCurrency, targetCurrency)
            } else if (mode === 'all') {
                convertToAllCurrencies(amount, baseCurrency)
            }
        })
})

function fetchCurrencies() {
    fetch('https://api.frankfurter.app/currencies')
        .then((response) => response.json())
        .then((data) => {
            const baseCurrencySelect = document.getElementById('base-currency')
            const targetCurrencySelect =
                document.getElementById('target-currency')

            baseCurrencySelect.innerHTML = ''
            targetCurrencySelect.innerHTML = ''

            Object.keys(data).forEach((key) => {
                baseCurrencySelect.innerHTML += `<option value="${key}">${key} - ${data[key]}</option>`
                targetCurrencySelect.innerHTML += `<option value="${key}">${key} - ${data[key]}</option>`
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
            const resultElement = document.getElementById('result')
            const result = data.rates[target]
            resultElement.innerText = `Résultat : ${amount} ${base} = ${result} ${target}`
            resultElement.style.display = 'block'
        })
        .catch((error) => {
            alert(
                'Problème lors de la conversion. Veuillez réessayer plus tard.'
            )
            console.error('Erreur:', error)
            document.getElementById('result').style.display = 'none'
        })
}

function convertToAllCurrencies(amount, base) {
    fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${base}`)
        .then((response) => response.json())
        .then((data) => {
            const resultElement = document.getElementById('result')
            let tableHTML =
                '<table><tr><th>Devise</th><th>Montant Converti</th></tr>'

            for (const key in data.rates) {
                tableHTML += `<tr><td>${key}</td><td>${data.rates[key]} ${key}</td></tr>`
            }

            tableHTML += '</table>'
            resultElement.innerHTML = tableHTML
            resultElement.style.display = 'block'
        })
        .catch((error) => {
            alert(
                'Problème lors de la conversion. Veuillez réessayer plus tard.'
            )
            console.error('Erreur:', error)
            document.getElementById('result').style.display = 'none'
        })
}
