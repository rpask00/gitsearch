import React, { useEffect, useState } from 'react';
import { RepoData, UserData } from '../interfaces';
import { ReppositoriesList } from './repositoryComponents';
import { UsersList } from './usersComponents';
import '../styles/searchScreen.css';
let qstirngSave = ''

export interface SearchScreenProps {
    qstring: string,
    changeqstring: any
}


export interface SearchScreenState {
    fetchData: RepoData[] | UserData[],
    fetchDataCount: number,
    searchMode: string,
    sortMode: string,
    perpage: number,
    queryString: string,
    page: number,

}


class SearchScreen extends React.Component<SearchScreenProps, SearchScreenState> {
    state: SearchScreenState = {
        sortMode: 'desc',
        searchMode: 'repositories',
        fetchData: [],
        queryString: '',
        perpage: 30,
        page: 1,
        fetchDataCount: 1
    }

    componentDidMount() {
        const { qstring } = this.props
        qstirngSave = qstring
        if (qstring) this.handleSearch(qstring)
    }

    handleSearch = async (queryString: string, searchMode?: string, sortMode?: string, perpage?: number, page?: number) => {
        if (!queryString) return

        queryString = queryString.split(' ').join('+')
        searchMode = searchMode || this.state.searchMode
        sortMode = sortMode || this.state.sortMode
        perpage = perpage || this.state.perpage
        page = page || this.state.page

        let apilink = `https://api.github.com/search/${searchMode}?q=${queryString}&sort=stars&order=${sortMode}&per_page=${perpage}&page=${page}`
        let fetchData = await (await fetch(apilink)).json()

        this.props.changeqstring(queryString)
        this.setState({
            queryString,
            searchMode,
            sortMode,
            perpage,
            page,
            fetchData: fetchData.items ? fetchData.items : [],
            fetchDataCount: fetchData.total_count
        })

    }

    changeSearchMode = (searchMode: string) => {
        const { queryString, sortMode, perpage } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perpage, 1)
        else this.setState({ searchMode })
    }

    changeSortingMode = (sortMode: string) => {
        const { queryString, searchMode, perpage } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perpage, 1)
        else this.setState({ sortMode })
    }

    changePerPage = (perpage: number) => {
        const { queryString, searchMode, sortMode } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perpage, 1)
        else this.setState({ perpage })
    }

    changePage = (page: number) => {
        const { queryString, searchMode, sortMode, perpage } = this.state
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perpage, page)
        else this.setState({ page })
    }

    render() {
        const { searchMode } = this.state

        let pagination = <></>
        let list = <></>

        if (this.state.queryString && this.state.fetchDataCount) {
            pagination = <Pagination
                changePage={this.changePage}
                currentpage={this.state.page}
                perpage={this.state.perpage}
                rescount={this.state.fetchDataCount}></Pagination>

            list = searchMode === 'users' ?
                <UsersList users={this.state.fetchData as UserData[]}></UsersList> :
                <ReppositoriesList repos={this.state.fetchData as RepoData[]}></ReppositoriesList>
        }

        return (<>
            <div className='search-area'>
                <SearchBar handleSearch={this.handleSearch}></SearchBar>
            </div>
            <div className='result-area'>
                <div className="mods">
                    <SearchModesList changeSearchMode={this.changeSearchMode}></SearchModesList>
                    {
                        searchMode !== 'users' ? <SortingMode changeSortingMode={this.changeSortingMode}></SortingMode> : <></>
                    }
                    <PerPage changePerPage={this.changePerPage}></PerPage>
                </div>
                {list}
                {pagination}
            </div>
        </>);
    }
}


function SearchBar(props: { handleSearch: any }) {
    const [queryString, setSearchValue] = useState('')


    return (<>
        <div className="searchbar">
            <input value={queryString || qstirngSave} type="text" onChange={(e) => setSearchValue(val => {
                if (!e.target.value)
                    qstirngSave = ''
                return e.target.value
            })} className="searchbar-input" />
            <button type="button" onClick={() => props.handleSearch(queryString)}
                className="btn btn-primary searchbar-btn">
                <i className="demo-icon icon-search"></i>
                Search
                </button>
        </div>
    </>);
}


function SearchModesList({ changeSearchMode }: { changeSearchMode: any }) {
    const [SearchMode, setSearchMode] = useState('repositories')

    useEffect(() => {
        changeSearchMode(SearchMode)
    }, [SearchMode, changeSearchMode]);

    return (<div className='filter'>
        <label >Show:</label>
        <ul className="switch serchmode">
            <li className={`
                switch-item
                ${SearchMode === 'repositories' ? 'active' : ''}
            `} onClick={() => setSearchMode('repositories')}>
                <p>Repositories</p>
            </li>
            <li className={`
                switch-item
                ${SearchMode === 'users' ? 'active' : ''}
            `} onClick={() => setSearchMode('users')}>
                <p>Users</p>
            </li>
        </ul>
    </div>)
}


function SortingMode({ changeSortingMode }: { changeSortingMode: any }) {
    const [SortingMode, setSortingMode] = useState('desc')

    useEffect(() => {
        changeSortingMode(SortingMode)
    }, [SortingMode, changeSortingMode]);

    return (<div className='filter'>
        <label >Sot by stars</label>
        <ul className="switch sortmode">
            <li className={`
                switch-item
                ${SortingMode === 'desc' ? 'active' : ''}
            `} onClick={() => setSortingMode('desc')}><i className="demo-icon icon-star"></i>
            Desc
            </li>
            <li className={`
                switch-item
                ${SortingMode === 'asc' ? 'active' : ''}
            `} onClick={() => setSortingMode('asc')}><i className="demo-icon icon-star-empty"></i>
            Asc
            </li>
        </ul>
    </div>)
}


function PerPage({ changePerPage }: { changePerPage: any }) {
    const [perpageval, setPerPage] = useState(30)

    useEffect(() => {
        changePerPage(perpageval)
    }, [perpageval, changePerPage]);

    return (<div className='filter' >
        <label >Results per page</label>
        <ul className="pagination switch">
            <li className={`switch-item  ${perpageval === 30 ? 'active' : ''}`} onClick={() => setPerPage(30)}>
                <span className="page-link" >30</span>
            </li>
            <li className={`switch-item  ${perpageval === 50 ? 'active' : ''}`} onClick={() => setPerPage(50)}>
                <span className="page-link" >50</span>
            </li>
            <li className={`switch-item  ${perpageval === 100 ? 'active' : ''}`} onClick={() => setPerPage(100)}>
                <span className="page-link">100</span>
            </li>
        </ul>
    </div >)
}


interface PaginationProps {
    changePage: any,
    currentpage: number,
    rescount: number,
    perpage: number
}

function Pagination({ changePage, currentpage, rescount, perpage }: PaginationProps) {
    const [selectedpage, selectPage] = useState(currentpage)

    useEffect(() => {
        changePage(selectedpage)
        window.scrollTo(0, 0)
    }, [selectedpage, changePage]);

    rescount = Math.min(rescount, 1000)
    let pages = []

    for (let i = 1; i <= Math.ceil(rescount / perpage); i++) {
        pages.push(
            <li key={i}
                className={`switch-item ${selectedpage === i ? 'active' : ''}`}
                onClick={() => selectPage(i)}>
                <span className="page-link" >{i}</span>
            </li>)
    }

    return (<ul className="selectedpage">
        {pages}
    </ul>)
}

export default SearchScreen;
