class Photo < ActiveRecord::Base
  attr_accessible :image_source, :pothole_id, :user_id, :remote_image_url

  mount_uploader :image_source, ImageUploader

  after_save :enqueue_image

  belongs_to :user
  belongs_to :pothole

  def image_name
    File.basename(image_source.path || image_source.filename) if image_source
  end

  def enqueue_image
    ImageWorker.perform_async(id, key) if key.present? && !image_processed?
  end

  class ImageWorker
    include Sidekiq::Worker

    def perform(id, key)
      photo = Photo.find(id)
      photo.key = key
      photo.remote_image_url = photo.image_source.direct_fog_url(with_path: true)
      photo.image_source.recreate_versions!(:thumb)
      photo.image_processed = true
      photo.save!
    end
  end

  def as_json(opts = {})
    super.merge(thumbnail_url: image_source.url(:thumb))
  end
end
