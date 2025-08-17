import { useState } from "react";
import axiosInstance from "../api/axios";



export const Profile = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    async function getProfile() {
        try {
            const respone = await axiosInstance.get('/api/v1/user/profile'); //in order to work with interceptor use axiosInstance instead of global axios, that way it will attach token in every rqst sent and catch every error

            if (respone) {
                setFirstName(respone.data.firstName);
                setLastName(respone.data.lastName);
            }
        }
        catch(error){
            console.error(`Profile error: ${error}`)
        }
    };


    return (
        <div>
            <div>{firstName ? firstName : "Who are you"}</div>
            <div>
                <button onClick={getProfile} type="button" className="rounded-lg px-3 bg-blue-400">Click to find</button>
            </div>
        </div>
    );
}