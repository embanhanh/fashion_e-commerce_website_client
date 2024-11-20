import * as tt from '@tomtom-international/web-sdk-services'

export const calculateRouteDistance = async (start, end) => {
    const apiKey = import.meta.env.VITE_API_KEY_TOMTOM_MAP
    console.log(start)

    try {
        const routeResponse = await tt.services.calculateRoute({
            key: apiKey,
            locations: `${start.lng},${start.lat}:${end.lng},${end.lat}`,
            routeType: 'fastest',
            travelMode: 'car',
            traffic: true,
            avoid: 'unpavedRoads',
            vehicleCommercial: false,
        })

        if (routeResponse.routes && routeResponse.routes.length > 0) {
            const route = routeResponse.routes[0]
            const result = {
                distance: route.summary.lengthInMeters / 1000,
                duration: Math.ceil(route.summary.travelTimeInSeconds / (3600 * 24) + 3),
                trafficDelayInSeconds: route.summary.trafficDelayInSeconds,
            }
            return result
        }
    } catch (error) {
        console.error('Lỗi khi tính toán khoảng cách:', error)
    }

    return null
}
