"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import logoIcon from "../../../public/main-logo.svg"
import { useAuth } from "../../contexts/AuthContext"
import { useIsClient } from "../../hooks/useIsClient"

export default function RegisterForm() {
  const { register, loading, error, clearError, user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when field changes
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    // Clear API error when any field changes
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Password confirmation is required"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setValidationErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // Send only required fields (without confirmPassword)
        const { confirmPassword, ...registerData } = formData
        await register(registerData)
        setSuccessMessage("Registration successful!")
      } catch (err) {
        console.error("Registration error:", err)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="register-form">
      <div className="register-form__container">
        <div className="register-form__logo">
          <Link href="/">
            <Image
              src={logoIcon || "/placeholder.svg"}
              alt="Tasky Logo"
              width={60}
              height={60}
              className="register-form__logo-image"
            />
          </Link>
          <h2 className="register-form__brand">Tasky</h2>
        </div>

        <div className="register-form__header">
          <h1 className="register-form__title">Register</h1>
          <p className="register-form__subtitle">Join us! Register to get started.</p>
        </div>

        {successMessage && (
          <Alert severity="success" className="register-form__success">
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" className="register-form__error">
            {error}
          </Alert>
        )}

        <form className="register-form__form" onSubmit={handleSubmit}>
          <div className="register-form__field">
            <TextField
              fullWidth
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              variant="outlined"
              className="register-form__input"
              disabled={loading || !!successMessage}
            />
          </div>

          <div className="register-form__field">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              variant="outlined"
              className="register-form__input"
              disabled={loading || !!successMessage}
            />
          </div>

          <div className="register-form__field">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              variant="outlined"
              className="register-form__input"
              disabled={loading || !!successMessage}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end" disabled={loading || !!successMessage}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="register-form__field">
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              variant="outlined"
              className="register-form__input"
              disabled={loading || !!successMessage}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={loading || !!successMessage}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="register-form__actions">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="register-form__submit"
              disabled={loading || !!successMessage}
              sx={{
                backgroundColor: "#9836e4",
                "&:hover": {
                  backgroundColor: "#7b2bb8",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                },
                padding: "12px",
                fontSize: "16px",
                textTransform: "none",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </div>

          <div className="register-form__footer">
            <p className="register-form__login-link">
              Already have an account?{" "}
              <Link href="/login" className="register-form__link">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
