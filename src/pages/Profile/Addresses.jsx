import React from 'react';
import AddressItem from '../../components/AddressItem';
import {FaPlus} from 'react-icons/fa6'
import './Addresses.scss';

function Addresses() {
    const addresses = [
        {
            name: 'Tăng Thiện',
            phone: '(+84) 123 456 789',
            address: 'Phường Đông Hòa, Thành Phố Dĩ An, Bình Dương',
            addressDetail: 'Ký Túc Xá Khu B, Đường Mạc Đĩnh Chi',
            isDefault: true,
        },
        {
            name: 'Tăng Thiện',
            phone: '(+84) 123 456 789',
            address: 'Phường Linh Trung, Thành Phố Thủ Đức, TP. Hồ Chí Minh',
            addressDetail: 'Trường Đại Học Công Nghệ Thông Tin, Khu Phố 6 Làng Đại Học Quốc Gia Tphcm',
            isDefault: false,
        },
    ];

    return (
        // <div className="container">

        // </div>
        
        <div className="container">
            <div className="address-section d-flex align-content-center border-bottom">
                <div className="address-header">
                    <div className="header-title">Địa chỉ của tôi</div>
                    <div className="header-space"></div>
                </div>
                <div>
                    <div className="add-address-button-container">
                        <div className="d-flex align-content-center">
                            <button className="btn btn-dark add-address-btn">
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
                
                
            <div class="address-container">
                <div class="address-title">Địa chỉ</div>
                {addresses.map((address, index) => (
                    <AddressItem key={index} address={address} />
                ))}
            </div>
        </div>
        
    );
}

export default Addresses;
