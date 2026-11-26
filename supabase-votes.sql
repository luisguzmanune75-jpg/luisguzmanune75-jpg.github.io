-- SNG Portal : sondage d'opinion participatif non officiel
create table if not exists public.sng_presidentielle_votes (
  vote_token uuid primary key,
  candidate text not null check (candidate in ('Marine Le Pen','Jean-Luc Mélenchon')),
  created_at timestamptz not null default now()
);
alter table public.sng_presidentielle_votes drop constraint if exists sng_presidentielle_votes_candidate_check;
alter table public.sng_presidentielle_votes add constraint sng_presidentielle_votes_candidate_check check (candidate in ('Marine Le Pen','Jean-Luc Mélenchon'));
alter table public.sng_presidentielle_votes enable row level security;
revoke all on public.sng_presidentielle_votes from anon, authenticated;

create or replace function public.submit_vote(p_vote_token uuid, p_candidate text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_candidate not in ('Marine Le Pen','Jean-Luc Mélenchon') then
    raise exception 'Candidat invalide';
  end if;
  insert into public.sng_presidentielle_votes(vote_token,candidate)
  values (p_vote_token,p_candidate)
  on conflict (vote_token) do nothing;
  return found;
end;
$$;

create or replace function public.get_vote_results()
returns table(candidate text, votes bigint)
language sql
security definer
set search_path = public
as $$
  select c.candidate, count(v.vote_token)::bigint
  from (values ('Marine Le Pen'),('Jean-Luc Mélenchon')) as c(candidate)
  left join public.sng_presidentielle_votes v on v.candidate=c.candidate
  group by c.candidate
  order by c.candidate;
$$;

revoke all on function public.submit_vote(uuid,text) from public;
revoke all on function public.get_vote_results() from public;
grant execute on function public.submit_vote(uuid,text) to anon, authenticated;
grant execute on function public.get_vote_results() to anon, authenticated;
