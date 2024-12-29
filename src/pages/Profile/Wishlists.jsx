import { useSelector, useDispatch } from 'react-redux'
import { fetchFavoriteProducts } from '../../redux/slices/userSlice'
import FavoriteCard from '../../components/FavoriteCard'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function Wishlist() {
    const dispatch = useDispatch()
    const favoriteProducts = useSelector((state) => state.user.favoriteProducts)

    useEffect(() => {
        dispatch(fetchFavoriteProducts())
    }, [])

    useEffect(() => {
        console.log(favoriteProducts)
    }, [])

    return (
        <div className="container">
            <div className="row">
                {favoriteProducts.map((product, index) => (
                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 g-5">
                        <FavoriteCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist
