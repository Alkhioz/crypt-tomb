(
    async () => {
        const main = document.querySelector('#app-main');
        const appPage = document.createElement('crypt-tomb-app-page');
        main.appendChild(appPage);
        // const passwordGenerator = document.createElement('crypt-tomb-password-generator');
        // passwordGenerator.addEventListener('ramdomPasswordGenerated', (evt)=>console.log(evt.detail.value));
        // main.appendChild(passwordGenerator);
    }
)();