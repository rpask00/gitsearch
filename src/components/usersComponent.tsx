import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from '../interfaces';
import './searchScreen.css';

export const UsersList: FC<{ users: UserData[] }> = ({ users }) => {
    let userslist: JSX.Element[] = users.map(user => <User key={user.login} user={user}></User>)
    return <div className='usersList'>{userslist}</div>
}


export const User: FC<{ user: UserData }> = ({ user }) => {
    // let date = new Date(user.created_at)
    return (<>
        <div className="user">
            <img className='user-image' src={user.avatar_url} alt={user.login} />
            <h1 className='user-login'>
                <Link to={'/user/' + user.login}>{user.login}</Link>
            </h1>
        </div>
    </>)
}

