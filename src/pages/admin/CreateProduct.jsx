import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import './CreateProduct.scss'

function CreateProduct() {
    const [images, setImages] = useState([]) //state images cho sản phẩm
    const [isClassify, setIsClassify] = useState(false) //checkbox phân loại
    const [classifyInputs, setClassifyInputs] = useState([
        {
            color: '',
            size: '',
            stockQuantity: 1,
            imageUrl: '',
            price: 0,
            id: 0,
        },
    ])
    const [selectedClassify, setSelectedClassify] = useState([])
    console.log(selectedClassify, classifyInputs)

    // Hàm xử lý khi upload ảnh
    const handleImageUpload = (e) => {
        if (images.length < 5) {
            const file = e.target.files[0]
            const fileURL = URL.createObjectURL(file)

            setImages((prevImages) => [...prevImages, fileURL])
        }
    }

    // Hàm render các ảnh đã upload
    const renderImages = () => {
        return images.map((image, index) => (
            <div key={index} className="uploaded-image position-relative">
                <img src={image} alt={`Uploaded ${index}`} className="uploaded-img" />
                {index === 0 && (
                    <p className="position-absolute bottom-0 text-white text-center end-0 start-0 fs-5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        Ảnh bìa
                    </p>
                )}
            </div>
        ))
    }

    const handleClassifyOptionChange = (e) => {
        const value = e.target.value
        if (value !== '') {
            setSelectedClassify((pre) => [...pre, value])
        }
    }

    const handleUploadImageClassify = (e, id) => {
        const file = e.target.files[0]
        const fileURL = URL.createObjectURL(file)

        setClassifyInputs((prev) => prev.map((input) => (input.id === id ? { ...input, imageUrl: fileURL } : input)))
    }

    const addClassifyInput = () => {
        console.log('add')

        setClassifyInputs((prev) => [
            ...prev,
            {
                color: '',
                size: '',
                stockQuantity: 1,
                imageUrl: '',
                price: 0,
                id: prev[prev.length - 1].id + 1,
            },
        ])
    }

    const removeClassifyInput = (id) => {
        console.log('remove')
        setClassifyInputs((prev) => {
            const news = prev.filter((item) => item.id !== id)
            if (news.length == 0) {
                setSelectedClassify([])
                setClassifyInputs([
                    {
                        color: '',
                        size: '',
                        stockQuantity: 1,
                        imageUrl: '',
                        price: 0,
                        id: 0,
                    },
                ])
            }
            return news
        })
    }

    useEffect(() => {
        if (!isClassify) {
            setSelectedClassify([])
            setClassifyInputs([
                {
                    color: '',
                    size: '',
                    stockQuantity: 1,
                    imageUrl: '',
                    price: 0,
                    id: 0,
                },
            ])
        }
    }, [isClassify])

    return (
        <>
            <div className="w-75">
                <div className="p-4 d-flex bg-white border">
                    <a href="#section1" className="fs-4 fw-medium">
                        Thông tin cơ bản
                    </a>
                    <a href="#section2" className="fs-4 ms-3">
                        Thông tin chi tiết
                    </a>
                    <a href="#section3" className="fs-4 ms-3">
                        Thông tin bán hàng
                    </a>
                    <a href="#section3" className="fs-4 ms-3">
                        Thông tin vận chuyển
                    </a>
                </div>

                <section id="section1" className="p-4 bg-white border mt-4">
                    <h2>Thông tin cơ bản</h2>
                    <div className="p-4">
                        <div className="d-flex mt-4">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Hình ảnh sản phẩm:
                            </p>
                            <div className="uploaded-images d-flex flex-wrap w-100">
                                {renderImages()}

                                {/* Hiển thị nút thêm ảnh nếu số ảnh nhỏ hơn 5 */}
                                {images.length < 5 && (
                                    <label className="custum-file-upload">
                                        <div className="icon-image">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" className="upload-icon">
                                                <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                                <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        fill=""
                                                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                                        clipRule="evenodd"
                                                        fillRule="evenodd"
                                                    />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="text">
                                            <span>Thêm hình ảnh</span>
                                        </div>
                                        <input type="file" id="file" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Tên sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" autoComplete="off" className="input-text w-100" placeholder="Tên sản phẩm" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Danh mục:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" autoComplete="off" className="input-text w-100" placeholder="Danh mục cho sản phẩm" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4 ">
                            <p className="text-nowrap me-4 w-25 mt-2">
                                <span style={{ color: 'red' }}>*</span> Mô tả sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100 h-auto">
                                <textarea type="text" autoComplete="off" className="input-text w-100 py-2" rows={5} placeholder="Mô tả sản phẩm" />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="section2" className="p-4 bg-white border mt-4">
                    <h2>Thông tin chi tiết</h2>
                    <div className="p-4">
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Số lượng:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" autoComplete="off" className="input-text w-100" placeholder="Số lượng trong kho" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Giá sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" autoComplete="off" className="input-text w-100" placeholder="Giá ban đầu của sản phẩm" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Thương hiệu:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" autoComplete="off" className="input-text w-100" placeholder="Thương hiệu của sản phẩm" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Chất liệu:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" autoComplete="off" className="input-text w-100" placeholder="Giá trị giảm giá cho sản phẩm" min="0" max="9999999999" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Giảm giá (%):</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" autoComplete="off" className="input-text w-100" placeholder="Nhập chất liệu của sản phẩm" min={1} step={1} max={100} />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <label className="d-flex align-items-center mx-3">
                                <input type="checkbox" className="input-checkbox" />
                                <span className="custom-checkbox"></span>
                            </label>
                            <p className="fs-4 fw-medium">Sản phẩm nổi bật</p>
                        </div>
                    </div>
                </section>
                <section id="section3" className="p-4 bg-white border mt-4">
                    <h2>Thông tin bán hàng</h2>
                    <div className="p-4">
                        <div className="d-flex mt-4">
                            <div className="w-25 d-flex me-3">
                                <label className="d-flex mx-3">
                                    <input type="checkbox" className="input-checkbox" onChange={() => setIsClassify((pre) => !pre)} />
                                    <span className="custom-checkbox mt-1"></span>
                                </label>
                                <p className="fs-4 fw-medium text-nowrap">Phân loại hàng</p>
                            </div>
                            <div className="w-100 ms-3">
                                {selectedClassify.length > 0 && classifyInputs.length > 0 && isClassify && (
                                    <div className="border p-3 mb-3">
                                        <div className="d-flex justify-content-between py-2 border-bottom align-items-center">
                                            <p className="fs-4 fw-medium">Phân loại</p>
                                            <FontAwesomeIcon icon={faPlus} className="p-3 border" size="lg" onClick={() => addClassifyInput()} />
                                        </div>
                                        <div className="row mt-3 g-2">
                                            {classifyInputs.map((input, index) => (
                                                <div key={input.id} className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center">
                                                    {input.imageUrl ? (
                                                        <img src={input.imageUrl} className="border me-3" style={{ width: 80, height: 80 }}></img>
                                                    ) : (
                                                        <label className="custum-file-upload p-0" style={{ width: 80, height: 80 }}>
                                                            <div className="icon-image">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" width={50} height={50}>
                                                                    <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                                                    <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                                                                    <g id="SVGRepo_iconCarrier">
                                                                        <path
                                                                            fill=""
                                                                            d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                                                            clipRule="evenodd"
                                                                            fillRule="evenodd"
                                                                        />
                                                                    </g>
                                                                </svg>
                                                            </div>

                                                            <input type="file" id="file" onChange={(e) => handleUploadImageClassify(e, input.id)} />
                                                        </label>
                                                    )}

                                                    <div className="ms-3">
                                                        {selectedClassify.includes('color') && (
                                                            <div className="input-form d-flex align-items-center w-100 h-auto">
                                                                <input type="text" autoComplete="off" className="input-text w-100 p-2" placeholder="Màu sắc" />
                                                            </div>
                                                        )}
                                                        {selectedClassify.includes('size') && (
                                                            <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                                <input type="text" autoComplete="off" className="input-text w-100 p-2" placeholder="Kích cỡ" />
                                                            </div>
                                                        )}
                                                        <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                            <input type="number" autoComplete="off" className="input-text w-100 p-2" placeholder="Số lượng" />
                                                        </div>
                                                        <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                            <input type="number" autoComplete="off" className="input-text w-100 p-2" placeholder="Giá" />
                                                        </div>
                                                    </div>
                                                    <FontAwesomeIcon
                                                        icon={faTrashCan}
                                                        className="fs-3 ms-3 p-2"
                                                        color="#ff7262"
                                                        onClick={() => {
                                                            removeClassifyInput(input.id)
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {isClassify && selectedClassify.length < 2 && (
                                    <div className="select z-1">
                                        <div className="selected">
                                            <p>Thêm phân loại hàng</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                            </svg>
                                        </div>
                                        <div className="options">
                                            {!selectedClassify.includes('color') && (
                                                <div title="option-1">
                                                    <input id="option-1" name="option" type="radio" value="color" onChange={handleClassifyOptionChange} />
                                                    <label className="option w-100" htmlFor="option-1" data-txt="Màu sắc" />
                                                </div>
                                            )}
                                            {!selectedClassify.includes('size') && (
                                                <div title="option-2">
                                                    <input id="option-2" name="option" type="radio" value="size" onChange={handleClassifyOptionChange} />
                                                    <label className="option w-100" htmlFor="option-2" data-txt="Size" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="me-4 w-25 ps-3">Số lượng đặt hàng tối thiểu:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" autoComplete="off" className="input-text w-100" placeholder="Số lượng đặt hàng tối thiểu của sản phẩm" min={1} step={1} max={100} />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className=" me-4 w-25 ps-3">Số lượng đặt hàng tối đa:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="number" autoComplete="off" className="input-text w-100" placeholder="Số lượng đặt hàng tối đa của sản phẩm" min={1} step={1} max={100} />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="section4" className="p-4 bg-white border mt-4">
                    <h2>Thông tin vận chuyển</h2>
                </section>
            </div>
        </>
    )
}

export default CreateProduct
