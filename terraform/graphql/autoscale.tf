resource "kubernetes_horizontal_pod_autoscaler_v2" "graphql" {
  metadata {
    name      = "graphql"
    namespace = "default"
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = "graphql"
    }

    min_replicas = 1
    max_replicas = 2

    metric {
      type = "ContainerResource"

      container_resource {
        container = "graphql"
        name      = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 80
        }
      }
    }
  }
}
