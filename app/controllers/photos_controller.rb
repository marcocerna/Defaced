class PhotosController < ApplicationController
  def index
    @photos = Photo.all || "photos"
    @uploader = Photo.new.image_source
    @uploader.success_action_redirect = new_photo_url
  end

  def new
    @photo = Photo.new(key: params[:key])
  end

  def create
    @photo = Photo.create(params[:photo])
    redirect_to photos_path
  end

  def show
    @photo = Photo.find(params[:id])
  end

  def destroy
    Photo.delete(params[:id])
    redirect_to photos_path
  end




end
