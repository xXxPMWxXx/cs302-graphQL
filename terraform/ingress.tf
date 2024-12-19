resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name = "app-ingress"
    annotations = {
      "nginx.ingress.kubernetes.io/cors-allow-headers"      = "authorization, apikey, DNT,X-CustomHeader,X-LANG,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,X-Api-Key,X-Device-Id,Access-Control-Allow-Origin"
      "nginx.ingress.kubernetes.io/cors-allow-methods"      = "PUT, GET, POST, OPTIONS"
      "nginx.ingress.kubernetes.io/cors-allow-origin"       = "http://localhost:3000/myrecipe/add, http://localhost:3000"
      "nginx.ingress.kubernetes.io/enable-cors"             = "true"
      "nginx.ingress.kubernetes.io/cors-allow-credentials"  = "true"
      "nginx.ingress.kubernetes.io/default-backend"         = "ingress-nginx-controller"
      "kubernetes.io/ingress.class"                         = "nginx"
      "nginx.ingress.kubernetes.io/use-regex"               = "true"
    }
  }

  spec {
    rule {
      host = "localhost"

      http {
        # path for graphql service
        path {
          path      = "/graphql"
          path_type = "ImplementationSpecific"

          backend {
            service {
              name = "graphql"
              port {
                number = 4000
              }
            }
          }
        }
        # path for api-gateway service
        path {
          path      = "/api/v1/(recipes(/.*)?)"
          path_type = "ImplementationSpecific"

          backend {
            service {
              name = "api-gateway"
              port {
                number = 8080
              }
            }
          }
        }
      }
    }
  }
  timeouts {
    create = "5m"
  }
}
