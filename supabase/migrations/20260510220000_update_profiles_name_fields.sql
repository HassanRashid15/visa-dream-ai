-- Split name into first_name and last_name fields
-- First, add the new columns
alter table public.profiles 
add column first_name text,
add column last_name text;

-- Populate the new columns by splitting the existing name
update public.profiles 
set 
  first_name = split_part(name, ' ', 1),
  last_name = case 
    when position(' ' in name) > 0 then substring(name from position(' ' in name) + 1)
    else ''
  end
where name is not null and name != '';

-- Make the new columns not nullable for future records
alter table public.profiles 
alter column first_name set not null,
alter column last_name set not null;

-- Drop the old name column
alter table public.profiles 
drop column name;

-- Update the trigger function to use first_name and last_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'firstName', split_part(new.raw_user_meta_data->>'name', ' ', 1)),
    coalesce(new.raw_user_meta_data->>'lastName', 
      case 
        when position(' ' in coalesce(new.raw_user_meta_data->>'name', '')) > 0 
        then substring(coalesce(new.raw_user_meta_data->>'name', '') from position(' ' in coalesce(new.raw_user_meta_data->>'name', '')) + 1)
        else ''
      end
    ), 
    new.email
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;
