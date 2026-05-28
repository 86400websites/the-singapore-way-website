-- Course MVP — functions rollback.

drop function if exists public.get_public_certificate(uuid);
drop function if exists public.issue_certificate(uuid);
