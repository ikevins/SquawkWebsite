import React, { useState } from 'react';
import sha256 from './sha256';
import eats from '../assets/eats.mp4'
import './RegisterPage.css';

function Register()
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
    

    var RegFirstName;
    var RegLastName;
    var RegPassword;
    var RegEmail;
    var ConfirmPassword;




    const [message,setMessage] = useState('');

    const doRegister = async event => 
    {
        if(RegPassword.value !== ConfirmPassword.value)
        {
            // alert("Passwords do not match!")
            setMessage('Passwords do not match!');
            return;
        }

        event.preventDefault();
        var hashedReg = sha256.hash(RegPassword.value);
        var obj = {login:RegEmail.value,password:hashedReg,firstName:RegFirstName.value,lastName:RegLastName.value};
        var js = JSON.stringify(obj);

        try
        {    
            //const response = await fetch('http://localhost:5000/api/login',
            // const response = await fetch(buildPath('api/register'),
            //     {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            var response;
            if(process.env.NODE_ENV == 'production')
            {
                response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }
            else
            {
                response = await fetch(buildPath('api/register'),
                {credentials: 'include', method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            }

            var res = JSON.parse(await response.text());

        
            var user = {firstName:res.firstName,lastName:res.lastName,_id:res._id,token:res.token,password:res.password,email:res.email}
            localStorage.setItem('user_verification', JSON.stringify(user));

            var user2 = {firstName:res.firstName,lastName:res.lastName,id:res._id, token: res.token}
            localStorage.setItem('user_data', JSON.stringify(user2));

            setMessage('');


            window.location.href = '/Verification';
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
            <div class="boxR">
                <div class="formBox">
                    <form onSubmit={doRegister}>
                    <h2>Register With Us Now!</h2><br />
                    <div class="inputBox">
                        <input type="text" id="RegFirstName" required="required" 
                            ref={(c) => RegFirstName = c} />
                            <span>First Name</span>
                            <i></i><br />
                    </div>
                    <div class="inputBox">
                        <input type="text" id="RegLastName" required="required" 
                            ref={(c) => RegLastName = c} />
                            <span>Last name</span>
                            <i></i><br />
                    </div>
                    <div class="inputBox">
                        <input type="text" id="RegEmail" required="required" 
                            ref={(c) => RegEmail = c} />
                            <span>Email</span>
                            <i></i><br />
                    </div>
                    <div class="inputBox">
                        <input type="password" id="RegPassword" required="required"
                            ref={(c) => RegPassword = c} />
                            <span>Pass</span>
                            <i></i><br />
                    </div>
                    <div class="inputBox">
                        <input type="password" id="ConfirmPassword" required="required" 
                            ref={(c) => ConfirmPassword = c} />
                            <span>re-enter Pass</span>
                            <i></i><br />
                    </div>
                    <input type="submit" id="RegisterButton" class="buttons" value = "Register Now!"
                    onClick={doRegister} />
                    </form>
        </div>
        <span id="loginResult">{message}</span>
     </div>
     </div>
    );
};

export default Register;