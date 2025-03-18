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
docker ps (to find id of deadbook_db)
docker exec -it {deadbook_db_contaier_id}
cd backend
pytest
```
