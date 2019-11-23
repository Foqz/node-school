const fs = require('fs');

fs.readFile("abc", (err, data) => {
    if(err) {
        console.error("cos poszlo nie tak");
        process.exit(1);
    }
    console.log(data.toString())
});