require 'spec_helper'


describe User do
  let(:user) {User.create(name: "Marco", email: "marco.a.cerna@gmail.com")}

  it 'should have a name' do
    user.should respond_to(:name)
  end


end