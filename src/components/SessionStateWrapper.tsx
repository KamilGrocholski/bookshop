import { type Session } from 'next-auth'
import {
    signIn as _signIn,
    signOut as _signOut,
    useSession,
} from 'next-auth/react'

export type SessionStateWrapperProps = {
    Guest: (signIn: typeof handleSignIn) => React.ReactElement
    LoggedIn: (
        signOut: typeof handleSignOut,
        sessionData: Session,
    ) => React.ReactElement
}

export function handleSignOut() {
    _signOut({
        redirect: true,
    })
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
        return LoggedIn(handleSignOut, session)
    }

    return Guest(handleSignIn)
}

export default SessionStateWrapper
