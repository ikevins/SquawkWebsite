import React, { useState } from 'react';
import sha256 from './sha256';
import './ForgotPassword.css';

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

        try
        {    
            const response = await fetch(buildPath('api/sendrecoveryemail'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            
            if (response.ok)
            {
                alert("Recovery Email was sent");
            }
            else 
            {
                alert("Incorrect Code!");
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
    <div className="overlay"></div>
        <div class="boxR">
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
   );
};

export default ForgotPasswordC;