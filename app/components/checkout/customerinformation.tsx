import { getFormProps, getInputProps } from "@conform-to/react";
import type { CustomerInformationProps } from "@/modules/checkout/types";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function CustomerInformation({
	fetcherUserProfile,
	formUser,
	fieldsUser,
	isSubmitting,
}: CustomerInformationProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Customer Information</CardTitle>
			</CardHeader>
			<CardContent>
				<fetcherUserProfile.Form
					method="post"
					action="/action/user/profile"
					className="space-y-4"
					{...getFormProps(formUser)}
				>
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor={fieldsUser.fullName.id}>Full Name *</Label>
							<Input
								{...getInputProps(fieldsUser.fullName, { type: "text" })}
								placeholder="Enter your full name"
							/>
							{fieldsUser.fullName.errors && (
								<p className="text-sm text-destructive mt-1">
									{fieldsUser.fullName.errors}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor={fieldsUser.email.id}>Email *</Label>
							<Input
								{...getInputProps(fieldsUser.email, { type: "email" })}
								placeholder="email@example.com"
							/>
							{fieldsUser.email.errors && (
								<p className="text-sm text-destructive mt-1">
									{fieldsUser.email.errors}
								</p>
							)}
						</div>

						<div className="md:col-span-2">
							<Label htmlFor={fieldsUser.phoneNumber.id}>Phone Number *</Label>
							<Input
								{...getInputProps(fieldsUser.phoneNumber, { type: "tel" })}
								placeholder="08xxxxxxxxxx"
							/>
							{fieldsUser.phoneNumber.errors && (
								<p className="text-sm text-destructive mt-1">
									{fieldsUser.phoneNumber.errors}
								</p>
							)}
						</div>
					</div>
					<Button type="submit" size="sm" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</fetcherUserProfile.Form>
			</CardContent>
		</Card>
	);
}
