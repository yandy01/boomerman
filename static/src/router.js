export function RouteManager(routes) {
    for (const route of routes) {
        window.addEventListener('popstate', event => {
            const currentURL = window.location.hash;
            if (currentURL === route.path) {
                route.handler(event);
            }
        });
    }

    function navigateTo(url) {
        window.location.hash = url;
        const route = routes.find(route => route.path === url);
        if (route) {
            route.handler();
        }
    }
    return { navigateTo };
}
