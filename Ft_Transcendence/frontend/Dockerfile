# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies (if any)
RUN npm install
COPY . .

# Install a lightweight web server to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 4141

# Set the command to run the web server and serve the static files
CMD ["serve", "-s", "./app", "-l", "4141", "--single"]