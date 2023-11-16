export default class Route 
{
    #url;
    #component;
    #precondition;
    #redirects_to;
    constructor(params)
    {
        this.#url = params?.url;
        this.#component = params?.component;
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
    getComponent()
    {
        if(this.#component) this.#component();
    }
    getPrecondition()
    {
        return this.#precondition;
    }
}