import { useSelector, useDispatch } from 'react-redux';
import { fetchFavoriteProducts } from '../../redux/slices/userSlice';
import ProductCard from '../../components/ProductCard';
import { useEffect } from 'react';
function Wishlist() {
    const dispatch = useDispatch();
    const favoriteProducts = useSelector((state) => state.user.favoriteProducts);
    useEffect(() => {
        dispatch(fetchFavoriteProducts())
    }, [dispatch])
    return (
        <div>
            {console.log(favoriteProducts)}
            {
                favoriteProducts.map((product) => (
                    // <ProductCard key={product._id} name={product.product.name} url={product.product.imageUrl} />
                    <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 g-5 ">
                        <ProductCard
                            url={product.imageUrl}
                            name={product.product.name}
                            originalPrice={product.product.originalPrice}
                            discount={product.product.discount}
                            rating={product.product.rating}
                        />
                    </div>
                ))
            }
        </div>
    );
}

export default Wishlist;