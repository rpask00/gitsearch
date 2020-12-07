import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { RepoData } from '../interfaces';
import '../styles/searchScreen.css';
import '../styles/repositoryComponents.css'


export const ReppositoriesList: FC<{ repos: RepoData[] }> = ({ repos }) => {
    if (!repos.length)
        return <h1 className='not-found'>Repositories not found..</h1>

    let reposList: JSX.Element[] = repos.map(repo => <Repository key={repo.full_name} repo={repo}></Repository>)
    return <div className='repoistory-list'>{reposList}</div>
}


export const Repository: FC<{ repo: RepoData }> = ({ repo }) => {
    let date = new Date(repo.created_at)
    return (<>
        <div className="repository">
            <h1 className='repository-title'>
                <i className="demo-icon icon-user"></i>
                <Link
                    to={{
                        pathname: '/user/' + repo.owner.login,
                        state: repo.owner.url
                    }}>
                    {repo.owner.login}
                </Link>
                <i className="demo-icon icon-bookmark"></i>
                <Link
                    to={{
                        pathname: '/repository/' + repo.name,
                        state: repo.url
                    }}>
                    <span className='repo-name'>{repo.name}</span>
                </Link>

                <span className="stars">
                    <i className="demo-icon icon-star"></i>
                    {repo.stargazers_count}
                </span>
            </h1>
            <p className='repository-desc'>{repo.description}</p>
            <div className="repository-info">
                { repo.language  ? <div className={`badge ${repo.language}`}>{repo.language}</div> : <></>}
                <div className='repository-date'>Created at {date.toLocaleDateString()}</div>
            </div>
        </div>
    </>)
}