import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Plus, User } from "lucide-react";

export default function UserAddress() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manage Address</h1>
          <p className="text-muted-foreground mt-2">
            Add, edit, or remove your delivery addresses
          </p>
        </div>

        {/* Add New Button */}
        <Button className="mb-6 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Address
        </Button>
      </div>

      {/* Card Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address Label */}
          <div className="max-w-xs">
            <Label htmlFor="label" className="mb-2 block">
              Address Label *
            </Label>
            <Input
              id="label"
              name="label"
              placeholder="Contoh: Rumah di Manado"
            />
          </div>

          {/* Recipient + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <Label htmlFor="recipientName" className="mb-2 block">
                Recipient Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="08123456789"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Street Address */}
          <div className="max-w-2xl">
            <Label htmlFor="street" className="mb-2 block">
              Street Address *
            </Label>
            <Textarea
              id="street"
              name="street"
              placeholder="Jl. Mawar No. 123"
              rows={3}
            />
          </div>

          {/* City + Province */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <Label htmlFor="city" className="mb-2 block">
                City *
              </Label>
              <select
                id="city"
                name="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select City
                </option>
                <option>Manado</option>
                <option>Minahasa Utara</option>
                <option>Bitung</option>
                <option>Minahasa</option>
                <option>Tomohon</option>
              </select>
            </div>
            <div>
              <Label htmlFor="province" className="mb-2 block">
                Province *
              </Label>
              <Input
                id="province"
                name="province"
                defaultValue="Sulawesi Utara"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Postal Code + Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <Label htmlFor="postalCode" className="mb-2 block">
                Postal Code *
              </Label>
              <Input id="postalCode" name="postalCode" placeholder="95115" />
            </div>
            <div>
              <Label htmlFor="landmark" className="mb-2 block">
                Landmark (Optional)
              </Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Dekat minimarket"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="max-w-2xl">
            <Label htmlFor="notes" className="mb-2 block">
              Delivery Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Tambahan instruksi kurir"
              rows={2}
            />
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <Label htmlFor="latitude" className="mb-2 block">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                placeholder="-1.5000"
                type="number"
                step="any"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="mb-2 block">
                Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                placeholder="124.8000"
                type="number"
                step="any"
              />
            </div>
          </div>

          {/* Button: Use Current Location */}
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                if (!navigator.geolocation) {
                  alert("Geolocation is not supported by your browser.");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    const { latitude, longitude } = position.coords;

                    console.log("📍 Latitude:", latitude);
                    console.log("📍 Longitude:", longitude);

                    try {
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                      );
                      const data = await response.json();

                      const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        "Unknown";

                      const postalCode = data.address.postcode || "Unknown";

                      console.log("🏙️ City:", city);
                      console.log("📮 Postal Code:", postalCode);
                    } catch (error) {
                      console.error(
                        "❌ Failed to fetch reverse geocoding:",
                        error
                      );
                    }
                  },
                  (error) => {
                    alert("Unable to retrieve your location.");
                    console.error("❌ Geolocation error:", error);
                  }
                );
              }}
            >
              Use Current Location
            </Button>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="isDefault" />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 max-w-md">
            <Button type="submit" className="flex-1">
              Save Address
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
