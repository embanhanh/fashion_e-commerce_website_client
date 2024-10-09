import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import './CreateProduct.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, addNewCategory } from '../../redux/slices/categorySlice'
import { fetchProductByProductName, updateProductAction } from '../../redux/slices/productSlice'
import { createProduct } from '../../services/ProductService'
import AddCategoryModal from '../../components/AddCategoryModal'
import CategoryDropdown from '../../components/CategoryDropdown'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase.config'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from 'react-bootstrap'
import Notification from '../../components/Notification'
import { Modal } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

function CreateProduct() {
    const { product_name } = useParams()
    const { currentProduct } = useSelector((state) => state.product)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { categories, status, error } = useSelector((state) => state.category)
    const [images, setImages] = useState([]) //state images cho sản phẩm
    const [isClassify, setIsClassify] = useState(false) //checkbox phân loại
    const [classifyInputs, setClassifyInputs] = useState([])
    const [selectedClassify, setSelectedClassify] = useState([])
    // ... các state hiện tại ...
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [material, setMaterial] = useState('')
    const [originalPrice, setOriginalPrice] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')
    const [discount, setDiscount] = useState('')
    const [isFeatured, setIsFeatured] = useState(false)
    const [minOrderQuantity, setMinOrderQuantity] = useState('')
    const [maxOrderQuantity, setMaxOrderQuantity] = useState('')
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ title: '', description: '', type: '' })

    const resetForm = () => {
        setName('')
        setDescription('')
        setOriginalPrice('')
        setBrand('')
        setMaterial('')
        setStockQuantity('')
        setDiscount('')
        setIsFeatured(false)
        setMinOrderQuantity('')
        setMaxOrderQuantity('')
        setSelectedCategories([])
        setImages([])
        setIsClassify(false)
        setErrors({})
    }

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories())
        }
    }, [status, dispatch])

    useEffect(() => {
        if (product_name) {
            dispatch(fetchProductByProductName(product_name))
        }
    }, [dispatch, product_name])

    useEffect(() => {
        if (product_name && currentProduct) {
            console.log(currentProduct)
            setName(currentProduct.name)
            setDescription(currentProduct.description)
            setOriginalPrice(currentProduct.originalPrice)
            setBrand(currentProduct.brand)
            setMaterial(currentProduct.material)
            setStockQuantity(currentProduct.stockQuantity)
            setDiscount(currentProduct.discount)
            setIsFeatured(currentProduct.isFeatured)
            setMinOrderQuantity(currentProduct.minOrderQuantity)
            setMaxOrderQuantity(currentProduct.maxOrderQuantity)
            setSelectedCategories(currentProduct.categories)
            setImages(currentProduct.urlImage)
            setIsClassify(currentProduct.variants.length > 0)
            let classify = []
            if (currentProduct.variants.length > 0 && currentProduct.variants.find((variant) => variant.color !== '')) {
                classify.push('color')
            }
            if (currentProduct.variants.length > 0 && currentProduct.variants.find((variant) => variant.size !== '')) {
                classify.push('size')
            }
            setSelectedClassify(classify)
            setClassifyInputs(currentProduct.variants.map((variant) => ({ ...variant, id: variant._id })))
        }
    }, [product_name, currentProduct])

    const clearError = (field) => {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors }
            delete newErrors[field]
            return newErrors
        })
    }

    const handleAddCategory = async (newCategoryData) => {
        try {
            await dispatch(addNewCategory(newCategoryData)).unwrap()
            // Optionally, you can show a success message here
        } catch (error) {
            // Handle error, maybe show an error message
            console.error('Failed to add new category:', error)
        }
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
        clearError('name')
    }

    const handleSelectCategory = (category) => {
        setSelectedCategories((prev) => [...prev, category])
        clearError('category')
    }

    const handleRemoveCategory = (categoryToRemove) => {
        setSelectedCategories((prev) => prev.filter((cat) => cat._id !== categoryToRemove._id))
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
        clearError('description')
    }

    const handleOriginalPriceChange = (e) => {
        setOriginalPrice(e.target.value)
        clearError('originalPrice')
    }

    const handleStockQuantityChange = (e) => {
        setStockQuantity(e.target.value)
        clearError('stockQuantity')
    }

    // Hàm xử lý thay đổi cho phân loại sản phẩm
    const handleClassifyInputChange = (index, field, value) => {
        setClassifyInputs((prevInputs) => {
            const newInputs = [...prevInputs]
            newInputs[index] = { ...newInputs[index], [field]: value }
            return newInputs
        })
        clearError(`classifyInputs.${index}.${field}`)
    }

    const validateForm = () => {
        let newErrors = {}
        if (!name) newErrors.name = 'Tên sản phẩm là bắt buộc'
        if (!description) newErrors.description = 'Mô tả sản phẩm là bắt buộc'
        if (!originalPrice) newErrors.originalPrice = 'Giá sản phẩm là bắt buộc'
        if (!stockQuantity) newErrors.stockQuantity = 'Số lượng trong kho là bắt buộc'
        if (images.length === 0) {
            newErrors.images = 'Cần ít nhất 1 hình ảnh sản phẩm'
        }
        if (selectedCategories.length === 0) {
            newErrors.category = 'Cần chọn ít nhất 1 danh mục cho sản phẩm'
        }

        if (isClassify && classifyInputs.length > 0) {
            classifyInputs.forEach((input, index) => {
                if (selectedClassify.includes('color') && !input.color) {
                    newErrors[`classifyInputs.${index}.color`] = 'Màu sắc là bắt buộc'
                }
                if (selectedClassify.includes('size') && !input.size) {
                    newErrors[`classifyInputs.${index}.size`] = 'Kích cỡ là bắt buộc'
                }
                if (!input.stockQuantity) {
                    newErrors[`classifyInputs.${index}.stockQuantity`] = 'Số lượng là bắt buộc'
                }
                if (!input.price) {
                    newErrors[`classifyInputs.${index}.price`] = 'Giá là bắt buộc'
                }
                if (!input.imageUrl) {
                    newErrors[`classifyInputs.${index}.image`] = 'Thiếu hình ảnh'
                }
            })
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const uploadImage = async (imageFile) => {
        const imageRef = ref(storage, `products/${uuidv4()}`)
        await uploadBytes(imageRef, imageFile)
        return getDownloadURL(imageRef)
    }

    const handleSubmit = async (e) => {
        if (validateForm()) {
            setIsLoading(true)
            try {
                const uploadedImageUrls = await Promise.all(
                    images.map(async (image) => {
                        if (image.startsWith('https://firebasestorage.googleapis.com')) {
                            return image
                        } else {
                            const response = await fetch(image)
                            const blob = await response.blob()
                            return uploadImage(blob)
                        }
                    })
                )
                const validVariants = await Promise.all(
                    classifyInputs.map(async (input) => {
                        if ((!selectedClassify.includes('color') || input.color) && (!selectedClassify.includes('size') || input.size) && input.stockQuantity && input.price) {
                            let variantImageUrl = input.imageUrl
                            if (input.imageUrl && !input.imageUrl.startsWith('http')) {
                                const response = await fetch(input.imageUrl)
                                const blob = await response.blob()
                                variantImageUrl = await uploadImage(blob)
                            }
                            return {
                                ...input,
                                imageUrl: variantImageUrl,
                            }
                        }
                        return null
                    })
                )

                const filteredVariants = validVariants.filter((variant) => variant !== null)

                const productData = {
                    name,
                    description,
                    urlImage: uploadedImageUrls,
                    brand,
                    material,
                    originalPrice: parseFloat(originalPrice),
                    stockQuantity: parseInt(stockQuantity),
                    rating: 0,
                    isFeatured,
                    isActive: true,
                    discount: parseFloat(discount) || 0,
                    categories: selectedCategories.map((cat) => cat._id),
                    variants: isClassify ? filteredVariants : [],
                    minOrderQuantity: parseInt(minOrderQuantity) || 1,
                    maxOrderQuantity: parseInt(maxOrderQuantity) || 100,
                }

                if (product_name) {
                    const response = await dispatch(updateProductAction({ product_name, productData }))
                    if (response.payload.product) {
                        setMessage({ type: 'success', title: 'Cập nhật sản phẩm thành công', description: '' })
                    }
                } else {
                    const response = await createProduct(productData)
                    if (response) {
                        setMessage({ type: 'success', title: 'Thêm sản phẩm thành công', description: '' })
                    }
                }
                resetForm()
            } catch (error) {
                console.error('Error creating product:', error)
                setMessage({ type: 'error', title: error.message || 'Có lỗi xảy ra khi tạo sản phẩm', description: 'Vui lòng thử lại' })
            } finally {
                setIsLoading(false)
            }
        } else {
            console.log(errors)
        }
    }

    // Hàm xử lý khi upload ảnh
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) {
            return
        }
        const remainingSlots = 5 - images.length
        if (remainingSlots <= 0) {
            return
        }
        const filesToAdd = files.slice(0, remainingSlots)
        const newImages = filesToAdd.map((file) => URL.createObjectURL(file))
        setImages((prevImages) => [...prevImages, ...newImages])
        clearError('images')
    }

    const removeImageUpload = (index) => {
        setImages((prevImages) => prevImages.filter((_, ind) => ind !== index))
        const mainProductFileInput = document.getElementById('main-product-images')
        if (mainProductFileInput) {
            mainProductFileInput.value = ''
        }
    }

    // Hàm render các ảnh đã upload
    const renderImages = () => {
        return images?.map((image, index) => (
            <div key={index} className="uploaded-image position-relative">
                <img src={image} alt={`Uploaded ${index}`} className="uploaded-img" />
                {index === 0 && (
                    <p className="position-absolute bottom-0 text-white text-center end-0 start-0 fs-5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        Ảnh bìa
                    </p>
                )}
                <div className="position-absolute d-none top-0 end-0 close-uploaded-img" onClick={() => removeImageUpload(index)} style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <FontAwesomeIcon icon={faCircleXmark} size="2xl" color="white" />
                </div>
            </div>
        ))
    }

    const handleClassifyOptionChange = (e) => {
        const value = e.target.value
        if (value !== '') {
            setSelectedClassify((pre) => [...pre, value])
        }
    }

    const handleUploadImageClassify = (e, index) => {
        const file = e.target.files[0]
        if (file) {
            const fileURL = URL.createObjectURL(file)

            setClassifyInputs((prev) => prev.map((input, ind) => (ind === index ? { ...input, imageUrl: fileURL } : input)))
            clearError(`classifyInputs.${index}.image`)
        }
    }

    const removeImageUploadClassify = (index) => {
        setClassifyInputs((prev) => prev.map((input, ind) => (ind === index ? { ...input, imageUrl: '' } : input)))

        const classifyFileInput = document.getElementById(`classify-image-${index}`)
        if (classifyFileInput) {
            classifyFileInput.value = ''
        }
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
                setClassifyInputs([])
            }
            return news
        })
    }

    useEffect(() => {
        if (!isClassify) {
            setSelectedClassify([])
            setClassifyInputs([])
        } else {
            setClassifyInputs([
                {
                    color: '',
                    size: '',
                    stockQuantity: 0,
                    imageUrl: '',
                    price: 0,
                    id: 0,
                },
            ])
        }
    }, [isClassify])

    return (
        <>
            <Modal show={!!message.type} onHide={() => setMessage({ type: '', title: '', description: '' })} centered>
                <Notification title={message.title} description={message.description} type={message.type} />
            </Modal>

            <div className="w-75 pb-5">
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
                    <a href="#section4" className="fs-4 ms-3">
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
                                {images?.length < 5 && (
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
                                        <input type="file" multiple id="main-product-images" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                        {errors.images && <p className="text-danger ms-2 pt-2">{errors.images}</p>}
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Tên sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" className="input-text w-100" placeholder="Tên sản phẩm" onChange={handleNameChange} value={name} />
                            </div>
                        </div>
                        {errors.name && <p className="text-danger ms-2 pt-2">{errors.name}</p>}
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Danh mục:
                            </p>

                            <div className="d-flex align-items-center w-100 justify-content-between">
                                <CategoryDropdown categories={categories} onSelect={handleSelectCategory} selectedCategories={selectedCategories} />
                                <div className="ms-2 border p-3" onClick={() => setShowAddCategoryModal(true)}>
                                    <p className="fs-4">
                                        Thêm danh mục mới <FontAwesomeIcon icon={faPlus} className="ms-3" />
                                    </p>
                                </div>
                            </div>
                        </div>
                        {selectedCategories.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap" style={{ marginLeft: '22%' }}>
                                {selectedCategories.map((category, index) => (
                                    <Badge key={index} bg="secondary" className="me-2 p-3" style={{ cursor: 'pointer' }}>
                                        <p className="fs-5">
                                            {category.parentCategory ? `${category.parentCategory.name} > ${category.name}` : category.name}{' '}
                                            <FontAwesomeIcon onClick={() => handleRemoveCategory(category)} icon={faCircleXmark} className="ms-3" />
                                        </p>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {errors.category && <p className="text-danger ms-2 pt-2">{errors.category}</p>}
                        <AddCategoryModal show={showAddCategoryModal} handleClose={() => setShowAddCategoryModal(false)} categories={categories} onAddCategory={handleAddCategory} />
                        <div className="d-flex mt-4 ">
                            <p className="text-nowrap me-4 w-25 mt-2">
                                <span style={{ color: 'red' }}>*</span> Mô tả sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100 h-100">
                                <textarea
                                    type="text"
                                    autoComplete="off"
                                    className="input-text w-100 py-2"
                                    rows={5}
                                    placeholder="Mô tả sản phẩm"
                                    onChange={handleDescriptionChange}
                                    value={description}
                                />
                            </div>
                        </div>
                        {errors.description && <p className="text-danger ms-2 pt-2">{errors.description}</p>}
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
                                <input
                                    type="number"
                                    onChange={handleStockQuantityChange}
                                    value={stockQuantity}
                                    className="input-text w-100"
                                    placeholder="Số lượng trong kho"
                                    min="0"
                                    max="9999999999"
                                />
                            </div>
                        </div>
                        {errors.stockQuantity && <p className="text-danger ms-2 pt-2">{errors.stockQuantity}</p>}
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25">
                                <span style={{ color: 'red' }}>*</span> Giá sản phẩm:
                            </p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input
                                    type="number"
                                    onChange={handleOriginalPriceChange}
                                    value={originalPrice}
                                    className="input-text w-100"
                                    placeholder="Giá ban đầu của sản phẩm"
                                    min="0"
                                    max="9999999999"
                                />
                            </div>
                        </div>
                        {errors.originalPrice && <p className="text-danger ms-2 pt-2">{errors.originalPrice}</p>}
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Thương hiệu:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" onChange={(e) => setBrand(e.target.value)} value={brand} className="input-text w-100" placeholder="Thương hiệu của sản phẩm" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Chất liệu:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" onChange={(e) => setMaterial(e.target.value)} value={material} className="input-text w-100" placeholder="Giá trị giảm giá cho sản phẩm" />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className="text-nowrap me-4 w-25 ps-3">Giảm giá (%):</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input
                                    type="number"
                                    className="input-text w-100"
                                    placeholder="Nhập chất liệu của sản phẩm"
                                    min={1}
                                    step={1}
                                    max={100}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    value={discount}
                                />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <label className="d-flex align-items-center mx-3">
                                <input type="checkbox" className="input-checkbox" checked={isFeatured} onChange={() => setIsFeatured((pre) => !pre)} />
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
                            <div className="w-25 d-flex me-4">
                                <label className="d-flex mx-3">
                                    <input type="checkbox" className="input-checkbox" checked={isClassify} onChange={() => setIsClassify((pre) => !pre)} />
                                    <span className="custom-checkbox mt-1"></span>
                                </label>
                                <p className="fs-4 fw-medium text-nowrap">Phân loại hàng</p>
                            </div>
                            <div className="w-100 ms-1">
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
                                                        <>
                                                            <div className="border me-3 position-relative uploaded-img-classify">
                                                                <img src={input.imageUrl} style={{ width: 80, height: 80 }}></img>
                                                                <div
                                                                    className="position-absolute d-none top-0 end-0 close-uploaded-img"
                                                                    onClick={() => removeImageUploadClassify(index)}
                                                                    style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                                >
                                                                    <FontAwesomeIcon icon={faCircleXmark} size="2xl" color="white" />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
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

                                                                <input type="file" accept="image/*" id={`classify-image-${index}`} onChange={(e) => handleUploadImageClassify(e, index)} />
                                                            </label>
                                                            {errors[`classifyInputs.${index}.image`] && <p className="text-danger fs-5">{errors[`classifyInputs.${index}.image`]}</p>}
                                                        </div>
                                                    )}

                                                    <div className="ms-3">
                                                        {selectedClassify.includes('color') && (
                                                            <>
                                                                <div className="input-form d-flex align-items-center w-100 h-auto">
                                                                    <input
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        className="input-text w-100 p-2"
                                                                        placeholder="Màu sắc"
                                                                        onChange={(e) => handleClassifyInputChange(index, 'color', e.target.value)}
                                                                        value={input.color}
                                                                    />
                                                                </div>
                                                                {errors[`classifyInputs.${index}.color`] && <p className="text-danger fs-5 ms-2">{errors[`classifyInputs.${index}.color`]}</p>}
                                                            </>
                                                        )}
                                                        {selectedClassify.includes('size') && (
                                                            <>
                                                                <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                                    <input
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        className="input-text w-100 p-2"
                                                                        placeholder="Kích cỡ"
                                                                        onChange={(e) => handleClassifyInputChange(index, 'size', e.target.value)}
                                                                        value={input.size}
                                                                    />
                                                                </div>
                                                                {errors[`classifyInputs.${index}.size`] && <p className="text-danger fs-5 ms-2">{errors[`classifyInputs.${index}.size`]}</p>}
                                                            </>
                                                        )}
                                                        <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                            <input
                                                                type="number"
                                                                autoComplete="off"
                                                                className="input-text w-100 p-2"
                                                                placeholder="Số lượng"
                                                                onChange={(e) => handleClassifyInputChange(index, 'stockQuantity', e.target.value)}
                                                                value={input.stockQuantity}
                                                            />
                                                        </div>
                                                        {errors[`classifyInputs.${index}.stockQuantity`] && <p className="text-danger fs-5 ms-2">{errors[`classifyInputs.${index}.stockQuantity`]}</p>}
                                                        <div className="input-form d-flex align-items-center w-100 mt-2 h-auto">
                                                            <input
                                                                type="number"
                                                                autoComplete="off"
                                                                className="input-text w-100 p-2"
                                                                placeholder="Giá"
                                                                onChange={(e) => handleClassifyInputChange(index, 'price', e.target.value)}
                                                                value={input.price}
                                                            />
                                                        </div>
                                                        {errors[`classifyInputs.${index}.price`] && <p className="text-danger fs-5 ms-2">{errors[`classifyInputs.${index}.price`]}</p>}
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
                                    <div className="select z-1 " style={{ height: 45 }}>
                                        <div className="selected border rounded-0 py-3 px-4">
                                            <p>Thêm phân loại hàng</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                            </svg>
                                        </div>
                                        <div className="options border rounded-0">
                                            {!selectedClassify.includes('color') && (
                                                <div title="option-1">
                                                    <input id="option-1" name="option" type="radio" value="color" onChange={handleClassifyOptionChange} />
                                                    <label className="option w-100 calssify-option" htmlFor="option-1" data-txt="Màu sắc" />
                                                </div>
                                            )}
                                            {!selectedClassify.includes('size') && (
                                                <div title="option-2">
                                                    <input id="option-2" name="option" type="radio" value="size" onChange={handleClassifyOptionChange} />
                                                    <label className="option w-100 calssify-option" htmlFor="option-2" data-txt="Size" />
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
                                <input
                                    type="number"
                                    onChange={(e) => setMinOrderQuantity(e.target.value)}
                                    value={minOrderQuantity}
                                    className="input-text w-100"
                                    placeholder="Số lượng đặt hàng tối thiểu của sản phẩm"
                                    min={1}
                                    step={1}
                                    max={100}
                                />
                            </div>
                        </div>
                        <div className="d-flex mt-4  align-items-center">
                            <p className=" me-4 w-25 ps-3">Số lượng đặt hàng tối đa:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input
                                    type="number"
                                    onChange={(e) => setMaxOrderQuantity(e.target.value)}
                                    value={maxOrderQuantity}
                                    className="input-text w-100"
                                    placeholder="Số lượng đặt hàng tối đa của sản phẩm"
                                    min={1}
                                    step={1}
                                    max={100}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="section4" className="p-4 bg-white border mt-4">
                    <h2>Thông tin vận chuyển</h2>
                </section>
                <section className="d-flex flex-row-reverse mt-4">
                    <div className="">
                        <div className="d-flex flex-row-reverse">
                            <button
                                disabled={isLoading || Object.keys(errors).length !== 0}
                                className="primary-btn px-4 py-2 shadow-none ms-4 rounded-0"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                <p>Xác nhận</p>
                                {isLoading && (
                                    <div className="dot-spinner ms-4">
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                        <div className="dot-spinner__dot"></div>
                                    </div>
                                )}
                            </button>
                            <button className="border ms-4 bg-white" onClick={() => navigate(-1)}>
                                <p>Hủy</p>
                            </button>
                        </div>

                        {Object.keys(errors).length !== 0 && <p className="text-danger ms-2 pt-2">Vui lòng điền đầy đủ thông tin cần thiết cho sản phẩm</p>}
                    </div>
                </section>
            </div>
        </>
    )
}

export default CreateProduct
