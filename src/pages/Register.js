import React, { SyntheticEvent, useState } from 'react'
import { Redirect } from 'react-router-dom';

const Register = () => {

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        await fetch('http://192.168.141.19:8080/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                firstName,
                lastName,
                username,
                password
            })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
        });
        setRedirect(true);
    }
    if (redirect)
        return (
            <Redirect to="/login" />
        )

    else return (

        <form onSubmit={submit}>

            <h1 className="h3 mb-3 fw-normal">Please register</h1>


            <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)} />

            <input type="text" className="form-control" placeholder="First Name" required onChange={e => setFirstName(e.target.value)} />

            <input type="text" className="form-control" placeholder="Last Name" required onChange={e => setLastName(e.target.value)} />

            <input type="text" className="form-control" placeholder="Username" required onChange={e => setUsername(e.target.value)} />

            <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)} />


            <button className="w-100 btn btn-lg btn-primary" type="submit" >Submit</button>

        </form>


    )
}
export default Register;