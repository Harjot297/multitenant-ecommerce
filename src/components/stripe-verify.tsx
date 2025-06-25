import {Button ,  Link } from "@payloadcms/ui"


export const StripeVerify = () => {
    return (
        <Link href={"/stripe-verify"} >
            <Button >Verify Account</Button>
        </Link>
    )
}

export const BackWebsite = () => {
    return (
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/`}>
            <Button >Back to home</Button>
        </Link>
    )
}