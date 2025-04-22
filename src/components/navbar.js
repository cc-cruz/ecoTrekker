import React from "react";
import "./navbar.css";

export default function Navbar() {
    return (
        <div className="heading">
            <div class="nav-wrapper-desktop">
                <div class="logo-wrapper">
                    <img src="/images/logo.png" alt="earth-cartoon" />
                    <h1>ecoTrekkers</h1>
                </div>
                <div class="nav-link-wrapper">
                    <a href="">Home</a>
                    <a href="">Resources</a>
                </div>
                <div class="login-wrapper">
                    <button>Login</button>
                </div>
            </div>
            <div class="nav-wrapper-mobile">
                <div class="logo-wrapper">
                    <h1>ecoTrekkers</h1>
                </div>
                <div class="mobile-menu-toggle">
                    <img src="/images/menu-icon.svg" alt="menu-icon" />
                </div>
                <div class="mobile-menu-wrapper active">
                    <div class="mobile-menu-toggle">
                        <img src="/images/close-icon.svg" alt="close-icon" />
                    </div>
                    <a href="">Home</a>
                    <a href="">Resources</a>
                    <button>Login</button>
                </div>
            </div>
        </div>
    );
}
