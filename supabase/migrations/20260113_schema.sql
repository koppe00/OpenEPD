--
-- PostgreSQL database dump
--

\restrict 7syd7dAvcNTkMnxIInCp3xuy1nkvbE7q981RdngldlTOJQW9tulBef51aMkFGgF

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'Multi-context user management system v006 - Migratie voltooid';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'md_specialist',
    'nurse',
    'assistant',
    'patient'
);


--
-- Name: workflow_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.workflow_mode AS ENUM (
    'spreekuur',
    'kliniek',
    'spoed',
    'afdeling'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- Name: auto_assign_user_work_contexts(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_assign_user_work_contexts() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  poli_context_id UUID;
  default_contexts UUID[];
  context_id UUID;
  profile_id UUID;
BEGIN
  -- Find the corresponding profile.id for this user.id
  SELECT id INTO profile_id FROM profiles WHERE id = NEW.id;
  
  -- Skip if no profile exists yet (profile might be created after user)
  IF profile_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get POLI context ID (most common default)
  SELECT id INTO poli_context_id 
  FROM work_contexts 
  WHERE code = 'POLI' AND is_active = true 
  LIMIT 1;

  -- Get all active location-type work contexts
  SELECT ARRAY_AGG(id) INTO default_contexts
  FROM work_contexts
  WHERE is_active = true 
    AND context_type = 'location'
    AND code IN ('POLI', 'KLINIEK', 'SEH', 'IC', 'OK', 'DAGBEHANDELING');

  -- Insert user_work_contexts for each default context (using profile.id)
  IF default_contexts IS NOT NULL THEN
    FOREACH context_id IN ARRAY default_contexts
    LOOP
      INSERT INTO user_work_contexts (user_id, work_context_id)
      VALUES (profile_id, context_id)
      ON CONFLICT (user_id, work_context_id) DO NOTHING;
    END LOOP;
  END IF;

  -- Set active work context in user_active_contexts table (using users.id)
  IF poli_context_id IS NOT NULL THEN
    INSERT INTO user_active_contexts (user_id, active_work_context_id)
    VALUES (NEW.id, poli_context_id)
    ON CONFLICT (user_id) DO UPDATE 
      SET active_work_context_id = poli_context_id,
          last_updated = NOW();
  END IF;

  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION auto_assign_user_work_contexts(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.auto_assign_user_work_contexts() IS 'Automatically assigns default work contexts (POLI, KLINIEK, SEH, IC, OK, DAGBEHANDELING) to newly created users. user_work_contexts uses profile.id, user_active_contexts uses users.id';


--
-- Name: get_resolved_widgets(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_resolved_widgets(p_template_id uuid) RETURNS TABLE(instance_id uuid, widget_name text, component_key text, engine_type text, region text, sort_order integer, configuration jsonb, source_template_name text, display_title text)
    LANGUAGE sql
    SET search_path TO 'public', 'pg_temp'
    AS $$
    WITH RECURSIVE template_tree AS (
        SELECT id, parent_template_id, name, 0 as level
        FROM public.ui_templates
        WHERE id = p_template_id
        
        UNION ALL
        
        SELECT t.id, t.parent_template_id, t.name, tt.level + 1
        FROM public.ui_templates t
        INNER JOIN template_tree tt ON t.id = tt.parent_template_id
    )
    SELECT 
        wi.id as instance_id,
        wd.name as widget_name,
        wd.component_key,
        wd.engine_type,
        wi.region,
        wi.sort_order,
        wi.configuration,
        tt.name as source_template_name,
        wi.display_title -- <--- Nu wordt hij correct gevuld
    FROM template_tree tt
    JOIN public.ui_widget_instances wi ON wi.template_id = tt.id
    JOIN public.widget_definitions wd ON wi.widget_definition_id = wd.id
    ORDER BY wi.region, wi.sort_order;
$$;


--
-- Name: get_user_available_contexts(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_available_contexts(p_user_id uuid) RETURNS json
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'organizations', (
      SELECT json_agg(json_build_object(
        'id', o.id,
        'name', o.name,
        'is_primary', uo.is_primary
      ))
      FROM public.user_organizations uo
      JOIN public.organizations o ON o.id = uo.organization_id
      WHERE uo.user_id = p_user_id
        AND (uo.valid_until IS NULL OR uo.valid_until >= CURRENT_DATE)
    ),
    'roles', (
      SELECT json_agg(json_build_object(
        'id', r.id,
        'code', r.role_key,
        'name', r.display_name,
        'is_primary', ur.is_primary
      ))
      FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = p_user_id
        AND (ur.valid_until IS NULL OR ur.valid_until >= CURRENT_DATE)
    ),
    'specialisms', (
      SELECT json_agg(json_build_object(
        'id', s.id,
        'code', s.code,
        'name', s.display_name,
        'is_primary', us.is_primary
      ))
      FROM public.user_specialisms us
      JOIN public.specialisms s ON s.id = us.specialism_id
      WHERE us.user_id = p_user_id
        AND (us.valid_until IS NULL OR us.valid_until >= CURRENT_DATE)
    ),
    'groups', (
      SELECT json_agg(json_build_object(
        'id', g.id,
        'code', g.code,
        'name', g.display_name,
        'role', ug.role_in_group,
        'is_primary', ug.is_primary
      ))
      FROM public.user_groups ug
      JOIN public.groups g ON g.id = ug.group_id
      WHERE ug.user_id = p_user_id
        AND (ug.valid_until IS NULL OR ug.valid_until >= CURRENT_DATE)
    ),
    'work_contexts', (
      SELECT json_agg(json_build_object(
        'id', wc.id,
        'code', wc.code,
        'name', wc.display_name,
        'type', wc.context_type,
        'is_primary', uwc.is_primary
      ))
      FROM public.user_work_contexts uwc
      JOIN public.work_contexts wc ON wc.id = uwc.work_context_id
      WHERE uwc.user_id = p_user_id
        AND (uwc.valid_until IS NULL OR uwc.valid_until >= CURRENT_DATE)
    )
  ) INTO result;
  
  RETURN result;
END;
$$;


--
-- Name: FUNCTION get_user_available_contexts(p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_user_available_contexts(p_user_id uuid) IS 'Haal alle beschikbare contexten voor een gebruiker (voor context selectie modal)';


--
-- Name: get_user_context(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_context(p_user_id uuid) RETURNS TABLE(user_id uuid, organization_id uuid, organization_name text, role_id uuid, role_code text, specialism_id uuid, specialism_code character varying, group_id uuid, group_code character varying, work_context_id uuid, work_context_code character varying)
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uac.user_id,
    uac.active_organization_id AS organization_id,
    o.name AS organization_name,
    uac.active_role_id AS role_id,
    r.role_key AS role_code,
    uac.active_specialism_id AS specialism_id,
    s.code AS specialism_code,
    uac.active_group_id AS group_id,
    g.code AS group_code,
    uac.active_work_context_id AS work_context_id,
    wc.code AS work_context_code
  FROM public.user_active_contexts uac
  LEFT JOIN public.organizations o ON o.id = uac.active_organization_id
  LEFT JOIN public.roles r ON r.id = uac.active_role_id
  LEFT JOIN public.specialisms s ON s.id = uac.active_specialism_id
  LEFT JOIN public.groups g ON g.id = uac.active_group_id
  LEFT JOIN public.work_contexts wc ON wc.id = uac.active_work_context_id
  WHERE uac.user_id = p_user_id;
END;
$$;


--
-- Name: get_user_templates(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_templates(p_user_id uuid) RETURNS TABLE(template_id uuid, template_name text, template_description text, work_context_code text, work_context_name text, theme_config jsonb, icon_name text, specialty_code text, specialty_name text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_active_work_context UUID;
  v_active_specialism UUID;
  v_user_roles UUID[];
BEGIN
  -- Get user's active context
  SELECT 
    active_work_context_id,
    active_specialism_id
  INTO 
    v_active_work_context,
    v_active_specialism
  FROM user_active_contexts
  WHERE user_id = p_user_id;

  -- Get user's roles
  SELECT array_agg(role_id)
  INTO v_user_roles
  FROM user_roles
  WHERE user_id = p_user_id;

  -- Return templates filtered by active context and permissions
  RETURN QUERY
  SELECT 
    te.id,
    te.name,
    NULL::TEXT as description,
    te.work_context_code::TEXT,
    te.work_context_name::TEXT,
    te.theme_config,
    te.icon_name::TEXT,
    te.specialty_code::TEXT,
    te.specialty_name::TEXT
  FROM ui_templates_enriched te
  WHERE 
    -- Match work context
    te.work_context_id = v_active_work_context
    -- Match specialty (if specified, otherwise show all)
    AND (te.specialty_id IS NULL OR te.specialty_id = v_active_specialism)
    -- Check role permissions (if specified, otherwise show all)
    AND (
      te.allowed_roles IS NULL 
      OR te.allowed_roles = '{}' 
      OR te.allowed_roles && v_user_roles
    )
  ORDER BY te.name;
END;
$$;


--
-- Name: FUNCTION get_user_templates(p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_user_templates(p_user_id uuid) IS 'Returns available templates for user based on active work_context and specialty';


--
-- Name: is_template_available_for_context(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_template_available_for_context(p_template_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_template RECORD;
  v_user_context RECORD;
  v_matches_role BOOLEAN := false;
  v_matches_specialism BOOLEAN := false;
  v_matches_org BOOLEAN := false;
  v_matches_group BOOLEAN := false;
  v_matches_work_context BOOLEAN := false;
BEGIN
  -- Get template restrictions
  SELECT * INTO v_template
  FROM ui_templates
  WHERE id = p_template_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Get user's active context
  SELECT * INTO v_user_context
  FROM user_active_contexts
  WHERE user_id = p_user_id;
  
  -- If template has no restrictions, it's available to everyone
  IF (v_template.allowed_roles IS NULL OR array_length(v_template.allowed_roles, 1) IS NULL)
    AND (v_template.allowed_specialisms IS NULL OR array_length(v_template.allowed_specialisms, 1) IS NULL)
    AND (v_template.allowed_organizations IS NULL OR array_length(v_template.allowed_organizations, 1) IS NULL)
    AND (v_template.allowed_groups IS NULL OR array_length(v_template.allowed_groups, 1) IS NULL)
    AND (v_template.allowed_work_contexts IS NULL OR array_length(v_template.allowed_work_contexts, 1) IS NULL)
  THEN
    RETURN true;
  END IF;
  
  -- Check each context type
  -- Role
  IF array_length(v_template.allowed_roles, 1) IS NULL OR array_length(v_template.allowed_roles, 1) = 0 THEN
    v_matches_role := true; -- No restriction
  ELSIF v_user_context.active_role_id = ANY(v_template.allowed_roles) THEN
    v_matches_role := true;
  END IF;
  
  -- Specialism
  IF array_length(v_template.allowed_specialisms, 1) IS NULL OR array_length(v_template.allowed_specialisms, 1) = 0 THEN
    v_matches_specialism := true;
  ELSIF v_user_context.active_specialism_id = ANY(v_template.allowed_specialisms) THEN
    v_matches_specialism := true;
  END IF;
  
  -- Organization
  IF array_length(v_template.allowed_organizations, 1) IS NULL OR array_length(v_template.allowed_organizations, 1) = 0 THEN
    v_matches_org := true;
  ELSIF v_user_context.active_organization_id = ANY(v_template.allowed_organizations) THEN
    v_matches_org := true;
  END IF;
  
  -- Group
  IF array_length(v_template.allowed_groups, 1) IS NULL OR array_length(v_template.allowed_groups, 1) = 0 THEN
    v_matches_group := true;
  ELSIF v_user_context.active_group_id = ANY(v_template.allowed_groups) THEN
    v_matches_group := true;
  END IF;
  
  -- Work Context
  IF array_length(v_template.allowed_work_contexts, 1) IS NULL OR array_length(v_template.allowed_work_contexts, 1) = 0 THEN
    v_matches_work_context := true;
  ELSIF v_user_context.active_work_context_id = ANY(v_template.allowed_work_contexts) THEN
    v_matches_work_context := true;
  END IF;
  
  -- Apply logic: require_all_contexts determines AND vs OR
  IF v_template.require_all_contexts THEN
    -- Must match ALL contexts that have restrictions
    RETURN v_matches_role AND v_matches_specialism AND v_matches_org AND v_matches_group AND v_matches_work_context;
  ELSE
    -- Must match AT LEAST ONE context (OR logic)
    RETURN v_matches_role OR v_matches_specialism OR v_matches_org OR v_matches_group OR v_matches_work_context;
  END IF;
END;
$$;


--
-- Name: FUNCTION is_template_available_for_context(p_template_id uuid, p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_template_available_for_context(p_template_id uuid, p_user_id uuid) IS 'Checks if a UI template is available for the user based on their active context';


--
-- Name: register_new_patient(text, text, text, date, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.register_new_patient(p_initials text, p_lastname text, p_bsn text, p_birth_date date, p_gender text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_patient_id UUID;
BEGIN
  -- 1. Maak het profiel aan in de 'profiles' tabel
  INSERT INTO public.profiles (
    initials, 
    last_name, 
    full_name, 
    bsn, 
    birth_date, 
    gender, 
    role
  ) VALUES (
    p_initials, 
    p_lastname, 
    p_initials || ' ' || p_lastname, 
    p_bsn, 
    p_birth_date, 
    p_gender, 
    'patient'
  ) RETURNING id INTO v_patient_id;

  -- 2. Optioneel: Maak een logistiek event aan (Patiënt is nu in het systeem)
  -- Dit kan later gekoppeld worden aan een afspraak

  RETURN v_patient_id;
END;
$$;


--
-- Name: resolve_ai_config(text, uuid, uuid[], text, text, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.resolve_ai_config(p_feature_id text, p_user_id uuid DEFAULT NULL::uuid, p_group_ids uuid[] DEFAULT NULL::uuid[], p_role text DEFAULT NULL::text, p_specialisme text DEFAULT NULL::text, p_werkcontext text DEFAULT NULL::text, p_organization_id uuid DEFAULT NULL::uuid) RETURNS TABLE(assignment_id uuid, scope_type text, scope_value text, config jsonb, priority integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  WITH potential_scopes AS (
    -- Collect all relevant scopes based on context
    SELECT 
      s.id as scope_id,
      s.scope_type,
      s.scope_value,
      s.priority
    FROM public.ai_config_scopes s
    WHERE 
      s.scope_type = 'global'
      OR (s.scope_type = 'user' AND s.scope_value = p_user_id::text)
      OR (s.scope_type = 'group' AND p_group_ids IS NOT NULL AND s.scope_value = ANY(p_group_ids::text[]))
      OR (s.scope_type = 'role' AND s.scope_value = p_role)
      OR (s.scope_type = 'specialisme' AND s.scope_value = p_specialisme)
      OR (s.scope_type = 'werkcontext' AND s.scope_value = p_werkcontext)
      OR (s.scope_type = 'organization' AND s.scope_value = p_organization_id::text)
  )
  SELECT 
    a.id as assignment_id,
    ps.scope_type,
    ps.scope_value,
    a.config,
    ps.priority
  FROM public.ai_config_assignments a
  INNER JOIN potential_scopes ps ON a.scope_id = ps.scope_id
  WHERE 
    a.feature_id = p_feature_id
    AND a.is_active = true
    AND (a.valid_from IS NULL OR a.valid_from <= NOW())
    AND (a.valid_until IS NULL OR a.valid_until >= NOW())
  ORDER BY ps.priority ASC
  LIMIT 1;
END;
$$;


--
-- Name: FUNCTION resolve_ai_config(p_feature_id text, p_user_id uuid, p_group_ids uuid[], p_role text, p_specialisme text, p_werkcontext text, p_organization_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.resolve_ai_config(p_feature_id text, p_user_id uuid, p_group_ids uuid[], p_role text, p_specialisme text, p_werkcontext text, p_organization_id uuid) IS 'Resolve active AI configuration for given feature and context with priority-based scope matching';


--
-- Name: resolve_dashboard_template(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.resolve_dashboard_template(p_org_id uuid, p_specialty_code text, p_care_setting text) RETURNS TABLE(template_id uuid, template_name text, match_score integer)
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id, 
        t.name,
        -- Bereken een score voor hoe specifiek de match is
        (
            CASE WHEN c.organization_id = p_org_id THEN 4 ELSE 0 END +
            CASE WHEN c.specialty_code = p_specialty_code THEN 2 ELSE 0 END
        )::INTEGER as score
    FROM public.ui_templates t
    JOIN public.ui_contexts c ON t.context_id = c.id
    WHERE 
        c.care_setting = p_care_setting
        AND (c.organization_id IS NULL OR c.organization_id = p_org_id)
        AND (c.specialty_code IS NULL OR c.specialty_code = p_specialty_code)
        AND t.is_active = true
    ORDER BY score DESC
    LIMIT 1;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: admin_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_permissions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    role public.user_role NOT NULL,
    module_key text NOT NULL,
    can_read boolean DEFAULT true,
    can_write boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ai_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_config (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    model_provider text NOT NULL,
    model_version text NOT NULL,
    system_prompt text NOT NULL,
    pii_scrubbing_enabled boolean DEFAULT true,
    is_active boolean DEFAULT true
);


--
-- Name: ai_config_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_config_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_id text NOT NULL,
    scope_id uuid NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    override_mode text DEFAULT 'merge'::text,
    valid_from timestamp with time zone DEFAULT now(),
    valid_until timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    notes text,
    CONSTRAINT ai_config_assignments_override_mode_check CHECK ((override_mode = ANY (ARRAY['merge'::text, 'replace'::text])))
);


--
-- Name: TABLE ai_config_assignments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_config_assignments IS 'Configuration assignments to specific scopes';


--
-- Name: ai_config_scopes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_config_scopes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    scope_type text NOT NULL,
    scope_value text NOT NULL,
    scope_label text,
    priority integer DEFAULT 50 NOT NULL,
    parent_scope_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    specialism_id uuid,
    group_id uuid,
    work_context_id uuid,
    organization_id uuid,
    role_id uuid,
    CONSTRAINT ai_config_scopes_scope_type_check CHECK ((scope_type = ANY (ARRAY['user'::text, 'group'::text, 'role'::text, 'specialisme'::text, 'werkcontext'::text, 'organization'::text, 'global'::text])))
);


--
-- Name: TABLE ai_config_scopes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_config_scopes IS 'Hierarchical configuration scopes (user > group > role > specialisme > werkcontext > org > global)';


--
-- Name: COLUMN ai_config_scopes.scope_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ai_config_scopes.scope_type IS 'Type of scope: "base" for specialty-level, "context_variant" for work_context-specific overrides';


--
-- Name: COLUMN ai_config_scopes.work_context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ai_config_scopes.work_context_id IS 'Optional: If set, this config overrides the base specialty config for specific work context';


--
-- Name: ai_config_usage_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_config_usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_id text NOT NULL,
    user_id uuid,
    assignment_id uuid,
    resolved_config jsonb,
    execution_time_ms integer,
    tokens_used integer,
    success boolean,
    error_message text,
    logged_at timestamp with time zone DEFAULT now(),
    session_id text,
    request_metadata jsonb
);


--
-- Name: TABLE ai_config_usage_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_config_usage_logs IS 'AI feature usage tracking for analytics and billing';


--
-- Name: ai_extractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_extractions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    transcript text NOT NULL,
    extraction jsonb NOT NULL,
    metadata jsonb,
    source text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ai_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_id text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    config_schema jsonb NOT NULL,
    default_config jsonb DEFAULT '{}'::jsonb NOT NULL,
    version text DEFAULT '1.0.0'::text,
    requires_license jsonb DEFAULT '[]'::jsonb,
    capabilities jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    is_beta boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    CONSTRAINT valid_feature_id CHECK ((feature_id ~ '^[a-z0-9_]+$'::text))
);


--
-- Name: TABLE ai_features; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_features IS 'AI feature definitions with schemas and defaults';


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    appointment_type text,
    resource_id uuid,
    status text DEFAULT 'planned'::text,
    checkin_time timestamp with time zone,
    waiting_room_location text
);


--
-- Name: billing_codes_dbc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_codes_dbc (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trajectory_id uuid NOT NULL,
    dbc_code text NOT NULL,
    icd10_main_diagnosis text,
    opened_at date NOT NULL
);


--
-- Name: billing_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    icd10 text[] DEFAULT ARRAY[]::text[],
    procedures text[] DEFAULT ARRAY[]::text[],
    dbc_code text,
    care_type text,
    source text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: care_relationships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.care_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_user_id uuid NOT NULL,
    caregiver_user_id uuid,
    organization_id uuid,
    role_code text NOT NULL,
    relationship_level text DEFAULT 'individual'::text,
    is_main_practitioner boolean DEFAULT false,
    consent_source text DEFAULT 'local'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT target_exists CHECK (((caregiver_user_id IS NOT NULL) OR (organization_id IS NOT NULL)))
);


--
-- Name: care_role_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.care_role_definitions (
    role_code text NOT NULL,
    display_name text NOT NULL,
    access_level text NOT NULL,
    CONSTRAINT care_role_definitions_access_level_check CHECK ((access_level = ANY (ARRAY['full_medical'::text, 'read_only_medical'::text, 'administrative'::text, 'social'::text])))
);


--
-- Name: care_trajectories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.care_trajectories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_user_id uuid NOT NULL,
    episode_id uuid,
    title text NOT NULL,
    status text DEFAULT 'open'::text
);


--
-- Name: clinical_protocols; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinical_protocols (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    specialty text NOT NULL,
    description text,
    version text DEFAULT '1.0'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: dashboard_layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_layouts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    role_key public.user_role NOT NULL,
    specialty text,
    workflow_mode public.workflow_mode NOT NULL,
    layout_json jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    theme_config jsonb DEFAULT '{"density": "comfortable", "show_icons": true}'::jsonb,
    CONSTRAINT check_density_value CHECK (((theme_config ->> 'density'::text) = ANY (ARRAY['comfortable'::text, 'compact'::text])))
);


--
-- Name: doc_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doc_sections (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    template_id uuid,
    section_key text NOT NULL,
    label text NOT NULL,
    placeholder_text text,
    target_zib_ref text,
    min_height_class text DEFAULT 'h-24'::text,
    sort_order integer NOT NULL
);


--
-- Name: doc_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doc_templates (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    specialty text,
    workflow_mode public.workflow_mode NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    display_name character varying(200) NOT NULL,
    description text,
    group_type character varying(50) DEFAULT 'team'::character varying,
    parent_group_id uuid,
    organization_id uuid,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.groups IS 'Teams, diensten, werkgroepen en projecten';


--
-- Name: COLUMN groups.group_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.groups.group_type IS 'Type groep: team, dienst, project, commissie';


--
-- Name: COLUMN groups.parent_group_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.groups.parent_group_id IS 'Voor hiërarchische groepen (sub-teams)';


--
-- Name: medical_episodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_episodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_user_id uuid NOT NULL,
    name text NOT NULL,
    icpc_code text,
    start_date date NOT NULL,
    status text DEFAULT 'active'::text
);


--
-- Name: nen7513_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nen7513_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_user_id uuid,
    patient_user_id uuid,
    action text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT timezone('utc'::text, now())
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    org_type text NOT NULL,
    parent_id uuid,
    agb_code text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    uzi_number text,
    bsn_number text,
    wid_status text DEFAULT 'unverified'::text,
    date_of_birth date,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    specialty text,
    big_registration_number text,
    avatar_url text,
    app_role public.user_role DEFAULT 'md_specialist'::public.user_role,
    first_name text,
    last_name text,
    gender text,
    phone text,
    address_street text,
    address_house_number text,
    address_zipcode text,
    address_city text,
    is_patient boolean DEFAULT false,
    email text,
    initials text,
    name_prefix text,
    nickname text,
    name_use text DEFAULT 'official'::text,
    administrative_gender text,
    gender_identity text,
    nationality text,
    preferred_language text DEFAULT 'nl-NL'::text,
    marital_status text,
    multiple_birth_indicator boolean DEFAULT false,
    contact_preference text,
    insurance_data jsonb DEFAULT '[]'::jsonb,
    emergency_contacts jsonb DEFAULT '[]'::jsonb,
    consents jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true
);


--
-- Name: protocol_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_actions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    protocol_id uuid,
    label text NOT NULL,
    action_type text NOT NULL,
    action_payload jsonb NOT NULL,
    ui_color_class text,
    sort_order integer DEFAULT 0
);


--
-- Name: protocol_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_rules (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    protocol_id uuid,
    logic_type text NOT NULL,
    condition_json jsonb NOT NULL,
    alert_message text,
    alert_level text DEFAULT 'info'::text,
    CONSTRAINT protocol_rules_logic_type_check CHECK ((logic_type = ANY (ARRAY['AND'::text, 'OR'::text])))
);


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    received_at timestamp with time zone DEFAULT now(),
    source_name text NOT NULL,
    patient_bsn text,
    patient_initials text,
    patient_lastname text,
    reason text,
    status text DEFAULT 'received'::text,
    priority text DEFAULT 'normal'::text
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_key text NOT NULL,
    display_name text NOT NULL,
    description text,
    is_system_role boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: specialisms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialisms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    display_name character varying(200) NOT NULL,
    description text,
    agb_code character varying(10),
    dhd_code character varying(10),
    nictiz_code character varying(10),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE specialisms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.specialisms IS 'Master tabel voor medische specialismen met officiële NL codes (AGB, DHD, Nictiz)';


--
-- Name: COLUMN specialisms.code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.specialisms.code IS 'Interne unieke code (bijv. CARDIO, NEURO)';


--
-- Name: COLUMN specialisms.agb_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.specialisms.agb_code IS 'AGB Specialismecode (COD016) - voor identificatie en facturatie';


--
-- Name: COLUMN specialisms.dhd_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.specialisms.dhd_code IS 'DHD Specialismecode - voor ziekenhuisregistratie en DBC';


--
-- Name: COLUMN specialisms.nictiz_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.specialisms.nictiz_code IS 'Nictiz SpecialismeAGBCodelijst - voor ZIB informatieuitwisseling';


--
-- Name: COLUMN specialisms.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.specialisms.display_order IS 'Sorteer volgorde in UI';


--
-- Name: storage_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.storage_providers (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    adapter_type text NOT NULL,
    base_url text,
    requires_auth boolean DEFAULT true,
    is_active boolean DEFAULT true
);


--
-- Name: system_config_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_config_logs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    target_resource text,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ui_contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ui_contexts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    organization_id uuid,
    specialty_code text,
    care_setting text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    deprecated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE ui_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ui_contexts IS 'DEPRECATED: Use work_contexts + specialty_id on ui_templates instead. Kept for backwards compatibility only.';


--
-- Name: ui_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ui_templates (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    context_id uuid,
    name text NOT NULL,
    parent_template_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    allowed_roles uuid[] DEFAULT '{}'::uuid[],
    allowed_specialisms uuid[] DEFAULT '{}'::uuid[],
    allowed_organizations uuid[] DEFAULT '{}'::uuid[],
    allowed_groups uuid[] DEFAULT '{}'::uuid[],
    allowed_work_contexts uuid[] DEFAULT '{}'::uuid[],
    require_all_contexts boolean DEFAULT false,
    work_context_id uuid NOT NULL,
    specialty_id uuid
);


--
-- Name: COLUMN ui_templates.allowed_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.allowed_roles IS 'Array of role IDs that can use this template. Empty = all roles';


--
-- Name: COLUMN ui_templates.allowed_specialisms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.allowed_specialisms IS 'Array of specialism IDs that can use this template. Empty = all specialisms';


--
-- Name: COLUMN ui_templates.allowed_organizations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.allowed_organizations IS 'Array of organization IDs that can use this template. Empty = all organizations';


--
-- Name: COLUMN ui_templates.allowed_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.allowed_groups IS 'Array of group IDs that can use this template. Empty = all groups';


--
-- Name: COLUMN ui_templates.allowed_work_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.allowed_work_contexts IS 'Array of work context IDs that can use this template. Empty = all work contexts';


--
-- Name: COLUMN ui_templates.require_all_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ui_templates.require_all_contexts IS 'If true, user must match ALL specified contexts. If false, matching ANY context is sufficient';


--
-- Name: work_contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_contexts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    display_name character varying(200) NOT NULL,
    description text,
    context_type character varying(50) DEFAULT 'location'::character varying,
    organization_id uuid,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    theme_config jsonb DEFAULT '{"accent": "#475569", "primary": "#64748b", "secondary": "#f1f5f9"}'::jsonb,
    icon_name character varying(50) DEFAULT 'Building2'::character varying,
    care_setting_legacy character varying(20),
    requires_patient boolean DEFAULT true,
    config_metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: TABLE work_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.work_contexts IS 'Werklocaties, afdelingen, diensten (Polikliniek, SEH, etc.)';


--
-- Name: COLUMN work_contexts.context_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_contexts.context_type IS 'Type context: location, department, shift, ward';


--
-- Name: ui_templates_enriched; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.ui_templates_enriched WITH (security_barrier='true') AS
 SELECT t.id,
    t.context_id,
    t.name,
    t.parent_template_id,
    t.is_active,
    t.created_at,
    t.allowed_roles,
    t.allowed_specialisms,
    t.allowed_organizations,
    t.allowed_groups,
    t.allowed_work_contexts,
    t.require_all_contexts,
    t.work_context_id,
    t.specialty_id,
    wc.code AS work_context_code,
    wc.display_name AS work_context_name,
    wc.theme_config,
    wc.icon_name,
    wc.requires_patient,
    s.code AS specialty_code,
    s.display_name AS specialty_name
   FROM ((public.ui_templates t
     LEFT JOIN public.work_contexts wc ON ((t.work_context_id = wc.id)))
     LEFT JOIN public.specialisms s ON ((t.specialty_id = s.id)));


--
-- Name: ui_widget_instances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ui_widget_instances (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    template_id uuid,
    widget_definition_id uuid,
    region text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    display_title text,
    configuration jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_active_contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_active_contexts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    active_organization_id uuid,
    active_role_id uuid,
    active_specialism_id uuid,
    active_group_id uuid,
    active_work_context_id uuid,
    last_updated timestamp with time zone DEFAULT now(),
    session_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_active_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_active_contexts IS 'Huidige actieve context per gebruiker voor deze sessie';


--
-- Name: COLUMN user_active_contexts.last_updated; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_active_contexts.last_updated IS 'Laatste keer dat context gewisseld werd';


--
-- Name: user_admin_list; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_admin_list WITH (security_barrier='true') AS
 SELECT id,
    email,
    full_name
   FROM public.profiles;


--
-- Name: user_available_ui_templates; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_available_ui_templates WITH (security_barrier='true') AS
 SELECT t.id,
    t.context_id,
    t.name,
    t.parent_template_id,
    t.is_active,
    t.created_at,
    t.allowed_roles,
    t.allowed_specialisms,
    t.allowed_organizations,
    t.allowed_groups,
    t.allowed_work_contexts,
    t.require_all_contexts,
    t.work_context_id,
    t.specialty_id,
    wc.code AS work_context_code,
    wc.display_name AS work_context_name,
    wc.theme_config,
    wc.icon_name,
    wc.requires_patient,
    s.code AS specialty_code,
    s.display_name AS specialty_name
   FROM ((public.ui_templates t
     LEFT JOIN public.work_contexts wc ON ((t.work_context_id = wc.id)))
     LEFT JOIN public.specialisms s ON ((t.specialty_id = s.id)));


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    group_id uuid NOT NULL,
    role_in_group character varying(100),
    is_primary boolean DEFAULT false,
    valid_from date DEFAULT CURRENT_DATE,
    valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_groups IS 'Koppeling tussen gebruikers en teams/groepen (1:N)';


--
-- Name: COLUMN user_groups.role_in_group; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_groups.role_in_group IS 'Rol binnen de groep: lead, member, coordinator';


--
-- Name: user_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    function_level text,
    is_primary boolean DEFAULT false,
    valid_from date DEFAULT CURRENT_DATE,
    valid_until date,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT staff_memberships_function_level_check CHECK ((function_level = ANY (ARRAY['medical_specialist'::text, 'nurse_practitioner'::text, 'medical_support'::text, 'admin_support'::text])))
);


--
-- Name: TABLE user_organizations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_organizations IS 'Koppeling tussen gebruikers en organisaties (1:N)';


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    is_primary boolean DEFAULT false,
    valid_from date DEFAULT CURRENT_DATE,
    valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_roles IS 'Koppeling tussen gebruikers en systeem rollen (1:N) - vervangt profiles.app_role';


--
-- Name: user_specialisms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_specialisms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    specialism_id uuid NOT NULL,
    is_primary boolean DEFAULT false,
    valid_from date DEFAULT CURRENT_DATE,
    valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_specialisms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_specialisms IS 'Koppeling tussen gebruikers en hun specialismen (1:N)';


--
-- Name: COLUMN user_specialisms.is_primary; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_specialisms.is_primary IS 'Default specialisme voor deze gebruiker';


--
-- Name: user_work_contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_work_contexts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    work_context_id uuid NOT NULL,
    is_primary boolean DEFAULT false,
    valid_from date DEFAULT CURRENT_DATE,
    valid_until date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_work_contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_work_contexts IS 'Koppeling tussen gebruikers en werklocaties/afdelingen (1:N)';


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    ehr_id uuid NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    preferred_language text DEFAULT 'nl_NL'::text NOT NULL,
    storage_location text
);


--
-- Name: verslagen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verslagen (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    content jsonb NOT NULL,
    source text,
    created_at timestamp with time zone DEFAULT now(),
    specialisme text
);


--
-- Name: COLUMN verslagen.specialisme; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.verslagen.specialisme IS '2e lijns specialisme (Cardiologie, Interne Geneeskunde, etc.)';


--
-- Name: widget_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_definitions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    component_key text NOT NULL,
    name text NOT NULL,
    description text,
    default_icon text,
    engine_type text DEFAULT 'react_component'::text
);


--
-- Name: widget_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget_sections (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    widget_definition_id uuid,
    section_key text NOT NULL,
    label text NOT NULL,
    zib_mapping text,
    ui_control_type text DEFAULT 'text_area'::text,
    sort_order integer DEFAULT 0,
    placeholder text,
    selected_fields jsonb DEFAULT '[]'::jsonb,
    click_action text DEFAULT 'view_history'::text
);


--
-- Name: COLUMN widget_sections.click_action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.widget_sections.click_action IS 'Bepaalt wat er gebeurt bij een klik: view_history of direct_entry';


--
-- Name: zib_compositions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zib_compositions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid NOT NULL,
    caregiver_id uuid NOT NULL,
    zib_id text NOT NULL,
    zib_version text NOT NULL,
    clinical_status text NOT NULL,
    verification_status text NOT NULL,
    effective_at timestamp with time zone NOT NULL,
    recorded_at timestamp with time zone DEFAULT now(),
    content jsonb NOT NULL,
    source_system text DEFAULT 'OpenEPD-Sovereign'::text,
    external_id text,
    confidentiality_code text DEFAULT 'N'::text,
    storage_status text DEFAULT 'sync_pending'::text,
    local_vault_id uuid
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2026_01_10; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_10 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_11; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_11 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_12; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_13; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_13 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_14; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_14 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_15; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_15 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2026_01_16; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2026_01_16 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: messages_2026_01_10; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_10 FOR VALUES FROM ('2026-01-10 00:00:00') TO ('2026-01-11 00:00:00');


--
-- Name: messages_2026_01_11; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_11 FOR VALUES FROM ('2026-01-11 00:00:00') TO ('2026-01-12 00:00:00');


--
-- Name: messages_2026_01_12; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_12 FOR VALUES FROM ('2026-01-12 00:00:00') TO ('2026-01-13 00:00:00');


--
-- Name: messages_2026_01_13; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_13 FOR VALUES FROM ('2026-01-13 00:00:00') TO ('2026-01-14 00:00:00');


--
-- Name: messages_2026_01_14; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_14 FOR VALUES FROM ('2026-01-14 00:00:00') TO ('2026-01-15 00:00:00');


--
-- Name: messages_2026_01_15; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_15 FOR VALUES FROM ('2026-01-15 00:00:00') TO ('2026-01-16 00:00:00');


--
-- Name: messages_2026_01_16; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_01_16 FOR VALUES FROM ('2026-01-16 00:00:00') TO ('2026-01-17 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions admin_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);


--
-- Name: ai_config_assignments ai_config_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_assignments
    ADD CONSTRAINT ai_config_assignments_pkey PRIMARY KEY (id);


--
-- Name: ai_config ai_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config
    ADD CONSTRAINT ai_config_pkey PRIMARY KEY (id);


--
-- Name: ai_config_scopes ai_config_scopes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_pkey PRIMARY KEY (id);


--
-- Name: ai_config_usage_logs ai_config_usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_usage_logs
    ADD CONSTRAINT ai_config_usage_logs_pkey PRIMARY KEY (id);


--
-- Name: ai_extractions ai_extractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_extractions
    ADD CONSTRAINT ai_extractions_pkey PRIMARY KEY (id);


--
-- Name: ai_features ai_features_feature_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_features
    ADD CONSTRAINT ai_features_feature_id_key UNIQUE (feature_id);


--
-- Name: ai_features ai_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_features
    ADD CONSTRAINT ai_features_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: billing_codes_dbc billing_codes_dbc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_codes_dbc
    ADD CONSTRAINT billing_codes_dbc_pkey PRIMARY KEY (id);


--
-- Name: billing_items billing_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);


--
-- Name: care_relationships care_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_relationships
    ADD CONSTRAINT care_relationships_pkey PRIMARY KEY (id);


--
-- Name: care_role_definitions care_role_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_role_definitions
    ADD CONSTRAINT care_role_definitions_pkey PRIMARY KEY (role_code);


--
-- Name: care_trajectories care_trajectories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_trajectories
    ADD CONSTRAINT care_trajectories_pkey PRIMARY KEY (id);


--
-- Name: clinical_protocols clinical_protocols_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinical_protocols
    ADD CONSTRAINT clinical_protocols_pkey PRIMARY KEY (id);


--
-- Name: dashboard_layouts dashboard_layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_layouts
    ADD CONSTRAINT dashboard_layouts_pkey PRIMARY KEY (id);


--
-- Name: doc_sections doc_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doc_sections
    ADD CONSTRAINT doc_sections_pkey PRIMARY KEY (id);


--
-- Name: doc_templates doc_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doc_templates
    ADD CONSTRAINT doc_templates_pkey PRIMARY KEY (id);


--
-- Name: groups groups_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_code_key UNIQUE (code);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: medical_episodes medical_episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_episodes
    ADD CONSTRAINT medical_episodes_pkey PRIMARY KEY (id);


--
-- Name: nen7513_logs nen7513_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nen7513_logs
    ADD CONSTRAINT nen7513_logs_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_agb_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_agb_code_key UNIQUE (agb_code);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_bsn_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_bsn_number_key UNIQUE (bsn_number);


--
-- Name: profiles profiles_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_unique UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_uzi_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_uzi_number_key UNIQUE (uzi_number);


--
-- Name: protocol_actions protocol_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_actions
    ADD CONSTRAINT protocol_actions_pkey PRIMARY KEY (id);


--
-- Name: protocol_rules protocol_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_rules
    ADD CONSTRAINT protocol_rules_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_key_key UNIQUE (role_key);


--
-- Name: specialisms specialisms_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialisms
    ADD CONSTRAINT specialisms_code_key UNIQUE (code);


--
-- Name: specialisms specialisms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialisms
    ADD CONSTRAINT specialisms_pkey PRIMARY KEY (id);


--
-- Name: user_organizations staff_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT staff_memberships_pkey PRIMARY KEY (id);


--
-- Name: user_organizations staff_memberships_user_id_organization_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT staff_memberships_user_id_organization_id_key UNIQUE (user_id, organization_id);


--
-- Name: storage_providers storage_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.storage_providers
    ADD CONSTRAINT storage_providers_pkey PRIMARY KEY (id);


--
-- Name: system_config_logs system_config_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_config_logs
    ADD CONSTRAINT system_config_logs_pkey PRIMARY KEY (id);


--
-- Name: ui_contexts ui_contexts_organization_id_specialty_code_care_setting_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_contexts
    ADD CONSTRAINT ui_contexts_organization_id_specialty_code_care_setting_key UNIQUE NULLS NOT DISTINCT (organization_id, specialty_code, care_setting);


--
-- Name: ui_contexts ui_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_contexts
    ADD CONSTRAINT ui_contexts_pkey PRIMARY KEY (id);


--
-- Name: ui_templates ui_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT ui_templates_pkey PRIMARY KEY (id);


--
-- Name: ui_widget_instances ui_widget_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_widget_instances
    ADD CONSTRAINT ui_widget_instances_pkey PRIMARY KEY (id);


--
-- Name: ai_config_assignments unique_assignment; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_assignments
    ADD CONSTRAINT unique_assignment UNIQUE (feature_id, scope_id);


--
-- Name: admin_permissions unique_role_module; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT unique_role_module UNIQUE (role, module_key);


--
-- Name: dashboard_layouts unique_role_specialty; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_layouts
    ADD CONSTRAINT unique_role_specialty UNIQUE (role_key, specialty);


--
-- Name: ai_config_scopes unique_scope; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT unique_scope UNIQUE (scope_type, scope_value);


--
-- Name: ui_contexts unique_specialty_setting; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_contexts
    ADD CONSTRAINT unique_specialty_setting UNIQUE (specialty_code, care_setting);


--
-- Name: ui_templates unique_template_name_per_context; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT unique_template_name_per_context UNIQUE (context_id, name);


--
-- Name: ui_widget_instances unique_widget_per_template; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_widget_instances
    ADD CONSTRAINT unique_widget_per_template UNIQUE (template_id, widget_definition_id);


--
-- Name: user_active_contexts user_active_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_pkey PRIMARY KEY (id);


--
-- Name: user_active_contexts user_active_contexts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_user_id_key UNIQUE (user_id);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (id);


--
-- Name: user_groups user_groups_user_id_group_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_group_id_key UNIQUE (user_id, group_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: user_specialisms user_specialisms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_specialisms
    ADD CONSTRAINT user_specialisms_pkey PRIMARY KEY (id);


--
-- Name: user_specialisms user_specialisms_user_id_specialism_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_specialisms
    ADD CONSTRAINT user_specialisms_user_id_specialism_id_key UNIQUE (user_id, specialism_id);


--
-- Name: user_work_contexts user_work_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_work_contexts
    ADD CONSTRAINT user_work_contexts_pkey PRIMARY KEY (id);


--
-- Name: user_work_contexts user_work_contexts_user_id_work_context_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_work_contexts
    ADD CONSTRAINT user_work_contexts_user_id_work_context_id_key UNIQUE (user_id, work_context_id);


--
-- Name: users users_ehr_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_ehr_id_unique UNIQUE (ehr_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verslagen verslagen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verslagen
    ADD CONSTRAINT verslagen_pkey PRIMARY KEY (id);


--
-- Name: widget_definitions widget_definitions_component_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definitions
    ADD CONSTRAINT widget_definitions_component_key_key UNIQUE (component_key);


--
-- Name: widget_definitions widget_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_definitions
    ADD CONSTRAINT widget_definitions_pkey PRIMARY KEY (id);


--
-- Name: widget_sections widget_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_sections
    ADD CONSTRAINT widget_sections_pkey PRIMARY KEY (id);


--
-- Name: widget_sections widget_sections_unique_key_per_widget; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_sections
    ADD CONSTRAINT widget_sections_unique_key_per_widget UNIQUE (widget_definition_id, section_key);


--
-- Name: work_contexts work_contexts_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_contexts
    ADD CONSTRAINT work_contexts_code_key UNIQUE (code);


--
-- Name: work_contexts work_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_contexts
    ADD CONSTRAINT work_contexts_pkey PRIMARY KEY (id);


--
-- Name: zib_compositions zib_compositions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zib_compositions
    ADD CONSTRAINT zib_compositions_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_10 messages_2026_01_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_10
    ADD CONSTRAINT messages_2026_01_10_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_11 messages_2026_01_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_11
    ADD CONSTRAINT messages_2026_01_11_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_12 messages_2026_01_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_12
    ADD CONSTRAINT messages_2026_01_12_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_13 messages_2026_01_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_13
    ADD CONSTRAINT messages_2026_01_13_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_14 messages_2026_01_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_14
    ADD CONSTRAINT messages_2026_01_14_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_15 messages_2026_01_15_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_15
    ADD CONSTRAINT messages_2026_01_15_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_16 messages_2026_01_16_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2026_01_16
    ADD CONSTRAINT messages_2026_01_16_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_active_contexts_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_active_contexts_user ON public.user_active_contexts USING btree (user_id);


--
-- Name: idx_ai_extractions_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_extractions_patient ON public.ai_extractions USING btree (patient_id);


--
-- Name: idx_ai_features_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_features_active ON public.ai_features USING btree (is_active);


--
-- Name: idx_ai_features_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_features_category ON public.ai_features USING btree (category);


--
-- Name: idx_appointment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appointment_status ON public.appointments USING btree (status, start_time);


--
-- Name: idx_assignments_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_active ON public.ai_config_assignments USING btree (is_active);


--
-- Name: idx_assignments_feature; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_feature ON public.ai_config_assignments USING btree (feature_id);


--
-- Name: idx_assignments_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_scope ON public.ai_config_assignments USING btree (scope_id);


--
-- Name: idx_assignments_valid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_valid ON public.ai_config_assignments USING btree (valid_from, valid_until);


--
-- Name: idx_billing_items_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_patient ON public.billing_items USING btree (patient_id);


--
-- Name: idx_groups_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_active ON public.groups USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_groups_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_code ON public.groups USING btree (code);


--
-- Name: idx_groups_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_org ON public.groups USING btree (organization_id);


--
-- Name: idx_groups_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_parent ON public.groups USING btree (parent_group_id);


--
-- Name: idx_profiles_bsn; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_bsn ON public.profiles USING btree (bsn_number);


--
-- Name: idx_profiles_lastname_dob; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_lastname_dob ON public.profiles USING btree (last_name, date_of_birth);


--
-- Name: idx_scopes_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scopes_parent ON public.ai_config_scopes USING btree (parent_scope_id);


--
-- Name: idx_scopes_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scopes_priority ON public.ai_config_scopes USING btree (priority);


--
-- Name: idx_scopes_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scopes_type ON public.ai_config_scopes USING btree (scope_type);


--
-- Name: idx_specialisms_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_specialisms_active ON public.specialisms USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_specialisms_agb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_specialisms_agb ON public.specialisms USING btree (agb_code);


--
-- Name: idx_specialisms_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_specialisms_code ON public.specialisms USING btree (code);


--
-- Name: idx_specialisms_dhd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_specialisms_dhd ON public.specialisms USING btree (dhd_code);


--
-- Name: idx_ui_contexts_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ui_contexts_lookup ON public.ui_contexts USING btree (organization_id, specialty_code, care_setting);


--
-- Name: idx_ui_templates_context_specialty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ui_templates_context_specialty ON public.ui_templates USING btree (work_context_id, specialty_id) WHERE (is_active = true);


--
-- Name: idx_ui_templates_specialty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ui_templates_specialty ON public.ui_templates USING btree (specialty_id) WHERE (specialty_id IS NOT NULL);


--
-- Name: idx_ui_templates_work_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ui_templates_work_context ON public.ui_templates USING btree (work_context_id) WHERE (is_active = true);


--
-- Name: idx_usage_logs_feature; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_logs_feature ON public.ai_config_usage_logs USING btree (feature_id);


--
-- Name: idx_usage_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_logs_timestamp ON public.ai_config_usage_logs USING btree (logged_at);


--
-- Name: idx_usage_logs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_logs_user ON public.ai_config_usage_logs USING btree (user_id);


--
-- Name: idx_user_groups_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_groups_group ON public.user_groups USING btree (group_id);


--
-- Name: idx_user_groups_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_groups_primary ON public.user_groups USING btree (user_id) WHERE (is_primary = true);


--
-- Name: idx_user_groups_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_groups_user ON public.user_groups USING btree (user_id);


--
-- Name: idx_user_organizations_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_organizations_primary ON public.user_organizations USING btree (user_id) WHERE (is_primary = true);


--
-- Name: idx_user_roles_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_roles_primary ON public.user_roles USING btree (user_id) WHERE (is_primary = true);


--
-- Name: idx_user_roles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role_id);


--
-- Name: idx_user_roles_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user ON public.user_roles USING btree (user_id);


--
-- Name: idx_user_specialisms_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_specialisms_primary ON public.user_specialisms USING btree (user_id) WHERE (is_primary = true);


--
-- Name: idx_user_specialisms_spec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_specialisms_spec ON public.user_specialisms USING btree (specialism_id);


--
-- Name: idx_user_specialisms_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_specialisms_user ON public.user_specialisms USING btree (user_id);


--
-- Name: idx_user_work_contexts_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_work_contexts_context ON public.user_work_contexts USING btree (work_context_id);


--
-- Name: idx_user_work_contexts_primary; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_work_contexts_primary ON public.user_work_contexts USING btree (user_id) WHERE (is_primary = true);


--
-- Name: idx_user_work_contexts_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_work_contexts_user ON public.user_work_contexts USING btree (user_id);


--
-- Name: idx_verslagen_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verslagen_patient ON public.verslagen USING btree (patient_id);


--
-- Name: idx_verslagen_specialisme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verslagen_specialisme ON public.verslagen USING btree (specialisme);


--
-- Name: idx_widget_instances_template; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_widget_instances_template ON public.ui_widget_instances USING btree (template_id);


--
-- Name: idx_work_contexts_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_contexts_active ON public.work_contexts USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_work_contexts_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_contexts_code ON public.work_contexts USING btree (code);


--
-- Name: idx_work_contexts_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_contexts_display_order ON public.work_contexts USING btree (display_order);


--
-- Name: idx_work_contexts_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_contexts_org ON public.work_contexts USING btree (organization_id);


--
-- Name: idx_zib_patient_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zib_patient_type ON public.zib_compositions USING btree (patient_id, zib_id);


--
-- Name: unique_care_rel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_care_rel_idx ON public.care_relationships USING btree (patient_user_id, caregiver_user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_10_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_10_inserted_at_topic_idx ON realtime.messages_2026_01_10 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_11_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_11_inserted_at_topic_idx ON realtime.messages_2026_01_11 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_12_inserted_at_topic_idx ON realtime.messages_2026_01_12 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_13_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_13_inserted_at_topic_idx ON realtime.messages_2026_01_13 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_14_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_14_inserted_at_topic_idx ON realtime.messages_2026_01_14 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_15_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_15_inserted_at_topic_idx ON realtime.messages_2026_01_15 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_01_16_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2026_01_16_inserted_at_topic_idx ON realtime.messages_2026_01_16 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: messages_2026_01_10_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_10_inserted_at_topic_idx;


--
-- Name: messages_2026_01_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_10_pkey;


--
-- Name: messages_2026_01_11_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_11_inserted_at_topic_idx;


--
-- Name: messages_2026_01_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_11_pkey;


--
-- Name: messages_2026_01_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_12_inserted_at_topic_idx;


--
-- Name: messages_2026_01_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_12_pkey;


--
-- Name: messages_2026_01_13_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_13_inserted_at_topic_idx;


--
-- Name: messages_2026_01_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_13_pkey;


--
-- Name: messages_2026_01_14_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_14_inserted_at_topic_idx;


--
-- Name: messages_2026_01_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_14_pkey;


--
-- Name: messages_2026_01_15_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_15_inserted_at_topic_idx;


--
-- Name: messages_2026_01_15_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_15_pkey;


--
-- Name: messages_2026_01_16_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_01_16_inserted_at_topic_idx;


--
-- Name: messages_2026_01_16_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_01_16_pkey;


--
-- Name: users trigger_auto_assign_work_contexts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_assign_work_contexts AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.auto_assign_user_work_contexts();


--
-- Name: clinical_protocols update_clinical_protocols_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_clinical_protocols_updated_at BEFORE UPDATE ON public.clinical_protocols FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: ai_config_assignments ai_config_assignments_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_assignments
    ADD CONSTRAINT ai_config_assignments_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.ai_features(feature_id) ON DELETE CASCADE;


--
-- Name: ai_config_assignments ai_config_assignments_scope_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_assignments
    ADD CONSTRAINT ai_config_assignments_scope_id_fkey FOREIGN KEY (scope_id) REFERENCES public.ai_config_scopes(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes ai_config_scopes_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes ai_config_scopes_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes ai_config_scopes_parent_scope_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_parent_scope_id_fkey FOREIGN KEY (parent_scope_id) REFERENCES public.ai_config_scopes(id);


--
-- Name: ai_config_scopes ai_config_scopes_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes ai_config_scopes_specialism_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_specialism_id_fkey FOREIGN KEY (specialism_id) REFERENCES public.specialisms(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes ai_config_scopes_work_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT ai_config_scopes_work_context_id_fkey FOREIGN KEY (work_context_id) REFERENCES public.work_contexts(id) ON DELETE CASCADE;


--
-- Name: ai_config_usage_logs ai_config_usage_logs_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_usage_logs
    ADD CONSTRAINT ai_config_usage_logs_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.ai_config_assignments(id);


--
-- Name: ai_extractions ai_extractions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_extractions
    ADD CONSTRAINT ai_extractions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id);


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id);


--
-- Name: billing_codes_dbc billing_codes_dbc_trajectory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_codes_dbc
    ADD CONSTRAINT billing_codes_dbc_trajectory_id_fkey FOREIGN KEY (trajectory_id) REFERENCES public.care_trajectories(id);


--
-- Name: billing_items billing_items_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id);


--
-- Name: care_relationships care_relationships_caregiver_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_relationships
    ADD CONSTRAINT care_relationships_caregiver_user_id_fkey FOREIGN KEY (caregiver_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: care_relationships care_relationships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_relationships
    ADD CONSTRAINT care_relationships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: care_relationships care_relationships_patient_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_relationships
    ADD CONSTRAINT care_relationships_patient_user_id_fkey FOREIGN KEY (patient_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: care_relationships care_relationships_role_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_relationships
    ADD CONSTRAINT care_relationships_role_code_fkey FOREIGN KEY (role_code) REFERENCES public.care_role_definitions(role_code);


--
-- Name: care_trajectories care_trajectories_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_trajectories
    ADD CONSTRAINT care_trajectories_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.medical_episodes(id);


--
-- Name: care_trajectories care_trajectories_patient_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.care_trajectories
    ADD CONSTRAINT care_trajectories_patient_user_id_fkey FOREIGN KEY (patient_user_id) REFERENCES public.profiles(id);


--
-- Name: doc_sections doc_sections_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doc_sections
    ADD CONSTRAINT doc_sections_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.doc_templates(id) ON DELETE CASCADE;


--
-- Name: ai_config_scopes fk_ai_config_scopes_work_context; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_config_scopes
    ADD CONSTRAINT fk_ai_config_scopes_work_context FOREIGN KEY (work_context_id) REFERENCES public.work_contexts(id) ON DELETE CASCADE;


--
-- Name: ui_templates fk_ui_templates_specialty; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT fk_ui_templates_specialty FOREIGN KEY (specialty_id) REFERENCES public.specialisms(id) ON DELETE SET NULL;


--
-- Name: ui_templates fk_ui_templates_work_context; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT fk_ui_templates_work_context FOREIGN KEY (work_context_id) REFERENCES public.work_contexts(id) ON DELETE CASCADE;


--
-- Name: groups groups_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: groups groups_parent_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_parent_group_id_fkey FOREIGN KEY (parent_group_id) REFERENCES public.groups(id) ON DELETE SET NULL;


--
-- Name: medical_episodes medical_episodes_patient_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_episodes
    ADD CONSTRAINT medical_episodes_patient_user_id_fkey FOREIGN KEY (patient_user_id) REFERENCES public.profiles(id);


--
-- Name: nen7513_logs nen7513_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nen7513_logs
    ADD CONSTRAINT nen7513_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: nen7513_logs nen7513_logs_patient_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nen7513_logs
    ADD CONSTRAINT nen7513_logs_patient_user_id_fkey FOREIGN KEY (patient_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: organizations organizations_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.organizations(id);


--
-- Name: protocol_actions protocol_actions_protocol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_actions
    ADD CONSTRAINT protocol_actions_protocol_id_fkey FOREIGN KEY (protocol_id) REFERENCES public.clinical_protocols(id) ON DELETE CASCADE;


--
-- Name: protocol_rules protocol_rules_protocol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_rules
    ADD CONSTRAINT protocol_rules_protocol_id_fkey FOREIGN KEY (protocol_id) REFERENCES public.clinical_protocols(id) ON DELETE CASCADE;


--
-- Name: user_organizations staff_memberships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT staff_memberships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: user_organizations staff_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT staff_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: system_config_logs system_config_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_config_logs
    ADD CONSTRAINT system_config_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: ui_contexts ui_contexts_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_contexts
    ADD CONSTRAINT ui_contexts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: ui_templates ui_templates_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT ui_templates_context_id_fkey FOREIGN KEY (context_id) REFERENCES public.ui_contexts(id);


--
-- Name: ui_templates ui_templates_parent_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_templates
    ADD CONSTRAINT ui_templates_parent_template_id_fkey FOREIGN KEY (parent_template_id) REFERENCES public.ui_templates(id);


--
-- Name: ui_widget_instances ui_widget_instances_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_widget_instances
    ADD CONSTRAINT ui_widget_instances_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.ui_templates(id) ON DELETE CASCADE;


--
-- Name: ui_widget_instances ui_widget_instances_widget_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ui_widget_instances
    ADD CONSTRAINT ui_widget_instances_widget_definition_id_fkey FOREIGN KEY (widget_definition_id) REFERENCES public.widget_definitions(id);


--
-- Name: user_active_contexts user_active_contexts_active_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_active_group_id_fkey FOREIGN KEY (active_group_id) REFERENCES public.groups(id) ON DELETE SET NULL;


--
-- Name: user_active_contexts user_active_contexts_active_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_active_organization_id_fkey FOREIGN KEY (active_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: user_active_contexts user_active_contexts_active_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_active_role_id_fkey FOREIGN KEY (active_role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- Name: user_active_contexts user_active_contexts_active_specialism_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_active_specialism_id_fkey FOREIGN KEY (active_specialism_id) REFERENCES public.specialisms(id) ON DELETE SET NULL;


--
-- Name: user_active_contexts user_active_contexts_active_work_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_active_work_context_id_fkey FOREIGN KEY (active_work_context_id) REFERENCES public.work_contexts(id) ON DELETE SET NULL;


--
-- Name: user_active_contexts user_active_contexts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_active_contexts
    ADD CONSTRAINT user_active_contexts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: user_groups user_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_specialisms user_specialisms_specialism_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_specialisms
    ADD CONSTRAINT user_specialisms_specialism_id_fkey FOREIGN KEY (specialism_id) REFERENCES public.specialisms(id) ON DELETE CASCADE;


--
-- Name: user_specialisms user_specialisms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_specialisms
    ADD CONSTRAINT user_specialisms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_work_contexts user_work_contexts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_work_contexts
    ADD CONSTRAINT user_work_contexts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_work_contexts user_work_contexts_work_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_work_contexts
    ADD CONSTRAINT user_work_contexts_work_context_id_fkey FOREIGN KEY (work_context_id) REFERENCES public.work_contexts(id) ON DELETE CASCADE;


--
-- Name: verslagen verslagen_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verslagen
    ADD CONSTRAINT verslagen_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id);


--
-- Name: widget_sections widget_sections_widget_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget_sections
    ADD CONSTRAINT widget_sections_widget_definition_id_fkey FOREIGN KEY (widget_definition_id) REFERENCES public.widget_definitions(id) ON DELETE CASCADE;


--
-- Name: work_contexts work_contexts_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_contexts
    ADD CONSTRAINT work_contexts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: zib_compositions zib_compositions_caregiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zib_compositions
    ADD CONSTRAINT zib_compositions_caregiver_id_fkey FOREIGN KEY (caregiver_id) REFERENCES auth.users(id);


--
-- Name: zib_compositions zib_compositions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zib_compositions
    ADD CONSTRAINT zib_compositions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles Admins can update profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING ((auth.role() = 'admin'::text));


--
-- Name: user_organizations Admins manage user organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage user organizations" ON public.user_organizations USING ((auth.role() = 'admin'::text));


--
-- Name: ui_templates Allow all for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all for authenticated users" ON public.ui_templates USING ((auth.uid() IS NOT NULL));


--
-- Name: users Allow authenticated users to read and update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to read and update their own profile" ON public.users USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: ui_widget_instances Allow delete for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow delete for authenticated users" ON public.ui_widget_instances FOR DELETE USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_definitions Allow delete for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow delete for authenticated users" ON public.widget_definitions FOR DELETE USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_sections Allow delete for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow delete for authenticated users" ON public.widget_sections FOR DELETE USING ((auth.uid() IS NOT NULL));


--
-- Name: ui_widget_instances Allow insert for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow insert for authenticated users" ON public.ui_widget_instances FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: widget_definitions Allow insert for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow insert for authenticated users" ON public.widget_definitions FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: widget_sections Allow insert for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow insert for authenticated users" ON public.widget_sections FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: ui_widget_instances Allow select for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow select for authenticated users" ON public.ui_widget_instances FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_definitions Allow select for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow select for authenticated users" ON public.widget_definitions FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_sections Allow select for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow select for authenticated users" ON public.widget_sections FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: ui_widget_instances Allow update for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow update for authenticated users" ON public.ui_widget_instances FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_definitions Allow update for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow update for authenticated users" ON public.widget_definitions FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: widget_sections Allow update for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow update for authenticated users" ON public.widget_sections FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: groups Anyone can read groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read groups" ON public.groups FOR SELECT USING (true);


--
-- Name: specialisms Anyone can read specialisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read specialisms" ON public.specialisms FOR SELECT USING (true);


--
-- Name: work_contexts Anyone can read work_contexts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read work_contexts" ON public.work_contexts FOR SELECT USING (true);


--
-- Name: profiles Authenticated insert profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated insert profiles" ON public.profiles FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: ai_features Authenticated manage ai features; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated manage ai features" ON public.ai_features USING (((auth.role() = 'authenticated'::text) AND (is_active = true)));


--
-- Name: ai_config_assignments Authenticated manage assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated manage assignments" ON public.ai_config_assignments USING (((auth.role() = 'authenticated'::text) AND (is_active = true)));


--
-- Name: protocol_actions Authenticated manage protocol actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated manage protocol actions" ON public.protocol_actions USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_config_scopes Authenticated manage scopes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated manage scopes" ON public.ai_config_scopes USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_config Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.ai_config USING ((auth.role() = 'authenticated'::text));


--
-- Name: clinical_protocols Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.clinical_protocols USING ((auth.role() = 'authenticated'::text));


--
-- Name: doc_sections Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.doc_sections USING ((auth.role() = 'authenticated'::text));


--
-- Name: doc_templates Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.doc_templates USING ((auth.role() = 'authenticated'::text));


--
-- Name: protocol_rules Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.protocol_rules USING ((auth.role() = 'authenticated'::text));


--
-- Name: storage_providers Authenticated only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated only" ON public.storage_providers USING ((auth.role() = 'authenticated'::text));


--
-- Name: admin_permissions Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.admin_permissions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_extractions Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.ai_extractions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: billing_codes_dbc Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.billing_codes_dbc FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: billing_items Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.billing_items FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: care_role_definitions Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.care_role_definitions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: dashboard_layouts Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.dashboard_layouts FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: organizations Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.organizations FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: protocol_actions Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.protocol_actions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: referrals Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.referrals FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: roles Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.roles FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: system_config_logs Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.system_config_logs FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ui_contexts Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.ui_contexts FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ui_templates Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.ui_templates FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ui_widget_instances Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.ui_widget_instances FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: user_organizations Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.user_organizations FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: verslagen Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.verslagen FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: widget_definitions Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.widget_definitions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: widget_sections Authenticated read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read" ON public.widget_sections FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_features Authenticated read ai features; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read ai features" ON public.ai_features FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_config_assignments Authenticated read assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read assignments" ON public.ai_config_assignments FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: ai_config_scopes Authenticated read scopes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read scopes" ON public.ai_config_scopes FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: user_organizations Authenticated read user organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read user organizations" ON public.user_organizations FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: groups Authenticated users can manage groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage groups" ON public.groups USING ((auth.uid() IS NOT NULL));


--
-- Name: specialisms Authenticated users can manage specialisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage specialisms" ON public.specialisms USING ((auth.uid() IS NOT NULL));


--
-- Name: user_groups Authenticated users can manage user_groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage user_groups" ON public.user_groups USING ((auth.uid() IS NOT NULL));


--
-- Name: user_roles Authenticated users can manage user_roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage user_roles" ON public.user_roles USING ((auth.uid() IS NOT NULL));


--
-- Name: user_specialisms Authenticated users can manage user_specialisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage user_specialisms" ON public.user_specialisms USING ((auth.uid() IS NOT NULL));


--
-- Name: user_work_contexts Authenticated users can manage user_work_contexts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage user_work_contexts" ON public.user_work_contexts USING ((auth.uid() IS NOT NULL));


--
-- Name: work_contexts Authenticated users can manage work_contexts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage work_contexts" ON public.work_contexts USING ((auth.uid() IS NOT NULL));


--
-- Name: ai_config_usage_logs Authenticated write usage logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated write usage logs" ON public.ai_config_usage_logs FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: profiles Caregiver profile access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Caregiver profile access" ON public.profiles FOR SELECT USING (((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.care_relationships
  WHERE ((care_relationships.patient_user_id = profiles.id) AND (care_relationships.caregiver_user_id = auth.uid()))))));


--
-- Name: zib_compositions Caregivers read patient ZIBs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Caregivers read patient ZIBs" ON public.zib_compositions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.care_relationships cr
     JOIN public.users u ON ((cr.patient_user_id = u.id)))
  WHERE ((u.ehr_id = zib_compositions.patient_id) AND (cr.caregiver_user_id = auth.uid())))));


--
-- Name: appointments Caregivers read patient appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Caregivers read patient appointments" ON public.appointments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.care_relationships cr
     JOIN public.users u ON ((cr.patient_user_id = u.id)))
  WHERE ((u.ehr_id = appointments.patient_id) AND (cr.caregiver_user_id = auth.uid())))));


--
-- Name: care_trajectories Caregivers read patient data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Caregivers read patient data" ON public.care_trajectories FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.care_relationships cr
  WHERE ((cr.patient_user_id = care_trajectories.patient_user_id) AND (cr.caregiver_user_id = auth.uid())))));


