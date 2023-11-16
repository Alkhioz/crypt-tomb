export default class Router
{
    #hash_navigator = '#';
    #routes;
    #current_route;
    constructor(params)
    {
        this.#routes = params?.routes?.reduce((acc, crr)=>(
            {
                ...acc,
                [crr.getUrl()]: crr
            }
        ), {});
        let hash = window.location.hash;
        if(!hash){
            hash = `${this.#hash_navigator}/`;
        }
        this.goTo(hash?.substring(1));
        this.#current_route = hash;
        window.addEventListener('hashchange', () => {
            if(window.location.hash !== this.#current_route) this.goTo(window.location.hash?.substring(1));
        });
    }
    getCurrentRoute()
    {
        return this.#current_route?.substring(1);
    }
    goTo(url)
    {
        console.log(url);
        const selectedRoute = this.#routes?.[url];
        if(!selectedRoute)
        {
            console.error("Debe ingresar una ruta valida");
            return false;
        }
        const precondition = selectedRoute.getPrecondition();
        if((precondition?.status ?? true))
        {
            const redirection = selectedRoute.getRedirection();
            console.log("redirection",redirection);
            if(redirection){
                this.goTo(redirection);
            }else{
                selectedRoute.getComponent();
                window.history.pushState({}, "", `${this.#hash_navigator}${selectedRoute.getUrl()}`);
            }
        } else {
            precondition?.callback();
        }
    }

}