import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import SearchScreen from './components/searchScreen';
import UserScreen from './components/userScreen';
import RepositoryScreen from './components/repositoryScreen';

export interface UserProps { login: string };
export interface RepoitoryProps { id: string };

function App() {
  return (<>
    <Route exact path="/">
      <Redirect to="/search" />
    </Route>

    <Route path='/search' >
      <SearchScreen></SearchScreen>
    </Route >

    <Route path='/user/:login' component={UserScreen}></Route >
    <Route path='/repository/:id' component={RepositoryScreen}></Route >

  </>);
}

export default App;
