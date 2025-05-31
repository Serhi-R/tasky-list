'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import './WelcomePage.scss';

export default function WelcomePage(){
    const navigate = useNavigate();

    return (
        <div className="welcome">
            <h1 className="welcome__title">Welcome to Taskify!</h1>
            <p className="welcome__subtitle">Your personal task manager for students</p>

            <div className="welcome__buttons">
                <Button
                    variant="contained"
                    className="welcome__button welcome__button--filled"
                    onClick={() => navigate('/register')}
                >
                    Register
                </Button>

                <Button
                    variant="outlined"
                    className="welcome__button welcome__button--outlined"
                    onClick={() => navigate('/login')}
                >
                    Log In
                </Button>
            </div>
        </div>
    );
}
