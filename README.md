# De Todo Un Poco

## Variables necesarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `ADMIN_SESSION_SECRET`

El login admin usa **Supabase Auth** + la tabla `public.profiles`.

## Panel admin

- URL: `/admin`
- Login: `/admin/login`
- Desde el panel podés crear/editar/eliminar categorías, productos e imágenes por URL.
- El catálogo público toma sus datos desde Supabase.

## Base de datos

Ejecutá `supabase-schema.sql` en el SQL Editor de Supabase para crear las tablas y políticas base.

---

# detodounpocoV2
de todo un poco version 2


## Admin con Supabase Auth

Ver `SUPABASE_ADMIN_AUTH_SETUP.md`.
