import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import SearchScreen from './components/searchScreen';
import UserScreen from './components/userScreen';

export interface UserProps { login: string };

function App() {
  return (<>
    <Route exact path="/">
      <Redirect to="/search" />
    </Route>

    <Route path='/search' >
      <SearchScreen></SearchScreen>
    </Route >

    <Route path='/user/:login' component={UserScreen}></Route >

  </>);
}

export default App;
