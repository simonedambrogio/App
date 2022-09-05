const {MongoClient} = require('mongodb');
const path = require('path');
const express = require('express');
const five = require('johnny-five');
const board = new five.Board();

async function SendToMongoDB(data) {
    const uri = process.env.MONGODB_URI;
    
    const client = new MongoClient(uri)

    try {        
        await client.connect();
        await createListing(client, data)
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
}

const port = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(express.static('./public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

var isReward = false;
app.post('/data', async (request, response) => {
    isReward = request.body.isReward;
})


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/html/experiment.html'));
    console.log(isReward)
    toggleLed(isReward);
});

app.get('/finish', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/html/finish.html'));
});

app.post('/experiment-data', function(request, response) {
    exp_data = request.body;
    merged_exp_data = exp_data.reduce((a, e) => 
        // iterate each object entry as [key, value] and use "a" as accumulator
        Object.entries(e).reduce((a, t) => {
            // create an empty array on "a" for each key (if it does not exist yet)
            // then push current value to it
            (a[t[0]] = a[t[0]] || []).push(t[1]);
            return a;
        }, a), {});
    response.end();
    if(port == process.env.PORT){
        SendToMongoDB(merged_exp_data).catch(console.error)
    }
})



app.listen(port, () => {
	console.log(`Server Started at ${port}`)
})

// when the board connects and is ready...
board.on('ready', function() { 
    // we instantiate a led on pin 13
    led = new five.Led(13);
    led.off();
    isReady = true; 
});


async function createListing(client, newListing) {
    const result = await client.db("MonkeyExperiment")
    .collection("First Experiment")
    .insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedCount}`)
}

var isReady = false;
var led;
// Function responsible for turning the LED on and off
function toggleLed (isOn) {
    if (!isReady) { return; }

    if(isOn) {
        led.on()
        setTimeout( () => led.off(), 1000)
    }
    // if (On) {
    //     led.on()
    // } else {
    //     led.off()
    // }
} 