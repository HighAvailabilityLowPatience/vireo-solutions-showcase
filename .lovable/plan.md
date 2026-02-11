

## Remove Auth/Admin Checks from Admin Dashboard

### Goal
Make the admin dashboard at `/admin` directly accessible without any login or role checks. The site-wide password gate stays in place.

### Changes

**File: `src/pages/Admin.tsx`**
- Remove imports: `useAuth`, `useNavigate`, `LogOut`
- Remove `useAuth()` hook call and `useNavigate()` call
- Remove the `useEffect` that redirects non-admin/non-authenticated users
- Remove the auth loading guard (`if (loading || (!isAdmin && user))`)
- Remove the sign-out button and user email display from the header
- Keep all product/video/settings management functionality as-is

**File: `src/components/Navbar.tsx`**
- Remove the `isAdmin` conditional around the Admin link so it always shows in the nav (optional but recommended so you can always navigate there)

### What stays the same
- Password gate remains -- visitors still need the access code to enter the site
- All product, video, and settings CRUD functionality unchanged
- RLS policies on the database remain (admin-level DB operations still require an authenticated admin user via Supabase -- we may need to address this separately if DB writes start failing)

### Risk note
Since RLS policies on `products`, `hero_videos`, and `site_settings` require the `admin` role for inserts/updates/deletes, removing auth from the UI means those DB operations will fail for unauthenticated visitors. If you want the dashboard to actually work without login, we would also need to relax the RLS policies -- but that opens the database to anyone. An alternative is to keep a silent auto-login or service-role edge function to proxy writes.

