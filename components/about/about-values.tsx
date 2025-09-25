import { Leaf, Users, Zap, Globe } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Crafted from sustainable, high-grade fabrics ensuring superior comfort and durability",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Offering sizes for everyone, fostering self-expression and confidence across all communities",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Blending traditional Nigerian heritage with cutting-edge streetwear design and technology",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Inspiring creativity and cultural pride from Nigeria to fashion capitals worldwide",
  },
]

export function AboutValues() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
