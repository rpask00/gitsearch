import {RepoData} from "../interfaces";
import {getReposKey, RepositoriesList} from "./repository-components";
import * as React from "react";


export const FavouriteRepositories = () => {

    let repositories = localStorage.getItem(getReposKey()) || '[]';
    let favouritesArray: RepoData[] = JSON.parse(repositories);

    return (
        <>

            <div className="result-area pt-3">
                <h1 style={{color: 'white'}}>Favourites repositories list</h1>
                <RepositoriesList repos={favouritesArray}></RepositoriesList>
            </div>
        </>
    );
};
