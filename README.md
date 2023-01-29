## Description

Salman Rizqi Fatih - Roketin NodeJS Engineer Test Case Submission

# Install dependencies

```bash
$ npm install
```

# Create the database inside docker container

```bash
$ docker run --name movies-postgres -dp 5435:5432 -e POSTGRES_USER=salmanrf -e POSTGRES_PASSWORD=wildflower123 -e POSTGRES_DB=movies -v movies-postgres:/var/lib/postgresql/data postgres -c listen_addresses="*"
```

# Run the server

```bash
$ npx tsc && node dist/index
```
