import React from 'react'
import './AddressItem.scss' // Import SCSS file

function AddressItem({ address }) {
    return (
        <div class="address-item-container">
            <div class="address-item">
                <div role="heading" class="address-header d-flex">
                    <div class="address-header-details d-flex">
                        <span class="address-name-container">
                            <div class="address-name">{address.name}</div>
                        </span>
                        <div class="spacer"></div>
                        <div role="row" class="address-phone">
                            {address.phone}
                        </div>
                    </div>
                    <div class="address-actions">
                        <button class="btn-update">Cập nhật</button>
                    </div>
                    <div class="address-actions">
                        <button class="btn-update">Xóa</button>
                    </div>
                </div>
                <div role="heading" class="address-content d-flex">
                    <div class="address-details">
                        <div class="address-lines">
                            <div role="row" class="address-line">
                                {address.addressDetail}
                            </div>
                            <div role="row" class="address-line">
                                {address.address}
                            </div>
                        </div>
                    </div>
                    <div class="default-btn-container">
                        {address.isDefault ? (
                            <button class="btn-set-default" disabled>
                                Thiết lập mặc định
                            </button>
                        ) : (
                            <button class="btn-set-default">Thiết lập mặc định</button>
                        )}
                    </div>
                </div>
                <div id="address-card_02585faf-3edc-40d0-a080-3a20474a005e_badge" role="row" class="badge-container">
                    {address.isDefault ? (
                        <span role="mark" class="badge-default">
                            Mặc định
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddressItem
