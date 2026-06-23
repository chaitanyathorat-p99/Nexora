import React, { useState, useRef } from 'react'
import { FaEdit, FaBuilding, FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaClock, FaCamera, FaListAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { message } from 'antd'
import { url } from '../../../components/common/api'
import ConnectGoogleButton from '../../../features/email-tokens/ConnectGoogleButton'
import { getUser } from '../../../features/authfunctions/userLogin'

const hiddenPermissions = new Set(['Rating', 'Report', 'Email-Template', 'Dynamic-Fields', 'Quotation', 'Company-Master'])

const Profile = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const { user, userToken, loading } = useSelector((state) => state.user)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File size should be less than 5MB')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    try {
      setUploading(true)
      
      // Create form data for file upload
      const formData = new FormData()
      formData.append('files', file)

      // Upload to AWS using axios
      const uploadResponse = await axios.post(
        `${url}/upload/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      
      if (uploadResponse?.data && uploadResponse.data[0]?.location) {
        // Get the file location from the response
        const fileLocation = uploadResponse.data[0].location

        // Update user profile with new photo URL
        const updateResponse = await axios.put(
          `${url}/users/${user._id}`,
          { profilePic: fileLocation },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )

        if (updateResponse?.data?.data) {
          // Refetch user data to update profile photo in Redux
          dispatch(getUser());
          message.success('Profile photo updated successfully')
          // Clear preview
          setPreviewUrl(null)
        }
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      message.error(error?.response?.data?.message || 'Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">User data not available</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
        <button
          onClick={handleEdit}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaEdit className="mr-2" />
          Edit Profile
        </button>
      </div>

      {isEditing && (
        <div className="bg-indigo-50 p-6 rounded-lg mb-6 border border-indigo-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Details to be edited</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input className="w-full border rounded-md p-2 bg-white" value={user?.name || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input className="w-full border rounded-md p-2 bg-white" value={user?.email || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
              <input className="w-full border rounded-md p-2 bg-white" value={user?.mobileNo || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company</label>
              <input className="w-full border rounded-md p-2 bg-white" value={user?.companyMaster?.name || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <input className="w-full border rounded-md p-2 bg-white" value={user?.role?.name || ''} readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo and Basic Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="relative">
            <img
              className="w-40 h-40 rounded-full ring-4 ring-indigo-500 object-cover"
              src={previewUrl || user?.profilePic || '/default-avatar.png'}
              alt="Profile"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <button
            onClick={handlePhotoClick}
            className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors group-hover:opacity-100 opacity-0"
            disabled={uploading}
          >
            <FaCamera className="text-white" />
          </button>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-sm text-gray-600">{user?.userType}</p>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <FaEnvelope className="text-indigo-600 mr-3" />
            <span className="text-gray-700">{user?.email}</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-indigo-600 mr-3" />
            <span className="text-gray-700">{user?.mobileNo}</span>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <FaBuilding className="text-indigo-600 mr-3" />
            <span className="text-gray-700">{user?.companyMaster?.name || 'Not specified'}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="text-indigo-600 mr-3" />
            <span className="text-gray-700">Role: {user?.role?.name || 'Not specified'}</span>
          </div>
        </div>
      </div>

      {/* Permissions or Plan Features */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        {user?.role?.permissions
          ?.filter((permission) => !hiddenPermissions.has(permission?.modelName))
          .some(
          (permission) =>
            permission.read ||
            permission.write ||
            permission.update ||
            permission.delete ||
            permission.special
        ) ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.role.permissions
                .filter((permission) => !hiddenPermissions.has(permission?.modelName))
                .filter(
                  (permission) =>
                    permission.read ||
                    permission.write ||
                    permission.update ||
                    permission.delete ||
                    permission.special
                )
                .map((permission, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="font-medium text-indigo-600 mb-2">{permission.modelName}</h4>
                    <div className="flex flex-wrap gap-2">
                      {permission.read && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Read</span>}
                      {permission.write && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Write</span>}
                      {permission.update && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Update</span>}
                      {permission.delete && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Delete</span>}
                      {permission.special && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Special</span>}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : user?.plan?.featuresMasterIds?.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaListAlt className="mr-2" /> Plan Features
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {user.plan.featuresMasterIds.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600">
                  <strong className="text-indigo-600">{feature.name}</strong>: {feature.description}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-sm text-gray-600">No permissions or plan features available.</div>
        )}
      </div>

      {/* Status and Timestamps */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaShieldAlt className="text-indigo-600 mr-3" />
            <span className={`font-medium ${user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2" />
            <span>Last updated: {new Date(user?.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Email Token Form (if subscription) */}
      {/* <ProfileEmailTokenForm user={user} /> */}
      {user?.role?.name === 'SystemAdmin' && (
        <div className="mt-4">
          <ConnectGoogleButton companyId={user?.user?.companyMaster?._id} email={user?.email} />
        </div>
      )}
    </div>
  )
}

export default Profile
