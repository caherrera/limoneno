# Use a node image
FROM node AS builder
# Install yarn
RUN npm install yarn -g
# Define the work directory
WORKDIR /limoneno
# Copy the project
COPY . .
# Delete dev env file
RUN rm src/config/config.ts
# Put prod env file
RUN mv src/config/config.prod.ts src/config/config.ts 
# Install yarn
RUN yarn install
# Build the project
RUN yarn build

# Second container 
FROM nginx
# Delete the conf file
RUN rm -rf /etc/nginx/conf.d
# Copy the conf file
COPY conf /etc/nginx
# Copy from intermediate container
COPY --from=builder /limoneno/build /usr/share/nginx/html
# Expose the port
EXPOSE 80 
# Run the server
CMD ["nginx", "-g", "daemon off;"]