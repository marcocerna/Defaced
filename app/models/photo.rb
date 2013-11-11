class Photo < ActiveRecord::Base
  attr_accessible :image_source, :pothole_id, :user_id, :remote_image_url

  mount_uploader :image_source, ImageUploader

  belongs_to :user
  belongs_to :pothole

end
