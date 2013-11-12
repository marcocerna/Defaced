class PotholesController < ApplicationController

def index
  @potholes = Pothole.all
  @pothole = Pothole.new

  respond_to do |format|
    format.html
    format.json {render json: @potholes}
  end
end

def create
  @pothole = Pothole.create(params[:pothole])
  redirect_to potholes_path
end


end
