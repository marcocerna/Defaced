class AddImageProcessedToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :image_processed, :boolean
  end
end
