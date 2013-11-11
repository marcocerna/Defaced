class PhotosController < ApplicationController
  def index
    @photos = Photo.all || "photos"
  end

  def new
    @photo = Photo.new
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
