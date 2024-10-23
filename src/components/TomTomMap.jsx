import React, { useEffect, useRef, useState, useCallback } from 'react'
import tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css'

const TomTomMap = () => {
    const mapElement = useRef()
    const mapInstance = useRef(null)
    const [searchBox, setSearchBox] = useState(null)
    const markerRef = useRef(null)

    const handleResultSelection = useCallback((event) => {
        console.log('Kết quả được chọn:', event)
        if (mapInstance.current && event && event.data && event.data.result && event.data.result.position) {
            let { lat, lon } = event.data.result.position

            // Kiểm tra xem lon có tồn tại không, nếu không thì thử lấy lng
            if (lon === undefined && event.data.result.position.lng !== undefined) {
                lon = event.data.result.position.lng
            }

            console.log('Vị trí trước khi kiểm tra:', lat, lon)

            // Kiểm tra tính hợp lệ của lat và lon
            if (typeof lat === 'number' && !isNaN(lat) && typeof lon === 'number' && !isNaN(lon)) {
                console.log('Di chuyển bản đồ đến:', lon, lat)
                mapInstance.current.flyTo({
                    center: [lon, lat],
                    zoom: 15,
                })

                // Xóa marker cũ nếu có
                if (markerRef.current) {
                    markerRef.current.remove()
                }

                // Tạo marker mới
                const newMarker = new tt.Marker().setLngLat([lon, lat]).addTo(mapInstance.current)
                markerRef.current = newMarker

                // Tạo popup với thông tin địa điểm
                const popupContent = `
                    <strong>${event.data.result.address.freeformAddress}</strong><br>
                    ${event.data.result.type}
                `
                const popup = new tt.Popup({ offset: 30 }).setHTML(popupContent)
                newMarker.setPopup(popup)

                // Hiển thị popup
                popup.addTo(mapInstance.current)
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
                center: [106.660172, 10.762622], // Tọa độ của TP.HCM
                zoom: 13,
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
                cssStyleRules: `
                    .tt-search-box {
                        width: 400px;
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
