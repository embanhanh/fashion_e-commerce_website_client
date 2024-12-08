import React from 'react';

const NotificationItem = ({ icon, title, description, time }) => (
    <div className="d-flex align-items-center py-2 fs-4">
        <div className={`rounded-circle p-2 ${icon === "user" ? "" : (icon === "lock" ? "bg-secondary" : "bg-info")} text-white`}>
            {icon === "user" ? (
                <img src={UserAvatar} alt="User Avatar" width="32" height="32" className="rounded-circle" />
            ) : (
                icon === "box" && <i className="bi bi-box-seam fs-4"></i>
            )}
            {icon === "lock" && <i className="bi bi-lock-fill fs-4"></i>}
        </div>
        <div className="ms-3 flex-grow-1">
            <h6 className="mb-0 fw-bold fs-4">{title}</h6>
            <p className="mb-0 text-muted small fs-4">{description}</p>
        </div>
        <small className="text-muted fs-4">{time}</small>
    </div>
);

function Notifications() {
    return (
        <div className="container mt-5 bg-white">
            <NotificationItem
                icon="bi-person-circle"
                title="Cập nhật tài khoản"
                description="Bạn vừa cập nhật ảnh đại diện của mình"
                time="Gần đây"
            />
            <hr className="my-2" />
            <NotificationItem
                icon="bi-box-seam"
                title="Đơn hàng đã được đặt"
                description="Đặt hàng mới của bạn đã được đặt thành công"
                time="11:00 AM"
            />
            <hr className="my-2" />
            <NotificationItem
                icon="bi-box-seam"
                title="Đơn hàng đã được giao"
                description="Đơn hàng của bạn đã được giao thành công"
                time="11:00 AM"
            />
            <hr className="my-2" />
            <NotificationItem
                icon="bi-person-circle"
                title="Bạn đã chia sẻ đánh giá của mình"
                description='"Giao đúng sản phẩm đã đặt"'
                time="10:00 AM"
            />
            <hr className="my-2" />
            <NotificationItem
                icon="bi-lock-fill"
                title="Cập nhật mật khẩu thành công"
                description="Mật khẩu của bạn đã được cập nhật thành công"
                time="11:00 AM"
            />
        </div>
    );
};

export default Notifications;