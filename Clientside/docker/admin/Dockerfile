FROM node:alpine as dependencies
WORKDIR /app
COPY Admin/package.json ./
RUN yarn install --frozen-lockfile

FROM node:alpine as builder
WORKDIR /app
COPY Admin/. .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

FROM node:alpine as runner
WORKDIR /app
ENV NODE_ENV=production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]