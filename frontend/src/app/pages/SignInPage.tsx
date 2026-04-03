import { SignIn } from "@clerk/clerk-react"

export default function SignInPage() {
  return (
    <div className='flex item-center h-screen justify-center pt-17'>
      <SignIn />
    </div>
  )
}
