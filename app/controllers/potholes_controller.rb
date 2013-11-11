class PotholesController < ApplicationController

def index
  @potholes = Pothole.all
  @pothole = Pothole.new
end

def create
  @pothole = Pothole.create(params[:id])
  redirect_to potholes_path
end


end
