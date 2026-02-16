# Testing with Vercel Preview

Use a **preview deployment** to test changes before they go to production (birdieapp.co).

## 1. Get a preview URL

**Option A: Push a branch**

- Push any branch (e.g. `fix/login-and-chat-tab`) to GitHub.
- Vercel creates a deployment and a **Preview** URL, e.g.  
  `https://birdieai-website-xxx-team.vercel.app` or `https://birdieai-website-git-branch-team.vercel.app`.

**Option B: Open a pull request**

- Open a PR from your branch to `main`.
- Vercel comments on the PR with the **Preview** URL for that branch.

**Option C: Deploy from CLI**

```bash
npx vercel
```

- Follow prompts; you get a preview URL in the terminal.

## 2. Open the preview and test login

1. Open the **Preview** URL in your browser (from the PR, Vercel dashboard, or CLI).
2. Go to **Sign in**:  
   `https://<your-preview-url>/api/auth/signin`
3. Sign in with **email + password** using a user that exists in the DB.
4. You should be redirected to **/chat** on the same preview URL. The app uses the request host for redirects on `*.vercel.app`, so no extra config is needed.

Preview uses the **Preview** environment variables you set in Vercel (e.g. `MONGODB_URI`, `JWT_SIGNING_SECRET`). Production is unchanged.

## 3. Google sign-in on preview (optional)

To test **Continue with Google** on a preview URL:

1. In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth client → **Authorized redirect URIs**, add:
   - `https://<your-preview-url>/call/auth/google/callback`
   - Or a pattern if your preview URLs are predictable (e.g. `https://*-team.vercel.app/call/auth/google/callback` if Google supports it).
2. Save, then try “Continue with Google” on that preview URL.

## 4. Quick checklist

- [ ] Preview URL opens (e.g. from PR or Vercel dashboard).
- [ ] `/api/auth/signin` loads.
- [ ] Email/password login redirects to `/chat` on the same preview URL.
- [ ] Chat tab loads and you can send a message.
- [ ] (Optional) Google login works after adding the preview callback URL in Google Console.

## Notes

- **Cookies**: On preview, the cookie is set for that preview host only (no shared domain with production).
- **Cold start**: First request after idle may return 503 “Backend initializing”; the app retries automatically. Wait for “Signing in…” to finish or try again once.
- **Env**: Ensure **Preview** (and **Production** if needed) have `MONGODB_URI`, `JWT_SIGNING_SECRET`, and other required vars in Vercel → Project → Settings → Environment Variables.
