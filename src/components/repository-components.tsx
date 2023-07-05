import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {RepoData} from '../interfaces';
import '../styles/search-screen.css';
import '../styles/repository-components.css';

export const getReposKey = () => {
    let user = localStorage.getItem('user');
    return user ? 'favourites-repos-' + JSON.parse(user).uid : "";
}

export const RepositoriesList: FC<{ repos: RepoData[] }> = ({repos}) => {
    if (!repos.length) return <h1 className="not-found">Repositories not found..</h1>;

    let favourites = localStorage.getItem(getReposKey()) || '[]';
    let favouritesArray: RepoData[] = JSON.parse(favourites);

    let reposList: JSX.Element[] = repos.map((repo) => <Repository key={repo.full_name}
                                                                   isFavourite={!!favouritesArray.find(f => f.id === repo.id)}
                                                                   repo={repo}></Repository>);
    return <div className="repoistory-list">{reposList}</div>;
};

export const Repository: FC<{ repo: RepoData, isFavourite: boolean }> = ({repo, isFavourite}) => {
    let [favourite, setFavourites] = React.useState<boolean>();
    React.useEffect(() => setFavourites(isFavourite), [isFavourite]);

    React.useEffect(() => {
        let favourites = localStorage.getItem(getReposKey()) || '[]';
        let favouritesArray: RepoData[] = JSON.parse(favourites);
        if (!favourite) {
            favouritesArray = favouritesArray.filter((item: RepoData) => item.id !== repo.id);
        } else if (!favouritesArray.find(f => f.id === repo.id)) {
            favouritesArray.push(repo);
        }
        localStorage.setItem(getReposKey(), JSON.stringify(favouritesArray));
    }, [favourite]);


    let date = new Date(repo.created_at);
    return (
        <>
            <div className="repository">
                <h1 className="repository-title">
                    <i className="demo-icon icon-user"></i>
                    <Link
                        to={{
                            pathname: '/user/' + repo.owner.login,
                            state: repo.owner.url
                        }}
                    >
                        {repo.owner.login}
                    </Link>
                    <i className="demo-icon icon-bookmark"></i>
                    <Link
                        to={{
                            pathname: '/repository/' + repo.name,
                            state: repo.url
                        }}
                    >
                        <span className="repo-name">{repo.name}</span>
                    </Link>

                    <span className="stars">
                  <i className="demo-icon icon-star"></i>
                        {repo.stargazers_count}
               </span>
                    <span className="favourite ml-2" onClick={() => {
                        setFavourites(!favourite);
                    }}>
                        {
                            favourite ? <i className="demo-icon icon-heart"></i> :
                                <i className="demo-icon icon-heart-empty"></i>
                        }
               </span>
                </h1>
                <p title={repo.description} className="repository-desc">{repo.description}</p>
                <div className="repository-info">
                    {repo.language ? <div className={`badge ${repo.language}`}>{repo.language}</div> : <></>}
                    <div className="repository-date">Created at {date.toLocaleDateString()}</div>
                </div>
            </div>
        </>
    );
};
