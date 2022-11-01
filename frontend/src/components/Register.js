import React, { useState } from 'react';

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
    

    var RegName;
    var RegPassword;
    var RegEmail;
    var ConfirmPassword;


    const [message,setMessage] = useState('');

    const doRegister = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
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
      <div id="RegisterDiv">
        <form onSubmit={doRegister}>
        <span id="inner-title">Register With us now! </span><br />
        <input type="text" id="RegName" placeholder="Full Name" 
            ref={(c) => RegName = c} /><br />
        <input type="password" id="RegEmail" placeholder="Email Address" 
            ref={(c) => RegPassword = c} /><br />
        <input type="password" id="RegPassword" placeholder="Password" 
            ref={(c) => RegPassword = c} /><br />
        <input type="password" id="ConfirmPassword" placeholder="Re-enter password" 
            ref={(c) => RegPassword = c} /><br />
        <input type="submit" id="RegisterButton" class="buttons" value = "Register Now!"
          onClick={doRegister} />
        </form>
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Register;