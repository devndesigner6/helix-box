FROM oven/bun:latest
WORKDIR /app
RUN mkdir -p /data
ENV MANAGER_DB_PATH=/data/manager.db
COPY manager/package.json ./
RUN bun install
COPY manager/ .
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
