import React, { useState } from 'react';
import './Login.css';
import eats from '../assets/eats.mp4'
import sha256 from './sha256.js';
import squawkLogo from '../assets/squawklogo.png';

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
       
    //run a login request on page load using the userID and cookie
    const autoLogin = async event => 
    {
        //event.preventDefault();
        var user = JSON.parse(localStorage.getItem('user_data'));
        if(!user)
        {
            console.log("no user data, skipping auto login user:"+user);
            return;
        }
        var userID = user.id;
        var cookie = user.token;
        var obj = {userID: userID};
        var js = JSON.stringify(obj);

        try
        { 
            var response;
            if(process.env.NODE_ENV == 'production')
            {
                response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }
            else
            {
                response = await fetch(buildPath('api/login'),
                {credentials: 'include', method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }

            var res = JSON.parse(await response.text());

            var user = {firstName:res.firstName,lastName:res.lastName,id:res._id, token: res.token}
            localStorage.setItem('user_data', JSON.stringify(user));

            setMessage('');
            window.location.href = '/location';

        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }
    autoLogin();

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
            //some weird thing to make the cookie save on localhost
            var response;
            if(process.env.NODE_ENV == 'production')
            {
                response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }
            else
            {
                response = await fetch(buildPath('api/login'),
                {credentials: 'include', method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }

            var res = JSON.parse(await response.text());
            console.log(response);

                var user = {firstName:res.firstName,lastName:res.lastName,id:res._id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/location';
            
                // var user = {firstName:res.firstName,lastName:res.lastName,id:res._id}
                // localStorage.setItem('user_data', JSON.stringify(user));

                // setMessage('');
                // window.location.href = '/location';

                //setMessage('User/Password combination incorrect');

        }
        catch(e)
        {
            console.log(e.toString());
            setMessage('User/Password combination incorrect');
            return;
        }    
    };

    return(
    <div className='main'>
        <div class="left">
        <img src={squawkLogo} alt="logo"/>
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
                        {/* <input type="submit" id="loginButton2" class="buttons" value="Login w/ Token"
                            onClick={autoLogin} /> */}
                    </form>
                    <div class="link">
                        <a href='/register'>Register new account!</a>
                    </div>
                    <div class="link">
                        <a href='/forgot_password'>Forgot Password?</a>
                    </div>
                    <span id="loginResult">{message}</span>
                </div>
            </div>
        </div>
        <div class="right">
            <div className="overlay"></div>
            <video src={eats} autoPlay loop muted/>
        </div>
    </div>
    );
};

export default Login;