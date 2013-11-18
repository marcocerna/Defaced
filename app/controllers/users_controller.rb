class UsersController < ApplicationController

  def index
    @user = User.find(current_user.id)
    @potholes = Pothole.all
    @photos = Photo.all
  end
end
