import React from "react";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="heading">
            <div class="nav-wrapper-desktop">
                <div class="logo-wrapper">
                    <img src="/images/logo.png" alt="earth-cartoon" />
                    <h1>ecoTrekkers</h1>
                </div>
                <div class="nav-link-wrapper">
                    <a href="/">Home</a>
                    <a href="resources">Resources</a>
                </div>
                <div class="login-wrapper">
                    <button>Login</button>
                </div>
            </div>
            <div class="nav-wrapper-mobile">
                <div class="logo-wrapper">
                    <h1>ecoTrekkers</h1>
                </div>
                <div class="mobile-menu-toggle" onClick={toggleMenu}>
                    <img src="/images/menu-icon.svg" alt="menu-icon" />
                </div>
                {isOpen && (
                    <div class="mobile-menu-wrapper">
                        <div class="mobile-menu-toggle">
                            <img
                                src="/images/close-icon.svg"
                                alt="close-icon"
                                onClick={toggleMenu}
                            />
                        </div>
                        <a href="/">Home</a>
                        <a href="/resources">Resources</a>
                        <button>Login</button>
                    </div>
                )}
            </div>
        </div>
    );
}
