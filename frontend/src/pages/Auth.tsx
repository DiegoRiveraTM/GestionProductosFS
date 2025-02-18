"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useAuth } from "../context/authHooks"
import { useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import Aurora from "../components/Aurora"
import BlurText from "../components/BlurText"

export const Auth = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const token = await login(email, password)
      if (token) {
        navigate("/products")
      } else {
        setError("Credenciales incorrectas. Inténtalo de nuevo.")
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError("⚠️ Error al iniciar sesión. Verifica tus credenciales.")
    }
  }

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const memoizedBlurText = useMemo(
    () => (
      <BlurText
        text="Gestión De Productos"
        animateBy="words"
        delay={100}
        direction="top"
        className="text-4xl font-bold text-center text-purple-100"
      />
    ),
    [],
  )

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] via-[#4b1167] to-[#064e3b]">
      <div className="absolute inset-0 w-full h-full">
        <Aurora colorStops={["#1a0b2e", "#4b1167", "#064e3b"]} speed={0.3} amplitude={0.8} />
      </div>

      <header className="absolute top-0 left-0 w-full p-4 flex justify-end bg-black/50 backdrop-blur-md z-20">
        <button onClick={() => navigate("/register")} className="text-white hover:text-emerald-300 transition-all">
          Registrarse
        </button>
      </header>

      <div className="absolute top-20 w-full flex justify-center z-10">{memoizedBlurText}</div>

      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl border border-purple-900/20">
          <h2 className="mb-6 text-3xl font-bold text-center text-purple-100">Iniciar Sesión</h2>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-200 rounded bg-red-900/20 border border-red-800/50">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full px-4 py-3 text-purple-100 placeholder-purple-300/40 border rounded-lg bg-purple-950/30 border-purple-800/30 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/50 focus:outline-none transition-all"
                value={email}
                onChange={handleEmailChange}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 text-purple-100 placeholder-purple-300/40 border rounded-lg bg-purple-950/30 border-purple-800/30 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/50 focus:outline-none transition-all"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white transition-all rounded-lg bg-emerald-900/80 hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-700/50 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth

