import * as React from 'react';
import {match} from 'react-router-dom';
import {UserProps} from '../App';
import {RepoData, UserData} from '../interfaces';
import '../styles/user-screen.css';
import Axios from 'axios';
import {RepositoriesList} from "./repository-components";

export interface UserScreenProps {
   match: match<UserProps>;
   location: any;
}

export interface UserScreenState {
   user?: UserData;
   userRepos?: RepoData[];
}

class UserScreen extends React.Component<UserScreenProps, UserScreenState> {
   state: UserScreenState = {};

   componentDidMount() {
      Axios.get(this.props.location.state)
         .then((res) => {
            const user: UserData = res.data;
            return Promise.all([user, Axios.get(user.repos_url)]);
         })
         .then(([user, repos]) => {
            this.setState({user, userRepos: repos.data});
         })
         .catch(console.log);
   }

   render() {
      const {user, userRepos} = this.state;
      if (!user) return <h1 className="not-found">User not found..</h1>;

      let repos = userRepos ? <RepositoriesList repos={userRepos}></RepositoriesList> : [];

      return (
         <div className="user-box">
            <div className="userbox">
               <img src={user.avatar_url} alt={user.login} />
               <h1>
                  <a target="blank" href={user.html_url}>
                     {user.login}
                  </a>
               </h1>
            </div>
            <div className="repos">
               <h2>User repositories:</h2>
               {repos}
            </div>
         </div>
      );
   }
}

export default UserScreen;
