# We use rails image 
FROM ruby:2.6.3
# Update local repository and install dependencies
# RUN apt-get update && rm -rf /var/lib/apt/lists/*
# RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
# RUN apt-get install -y nodejs
# Install Apidoc
# RUN npm install apidoc -g
# Set thot like work folder
WORKDIR /limoneno
# Copy the gemfile to run the install of dependencies 
COPY Gemfile* ./
# Run the install of dependencies
RUN bundle install
# Copy the app into the container
COPY . .
# Run the apidoc to make the api documentation
# RUN ["apidoc", "-o", "public/api"]
# replace the env file
RUN mv .env.production .env
# Expose port 5000 to
EXPOSE 5000
# run DB migrations
#RUN rake db:create db:migrate
# Run the app
CMD ["bash", "-c", "rake db:create db:migrate db:seed && foreman start"] 
