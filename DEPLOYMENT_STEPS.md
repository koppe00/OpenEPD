# Deployment stappenplan OpenEPD

## 1. Vereisten
- Node.js (aanbevolen LTS)
- pnpm (of npm/yarn, afhankelijk van project)
- Supabase account en project
- (Optioneel) Docker voor lokale databases

## 2. Repository klonen
```sh
git clone <repo-url>
cd OpenEPD
```

## 3. Omgevingsvariabelen instellen
- Kopieer `.env.local.voorbeeld` naar `.env.local` en vul je eigen keys in.

## 4. Dependencies installeren
```sh
pnpm install
# of
npm install
```

## 5. Supabase project koppelen
- Maak een Supabase project aan op https://app.supabase.com
- Zet de URL en keys in `.env.local`
- (Optioneel) Importeer migraties via Supabase CLI of dashboard

## 6. Database opzetten
### Schema importeren
- **Via Supabase Dashboard:**
  - Ga naar je Supabase project dashboard (https://app.supabase.com)
  - Ga naar "SQL Editor"
  - Importeer het bestand `supabase/migrations/20260113_schema.sql`:
    - Open het bestand in een teksteditor
    - Kopieer de volledige inhoud
    - Plak in de SQL Editor en voer uit
  - Dit creëert alle tabellen, functies, types en constraints

- **Via Supabase CLI (alternatief):**
  ```sh
  supabase db reset  # Reset de database naar clean state
  supabase db push   # Push lokale migraties (indien je lokale Supabase gebruikt)
  # Of importeer handmatig via psql/pg_dump zoals eerder beschreven
  ```

### Seed data importeren (optioneel, voor demo/test data)
- Importeer het bestand `supabase/seeds/20260113_seed.sql` op dezelfde manier via SQL Editor
- Dit voegt voorbeeld gebruikers, rollen, specialismen, werkcontexten en UI-templates toe
- **Inhoud seed data:**
  - Geanonimiseerde testgebruikers (admin, artsen, patiënten)
  - Standaard rollen (admin, md_specialist, nurse, patient)
  - Medische specialismen (neurologie, chirurgie, interne geneeskunde, etc.)
  - Werkcontexten (polikliniek, kliniek, SEH, IC, OK, etc.)
  - UI-templates voor verschillende specialismen
  - AI-configuratie voor verschillende features
- **Let op:** De seed data bevat geanonimiseerde testgebruikers. Voor productie gebruik je eigen gebruikers.

### Testgebruikers instellen (na seed import)
Na het importeren van seed data moet je accounts aanmaken voor de testgebruikers:

1. **Ga naar Supabase Dashboard > Authentication > Users**
2. **Voeg testgebruikers toe:**
   - **Admin gebruiker:** `testuser@openepd.nl` (wachtwoord: `TestPass123!`)
   - **Andere testgebruikers:** `annavisser@testkliniek.nl`, `peterdevries@testkliniek.nl`, `lisajansen@testkliniek.nl`
   - Gebruik wachtwoord: `TestPass123!` voor alle testaccounts
3. **Verificeer emails** in de Supabase Auth settings indien nodig
4. **Login testen** via de applicatie met `testuser@openepd.nl` / `TestPass123!`

## 7. Applicatie starten (lokaal)
```sh
pnpm dev
# of
npm run dev
```

## 8. Deployen naar productie
- Gebruik een platform als Vercel, Netlify, of eigen server
- Zet de productie-omgevingsvariabelen in het deploy-platform
- Koppel de Supabase database (zelfde URL/keys als lokaal)

## 9. (Optioneel) CI/CD instellen
- Voeg een workflow toe voor automatische tests en deploys

## 10. Documentatie en support
- Zie README.md en projectdocumentatie voor meer details

---

## Supabase database delen
- Deel nooit je service role key of .env.local
- Deel alleen de migratiebestanden (`/supabase/migrations/20260113_schema.sql`) en seed data (`/supabase/seeds/20260113_seed.sql`) voor reproduceerbare setups
- Elke gebruiker maakt zijn eigen Supabase project aan en importeert het schema + seed data via het dashboard
- De seed data bevat geanonimiseerde voorbeeldgebruikers en configuratie voor snelle demo/test setups
