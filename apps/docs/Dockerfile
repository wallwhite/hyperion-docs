FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml .npmrc package.json turbo.json ./

COPY apps/docs/ ./apps/docs/

RUN pnpm install --frozen-lockfile

EXPOSE 3000
ENV PORT=3000

RUN pnpm build:openapi

# Start dev server
CMD ["pnpm", "turbo", "dev", "--filter=docs"]
