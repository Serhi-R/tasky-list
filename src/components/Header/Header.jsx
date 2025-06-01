'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logoIcon from '../../../public/main-logo.svg';

export default function Header() {
    const headerTxtBtns = [
        { text: 'Dashboard', path: '/' },
        { text: 'Task', path: '/task' },
        
    ];
    const loginSignupBtns = [
        { text: 'Login', path: '/sign-in' },
        { text: 'Sign Up', path: '/sign-up' },
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header__brand">
                <Link href="/" passHref legacyBehavior>
                    <a>
                        <Image
                            priority={true}
                            className="header__logo"
                            src={logoIcon}
                            alt="Logo"
                            width={55}
                            height={55}
                        />
                    </a>
                </Link>
                <h1 className="header__brand-name">
                    Tasky
                </h1>
            </div>

            <nav className="header__navigation">
                <button
                    type="button"
                    className="header__toggle"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
                <ul
                    className={`header__menu ${isMenuOpen ? 'header__menu--active' : ''}`}
                >
                    {headerTxtBtns.map(({ text, path }, index) => (
                        <li key={index} className="header__menu-item">
                            <Link href={path} className="header__menu-link">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: '120px',
                                        color: '#9000ff',
                                        border: 'none',
                                        borderRadius: '0',
                                        fontSize: '1rem',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {text}
                                </Button>
                            </Link>
                        </li>
                    ))}

                    {isMenuOpen &&
                        loginSignupBtns.map(({ text, path }, index) => (
                            <li key={index} className="header__menu-item">
                                <Link href={path} className="header__menu-link">
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            width: '120px',
                                            color: '#9000ff',
                                            border: 'none',
                                            borderRadius: '0',
                                            fontSize: '1rem',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {text}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                </ul>

                <div className="header__auth">
                    {loginSignupBtns.map(({ text, path }, index) => (
                        <div
                            key={index}
                            className={`header__auth-item ${
                                index === 0 ? 'header__auth-item--divider' : ''
                            }`}
                        >
                            <Link href={path} className="header__auth-link">
                                <Button variant="outlined">{text}</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </nav>
        </header>
    );
}
