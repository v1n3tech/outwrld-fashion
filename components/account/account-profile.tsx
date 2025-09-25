"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X } from "lucide-react"

interface AccountProfileProps {
  user: any
  profile: any
}

export function AccountProfile({ user, profile }: AccountProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
  })

  const handleSave = async () => {
    // TODO: Implement profile update
    setIsEditing(false)
  }

  const getInitials = () => {
    const firstName = formData.first_name || ""
    const lastName = formData.last_name || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Profile</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <Badge variant="secondary">{profile?.role || "Customer"}</Badge>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
        </div>

        {/* Account Stats */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-3">Account Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Member since</span>
              <div className="font-medium">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total orders</span>
              <div className="font-medium">0</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
