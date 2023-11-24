(
    async () => {
        const main = document.querySelector('#app-main');
        const passwordGenerator = document.createElement('crypt-tomb-password-generator');
        passwordGenerator.addEventListener('ramdomPasswordGenerated', (evt)=>console.log(evt.detail.value));
        main.appendChild(passwordGenerator);
    }
)();