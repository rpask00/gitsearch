import React, {useEffect, useState} from 'react';
import {RepoData, UserData} from '../interfaces';
import '../styles/search-screen.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {UsersList} from "./users-components";
import {RepositoriesList} from "./repository-components";

let qStirngSave = '';

export interface SearchScreenProps {
    qString: string;
    changeQString: any;
}

export interface SearchScreenState {
    fetchData: RepoData[] | UserData[];
    fetchDataCount: number;
    searchMode: string;
    sortMode: string;
    perPage: number;
    queryString: string;
    page: number;
}

class SearchScreen extends React.Component<SearchScreenProps, SearchScreenState> {
    state: SearchScreenState = {
        sortMode: 'desc',
        searchMode: 'repositories',
        fetchData: [],
        queryString: '',
        perPage: 30,
        page: 1,
        fetchDataCount: 1
    };

    componentDidMount() {
        const {qString} = this.props;
        qStirngSave = qString;
        if (qString) this.handleSearch(qString);
    }

    handleSearch = async (
        queryString: string,
        searchMode?: string,
        sortMode?: string,
        perPage?: number,
        page?: number
    ) => {
        if (!queryString) return;

        queryString = queryString.split(' ').join('+');
        searchMode = searchMode || this.state.searchMode;
        sortMode = sortMode || this.state.sortMode;
        perPage = perPage || this.state.perPage;
        page = page || this.state.page;

        let apiLink = `https://api.github.com/search/${searchMode}?q=${queryString}&sort=stars&order=${sortMode}&per_page=${perPage}&page=${page}`;
        let fetchData = await (await fetch(apiLink)).json();

        this.props.changeQString(queryString);
        this.setState({
            queryString,
            searchMode,
            sortMode,
            perPage: perPage,
            page,
            fetchData: fetchData.items ? fetchData.items : [],
            fetchDataCount: fetchData.total_count
        });
    };

    changeSearchMode = (searchMode: string) => {
        const {queryString, sortMode, perPage} = this.state;
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perPage, 1);
        else this.setState({searchMode});
    };

    changeSortingMode = (sortMode: string) => {
        const {queryString, searchMode, perPage} = this.state;
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perPage, 1);
        else this.setState({sortMode});
    };

    changePerPage = (perPage: number) => {
        const {queryString, searchMode, sortMode} = this.state;
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perPage, 1);
        else this.setState({perPage: perPage});
    };

    changePage = (page: number) => {
        const {queryString, searchMode, sortMode, perPage} = this.state;
        if (queryString) this.handleSearch(queryString, searchMode, sortMode, perPage, page);
        else this.setState({page});
    };

    render() {
        const {searchMode} = this.state;

        let pagination = <></>;
        let list = <></>;

        if (this.state.queryString && this.state.fetchDataCount) {
            pagination = (
                <Pagination
                    changePage={this.changePage}
                    currentPage={this.state.page}
                    perPage={this.state.perPage}
                    resCount={this.state.fetchDataCount}
                ></Pagination>
            );

            list =
                searchMode === 'users' ? (
                    <UsersList users={this.state.fetchData as UserData[]}></UsersList>
                ) : (
                    <RepositoriesList repos={this.state.fetchData as RepoData[]}></RepositoriesList>
                );
        }

        return (
            <>
                <div className="search-area">
                    <SearchBar handleSearch={this.handleSearch}></SearchBar>
                </div>
                <div className="result-area">
                    <div className="mods">
                        <SearchModesList changeSearchMode={this.changeSearchMode}></SearchModesList>
                        {searchMode !== 'users' ? (
                            <SortingMode changeSortingMode={this.changeSortingMode}></SortingMode>
                        ) : (
                            <></>
                        )}
                        <PerPage changePerPage={this.changePerPage}></PerPage>
                    </div>
                    {list}
                    {pagination}
                </div>
            </>
        );
    }
}

