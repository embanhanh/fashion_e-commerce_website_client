import './Home.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import banner1 from '../../assets/image/banner/banner1.png'
import banner2 from '../../assets/image/banner/banner2.png'
import cay1 from '../../assets/image/category_image/men_wear_category.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCreditCard, faDollarSign, faHeadset, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import ProductCard from '../../components/ProductCard'
import { Rating } from 'react-simple-star-rating'
import { useRef } from 'react'

function Home() {
    const swiperCategory = useRef(null)
    const swiperReview = useRef(null)
    return (
        <>
            <div className="container h-100">
                <div className="slidesshow-container w-100">
                    <Swiper
                        style={{
                            '--swiper-pagination-color': '#fff',
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                    >
                        <SwiperSlide>
                            <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={banner1} loading="lazy" />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                            <div className="slideshow-content">
                                <div className="mb-3">
                                    <p className="slideshow-title">Phong Cách Cổ Điển</p>
                                    <p className="slideshow-description">Trở về với những thiết kế cổ điển tinh tế, mang đến vẻ đẹp không bao giờ lỗi mốt</p>
                                </div>
                                <div className="primary-btn btn-sm">
                                    <p>
                                        Khám phá ngay <FontAwesomeIcon icon={faArrowRight} />
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={banner2} loading="lazy" />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className=" container max-md p-5">
                    <div className="content-category w-100 py-5">
                        <div className="header-category d-flex justify-content-between align-items-center">
                            <p className="shop-sm-title">Danh Mục</p>
                            <div className="d-flex">
                                <div className="primary-btn btn-ssm" onClick={() => swiperCategory.current.swiper.slidePrev()}>
                                    <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                                </div>
                                <div className="primary-btn btn-ssm ms-3" onClick={() => swiperCategory.current.swiper.slideNext()}>
                                    <FontAwesomeIcon icon={faArrowRight} size="xl" />
                                </div>
                            </div>
                        </div>
                        <div className="list-category mt-5">
                            <Swiper
                                ref={swiperCategory}
                                style={{
                                    '--swiper-pagination-color': '#fff',
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                spaceBetween={40}
                                slidesPerView={4}
                                navigation={true}
                                modules={[Autoplay, Pagination, Navigation]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                    <div className="primary-btn btn-sm btn-category mb-3 light">
                                        <p>Mặc giản dị</p>
                                    </div>
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={cay1} loading="lazy" />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                    <div className="content-bestseller py-5">
                        <p className="shop-sm-title text-center">Bán Chạy Nhất</p>
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5 ">
                                <ProductCard name={'Giày thể thao hhhhhhhhhh jasdasd jasdasda'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                <ProductCard name={'Giày thể thao'} originalPrice={150000} discount={0.15} rating={5} />
                            </div>
                        </div>
                    </div>

                    <div className="content-policy"></div>
                </div>
            </div>
            <div className="pb-5" style={{ backgroundColor: '#fafafb' }}>
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
                <div className="container max-md px-5" style={{ height: 250 }}>
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
                        navigation={true}
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
                <div className="row w-100 pb-5">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <FontAwesomeIcon icon={faTruckFast} size="3x" color="#000" />
                        <p className="shop-sm-title my-3">Miễn phí vận chuyển</p>
                        <p className="">Miễn phí vận chuyển đối với những đơn hàng lớn hơn 500.000đ</p>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <FontAwesomeIcon icon={faDollarSign} size="3x" color="#000" />
                        <p className="shop-sm-title my-3">Hoàn tiền 100%</p>
                        <p className="">Khách hàng có thể đổi/trả hàng trong vòng 7 ngày kể từ ngày nhận hàng</p>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <FontAwesomeIcon icon={faHeadset} size="3x" color="#000" />
                        <p className="shop-sm-title my-3">Hỗ trợ 24/7</p>
                        <p className="">Cung cấp dịch vụ tư vấn miễn phí về lựa chọn sản phẩm phù hợp với nhu cầu và phong cách thời trang của khách hàng</p>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  ">
                        <FontAwesomeIcon icon={faCreditCard} size="3x" color="#000" />
                        <p className="shop-sm-title my-3">Thanh toán linh hoạt</p>
                        <p className="">Hỗ trợ thanh toán bằng nhiều hình thức khác nhau</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
