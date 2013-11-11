PotholePatrol::Application.routes.draw do

  get '/login', to: 'sessions#new', as: :login
  match '/auth/:provider/callback', to: 'sessions#create'
  match '/auth/failure', to: 'sessions#failure'

  get '/logout', to: 'sessions#destroy'
end
