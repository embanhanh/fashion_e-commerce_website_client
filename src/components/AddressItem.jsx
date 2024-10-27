import React, { useState } from 'react'
import EditAddressModal from './EditAddressModal'
import './AddressItem.scss' // Import SCSS file
import { deleteAddress, updateAddress, setDefaultAddress } from '../redux/slices/userSlice'
import { useDispatch } from 'react-redux'

function AddressItem({ address, onAddressUpdated }) {
    const dispatch = useDispatch()
    const [showEditModal, setShowEditModal] = useState(false) // State để quản lý modal

    const handleEditAddress = async (updatedAddress) => {
        if (address._id) {
            try {
                await dispatch(updateAddress({ address_id: address._id, addressData: updatedAddress }))
                onAddressUpdated() // Gọi callback để thông báo đã cập nhật
                setShowEditModal(false)
            } catch (error) {
                console.error('Error updating address:', error)
            }
        } else {
            console.error('Address ID is undefined')
        }
    }

    const handleDeleteAddress = async () => {
        try {
            if (address._id) {  // Ensure address._id exists before calling the API
                await dispatch(deleteAddress({ address_id: address._id }))
                onAddressUpdated()
            } else {
                console.error('Address ID is undefined')
            }
        } catch (error) {
            console.error('Error deleting address:', error)
        }
    }

    const handleSetDefaultAddress = async () => {
        try {
            console.log('Address:', address); // Log the address object
            if (address._id) {
                await dispatch(setDefaultAddress(address._id)); // Gửi ID thay vì đối tượng
                onAddressUpdated();
            } else {
                console.error('Address ID is undefined'); // Log error if ID is undefined
            }
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    }


    return (
        <div className="address-item-container">
            <div className="address-item">
                <div role="heading" className="address-header d-flex">
                    <div className="address-header-details d-flex flex-row">
                        <span className="address-name-container">
                            <div className="address-name">{address.name}</div>
                        </span>
                        <div className="spacer"></div>
                        <div role="row" className="address-phone mt-2 ">
                            {address.phone}
                        </div>
                    </div>
                    <div className="address-actions">
                        <button className="btn-update fs-5" onClick={() => setShowEditModal(true)}>Cập nhật</button> {/* Mở modal khi nhấn nút */}
                    </div>
                    <div className="address-actions">
                        <button className="btn-update fs-5" onClick={handleDeleteAddress}>Xóa</button>
                    </div>
                </div>
                <div role="heading" className="address-content d-flex">
                    <div className="address-details">
                        <div className="address-lines">
                            <div role="row" className="address-line">
                                {address.location}
                            </div>
                        </div>
                    </div>
                    <div className="default-btn-container">
                        {address.default ? (
                            <button className="btn-set-default" disabled>
                                Thiết lập mặc định
                            </button>
                        ) : (
                            <button className="btn-set-default" onClick={handleSetDefaultAddress}>Thiết lập mặc định</button>
                        )}
                    </div>
                </div>
                <div role="row" className="badge-container mt-4">
                    {address.default ? (
                        <span role="mark" className="badge-default">
                            Mặc định
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* Thêm EditAddressModal */}
            <EditAddressModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                onEditAddress={handleEditAddress}
                address={address} // Truyền địa chỉ hiện tại vào modal
            />
        </div>
    )
}

export default AddressItem
