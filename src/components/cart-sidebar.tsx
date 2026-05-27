
import Link from "@/lib/next-shim"
import { X, Plus, Minus, Trash2, CreditCard, MapPin, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

const deliveryLocations = [
  "Madrid, España",
  "Barcelona, España",
  "Valencia, España",
  "Sevilla, España",
  "Bilbao, España",
]

export function CartSidebar() {
  const { cartItems, cartOpen, toggleCart, updateQuantity, removeFromCart, clearCart } = useAppStore()
  const t = useT()
  const paymentMethods = [
    { id: "card", name: t("cart.payCard"), icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
    { id: "google", name: "Google Pay", icon: "🔵" },
  ]
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0])
  const [selectedLocation, setSelectedLocation] = useState(deliveryLocations[0])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleCart}
      />

      {/* Cart Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-gradient-to-b from-card via-card to-secondary/20 border-l border-border/50 z-50 transition-transform duration-300 ease-in-out flex flex-col sm:rounded-l-3xl shadow-2xl",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">{t("cart.title")}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleCart} className="text-foreground hover:text-primary">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("cart.empty")}</p>
              <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={toggleCart}>
                <Link href="/shop">{t("cart.explore")}</Link>
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gradient-to-r from-muted to-secondary/30 rounded-2xl shadow-sm">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-background flex-shrink-0 shadow-md">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                  <p className="text-sm text-muted-foreground">{item.size}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-border bg-transparent rounded-xl"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm text-foreground font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-border bg-transparent rounded-xl"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-border space-y-4">
            {/* Delivery Location */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 border-border bg-gradient-to-r from-card to-secondary/20 rounded-2xl">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{selectedLocation}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border w-full">
                {deliveryLocations.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    {loc}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Payment Method */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 border-border bg-gradient-to-r from-card to-secondary/20 rounded-2xl">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>{selectedPayment.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border w-full">
                {paymentMethods.map((method) => (
                  <DropdownMenuItem
                    key={method.id}
                    onClick={() => setSelectedPayment(method)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <span className="mr-2">{method.icon}</span>
                    {method.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("cart.subtotal")}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("cart.shipping")}</span>
                <span>{shipping === 0 ? t("cart.free") : `€${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-foreground pt-2 border-t border-border">
                <span>{t("cart.total")}</span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button className="w-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 font-semibold py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              {t("cart.checkout")}
            </Button>

            {/* Clear Cart */}
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={clearCart}>
              {t("cart.clear")}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
