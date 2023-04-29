import {
    signIn as _signIn,
    signOut as _signOut,
    useSession,
} from 'next-auth/react'

export type SessionStateWrapperProps = {
    Guest: (signIn: typeof handleSignIn) => React.ReactElement
    LoggedIn: (signOut: typeof _signOut) => React.ReactElement
}

export function handleSignIn() {
    _signIn('google')
}

const SessionStateWrapper: React.FC<SessionStateWrapperProps> = ({
    Guest,
    LoggedIn,
}) => {
    const { data: session } = useSession()

    if (session?.user) {
        return LoggedIn(_signOut)
    }

    return Guest(handleSignIn)
}

export default SessionStateWrapper
