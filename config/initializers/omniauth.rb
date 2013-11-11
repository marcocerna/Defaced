Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, "1429168373963949", "23909517dd99ccb6caa132216b6fe279"
end