import React, { useState } from 'react';
import sha256 from './sha256';
import './PasswordUpdate.css';

function PasswordUpdateC()
{
   return(
    <div className='main'>
    <div className="overlay"></div>
        <div class="boxR">
            <div class="formBox">
                <form>
                <h2>Update Password</h2><br />
                <div class="inputBox">
                    <input type="password" id="RegPassword" required="required" />
                        <span>New Password</span>
                        <i></i><br />
                </div>
                <div class="inputBox">
                    <input type="password" id="ConfirmPassword" required="required" />
                        <span>Re-Enter New Password</span>
                        <i></i><br />
                </div>
                <input type="submit" id="UpdatePassButton" class="buttons" value = "Update Passowrd"/>
                </form>
            </div>
        </div>
    </div>
   );
};

export default PasswordUpdateC;