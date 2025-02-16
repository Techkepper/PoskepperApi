## 🛠️ Stack

- [**Typescript**](https://www.typescriptlang.org/) - JavaScript with syntax for types.
- [**Prettier**](https://prettier.io/) - An opinionated code formatter.
- [**ESLint**](https://eslint.org/) - Find and fix problems in your JavaScript code.
- [**Husky**](https://typicode.github.io/husky) + [**Lint-Staged**]
- [**Jest**](https://jestjs.io/) - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [**Tailwindcss**](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [**Next.js**](https://nextjs.org/) - The React Framework for Production.
- [**Express**](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [**Prisma**](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
- [**Swagger**](https://swagger.io/) - Simplify API development with an open-source API documentation tool.

## 🚀 Getting Started

> [!IMPORTANT]
> Before submitting the pull request, **make sure that you have permission**. If you are not sure, please contact the company or author.

You will need:

- [Node.js 18+ (recommended 20 LTS)](https://nodejs.org/en/).
- [Git](https://git-scm.com/).

1. [Fork](https://github.com/Techkepper/PoskepperWeb/fork) this repository and clone it locally:

```bash
git clone git@github.com:your_username/PoskepperWeb.git
```

2. Install dependencies:

```bash
# Install npm globally if you don't have it:
npm install -g npm

# and install dependencies in the root directory:
npm install

# then install dependencies in the client directory:
cd client
npm install --f

# go back to the root directory:
cd ..

# install dependencies in the server directory:
cd server
npm install
```

3. Create a **.env** file in server folder with the following content:
   > 🚧 The environment variables must match the following [schema](https://github.com/Techkepper/PoskepperWeb/blob/main/server/.env.example).

```bash
# Variables de entorno para el servidor
DATABASE_URL=""
PORT=3000

# Variables de entorno para el cliente
ORIGIN="http://localhost:5000"

# Variables de entorno para JWT
JWT_SECRET=""

# Variables de entorno para el envio de correos
EMAIL_USER=""
EMAIL_PASS=""
EMAIL_SERVICE=""
EMAIL_FROM=""
```


4. Run the development server:

```bash
# Run the server
cd server
npm run dev

# Run the client
cd client
npm run dev
```

5. Open [http://localhost:3000/api/docs/](http://localhost:3000/api/docs/) with your browser to see the api documentation.

6. Open [http://localhost:5000/](http://localhost:5000/) with your browser to see the web application.
