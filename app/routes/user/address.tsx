import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Phone, User } from "lucide-react";
import { Form, href, redirect } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "~/lib/api-client";
import { useAuthUser } from "~/modules/auth/hooks/use-auth-user";
import { CreateAddressSchema } from "~/modules/user/schema";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/address";

export const action = async ({ request }: Route.ActionArgs) => {
	console.log("CREATE ADDRESS");

	const session = await getSession(request.headers.get("Cookie"));
	const token = session.get("token");

	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: CreateAddressSchema });
	if (submission.status !== "success") return submission.reply();

	console.log({ submission });

	const { data } = await apiClient.POST("/address", {
		headers: { Authorization: `Bearer ${token}` },
		body: submission.value,
	});

	console.log({ data });

	return redirect(href("/checkout"));
};

export default function UserAddressRoute() {
	const { user } = useAuthUser();
	// const fetcherAddress = useFetcher();

	const defaultValue = {
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
	};

	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreateAddressSchema });
		},
		defaultValue,
	});

	return (
		<Form
			method="post"
			action="/user/address"
			{...getFormProps(form)}
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
						<input hidden {...getInputProps(fields.userId, { type: "text" })} />

						{/* Label */}
						<div className="max-w-xs">
							<Label htmlFor={fields.label.id}>Address Label *</Label>
							<Input
								{...getInputProps(fields.label, { type: "text" })}
								placeholder="Contoh: Rumah di Manado"
							/>
							{fields.label.errors && (
								<p className="text-sm text-red-500">{fields.label.errors[0]}</p>
							)}
						</div>

						{/* Recipient + Phone */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fields.recipientName.id}>
									Recipient Name *
								</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										{...getInputProps(fields.recipientName, { type: "text" })}
										placeholder="John Doe"
										className="pl-10"
									/>
								</div>
								{fields.recipientName.errors && (
									<p className="text-sm text-red-500">
										{fields.recipientName.errors[0]}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor={fields.phone.id}>Phone Number *</Label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										{...getInputProps(fields.phone, { type: "tel" })}
										placeholder="08123456789"
										className="pl-10"
									/>
								</div>
								{fields.phone.errors && (
									<p className="text-sm text-red-500">
										{fields.phone.errors[0]}
									</p>
								)}
							</div>
						</div>

						{/* Street */}
						<div>
							<Label htmlFor={fields.street.id}>Street Address *</Label>
							<Textarea
								{...getTextareaProps(fields.street)}
								rows={3}
								placeholder="Jl. Mawar No. 123"
							/>
							{fields.street.errors && (
								<p className="text-sm text-red-500">
									{fields.street.errors[0]}
								</p>
							)}
						</div>

						{/* City + Province */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fields.city.id}>City *</Label>
								<select
									{...getInputProps(fields.city, { type: "text" })}
									className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select City</option>
									<option value="Manado">Manado</option>
									<option value="Bitung">Bitung</option>
									<option value="Tomohon">Tomohon</option>
									<option value="Minahasa">Minahasa</option>
									<option value="Minahasa Utara">Minahasa Utara</option>
								</select>
								{fields.city.errors && (
									<p className="text-sm text-red-500">
										{fields.city.errors[0]}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor={fields.province.id}>Province *</Label>
								<Input
									{...getInputProps(fields.province, { type: "text" })}
									readOnly
									className="bg-gray-100 cursor-not-allowed"
								/>
							</div>
						</div>

						{/* Postal Code + Landmark */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fields.postalCode.id}>Postal Code *</Label>
								<Input
									{...getInputProps(fields.postalCode, { type: "text" })}
									placeholder="95111"
								/>
							</div>
							<div>
								<Label htmlFor={fields.landmark.id}>Landmark</Label>
								<Input
									{...getInputProps(fields.landmark, { type: "text" })}
									placeholder="Dekat minimarket"
								/>
							</div>
						</div>

						<input
							hidden
							{...getInputProps(fields.country, { type: "text" })}
						/>

						{/* Notes */}
						<div>
							<Label htmlFor={fields.notes.id}>Notes</Label>
							<Textarea
								{...getTextareaProps(fields.notes)}
								placeholder="Catatan kurir"
								rows={2}
							/>
						</div>

						{/* Lat / Long */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor={fields.latitude.id}>Latitude</Label>
								<Input
									{...getInputProps(fields.latitude, { type: "number" })}
									step="any"
								/>
							</div>
							<div>
								<Label htmlFor={fields.longitude.id}>Longitude</Label>
								<Input
									{...getInputProps(fields.longitude, {
										type: "number",
									})}
									step="any"
								/>
							</div>
						</div>

						{/* Default */}
						<div className="flex items-center space-x-2">
							<Label htmlFor={fields.isDefault.id}>
								<input
									{...getInputProps(fields.isDefault, { type: "checkbox" })}
								/>
								<span>Set as default address</span>
							</Label>
						</div>

						<input
							hidden
							{...getInputProps(fields.isActive, { type: "checkbox" })}
						/>

						{/* Buttons */}
						<div className="flex gap-3 pt-4">
							<Button
								type="submit"
								// disabled={fetcherAddress.state === "submitting"}
								className="flex-1"
							>
								SAVE
								{/* {fetcherAddress.state === "submitting"
									? "Saving..."
									: "Save Address"} */}
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
