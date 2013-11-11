require 'spec_helper'


describe Vote do
  let(:vote) {Vote.create(pothole_id: 1, upvote: true, user_id: 1)}

  it 'should have an upvote value' do
    vote.should respond_to(:upvote)
  end


end