export function AboutFounder() {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12">Meet the Visionary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="Joe Ayo, Creative Director"
              className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary"
            />
          </div>
          <div className="md:col-span-2 text-left">
            <h3 className="font-display text-3xl font-bold text-foreground mb-4">Joe Ayo</h3>
            <p className="text-primary font-mono text-lg mb-6">Creative Director & Founder</p>
            <p className="text-muted-foreground leading-relaxed">
              Founded by creative director Joe Ayo, Outwrld represents a bold vision of Nigerian fashion on the global
              stage. With a passion for blending traditional heritage with contemporary streetwear aesthetics, Joe has
              created a brand that celebrates both innovation and cultural pride. His commitment to sustainable
              practices and inclusive design has made Outwrld a beacon of progressive fashion in Africa and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
