# Budgeto 💰

Osobisty menedżer budżetu domowego zbudowany na **ASP.NET Core** i **React**. Pozwala śledzić przychody i wydatki, planować budżety, kategoryzować transakcje oraz wyznaczać cele oszczędnościowe — wszystko w jednym miejscu.

## Funkcje

- **Transakcje** — rejestruj przychody i wydatki, filtruj i przeglądaj historię
- **Budżety i kategorie** — twórz budżety dla wybranych kategorii i kontroluj limity wydatków
- **Cele oszczędnościowe** — wyznaczaj cele i śledź postęp ich realizacji
- **Dashboard** — przegląd finansów w jednym widoku

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Backend | ASP.NET Core 9, Minimal API, MediatR, EF Core |
| Frontend | React 18, JavaScript |
| Baza danych | PostgreSQL |
| Architektura | Clean Architecture |
| Konteneryzacja | Docker, Docker Compose, Nginx |

---

## Uruchomienie lokalne

### Wymagania

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- PostgreSQL

### Kroki

1. **Sklonuj repozytorium**

   ```bash
   git clone https://github.com/Jakub-Mikolaj-Grzybowski/Budgeto.git
   cd Budgeto
   ```

2. **Skonfiguruj connection string** w `src/Web/appsettings.json`:

   ```json
   "ConnectionStrings": {
     "BudgetoDb": "Host=localhost;Database=budgeto;Username=postgres;Password=twoje_haslo"
   }
   ```

3. **Uruchom aplikację**

   ```bash
   cd src/Web
   dotnet watch run
   ```

   Aplikacja dostępna pod adresem: **https://localhost:5001**

---

## Uruchomienie przez Docker

Projekt zawiera gotową konfigurację Docker z dwoma kontenerami: `budgeto-backend` (API) i `budgeto-frontend` (React + Nginx). Kontenery komunikują się przez zewnętrzne sieci `db-network` i `proxy-network` — musisz je utworzyć przed uruchomieniem.

### Wymagania

- [Docker](https://www.docker.com/) z Docker Compose
- PostgreSQL dostępny w sieci `db-network` (np. osobny kontener)

### Kroki

1. **Utwórz wymagane sieci Docker** (jeśli jeszcze nie istnieją)

   ```bash
   docker network create db-network
   docker network create proxy-network
   ```

2. **Utwórz plik `.env`** w katalogu `docker/` na podstawie poniższego szablonu:

   ```env
   DB_CONNECTION_STRING=Host=postgres;Database=budgeto;Username=postgres;Password=twoje_haslo
   SEED_ADMIN_PASSWORD=TwojeHasloAdmina123!
   ```

3. **Zbuduj i uruchom kontenery**

   ```bash
   cd docker
   docker compose up -d --build
   ```

4. **Sprawdź status kontenerów**

   ```bash
   docker compose ps
   ```

   Powinieneś zobaczyć dwa uruchomione kontenery:

   ```
   budgeto-backend    running
   budgeto-frontend   running
   ```

### Zatrzymanie

```bash
docker compose down
```

### Zmienne środowiskowe

| Zmienna | Opis |
|---|---|
| `DB_CONNECTION_STRING` | Connection string do bazy PostgreSQL |
| `SEED_ADMIN_PASSWORD` | Hasło domyślnego konta administratora |

---

## Struktura projektu

```
src/
├── Domain/           # Encje, zdarzenia, value objects
├── Application/      # Komendy, zapytania (CQRS), interfejsy
├── Infrastructure/   # EF Core, baza danych, tożsamość
└── Web/
    ├── Endpoints/    # Minimal API endpoints
    └── ClientApp/    # Aplikacja React
docker/
├── Dockerfile        # Obraz backendu
├── Dockerfile.ui     # Obraz frontendu (Nginx)
├── docker-compose.yml
└── nginx.conf
```

---

## Licencja

Projekt udostępniony na licencji [PolyForm Noncommercial 1.0.0](LICENSE) — możesz pobierać, używać i modyfikować kod wyłącznie do celów niekomercyjnych.