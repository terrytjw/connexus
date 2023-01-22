# A Typescript + Tailwind Next.js template

A template with all the libraries and configurations I love and use to build a fullstack app in <u>minutes<u/>.

## Quick Start

1. Download Docker from [Docker](https://www.docker.com/)
2. Ensure that Docker is running
3. Run `yarn` in the terminal to install dependencies
4. Initialize the database by running `yarn db:init`. Note: need to set the ```POSTGRES_HOSTNAME=localhost``` inside ```.env``` 
5. Run `docker compose up`

Frontend is deployed at `http://localhost:3000`
Backend is deployed at `http://localhost:3000/api`

If you wanna view database GUI, run `yarn db`, it will be deployed at `http://localhost:5555`
