import './Orders.scss'
import OrderCart from '../../components/OrderCard';
import moana_dress from '../../assets/image/product_image/moana_dress.png'
import handbag from '../../assets/image/product_image/handbag.png'
import cotton_shirt from '../../assets/image/product_image/cotton_shirt.png'


function Orders() {

    const orders = [
        {
            name: 'Váy in hình Moana cho bé gái màu hồng',
            size: 'S',
            quantity: 1,
            price: 1920000,
            status: 'delivered',
            statusMessage: 'Sản phẩm của bạn đã được giao',
            image: moana_dress, // Assuming you have a local image or a URL
        },
        {
            name: 'Túi xách tay họa tiết cho phụ nữ',
            size: 'Regular',
            quantity: 1,
            price: 1920000,
            status: 'processing',
            statusMessage: 'Sản phẩm của bạn đang trong quá trình xử lý.',
            image: handbag,
        },
        {
            name: 'Áo sơ mi cotton casual thiết kế riêng',
            size: 'M',
            quantity: 1,
            price: 960000,
            status: 'processing',
            statusMessage: 'Sản phẩm của bạn đang trong quá trình xử lý.',
            image: cotton_shirt,
        },
    ];


    return (
        <div className="container">
            <div className="tab">
                <section class="QmO3Bu" aria-role="tablist">
                    <h2 class="a11y-hidden"></h2>
                    
                    <a class="KI5har mRVNLm" title="Tất cả" aria-role="tab" aria-selected="true" aria-controls="olp_panel_id-0.5815250178275442" id="olp_tab_id-0.5815250178275442" href="/user/purchase?type=6">
                        <span class="NoH9rC">Tất cả</span>
                    </a>
                    <a class="KI5har" title="Đang được xử lý" aria-role="tab" aria-selected="false" aria-controls="olp_panel_id-0.46210181232762326" id="olp_tab_id-0.46210181232762326" href="/user/purchase?type=9">
                        <span class="NoH9rC">Đang được xử lý</span>
                    </a>
                    <a class="KI5har" title="Đang được vận chuyển" aria-role="tab" aria-selected="false" aria-controls="olp_panel_id-0.7915222832013613" id="olp_tab_id-0.7915222832013613" href="/user/purchase?type=7">
                        <span class="NoH9rC">Đang được vận chuyển</span>
                    </a>
                    <a class="KI5har" title="Đã giao hàng" aria-role="tab" aria-selected="false" aria-controls="olp_panel_id-0.5881489713170371" id="olp_tab_id-0.5881489713170371" href="/user/purchase?type=8">                    
                        <span class="NoH9rC">Đã giao hàng</span>
                    </a>
                </section>
            </div>  

            <div className="order-list">
            {orders.map((order, index) => (
                <OrderCart key={index} product={order} />
            ))}
            </div>


        </div>
    );
}

export default Orders;