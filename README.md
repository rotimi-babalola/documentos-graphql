# documentos-graphql

A GraphQL server for a document management application built with Javascript (Node)

To set up this project locally you need to have PostgreSQL installed on your machine.

Installing locally

- Clone this repository

```
git clone https://github.com/rotimi-babalola/documentos-graphql.git
```

- Install dependencies

```
npm i
```

Create a `.env` file following the template specified in the `.env.sample` file

- Create local database

```
createdb DATABASE_NAME
```

- Run database migrations & seeders

```
- npm run migrate

- npm run seed
```

- Run the app in dev mode

```
npm run start:dev
```

If all goes well you should see something like this:

```
`🚀  Server ready at http://localhost:5000/graphql`
```

Have fun!!!
