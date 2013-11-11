class Pothole < ActiveRecord::Base
  attr_accessible :description, :latitude, :longitude, :name, :user_id, :vote_count

  has_many :votes, dependent: :destroy
  has_many :photos, dependent: :destroy
  belongs_to :user
end
