# DB Compare — Angular Frontend

Angular 17 frontend for the DB Compare Java Spark API.

## Setup

```bash
npm install
ng serve
```

The app runs on **http://localhost:4200** and calls the API at **http://localhost:8080**.

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   └── compare.service.ts   # HTTP calls to all /api/compare/* endpoints
│   ├── app.component.ts         # Main component logic
│   ├── app.component.html       # Template
│   ├── app.component.scss       # Dark theme styles
│   └── app.module.ts            # Module with ReactiveFormsModule + HttpClientModule
├── styles.scss                  # Global styles + Google Fonts
├── index.html
└── main.ts
```

## Features
- Health check indicator (auto-polls `/api/health`)
- Side-by-side DB connection forms (Source / Target)
- Swap databases button
- Toggle comparison types: Tables, Columns, Data, Types, Functions, Procedures, Triggers
- Tabbed JSON result viewer with diff indicators
