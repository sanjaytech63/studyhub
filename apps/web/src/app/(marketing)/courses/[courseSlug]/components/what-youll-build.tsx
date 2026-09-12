import React from 'react';
import { Layers, Server, Database, Zap, ArrowRight } from 'lucide-react';

interface WhatYoullBuildProps {
  readonly outcomeDescription?: string | null;
}

export function WhatYoullBuild({ outcomeDescription }: WhatYoullBuildProps) {
  return (
    <section aria-labelledby="build-heading" className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          Real-World Capstone Project
        </div>
        <h2
          id="build-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          What You&apos;ll Build
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          {outcomeDescription ||
            'Architect and deploy a production-grade multi-tenant platform with microservices, event queues, and Kubernetes orchestration.'}
        </p>
      </div>

      {/* Visual Architecture Diagram */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <span className="text-xs font-mono font-medium text-muted-foreground">
            SYSTEM_ARCHITECTURE_TOPOLOGY
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-500 border border-emerald-500/20">
            PROD_READY
          </span>
        </div>

        {/* Responsive Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Node 1: Client */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Client Apps</h4>
            <p className="text-xs text-muted-foreground">
              Next.js 15 SSR &amp; Customer Storefront
            </p>
          </div>

          <div className="hidden md:flex justify-center text-muted-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 2: Gateway */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Server className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">API Gateway</h4>
            <p className="text-xs text-muted-foreground">Reverse Proxy, Rate Limits &amp; RBAC</p>
          </div>

          <div className="hidden md:flex justify-center text-muted-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 3: Microservices */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Microservices</h4>
            <p className="text-xs text-muted-foreground">Auth, Catalog, Order &amp; Payment</p>
          </div>

          <div className="hidden md:flex justify-center text-muted-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 4: Persistence & Cloud */}
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Data &amp; Cloud</h4>
            <p className="text-xs text-muted-foreground">Postgres, Redis, Kafka &amp; K8s</p>
          </div>
        </div>

        {/* Core Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-foreground">Multi-Tenant Isolation</h5>
            <p className="text-xs text-muted-foreground">
              Tenant context scoping and role-based permissions
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-foreground">Event-Driven Asynchrony</h5>
            <p className="text-xs text-muted-foreground">
              Decoupled queue workers for emails and heavy computations
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-foreground">Kubernetes Deployment</h5>
            <p className="text-xs text-muted-foreground">
              Ingress routing, persistent volumes, and rolling updates
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
