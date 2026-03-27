# Admin con Supabase Auth

## 1. Ejecutar `supabase-schema.sql`
Esto crea la tabla `profiles` y el trigger que genera un perfil automáticamente cuando se crea un usuario en Supabase Auth.

## 2. Crear el usuario en Supabase Auth
En Supabase:
- Authentication -> Users -> Add user
- Crear el usuario con email y contraseña

## 3. Convertirlo en admin
Ejecutar en SQL Editor:

```sql
update public.profiles
set role = 'admin', is_active = true
where email = 'admin@tuempresa.com';
```

## 4. Variables necesarias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SESSION_SECRET`

## 5. Flujo
- El admin inicia sesión con email y contraseña de Supabase Auth.
- La app valida el usuario en Supabase Auth.
- Luego consulta `public.profiles`.
- Sólo entra si `role = 'admin'` e `is_active = true`.
