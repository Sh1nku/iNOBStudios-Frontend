FROM node:18 AS build
# install dependencies
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build


FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/build /app/package.json /app/package-lock.json ./
# I can't see how to embed runtime packages directly in the build folder with VITE. Therefore these need to be installed in the prod image as well
RUN npm ci --prod
EXPOSE 3000
CMD ["node", "."]