import { useEffect } from "react";
import { useLocation, matchPath } from "react-router";

function TitleManager() {
    const location = useLocation();
    
    const routes = [
        { path: '/', title: 'Home' },
        { path: '/about', title: 'About' },
        { path: '/algorithms', title: 'Algorithms' },
        { path: '/generate', title: 'Generate' },
        { path: '/play/:mazeData', title: 'Play' }
    ];

    useEffect(() => {
        const currentRoute = routes.find(route => 
            matchPath({ path: route.path, exact: true }, location.pathname)
        );

        if (currentRoute) {
            document.title = `Maze | ${currentRoute.title}`;
        } else {
            document.title = "Maze | Page not Found";
        }
    }, [location.pathname]);

    return null;
}

export default TitleManager;