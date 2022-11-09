import React, { useState } from 'react';
import sha256 from './sha256';
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
            alert("Passwords do not match!")
            return;
        }

        event.preventDefault();
        var hashedReg = sha256.hash(RegPassword.value);
        var obj = {login:RegEmail.value,password:hashedReg,firstName:RegFirstName.value,lastName:RegLastName.value};
        var js = JSON.stringify(obj);

        try
        {    
            //const response = await fetch('http://localhost:5000/api/login',
            const response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            // if( res.id <= 0 )
            // {
            //     setMessage('User/Password combination incorrect');
            // }
            // else
            // {
            //     var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
            //     localStorage.setItem('user_data', JSON.stringify(user));

            //     setMessage('');
            //     window.location.href = '/';
            // }

            window.location.href = '/';
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }    
    };

    return(
      <div id="RegisterDiv">
        <div id="regForm"> 
            <form onSubmit={doRegister}>
            <span id="inner-title">Register With Us Now! </span><br />
            <input type="text" id="RegFirstName" placeholder="First name:" 
                ref={(c) => RegFirstName = c} /><br />
            <input type="text" id="RegLastName" placeholder="Last name:" 
                ref={(c) => RegLastName = c} /><br />
            <input type="text" id="RegEmail" placeholder="Email Address:" 
                ref={(c) => RegEmail = c} /><br />
            <input type="password" id="RegPassword" placeholder="Password:" 
                ref={(c) => RegPassword = c} /><br />
            <input type="password" id="ConfirmPassword" placeholder="Re-enter password:" 
                ref={(c) => ConfirmPassword = c} /><br />
            <input type="submit" id="RegisterButton" class="buttons" value = "Register Now!"
            onClick={doRegister} />
            </form>
        </div>
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Register;