import React, { useEffect, useState, FC } from 'react';
import './searchScreen.css';

export interface SearchScreenProps { }

export interface SearchScreenState {
    fetchData: RepoData[] | UserData[],
    mode: string,
    queryString: string,
}

class SearchScreen extends React.Component<SearchScreenProps, SearchScreenState> {
    state: SearchScreenState = {
        mode: 'repositories',
        fetchData: [],
        queryString: ''
    }

    handleSearch = async (queryString: string, mode?: string) => {
        queryString = queryString.split(' ').join('+')
        mode = (mode || this.state.mode)

        let fetchData = await (await fetch('https://api.github.com/search/' + mode + '?q=' + queryString)).json()

        this.setState({
            queryString,
            mode,
            fetchData: fetchData.items ? fetchData.items : []
        })
    }

    changeSearchMode = (mode: string) => {
        const { queryString } = this.state
        if (queryString) this.handleSearch(queryString, mode)
        else this.setState({ mode: mode })
    }

    render() {
        return (<>
            <div className='search-area'>
                <SearchBar handleSearch={this.handleSearch}></SearchBar>
            </div>
            <div className='result-area'>
                <SearchModesList changeSearchMode={this.changeSearchMode}></SearchModesList>
                {
                    this.state.mode === 'users' ?
                        <UsersList users={this.state.fetchData as UserData[]}></UsersList> :
                        <ReppositoriesList repos={this.state.fetchData as RepoData[]}></ReppositoriesList>
                }
            </div>
        </>);
    }
}

interface RepoData {
    name: string,
    full_name: string,
    created_at: string,
    owner: UserData,
    url: string,
    language: string,
    commits_url: string,
    description: string,


}

interface UserData {
    login: string,
    avatar_url: string,
    repos_url: string,
    url: string,
}

const UsersList: FC<{ users: UserData[] }> = ({ users }) => {
    let userslist: JSX.Element[] = users.map(user => <User key={user.url} user={user}></User>)
    return <div className='usersList'>{userslist}</div>
}


const User: FC<{ user: UserData }> = ({ user }) => {
    // let date = new Date(user.created_at)
    return (<>
        <div className="user">
            <img className='user-image' src={user.avatar_url} alt={user.login} />
            <h1 className='user-login'>
                <a href="">{user.login}</a>
            </h1>
        </div>
    </>)
}


const ReppositoriesList: FC<{ repos: RepoData[] }> = ({ repos }) => {
    let reposList: JSX.Element[] = repos.map(repo => <Repository key={repo.full_name} repo={repo}></Repository>)
    return <div className='repoistoryList'>{reposList}</div>
}


const Repository: FC<{ repo: RepoData }> = ({ repo }) => {
    let date = new Date(repo.created_at)
    return (<>
        <div className="repository">
            <h1 className='repository-title'>
                <a href="">{repo.owner.login}</a>/
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

interface SearchBarProps { handleSearch: any }
function SearchBar(props: SearchBarProps) {
    const [queryString, setSearchValue] = useState('')

    return (<>
        <div className="searchbar">
            <h1 className='searchbar-title'>Search gitHub uers and repositories</h1>
            <input type="text" onChange={(e) => setSearchValue(e.target.value)} className="searchbarInput" />
            <button type="button" onClick={() => props.handleSearch(queryString)} className="btn btn-primary searchbarBtn">Search</button>
        </div>
    </>);
}


interface SearchModeProps { changeSearchMode: any }
function SearchModesList(props: SearchModeProps) {
    const [selectedSearchMode, setselectedSearchMode] = useState('repositories')

    useEffect(() => {
        props.changeSearchMode(selectedSearchMode)
    }, [selectedSearchMode]);

    return (<>
        <ul className="list-group list-group-horizontal resultlist">
            <li className={`
                list-group-item
                ${selectedSearchMode === 'repositories' ? 'active' : ''}
            `} onClick={() => setselectedSearchMode('repositories')}>Repositories</li>
            <li className={`
                list-group-item
                ${selectedSearchMode === 'users' ? 'active' : ''}
            `} onClick={() => setselectedSearchMode('users')}>Users</li>
        </ul>
    </>)
}


export default SearchScreen;
