# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server.js file to the working directory
COPY server.js .

# Expose the port on which the server will listen (change it to the appropriate port number)
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]
