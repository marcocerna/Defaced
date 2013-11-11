require 'spec_helper'


describe Pothole do
  let(:pothole) {Pothole.create(name: "Marco", description: "This is my pothole", user_id: 1, vote_count: 1)}

  it 'should have a name' do
    pothole.should respond_to(:name)
  end


end

# Instructions on how to set up Rspec:

# $ bundle
# $ bundle exec rake db:migrate
# $ bundle exec rake db:test:prepare

# To run tests:

# $ bundle exec rspec