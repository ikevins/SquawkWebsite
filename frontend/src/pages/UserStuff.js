import React, { useState } from 'react';
import eats from '../assets/eats4.mp4'
import '../components/RegisterPage.css'

function UserStuff()
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


    var userLocation;

    const yelpCall = async event => 
    {

        event.preventDefault();
        localStorage.setItem('user_location', userLocation.value);


        try
        {    
            const response = await fetch(buildPath('yelp/search?location=' + userLocation.value))
            var Results = await response.json();
            console.log(Results);
            localStorage.setItem('user_restaurants', JSON.stringify(Results));
            var checking = localStorage.getItem('user_restaurants');
            checking = JSON.parse(checking);
            console.log(checking);

            window.location.href = '/dashboard'
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
                    <form onSubmit={yelpCall}>
                    <h2>Another day in paradise here in...</h2><br />
                    <div class="inputBox">
                        <input type="text" id="RegFirstName" required="required" 
                            ref={(c) => userLocation = c} />
                            <span>What city are you in? </span>
                            <i></i><br />
                    </div>

                    <input type="submit" id="RegisterButton" class="buttons" value = "Show me the food!"
                    onClick={yelpCall} />
                    </form>
        </div>
        {/* <span id="loginResult">{message}</span> */}
     </div>
     </div>
    );
};

export default UserStuff;