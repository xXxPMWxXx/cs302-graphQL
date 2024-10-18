# Use the official Node.js 20 slim image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build arguments
ARG AUTH0_DOMAIN
ARG AUTHO_CLIENT_ID
ARG AUTHO_CLIENT_SECRET
ARG API_IDENTIFIER
ARG USER_URL
ARG RECIPE_URL
ARG REVIEW_URL

# Set environment variables
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV AUTHO_CLIENT_ID=$AUTHO_CLIENT_ID
ENV AUTHO_CLIENT_SECRET=$AUTHO_CLIENT_SECRET
ENV API_IDENTIFIER=$API_IDENTIFIER
ENV USER_URL=$USER_URL
ENV RECIPE_URL=$RECIPE_URL
ENV REVIEW_URL=$REVIEW_URL

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]