import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import PageLoginContainer from './components/login/PageLoginContainer';
import PageRegisterContainer from './components/login/PageRegisterContainer';
import PageHomeContainer from './components/PageHomeContainer';
import Navigation from './components/common/Navigation';
import PageAdminHome from './components/admin/PageAdminHome';
import PageJudgingHome from './components/judging/PageJudgingHome';
import PageProjects from './components/expo/PageProjects';
import LogoutContainer from './components/login/LogoutContainer';
import PageProfile from './components/common/PageProfile';
import User, { UserRole, roleStringToEnum } from './types/User';
import Footer from './components/common/Footer';
import axios from 'axios';
import { Loader, Dimmer } from 'semantic-ui-react';

interface AppProps {
    account: User;
    loginUser: (user: User) => void;
}

const App: React.FC<AppProps> = (props) => {
    const [dataFetched, changeDataFetched] = React.useState(false);

    const loginUser = props.loginUser;

    React.useEffect(() => {
        const checkUserData = async () => {
            const result = await axios.get('/auth/user_data');

            loginUser({
                id: result.data.id,
                name: result.data.name,
                email: result.data.email,
                role: roleStringToEnum(result.data.role),
                tags: result.data.tags,
            });

            changeDataFetched(true);
        }

        checkUserData();
    }, [loginUser]);

    return (
        <div style={{
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Router>
                {dataFetched
                ? <>
                    <Navigation account={props.account} />
                    <div style={{
                        padding: '0 20px'
                    }}>
                        <Switch>
                            <Route path='/login' component={PageLoginContainer} />
                            <Route path='/logout' component={LogoutContainer} />
                            <Route path='/profile' component={PageProfile} />
                            <Route path='/register' component={PageRegisterContainer} />
                            <AuthRoute path='/admin' component={PageAdminHome} roleNeeded={UserRole.Admin} currentRole={props.account.role} />
                            <AuthRoute path='/judging' component={PageJudgingHome} roleNeeded={UserRole.Judge} currentRole={props.account.role} />
                            <AuthRoute path='/projects' component={PageProjects} roleNeeded={UserRole.Pending} currentRole={props.account.role} />
                            <Route path='/' exact component={PageHomeContainer} />
                            <Redirect to='/' />
                        </Switch>
                    </div>
                    <Footer />
                </>
            :   <Dimmer active inverted>
                    <Loader size='huge'>Loading...</Loader>
                </Dimmer>}
            </Router>
        </div>
    )
}

const AuthRoute = ({component, roleNeeded, currentRole, ...rest}: any) => {
    const routeComponent = (props: any) => (
        currentRole >= roleNeeded
            ? React.createElement(component, props)
            : <Redirect to={{ pathname: '/login' }} />
    );

    return <Route {...rest} render={routeComponent} />;
};

export default App;
