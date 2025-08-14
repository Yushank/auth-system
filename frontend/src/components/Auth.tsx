import { useState, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom"
import { signupInput } from "../schemas/userSchema";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useAuth } from "../context/AuthContext";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    console.log("Auth component loaded", type);

    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signupInput>({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    const { login } = useAuth();

    async function sendSignupRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs);

            if (response) {
                const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                    email: postInputs.email,
                    password: postInputs.password
                }); //login user soon after signup

                login(res.data.accessToken, res.data.refreshToken);  //store token in state and localstorage via calling authContext function
                navigate('/dashboard')
            }
        }
        catch (error) {
            console.error(error)
        }
    };


    async function sendSigninRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                email: postInputs.email,
                password: postInputs.password
            });

            login(response.data.accessToken, response.data.refreshToken);
            navigate('/dashboard')
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="h-screen flex justify-center flex-col">
                <div className="flex justify-center">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <div className="px-10">
                            <div className="text-3xl font-bold text-center">
                                {type === "signup" ? "Create an account" : "Sign in"}
                            </div>
                            <div className="text-center text-slate-500">
                                {type === "signup" ? "Already have an account" : "Don't have an account"}
                                <Link className="pl-2 underline" to={type === "signup" ? "/signin" : "/signup"}>
                                    {type === "signup" ? "signin" : "signup"}
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            {/* Your form inputs here */}
                            <LabelledInput
                                label="Email"
                                type="email"
                                placeholder="peter@gmail.com"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const lowercase = value.toLowerCase();
                                    setPostInputs({
                                        ...postInputs,
                                        email: lowercase
                                    })
                                }}
                            />

                            {type === "signup" ? (<LabelledInput
                                label="First Name"
                                type="text"
                                placeholder="Peter"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                                    //this make first letter of sentence upper case
                                    setPostInputs({
                                        ...postInputs,
                                        firstName: capitalized
                                    })
                                }}
                            ></LabelledInput>) : null}

                            {type === "signup" ? (<LabelledInput
                                label="Last Name"
                                type="text"
                                placeholder="Parker"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                                    //this make first letter of sentence upper case
                                    setPostInputs({
                                        ...postInputs,
                                        lastName: capitalized
                                    })
                                }}
                            ></LabelledInput>) : null}

                            <div className="relative">
                                <LabelledInput
                                    label="Password"
                                    type="password"
                                    placeholder="******"
                                    onChange={(e) => setPostInputs({
                                        ...postInputs,
                                        password: e.target.value
                                    })}
                                ></LabelledInput>
                            </div>

                            <button
                                onClick={type === "signup" ? sendSignupRequest : sendSigninRequest}
                                type="button"
                                className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 me-2"
                            >{type === "signup" ? "Lets start" : "signin"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


interface labelledInputType {
    label: string,
    type: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function LabelledInput({ label, type, placeholder, onChange }: labelledInputType) {
    return (
        <div>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} onChange={onChange}
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>
    )
}