class VotesController < ApplicationController

def create
  @vote = Vote.create(params[:vote])
  render json: @vote, status: 201
end

end