--
-- Name: zib_compositions Medische data toegang policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Medische data toegang policy" ON public.zib_compositions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: zib_compositions Patient can read own ZIBs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patient can read own ZIBs" ON public.zib_compositions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.ehr_id = zib_compositions.patient_id)))));


--
-- Name: appointments Patient can read own appointments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patient can read own appointments" ON public.appointments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.ehr_id = appointments.patient_id)))));


--
-- Name: profiles Patients can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patients can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: care_relationships Patients manage own relationships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patients manage own relationships" ON public.care_relationships USING ((patient_user_id = auth.uid())) WITH CHECK ((patient_user_id = auth.uid()));


--
-- Name: medical_episodes Patients read own episodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patients read own episodes" ON public.medical_episodes FOR SELECT USING ((patient_user_id = auth.uid()));


--
-- Name: care_trajectories Patients read own trajectories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patients read own trajectories" ON public.care_trajectories FOR SELECT USING ((patient_user_id IN ( SELECT users.ehr_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: appointments Patiënt ziet eigen afspraken; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patiënt ziet eigen afspraken" ON public.appointments FOR SELECT TO authenticated USING (((( SELECT profiles.is_patient
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = false) OR (patient_id = auth.uid())));


--
-- Name: zib_compositions Patiënt ziet eigen medische data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patiënt ziet eigen medische data" ON public.zib_compositions FOR SELECT TO authenticated USING (((( SELECT profiles.is_patient
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = false) OR (patient_id = auth.uid())));


