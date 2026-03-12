# 💰 Budgeto

A personal budgeting web application built with **ASP.NET Core** and **Clean Architecture**, designed to help users track and manage their finances.

---

## 🏗️ Architecture

The project follows the [Clean Architecture](https://github.com/jasontaylordev/CleanArchitecture) pattern and is organized into the following layers:

```
src/
├── Domain/           # Enterprise business rules, entities, value objects
├── Application/      # Application business logic, use cases, CQRS handlers
├── Infrastructure/   # Data access, external services, persistence
└── Web/              # ASP.NET Core Web API + frontend (JavaScript/CSS)

tests/                # Unit, integration, functional and acceptance tests
docker/               # Docker configuration files
.devcontainer/        # Dev Container setup for VS Code
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (see `global.json` for required version)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Build

```bash
dotnet build -tl
```

### Run

```bash
cd .\src\Web\
dotnet watch run
```

Then navigate to [https://localhost:5001](https://localhost:5001). The app will automatically reload on source file changes.

---

## 🧪 Testing

The solution includes **unit**, **integration**, **functional**, and **acceptance** tests.

**Run all tests except acceptance tests:**

```bash
dotnet test --filter "FullyQualifiedName!~AcceptanceTests"
```

**Run acceptance tests:**

First, start the application:

```bash
cd .\src\Web\
dotnet run
```

Then, in a separate terminal:

```bash
dotnet test
```

---

## 🛠️ Code Scaffolding

The project supports scaffolding new CQRS use cases via the `ca-usecase` template.

Navigate to `.\src\Application\` and run:

**Create a new command:**

```bash
dotnet new ca-usecase --name CreateBudget --feature-name Budgets --usecase-type command --return-type int
```

**Create a new query:**

```bash
dotnet new ca-usecase -n GetBudgets -fn Budgets -ut query -rt BudgetsVm
```

> If you see *"No templates or subcommands found matching: 'ca-usecase'."*, install the template first:
> ```bash
> dotnet new install Clean.Architecture.Solution.Template::10.0.0-preview
> ```

---

## 🐳 Docker

Docker configuration is available in the `docker/` directory. You can use it to run the application in a containerized environment.

---

## ✏️ Code Style & Formatting

The project uses [EditorConfig](https://editorconfig.org/) to maintain consistent code style across different editors and IDEs. Configuration is defined in `.editorconfig` at the root of the repository.

---

## 📦 Package Management

NuGet packages are centrally managed via `Directory.Packages.props` (Central Package Management), ensuring consistent dependency versions across all projects in the solution.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core (C#) |
| Frontend | JavaScript / CSS / HTML |
| Database | Entity Framework Core (via Infrastructure layer) |
| Build | Cake (`build.cake`) |
| Containerization | Docker |
| Cloud (deployment) | Azure (`azure.yaml`) |
| Dev Environment | Dev Containers |

---

## 📁 Project Structure

```
Budgeto/
├── src/
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   └── Web/
├── tests/
├── docker/
├── .devcontainer/
├── Budgeto.slnx
├── Directory.Build.props
├── Directory.Packages.props
├── build.cake
├── global.json
└── azure.yaml
```

---

## 📄 License

This project is not yet licensed. Contact the author for usage rights.
