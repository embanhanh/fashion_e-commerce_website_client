import { useMemo, useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { vi } from 'date-fns/locale'
import { useDispatch } from 'react-redux'
import { getAdminOrdersAction } from '../redux/slices/orderSilce'
import { sameDay, calculateDateDate } from '../utils/DateUtils'

import '../pages/admin/Statistic.scss'

ChartJS.register(ArcElement, Tooltip, Legend)
function StatisticProduct({ dateRange, selectedDate }) {
    const dateData = useMemo(() => calculateDateDate(dateRange, selectedDate), [dateRange, selectedDate])
    const dispatch = useDispatch()
    const [orders, setOrders] = useState([])
    const [data, setData] = useState({})
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await dispatch(getAdminOrdersAction({ dateData }))
            setOrders(response.payload)
        }
        fetchOrders()
    }, [dateData])

    useEffect(() => {
        const topProductData = orders.reduce((acc, item) => {
            if (item.createdAt < dateData.now.start) return acc
            item.products.forEach((product) => {
                if (!acc.find((item) => item._id === product.product.product._id)) {
                    acc.push({
                        _id: product.product.product._id,
                        name: product.product.product.name,
                        urlImage: product.product.product.urlImage[0],
                        soldQuantity: product.quantity,
                        revenue: product.product.price * product.quantity,
                    })
                } else {
                    const index = acc.findIndex((item) => item._id === product.product.product._id)
                    acc[index].soldQuantity += product.quantity
                    acc[index].revenue += product.product.price * product.quantity
                }
            })
            return acc
        }, [])
        const categoryData = orders.reduce((acc, item) => {
            if (item.createdAt < dateData.now.start) return acc
            item.products.forEach((product) => {
                product.product.product.categories.forEach((category) => {
                    if (!acc.find((item) => item._id === category.parentCategory._id)) {
                        acc.push({
                            _id: category.parentCategory._id,
                            name: category.parentCategory.name,
                            revenue: product.product.price * product.quantity,
                        })
                    } else {
                        const index = acc.findIndex((item) => item._id === category.parentCategory._id)
                        acc[index].revenue += product.product.price * product.quantity
                    }
                })
            })
            return acc
        }, [])
        setData({
            topProductData,
            categoryData,
        })
    }, [orders, dateData])

    const chartData = useMemo(() => {
        return {
            labels:
                data.categoryData?.length > 4
                    ? data.categoryData
                          ?.sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 4)
                          .map((item) => item.name)
                    : data.categoryData?.map((item) => item.name),
            datasets: [
                {
                    data:
                        data.categoryData?.length > 4
                            ? [
                                  ...data.categoryData
                                      ?.sort((a, b) => b.revenue - a.revenue)
                                      .slice(0, 4)
                                      .map((item) => item.revenue),
                                  data.categoryData?.slice(4).reduce((sum, item) => sum + item.revenue, 0),
                              ]
                            : data.categoryData?.map((item) => item.revenue),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1,
                    hoverOffset: 10,
                },
            ],
        }
    }, [data.categoryData])
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 14,
                    },
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets
                        const labels = chart.data.labels
                        const total = datasets[0].data.reduce((acc, data) => acc + data, 0)

                        return labels.map((label, index) => ({
                            text: `${label} (${Math.round((datasets[0].data[index] * 100) / total)}%)`,
                            fillStyle: datasets[0].backgroundColor[index],
                            strokeStyle: datasets[0].borderColor[index],
                            lineWidth: 1,
                            hidden: false,
                            index: index,
                        }))
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((acc, data) => acc + data, 0)
                        const percentage = Math.round((value * 100) / total)
                        return `${label}: ${percentage}% (${value.toLocaleString('vi-VN')}đ)`
                    },
                },
            },
        },
        cutout: '60%',
    }

    return (
        <>
            <div className="p-3 bg-white rounded-3 shadow-sm">
                <h3 className="fs-3 fw-semibold mb-3">Top sản phẩm bán chạy</h3>
                <table className="page-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Sản phẩm</th>
                            <th>Đã bán</th>
                            <th>Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.topProductData?.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <img src={item.urlImage} alt={item.name} width={50} height={50} />
                                        <p className="mb-0 product-name">{item.name}</p>
                                    </div>
                                </td>
                                <td>{item.soldQuantity}</td>
                                <td>{item.revenue.toLocaleString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 bg-white rounded-3 shadow-sm">
                <h3 className="fs-3 fw-semibold mb-3">Doanh số theo danh mục</h3>
                <div className="d-flex gap-3">
                    <div style={{ minWidth: '400px', height: '350px' }} className="p-3">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>

                    <table className="page-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Danh mục</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.categoryData?.length > 4
                                ? data.categoryData
                                      ?.sort((a, b) => b.revenue - a.revenue)
                                      .slice(0, 4)
                                      .map((item, index) => (
                                          <tr key={item._id}>
                                              <td>{index + 1}</td>
                                              <td>{item.name}</td>
                                              <td>{item.revenue.toLocaleString('vi-VN') + ' VND'}</td>
                                          </tr>
                                      ))
                                : data.categoryData?.map((item, index) => (
                                      <tr key={item._id}>
                                          <td>{index + 1}</td>
                                          <td>{item.name}</td>
                                          <td>{item.revenue.toLocaleString('vi-VN') + ' VND'}</td>
                                      </tr>
                                  ))}
                            {data.categoryData?.length > 4 && (
                                <tr>
                                    <td>...</td>
                                    <td>Khác</td>
                                    <td>
                                        {data.categoryData
                                            ?.slice(4)
                                            .reduce((sum, item) => sum + item.revenue, 0)
                                            .toLocaleString('vi-VN') + ' VND'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default StatisticProduct
