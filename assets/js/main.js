import Router from './modules/routing/main.js';
import Route from './modules/routing/route.js';

(
    async () => {
        function changePage(newPage){
            const main = document.querySelector('#app-main');
            main.innerHTML = '';
            main.appendChild(newPage);
        }
        const emptyRoute = new Route({
            url: "/",
            redirects: "/app",
        });
        const appRoute = new Route({
            url: "/app",
            render: ()=>{
                const appPage = document.createElement('crypt-tomb-app-page');
                changePage(appPage);
            },
        });
        const generatePasswordRoute = new Route({
            url: "/generate-password",
            render: ()=>{
                const passwordPage = document.createElement('crypt-tomb-generate-password-page');
                changePage(passwordPage);
            },
        });
        const router = new Router({
            routes: [
                emptyRoute,
                appRoute,
                generatePasswordRoute,
            ],
        });
        window.customRouter = router;
    }
)();