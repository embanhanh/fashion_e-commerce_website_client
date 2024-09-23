import './ProductDetail.scss'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { Rating } from 'react-simple-star-rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import product1 from '../../assets/image/product_image/product_image_1.png'
import product2 from '../../assets/image/product_image/product_image_2.png'
import product3 from '../../assets/image/product_image/product_image_3.png'
import product4 from '../../assets/image/product_image/product_image_2.png'
import product5 from '../../assets/image/product_image/product_image_1.png'
import ProductCard from '../../components/ProductCard'

function ProductDetail() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [mainSwiper, setMainSwiper] = useState(null) // Lưu trữ tham chiếu đến Swiper phía trên
    const [activeIndex, setActiveIndex] = useState(0) // Lưu chỉ số của ảnh đang được chọn

    // Danh sách ảnh sản phẩm
    const productImages = [product1, product2, product3, product4, product5]

    return (
        <>
            <div className="container h-100 p-5 ">
                <div className="d-flex">
                    <div style={{ width: '40%' }}>
                        {/* Swiper phía trên */}
                        <div>
                            <Swiper
                                loop={true}
                                spaceBetween={10}
                                navigation={false}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                                onSwiper={setMainSwiper} // Lưu tham chiếu của Swiper phía trên
                                allowTouchMove={false} // Disable swipe để không cho phép kéo chuột chuyển ảnh
                            >
                                {productImages.map((product, index) => (
                                    <SwiperSlide key={index}>
                                        <img style={{ objectFit: 'cover', width: '100%' }} src={product} alt={`Product ${index + 1}`} />
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className="mt-4"></div>

                        {/* Swiper phía dưới */}
                        <div>
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                }}
                                onSwiper={setThumbsSwiper}
                                loop={false}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                direction="horizontal" // Chiều ngang (từ trái sang phải)
                                className="mySwiper-sub"
                                navigation={true}
                            >
                                {productImages.map((product, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                cursor: 'pointer',
                                                border: activeIndex === index ? '2px solid black' : 'none',
                                            }}
                                            src={product}
                                            alt={`Product ${index + 1}`}
                                            onMouseEnter={() => {
                                                if (mainSwiper) {
                                                    mainSwiper.slideTo(index)
                                                    setActiveIndex(index)
                                                }
                                            }}
                                        />
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div style={{ width: '60%' }} className="px-5 py-1 ms-5">
                        <p className="fs-1 lh-1 fw-medium">Giày thể thao</p>
                        <div className="d-flex py-3">
                            <p className="fs-3 lh-1 fw-medium d-flex align-items-center">
                                5 <Rating initialValue={5} readonly={true} size={25} className="mx-3" /> (100 đánh giá)
                            </p>
                        </div>
                        <div className="d-flex align-items-center p-4 bg-body-tertiary">
                            <p className="fs-1 fw-medium me-4">150.000đ</p>
                            <p className="fs-2 fw-medium text-decoration-line-through text-body-tertiary">180.000đ</p>
                            <p className="fs-2 ms-4 fw-medium text-danger">Giảm 16% </p>
                        </div>
                        <p className="fs-3 lh-1 my-4 fw-medium">Màu Sắc</p>
                        <div className="row g-3 ms-5">
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center  ">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                            <div className="col-3 px-3">
                                <div className="product-color p-2 h-100 border d-flex align-items-center justify-content-center">
                                    <img src={product1} alt="" className="color-img-product" />
                                    <p className="fs-3 ms-3">trắng vàng</p>
                                </div>
                            </div>
                        </div>
                        <p className="fs-3 lh-1 my-4 fw-medium">Size</p>
                        <div className="d-flex ms-5">
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>S</p>
                            </div>
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>M</p>
                            </div>
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>L</p>
                            </div>
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>Xl</p>
                            </div>
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>XXL</p>
                            </div>
                            <div className="primary-btn light border border-black py-2 px-4 shadow-none  ms-3">
                                <p>XXXL</p>
                            </div>
                        </div>

                        <div className=" d-flex align-items-center mt-5">
                            <div className="d-flex align-items-center px-1 py-1 rounded-4 border border-black ">
                                <FontAwesomeIcon icon={faMinus} size="lg" className="p-4" />
                                <p className="fs-3 fw-medium lh-1 mx-2">1</p>
                                <FontAwesomeIcon icon={faPlus} size="lg" className="p-4" />
                            </div>
                            <button className="cartBtn rounded-4 d-flex align-items-center justify-content-center p-4 ms-4">
                                <svg style={{ height: 18 }} className="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                                </svg>
                                <p className="fs-4">Thêm vào giỏ hàng</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" className="product">
                                    <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path>
                                </svg>
                            </button>
                            <p className="fs-3 fw-medium ms-4">440 sản phẩm có sẵn</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 pe-5 me-5">
                    <p className="fs-2 fw-medium py-2 ">Mô tả sản phẩm</p>
                    <p className="fs-3">
                        ashasd asdasd asdas dasdasdsd fs fsdfsdf fsfs fsdfsd fsdfsd fsd f sdf sd fsd f sd f d fsd f sd fsd f sd f s fs df ds f sdf s fs d fsd f sd f sdf sd f sdf sd fs dfsd fsd f s fs
                        f sd ds sd fd sf sd fds f ds fsd f sd fs dfsd fs fs df d sdf s{' '}
                    </p>
                </div>
                <div className="mt-5">
                    <p className="fs-2 fw-medium py-2">Đánh giá của khách hàng</p>
                    <div className="pe-5 me-5 my-4 border-bottom py-4 ">
                        <div className="d-flex align-items-center justify-self-end mt-auto">
                            <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                            <div className="ms-3">
                                <p className="fw-medium  fs-3">Trần Trung Thông</p>
                                <Rating initialValue={5} readonly={true} size={20} className="" />
                            </div>
                        </div>
                        <p className="my-2 ps-5 ms-5 text-body-tertiary"> 2024-22-9 10:00</p>
                        <p className="fs-3 ps-5 ms-5">
                            Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm phù hợp.
                            Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                        </p>
                    </div>
                    <div className="pe-5 me-5 my-4 border-bottom py-4">
                        <div className="d-flex align-items-center justify-self-end mt-auto">
                            <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                            <div className="ms-3">
                                <p className="fw-medium  fs-3">Trần Trung Thông</p>
                                <Rating initialValue={5} readonly={true} size={20} className="" />
                            </div>
                        </div>
                        <p className="my-2 ps-5 ms-5 text-body-tertiary"> 2024-22-9 10:00</p>
                        <p className="fs-3 ps-5 ms-5">
                            Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm phù hợp.
                            Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                        </p>
                    </div>
                    <div className="pe-5 me-5 my-4 border-bottom py-4">
                        <div className="d-flex align-items-center justify-self-end mt-auto">
                            <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                            <div className="ms-3">
                                <p className="fw-medium  fs-3">Trần Trung Thông</p>
                                <Rating initialValue={5} readonly={true} size={20} className="" />
                            </div>
                        </div>
                        <p className="my-2 ps-5 ms-5 text-body-tertiary"> 2024-22-9 10:00</p>
                        <p className="fs-3 ps-5 ms-5">
                            Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm phù hợp.
                            Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                        </p>
                    </div>
                </div>

                <div className="mt-5 pt-5">
                    <p className="fs-2 fw-medium">Sản phẩm liên quan</p>
                    <div className="row mt-5 g-3">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2 ">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.2} rating={5} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail
