import { useNavigate } from 'react-router-dom'
import { useLanguage } from './useLanguage'

/**
 * Custom hook that provides locale-aware navigation functions
 */
export function useLocaleNavigate() {
  const navigate = useNavigate()
  const { locale } = useLanguage()

  const localeNavigate = (
    path: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: { replace?: boolean; state?: any }
  ) => {
    if (typeof path === "number") {
      navigate(path)
      return
    }

    const cleanPath = path.startsWith("/") ? path.slice(1) : path

    const localizedPath =
      cleanPath.length > 0 ? `/${locale}/${cleanPath}` : `/${locale}`

    navigate(localizedPath, options)
  }

  const getLocalePath = (path: string) => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path

    return cleanPath.length > 0
      ? `/${locale}/${cleanPath}`
      : `/${locale}`
  }

  return { localeNavigate, getLocalePath, navigate }
}