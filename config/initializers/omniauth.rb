Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, "1429168373963949", "23909517dd99ccb6caa132216b6fe279"
  provider :twitter, "ZHGSXE3E4jreRZiPKDhdw", "E03CT6qfNIhGAZnX1qFPnwCCEiViEyrcE2sB8yAPB5w"
end