class Vote < ActiveRecord::Base
  attr_accessible :pothole_id, :upvote, :user_id
  after_commit :count_the_votes, on: :create

  def count_the_votes
    VoteCountWorker.perform_async(self.pothole_id)
  end

  belongs_to :user
  belongs_to :pothole
end
