# <img src="https://imgur.com/jQF5hm5.png" alt="Get Out of My Land Logo" draggable="false" width="50%">

_Empowering creators to develop authentic relationships with their fans._ <br><br>
Developed by Team TH01 for NUS IS4103: Information System Capstone Project. Developed with React, Next.js, Prisma and MySQL.


## Quick Start

1. Download Docker from [Docker](https://www.docker.com/).
2. Ensure that Docker is running.
3. Run `yarn` to download dependencies.
4. Run `docker compose up`.
5. Open a separate terminal and type `docker compose exec app sh`. Type `yarn db:init` within the same terminal. 
6. Run `yarn dev` to run the local server for development.
7. Clear the browser cookies before `Login`

Frontend is deployed at `http://localhost:3000`
Backend is deployed at `http://localhost:3000/api`
Database GUI, it will be deployed at `http://localhost:5555`

### Directory layout (Include some of the more important folders with their explanation)

    .
    ├── artifacts              # Contains our smart contract's ABI
    ├── components             # Contains your reusable components
    ├── contracts              # Contains our smart contract's actual code
    ├── lib                    # Contains global functions that we will be using
    ├── pages                  # Contains app's pages and the backend endpoints inside /api
    ├── prisma                 # Contains codes related to prisma (ORM)
    ├── prisma/seed.ts         # Contains seed file (test data)
    ├── public                 # Contains our assets
    ├── scripts                # Contain our smart contract's deployment script
    ├── styles                 # Global styles
    ├── types                  # Contain typings
    ├── utils                  # Utility functions
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