--
-- Name: nen7513_logs Patiënt ziet wie zijn dossier opende; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Patiënt ziet wie zijn dossier opende" ON public.nen7513_logs FOR SELECT TO authenticated USING (((( SELECT profiles.is_patient
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = false) OR (patient_user_id = auth.uid())));


--
-- Name: profiles Profiel toegang policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiel toegang policy" ON public.profiles FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: profiles Public profiles are viewable by authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public profiles are viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);


--
-- Name: zib_compositions TEMP: authenticated can read all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "TEMP: authenticated can read all" ON public.zib_compositions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: profiles Tijdelijke test policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tijdelijke test policy" ON public.profiles FOR SELECT USING (true);


--
-- Name: user_active_contexts Users can insert their own active context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own active context" ON public.user_active_contexts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: zib_compositions Users can modify zib_compositions for their patients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can modify zib_compositions for their patients" ON public.zib_compositions TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.care_relationships cr
  WHERE ((cr.patient_user_id = zib_compositions.patient_id) AND (cr.caregiver_user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.care_relationships cr
  WHERE ((cr.patient_user_id = zib_compositions.patient_id) AND (cr.caregiver_user_id = auth.uid())))));


--
-- Name: ai_features Users can read ai features; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read ai features" ON public.ai_features FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: ai_config_assignments Users can read assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read assignments" ON public.ai_config_assignments FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: user_groups Users can read own groups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own groups" ON public.user_groups FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can read own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_specialisms Users can read own specialisms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own specialisms" ON public.user_specialisms FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ai_config_usage_logs Users can read own usage logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own usage logs" ON public.ai_config_usage_logs FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: user_work_contexts Users can read own work contexts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own work contexts" ON public.user_work_contexts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ai_config_scopes Users can read scopes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read scopes" ON public.ai_config_scopes FOR SELECT TO authenticated USING (true);


