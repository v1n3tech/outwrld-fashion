import { Instagram, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutSocial() {
  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Join the Movement</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          As seen on Instagram and TikTok, where users rave about our streetwear drops. Follow us to stay updated on the
          latest collections and cultural moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            <a
              href="https://instagram.com/outwrldng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Instagram className="w-5 h-5" />
              @outwrldng
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <a
              href="https://tiktok.com/@outwrldng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Music className="w-5 h-5" />
              TikTok
            </a>
          </Button>
        </div>

        <div className="mt-12 p-8 bg-card rounded-lg border border-border">
          <p className="text-lg font-mono text-primary mb-4">"Shop in-store or online to elevate your wardrobe"</p>
          <p className="text-muted-foreground">Experience Outwrld's unique fusion of quality and avant-garde fashion</p>
        </div>
      </div>
    </section>
  )
}
