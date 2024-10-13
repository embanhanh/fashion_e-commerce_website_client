import { FaPenToSquare } from 'react-icons/fa6'
import './Info.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchUser } from '../../redux/slices/userSlice'
import { NavLink } from 'react-router-dom'



function Info() {    
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [birth, setBirth] = useState('')
    const [gender, setGender] = useState('male')
    const [urlImage, setUrlImage] = useState('')

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setUserName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setBirth(formatDate(user.birthday)); // Sử dụng hàm formatDate
            setGender(user.gender || '');
            setUrlImage(user.urlImage || '');
        }
    }, [user]);
    


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (loading) return (
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    );
    if (error) {
        console.error(error);
        return <div>Error: {error.message}</div>;  // Hiển thị lỗi cho người dùng
    }


    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="profile-title">Hồ sơ của tôi</h1>
                <div className="profile-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <div className="profile-body">
                <div className="profile-form col-8">
                    <form >
                        <table className="table-content">
                            <tbody>
                                <tr>
                                    <td className="label-cell">
                                        <label>Tên</label>
                                    </td>
                                    <td className="input-cell">
                                        <div className="input-wrapper">
                                            <input type="text" className="form-control" value={userName} readOnly />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">
                                        <label>Email</label>
                                    </td>
                                    <td className="input-cell">
                                        <div className="input-group d-inline-flex">
                                            <div className="readonly-input">{email}</div>
                                            <NavLink to="#" className="btn-control">Thay đổi</NavLink>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">
                                        <label>Số điện thoại</label>
                                    </td>
                                    <td className="input-cell">
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={phone} readOnly />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">
                                        <label>Giới tính</label>
                                    </td>
                                    <td className="input-cell">
                                        <div className="radio-group">
                                            <label className="radio-option">
                                                <input type="radio" name="gender" value="male" checked={gender === 'male'} readOnly />
                                                <span className="custom-radio"></span> Nam
                                            </label>
                                            <label className="radio-option">
                                                <input type="radio" name="gender" value="female" checked={gender === 'female'} readOnly />
                                                <span className="custom-radio"></span> Nữ
                                            </label>
                                            <label className="radio-option">
                                                <input type="radio" name="gender" value="other" checked={gender === 'other'} readOnly />
                                                <span className="custom-radio"></span> Khác
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">
                                        <label>Ngày sinh</label>
                                    </td>
                                    <td className="input-cell">
                                        <div className="input-group">
                                            <input type="date" className="form-control" value={birth} readOnly />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell"></td>
                                    <td className="input-cell">
                                        <NavLink to='/user/account/profile/edit' className="btn edit-btn">
                                            Chỉnh sửa
                                        </NavLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="profile-containner col-4">                    
                    <div className="border-start profile-avatar" >
                        <img src={urlImage} alt='avarta-image' style={{ width: '100px', height: '100px', borderRadius: '50%', }} />
                    </div>                                      
                </div>
            </div>
        </div>
    );
}

export default Info;