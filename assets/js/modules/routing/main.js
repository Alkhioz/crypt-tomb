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
            let hash = window.location.hash;
            if(!hash){
                hash = `${this.#hash_navigator}/`;
            }
            if(hash !== this.#current_route) this.goTo(hash?.substring(1));
        });
    }
    getCurrentRoute()
    {
        return this.#current_route?.substring(1);
    }
    goTo(url)
    {
        
        if(url === this.getCurrentRoute()) return false;
        this.#current_route = `${this.#hash_navigator}${url}`;
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
            if(redirection){
                this.goTo(redirection);
            }else{
                selectedRoute.render();
                window.history.pushState({}, "", `${this.#hash_navigator}${selectedRoute.getUrl()}`);
            }
        } else {
            precondition?.callback();
        }
    }

}