class ChangeLatLngToIntegers < ActiveRecord::Migration
  def change
    remove_column :potholes, :latitude
    add_column :potholes, :latitude, :float

    remove_column :potholes, :longitude
    add_column :potholes, :longitude, :float
  end

end
