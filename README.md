## Run with Docker:


**Build container**
```
docker-compose -f docker-compose.dev.yml -p deadbook-app-dev build
```

**Run container**
```
docker-compose -f docker-compose.dev.yml -p deadbook-app-dev up
```

**Run tests**
```
# Make sure to Build & Run container...

# Find id of "deadbook_db"
docker ps (to find id of deadbook-app-dev-backend)

# Connect to it
docker exec -it {deadbook-app-dev-backend_id} bash

# Navigate to "backend" directory
cd backend

# Run tests
pytest
```
