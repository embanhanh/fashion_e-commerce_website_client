import './ProductList.scss'
import { useEffect, useLayoutEffect, useState, useMemo } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Accordion from '../../components/Accordion'
import ProductCard from '../../components/ProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters, setSortOption } from '../../redux/slices/productSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'

function ProductList() {
    const dispatch = useDispatch()
    const { allProducts, filteredProducts, filters, status, error } = useSelector((state) => state.product)
    const { categories, status: categoryStatus, error: categoryError } = useSelector((state) => state.category)

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchCategories())
    }, [dispatch])

    const filteredCategories = useMemo(() => {
        return categories
            .filter((category) => !category.parentCategory)
            .map((parent) => ({
                ...parent,
                children: categories.filter((child) => child.parentCategory && child.parentCategory._id === parent._id),
            }))
    }, [categories])

    const handleFilterChange = (filterType, value) => {
        dispatch(setFilters({ [filterType]: value }))
    }

    const handleSortChange = (e) => {
        dispatch(setSortOption(e.target.value))
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    return (
        <>
            <div className="container h-100 py-5">
                <p className="fs-3 fw-bold">Cửa hàng</p>
                <div className="d-flex">
                    <div className="p-2" style={{ width: '20%' }}>
                        <Accordion
                            data={[
                                {
                                    title: 'Danh mục sản phẩm',
                                },
                            ]}
                            isOpen={true}
                            onChange={(value) => handleFilterChange('category', value)}
                        >
                            <Accordion
                                data={filteredCategories.map((parent) => ({
                                    title: parent.name,
                                    content: parent.children.map((child) => ({ name: child.name, id: child._id })),
                                    isChecked: true,
                                    id: parent._id,
                                }))}
                                onChange={(value) => handleFilterChange('category', value)}
                            />
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo giá cả',
                                },
                            ]}
                            isOpen={true}
                        >
                            <div className="">
                                <div className="d-flex mb-3 align-items-center">
                                    <div className="input-form d-flex align-items-center " style={{ height: '30px' }}>
                                        <input type="number" autoComplete="off" className="input-text w-100" placeholder="Từ" min="0" max="9999999999" />
                                    </div>
                                    <div className="ms-3 input-form d-flex align-items-center " style={{ height: '30px' }}>
                                        <input type="number" autoComplete="off" className="input-text w-100" placeholder="Đến" min="0" max="9999999999" />
                                    </div>
                                </div>
                                <button className="primary-btn btn-sm w-100 py-1 mb-2 shadow-none">
                                    <p>Áp dụng</p>
                                </button>
                            </div>
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo màu sắc',
                                },
                            ]}
                            isOpen={true}
                        >
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color bg-danger"></div>
                                    <p className="ms-3 fw-medium fs-4">Đỏ</p>
                                </div>
                                <p className="fw-medium fs-4"></p>
                            </div>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color bg-primary"></div>
                                    <p className="ms-3 fw-medium fs-4">Xanh dương</p>
                                </div>
                                <p className="fw-medium fs-4"></p>
                            </div>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color"></div>
                                    <p className="ms-3 fw-medium fs-4">Cam</p>
                                </div>
                                <p className="fw-medium fs-4"></p>
                            </div>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color bg-black"></div>
                                    <p className="ms-3 fw-medium fs-4">Đen</p>
                                </div>
                                <p className="fw-medium fs-4"></p>
                            </div>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color bg-success"></div>
                                    <p className="ms-3 fw-medium fs-4 ">Xanh lá</p>
                                </div>
                                <p className="fw-medium fs-4"></p>
                            </div>
                            <div className="d-flex p-2 align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="rounded-3 filter-color bg-warning"></div>
                                    <p className="ms-3 fw-medium fs-4">Vàng</p>
                                </div>
                                <p className="fw-medium fs-4">(10)</p>
                            </div>
                        </Accordion>
                        <div className=" w-100 border-bottom mt-2"></div>
                        <Accordion
                            data={[
                                {
                                    title: 'Lọc theo kích cỡ',
                                },
                            ]}
                            isOpen={true}
                        >
                            <Accordion
                                data={[
                                    {
                                        title: 'S',
                                        isChecked: true,
                                    },
                                    {
                                        title: 'M',
                                        isChecked: true,
                                    },
                                    {
                                        title: 'L',
                                        isChecked: true,
                                    },
                                    {
                                        title: 'XL',
                                        isChecked: true,
                                    },
                                    {
                                        title: 'XXL',
                                        isChecked: true,
                                    },
                                    {
                                        title: 'XXXL',
                                        isChecked: true,
                                    },
                                ]}
                            />
                        </Accordion>
                    </div>
                    <div style={{ width: '80%' }} className="px-5 py-2">
                        <div className="d-flex align-items-center justify-content-end border-bottom pb-3">
                            <div className="d-flex align-items-center">
                                <p className="fw-medium me-4 fs-3">Sắp xếp theo</p>
                                <div className="select">
                                    <div className="selected" data-default="Mặc định" data-one="Giá cả tăng dần" data-two="Giá cả giảm dần" data-three="Phổ biến" data-four="Mới nhất">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                        </svg>
                                    </div>
                                    <div className="options">
                                        <div title="all">
                                            <input id="all" name="option" type="radio" defaultChecked value="" onChange={handleSortChange} />
                                            <label className="option" htmlFor="all" data-txt="Mặc định" />
                                        </div>
                                        <div title="option-1">
                                            <input id="option-1" name="option" type="radio" value="priceAsc" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-1" data-txt="Giá cả tăng dần" />
                                        </div>
                                        <div title="option-2">
                                            <input id="option-2" name="option" type="radio" value="priceDesc" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-2" data-txt="Giá cả giảm dần" />
                                        </div>
                                        <div title="option-3">
                                            <input id="option-3" name="option" type="radio" value="popular" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-3" data-txt="Phổ biến" />
                                        </div>
                                        <div title="option-4">
                                            <input id="option-4" name="option" type="radio" value="newest" onChange={handleSortChange} />
                                            <label className="option" htmlFor="option-4" data-txt="Mới nhất" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {status === 'loading' && (
                                <section className="dots-container mt-4">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </section>
                            )}
                            {currentProducts.map((product, index) => (
                                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 g-4">
                                    <ProductCard name={product.name} originalPrice={product.originalPrice} discount={product.discount} rating={product.rating} url={product.urlImage[0]} />
                                </div>
                            ))}
                            {currentProducts.length === 0 && (
                                <div className="d-flex justify-content-center align-items-center">
                                    <p className="fw-medium fs-3">Không tìm thấy sản phẩm nào</p>
                                </div>
                            )}
                        </div>
                        <div className="">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }}
                                    disabled={currentPage === 1}
                                >
                                    <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                                </Pagination.Prev>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => {
                                        window.scrollTo(0, 0)
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }}
                                    disabled={currentPage === totalPages}
                                >
                                    <FontAwesomeIcon icon={faCaretRight} size="lg" />
                                </Pagination.Next>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductList
