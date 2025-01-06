document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login').addEventListener('click', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            const errorMessage = document.getElementsById('error-message');
            errorMessage.style.display = 'block';
            return;
        }
        document.getElementById('error-message').style.display = 'none';
    });
});