export default class Route 
{
    #url;
    #render;
    #precondition;
    #redirects_to;
    constructor(params)
    {
        this.#url = params?.url;
        this.#render = params?.render;
        this.#precondition = params?.precondition;
        this.#redirects_to = params?.redirects;
    }
    getUrl()
    {
        return this.#url;
    }
    getRedirection()
    {
        return this.#redirects_to;
    }
    render()
    {
        if(this.#render) this.#render();
    }
    getPrecondition()
    {
        return this.#precondition;
    }
}