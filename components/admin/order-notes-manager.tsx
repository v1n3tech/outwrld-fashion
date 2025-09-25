"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addOrderNote } from "@/lib/actions/order-actions"
import { toast } from "@/hooks/use-toast"
import { FileText, Loader2 } from "lucide-react"

interface OrderNotesManagerProps {
  orderId: string
  currentNotes?: string | null
}

export function OrderNotesManager({ orderId, currentNotes }: OrderNotesManagerProps) {
  const [newNote, setNewNote] = useState("")
  const [adding, setAdding] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setAdding(true)
    try {
      await addOrderNote(orderId, newNote.trim())
      setNewNote("")
      toast({
        title: "Note added",
        description: "Order note has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "Failed to add note",
        description: "Failed to add order note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const formatNotes = (notes: string) => {
    return notes.split("\n").map((line, index) => (
      <p key={index} className="text-sm mb-2 last:mb-0">
        {line}
      </p>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Order Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentNotes && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Previous Notes</p>
            <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">{formatNotes(currentNotes)}</div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="note">Add Note</Label>
          <Textarea
            id="note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this order..."
            rows={3}
          />
        </div>

        <Button onClick={handleAddNote} disabled={!newNote.trim() || adding} className="w-full">
          {adding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Note"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
