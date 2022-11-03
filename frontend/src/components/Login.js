import React, { useState } from 'react';
import './Login.css';
import eats from '../assets/eats.mp4'
import sha256 from './sha256.js';

function Login()
{

    const app_name = 'cop4331-1738'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }
    

    var loginName;
    var loginPassword;

    const [message,setMessage] = useState('');

    const doLogin = async event => 
    {
        event.preventDefault();
        var hashed = sha256.hash(loginPassword.value);
        var obj = {login:loginName.value,password:hashed};
        var js = JSON.stringify(obj);

        try
        {    
            //const response = await fetch('http://localhost:5000/api/login',
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }    
    };

    return(
    <div className='main'>
        <div className="overlay"></div>
        <video src={eats} autoPlay loop muted/>
            <div class="box">
                <div class="formBox">
                    <form onSubmit={doLogin}>
                        <h2>Login</h2><br />
                        <div class="inputBox">
                            <input type="text" id="loginName" required="required"
                                ref={(c) => loginName = c} />
                                <span>Email</span>
                                <i></i><br />
                        </div>
                        <div class="inputBox">
                            <input type="password" id="loginPassword" required="required"
                                ref={(c) => loginPassword = c} />
                                <span>Password</span>
                                <i></i><br />
                        </div>
                        <input type="submit" id="loginButton" class="buttons" value="Login"
                            onClick={doLogin} />
                    </form>
                    <div class="link">
                        <a href='/register'>Register new account!</a>
                    </div>
                    <span id="loginResult">{message}</span>
                </div>
            </div>
    </div>
    );
};

export default Login;