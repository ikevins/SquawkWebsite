import React, { useState } from 'react';
import eats from '../assets/eats.mp4'
import '../components/RegisterPage.css'

function Verification()
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
    

    var _ud = localStorage.getItem('user_verification');
    var ud = JSON.parse(_ud);
    var userId = ud._id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var email = ud.email;
    var token = ud.token;
    var password = ud.password;

    var userCode;



    const [message,setMessage] = useState('');

    const doVerify = async event => 
    {

        event.preventDefault();
        var obj = {userID:userId,code:userCode.value};
        var js = JSON.stringify(obj);
        console.log(userCode.value);
        console.log(firstName);
        console.log(userId);
        console.log(lastName);

        try
        {    
            const response = await fetch(buildPath('api/verifyemail'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            setMessage('');

            window.location.href = '/login';
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
                    <form onSubmit={doVerify}>
                    <h2>Register With Us Now!</h2><br />
                    <div class="inputBox">
                        <input type="text" id="RegFirstName" required="required" 
                            ref={(c) => userCode = c} />
                            <span>6 Digit Code</span>
                            <i></i><br />
                    </div>

                    <input type="submit" id="RegisterButton" class="buttons" value = "Verifiy Me!"
                    onClick={doVerify} />
                    </form>
        </div>
        <span id="loginResult">{message}</span>
     </div>
     </div>
    );
};

export default Verification;