function SearchBar(props: { handleSearch: any }) {
    const [queryString, setSearchValue] = useState('');

    return (
        <>
            <div className="searchbar">
                <TextField
                    variant="filled"
                    style={{color: 'white'}}
                    value={queryString || qStirngSave}
                    type="text"
                    onChange={(e) =>
                        setSearchValue((val) => {
                            if (!e.target.value) qStirngSave = '';
                            return e.target.value;
                        })
                    }
                    className="searchbar-input"
                />
                <Button
                    style={{backgroundColor: 'rgba(236,243,158,0.59)', marginLeft: '10px', padding: '15px'}}
                    variant="contained"
                    type="button"
                    onClick={() => props.handleSearch(queryString)}
                    className="btn btn-primary searchbar-btn"
                >
                    <i className="demo-icon icon-search"></i>
                    Search
                </Button>
            </div>
        </>
    );
}

function SearchModesList({changeSearchMode}: { changeSearchMode: any }) {
    const [SearchMode, setSearchMode] = useState('repositories');

    useEffect(() => {
        changeSearchMode(SearchMode);
    }, [SearchMode, changeSearchMode]);

    return (
        <div className="filter">
            <label>Search for:</label>

            <ToggleButtonGroup color="primary" onChange={(_, sm) => setSearchMode(sm)} exclusive value={SearchMode}>
                <ToggleButton value="repositories" aria-label="left aligned" style={{color: 'white'}}>
                    Repositories
                </ToggleButton>
                <ToggleButton value="users" aria-label="centered" style={{color: 'white'}}>
                    Users
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

function SortingMode({changeSortingMode}: { changeSortingMode: any }) {
    const [SortingMode, setSortingMode] = useState('desc');

    useEffect(() => {
        changeSortingMode(SortingMode);
    }, [SortingMode, changeSortingMode]);

    return (
        <div className="filter">
            <label>Stars sorting</label>
            <ToggleButtonGroup color="primary" onChange={(_, asc) => setSortingMode(asc)} exclusive value={SortingMode}>
                <ToggleButton value="asc" aria-label="left aligned" style={{color: 'white'}}>
                    Ascending
                </ToggleButton>
                <ToggleButton value="desc" aria-label="centered" style={{color: 'white'}}>
                    Descending
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

function PerPage({changePerPage}: { changePerPage: any }) {
    const [perPageVal, setPerPage] = useState(30);

    useEffect(() => {
        changePerPage(perPageVal);
    }, [perPageVal, changePerPage]);

    return (
        <div className="filter">
            <label>Results per page</label>

            <ToggleButtonGroup
                color="primary"
                onChange={(_, perPage) => setPerPage(perPage * 1)}
                exclusive
                value={perPageVal.toString()}
            >
                <ToggleButton value="30" aria-label="left aligned" style={{color: 'white'}}>
                    30
                </ToggleButton>
                <ToggleButton value="50" aria-label="centered" style={{color: 'white'}}>
                    50
                </ToggleButton>
                <ToggleButton value="100" aria-label="centered" style={{color: 'white'}}>
                    100
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

interface PaginationProps {
    changePage: any;
    currentPage: number;
    resCount: number;
    perPage: number;
}

function Pagination({changePage, currentPage, resCount, perPage}: PaginationProps) {
    const [selectedPage, selectPage] = useState(currentPage);

    useEffect(() => {
        changePage(selectedPage);
        window.scrollTo(0, 0);
    }, [selectedPage, changePage]);

    resCount = Math.min(resCount, 1000);
    let pages = [];


    for (let i = 1; i <= Math.ceil(resCount / perPage); i++) {
        pages.push(
            <ToggleButton key={i} value={i} aria-label="centered" style={{color: 'white'}}>
                {i}
            </ToggleButton>
        );
    }


    return <ToggleButtonGroup
        color="primary"
        onChange={(_, page) => {
            console.log(page)
            selectPage(page * 1);
        }}
        exclusive
        value={selectedPage}>
        {pages}
    </ToggleButtonGroup>;
}

export default SearchScreen;
