import React, { useEffect, useRef, useState, useCallback } from 'react'
import tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

const TomTomMap = ({ initialLocation, onLocationChange }) => {
    const mapElement = useRef()
    const mapInstance = useRef(null)
    const [searchBox, setSearchBox] = useState(null)
    const markerRef = useRef(null)

    const handleResultSelection = useCallback((event) => {
        if (mapInstance.current && event?.data?.result?.position) {
            let { lat, lon } = event.data.result.position

            // Kiểm tra xem lon có tồn tại không, nếu không thì thử lấy lng
            if (lon === undefined && event.data.result.position.lng !== undefined) {
                lon = event.data.result.position.lng
            }

            // Kiểm tra tính hợp lệ của lat và lon
            if (typeof lat === 'number' && !isNaN(lat) && typeof lon === 'number' && !isNaN(lon)) {
                console.log('Di chuyển bản đồ đến:', lon, lat)
                markerRef.current.setLngLat([lon, lat])

                mapInstance.current.flyTo({
                    center: [lon, lat],
                    zoom: 14,
                })
                onLocationChange({ lng: lon, lat: lat })
            } else {
                console.error('Tọa độ không hợp lệ:', lat, lon)
            }
        } else {
            console.log('Bản đồ chưa sẵn sàng hoặc không tìm thấy thông tin vị trí trong kết quả')
        }
    }, [])

    useEffect(() => {
        const initializeMap = () => {
            const apiKey = import.meta.env.VITE_API_KEY_TOMTOM_MAP

            mapInstance.current = tt.map({
                key: apiKey,
                container: mapElement.current,
                center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [106.660172, 10.762622],
                zoom: 13,
                touchZoomRotate: true,
                dragPan: true,
            })

            markerRef.current = new tt.Marker({ draggable: true }).setLngLat([initialLocation.lng, initialLocation.lat]).addTo(mapInstance.current)

            markerRef.current.on('dragend', () => {
                const lngLat = markerRef.current.getLngLat()
                console.log('Tọa độ mới:', lngLat.lng, lngLat.lat)
                onLocationChange(lngLat)
            })

            const ttSearchBox = new SearchBox(ttapi.services, {
                idleTimePress: 100,
                minNumberOfCharacters: 0,
                searchOptions: {
                    key: apiKey,
                    language: 'vi-VN',
                },
                autocompleteOptions: {
                    key: apiKey,
                    language: 'vi-VN',
                },
                noResultsMessage: 'Không tìm thấy kết quả.',
                placeholder: 'Tìm kiếm địa điểm...',
                cssStyleCheck: `
                    .tt-search-box {
                        width: 500px;
                    }
                    .tt-search-box-input-container {
                        border-radius: 4px;
                    }
                    .tt-search-box-input {
                        padding: 10px 15px;
                        font-size: 16px;
                    }
                    .tt-search-box-result-list {
                        max-height: 300px;
                        overflow-y: auto;
                    }
                `,
            })

            ttSearchBox.on('tomtom.searchbox.resultsfound', handleResultsFound)
            ttSearchBox.on('tomtom.searchbox.resultselected', handleResultSelection)
            ttSearchBox.on('tomtom.searchbox.resultfocused', handleResultSelection)

            mapInstance.current.addControl(ttSearchBox, 'top-left')
            mapInstance.current.addControl(new tt.FullscreenControl())
            mapInstance.current.addControl(new tt.NavigationControl())

            setSearchBox(ttSearchBox)
        }

        initializeMap()

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove()
            }
        }
    }, [handleResultSelection])

    const handleResultsFound = useCallback((event) => {
        console.log('Kết quả tìm kiếm:', event)
    }, [])

    return (
        <div>
            <div ref={mapElement} style={{ height: '400px', width: '100%' }} />
        </div>
    )
}

export default TomTomMap