--
-- Name: user_active_contexts Users can update their own active context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own active context" ON public.user_active_contexts FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_active_contexts Users can view their own active context; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own active context" ON public.user_active_contexts FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: zib_compositions Users can view zib_compositions for their patients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view zib_compositions for their patients" ON public.zib_compositions FOR SELECT TO authenticated USING (((EXISTS ( SELECT 1
   FROM public.care_relationships cr
  WHERE ((cr.patient_user_id = zib_compositions.patient_id) AND (cr.caregiver_user_id = auth.uid())))) OR (patient_id = auth.uid())));


--
-- Name: ai_config_usage_logs Users read own usage logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users read own usage logs" ON public.ai_config_usage_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: care_relationships View own relationships; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "View own relationships" ON public.care_relationships FOR SELECT USING (((caregiver_user_id = auth.uid()) OR (patient_user_id = auth.uid())));


--
-- Name: zib_compositions Zorgverleners kunnen consulten invoegen; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen consulten invoegen" ON public.zib_compositions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = caregiver_id));


--
-- Name: zib_compositions Zorgverleners kunnen consulten inzien; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen consulten inzien" ON public.zib_compositions FOR SELECT TO authenticated USING (true);


--
-- Name: care_relationships Zorgverleners kunnen eigen relaties bijwerken; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen eigen relaties bijwerken" ON public.care_relationships FOR UPDATE TO authenticated USING ((caregiver_user_id = auth.uid())) WITH CHECK ((caregiver_user_id = auth.uid()));


