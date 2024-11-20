import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCreditCard, faDollarSign, faHeadset, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { Rating } from 'react-simple-star-rating'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBanners } from '../../redux/slices/bannerSlice'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Chatbot from '../../components/Chatbot'
import cay1 from '../../assets/image/category_image/men_wear_category.jpg'
import model1 from '../../assets/image/brand/person-1.png'
import truck from '../../assets/image/icons/tracking.png'
import refund from '../../assets/image/icons/cashback.png'
import headset from '../../assets/image/icons/headphone.png'
import promotion from '../../assets/image/icons/shopping-bag.png'

import './Home.scss'

function Home() {
    const navigate = useNavigate()
    const swiperCategory = useRef(null)
    const swiperReview = useRef(null)
    const dispatch = useDispatch()
    const { banners } = useSelector((state) => state.banner)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(fetchBanners())
    }, [dispatch])

    return (
        <>
            {user?.role !== 'admin' && <Chatbot />}
            <div className="slideshow-background w-100">
                <div className="slideshow-container container">
                    <Swiper
                        style={{
                            '--swiper-pagination-color': 'var(--theme-color-1)',
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner._id}>
                                <img className="banner-image" src={model1} loading="lazy" />
                                <div></div>
                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                <button onClick={() => {}} className="primary-btn py-3 px-5 rounded-5 banner-button">
                                    <p className="fs-1 fw-bold">
                                        Khám phá ngay <FontAwesomeIcon className="ms-3" icon={faArrowRight} />
                                    </p>
                                </button>
                                <h2 className="banner-title">Phong cách độc đáo - giá cực tốt</h2>
                                <p className="banner-description">
                                    Thời trang phong cách với mức giá không thể bỏ lỡ. Mua sắm ngay hôm nay! asd asd á d á d asd á d á da sd á d a dsa d á dá d asd á d á d asdas á dá á sa á dá dá á da
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="slideshow-img-content">
                        <div className="water-drops">
                            {[...Array(20)].map((_, index) => (
                                <div key={`sparkle-${index}`} className={`sparkle sparkle-${index + 1}`} />
                            ))}

                            <div className="ripple" />
                            <div className="ripple" />
                            <div className="ripple" />
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`drop-${index + 1}`}
                                    style={{
                                        animationDelay: `${index * 0.5}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container h-100">
                <div className=" container max-md p-5">
                    <div className="content-category w-100 py-5">
                        <div className="header-category d-flex justify-content-between align-items-center">
                            <p className="shop-sm-title theme-color">Danh Mục Sản phẩm</p>
                            <div className="d-flex gap-3">
                                <div className="primary-btn px-3 rounded-4" onClick={() => swiperCategory.current.swiper.slidePrev()}>
                                    <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                                </div>
                                <div className="primary-btn px-3 rounded-4" onClick={() => swiperCategory.current.swiper.slideNext()}>
                                    <FontAwesomeIcon icon={faArrowRight} size="xl" />
                                </div>
                            </div>
                        </div>
                        <div className="list-category mt-5">
                            <Swiper
                                ref={swiperCategory}
                                style={{
                                    '--swiper-pagination-color': 'var(--theme-color-1)',
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                spaceBetween={15}
                                slidesPerView={5}
                                modules={[Autoplay, Pagination, Navigation]}
                                className="mySwiper"
                            >
                                {[...Array(8)].map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <img className="rounded-4" style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                        <div className="position-absolute category-item-content ">
                                            <p className="text-nowrap home-category-title">Thời trang nam</p>
                                            <button className="primary-btn full-color px-4 py-2 rounded-4">
                                                <p className="text-nowrap">Khám phá ngay</p>
                                            </button>
                                        </div>
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="content-bestseller py-5">
                        <p className="shop-sm-title text-center theme-color">Bán Chạy Nhất</p>
                        <div className="row">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 g-5 ">
                                    <ProductCard
                                        url={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNeJa_l26MBy8VuAnFG5ff2SIBCpEP5RdIVA&s'}
                                        name={'Giày thể thao hhhhhhhhhh jasdasd jasdasda'}
                                        originalPrice={150000}
                                        discount={15}
                                        rating={5}
                                        isFeature={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-policy"></div>
                </div>
            </div>
            <div className="pb-5 " style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                <div className="d-flex max-md container justify-content-between align-items-center p-5">
                    <p className="shop-sm-title ps-4" style={{ fontWeight: '500' }}>
                        Đánh giá của khách hàng
                    </p>
                    <div className="d-flex pe-4">
                        <div className="primary-btn btn-ssm" onClick={() => swiperReview.current.swiper.slidePrev()}>
                            <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                        </div>
                        <div className="primary-btn btn-ssm ms-3" onClick={() => swiperReview.current.swiper.slideNext()}>
                            <FontAwesomeIcon icon={faArrowRight} size="xl" />
                        </div>
                    </div>
                </div>
                <div className="container max-md px-5 " style={{ height: 250 }}>
                    <Swiper
                        ref={swiperReview}
                        style={{
                            '--swiper-pagination-color': '#fff',
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        spaceBetween={30}
                        slidesPerView={3}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <img src={''} loading="lazy" />
                            <div className="customer-review bg-white rounded-4 shadow py-4 px-4 d-flex flex-column">
                                <Rating initialValue={5} readonly={true} size={25} />
                                <p className="customer-review-text mt-4">
                                    Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm
                                    phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                                </p>
                                <div className="d-flex align-items-center justify-self-end mt-auto">
                                    <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                                    <p className="fw-medium ms-4 fs-4">Trần Trung Thông</p>
                                </div>
                            </div>
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={''} loading="lazy" />
                            <div className="customer-review bg-white rounded-4 shadow py-4 px-4 d-flex flex-column">
                                <Rating initialValue={5} readonly={true} size={25} />
                                <p className="customer-review-text mt-4">
                                    Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm
                                    phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                                </p>
                                <div className="d-flex align-items-center justify-self-end mt-auto">
                                    <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                                    <p className="fw-medium ms-4 fs-4">Trần Trung Thông</p>
                                </div>
                            </div>
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={''} loading="lazy" />
                            <div className="customer-review bg-white rounded-4 shadow py-4 px-4 d-flex flex-column">
                                <Rating initialValue={5} readonly={true} size={25} />
                                <p className="customer-review-text mt-4">
                                    Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm
                                    phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                                </p>
                                <div className="d-flex align-items-center justify-self-end mt-auto">
                                    <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                                    <p className="fw-medium ms-4 fs-4">Trần Trung Thông</p>
                                </div>
                            </div>
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={''} loading="lazy" />
                            <div className="customer-review bg-white rounded-4 shadow py-4 px-4 d-flex flex-column">
                                <Rating initialValue={5} readonly={true} size={25} />
                                <p className="customer-review-text mt-4">
                                    Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm
                                    phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                                </p>
                                <div className="d-flex align-items-center justify-self-end mt-auto">
                                    <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                                    <p className="fw-medium ms-4 fs-4">Trần Trung Thông</p>
                                </div>
                            </div>
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={''} loading="lazy" />
                            <div className="customer-review bg-white rounded-4 shadow py-4 px-4 d-flex flex-column">
                                <Rating initialValue={5} readonly={true} size={25} />
                                <p className="customer-review-text mt-4">
                                    Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản phẩm
                                    phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương lai!
                                </p>
                                <div className="d-flex align-items-center justify-self-end mt-auto">
                                    <img src="" alt="" className="rounded-circle" style={{ height: 50, width: 50 }} />
                                    <p className="fw-medium ms-4 fs-4">Trần Trung Thông</p>
                                </div>
                            </div>
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <div className="container max-md p-5">
                <div className="row w-100 pb-5 ">
                    <div className="col-12 col-sm-6 g-5 col-md-4 col-lg-3 ">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={truck} alt="truck" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Miễn phí vận chuyển</p>
                            <p className="home-policy-item-description text-center">Miễn phí vận chuyển đối với những đơn hàng lớn hơn 500.000đ</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={refund} alt="refund" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Hoàn tiền 100%</p>
                            <p className="home-policy-item-description text-center">Khách hàng có thể đổi/trả hàng trong vòng 7 ngày kể từ ngày nhận hàng</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={headset} alt="headset" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Hỗ trợ 24/7</p>
                            <p className="home-policy-item-description text-center">
                                Cung cấp dịch vụ tư vấn miễn phí về lựa chọn sản phẩm phù hợp với nhu cầu và phong cách thời trang của khách hàng
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={promotion} alt="promotion" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Khuyến mãi hấp dẫn</p>
                            <p className="home-policy-item-description text-center">Khách hàng sẽ được hưởng nhiều ưu đãi khi mua sắm tại website</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
