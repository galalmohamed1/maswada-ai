import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import MaswadaLoader from "../ui/MaswadaLoader";


type ProtectedRouteProps = {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useAuth()
    const { locale } = useLanguage()

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <MaswadaLoader />
            </div>
        )
    }

    if (!isSignedIn) {
        return <Navigate to={`/${locale}/sign-in`} replace />
    }

    return (
        <>
            {children}
        </>
    )
}