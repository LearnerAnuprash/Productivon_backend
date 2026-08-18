FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

EXPOSE 4000

CMD ["pnpm", "start"]