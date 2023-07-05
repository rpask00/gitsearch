import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {UserData} from '../interfaces';
import '../styles/search-screen.css';
import '../styles/user-components.css';

export const getUserKey = () => {
    let user = localStorage.getItem('user');
    return user ? 'favourites-users-' + JSON.parse(user).uid : "";
}

export const UsersList: FC<{ users: UserData[] }> = ({users}) => {
    if (!users.length) return <h1 className="not-found">Users not found..</h1>;

    let favourites = localStorage.getItem(getUserKey()) || '[]';
    let favouritesArray: UserData[] = JSON.parse(favourites);

    let usersList: JSX.Element[] = users.map((user) => <User key={user.login}
                                                             isFavourite={!!favouritesArray.find(f => f.id === user.id)}
                                                             user={user}></User>);
    return <div className="usersList">{usersList}</div>;
};

export const User: FC<{ user: UserData, isFavourite: boolean }> = ({user, isFavourite}) => {
    let [favourite, setFavourites] = React.useState<boolean>();
    React.useEffect(() => setFavourites(isFavourite), [isFavourite]);

    React.useEffect(() => {
        let favourites = localStorage.getItem(getUserKey()) || '[]';
        let favouritesArray: UserData[] = JSON.parse(favourites);
        if (!favourite) {
            favouritesArray = favouritesArray.filter((item: UserData) => item.id !== user.id);
        } else if (!favouritesArray.find(f => f.id === user.id)) {
            favouritesArray.push(user);
        }
        localStorage.setItem(getUserKey(), JSON.stringify(favouritesArray));
    }, [favourite]);

    return (
        <>
            <div className="user pt-3">
                <img className="user-image" src={user.avatar_url} alt={user.login}/>
                <h1 className="user-login">
                    <Link
                        to={{
                            pathname: '/user/' + user.login,
                            state: user.url
                        }}
                    >
                        {user.login}
                    </Link>
                </h1>
                <span className="favourite ml-2" onClick={() => {
                    setFavourites(!favourite);
                }}>
                        {
                            favourite ? <i className="demo-icon icon-heart"></i> :
                                <i className="demo-icon icon-heart-empty"></i>
                        }
               </span>
            </div>
        </>
    );
};
