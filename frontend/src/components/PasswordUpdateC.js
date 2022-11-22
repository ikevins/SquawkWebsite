import React, { useState } from 'react';
import sha256 from './sha256';
import './PasswordUpdate.css';

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
        alert("Passwords do not match!")
        setMessage('YOU SUCK');
        return;
    }

    event.preventDefault();
    var hashedNew = sha256.hash(newPassword.value);
    var obj = {userID:userId,oldPassword:oldPassword.value,newPassword:hashedNew};
    var js = JSON.stringify(obj);

    try
    {    
        const response = await fetch(buildPath('api/changepassword'),
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
   );
};

export default PasswordUpdateC;