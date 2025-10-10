import { getFormProps, getInputProps } from "@conform-to/react";
import { MapPinIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ShippingAddressFormProps } from "@/modules/checkout/types";
import { MapboxView } from "@/modules/maps/mapbox-view";

export function ShippingAddressForm({
  fetcherShippingAddress,
  formShippingAddress,
  fieldsShippingAddress,
  isSubmitting,
}: ShippingAddressFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <MapPinIcon className="h-5 w-5 text-primary" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <fetcherShippingAddress.Form
          method="post"
          action="/action/user/update-address"
          className="space-y-4"
          {...getFormProps(formShippingAddress)}
        >
          <input
            {...getInputProps(fieldsShippingAddress.id, { type: "hidden" })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={fieldsShippingAddress.recipientName.id}>
                Recipient Name *
              </Label>
              <Input
                {...getInputProps(fieldsShippingAddress.recipientName, {
                  type: "text",
                })}
                placeholder="Receiver name"
              />
              {fieldsShippingAddress.recipientName.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.recipientName.errors}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fieldsShippingAddress.phoneNumber.id}>
                Phone *
              </Label>
              <Input
                {...getInputProps(fieldsShippingAddress.phoneNumber, {
                  type: "tel",
                })}
                placeholder="08xxxxxxxxxx"
              />
              {fieldsShippingAddress.phoneNumber.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.phoneNumber.errors}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor={fieldsShippingAddress.street.id}>
              Complete Address - {fieldsShippingAddress.label.initialValue} *
            </Label>
            <Textarea
              {...getInputProps(fieldsShippingAddress.street, { type: "text" })}
              rows={3}
              placeholder="Street, house no, unit"
            />
            {fieldsShippingAddress.street.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsShippingAddress.street.errors}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 ">
            <div>
              <Label htmlFor={fieldsShippingAddress.city.id}>City *</Label>
              <select
                {...getInputProps(fieldsShippingAddress.city, { type: "text" })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-sm "
              >
                <option value="">Select City</option>
                <option value="Manado">Manado</option>
                <option value="Bitung">Bitung</option>
                <option value="Tomohon">Tomohon</option>
                <option value="Minahasa">Minahasa</option>
                <option value="Minahasa Utara">Minahasa Utara</option>
              </select>
              {fieldsShippingAddress.city.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.city.errors}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={fieldsShippingAddress.province.id}>
                Province *
              </Label>
              <Input
                {...getInputProps(fieldsShippingAddress.province, {
                  type: "text",
                })}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              {fieldsShippingAddress.province.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.province.errors}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={fieldsShippingAddress.postalCode.id}>
                Postal Code *
              </Label>
              <Input
                {...getInputProps(fieldsShippingAddress.postalCode, {
                  type: "text",
                })}
              />
              {fieldsShippingAddress.postalCode.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.postalCode.errors}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={fieldsShippingAddress.country.id}>Country</Label>
              <Input
                {...getInputProps(fieldsShippingAddress.country, {
                  type: "text",
                })}
              />
              {fieldsShippingAddress.country.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsShippingAddress.country.errors}
                </p>
              )}
            </div>
          </div>

          <div>
            <MapboxView />
            <input
              {...getInputProps(fieldsShippingAddress.latitude, {
                type: "hidden",
              })}
            />
            <input
              {...getInputProps(fieldsShippingAddress.longitude, {
                type: "hidden",
              })}
            />
            {fieldsShippingAddress.latitude.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsShippingAddress.latitude.errors}
              </p>
            )}
            {fieldsShippingAddress.longitude.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsShippingAddress.longitude.errors}
              </p>
            )}
          </div>

          {/* Additional Notes Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCartIcon className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Additional Notes</h4>
            </div>
            <Textarea
              {...getInputProps(fieldsShippingAddress.notes, { type: "text" })}
              placeholder="Notes for seller (optional)"
              rows={3}
            />
            {fieldsShippingAddress.notes.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsShippingAddress.notes.errors}
              </p>
            )}
          </div>

          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </fetcherShippingAddress.Form>
      </CardContent>
    </Card>
  );
}
