PotholePatrol::Application.routes.draw do
  root to: "potholes#index"

  match "/auth/twitter/callback" => "sessions#create"
  match "/auth/facebook/callback" => "sessions#create"
  match "/signout" => "sessions#destroy", :as => :signout

  resources :photos, :potholes, :votes
end
