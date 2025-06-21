import { Camera, Mail, Phone, User } from "lucide-react";

export function Profile({ userInfo }: { userInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold text-foreground mb-6">
          Profile Settings
        </h3>

        {/* Profile Picture Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 p-3 bg-secondary/30 rounded-xl border border-border">
          <div className="relative">
            <img
              src={userInfo.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-primary/20 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-semibold text-foreground mb-1">
              {userInfo.name}
            </h4>
            <p className="text-muted-foreground">{userInfo.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Member since{" "}
              {new Date(userInfo.joinDate).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* Personal Information Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                defaultValue={userInfo.name}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                defaultValue={userInfo.email}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={userInfo.phone}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Date of Birth
              </label>
              <input
                type="date"
                defaultValue="1990-01-01"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h4 className="text-lg font-semibold text-foreground">
              Address Information
            </h4>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Street Address
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Enter your full address"
                defaultValue="Jl. Example Street No. 123"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  City
                </label>
                <input
                  type="text"
                  defaultValue="Manado"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Province
                </label>
                <input
                  type="text"
                  defaultValue="North Sulawesi"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Province"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Postal Code
                </label>
                <input
                  type="text"
                  defaultValue="95111"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-8 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-secondary/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Security Settings
        </h3>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-border rounded-xl hover:bg-secondary/30 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
              <span className="text-muted-foreground">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
