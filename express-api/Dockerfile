FROM node:20-alpine

WORKDIR /app

# Copy dependency specifications
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY . .

# Ensure storage directories exist
RUN mkdir -p storage/templates storage/evidences

EXPOSE 5000

CMD ["node", "src/server.js"]
