import React, { useEffect, useState, FC } from 'react';
import { RepoData, UserData } from '../interfaces';
import './searchScreen.css';
import { ReppositoriesList } from './RepositoryComp';
import { UsersList } from './usersComponent';


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
