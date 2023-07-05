import {UserData} from "../interfaces";
import * as React from "react";
import {getUserKey, UsersList} from "./users-components";


export const FavouriteUsers = () => {

    let users = localStorage.getItem(getUserKey()) || '[]';
    let favouritesArray: UserData[] = JSON.parse(users);

    return (
        <>
            <div className="usersList pt-3">
                <h1 style={{color: 'white'}}>Favourites Users list</h1>
                <UsersList users={favouritesArray}></UsersList>
            </div>
        </>
    );
};
