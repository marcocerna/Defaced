class VoteCountWorker
  include Sidekiq::Worker

  def perform(pothole_id)
    all_votes = Vote.where(pothole_id: pothole_id)

    upvote_total = 1
    downvote_total = 0

    all_votes.each do |vote|
      vote.upvote ? upvote_total += 1 : downvote_total += 1
    end

    vote = upvote_total - downvote_total

    pothole = Pothole.find(pothole_id)
    pothole.update_attributes(vote_count: vote)

  end

end
