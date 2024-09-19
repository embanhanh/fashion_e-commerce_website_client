import logoShopDark from '../assets/image/logo/logo_shop_dark.png'
import logoShopLight from '../assets/image/logo/logo_shop_light.png'
import { Link } from 'react-router-dom'

function LogoShop({ type }) {
    return (
        <>
            <Link to={'/'} className="d-flex h-100 align-items-center">
                {type == 'dark' ? <img src={logoShopDark} alt="Logo Shop" className="h-100" /> : <img src={logoShopLight} alt="Logo Shop" className="h-100" />}
            </Link>
        </>
    )
}

export default LogoShop
