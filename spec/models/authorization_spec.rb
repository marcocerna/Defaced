require 'spec_helper'


describe Authorization do
  let(:authorization) {Authorization.create(user: "TJ")}

  it 'should have a user' do
    authorization.should respond_to(:user)
  end


end