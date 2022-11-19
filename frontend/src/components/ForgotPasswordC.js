import React, { useState } from 'react';
import sha256 from './sha256';
import './ForgotPassword.css';

function ForgotPasswordC()
{
   return(
    <div className='main'>
    <div className="overlay"></div>
        <div class="boxR">
            <div class="formBox">
                <form>
                <h2>Forgot Password?</h2><br />
                <div class="inputBox">
                    <input type="password" id="RegPassword" required="required" />
                        <span>Enter Email</span>
                        <i></i><br />
                </div>
                <input type="submit" id="UpdatePassButton" class="buttons" value = "Send email"/>
                </form>
            </div>
        </div>
    </div>
   );
};

export default ForgotPasswordC;