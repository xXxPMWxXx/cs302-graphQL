variable "gitlab_registry_access" {}

resource "kubernetes_deployment" "graphql" {
  metadata {
    name = "graphql"
    labels = {
      service = "graphql"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        service = "graphql"
      }
    }
    template {
      metadata {
        labels = {
          service = "graphql"
        }
      }
      spec {
        container {
          image             = "registry.gitlab.com/cs302-2024/g1-team4/backend/graphql/main:latest"
          name              = "graphql"
          image_pull_policy = "Always"
          port {
            container_port = 4000
            protocol       = "TCP"
          }
          resources {
            requests = {
              cpu = "200m"
            }
            limits = {
              cpu = "400m"
            }
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "API_IDENTIFIER"
              }
            }
            name = "API_IDENTIFIER"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "AUTH0_DOMAIN"
              }
            }
            name = "AUTH0_DOMAIN"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "AUTHO_CLIENT_ID"
              }
            }
            name = "AUTHO_CLIENT_ID"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "AUTHO_CLIENT_SECRET"
              }
            }
            name = "AUTHO_CLIENT_SECRET"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "RECIPE_URL"
              }
            }
            name = "RECIPE_URL"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "REVIEW_URL"
              }
            }
            name = "REVIEW_URL"
          }
          env {
            value_from {
              config_map_key_ref {
                name = "dev-env"
                key  = "USER_URL"
              }
            }
            name = "USER_URL"
          }
        }
        image_pull_secrets {
          name = var.gitlab_registry_access
        }

        restart_policy = "Always"
      }
    }
  }
  timeouts {
    create = "5m"
  }
}

resource "kubernetes_service" "graphql" {
  metadata {
    name = "graphql"
    labels = {
      service = "graphql"
    }
  }
  spec {
    selector = {
      service = "graphql"
    }
    port {
      name        = "4000"
      port        = 4000
      target_port = 4000
    }
  }
  timeouts {
    create = "5m"
  }
}
