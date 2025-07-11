import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Phone, User } from "lucide-react";
import { Form, useFetcher } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "~/modules/auth/hooks/use-auth";
import { CreateAddressSchema } from "~/modules/user/schema";

export default function UserAddressRoute() {
	const { user } = useAuthUser();

	const fetcherAddress = useFetcher();

	const [formAddress, fieldsAddress] = useForm({
		id: "create-address",
		lastResult: fetcherAddress.data?.submission,
		shouldValidate: "onSubmit",
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: CreateAddressSchema,
			});
		},
		defaultValue: {
			userId: user?.id,
			label: "Rumah",
			recipientName: user?.fullName,
			phoneNumber: user?.phoneNumber || "08123456789",
			street: "Jl. Nama Jalan Raya",
			city: "Manado",
			province: "Sulawesi Utara",
			postalCode: "12345",
			country: "Indonesia",
			landmark: "Dekat tugu",
			notes: "Notes",
			latitude: 1.4725746,
			longitude: 124.8314007,
			isDefault: true,
			isActive: true,
		},
	});

	return (
		<Form
			{...getFormProps(formAddress)}
			method="post"
			action="/action/user/create-address"
			// TODO: Refactor the form so it can be flexible to which action
			// action="/action/user/update-address"
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
						{/* UserId */}
						<input
							hidden
							{...getInputProps(fieldsAddress.userId, { type: "text" })}
						/>

						{/* Label */}
						<div className="max-w-xs space-y-2">
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
							<div className="space-y-2">
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
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.phoneNumber.id}>
									Phone Number *
								</Label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										{...getInputProps(fieldsAddress.phoneNumber, {
											type: "tel",
										})}
										placeholder="08123456789"
										className="pl-10"
									/>
								</div>
								{fieldsAddress.phoneNumber.errors && (
									<p className="text-sm text-red-500">
										{fieldsAddress.phoneNumber.errors[0]}
									</p>
								)}
							</div>
						</div>

						{/* Street */}
						<div className="space-y-2">
							<Label htmlFor={fieldsAddress.street.id}>Street Address *</Label>
							<Textarea
								{...getTextareaProps(fieldsAddress.street)}
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
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.city.id}>City *</Label>
								<select
									{...getInputProps(fieldsAddress.city, { type: "text" })}
									className="w-full px-3 py-2 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							<div className="space-y-2">
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
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.postalCode.id}>
									Postal Code *
								</Label>
								<Input
									{...getInputProps(fieldsAddress.postalCode, { type: "text" })}
									placeholder="95111"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.landmark.id}>Landmark</Label>
								<Input
									{...getInputProps(fieldsAddress.landmark, { type: "text" })}
									placeholder="Dekat minimarket"
								/>
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-2">
							<Label htmlFor={fieldsAddress.notes.id}>Notes</Label>
							<Textarea
								{...getTextareaProps(fieldsAddress.notes)}
								placeholder="Catatan kurir"
								rows={2}
							/>
						</div>

						{/* Lat / Long */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.latitude.id}>Latitude</Label>
								<Input
									{...getInputProps(fieldsAddress.latitude, { type: "number" })}
									step="any"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={fieldsAddress.longitude.id}>Longitude</Label>
								<Input
									{...getInputProps(fieldsAddress.longitude, {
										type: "number",
									})}
									step="any"
								/>
							</div>
						</div>

						{/* Default isDefault & isActive */}
						<div className="flex items-center space-x-2">
							<Label htmlFor={fieldsAddress.isDefault.id}>
								<input
									{...getInputProps(fieldsAddress.isDefault, {
										type: "checkbox",
									})}
								/>
								<span>Set as default address</span>
							</Label>
						</div>
						<input
							hidden
							{...getInputProps(fieldsAddress.isActive, { type: "checkbox" })}
						/>

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
		</Form>
	);
}
