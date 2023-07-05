import React, {FC} from 'react';
import {match} from 'react-router-dom';
import {RepoData} from '../interfaces';
import '../styles/repository-screen.css';
import Axios from 'axios';
import {RepositoryProps} from '../App';

export interface RepositoryScreenProps {
   match: match<RepositoryProps>;
   location: any;
}

export interface RepositoryScreenState {
   repository?: RepoData;
   repositoryCommits?: any[];
}

class RepositoryScreen extends React.Component<RepositoryScreenProps, RepositoryScreenState> {
   state: RepositoryScreenState = {};

   componentDidMount() {
      Axios.get(this.props.location.state)
         .then((res) => {
            const repository: RepoData = res.data;
            let commitsUrl = repository.commits_url.split('commits');
            commitsUrl.pop();
            return Promise.all([repository, Axios.get(commitsUrl.join('') + 'commits')]);
         })
         .then(([repository, repos]) => {
            this.setState({repository, repositoryCommits: repos.data});
         })
         .catch(console.log);
   }

   render() {
      const {repository, repositoryCommits} = this.state;
      if (!repository) return <h1 className="not-found"> Repository not found..</h1>;

      let commits = repositoryCommits
         ? repositoryCommits.map((commit) => (
              <CommitComponent key={commit.sha} commit={commit.commit}></CommitComponent>
           ))
         : [];

      return (
         <div className="repository-box">
            <div className="userbox">
               <h1>
                  <a target="blank" href={repository.owner.html_url}>
                     <i className="demo-icon icon-user"></i>
                     {repository.owner.login}
                  </a>
                  <a target="blank" href={repository.html_url}>
                     <i className="demo-icon icon-bookmark"></i>
                     {repository.name}
                  </a>
               </h1>
               <p className="repository-description">
                  <span className="title">
                     about
                     <i className="demo-icon icon-search"></i>
                  </span>
                  {repository.description}
               </p>
            </div>
            <div className="commits">
               <p className="title">
                  commits<i className="demo-icon icon-flow-branch"></i>{' '}
               </p>
               {commits}
            </div>
         </div>
      );
   }
}

interface Commit {
   message: string;
   committer: {
      name: string;
      email: string;
      date: string;
   };
}

export const CommitComponent: FC<{commit: Commit}> = ({commit}) => {
   let date = new Date(commit.committer.date).toLocaleDateString();
   return (
      <div className="commit">
         <h1 className="committer-name">
            <span className="label">Commiter:</span> {commit.committer.name}
         </h1>
         <p className="committer-email">
            <span className="label">email:</span> {commit.committer.email}
         </p>
         <p className="commit-message">
            <span className="label">message:</span> {commit.message}
         </p>
         <p className="commit-date">
            <span className="label">date:</span> {date}
         </p>
      </div>
   );
};

export default RepositoryScreen;
