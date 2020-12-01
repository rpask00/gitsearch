import React, { FC } from 'react';
import { match } from 'react-router-dom';
import { RepoData, UserData } from '../interfaces';
import './repositoryScreen.css'
import Axios from 'axios';
import { RepoitoryProps } from '../App';

export interface RepositoryScreenProps {
    match: match<RepoitoryProps>
}

export interface RepositoryScreenState {
    repository?: RepoData,
    repositoryCommits?: any[],
}

class RepositoryScreen extends React.Component<RepositoryScreenProps, RepositoryScreenState> {
    state: RepositoryScreenState = {}

    componentDidMount() {
        Axios.get('https://api.github.com/search/repositories?q=' + this.props.match.params.id)
            .then(res => {
                const repository: RepoData = res.data.items[0]
                let commitsurl = repository.commits_url.split('commits')
                commitsurl.pop()
                return Promise.all([repository, Axios.get(commitsurl.join('') + 'commits')])
            })
            .then(([repository, repos]) => {
                this.setState({ repository, repositoryCommits: repos.data })
            })
            .catch(console.log)
    }

    render() {
        const { repository, repositoryCommits } = this.state
        if (!repository) return <h1 className='not-found'> Repository not found..</h1>

        let commits = repositoryCommits ? repositoryCommits.map(commit => <Commit key={commit.sha} commit={commit.commit}></Commit>) : []

        return (
            <div className="box">
                <div className="userbox">
                    {/* <img src={user.avatar_url} alt={user.login} /> */}
                    <h1><a target='blank' href={repository.html_url}>{repository.full_name}</a></h1>
                    <p>{repository.description}</p>
                </div>
                <div className="commits">
                    <h2>Commits:</h2>
                    {commits}
                </div>
            </div>
        );
    }
}


interface Commit {
    message: string,
    committer: {
        name: string,
        email: string,
        date: string,
    }
}

export const Commit: FC<{ commit: Commit }> = ({ commit }) => {
    let date = new Date(commit.committer.date).toLocaleDateString()
    return (<div className='commit'>
        <h1 className='committer-name'>{commit.committer.name}</h1>
        <p className='committer-email'>{commit.committer.email}</p>
        <p className="commit-message">{commit.message}</p>
        <p className="commit-date">{date}</p>
    </div>)
}

export default RepositoryScreen;
