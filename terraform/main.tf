resource "kubernetes_namespace" "Pratahouse" {
  metadata {
    name = var.NAMESPACE
  }
}

resource "kubernetes_secret" "gitlab_registry_access" {
  metadata {
    name = "gitlab-registry-access"
  }

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "registry.gitlab.com" = {
          auth = base64encode("${var.GITLAB_DEPLOYMENT_KEY}:${var.GITLAB_DEPLOYMENT_PASSWORD}")
        }
      }
    })
  }

  type = "kubernetes.io/dockerconfigjson"
}

resource "kubernetes_config_map" "dev_env" {
  metadata {
    name = "dev-env"
    labels = {
      service = "app-dev-env"
    }
  }

  data = {
    API_IDENTIFIER              = var.API_IDENTIFIER
    AUTH0_DOMAIN                = var.AUTH0_DOMAIN
    AUTHO_CLIENT_ID             = var.AUTHO_CLIENT_ID
    AUTHO_CLIENT_SECRET         = var.AUTHO_CLIENT_SECRET
    AWS_ACCESS_KEY_ID           = var.AWS_ACCESS_KEY_ID
    AWS_DEFAULT_REGION          = var.AWS_DEFAULT_REGION
    AWS_SECRET_ACCESS_KEY       = var.AWS_SECRET_ACCESS_KEY
    AWS_S3_UPLOAD_BUCKET        = var.AWS_S3_UPLOAD_BUCKET
    AWS_S3_RETRIEVE_BUCKET      = var.AWS_S3_RETRIEVE_BUCKET
    EMAIL_ADDRESS               = var.EMAIL_ADDRESS
    EMAIL_PASSWORD              = var.EMAIL_PASSWORD
    LOGO_IMAGE                  = var.LOGO_IMAGE
    M_TOPIC                     = var.M_TOPIC
    MILESTONE_ICON              = var.MILESTONE_ICON
    MONGO_DB_URL                = var.MONGO_DB_URL
    MONGODB_URL                 = var.MONGODB_URL
    PORT                        = var.PORT
    PORT_NUMBER                 = var.PORT_NUMBER
    R_TOPIC                     = var.R_TOPIC
    RECIPE_SERVICE_URL_INTERNAL = var.RECIPE_SERVICE_URL_INTERNAL
    RECIPE_URL                  = var.RECIPE_URL
    REVIEW_ICON                 = var.REVIEW_ICON
    REVIEW_URL                  = var.REVIEW_URL
    RMQ_EXCHANGE                = var.RMQ_EXCHANGE
    RMQ_EXCHANGE_TYPE           = var.RMQ_EXCHANGE_TYPE
    RMQ_URI                     = var.RMQ_URI
    SERVICE_QUEUE_NAME          = var.SERVICE_QUEUE_NAME
    TEST_MONGO_DB_URL           = var.TEST_MONGO_DB_URL
    TEST_MONGODB_HOST           = var.TEST_MONGODB_HOST
    USER_SERVICE_URL_INTERNAL   = var.USER_SERVICE_URL_INTERNAL
    USER_URL                    = var.USER_URL
    WEBSITE_URL                 = var.WEBSITE_URL
    API_GATEWAY_KEY             = var.API_GATEWAY_KEY
    SMTP_SERVER                 = var.SMTP_SERVER
    SMTP_PORT                   = var.SMTP_PORT
    MILESTONE_TEMPLATE_PATH     = var.MILESTONE_TEMPLATE_PATH
    REVIEW_TEMPLATE_PATH        = var.REVIEW_TEMPLATE_PATH
    EMAIL_IDENTITY              = var.EMAIL_IDENTITY
    RECIPE_MONGODB_URL          = var.RECIPE_MONGODB_URL
    S3_FOLDER                   = var.S3_FOLDER
    TEST_S3_FOLDER              = var.TEST_S3_FOLDER
    TEST_MONGO_URL              = var.TEST_MONGO_URL
    TESTING                     = var.TESTING
    USER_API_HOST               = var.USER_API_HOST
    USER_PORT                   = var.USER_PORT
  }
}

module "rabbitmq" {
  source = "./rabbitmq"
}

module "graphql" {
  source                 = "./graphql"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}

module "api-gateway" {
  source                 = "./api-gateway"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}

module "notification" {
  source                 = "./notifications"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}

module "recipe" {
  source                 = "./recipe"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}

module "review" {
  source                 = "./review"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}

module "users" {
  source                 = "./users"
  gitlab_registry_access = kubernetes_secret.gitlab_registry_access.metadata[0].name
}
