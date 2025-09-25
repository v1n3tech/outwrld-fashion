export function AboutStory() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Our Story</h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Outwrld is an avant-garde fashion brand from Nigeria, revolutionizing streetwear with exceptional
                quality and eclectic variety. We specialize in premium merch like hoodies, tees, and innovative apparel
                that blends urban edge with Nigerian cultural flair.
              </p>
              <p>
                Crafted from sustainable, high-grade fabrics, each piece ensures superior comfort, durability, and bold
                style. Our collections range from sleek minimalist designs to vibrant, heritage-inspired prints,
                catering to diverse tastes and occasions.
              </p>
              <p>
                Embracing inclusivity, Outwrld offers sizes for everyone, fostering self-expression and confidence.
                We're more than clothing—we're a cultural movement inspiring creativity across Nigeria and globally.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
              alt="Outwrld streetwear collection"
              className="w-full h-[600px] object-cover rounded-lg"
            />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-2 border-primary rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
