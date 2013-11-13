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
  render json: @pothole, status: 201
end

def destroy
  @pothole = Pothole.delete(params[:id])
  render json: @pothole
end

end
