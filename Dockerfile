FROM node:alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

EXPOSE 2000
COPY . ./
CMD ["npm", "start"]