export const loadProtectedRoutes = function (routes) {
    let allowedRoutes = [];
    for(let route of routes){
        if(route.authorize ){
            if(route.authorize() === true){

                allowedRoutes.push(route);
            }
        }else {
            allowedRoutes.push(route);
        }
    }
    return allowedRoutes;
}

export default {};