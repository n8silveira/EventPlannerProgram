const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/submit-form', (req, res) => {
    const data = req.body;
    const path = './events/';
    const idTest = data.eventID;

    const eventFolder = `${path}${idTest}/`; // new folder for event

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    if (!fs.existsSync(eventFolder)) {
        fs.mkdirSync(eventFolder);
    }

    const peopleFolder = `${eventFolder}people/` // new folder for individual people joining event
    if (!fs.existsSync(peopleFolder)) {
        fs.mkdirSync(peopleFolder);
    }

    // name new json file the event name user input
    const fileName = `${eventFolder}${idTest}.json`; // name should be the "eventID".json

    fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ message: 'Error saving data '});
        }
        console.log(`Data saved as ${fileName}`);
        res.status(200).json({
            message: `Data saved as ${fileName}`,
            createdFolders: [eventFolder, peopleFolder]
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});