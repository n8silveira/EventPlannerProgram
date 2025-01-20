function create_random_url(string_length) {
    var random_string = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSSTUVWXYZabcdefghijklmnopqrstuvwxyz00112233445566778899';
    for (var i = 0; i < string_length; i++) {
        random_string += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return random_string;
}

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/submit-form', (req, res) => {
    const data = req.body;
    const idTest = create_random_url(13);
    data.eventID = idTest;

    const path = './events/';
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
            eventID: idTest,
            createdFolders: [eventFolder, peopleFolder]
        });
    });
});

app.post('/login', (req, res) => {
    console.log(req.body);
    const {username, password, eventID} = req.body;

    if (!username || !password || !eventID) {
        return res.status(400).json({message: 'Fill in required fields.'});
    }
    const peopleFolder = `./events/${eventID}/people/`;

    if (!fs.existsSync(peopleFolder)) {
        return res.status(404).json({message: `Event with ID ${eventID} wasn't found...`});
    }
    const userFile = `${peopleFolder}${username}.json`;
    // check if userFile exists
    if (fs.existsSync(userFile)) {
        // read user file
        fs.readFile(userFile, '', (err, data) => {
            if (err) {
                console.error('Error reading user file:', err);
                return res.status(500).json({message: 'Error reading user data...'});
            }
            const userData = JSON.parse(data);

            // check if password matches
            if (userData.password != password) {
                // if pass doesn't match
                return res.status(300).json({message: `Incorrect password. Try again`});
            }
        });
    } else {
        // new user, save data
        const userData = {username, password};
        
        fs.writeFile(userFile, JSON.stringify(userData, null, 2), (err) => {
            if (err) {
                console.error('Error saving user file:', err);
                return res.status(500).json({ message: 'Error saving user data.' });
            }
            console.log(`User data saved for ${username} in ${userFile}`);
            res.status(200).json({message: `User ${username} successfully logged in.`});
        });
    }
});  
    
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    // res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/event', (req, res) => {
    res.sendFile(path.join(__dirname, 'event.html'));
    // res.sendFile(path.join(__dirname, 'event.js'));
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});