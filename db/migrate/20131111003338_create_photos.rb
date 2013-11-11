class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :image_source
      t.integer :pothole_id
      t.integer :user_id
      t.string :remote_image_url

      t.timestamps
    end
  end
end
