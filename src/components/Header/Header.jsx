"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Button from "@mui/material/Button"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import logoIcon from "../../../public/main-logo.svg"
import { useAuth } from "../../contexts/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Task", path: "/task" },
  ]

  // Navigation items for non-authenticated users
  const publicNavItems = [{ text: "Home", path: "/" }]

  const authButtons = user
    ? [{ text: "Logout", action: logout }]
    : [
        { text: "Login", path: "/login" },
        { text: "Register", path: "/register" },
      ]

  const navItems = user ? authenticatedNavItems : publicNavItems

  return (
    <header className="header">
      <div className="header__brand">
        <Link href="/" passHref legacyBehavior>
          <a>
            <Image
              priority={true}
              className="header__logo"
              src={logoIcon || "/placeholder.svg"}
              alt="Logo"
              width={55}
              height={55}
            />
          </a>
        </Link>
        <h1 className="header__brand-name">Tasky</h1>
      </div>

      <nav className="header__navigation">
        <button
          type="button"
          className="header__toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <ul className={`header__menu ${isMenuOpen ? "header__menu--active" : ""}`}>
          {navItems.map(({ text, path }, index) => (
            <li key={index} className="header__menu-item">
              <Link href={path} className="header__menu-link">
                <Button
                  variant="outlined"
                  sx={{
                    width: "120px",
                    color: "#9000ff",
                    border: "none",
                    borderRadius: "0",
                    fontSize: "1rem",
                    textTransform: "capitalize",
                  }}
                >
                  {text}
                </Button>
              </Link>
            </li>
          ))}

          {/* Show auth buttons in mobile menu */}
          {isMenuOpen &&
            authButtons.map((button, index) => (
              <li key={index} className="header__menu-item">
                {button.path ? (
                  <Link href={button.path} className="header__menu-link">
                    <Button
                      variant="outlined"
                      sx={{
                        width: "120px",
                        color: "#9000ff",
                        border: "none",
                        borderRadius: "0",
                        fontSize: "1rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {button.text}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={button.action}
                    sx={{
                      width: "120px",
                      color: "#9000ff",
                      border: "none",
                      borderRadius: "0",
                      fontSize: "1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {button.text}
                  </Button>
                )}
              </li>
            ))}
        </ul>

        {/* Desktop auth buttons */}
        <div className="header__auth">
          {authButtons.map((button, index) => (
            <div
              key={index}
              className={`header__auth-item ${
                index === 0 && authButtons.length > 1 ? "header__auth-item--divider" : ""
              }`}
            >
              {button.path ? (
                <Link href={button.path} className="header__auth-link">
                  <Button variant="outlined">{button.text}</Button>
                </Link>
              ) : (
                <Button variant="outlined" onClick={button.action} className="header__auth-link">
                  {button.text}
                </Button>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  )
}
