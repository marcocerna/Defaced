class CreatePotholes < ActiveRecord::Migration
  def change
    create_table :potholes do |t|
      t.string :name
      t.string :description
      t.string :latitude
      t.string :longitude
      t.integer :user_id
      t.integer :vote_count

      t.timestamps
    end
  end
end
