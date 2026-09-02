import type { ArchitectureSystem } from '../types'

export const CLOUD_IAC_SYSTEM: ArchitectureSystem =   {
    id: 'cloud-iac',
    title: 'Cloud IaC & DevSecOps Platform',
    badge: 'CLOUD / TERRAFORM',
    subtitle: 'Automated Multi-Tier AWS Infrastructure Provisioned via Reusable Terraform Modules',
    description:
      'Production cloud architecture featuring automated VPC isolation, Managed EKS clusters, Vault secrets management, and least-privilege IAM roles.',
    nodes: [
      {
        id: 'terraform',
        label: 'Terraform IaC Registry',
        category: 'Orchestration',
        protocol: 'HCL / API',
        tech: ['Terraform', 'Terragrunt', 'S3 State Backend'],
        description: 'Declarative infrastructure code with remote state locking in AWS DynamoDB.',
        specs: {
          layer: 'Infrastructure as Code',
          scaling: 'Modular Reusable Components',
          security: 'Encrypted State, Checkov Security Audits',
          observability: 'Plan diff inspection, Drift alerts'
        },
        codeSnippet: {
          filename: 'backend.tf',
          language: 'hcl',
          code: `terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
  backend "s3" {
    bucket         = "harshhaa-tf-state-prod"
    key            = "platform/vpc-eks/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}`
        },
        x: 12,
        y: 50
      },
      {
        id: 'vpc',
        label: 'AWS VPC Multi-AZ',
        category: 'Networking',
        protocol: 'IP / BGP',
        tech: ['AWS VPC', 'NAT Gateways', 'Private Subnets'],
        description: 'Isolated three-tier network architecture spanned across multiple Availability Zones.',
        specs: {
          layer: 'Cloud Network Core',
          scaling: 'CIDR Block /20 Allocation',
          security: 'Network ACLs, Private Route Tables',
          observability: 'VPC Flow Logs, CloudWatch Alarms'
        },
        codeSnippet: {
          filename: 'vpc.tf',
          language: 'hcl',
          code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.8"

  name = "prod-platform-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}`
        },
        x: 38,
        y: 50
      },
      {
        id: 'eks',
        label: 'EKS Managed Cluster',
        category: 'Compute Core',
        protocol: 'Kubernetes 1.30+',
        tech: ['Amazon EKS', 'Bottlerocket OS', 'Auto Mode'],
        description: 'Production control plane with managed node groups running security-hardened container OS.',
        specs: {
          layer: 'Container Orchestration',
          scaling: 'Cluster Autoscaler / Karpenter',
          security: 'OIDC IRSA (IAM Roles for Service Accounts)',
          observability: 'EKS Control Plane Audit Logs'
        },
        codeSnippet: {
          filename: 'eks.tf',
          language: 'hcl',
          code: `module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.14"

  cluster_name    = "prod-platform-eks"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access  = false
  cluster_endpoint_private_access = true

  eks_managed_node_groups = {
    bottlerocket = {
      ami_type       = "BOTTLEROCKET_x86_64"
      instance_types = ["m6i.xlarge"]
      min_size       = 3
      max_size       = 12
      desired_size   = 3
      labels         = { role = "general-workloads" }
    }
  }
}`
        },
        x: 65,
        y: 50
      },
      {
        id: 'vault',
        label: 'HashiCorp Vault & KMS',
        category: 'Security',
        protocol: 'mTLS / REST',
        tech: ['HashiCorp Vault', 'AWS KMS', 'External Secrets'],
        description: 'Centralized secrets management injecting ephemeral credentials directly into memory.',
        specs: {
          layer: 'Secrets & Cryptography',
          scaling: 'Consul Storage Cluster',
          security: 'Auto-unseal via KMS, Dynamic Secrets',
          observability: 'Audit access logs, Lease renewal metrics'
        },
        codeSnippet: {
          filename: 'vault.tf',
          language: 'hcl',
          code: `resource "vault_auth_backend" "aws" {
  type = "aws"
  tune {
    default_lease_ttl = "1h"
    max_lease_ttl     = "24h"
  }
}

resource "vault_aws_auth_backend_role" "eks_workloads" {
  backend                  = vault_auth_backend.aws.path
  role                     = "eks-production-role"
  auth_type                = "iam"
  bound_iam_principal_arns = [module.eks.cluster_iam_role_arn]
  token_policies           = ["production-read-secrets"]
}`
        },
        x: 88,
        y: 25
      },
      {
        id: 'storage',
        label: 'Cloud Persistence & RDS',
        category: 'Storage',
        protocol: 'Postgres / S3 API',
        tech: ['Amazon Aurora', 'AWS S3', 'EFS CSI'],
        description: 'Multi-AZ database clusters with automated snapshotting and encrypted object storage.',
        specs: {
          layer: 'Data Storage',
          scaling: 'Read Replicas, Auto-growing Storage',
          security: 'KMS Customer-Managed Keys (CMK)',
          observability: 'Enhanced Monitoring, Performance Insights'
        },
        codeSnippet: {
          filename: 'aurora-rds.tf',
          language: 'hcl',
          code: `module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 9.3"

  name           = "prod-platform-aurora"
  engine         = "aurora-postgresql"
  engine_version = "16.2"
  instance_class = "db.r6g.large"

  instances = {
    writer   = {}
    reader_1 = {}
    reader_2 = {}
  }

  vpc_id               = module.vpc.vpc_id
  db_subnet_group_name = module.vpc.database_subnet_group_name
  storage_encrypted    = true
  kms_key_id           = aws_kms_key.database.arn
}`
        },
        x: 88,
        y: 75
      }
    ],
    edges: [
      { from: 'terraform', to: 'vpc', protocol: 'AWS API', label: 'Provision' },
      { from: 'vpc', to: 'eks', protocol: 'ENI / CNI', label: 'Attach' },
      { from: 'eks', to: 'vault', protocol: 'IRSA / mTLS', label: 'Fetch Secrets' },
      { from: 'eks', to: 'storage', protocol: 'Private Subnet', label: 'Persist' }
    ],
    traceSteps: [
      {
        step: 1,
        title: 'Terraform Plan & Remote State',
        activeNodeId: 'terraform',
        toNodeId: 'vpc',
        action: 'S3 State Locking & DynamoDB Hash',
        narrative: 'Terraform reads locked state from S3, plans infrastructure changes, and executes validated AWS API calls.'
      },
      {
        step: 2,
        title: 'VPC Multi-AZ Provisioning',
        fromNodeId: 'terraform',
        activeNodeId: 'vpc',
        toNodeId: 'eks',
        action: '3-Tier Subnet & NAT Routing',
        narrative: 'AWS VPC provisions redundant public and private subnets across 3 Availability Zones with dedicated NAT Gateways.'
      },
      {
        step: 3,
        title: 'EKS Control Plane & Worker Nodes',
        fromNodeId: 'vpc',
        activeNodeId: 'eks',
        action: 'Bottlerocket OS & Auto Mode Node Group',
        narrative: 'Managed EKS cluster joins isolated private subnets, initializing security-hardened Bottlerocket worker nodes.'
      },
      {
        step: 4,
        title: 'HashiCorp Vault Secrets Injection',
        fromNodeId: 'eks',
        activeNodeId: 'vault',
        action: 'IAM OIDC IRSA Authentication',
        narrative: 'Pods authenticate via IRSA and dynamically retrieve short-lived database and API credentials from Vault in-memory.'
      },
      {
        step: 5,
        title: 'Aurora PostgreSQL Storage Tier',
        fromNodeId: 'eks',
        activeNodeId: 'storage',
        action: 'KMS-Encrypted Connection Pool',
        narrative: 'Workloads execute high-throughput transactions against Aurora Multi-AZ writer and reader replicas with automatic failover.'
      }
    ]
  }
