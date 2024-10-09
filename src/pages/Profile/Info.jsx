import { FaPenToSquare } from 'react-icons/fa6'
import './Info.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {fetchUser } from '../../redux/slices/userSlice'



function Info() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);
    
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [birth, setBirth] = useState('')
    
    // Gọi API lấy thông tin hồ sơ khi component được mount
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    
    useEffect(() => {
        if (user) {
            setUserName(user.name); 
            setEmail(user.email);       
            setPhone(user.phone);
            setBirth(user.birth)
        }       
    }, [user]);
    
    //state
    if (loading) return <div>Loading...</div>;
    if (error) {
        console.error(error); // Log lỗi ra console để kiểm tra
        return <div>Error: {error.message || 'Something went wrong'}</div>;
    }

    return (
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Hồ sơ của tôi</h1>
                    <div className="profile-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
                </div>
                <div className="profile-body">
                    <div className="profile-form col-8">
                        <form>
                            <table className="table-content">
                                <tbody>
                                    <tr>
                                        <td className="label-cell">
                                            <label>Tên</label>
                                        </td>
                                        <td className="input-cell">
                                            <div>
                                                <div className="input-wrapper">
                                                    <input type="text" className="form-control" value={userName} onChange={(e) => {
                                                        setUserName(e.target.value);
                                                    }} />
                                                </div>
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
                                                <a href="#" className="btn-control">
                                                    Thay đổi
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">
                                            <label>Số điện thoại</label>
                                        </td>
                                        <td className="input-cell">
                                            <div className="input-group">
                                                <div className="readonly-input">{ phone }</div>
                                                <a href="#" className="btn-control">Thay đổi</a>
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
                                                    <input type="radio" name="gender" value="male" />
                                                    <span className="custom-radio"></span> Nam
                                                </label>
                                                <label className="radio-option">
                                                    <input type="radio" name="gender" value="female" />
                                                    <span className="custom-radio"></span> Nữ
                                                </label>
                                                <label className="radio-option">
                                                    <input type="radio" name="gender" value="other" />
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
                                                <div className="readonly-input">{ birth }</div>
                                                <a className="btn-control">Thay đổi</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell"></td>
                                        <td className="input-cell">
                                            <button type="button" className="btn btn-solid-primary">
                                                Lưu
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                    <div className="profile-avatar col-4 border-start   ">
                        <div className="avatar-wrapper" style={{ backgroundImage: 'url("https://down-vn.img.susercontent.com/file/vn-11134004-7ras8-m0rc3sf0xksv28")' }}></div>
                        <div className="custom-file-upload">
                            <input id="file-upload" className="file-input" type="file" accept=".jpg,.jpeg,.png" />
                            <label htmlFor="file-upload" className="btn btn-light">Chọn ảnh</label>
                        </div>

                        <div className="file-info">
                            <div>Dụng lượng file tối đa 1 MB</div>
                            <div>Định dạng:.JPEG, .PNG</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Info;