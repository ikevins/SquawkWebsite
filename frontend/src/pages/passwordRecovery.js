import React, { useState } from 'react';
import sha256 from '../components/sha256';
import '../components/RecoveryPassword.css';
import squawkLogo from '../assets/squawklogo.png';
import eats from '../assets/eats.mp4';

function passwordRecovery()
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

    var recoveryCode;
    var newPassword;
    var passwordCheck;
    var userIDrec;
    

   // const [message,setMessage] = useState('');

    const sendRecovery = async event => 
    {
        if(newPassword.value !== passwordCheck.value)
        {
            alert("Passwords do not match!");
            return;
        }

        event.preventDefault();
        var hashedrec = sha256.hash(newPassword.value);
        var obj = {userID:userIDrec,code:recoveryCode.value,newPassword:hashedrec};
        var js = JSON.stringify(obj);
        console.log(js);

        try
        {    
            const response = await fetch(buildPath('api/resetpassword'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            console.log(userIDrec);
            
            if (response.ok)
            {
                alert("Password Successfully Reset!");
                window.location.href = "/"
            }
            else 
            {
                alert("Incorrect Code!");
                console.log(js);
            }

            //setMessage('');
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }    
    };

    const getUser = async event => 
    {

        event.preventDefault();
        var hashedrec = sha256.hash(newPassword.value);
        var obj = {email:localStorage.getItem('recovery_email')};
        var js = JSON.stringify(obj);
        console.log(js);

        try
        {    
            const response = await fetch(buildPath('api/getuser'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            userIDrec = res._id;
            console.log(userIDrec);
            sendRecovery(event);
            
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
        <div class="boxApp">
            <div class="formBox">
                <form>
                <h2>Forgot Password?</h2><br />
                <div class="inputBox">
                    <input type="text" id="RegPassword" required="required" 
                        ref={(c) => recoveryCode = c} />
                        <span>Enter Validation Code</span>
                        <i></i><br />
                </div>
                <div class="inputBox">
                    <input type="text" id="RegPassword" required="required" 
                        ref={(c) => newPassword = c} />
                        <span>Enter New Password</span>
                        <i></i><br />
                </div>
                <div class="inputBox">
                    <input type="text" id="RegPassword" required="required" 
                        ref={(c) => passwordCheck = c} />
                        <span>Re-enter password</span>
                        <i></i><br />
                </div>
                <input type="submit" id="UpdatePassButton" class="buttons" value = "Send email"
                onClick={getUser} />
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

export default passwordRecovery;