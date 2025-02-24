import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase.config'
import { collection, getDoc, doc, updateDoc, increment, Timestamp, setDoc } from 'firebase/firestore'
import { format } from 'date-fns'

import { fetchBanners } from '../../redux/slices/bannerSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { useScrollReveal } from '../../hook/useScrollReveal'
import ProductCard from '../../components/ProductCard'
import Chatbot from '../../components/Chatbot'
import Rating from '../../components/Rating'
import cay1 from '../../assets/image/category_image/men_wear_category.jpg'
import model1 from '../../assets/image/brand/person-1.png'
import truck from '../../assets/image/icons/tracking.png'
import refund from '../../assets/image/icons/cashback.png'
import headset from '../../assets/image/icons/headphone.png'
import promotion from '../../assets/image/icons/shopping-bag.png'
import quote from '../../assets/image/icons/quote.png'
import avatar from '../../assets/image/default/default-avatar.png'
import './Home.scss'
import axios from 'axios'
import { getPersonalizedRecommendations } from '../../services/RecommendationService'
import { getOrderUser } from '../../services/UserService'

function Home() {
    const navigate = useNavigate()
    const swiperCategory = useRef(null)
    const swiperReview = useRef(null)
    const dispatch = useDispatch()
    const { banners } = useSelector((state) => state.banner)
    const { user } = useSelector((state) => state.auth)
    const { categories } = useSelector((state) => state.category)
    const [bestSeller, setBestSeller] = useState([])
    const [recommendedProducts, setRecommendedProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])

    const handleExploreCategory = (categorySlug) => {
        navigate(`/products?category=${categorySlug}&page=1`)
    }

    useEffect(() => {
        const fetchAllProducts = async () => {
            const response = await axios.get('http://localhost:5000/product/all')
            setAllProducts(response.data)
        }
        fetchAllProducts()
    }, [])

    useEffect(() => {
        dispatch(fetchBanners())
        dispatch(fetchCategories())
        const fetchBestSeller = async () => {
            const response = await axios.get('http://localhost:5000/product/best-seller')
            setBestSeller(response.data)
        }
        fetchBestSeller()
    }, [dispatch])

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                let completedOrders = []
                if (user) {
                    // Lấy lịch sử đơn hàng nếu user đã đăng nhập
                    completedOrders = await getOrderUser('delivered')
                }

                const recommendations = await getPersonalizedRecommendations(user, allProducts, completedOrders)
                setRecommendedProducts(recommendations)
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm gợi ý:', error)
            }
        }

        if (allProducts.length > 0) {
            fetchRecommendedProducts()
        }
    }, [user, allProducts])

    const handleClickBanner = async (banner) => {
        navigate(banner?.linkUrl)
        const bannerRef = doc(db, 'bannersClicks', format(new Date(), 'yyyy-MM-dd').toString())
        const bannerDoc = await getDoc(bannerRef)
        if (!bannerDoc.exists()) {
            await setDoc(bannerRef, {
                totalClicks: 1,
                [banner?._id]: 1,
            })
        } else {
            const data = bannerDoc.data()
            if (!data[banner?._id]) {
                await updateDoc(bannerRef, {
                    totalClicks: increment(1),
                    [banner?._id]: 1,
                })
            } else {
                await updateDoc(bannerRef, {
                    totalClicks: increment(1),
                    [banner?._id]: increment(1),
                })
            }
        }
    }

    useScrollReveal()

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
                            <SwiperSlide key={banner?._id}>
                                <img className="banner-image" src={banner?.imageUrl} loading="lazy" />
                                <div></div>
                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                <button
                                    onClick={() => handleClickBanner(banner)}
                                    className="primary-btn py-3 px-5 rounded-5 banner-button"
                                >
                                    <p className="fs-1 fw-bold">
                                        {banner?.buttonText} <FontAwesomeIcon className="ms-3" icon={faArrowRight} />
                                    </p>
                                </button>
                                <h2 className="banner-title">{banner?.title}</h2>
                                <p className="banner-description">{banner?.description}</p>
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
                    <div className="content-category w-100 py-5 reveal">
                        <p className="shop-sm-title theme-color text-center">Danh Mục Sản phẩm</p>
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
                                {categories
                                    .filter((category) => !category.parentCategory)
                                    .map((category) => (
                                        <SwiperSlide key={category?._id}>
                                            <img
                                                className="rounded-5"
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                src={category?.urlImage || cay1}
                                                loading="lazy"
                                            />
                                            <div className="position-absolute category-item-content ">
                                                <p className="text-center home-category-title">{category?.name}</p>
                                                <button
                                                    className="primary-btn full-color px-4 py-2 rounded-4"
                                                    onClick={() => handleExploreCategory(category?.slug)}
                                                >
                                                    <p className="text-nowrap">Khám phá ngay</p>
                                                </button>
                                            </div>
                                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="content-recommendation py-5 reveal reveal-delay-1">
                        <p className="shop-sm-title text-center theme-color">
                            {user ? 'Dành riêng cho bạn' : 'Có thể bạn sẽ thích'}
                        </p>
                        <div className="row">
                            {recommendedProducts.map((product) => (
                                <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                                    <ProductCard
                                        onClick={() => navigate(`/products/${product.slug}`)}
                                        url={product.urlImage[0]}
                                        name={product.name}
                                        originalPrice={product.originalPrice}
                                        discount={product.discount}
                                        rating={product.rating}
                                        isFeature={product.isFeatured}
                                        productId={product._id}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="content-bestseller py-5 reveal reveal-delay-2">
                        <p className="shop-sm-title text-center theme-color">Bán Chạy Nhất</p>
                        <div className="row">
                            {bestSeller.map((product) => (
                                <div key={product?._id} className="col-12 col-sm-6 col-md-4 col-lg-3 g-5 ">
                                    <ProductCard
                                        onClick={() => navigate(`/products/${product?.slug}`)}
                                        url={product?.urlImage[0]}
                                        name={product?.name}
                                        originalPrice={product?.originalPrice}
                                        discount={product?.discount}
                                        rating={product?.rating}
                                        isFeature={product?.isFeatured}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="content-policy"></div> */}
                </div>
            </div>
            <div className="py-5 home-customer-review reveal reveal-delay-2">
                {[...Array(15)].map((_, index) => (
                    <div key={`bubble-${index}`} className={`bubble bubble-${index + 1}`} />
                ))}
                <p className="shop-sm-title text-center customer-review-title my-3">Đánh giá của khách hàng</p>
                <div className="container max-md px-5 " style={{ height: 330 }}>
                    <Swiper
                        ref={swiperReview}
                        style={{
                            '--swiper-pagination-color': 'var(--theme-color-2)',
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        spaceBetween={30}
                        slidesPerView={3}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {[...Array(6)].map((_, index) => (
                            <SwiperSlide key={index}>
                                <img src={''} loading="lazy" />
                                <div className="customer-review shadow rounded-5 d-flex flex-column">
                                    <img src={quote} alt="quote" className="customer-review-quote" />
                                    <p className="customer-review-text mt-4">
                                        Mình rất ấn tượng với trải nghiệm mua sắm tại website thời trang này. Giao diện
                                        được thiết kế hiện đại và tinh tế, giúp mình dễ dàng tìm kiếm và lựa chọn sản
                                        phẩm phù hợp. Mình chắc chắn sẽ quay lại đây để tiếp tục mua sắm trong tương
                                        lai!
                                    </p>
                                    <div className="d-flex align-items-center gap-3 justify-self-end mt-auto">
                                        <img
                                            src={avatar}
                                            alt=""
                                            className="rounded-circle"
                                            style={{ height: 50, width: 50 }}
                                        />
                                        <div className="d-flex flex-column">
                                            <p className="fw-bold fs-3 theme-color">Trần Trung Thông</p>
                                            <Rating initialRating={5} readonly gap={4} size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className="container max-md p-5">
                <div className="row w-100 pb-5 ">
                    <div className="col-12 col-sm-6 g-5 col-md-4 col-lg-3 reveal reveal-delay-1">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={truck} alt="truck" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Miễn phí vận chuyển</p>
                            <p className="home-policy-item-description text-center">
                                Miễn phí vận chuyển đối với những đơn hàng lớn hơn 500.000đ
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  reveal reveal-delay-2">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={refund} alt="refund" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Hoàn tiền 100%</p>
                            <p className="home-policy-item-description text-center">
                                Khách hàng có thể đổi/trả hàng trong vòng 7 ngày kể từ ngày nhận hàng
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  reveal reveal-delay-3">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={headset} alt="headset" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Hỗ trợ 24/7</p>
                            <p className="home-policy-item-description text-center">
                                Cung cấp dịch vụ tư vấn miễn phí về lựa chọn sản phẩm phù hợp với nhu cầu và phong cách
                                thời trang của khách hàng
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 g-5  reveal reveal-delay-3">
                        <div className="d-flex flex-column align-items-center shadow position-relative home-policy-item">
                            <div className="d-flex justify-content-center p-4 rounded-circle bg-white position-absolute home-policy-item-icon">
                                <img src={promotion} alt="promotion" className="m-auto" />
                            </div>
                            <p className="home-policy-item-title my-3">Khuyến mãi hấp dẫn</p>
                            <p className="home-policy-item-description text-center">
                                Khách hàng sẽ được hưởng nhiều ưu đãi khi mua sắm tại website
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
