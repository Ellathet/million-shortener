# Million Shortener

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ellathet/million-shortener.git
cd million-shortener
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

- `MONGODB_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017/`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Your Google reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY` - Your Google reCAPTCHA secret key

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Working with Docker

You can run the app and MongoDB using Docker Compose:

```bash
docker-compose up --build
```

This will:
- Build the Next.js app using the `Dockerfile`
- Start a MongoDB container
- Expose the app on [http://localhost:3000](http://localhost:3000)

The `MONGODB_URI` is set automatically for the app container to connect to the MongoDB service.

### Stopping the containers

Press `Ctrl+C` in the terminal, then run:

```bash
docker-compose down
```

---

## Project Structure

- `src/app/` - Next.js app directory
- `src/lib/` - Utility libraries (MongoDB, reCAPTCHA, etc.)
- `src/models/` - Data models
- `src/components/` - React components

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.