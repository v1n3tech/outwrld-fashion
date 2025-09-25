"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Mail, Github, Phone } from "lucide-react"
import { Twitter } from "lucide-react"

export function SiteCreatorButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* Contact Card - appears when open */}
        {isOpen && (
          <Card className="w-64 shadow-lg border-border bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Mantim Danzaki</h3>
                <p className="text-xs text-muted-foreground">Full Stack Developer</p>
              </div>

              <div className="space-y-2">
                <a
                  href="mailto:mantimdanzaki@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  mantimdanzaki@gmail.com
                </a>

                <a
                  href="https://github.com/mantimdanzaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </a>

                <a
                  href="https://x.com/mantimdanzaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  @mantimdanzaki
                </a>

                <a
                  href="tel:+2348064599104"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +234 806 459 9104
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toggle Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="bg-card border-border shadow-lg hover:bg-accent"
        >
          <span className="text-xs mr-2">Site created by</span>
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  )
}
