import React, { SyntheticEvent, useState } from 'react'
import { Redirect } from 'react-router-dom';

const Login = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        await fetch('http://192.168.141.19:8080/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            sessionStorage.setItem('jwt', data.jwt);
        });

        setRedirect(true);

    }
    if (redirect)
        return (
            <Redirect to="/" />
        )

    else return (

            <form onSubmit={submit}>

                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>


                <input type="text" className="form-control" placeholder="Username" onChange={e => setUsername(e.target.value)} required />


                <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} required />


                <button className="w-100 btn btn-lg btn-primary" type="submit" >Sign in</button>

            </form>

        )
}
export default Login;
