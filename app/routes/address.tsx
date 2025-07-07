import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Phone, User } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "~/modules/auth/hooks/use-auth-user";
import { CreateAddressSchema } from "~/modules/user/schema";

export default function UserAddress() {
	const { user } = useAuthUser();
	const fetcherAddress = useFetcher();

	const [formAddress, fieldsAddress] = useForm({
		id: "create-address",
		lastResult: fetcherAddress.data?.submission,
		shouldValidate: "onSubmit",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreateAddressSchema });
		},
		defaultValue: {
			userId: user?.id ?? "",
			label: "Rumah",
			recipientName: user?.fullName,
			phone: user?.phoneNumber || "081234567890",
			street: "Jl. Jalan",
			city: "Manado",
			province: "Sulawesi Utara",
			postalCode: "12345",
			country: "Indonesia",
			landmark: "Dekat tugu",
			notes: "Catatan saja",
			latitude: 1.4725746,
			longitude: 124.8314007,
			isDefault: true,
			isActive: true,
		},
	});

	return (
		<fetcherAddress.Form
			method="post"
			action="/action/user/create-address"
			{...getFormProps(formAddress)}
		>
			<div className="container max-w-3xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8 flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold">Manage Address</h1>
						<p className="text-muted-foreground mt-2">
							Setup your address before checkout
						</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							Address Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Label */}
						<div className="max-w-xs">
							<Label htmlFor={fieldsAddress.label.id}>Address Label *</Label>
							<Input
								{...getInputProps(fieldsAddress.label, { type: "text" })}
								placeholder="Contoh: Rumah di Manado"
							/>
							{fieldsAddress.label.errors && (
								<p className="text-sm text-red-500">
									{fieldsAddress.label.errors[0]}
								</p>
							)}
						</div>

						{/* Recipient + Phone */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fieldsAddress.recipientName.id}>
									Recipient Name *
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										{...getInputProps(fieldsAddress.recipientName, {
											type: "text",
										})}
										placeholder="John Doe"
										className="pl-10"
									/>
								</div>
								{fieldsAddress.recipientName.errors && (
									<p className="text-sm text-red-500">
										{fieldsAddress.recipientName.errors[0]}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor={fieldsAddress.phone.id}>Phone Number *</Label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										{...getInputProps(fieldsAddress.phone, { type: "text" })}
										placeholder="08123456789"
										className="pl-10"
									/>
								</div>
								{fieldsAddress.phone.errors && (
									<p className="text-sm text-red-500">
										{fieldsAddress.phone.errors[0]}
									</p>
								)}
							</div>
						</div>

						{/* Street */}
						<div>
							<Label htmlFor={fieldsAddress.street.id}>Street Address *</Label>
							<Textarea
								{...getInputProps(fieldsAddress.street, { type: "text" })}
								rows={3}
								placeholder="Jl. Mawar No. 123"
							/>
							{fieldsAddress.street.errors && (
								<p className="text-sm text-red-500">
									{fieldsAddress.street.errors[0]}
								</p>
							)}
						</div>

						{/* City + Province */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fieldsAddress.city.id}>City *</Label>
								<select
									{...getInputProps(fieldsAddress.city, { type: "text" })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select City</option>
									<option value="Manado">Manado</option>
									<option value="Bitung">Bitung</option>
									<option value="Tomohon">Tomohon</option>
									<option value="Minahasa">Minahasa</option>
									<option value="Minahasa Utara">Minahasa Utara</option>
								</select>
								{fieldsAddress.city.errors && (
									<p className="text-sm text-red-500">
										{fieldsAddress.city.errors[0]}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor={fieldsAddress.province.id}>Province *</Label>
								<Input
									{...getInputProps(fieldsAddress.province, { type: "text" })}
									readOnly
									className="bg-gray-100 cursor-not-allowed"
								/>
							</div>
						</div>

						{/* Postal Code + Landmark */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fieldsAddress.postalCode.id}>
									Postal Code *
								</Label>
								<Input
									{...getInputProps(fieldsAddress.postalCode, { type: "text" })}
									placeholder="95111"
								/>
							</div>
							<div>
								<Label htmlFor={fieldsAddress.landmark.id}>Landmark</Label>
								<Input
									{...getInputProps(fieldsAddress.landmark, { type: "text" })}
									placeholder="Dekat minimarket"
								/>
							</div>
						</div>

						{/* Notes */}
						<div>
							<Label htmlFor={fieldsAddress.notes.id}>Notes</Label>
							<Textarea
								{...getInputProps(fieldsAddress.notes, { type: "text" })}
								placeholder="Catatan kurir"
								rows={2}
							/>
						</div>

						{/* Lat / Long */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fieldsAddress.latitude.id}>Latitude</Label>
								<Input
									{...getInputProps(fieldsAddress.latitude, { type: "number" })}
									step="any"
								/>
							</div>
							<div>
								<Label htmlFor={fieldsAddress.longitude.id}>Longitude</Label>
								<Input
									{...getInputProps(fieldsAddress.longitude, {
										type: "number",
									})}
									step="any"
								/>
							</div>
						</div>

						{/* Default */}
						<div className="flex items-center space-x-2">
							{/* <Checkbox
                {...getInputProps(fieldsAddress.isDefault, {
                  type: "checkbox",
                })}
              /> */}
							<Checkbox id="isDefault" defaultChecked />
							<Label htmlFor={fieldsAddress.isDefault.id}>
								Set as default address
							</Label>
							<Input
								type="hidden"
								name={fieldsAddress.isActive.name}
								value="true"
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-4">
							<Button
								type="submit"
								disabled={fetcherAddress.state === "submitting"}
								className="flex-1"
							>
								{fetcherAddress.state === "submitting"
									? "Saving..."
									: "Save Address"}
							</Button>
							<Button type="button" variant="outline" className="flex-1">
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</fetcherAddress.Form>
	);
}
