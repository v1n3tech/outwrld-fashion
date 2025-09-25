"use client"

interface OrderProgressBarProps {
  status: string
  className?: string
}

export function OrderProgressBar({ status, className = "" }: OrderProgressBarProps) {
  const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"]
  const currentIndex = statusSteps.indexOf(status)
  const progress = status === "cancelled" ? 0 : ((currentIndex + 1) / statusSteps.length) * 100

  const getProgressColor = () => {
    if (status === "cancelled") return "bg-red-500"
    if (status === "delivered") return "bg-green-500"
    return "bg-blue-500"
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Order Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Placed</span>
        <span>Delivered</span>
      </div>
    </div>
  )
}
