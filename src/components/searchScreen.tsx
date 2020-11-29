import React, { useEffect, useState, FC } from 'react';
import './searchScreen.css';

export interface SearchScreenProps { }

export interface SearchScreenState { }

class SearchScreen extends React.Component<SearchScreenProps, SearchScreenState> {
    state: { repos: RepoData[] } = {
        repos: []
    }

    handleSearch = (queryString: String) => {
        queryString = queryString.split(' ').join('+')
        fetch('https://api.github.com/search/repositories?q=' + queryString)
            .then(res => res.json())
            .then(repos => {
                this.setState({ repos: repos.items })
            })
    }

    handlechangeResultType(mode: Number) {
        console.log(mode)
    }

    render() {
        console.log(this.state.repos)
        return (<>
            <SearchBar handleSearch={this.handleSearch}></SearchBar>

            <div className="resultBox">
                <ResultTypesList handlechangeResultType={this.handlechangeResultType}></ResultTypesList>
            </div>
            <ReppositoriesList repos={this.state.repos}></ReppositoriesList>
        </>);
    }


}

interface RepoData {
    name: string,
    full_name: string,
    created_at: string,
    owner: User,
    url: string,
    language: string,
    commits_url: string,

}

interface User {
    login: string,
    avatar_url: string,
    repos_url: string,
    url: string,
}

const ReppositoriesList: FC<{ repos: RepoData[] }> = ({ repos }) => {
    let reposList: JSX.Element[] = repos.map(repo => <Repository key={repo.full_name} repo={repo}></Repository>)
    return (<>
        {reposList}
    </>)
}


const Repository: FC<{ repo: RepoData }> = ({ repo }) => {
    return (<>
        <h1>{repo.full_name}</h1>
    </>)
}

interface SearchBarProps { handleSearch: any }
function SearchBar(props: SearchBarProps) {
    const [queryString, setSearchValue] = useState('')

    return (<>
        <div className="searchbar">
            <input type="text" onChange={(e) => setSearchValue(e.target.value)} className="searchbarInput" placeholder="Search gitHub uers or repositories" />
            <button type="button" onClick={() => props.handleSearch(queryString)} className="btn btn-primary searchbarBtn">Search</button>
        </div>
    </>);
}


interface resultTypeProps { handlechangeResultType: any }
function ResultTypesList(props: resultTypeProps) {
    const [selectedResultType, setselectedResultType] = useState(0)

    useEffect(() => {
        props.handlechangeResultType(selectedResultType)
    }, [selectedResultType]);

    return (<>
        <ul className="list-group resultlist">
            <li className={`
                list-group-item
                ${selectedResultType === 0 ? 'active' : ''}
            `} onClick={() => setselectedResultType(0)}>Repositories</li>
            <li className={`
                list-group-item
                ${selectedResultType === 1 ? 'active' : ''}
            `} onClick={() => setselectedResultType(1)}>Users</li>
        </ul>
    </>)
}


export default SearchScreen;
