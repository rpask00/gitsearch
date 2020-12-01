import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { RepoData } from '../interfaces';
import './searchScreen.css';


export const ReppositoriesList: FC<{ repos: RepoData[] }> = ({ repos }) => {
    let reposList: JSX.Element[] = repos.map(repo => <Repository key={repo.full_name} repo={repo}></Repository>)
    return <div className='repoistoryList'>{reposList}</div>
}


export const Repository: FC<{ repo: RepoData }> = ({ repo }) => {
    let date = new Date(repo.created_at)
    return (<>
        <div className="repository">
            <h1 className='repository-title'>
                <Link to={'/user/' + repo.owner.login}>{repo.owner.login}</Link>/
                <a href="">{repo.name}</a>
            </h1>
            <p className='repository-desc'>{repo.description}</p>
            <div className="repository-info">
                <div className={`badge ${repo.language}`}>{repo.language}</div>
                <div className='repository-date'>Created at {date.toLocaleDateString()}</div>
            </div>
        </div>
    </>)
}