const userData = {
    username: "ekib",
    password: 9042,
    schedule: []
};

fetch('http://localhost:8080/schedule', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
})
.then(async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message);
    }
    console.log(responseData.message);
})
.catch(error => {
    console.error('Error', error);
});