--
-- Name: profiles Zorgverleners kunnen nieuwe patienten inschrijven; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen nieuwe patienten inschrijven" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((is_patient = true));


--
-- Name: profiles Zorgverleners kunnen patientprofielen inzien; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen patientprofielen inzien" ON public.profiles FOR SELECT TO authenticated USING (((is_patient = true) OR (auth.uid() = id)));


--
-- Name: care_relationships Zorgverleners kunnen relaties toevoegen; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners kunnen relaties toevoegen" ON public.care_relationships FOR INSERT TO authenticated WITH CHECK ((caregiver_user_id = auth.uid()));


--
-- Name: care_relationships Zorgverleners zien eigen relaties; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Zorgverleners zien eigen relaties" ON public.care_relationships FOR SELECT TO authenticated USING ((caregiver_user_id = auth.uid()));


--
-- Name: admin_permissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_config ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_config_assignments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_config_assignments ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_config_scopes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_config_scopes ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_config_usage_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_config_usage_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_extractions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_extractions ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_features ENABLE ROW LEVEL SECURITY;

--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: billing_codes_dbc; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.billing_codes_dbc ENABLE ROW LEVEL SECURITY;

--
-- Name: billing_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.billing_items ENABLE ROW LEVEL SECURITY;

--
-- Name: care_relationships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.care_relationships ENABLE ROW LEVEL SECURITY;

