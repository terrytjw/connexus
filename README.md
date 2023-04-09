<p align="center">
    <img src="https://imgur.com/IrXxurC.png" alt="Connexus Logo" draggable="false" width="50%">
</p>

<h3 align="center">Empowering creators to develop authentic relationships with their fans.<br><br></h3>

<p align="center">
    Developed by Team TH01 for NUS IS4103: Information System Capstone Project. Developed with React, Next.js, Prisma and MySQL.</h3>
</p><br>

## What is Connexus?
All-in-one platform to empower creators to develop authentic relationships with their fans through NFT-powered Digital Ticket/Merchandise, Transparent Marketplace,
Social Channels for Fan Engagement and Fan Behavior Analytics.

<br>

## 🖥️ Quick Start

1. Download Docker from [Docker](https://www.docker.com/).
2. Ensure that Docker is running.
3. Run `yarn` to download dependencies.
4. Ensure that `POSTGRES_HOSTNAME=db` is uncommented in `.env` file.
4. Run `docker compose up`.
5. Open a separate terminal and type `docker compose exec app sh`. Type `yarn db:init` within the same terminal. 
6. Run `yarn dev` to run the local server for development, if `POSTGRES_HOSTNAME=localhost` is uncommented instead.
7. Clear the browser cookies before `Login`.

<br>

| System  | Localhost Link |
| :---:   | :---:   |
| Frontend  |`http://localhost:3000` |
| Backend  | `http://localhost:3000/api`  |
| Database GUI | `http://localhost:5555`  |

<br>

## ✨ Key Features

<b> 1. Events </b>
<p align="center">
    <img src="https://imgur.com/GehQKYX.png" alt="Events" draggable="false" width="70%">
</p>

<b> 2. Community </b>
<p align="center">
    <img src="https://imgur.com/JvmAulY.png" alt="Community" draggable="false" width="70%">
</p>

<b> 3. Merchandise </b>
<p align="center">
    <img src="https://imgur.com/kiVn8ZG.png" alt="Merchandise" draggable="false" width="70%">
</p>

<b> 4. Analytics </b>
<p align="center">
    <img src="https://imgur.com/PkT7wpW.png" alt="Analytics" draggable="false" width="70%">
</p>

<b> 5. Profile </b>
<p align="center">
    <img src="https://imgur.com/OsatjZN.png" alt="Profile" draggable="false" width="70%">
</p>


<br>

<h4 align=center>🎨 Take a look at our microsite 🎨</h4>
<p align=center><a class="button1" href="https://connexusofficial.vercel.app//">Connexus</a></p>


<br>

## 	💯 Core team
- [@ccwhgetgit](https://github.com/ccwhgetgit)
- [@kaiwenyay](https://github.com/kaiwenyay)
- [@laiweileeee](https://github.com/laiweileeee)
- [@niclqt](https://github.com/niclqt)
- [@terrytjw](https://github.com/terrytjw)
- [@shengliang-tham](https://github.com/shengliang-tham)
- [@yukineowq](https://github.com/yukineowq)

<br>

## 🔨 Directory layout (Include some of the more important folders with their explanation)

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
    
[⬆ Back to Top](#%EF%B8%8F-quick-start)
