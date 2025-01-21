require 'csv'

namespace :import do
    desc "Import all CSV files: technicians, locations, work_orders"
    task all: :environment do
      Rake::Task['import:technicians'].invoke
      Rake::Task['import:locations'].invoke
      Rake::Task['import:work_orders'].invoke
    end
  
    desc "Import technicians CSV"
    task :technicians => :environment do
      require 'csv'
      csv_path = Rails.root.join('db', 'csv', 'technicians.csv')
  
      CSV.foreach(csv_path, headers: true) do |row|
        # row looks like: id = 1, name = Bilbo Baggins
        Technician.upsert(
          { id: row["id"], name: row["name"], created_at: Time.now, updated_at: Time.now },
          unique_by: :id
        )
      end
    end
  
    desc "Import locations CSV"
    task :locations => :environment do
      require 'csv'
      csv_path = Rails.root.join('db', 'csv', 'locations.csv')
  
      CSV.foreach(csv_path, headers: true) do |row|
        # row looks like: id = 1, name = Gandalf the Gray, city = Mor Dor 
        Location.upsert(
          { id: row["id"], name: row["name"], city: row["city"], created_at: Time.now, updated_at: Time.now },
          unique_by: :id
        )
      end
    end
  
    desc "Import work orders CSV"
    task :work_orders => :environment do
      require 'csv'
      csv_path = Rails.root.join('db', 'csv', 'work_orders.csv')
  
      CSV.foreach(csv_path, headers: true) do |row|
        # row looks like: id = 1, technician = 1, location_id = 1, time = 08:00, duration = 60, price = 120
        WorkOrder.upsert(
          {
            id: row["id"],
            technician_id: row["technician_id"], 
            location_id: row["location_id"], 
            start_time: Date.today.to_s + " " + row["time"],   # parse or combine as needed
            duration: row["duration"], 
            price: row["price"],
            created_at: Time.now,
            updated_at: Time.now
          },
          unique_by: :id
        )
      end
    end
  end
  