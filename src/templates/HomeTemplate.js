import { Route, Switch } from 'react-router-dom';


const Home = () => <h2>Version 1.0</h2>;

const HomeTemplate = () => {
    return (
        <Switch>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
    );
};

export default HomeTemplate;
