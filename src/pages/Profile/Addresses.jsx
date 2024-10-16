import React from 'react'
import AddressItem from '../../components/AddressItem'
import { FaPlus } from 'react-icons/fa6'
import './Addresses.scss'
import { fetchAddresses, addNewAddress } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import AddAddressModal from '../../components/AddAddressModal';

function Addresses() {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state) => state.user);

    const [showNewAddressModal, setShowAddressModal] = useState(false)

    useEffect(() => {
        dispatch(fetchAddresses())
    }, [dispatch])

    const handleCloseModal = () => {
        setShowAddressModal(false)
    }

    const handleAddAddress = async (newAddressData) => {
        console.log('New Address Data:', newAddressData); // Kiểm tra dữ liệu
        try {
            const result = await dispatch(addNewAddress(newAddressData));
            console.log('Result:', result); // Kiểm tra kết quả
            handleCloseModal();
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const onAddressUpdated = async () => {
        dispatch(fetchAddresses()); // Gọi lại để lấy danh sách địa chỉ mới
    };

    if (loading) return <p>Loading...</p>;
    if (error) {
        return <div>{error.message}</div>; // Render message từ object `Error`.

    }

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
                            <button className="btn-addnew btn-dark add-address-btn" onClick={() => setShowAddressModal(true)}>
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
                {addresses.map((address, index) => (
                    <AddressItem key={index} address={address} onAddressUpdated={onAddressUpdated} />
                ))}
            </div>
        </div>
    )
}

export default Addresses
