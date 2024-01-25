Rails.application.routes.draw do
  root to: 'orders#index'
  resources :orders, only:[:create]
end
