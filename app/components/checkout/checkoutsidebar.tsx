import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderSummaryProps } from "@/modules/checkout/types";

export function OrderSummary({
  cartItems,
  totalPrice,
  shippingCost,
  totalWithShipping,
}: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.product.images?.[0]?.url ?? "/placeholder.jpg"}
                alt={item.product.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x Rp{" "}
                  {item.product.price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="font-semibold text-sm">
                Rp {item.subTotalPrice.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Total */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Total</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">
              Rp {totalWithShipping.toLocaleString("id-ID")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
