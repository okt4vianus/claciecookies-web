# ClacieCookies Web

ClacieCookies frontend web with React Router v7 Framework.

Links:

- <https://claciecookies.oktavianusrtasak.com>
- <https://claciecookies.vercel.app>

## Getting Started

### Installation

Install the dependencies:

```sh
bun install
```

### Development

Start the development server with HMR:

```sh
bun dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```sh
bun run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```sh
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `bun run build`

```
├── package.json
├── package-lock.json (or pbun-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
