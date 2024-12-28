const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100);
})

window.onload = () => {
    if (sessionStorage.name) {
        location.href = '/';
    }
}

// form validation
const name = document.querySelector('.name') || null;
const password = document.querySelector('.password')
const submitBtn = document.querySelector('.submit-btn')

if (name == null) { // login page is open
    submitBtn.addEventListener('click', () => {
        fetch('/login', { // FETCH: submit form
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                password: password.value
            })
        })
        .then(res => res.json())
        // send data to server
        .then(data => {
            if (data.name) {
                alert('login successful!');
            } else {
                alert(data);
            }
        })
    })
} else {
    submitBtn.addEventListener('click', () => {
        fetch('/login', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                name: name.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data)
        })
    })
}

const validateData = (data) => {
    if (!data.name) {
        alertBox(data);
    } else {
        sessionStorage.name = data.name;
        location.href = '/'
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.computedStyleMap.top = '5%';
    setTimeout(() => {
        alertContainer.computedStyleMap.top = null;
    }, 5000);

}