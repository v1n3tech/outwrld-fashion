export function AboutHero() {
  return (
    <section className="relative py-32 px-4 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground mb-8">About Outwrld</h1>
        <p className="text-2xl md:text-3xl text-primary font-mono mb-6">Revolutionizing Streetwear</p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          More than clothing—we're a cultural movement inspiring creativity across Nigeria and globally
        </p>
      </div>

      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/20 rotate-45 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-secondary/20 rotate-12 animate-pulse delay-1000" />
      </div>
    </section>
  )
}
