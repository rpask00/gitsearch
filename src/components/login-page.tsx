import React, {FC} from 'react';
import {UserData} from "../interfaces";

export const Login: FC<{ signIn: any }> = ({signIn}) => {

    return (
        <div style={styles.loginContainer}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt=""
                 style={styles.logo}/>
            <div style={styles.loginText}>
                <h1>Sign in</h1>
            </div>
            <button style={styles.button} onClick={signIn}>Sign In With Google</button>
        </div>
    );
}

// Here are some simple styles
const styles: any = {

    loginContainer: {
        width: '300px',
        margin: 'auto',
        marginTop: '20px',
        padding: '100px',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(49,87,44,0.87)',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    },
    logo: {
        width: '200px',
        height: '200px',
        marginBottom: '40px',
    },
    loginText: {
        marginBottom: '50px',
    },
    button: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white',
        background: '#4285F4',
        borderRadius: '999px',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
    },
};

export default Login;
