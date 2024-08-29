"use client";
import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Plus} from "lucide-react"

type Dish = {
  id: number
  name: string
  orderCount: number
}

export default function LeaderboardPage() {
  const [dishes, setDishes] = useState<Dish[]>([
    {id: 1, name: "Spaghetti Carbonara", orderCount: 342},
    {id: 2, name: "Margherita Pizza", orderCount: 310},
    {id: 3, name: "Grilled Salmon", orderCount: 275},
    {id: 4, name: "Caesar Salad", orderCount: 253},
    {id: 5, name: "Beef Burger", orderCount: 230},
    {id: 6, name: "Chicken Tikka Masala", orderCount: 218},
    {id: 7, name: "Vegetable Stir Fry", orderCount: 205},
    {id: 8, name: "Chocolate Lava Cake", orderCount: 189},
    {id: 9, name: "Mushroom Risotto", orderCount: 176},
    {id: 10, name: "Fish and Chips", orderCount: 162},
  ])

  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddOrEditDish = (dish: Dish) => {
    if (editingDish) {
      setDishes(prevDishes =>
        prevDishes.map(d => d.id === dish.id ? dish : d)
          .sort((a, b) => b.orderCount - a.orderCount)
          .map((d, index) => ({...d, id: index + 1}))
      )
    } else {
      setDishes(prevDishes =>
        [...prevDishes, {...dish, id: prevDishes.length + 1}]
          .sort((a, b) => b.orderCount - a.orderCount)
          .map((d, index) => ({...d, id: index + 1}))
      )
    }
    setEditingDish(null)
    setIsDialogOpen(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Most Requested Dishes</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-amber-100 hover:bg-amber-600 hover:text-white transition-colors duration-300"
              onClick={() => setEditingDish(null)}
              aria-label="Request a Dish"
            >
              <Plus className="h-4 w-4"/>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDish ? 'Edit Dish' : 'Request a Dish'}</DialogTitle>
            </DialogHeader>
            <DishForm dish={editingDish} onSubmit={handleAddOrEditDish}/>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {dishes.map((dish, index) => (
            <li
              key={dish.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow cursor-pointer transition-all duration-300 ease-in-out ${
                index < 3 ? 'bg-amber-50' : 'bg-background'
              }`}
              onClick={() => {
                setEditingDish(dish)
                setIsDialogOpen(true)
              }}
            >
              <div className="flex items-center space-x-4 flex-grow">
                <Badge
                  variant={index < 3 ? "default" : "secondary"}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                >
                  {index + 1}
                </Badge>
                <span className="font-semibold">{dish.name}</span>
              </div>
              <span className="text-sm text-muted-foreground ml-4 flex-shrink-0">{dish.orderCount} orders</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function DishForm({dish, onSubmit}: { dish: Dish | null, onSubmit: (dish: Dish) => void }) {
  const [name, setName] = useState(dish?.name || '')
  const [orderCount, setOrderCount] = useState(dish?.orderCount.toString() || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: dish?.id || 0,
      name,
      orderCount: parseInt(orderCount, 10)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Dish Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="orderCount">Number of Requests</Label>
        <Input
          id="orderCount"
          type="number"
          value={orderCount}
          onChange={(e) => setOrderCount(e.target.value)}
          required
          min="1"
        />
      </div>
      <Button type="submit">{dish ? 'Update Dish' : 'Add Dish'}</Button>
    </form>
  )
}
