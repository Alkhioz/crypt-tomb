(
    async () => {
        const dynamicImport = (route) => 
            import(route).then( module =>
                module.default
            ).catch( error => 
                error
            );
        const Route = await dynamicImport('./modules/routing/route.js');
        const RouteManager = await dynamicImport('./modules/routing/main.js');
        const {
            generateAccessKey,
            readAccessKey,
            encryptData,
            decryptData,
            canEncryptData,
        } = await dynamicImport('./modules/crypt/main.js');
        const route = new Route({
            url: "/",
            redirects: "/app",
        });
        const mainRoute = new Route({
            url: "/app",
            render: ()=>console.log('main_component'),
        });
        const aboutRoute = new Route({
            url: "/about",
            render: ()=>console.log('about_component'),
        });
        const otherRoute = new Route({
            url: "/other",
            render: ()=>console.log('other_component'),
            precondition: {
                status: false,
                callback: ()=> Router.goTo('/app'),
            }
        });
        const Router = new RouteManager({
            routes: [
                route,
                mainRoute,
                aboutRoute,
                otherRoute,
            ],
        });
        Router.goTo('/about');

        const canSaveToIndexDB = () => {
            return !!window?.indexedDB;
        }

        const startTimer = (durationInSeconds, callback) => {
            let remainingTime = durationInSeconds;

            const interval = setInterval(() => {
                remainingTime--;

                console.log(`Remaining time: ${remainingTime} seconds`);

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    callback();
                }

            }, 1000);
        }

        const access_key = generateAccessKey();
        const {
            master_key,
            database_name,
            store_name,
        } = readAccessKey(access_key);
        startTimer(300, ()=>{
            console.log("Closing store...");
        });
        const name = "PassTest";
        const description = "Contraseña de prueba.";
        const password = "ramdom_password123.TEST";
        const {
            encrypted: encrypted_name,
            initialization_vector: initialization_vector_name
        } = await encryptData(name, master_key);
        const {
            encrypted: encrypted_description,
            initialization_vector: initialization_vector_description
        } = await encryptData(description, master_key);
        const {
            encrypted: encrypted_password,
            initialization_vector
        } = await encryptData(password, master_key);
        const decrypted_name = await decryptData(encrypted_name, master_key, initialization_vector_name);
        const decrypted_description = await decryptData(encrypted_description, master_key, initialization_vector_description);
        const decrypted_password = await decryptData(encrypted_password, master_key, initialization_vector);
        console.log([
            access_key,
            database_name,
            store_name,
            master_key,
            {
                name,
                description,
                password,
            },
            {
                encrypted_name,
                encrypted_description,
                encrypted_password,
            },
            {
                decrypted_name,
                decrypted_description,
                decrypted_password,
            },
            {
                initialization_vector,
                initialization_vector_name,
                initialization_vector_description,
            },
        ]);
    }
)();