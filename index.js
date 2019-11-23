const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const readline = require('readline');
const childProcess = require('child_process');
const https = require('https');
const app = express();

//can import also like this
require('dotenv').config();

console.log("ENV VARIABLE",
    process.env.MY_VARIABLE
);
console.log("ENV URL",
    process.env.URL
);
if(process.argv.includes('--prompt')) {
    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.question("Please specify port: ", (answer) => {
       if(isNaN(answer)) {
           console.warn('Invalid port specified, using default instead.');
           runServer(3000);
       } else {
           runServer(answer);
       }
    });
} else {
    runServer(3000)
}
app.use(cors());

const jsonParser = bodyParser.json();
const users = [];
const messages =[{
    body: 'test message',
    sentBy: 'test user'
}];

app.post('/login', jsonParser,(req,res) =>{
    const user = {
        login: req.body.login
    };
    users.push(user);
    console.log("user ${user.login} joined");
    return res.json(user);
});

app.post('/sendMessage', jsonParser,(req,res) =>{
    const message = {
        body : req.body.message,
        sentBy: req.body.login
    };
    messages.push(message);
    if (message.body === '/joke') {
        getJoke((err, joke) => {
            if(err) {
                console.error('Failed to fetch joke');
                res.json({ sentBy: 'Joke Bot', body: 'Failed :('})
            } else {
                const jokeMessage = {
                    body: joke,
                    sentBy: 'Joke Bot'
                };
                messages.push(jokeMessage);
                res.json(jokeMessage);
            }
        })
    } else {
        return res.json(message);
    }
});

app.get('/messages',(req,res) => {
    return res.json(messages);
});

app.get('/',(req,res) => res.send("nowy tekst 2"));

app.get('/whoami', (req,res) => {
    childProcess.exec('whoami',(err, response)=> {
        if(err) {
            console.log('whoami failed');
            res.send(err.message)
        } else {
            res.send(response.trim())
        }
    });
});

function getJoke(callback) {
    https.get({
        hostname: process.env.URL,
        headers: {Accept: 'text/plain'}
    }, (res) => {
        if(res.statusCode !== 200) {
            callback('no joke, sorry');
        } else {
            let joke = '';
            res.on('data', (chunk) => {
                joke += chunk;
            });
            res.on('end', () => {
                callback(null, joke);
            })
        }
    });
}



function runServer(port) {
    app.listen(port,()=> console.log(`Example app listening on port ${port}!`));
}