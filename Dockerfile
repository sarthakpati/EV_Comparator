FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm etl && pnpm build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g sirv-cli
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "sirv dist --host 0.0.0.0 --port ${PORT} --single"]
