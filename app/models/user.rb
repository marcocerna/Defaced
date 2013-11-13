class User < ActiveRecord::Base
  attr_accessible :email, :name

  has_many :authorizations, dependent: :destroy
  has_many :potholes, dependent: :destroy
  has_many :votes, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true

	def add_provider(auth_hash)
	  unless authorizations.find_by_provider_and_uid(auth_hash["provider"], auth_hash["uid"])
	    Authorization.create :user => self, :provider => auth_hash["provider"], :uid => auth_hash["uid"]
	  end
	end

end
