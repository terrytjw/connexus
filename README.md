# Connexus

_Empowering creators to develop authentic relationships with their fans._

## Quick Start

1. Download Docker from [Docker](https://www.docker.com/)
2. Ensure that Docker is running
3. Run `yarn` to download dependencies
4. Run `docker compose up`
5. Initialize/Reset the database by running `yarn db:init`. Note: Whenver you are doing this, you will need to set the `POSTGRES_HOSTNAME=localhost` inside `.env`. Remember to change back to `POSTGRES_HOSTNAME=db` when you are done.

Frontend is deployed at `http://localhost:3000`
Backend is deployed at `http://localhost:3000/api`
Database GUI, it will be deployed at `http://localhost:5555`

### Directory layout

    .
    ├── components             # Contains your reusable components
    ├── lib                    # Contains global functions that we will be using
    ├── pages                  # Contains app's pages and the backend endpoints inside /api
    ├── prisma                 # Contains codes related to prisma (ORM)
    ├── public                 # Contains our assets
    ├── styles                 # Global styles
    ├── .dockerignore          # Code to ignore while deploying to docker
    ├── .env                   # Environment variables
    ├── .eslintrc.json         # Linting settings
    ├── .gitignore             # Code to ignore while deploying to GIT
    ├── docker-compose.yml     # Code to manage different containers
    ├── Dockerfile             # Code to manage deploying frontend as a image
    ├── next.config.js         # Configuring NextJS
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    └── tsconfig.json
