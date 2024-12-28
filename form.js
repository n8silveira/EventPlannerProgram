const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/submit-form', (req, res) => {
    const data = req.body;
    const path = './events/';

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    // name new json file the event name user input
    const fileName = `${path}/${Date.now}.json`; // name should be the eventID.json

    fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ message: 'Error saving data '});
        }
        console.log(`Data saved as ${fileName}`);
        res.status(200).json({ message: `Data saved as ${fileName}` });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => {
    console.log('Server running on https://localhost:8080');
})


// const form = [...document.querySelector('.form').children];

// form.forEach((item, i) => {
//     // modify when i click "create event", it saves a file called "name_of_event".json
//     setTimeout(() => {
//         item.style.opacity = 1;
//     }, i*100);
// })
// window.onload = () => {
//     if (sessionStorage.name) {
//         location.href = '/';
//     }
// }

// // form validation
// const name = document.querySelector('.name') || null;
// const password = document.querySelector('.password')
// const submitBtn = document.querySelector('.submit-btn')

// if (name == null) { // login page is open
//     submitBtn.addEventListener('click', () => {
//         fetch('/event', { // FETCH: submit form
//             method: 'post',
//             headers: new Headers({'Content-Type': 'application/json'}),
//             body: JSON.stringify({
//                 password: password.value
//             })
//         })
//         .then(res => res.json())
//         // send data to server
//         .then(data => {
//             if (data.name) {
//                 alert('event successful!');
//             } else {
//                 alert(data);
//             }
//         })
//     })
// } else {
//     submitBtn.addEventListener('click', () => {
//         fetch('/login', {
//             method: 'post',
//             headers: new Headers({'Content-Type': 'application/json'}),
//             body: JSON.stringify({
//                 name: name.value,
//                 password: password.value
//             })
//         })
//         .then(res => res.json())
//         .then(data => {
//             validateData(data)
//         })
//     })
// }

// const validateData = (data) => {
//     if (!data.name) {
//         alertBox(data);
//     } else {
//         sessionStorage.name = data.name;
//         location.href = '/'
//     }
// }

// const alertBox = (data) => {
//     const alertContainer = document.querySelector('.alert-box');
//     const alertMsg = document.querySelector('.alert');
//     alertMsg.innerHTML = data;

//     alertContainer.computedStyleMap.top = '5%';
//     setTimeout(() => {
//         alertContainer.computedStyleMap.top = null;
//     }, 5000);

// }