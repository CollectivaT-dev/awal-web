# Adding feature of Email verification

Now verification email will be sent on registration and on click of the alert banner.

## Potential Errors

<ol>
<li>Since Resend https://resend.com/ is a free tier, it has a limit of daily 100 calls and monthly 3000 calls</li>
<li>Tokens are mandatorily unique, if two same token is generated, validation will fail </li>
</ol>

## Potential improvements

<ol>
<li>Verification status is updated in the same page of verification, but not in the same useEffect hook. A side effect of infinite redering of the page is presented, to mitigate this error, a timeout function is implemented to redirect user to home page after 2 second 

```bash 
@\app\(auth)\verification\page.tsx [L60-L67]
```
</li>
</ol>


updated at 27/07/2024
