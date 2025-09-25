export function CollectionHero() {
  return (
    <section className="relative py-24 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">Collections</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover our curated collections that blend Nigerian heritage with avant-garde streetwear innovation
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-8 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute top-1/2 right-8 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
    </section>
  )
}
