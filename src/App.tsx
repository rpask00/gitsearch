import React from 'react';
import {Link, Redirect, Route} from 'react-router-dom';
import './App.css';
import SearchScreen from "./components/search-screen";
import UserScreen from "./components/user-screen";
import RepositoryScreen from "./components/repository-screen";
import {signInWithPopup} from "firebase/auth";
import {auth, provider} from './firebase';
import Login from "./components/login-page";
import Button from "@mui/material/Button";
import {FavouriteRepositories} from "./components/favourite-repositories";
import {FavouriteUsers} from "./components/favourite-users";

export interface UserProps {
    login: string;
}

export interface RepositoryProps {
    id: string;
}


class App extends React.Component {
    state = {
        qString: '',
        user: null
    }

    changeQString = (qString: string) => {
        this.setState({qString});
    }


    componentDidMount() {

        const user = localStorage.getItem('user');
        if (user) {
            this.setState({user: JSON.parse(user)});
        }
    }

    handleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem('user', JSON.stringify(result.user));
                this.setState({user: result.user});
            }).catch((error) => {
            alert(error.message);
        });
    }

    handleSignOut = () => {
        localStorage.removeItem('user');
        this.setState({user: null});
    }


    render() {

        return (
            <>
                <nav className="navbar">
                    <Link className="navbar-brand" to="/search#">
                        <i className="demo-icon icon-github-circled"></i>
                        GitHub Users and Repositories Explorer
                    </Link>


                    {
                        this.state.user ?
                            <>
                                <Link className="navbar-brand" to="/favourite-repositories#">Favourite
                                    Repositories</Link>
                                <Link className="navbar-brand" to="/favourite-users#">Favourite Users </Link>
                            </>
                            : null
                    }


                    {
                        this.state.user ?
                            <div className="signOutButton">
                                <Button
                                    style={{backgroundColor: 'rgba(236,243,158,0.59)',}}
                                    variant="contained" className="ml-auto btn btn-outline-danger"
                                    onClick={this.handleSignOut}>Sign Out</Button>
                            </div>
                            : null
                    }
                </nav>
                <>
                    {
                        this.state.user ?
                            <>
                                <Route exact path="/"><Redirect to="/search"/></Route>
                                <Route path="/search">
                                    <SearchScreen qString={this.state.qString}
                                                  changeQString={(qs: string) => this.changeQString(qs)}>
                                    </SearchScreen>
                                </Route>

                                <Route path="/user/:login" component={UserScreen}></Route>
                                <Route path="/repository/:id" component={RepositoryScreen}></Route>
                                <Route path="/favourite-repositories" component={FavouriteRepositories}></Route>
                                <Route path="/favourite-users" component={FavouriteUsers}></Route>
                            </>
                            : <Login signIn={this.handleSignIn}></Login>
                    }
                </>
            </>
        );
    }
}

export default App;
