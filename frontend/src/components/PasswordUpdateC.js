import React, { useState } from 'react';
import sha256 from './sha256';
import './PasswordUpdate.css';
import squawkLogo from '../assets/squawklogo.png';
import eats from '../assets/eats.mp4';

function PasswordUpdateC()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;


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

    var newPassword;
    var ConfirmPassword;
    var oldPassword;

    const [message,setMessage] = useState('');

    const changePassword = async event => 
 {
    if(newPassword.value !== ConfirmPassword.value)
    {
        setMessage("Passwords do not match!");
        return;
    }

    event.preventDefault();
    var hashedNew = sha256.hash(newPassword.value);
    var hashedOld = sha256.hash(oldPassword.value);
    var obj = {userID:userId,oldPassword:hashedOld,newPassword:hashedNew};
    var js = JSON.stringify(obj);

    try
    {    
        const response = await fetch(buildPath('api/changepassword'),
            {method:'PATCH',body:js,headers:{'Content-Type': 'application/json'}});

        
        if (response.ok)
        {
            //setMessage("Password was successfully updated!");
            window.location.href = "/dashboard";
        }
        else 
        {
            setMessage("Incorrect Password");
        }

       // setMessage('');
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
        <div class="boxRR">
            <div class="formBox">
                <form>
                <h2>Update Password</h2><br />
                <div class="inputBox">
                    <input type="password" id="RegPassword" required="required"
                        ref={(c) => oldPassword = c} />
                        <span>Old password</span>
                        <i></i><br />
                </div>
                <div class="inputBox">
                    <input type="password" id="RegPassword" required="required"
                        ref={(c) => newPassword = c} />
                        <span>New Password</span>
                        <i></i><br />
                </div>
                <div class="inputBox">
                    <input type="password" id="ConfirmPassword" required="required"
                        ref={(c) => ConfirmPassword = c} />
                        <span>Re-Enter New Password</span>
                        <i></i><br />
                </div>
                <input type="submit" id="UpdatePassButton" class="buttons" value = "Update Passowrd"
                onClick={changePassword}/>
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

export default PasswordUpdateC;