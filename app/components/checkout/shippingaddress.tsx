import { getFormProps, getInputProps } from "@conform-to/react";
import { MapPinIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ShippingAddressProps } from "@/modules/checkout/types";

export default function ShippingAddress({
  fetcherUserAddress,
  formAddress,
  fieldsAddress,
  isSubmitting,
}: ShippingAddressProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <MapPinIcon className="h-5 w-5 text-primary" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <fetcherUserAddress.Form
          method="post"
          action="/action/user/update-address"
          className="space-y-4"
          {...getFormProps(formAddress)}
        >
          <input {...getInputProps(fieldsAddress.id, { type: "hidden" })} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={fieldsAddress.recipientName.id}>
                Recipient Name *
              </Label>
              <Input
                {...getInputProps(fieldsAddress.recipientName, {
                  type: "text",
                })}
                placeholder="Receiver name"
              />
              {fieldsAddress.recipientName.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.recipientName.errors}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={fieldsAddress.phoneNumber.id}>Phone *</Label>
              <Input
                {...getInputProps(fieldsAddress.phoneNumber, {
                  type: "tel",
                })}
                placeholder="08xxxxxxxxxx"
              />
              {fieldsAddress.phoneNumber.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.phoneNumber.errors}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor={fieldsAddress.street.id}>
              Complete Address - {fieldsAddress.label.initialValue} *
            </Label>
            <Textarea
              {...getInputProps(fieldsAddress.street, { type: "text" })}
              rows={3}
              placeholder="Street, house no, unit"
            />
            {fieldsAddress.street.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsAddress.street.errors}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 ">
            <div>
              <Label htmlFor={fieldsAddress.city.id}>City *</Label>
              <select
                {...getInputProps(fieldsAddress.city, { type: "text" })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-sm "
              >
                <option value="">Select City</option>
                <option value="Manado">Manado</option>
                <option value="Bitung">Bitung</option>
                <option value="Tomohon">Tomohon</option>
                <option value="Minahasa">Minahasa</option>
                <option value="Minahasa Utara">Minahasa Utara</option>
              </select>
              {fieldsAddress.city.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.city.errors}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={fieldsAddress.province.id}>Province *</Label>
              <Input
                {...getInputProps(fieldsAddress.province, {
                  type: "text",
                })}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              {fieldsAddress.province.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.province.errors}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={fieldsAddress.postalCode.id}>Postal Code *</Label>
              <Input
                {...getInputProps(fieldsAddress.postalCode, {
                  type: "text",
                })}
              />
              {fieldsAddress.postalCode.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.postalCode.errors}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={fieldsAddress.country.id}>Country</Label>
              <Input
                {...getInputProps(fieldsAddress.country, {
                  type: "text",
                })}
              />
              {fieldsAddress.country.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.country.errors}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={fieldsAddress.latitude.id}>Latitude</Label>
              <Input
                {...getInputProps(fieldsAddress.latitude, {
                  type: "text",
                })}
              />
              {fieldsAddress.latitude.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.latitude.errors}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={fieldsAddress.longitude.id}>Longitude</Label>
              <Input
                {...getInputProps(fieldsAddress.longitude, {
                  type: "text",
                })}
              />
              {fieldsAddress.longitude.errors && (
                <p className="text-sm text-destructive mt-1">
                  {fieldsAddress.longitude.errors}
                </p>
              )}
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCartIcon className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Additional Notes</h4>
            </div>
            <Textarea
              {...getInputProps(fieldsAddress.notes, { type: "text" })}
              placeholder="Notes for seller (optional)"
              rows={3}
            />
            {fieldsAddress.notes.errors && (
              <p className="text-sm text-destructive mt-1">
                {fieldsAddress.notes.errors}
              </p>
            )}
          </div>

          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </fetcherUserAddress.Form>
      </CardContent>
    </Card>
  );
}
