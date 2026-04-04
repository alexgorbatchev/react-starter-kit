import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@repo/ui";

export function AboutPage() {
  return (
    <div
      className="container mx-auto px-4 py-20 sm:px-6 lg:px-8"
      data-testid="AboutPage"
    >
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          About React Starter Kit
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          A production-ready, full-stack web application template that combines
          modern development practices with cutting-edge technologies to deliver
          exceptional performance and developer experience.
        </p>
      </div>

      <section className="mb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
            <CardDescription>
              Empowering developers to build faster, better web applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              React Starter Kit was created to bridge the gap between prototype
              and production. We believe that developers should focus on
              building great features, not wrestling with configuration and
              setup.
            </p>
            <p className="text-muted-foreground">
              Our template provides a solid foundation with best practices,
              modern tooling, and optimized performance out of the box, so you
              can ship your ideas faster and with confidence.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          What Makes Us Different
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Production-Ready</CardTitle>
              <CardDescription>
                Not just a demo, but a real foundation for your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every component, pattern, and configuration has been
                battle-tested in production environments. Security, performance,
                and maintainability are built-in from day one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Edge-First Architecture</CardTitle>
              <CardDescription>
                Optimized for global performance at CDN edge locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built specifically for Cloudflare Workers and edge computing.
                Your applications run closer to your users for lightning-fast
                response times.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔧 Developer Experience</CardTitle>
              <CardDescription>
                Carefully crafted tooling for maximum productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hot reload, TypeScript support, comprehensive testing setup, and
                intuitive project structure. Everything you need to stay in the
                flow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌐 Full-Stack Solution</CardTitle>
              <CardDescription>
                Complete backend and frontend in one cohesive package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                tRPC for type-safe APIs, Better Auth for authentication and
                database, and WebSocket support for real-time features.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Technology Choices
        </h2>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-semibold">Frontend Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>React 19:</strong> Latest React with concurrent
                    features
                  </li>
                  <li>
                    <strong>TypeScript:</strong> Type safety and better
                    developer experience
                  </li>
                  <li>
                    <strong>Vite:</strong> Lightning-fast build tool and dev
                    server
                  </li>
                  <li>
                    <strong>TanStack Router:</strong> Type-safe routing with
                    code splitting
                  </li>
                  <li>
                    <strong>shadcn/ui:</strong> Beautiful, accessible component
                    library
                  </li>
                  <li>
                    <strong>Tailwind CSS:</strong> Utility-first CSS framework
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Backend Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Bun:</strong> Fast JavaScript runtime and package
                    manager
                  </li>
                  <li>
                    <strong>Hono:</strong> Ultra-fast web framework for edge
                    computing
                  </li>
                  <li>
                    <strong>tRPC:</strong> End-to-end type safety for APIs
                  </li>
                  <li>
                    <strong>Better Auth:</strong> Authentication
                  </li>
                  <li>
                    <strong>Cloudflare Workers:</strong> Serverless edge
                    computing
                  </li>
                  <li>
                    <strong>WebSockets:</strong> Real-time communication support
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Built by Kriasoft
        </h2>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-6 text-muted-foreground">
              React Starter Kit is maintained by Kriasoft, a team of experienced
              developers passionate about modern web technologies and developer
              experience.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild>
                <a
                  href="https://github.com/kriasoft"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit Kriasoft on GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://kriasoft.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Learn More About Kriasoft
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <section className="text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          Ready to Get Started?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Join thousands of developers who have chosen React Starter Kit for
          their next project.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a
              href="https://github.com/kriasoft/react-starter-kit"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get Started Now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/kriasoft/react-starter-kit/discussions"
              rel="noopener noreferrer"
              target="_blank"
            >
              Join the Community
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
