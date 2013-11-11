class User < ActiveRecord::Base
  attr_accessible :email, :name

  has_many :authorizations, dependent: :destroy
  has_many :potholes, dependent: :destroy
  has_many :votes, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true
end
