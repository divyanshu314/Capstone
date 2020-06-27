function checkForName(inputText) {
    console.log("::: Running checkForName :::", inputText);
    const regexExp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    
    if (regexExp.test(inputText)) {
        return true;
    } else {
        alert("Please enter a valid url");
        return false;
    }
}

export { checkForName }
