export function Profile({ userInfo }: { userInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" defaultValue={userInfo.name} />
          <input className="input" defaultValue={userInfo.email} />
          <input className="input" defaultValue={userInfo.phone} />
          <input className="input" defaultValue="1990-01-01" type="date" />
        </div>
        <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
          Save
        </button>
      </div>
    </div>
  );
}
