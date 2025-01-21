# Set the number of threads Puma will use
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

# Set the port that Puma will listen on (provided by Render)
port ENV.fetch("PORT") { 3000 }

# Set the environment Puma will run in
environment ENV.fetch("RAILS_ENV") { "production" }

# Allow Puma to be restarted by `bin/rails restart` command
plugin :tmp_restart

# Run the Solid Queue supervisor inside of Puma for single-server deployments
plugin :solid_queue if ENV["SOLID_QUEUE_IN_PUMA"]

# Specify the PID file for Puma
pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

# Use clustered mode for multiple workers in production
workers ENV.fetch("WEB_CONCURRENCY") { 2 } if ENV["RAILS_ENV"] == "production"

# Preload the application for clustered mode
preload_app! if ENV["RAILS_ENV"] == "production"

# Establish database connection on worker boot
on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
