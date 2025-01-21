# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files to leverage Docker's layer caching
COPY package.json package-lock.json ./

# Install dependencies without running the postinstall script
RUN npm install --ignore-scripts

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npm run postinstall

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 4173

# Start the application
CMD ["npm", "run", "preview", "--", "--host"]
