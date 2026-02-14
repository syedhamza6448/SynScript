# Fix: RLS Policy Violation When Creating a Vault

## The Error

When creating a new vault, the following error appears in the browser console:

```
Error: new row violates row-level security policy for table "vaults"
```

## Root Cause

1. **RLS Policy**: The `vaults` table has a Row Level Security (RLS) policy that allows inserts only when `auth.uid() = owner_id`. This ensures users can only create vaults for themselves.

2. **Server Action Context**: When you submit the form, a Next.js Server Action runs. It uses the Supabase **server client** (which reads the session from cookies) to:
   - Verify you are logged in (`getUser()`)
   - Insert the new vault row

3. **The Problem**: In Server Action context, the Supabase server client sometimes does not pass the JWT (auth token) correctly to the Supabase backend. As a result, `auth.uid()` evaluates to `NULL` in PostgreSQL, and the RLS check `auth.uid() = owner_id` fails.

## The Fix (Step by Step)

### Step 1: Open the Vault Server Actions File

Open the file:

```
app/actions/vaults.ts
```

### Step 2: Add the Service Client Import

At the top of the file, update the import to include `createServiceClient`:

**Before:**
```typescript
import { createClient } from '@/lib/supabase/server'
```

**After:**
```typescript
import { createClient, createServiceClient } from '@/lib/supabase/server'
```

### Step 3: Replace the Insert Logic in `createVault`

Find the `createVault` function. Locate the block that:
1. Gets the user with `supabase.auth.getUser()`
2. Inserts into the `vaults` table with `supabase.from('vaults').insert(...)`

**Before:**
```typescript
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('vaults')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      owner_id: user.id,
    })
    .select('id')
    .single()
```

**After:**
```typescript
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Use service client for insert to avoid RLS issues with server action cookie context.
  // We've already verified the user; owner_id is set from authenticated user.
  const admin = createServiceClient()
  const { data, error } = await admin
    .from('vaults')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      owner_id: user.id,
    })
    .select('id')
    .single()
```

**Summary of changes:**
- Keep using `createClient()` to verify the user (this correctly reads the session from cookies).
- Use `createServiceClient()` for the actual insert. The service role client bypasses RLS.
- The insert still uses `user.id` from the verified session, so only authenticated users can create vaults, and they can only set themselves as owner.

### Step 4: Verify Your Environment Variables

Ensure `.env.local` contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The **service role key** is required for `createServiceClient()`. Find it in:
**Supabase Dashboard → Project Settings → API → `service_role` (secret)**

**Important:** Never expose the service role key to the client. It should only be used in server-side code (e.g., Server Actions, API routes).

### Step 5: Save and Test

1. Save `app/actions/vaults.ts`.
2. If the dev server is running, it will hot-reload.
3. Open the app, go to Vaults, and click **New Vault**.
4. Enter a name and click **Create**.

The vault should be created successfully.

---

## Why This Fix Is Safe

| Concern | Answer |
|--------|--------|
| Bypassing RLS | The service client bypasses RLS, but we only use it **after** verifying the user with the normal client. |
| Privilege escalation | `owner_id` is always set to `user.id` from the verified session. Users cannot create vaults for other users. |
| Unauthorized access | We return early with "Unauthorized" if `getUser()` returns no user. |

---

## Alternative: Fix the Server Client Session (Advanced)

If you prefer to keep using the regular client for inserts, you can try fixing the cookie/session handling:

1. **Ensure cookies are forwarded**: In Next.js 14+, Server Actions should forward cookies by default. Verify your middleware and layout do not block or strip cookies.

2. **Use `getSession()` before insert**: Some setups require calling `await supabase.auth.getSession()` before making data requests to ensure the session is refreshed.

3. **Async cookies (Next.js 15+)**: If using Next.js 15, `cookies()` is async. Update `lib/supabase/server.ts`:
   ```typescript
   const cookieStore = await cookies()
   ```

The service client approach above is the most reliable for Server Actions and is a common pattern in production.
