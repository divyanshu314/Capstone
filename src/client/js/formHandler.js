function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value
    if (Client.checkForName(formText)) {

        console.log("::: Form Submitted :::")
        // fetch('http://localhost:8081/test')
        // .then(res => res.json())
        // .then(function(res) {
        //     document.getElementById('results').innerHTML = res.message
        // })

        let requestBody = {
            query: formText
        };

        fetch('http://localhost:8081/testing', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(function (res) {
                document.getElementById('polarity').innerHTML = res.polarity;
                document.getElementById('polarity_confidence').innerHTML = res.polarity_confidence;
                document.getElementById('subjectivity').innerHTML = res.subjectivity;
                document.getElementById('subjectivity_confidence').innerHTML = res.subjectivity_confidence;
                document.getElementById('text').innerHTML = res.text;
                console.log(res);
            })
    }
}

export { handleSubmit }
