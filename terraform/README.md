# README: Setting Up Minikube and Applying Terraform Configurations

This README provides instructions for setting up Minikube, enabling the necessary addons, and applying Terraform configurations to deploy resources on your local Kubernetes cluster.

- Download our `terraform.tfvars` file from S3, using this [link](https://assets-prata-house.s3.ap-southeast-1.amazonaws.com/Environment+File/terraform.tfvars)

<mark>This repository is for setting up the entire Prata House Project in `Prod`</mark>
- We recommend using [compose](https://gitlab.com/cs302-2024/g1-team4/compose) repo for `Dev` environment.

## Prerequisites

Before running the setup script, ensure that you have the following installed on your machine:

1. [Minikube](https://minikube.sigs.k8s.io/docs/start/)
2. [Kubectl](https://kubernetes.io/docs/tasks/tools/)
3. [Terraform](https://www.terraform.io/downloads.html)

## Script Overview

The provided script does the following:
1. **Starts Minikube**: Ensures that Minikube is up and running.
2. **Enables Minikube Addons**: Enables the `ingress` and `ingress-dns` addons in Minikube for traffic routing.
3. **Applies Terraform Configurations**: Initializes Terraform and applies any configuration files found in the current directory.
4. **Starts Minikube Tunnel**: Opens a tunnel for exposing services outside the cluster.

### Steps Performed to Set Up:

1. **Enter Correct Folder**:
   Before setting up the Minikube environment with Terraform, you will need to be in the `./terraform` folder.
   Place the `terraform.tfvars` file downloaded previously in the current folder.

2. **Minikube Start**:
   The script checks if Minikube is running and starts it if it's not:
   ```bash
   minikube start
   ```

1. **Enable Ingress and Ingress-DNS Addons**:
   These addons are essential for routing external traffic into the Kubernetes cluster:
   ```bash
   minikube addons enable ingress
   minikube addons enable ingress-dns
   minikube addons enable metrics-server
   ```

4. **Terraform Initialization and Application**:
   To initialize Terraform, enter the Terraform folder and apply the configurations defined in your Terraform files:
   ```bash
   terraform init
   terraform apply -auto-approve
   ```

5. **Minikube Tunnel**:
   Opens a tunnel, allowing external access to services deployed in Minikube:
   ```bash
   minikube tunnel
   ```
6. **External Testing**:
Only the graphql endpoint is configured to be the only exposed endpoint via Ingress. External testing can now be done`http://localhost/graphql`

This script will start Minikube, enable necessary addons, initialize and apply Terraform configurations, and open a tunnel for external service access.

## Troubleshooting

- **Minikube Issues**: If Minikube fails to start, ensure virtualization is enabled on your machine and that the correct hypervisor (e.g., VirtualBox, HyperKit, Docker) is installed.
- **Terraform Issues**: If Terraform fails, ensure your configuration files are in the correct directory and contain valid syntax. Use `terraform plan` for debugging before applying the configurations.

## Cleanup

To stop Minikube and clean up resources:
```bash
terraform destroy -auto-approve
minikube stop
```