import type { ArchitectureSystem } from '../types'

export const GITOPS_K8S_SYSTEM: ArchitectureSystem = {
    id: 'gitops-k8s',
    title: 'GitOps & Kubernetes Platform (IDP)',
    badge: 'PLATFORM / GITOPS',
    subtitle: 'Internal Developer Platform (IDP) with Automated ArgoCD Sync and Zero-Trust Mesh',
    description:
      'Declarative cloud-native delivery pipeline: code commits to automated image scans, GitOps synchronization, and zero-downtime canary rollouts.',
    nodes: [
      {
        id: 'developer',
        label: 'Developer / Git Push',
        category: 'Source',
        protocol: 'SSH / Git',
        tech: ['Git', 'GitHub', 'Feature Branch'],
        description: 'Engineers commit code and infrastructure manifests via pull requests.',
        specs: {
          layer: 'Source Control',
          scaling: 'Distributed',
          security: 'Signed Commits (GPG), Branch Protection',
          observability: 'PR lead time, Commit velocity'
        },
        codeSnippet: {
          filename: 'git-commit-hook.sh',
          language: 'bash',
          code: `#!/usr/bin/env bash
# Pre-commit verification & GPG signing
set -euo pipefail

echo "==> Validating Kubernetes manifests with kubeconform..."
kubeconform -strict -summary -kubernetes-version 1.30.0 manifests/

echo "==> Running security linter with Checkov..."
checkov -d manifests/ --framework kubernetes --quiet

echo "==> Ensuring GPG commit signature..."
git config commit.gpgsign true`
        },
        x: 10,
        y: 50
      },
      {
        id: 'ci-pipeline',
        label: 'GitHub Actions CI',
        category: 'Automation',
        protocol: 'Runner Webhook',
        tech: ['GitHub Actions', 'Trivy', 'Docker Buildx'],
        description: 'Runs unit tests, static code analysis, vulnerability scanning, and pushes multi-arch images.',
        specs: {
          layer: 'Continuous Integration',
          scaling: 'Ephemeral Self-hosted Runners',
          security: 'Cosign Image Signatures, SBOM Generation',
          observability: 'Build duration, Test pass rate'
        },
        codeSnippet: {
          filename: '.github/workflows/ci-build.yaml',
          language: 'yaml',
          code: `name: Production Multi-Arch CI Pipeline
on:
  push:
    branches: [ main ]

jobs:
  build-and-sign:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - name: Build and Push OCI Image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ghcr.io/harshhaa/app:\${{ github.sha }}
      - name: Generate SBOM & Sign with Cosign
        run: |
          syft ghcr.io/harshhaa/app:\${{ github.sha }} -o spdx-json > sbom.spdx.json
          cosign sign --yes ghcr.io/harshhaa/app:\${{ github.sha }}`
        },
        x: 32,
        y: 50
      },
      {
        id: 'argocd',
        label: 'ArgoCD GitOps Controller',
        category: 'GitOps Engine',
        protocol: 'K8s API / gRPC',
        tech: ['ArgoCD', 'Helm', 'Kustomize'],
        description: 'Monitors desired state in Git and reconciles differences in live Kubernetes clusters.',
        specs: {
          layer: 'Continuous Delivery',
          scaling: 'High Availability Multi-Replica',
          security: 'K8s RBAC, Read-Only Git Tokens',
          observability: 'Sync status, Drift detection alert'
        },
        codeSnippet: {
          filename: 'argocd-application.yaml',
          language: 'yaml',
          code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-platform-workloads
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: 'https://github.com/NotHarshhaa/gitops-manifests.git'
    targetRevision: HEAD
    path: environments/production
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ApplyOutOfSyncOnly=true`
        },
        x: 55,
        y: 50
      },
      {
        id: 'ingress',
        label: 'Ingress & Gateway API',
        category: 'Network',
        protocol: 'HTTP/3 / TLS 1.3',
        tech: ['NGINX Ingress', 'Envoy Gateway', 'Cert-Manager'],
        description: 'Manages external routing, SSL termination, and automated Let\'s Encrypt certificates.',
        specs: {
          layer: 'Cluster Ingress',
          scaling: 'DaemonSet / NLB Integration',
          security: 'Strict HTTPS, Automated Cert Renewals',
          observability: 'Ingress error codes (5xx/4xx), QPS'
        },
        codeSnippet: {
          filename: 'ingress-route.yaml',
          language: 'yaml',
          code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "64m"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.harshhaa.dev
      secretName: api-harshhaa-tls
  rules:
    - host: api.harshhaa.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: platform-service
                port: { number: 8080 }`
        },
        x: 82,
        y: 22
      },
      {
        id: 'workloads',
        label: 'K8s Workloads & Pods',
        category: 'Compute',
        protocol: 'TCP / mTLS',
        tech: ['Kubernetes', 'HPA', 'Linkerd Mesh'],
        description: 'Stateless microservices auto-scaled based on CPU, memory, and custom Prometheus metrics.',
        specs: {
          layer: 'Application Runtime',
          scaling: 'Horizontal Pod Autoscaler (HPA)',
          security: 'Non-root containers, NetworkPolicies',
          observability: 'Pod restart count, CPU/Memory throttle'
        },
        codeSnippet: {
          filename: 'deployment-hpa.yaml',
          language: 'yaml',
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: core-workload
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: app
          image: ghcr.io/harshhaa/app:v1.4.0
          securityContext:
            allowPrivilegeEscalation: false
            capabilities: { drop: ["ALL"] }
            readOnlyRootFilesystem: true
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits: { cpu: 1000m, memory: 1Gi }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: core-workload-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: core-workload
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 75 }`
        },
        x: 82,
        y: 50
      },
      {
        id: 'observability',
        label: 'Telemetry & SRE Stack',
        category: 'Monitoring',
        protocol: 'PromQL / OTLP',
        tech: ['Prometheus', 'Grafana', 'Loki'],
        description: 'Scrapes container metrics, aggregates structured logs, and routes critical alerts to Slack/PagerDuty.',
        specs: {
          layer: 'Observability & Telemetry',
          scaling: 'Thanos long-term storage',
          security: 'Encrypted S3 bucket storage',
          observability: 'SLO / SLA Burn Rate, MTTD / MTTR'
        },
        codeSnippet: {
          filename: 'prometheus-slo-rules.yaml',
          language: 'yaml',
          code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: platform-slo-alerts
  namespace: monitoring
spec:
  groups:
    - name: platform.slo.rules
      rules:
        - alert: HighErrorRateSLOBurn
          expr: |
            (sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))) > 0.01
          for: 2m
          labels:
            severity: page
            tier: platform
          annotations:
            summary: "Error rate is breaching 99% availability SLO target."`
        },
        x: 82,
        y: 78
      }
    ],
    edges: [
      { from: 'developer', to: 'ci-pipeline', protocol: 'git push', label: 'Commit' },
      { from: 'ci-pipeline', to: 'argocd', protocol: 'Manifest update', label: 'Git Sync' },
      { from: 'argocd', to: 'ingress', protocol: 'K8s API', label: 'Reconcile' },
      { from: 'argocd', to: 'workloads', protocol: 'K8s API', label: 'Apply' },
      { from: 'workloads', to: 'observability', protocol: 'OTLP / Metrics', label: 'Scrape' }
    ],
    traceSteps: [
      {
        step: 1,
        title: 'Developer Commit',
        activeNodeId: 'developer',
        toNodeId: 'ci-pipeline',
        action: 'SSH Push with GPG Signatures',
        narrative: 'Engineer pushes signed Git commit to release branch with automated pre-commit lint validation.'
      },
      {
        step: 2,
        title: 'Continuous Integration Build',
        fromNodeId: 'developer',
        activeNodeId: 'ci-pipeline',
        toNodeId: 'argocd',
        action: 'Multi-Arch Build & Vulnerability Scan',
        narrative: 'GitHub Actions executes Trivy security scan, builds OCI multi-arch image, signs with Cosign, and commits updated image tag.'
      },
      {
        step: 3,
        title: 'ArgoCD Declarative Reconcile',
        fromNodeId: 'ci-pipeline',
        activeNodeId: 'argocd',
        toNodeId: 'workloads',
        action: 'K8s API State Sync',
        narrative: 'ArgoCD detects Git repository update, diffs live cluster state against desired state, and triggers automated self-healing sync.'
      },
      {
        step: 4,
        title: 'Ingress & TLS Certificate Validation',
        fromNodeId: 'argocd',
        activeNodeId: 'ingress',
        action: 'Envoy Gateway / Cert-Manager Route',
        narrative: 'Cluster Ingress establishes TLS 1.3 termination, checks cert renewal via Cert-Manager, and configures upstream service routing.'
      },
      {
        step: 5,
        title: 'Zero-Downtime Workload Rollout',
        fromNodeId: 'argocd',
        activeNodeId: 'workloads',
        toNodeId: 'observability',
        action: 'RollingUpdate & HPA Allocation',
        narrative: 'Kubernetes performs zero-downtime rolling update with Linkerd mTLS mesh injection, scaling dynamically via HPA.'
      },
      {
        step: 6,
        title: 'Telemetry & SRE Health Telemetry',
        fromNodeId: 'workloads',
        activeNodeId: 'observability',
        action: 'OTel Tracing & Prometheus Scraping',
        narrative: 'Prometheus and Loki scrape container metrics and logs; Grafana verifies SLO burn rates and cluster health status.'
      }
    ]
  }
