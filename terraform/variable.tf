variable "NAMESPACE" {
  description = "The namespace to deploy the config map to"
  type        = string
  default     = "Pratahouse"
}

variable "API_IDENTIFIER" {
  description = "API identifier"
  type        = string
}

variable "AUTH0_DOMAIN" {
  description = "Auth0 domain"
  type        = string
}

variable "AUTHO_CLIENT_ID" {
  description = "Auth0 client ID"
  type        = string
  sensitive   = true
}

variable "AUTHO_CLIENT_SECRET" {
  description = "Auth0 client secret"
  type        = string
  sensitive   = true
}

variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
}

variable "AWS_DEFAULT_REGION" {
  description = "AWS default region"
  type        = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS secret access key"
  type        = string
  sensitive   = true
}

variable "EMAIL_ADDRESS" {
  description = "Email address"
  type        = string
}

variable "EMAIL_PASSWORD" {
  description = "Email password"
  type        = string
  sensitive   = true
}

variable "LOGO_IMAGE" {
  description = "Logo image URL"
  type        = string
}

variable "M_TOPIC" {
  description = "Milestone topic"
  type        = string
}

variable "MILESTONE_ICON" {
  description = "Milestone icon URL"
  type        = string
}

variable "MONGO_DB_URL" {
  description = "MongoDB URL for Review"
  type        = string
  sensitive   = true
}

variable "MONGODB_URL" {
  description = "MongoDB URL for User"
  type        = string
  sensitive   = true
}

variable "PORT" {
  description = "Service port"
  type        = string
}

variable "PORT_NUMBER" {
  description = "Port number"
  type        = string
}

variable "R_TOPIC" {
  description = "Review topic"
  type        = string
}

variable "RECIPE_SERVICE_URL_INTERNAL" {
  description = "Internal URL for Recipe service"
  type        = string
}

variable "RECIPE_URL" {
  description = "Recipe URL"
  type        = string
}

variable "REVIEW_ICON" {
  description = "Review icon URL"
  type        = string
}

variable "REVIEW_URL" {
  description = "Review URL"
  type        = string
}

variable "RMQ_EXCHANGE" {
  description = "RabbitMQ exchange"
  type        = string
}

variable "RMQ_EXCHANGE_TYPE" {
  description = "RabbitMQ exchange type"
  type        = string
}

variable "RMQ_URI" {
  description = "RabbitMQ URI"
  type        = string
  sensitive   = true
}

variable "SERVICE_QUEUE_NAME" {
  description = "Service queue name"
  type        = string
}

variable "TEST_MONGO_DB_URL" {
  description = "Test MongoDB URL"
  type        = string
  sensitive   = true
}

variable "TEST_MONGODB_HOST" {
  description = "Test MongoDB host"
  type        = string
  sensitive   = true
}

variable "USER_SERVICE_URL_INTERNAL" {
  description = "Internal URL for User service"
  type        = string
}

variable "USER_URL" {
  description = "User service URL"
  type        = string
}

variable "WEBSITE_URL" {
  description = "Website URL"
  type        = string
}

variable "API_GATEWAY_KEY" {
  description = "Rest API gateway"
  type        = string
}

variable "GITLAB_DEPLOYMENT_KEY" {
  description = "gitlab deployment key"
  type        = string
}

variable "GITLAB_DEPLOYMENT_PASSWORD" {
  description = "gitlab deployment password"
  type        = string
}

variable "GITLAB_REGISTRY_REVIEW_IMAGE" {
  description = "gitlab registry review image url"
  type        = string
}

variable "SMTP_SERVER" {
  description = "SMTP server"
  type        = string
}

variable "SMTP_PORT" {
  description = "SMTP port"
  type        = string
}

variable "MILESTONE_TEMPLATE_PATH" {
  description = "Milestone template path"
  type        = string
}

variable "REVIEW_TEMPLATE_PATH" {
  description = "Review template path"
  type        = string
}

variable "EMAIL_IDENTITY" {
  description = "Email for sending"
  type        = string
}

variable "RECIPE_MONGODB_URL" {
  description = "recipe mongodb url"
  type        = string
}

variable "S3_FOLDER" {
  description = "recipe S3 folder"
  type        = string
}

variable "TEST_S3_FOLDER" {
  description = "recipe test S3 folder"
  type        = string
}

variable "TEST_MONGO_URL" {
  description = "recipe test mongodb url"
  type        = string
}

variable "TESTING" {
  description = "recipe test env"
  type        = string
}

variable "AWS_S3_UPLOAD_BUCKET" {
  description = "AWS S3 upload bucket"
  type =string
}

variable "AWS_S3_RETRIEVE_BUCKET" {
  description = "AWS S3 retrieve bucket"
  type = string
}

variable "USER_API_HOST" {
  description = "User service API host uri"
  type = string
}

variable "USER_PORT" {
  description = "User service API port"
  type = string
}