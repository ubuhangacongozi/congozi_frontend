import React from "react";
import LoadingSpinner from "../../../../../Components/LoadingSpinner ";

const EditUserPopup = ({
  userToEdit,
  editedCompanyName,
  editedTin,
  editedFName,
  editedLName,
  editedAddress,
  editedPhone,
  editedEmail,
  editedRole,
  editedIdcard,
  setEditedCompanyName,
  setEditedTin,
  setEditedLName,
  setEditedFName,
  setEditedAddress,
  setEditedPhone,
  setEditedIdcard,
  setEditedEmail,
  setEditedRole,
  setShowEditPopup,
  handleSaveUserEdit,
  isLoading,
}) => {
  if (!userToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 w-full">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <div className="space-y-3">
          <div className="flex flex-row gap-4">
            <div className="w-1/2">
              <div>
                <label className="block text-sm font-medium">
                  Izina ry company
                </label>
                <input
                  type="text"
                  value={editedCompanyName}
                  onChange={(e) => setEditedCompanyName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Tin ya Company
                </label>
                <input
                  type="text"
                  value={editedTin}
                  onChange={(e) => setEditedTin(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="TIN number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Izina ryambere
                </label>
                <input
                  type="text"
                  value={editedFName}
                  onChange={(e) => setEditedFName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Izina ryakabiri
                </label>
                <input
                  type="text"
                  value={editedLName}
                  onChange={(e) => setEditedLName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefone</label>
                <input
                  type="text"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="w-1/2">
              <div>
                <label className="block text-sm font-medium">Aderesi</label>
                <input
                  type="text"
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Irangamuntu</label>
                <input
                  type="text"
                  value={editedIdcard}
                  onChange={(e) => setEditedIdcard(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="ID Card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="student">student</option>
                  <option value="admin">admin</option>
                  <option value="school">school</option>
                  <option value="supperAdmin">supperAdmin</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-6">
          <button
            onClick={() => setShowEditPopup(false)}
            className="px-4 py-2 bg-red-300 text-gray-800 rounded hover:bg-red-400"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveUserEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={5} strokeWidth={2} />
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserPopup;
