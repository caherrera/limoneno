Sidekiq.configure_server do |config|
  template = ERB.new(File.new('config/redis.yml').read)
  redis_config = YAML.load(template.result(binding))[Rails.env]
  config.redis = {
    url: "redis://#{redis_config['host']}:#{redis_config['port']}/0"
  }

  concurrency = Sidekiq.options[:concurrency].to_i
  pool_size = (concurrency * 2).round(0)

  ActiveRecord::Base.configurations[Rails.env]['pool'] = pool_size
  ActiveRecord::Base.establish_connection
end
  
Sidekiq.configure_client do |config|
  template = ERB.new(File.new('config/redis.yml').read)
  redis_config = YAML.load(template.result(binding))[Rails.env]
  config.redis = {
    url: "redis://#{redis_config['host']}:#{redis_config['port']}/0"
  }
end