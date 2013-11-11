require 'spec_helper'


describe Photo do
  let(:photo) {Photo.create(pothole_id: 1)}

  it 'should have a pothole id' do
    photo.should respond_to(:pothole_id)
  end


end