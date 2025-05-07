import * as React from "react";
import Navbar from "../components/navbar.js";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate;
    // state for Login Form
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginErrors, setLoginErrors] = useState("");

    // fetch request - would need backend to handle login request
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/login", {
                method: "POST",
                body: JSON.stringify({ loginEmail, loginPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                navigate("/");
            } else {
                setLoginErrors(result.error || "Incorrect email or password.");
            }
        } catch (error) {
            setLoginErrors("Error: " + error.message);
        }
    };

    // state for Create Account Form
    const [nickname, setNickname] = useState("");
    const [registrationEmail, setRegistrationEmail] = useState("");
    const [registrationPassword, setRegistrationPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registrationErrors, setRegistrationErrors] = useState({});

    const validateNickname = (nickname) => nickname.length >= 3;
    const validateEmail = (email) => {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const validatePassword = (password) => password.length >= 7;

    const handleNickname = (e) => {
        setNickname(e.target.value);
        if (!validateNickname(e.target.value)) {
            setRegistrationErrors({
                ...registrationErrors,
                nickname: "Nickname must be at least 3 characters long",
            });
        } else {
            const { nickname, ...rest } = registrationErrors; // clear errors
            setRegistrationErrors(rest);
        }
    };

    const handleRegistrationEmail = (e) => {
        setRegistrationEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setRegistrationErrors({
                ...registrationErrors,
                email: "Please enter a valid email address",
            });
        } else {
            const { email, ...rest } = registrationErrors;
            setRegistrationErrors(rest);
        }
    };

    const handleRegistrationPassword = (e) => {
        setRegistrationPassword(e.target.value);
        if (!validatePassword(e.target.value)) {
            setRegistrationErrors({
                ...registrationErrors,
                password: "Password must be at least 7 characters long",
            });
        } else {
            const { password, ...rest } = registrationErrors;
            setRegistrationErrors(rest);
        }
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== registrationPassword) {
            setRegistrationErrors({
                ...registrationErrors,
                confirmPassword: "Passwords do not match",
            });
        } else {
            const { confirmPassword, ...rest } = registrationErrors;
            setRegistrationErrors(rest);
        }
    };

    // what would come next: code for backend communication to submit form and register a new user

    return (
        <div className="App">
            <Navbar />
            <div className="login-page">
                <div className="login-form">
                    <h2>LOG IN</h2>
                    <p className="validation-error">{loginErrors}</p>
                    <form action="/login" method="post" onSubmit={handleLogin}>
                        <div className="form-section">
                            <label htmlFor="email">EMAIL:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter Email"
                                required
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-section">
                            <label htmlFor="password">PASSWORD:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter Password"
                                required
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <a href="/login" className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>
                        <input type="submit" value="Log In" />
                    </form>
                </div>
                <div className="vertical-rule"></div>
                <div className="create-account-form" method="post">
                    <h2>CREATE ACCOUNT</h2>
                    <form action="/create-account">
                        <div className="form-section">
                            <label htmlFor="nickname">NICKNAME:</label>
                            <input
                                type="text"
                                name="nickname"
                                id="nickname"
                                placeholder="Enter Nickname"
                                required
                                onChange={handleNickname}
                            />
                            {registrationErrors.nickname && (
                                <p className="validation-error">{registrationErrors.nickname}</p>
                            )}
                        </div>
                        <div className="form-section">
                            <label htmlFor="email">EMAIL:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter Email"
                                required
                                onChange={handleRegistrationEmail}
                            />
                            {registrationErrors.email && (
                                <p className="validation-error">{registrationErrors.email}</p>
                            )}
                        </div>
                        <div className="form-section">
                            <label htmlFor="password">PASSWORD:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter Password"
                                required
                                onChange={handleRegistrationPassword}
                            />
                            {registrationErrors.password && (
                                <p className="validation-error">{registrationErrors.password}</p>
                            )}
                        </div>
                        <div className="form-section">
                            <label htmlFor="checkpassword">RE-ENTER PASSWORD:</label>
                            <input
                                type="password"
                                name="checkpassword"
                                id="checkpassword"
                                placeholder="Enter Password"
                                required
                                onChange={handleConfirmPassword}
                            />
                            {registrationErrors.confirmPassword && (
                                <p className="validation-error">
                                    {registrationErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                        <input type="submit" value="Create Account" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
