import React, { useState } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import './App.css';
import SearchScreen from './components/searchScreen';
import UserScreen from './components/userScreen';
import RepositoryScreen from './components/repositoryScreen';

export interface UserProps { login: string };
export interface RepoitoryProps { id: string };

function App() {
  document.title = 'Git explorer'
  let [qstring, changeqstring] = useState('')

  return (<>
    <nav className="navbar  ">
      <Link className="navbar-brand" to="/search#">
      <i className="demo-icon icon-github-circled"></i>
        Serch github repositories and users
        </Link>
    </nav>
    <Route exact path="/">
      <Redirect to="/search" />
    </Route>

    <Route path='/search' >
      <SearchScreen qstring={qstring} changeqstring={changeqstring}></SearchScreen>
    </Route >

    <Route path='/user/:login' component={UserScreen}></Route >
    <Route path='/repository/:id' component={RepositoryScreen}></Route >

  </>);
}

export default App;
