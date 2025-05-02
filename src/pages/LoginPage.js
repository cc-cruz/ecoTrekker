import * as React from "react";
import Navbar from "../components/navbar.js";
import "./login.css";

function LoginPage() {
    return (
        <div className="App">
            <Navbar />
            <div className="login-page">
                <div className="login-form">
                    <h2>LOG IN</h2>
                    <form action="/login" method="post">
                        <div className="form-section">
                            <label htmlFor="email">EMAIL:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter Email"
                                required
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
                            />
                        </div>
                        <div className="form-section">
                            <label htmlFor="email">EMAIL:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter Email"
                                required
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
                            />
                        </div>
                        <div className="form-section">
                            <label htmlFor="checkpassword">RE-ENTER PASSWORD:</label>
                            <input
                                type="password"
                                name="checkpassword"
                                id="checkpassword"
                                placeholder="Enter Password"
                                required
                            />
                        </div>
                        <input type="submit" value="Create Account" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
