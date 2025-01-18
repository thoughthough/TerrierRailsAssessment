class CreateTechnicians < ActiveRecord::Migration[8.0]
  def change
    create_table :technicians do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
