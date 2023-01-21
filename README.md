# A Typescript + Tailwind Next.js template

A template with all the libraries and configurations I love and use to build a fullstack app in <u>minutes<u/>.

## Quick Start

1. Download Docker from [Docker](https://www.docker.com/)
2. Ensure that Docker is running
3. Run `docker compose up`
4. These are the following links
   - Frontend is deployed at `http://localhost:3000`
   - Database is deployed at `http://localhost:5432`
   - Database GUI is deployed at `http://localhost:4000`
     1. If you wanna use this GUI to see the list of tables, go to the link and login with `abc@abc.com` and `123`
     2. Register new server
        - Under General Tab, put `database` in name field
        - Under Connection,
          1. Put `postgres` in the host name/address
          2. Put `5432` in the port
          3. Put `postgres` for both username and password
        - Click save
     3. Navigate to CreatorEconomy > Databases > postgres > Schemas > public > Tables
