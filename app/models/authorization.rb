class Authorization < ActiveRecord::Base
  attr_accessible :provider, :uid, :user, :user_id

  belongs_to :user

  validates :provider, presence: true
  validates :uid, presence: true

  def self.find_or_create(auth_hash)
	  unless auth = find_by_provider_and_uid(auth_hash["provider"], auth_hash["uid"])
	    user = User.create :name => auth_hash["user_info"]["name"], :email => auth_hash["user_info"]["email"]
	    auth = create :user => user, :provider => auth_hash["provider"], :uid => auth_hash["uid"]
	  end

	  auth

	end
end
