import React, { useEffect, useState, FC, ReducerStateWithoutAction } from 'react';
import { RepoData, UserData } from '../interfaces';
import { ReppositoriesList } from './RepositoryComp';
import { UsersList } from './usersComponent';
import '../styles/searchScreen.css';
let qstirngSave = ''

export interface SearchScreenProps {
    qstring: string,
    changeqstring: any
}


export interface SearchScreenState {
    fetchData: RepoData[] | UserData[],
    searchMode: string,
    sortMode: string,
    queryString: string,
}

class SearchScreen extends React.Component<SearchScreenProps, SearchScreenState> {
    state: SearchScreenState = {
        sortMode: 'desc',
        searchMode: 'repositories',
        fetchData: [],
        queryString: ''
    }

    componentDidMount() {
        const { qstring } = this.props
        qstirngSave = qstring
        if (qstring) this.handleSearch(qstring)
    }

    handleSearch = async (queryString: string, searchMode?: string, sortMode?: string) => {
        if (!queryString) return

        queryString = queryString.split(' ').join('+')
        searchMode = searchMode || this.state.searchMode
        sortMode = sortMode || this.state.sortMode

        let apilink = 'https://api.github.com/search/' + searchMode + '?q=' + queryString + '&sort=stars&order=' + sortMode
        let fetchData = await (await fetch(apilink)).json()

        this.props.changeqstring(queryString)
        this.setState({
            queryString,
            searchMode,
            sortMode,
            fetchData: fetchData.items ? fetchData.items : []
        })

    }

    changeSearchMode = (searchMode: string) => {
        const { queryString, sortMode } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode)
        else this.setState({ searchMode })
    }

    changeSortingMode = (sortMode: string) => {
        const { queryString, searchMode } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode)
        else this.setState({ sortMode })
    }

    render() {
        console.log(this.state.fetchData)

        let list = this.state.searchMode === 'users' ?
            <UsersList users={this.state.fetchData as UserData[]}></UsersList> :
            <ReppositoriesList repos={this.state.fetchData as RepoData[]}></ReppositoriesList>

        if (!this.state.queryString)
            list = <></>

        return (<>
            <div className='search-area'>
                <SearchBar handleSearch={this.handleSearch}></SearchBar>
            </div>
            <div className='result-area'>
                <div className="mods">
                    <SearchModesList changeSearchMode={this.changeSearchMode}></SearchModesList>
                    <SortingMode changeSortingMode={this.changeSortingMode}></SortingMode>
                </div>
                {list}
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
            <input value={queryString || qstirngSave} type="text" onChange={(e) => setSearchValue(e.target.value)} className="searchbar-input" />
            <button type="button" onClick={() => props.handleSearch(queryString)} className="btn btn-primary searchbar-btn">Search</button>
        </div>
    </>);
}


interface SearchModeProps { changeSearchMode: any }
function SearchModesList(props: SearchModeProps) {
    const [SearchMode, setSearchMode] = useState('repositories')

    useEffect(() => {
        props.changeSearchMode(SearchMode)
    }, [SearchMode]);

    return (<>
        <ul className="list-group list-group-horizontal">
            <li className={`
                list-group-item
                ${SearchMode === 'repositories' ? 'active' : ''}
            `} onClick={() => setSearchMode('repositories')}>Repositories</li>
            <li className={`
                list-group-item
                ${SearchMode === 'users' ? 'active' : ''}
            `} onClick={() => setSearchMode('users')}>Users</li>
        </ul>
    </>)
}


interface SortingModeProps { changeSortingMode: any }
function SortingMode(props: SortingModeProps) {
    const [SortingMode, setSortingMode] = useState('desc')

    useEffect(() => {
        props.changeSortingMode(SortingMode)
    }, [SortingMode]);

    return (<>
        <ul className="list-group list-group-horizontal ">
            <li className={`
                list-group-item
                ${SortingMode === 'desc' ? 'active' : ''}
            `} onClick={() => setSortingMode('desc')}><i className="demo-icon icon-star"></i></li>
            <li className={`
                list-group-item
                ${SortingMode === 'asc' ? 'active' : ''}
            `} onClick={() => setSortingMode('asc')}><i className="demo-icon icon-star-empty"></i></li>
        </ul>
    </>)
}


export default SearchScreen;
