
# Technical Test Project

This is the source code for the Hahn Software technical test project.
## Features
**Authentication**

* Login using email + password
* JWT-based authentication
* API routes are protected

**Projects**

* CRUD for projects.
* List of user projects.
* View project details.
* View project progress.
* Search projects.

**Tasks**

* CRUD for tasks.
* List tasks per project
* Mark tasks as completed.
* Search tasks.
## Tools Used
**Backend**
* .NET 10
* Entity Framework
  
**Frontend**
* React
* TailwindCSS
  
**Database**
* SQL Server
## Running the Project

The entire project (backend, frontend, and database) is containerized and can be started with a command using Docker Compose.
```
docker compose up --build
```
> [!NOTE]
> Make sure that ports 1433, 5000, and 3000 are open.

> [!WARNING]
> The server can start before the database. If so, restart the server container after the database container is done.

### How to Run Backend
```
docker compose up --build server
```
The API will be available at: http://localhost:5000  
- I have used Scalar in this project during development which can be accessed at: http://localhost:5000/scalar/v1 to view the endpoints.

### How to Run Frontend
```
docker compose up --build client
```
The app will be available at: http://localhost:3000  

### Database Setup
```
docker compose up --build db
```
The SQL Server listens on port 1433.  
- Connection string used by backend can be changed in docker-compose.yml  
- Database migrations are applied automatically on backend startup.  
- SQL Server data is persisted in a Docker volume.

https://www.youtube.com/watch?v=-j6dexpQIGI
