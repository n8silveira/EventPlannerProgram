// previously app.js
function create_random_url(string_length) {
    var random_string = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSSTUVWXYZabcdefghijklmnopqrstuvwxyz00112233445566778899';
    for (var i = 0; i < string_length; i++) {
        random_string += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return random_string;
}

const { log } = require('console');
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
    const eventFolder = `./events/${eventID}`; // > events > EMZADIYxV242q
    const peopleFolder = `${eventFolder}/people/`; // > EMZADIYxV242q > people
    const plannerFile = `${peopleFolder}${username}.json`; // > people > darren.json

    // check if /eventFolder & /people don't exist
    if (!fs.existsSync(eventFolder)) {
        fs.mkdirSync(eventFolder, { recursive: true });
    }
    if (!fs.existsSync(peopleFolder)) {
        fs.mkdirSync(peopleFolder);
    }

    // make sure a planner doesn't already exist
    const plannerExists = fs.readdirSync(peopleFolder).some(file => {
        const data = JSON.parse(fs.readFileSync(`${peopleFolder}/${file}`, 'utf8'));
        return data.role === 'planner';
    });

    // check if planner exists
    if (!plannerExists) {
        // first login: set user as event planner
        const plannerData = { username, password, role: 'planner', schedule: [] };
        fs.writeFileSync(plannerFile, JSON.stringify(plannerData, null, 2));
        return res.status(200).json({ message: `Welcome, ${username}! You are now the event planner.`, isPlanner: true });
    }

    // check if user is the event planner
    const existingPlannerFile = fs.readdirSync(peopleFolder).find(file => {
        const data = JSON.parse(fs.readFileSync(`${peopleFolder}/${file}`, 'utf8'));
        return data.role === 'planner';
    });
    // gather user data
    const existingPlannerData = JSON.parse(fs.readFileSync(`${peopleFolder}/${existingPlannerFile}`, 'utf8'));
    // check if (pu == u)
    if (existingPlannerData.username === username) {
        // check (pp == p)
        if (existingPlannerData.password === password) {
            // they are the planner
            return res.status(200).json({ message: `Welcome back, ${username}! You are the event planner.`, isPlanner: true });
        } else {
            // they are NOT the planner
            return res.status(401).json({ message: 'Incorrect password for event planner.' });
        }
    }
    const userFile = `${peopleFolder}${username}.json`;
    // check if userFile exists
    if (fs.existsSync(userFile)) {
        const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
        if (userData.password !== password) {
            return res.status(401).json({ message: 'Incorrect password. Try again.' });
        }
        return res.status(200).json({ message: `Welcome back, ${username}!`, isPlanner: false });
    } else {
        // normal login logic
        const userData = { username, password, role: 'user' };
        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
        return res.status(200).json({ message: `Welcome, ${username}! Your account has been created.`, isPlanner: false });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    // res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// give the user eventID.json (from req.body)
app.post('/event', (req, res) => {
    const data = req.body;
    const eventID = data.eventID;
    res.sendFile(path.join(__dirname, 'events', eventID, `${eventID}.json`));
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});