--
-- Name: care_role_definitions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.care_role_definitions ENABLE ROW LEVEL SECURITY;

--
-- Name: care_trajectories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.care_trajectories ENABLE ROW LEVEL SECURITY;

--
-- Name: clinical_protocols; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clinical_protocols ENABLE ROW LEVEL SECURITY;

--
-- Name: dashboard_layouts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;

--
-- Name: doc_sections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.doc_sections ENABLE ROW LEVEL SECURITY;

--
-- Name: doc_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.doc_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: groups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

--
-- Name: medical_episodes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medical_episodes ENABLE ROW LEVEL SECURITY;

--
-- Name: nen7513_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.nen7513_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: protocol_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.protocol_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: protocol_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.protocol_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: referrals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: specialisms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.specialisms ENABLE ROW LEVEL SECURITY;

--
-- Name: storage_providers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.storage_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: system_config_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_config_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: ui_contexts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ui_contexts ENABLE ROW LEVEL SECURITY;

--
-- Name: ui_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ui_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: ui_widget_instances; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ui_widget_instances ENABLE ROW LEVEL SECURITY;

--
-- Name: user_active_contexts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_active_contexts ENABLE ROW LEVEL SECURITY;

--
-- Name: user_groups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;

--
-- Name: user_organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_specialisms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_specialisms ENABLE ROW LEVEL SECURITY;

--
-- Name: user_work_contexts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_work_contexts ENABLE ROW LEVEL SECURITY;

--
-- Name: user_work_contexts user_work_contexts_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_work_contexts_select_policy ON public.user_work_contexts FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: verslagen; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.verslagen ENABLE ROW LEVEL SECURITY;

--
-- Name: widget_definitions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.widget_definitions ENABLE ROW LEVEL SECURITY;

--
-- Name: widget_sections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.widget_sections ENABLE ROW LEVEL SECURITY;

--
-- Name: work_contexts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.work_contexts ENABLE ROW LEVEL SECURITY;

--
-- Name: work_contexts work_contexts_admin_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY work_contexts_admin_policy ON public.work_contexts TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.user_roles ur
     JOIN public.roles r ON ((ur.role_id = r.id)))
  WHERE ((ur.user_id = auth.uid()) AND (r.role_key = ANY (ARRAY['admin'::text, 'system_admin'::text]))))));


--
-- Name: work_contexts work_contexts_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY work_contexts_select_policy ON public.work_contexts FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: zib_compositions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.zib_compositions ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict 7syd7dAvcNTkMnxIInCp3xuy1nkvbE7q981RdngldlTOJQW9tulBef51aMkFGgF

