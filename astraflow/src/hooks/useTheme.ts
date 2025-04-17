import { useEffect, useState } from "react"

export function useTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme")
    return stored ? stored === "dark" : prefersDark
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return { isDark, toggleTheme: () => setIsDark((prev) => !prev) }
}
