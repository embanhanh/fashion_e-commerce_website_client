import React from 'react'
import AddressItem from '../../components/AddressItem'
import { FaPlus } from 'react-icons/fa6'
import './Addresses.scss'
import { fetchAddresses, addNewAddress } from '../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import AddAddressModal from '../../components/AddAddressModal'

function Addresses() {
    const dispatch = useDispatch()
    const { addresses, loading, error } = useSelector((state) => state.user)

    const [showNewAddressModal, setShowAddressModal] = useState(false)

    useEffect(() => {
        dispatch(fetchAddresses())
    }, [dispatch])

    const handleCloseModal = () => {
        setShowAddressModal(false)
    }

    const handleAddAddress = (newAddressData) => {
        dispatch(addNewAddress(newAddressData))
        handleCloseModal()
    }

    const handleSetShowModal = () => {
        setShowAddressModal(true)
    }


    const onAddressUpdated = () => {
        dispatch(fetchAddresses()) // Gọi lại để lấy danh sách địa chỉ mới
    }

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
    if (error) {
        return <div>{error.message}</div> // Render message từ object `Error`.

    }

    // Sort addresses to move the default address to the top
    const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.default && !b.default) return -1; // Move 'true' to the top
        if (!a.default && b.default) return 1;  // Move 'false' to the bottom
        return 0; // Keep the order for other addresses
    });

    return (
        <div className="container">
            <div className="address-section d-flex align-content-center border-bottom">
                <div className="address-header">
                    <div className="header-title">Địa chỉ của tôi</div>
                    <div className="header-space"></div>
                </div>
                <div>
                    <div className="add-address-button-container">
                        <div className="d-flex align-content-center">
                            <button className="btn-addnew btn-dark add-address-btn" onClick={handleSetShowModal}>
                                <div className="button-content d-flex">
                                    <div className="icon-wrapper">
                                        <FaPlus className="me-2" />
                                    </div>
                                    <div>Thêm địa chỉ mới</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AddAddressModal show={showNewAddressModal} handleClose={handleCloseModal} onAddAddress={handleAddAddress} />

            <div className="address-container">
                <div className="address-title">Địa chỉ</div>
                {sortedAddresses.map((address, index) => (
                    <AddressItem key={index} address={address} onAddressUpdated={onAddressUpdated} />
                ))}
            </div>
        </div>
    )
}

export default Addresses
