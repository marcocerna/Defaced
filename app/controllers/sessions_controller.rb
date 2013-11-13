class SessionsController < ApplicationController
  def new
  end

  def create
    auth_hash = request.env['omniauth.auth']
   
    if session[:user_id]
      User.find(session[:user_id]).add_provider(auth_hash)
   
      render :text => "You have logged in using #{auth_hash["provider"].capitalize}!"
    else
      auth = Authorization.find_or_create(auth_hash)
   
      session[:user_id] = auth.user.id
   
      render :text => "Welcome #{auth.user.name}!"
    end
  end

  def failure
    render :text => "Sorry, but you didn't allow access to our app!"
  end

  def destroy
    session[:info] = nil
    render :text => "You've logged out!"
  end
end