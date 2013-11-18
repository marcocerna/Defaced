class UsersController < ApplicationController

  def index
    if current_user
      @user = User.find(current_user.id)
      @potholes = Pothole.all
      @photos = Photo.all
    else
      redirect_to "/"
    end
  end
end
