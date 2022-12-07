import React, { useState } from 'react';
import sha256 from './sha256';
import './ForgotPassword.css';
import squawkLogo from '../assets/squawklogo.png';
import eats from '../assets/eats.mp4';

function ForgotPasswordC()
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

    var recoveryEmail;
    
    

    const [message,setMessage] = useState('');

    const sendRecovery = async event => 
    {

        event.preventDefault();
        var obj = {email:recoveryEmail.value};
        var js = JSON.stringify(obj);
        console.log(js);

        try
        {    
            const response = await fetch(buildPath('api/sendrecoveryemail'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            
            if (response.ok)
            {
                localStorage.setItem('recovery_email', recoveryEmail.value);
                alert("Recovery Email was sent");
                window.location.href = '/recovery';
            }
            else 
            {
                alert("Incorrect Email!");
                console.log(js);
            }

            setMessage('');
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }    
    };







   return(
    <div className='main'>
    <div class="left">
    <img src={squawkLogo} alt="logo"/>
        <div class="boxA">
            <div class="formBox">
                <form>
                <h2>Forgot Password?</h2><br />
                <div class="inputBox">
                    <input type="text" id="RegPassword" required="required" 
                        ref={(c) => recoveryEmail = c} />
                        <span>Enter Email</span>
                        <i></i><br />
                </div>
                <input type="submit" id="UpdatePassButton" class="buttons" value = "Send email"
                onClick={sendRecovery} />
                </form>
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

export default ForgotPasswordC;