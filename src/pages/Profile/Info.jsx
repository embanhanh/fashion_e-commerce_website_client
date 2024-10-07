import { FaPenToSquare } from 'react-icons/fa6'
import brandImage from '../../assets/image/brand/brand-1.png'
import './Info.scss'

function Info() {
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
                                                    <input type="text" className="form-control" />
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
                                                <div className="readonly-input">tr**********@gmail.com</div>
                                                <a href="/user/account/email" className="btn-control">
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
                                                <div className="readonly-input">*********91</div>
                                                <a className="btn-control">Thay đổi</a>
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
                                                <div className="readonly-input">**/07/20**</div>
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
                            <label htmlFor="file-upload" className="btn btn-light">
                                Chọn ảnh
                            </label>
                        </div>

                        <div className="file-info">
                            <div>Dụng lượng file tối đa 1 MB</div>
                            <div>Định dạng:.JPEG, .PNG</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Info
