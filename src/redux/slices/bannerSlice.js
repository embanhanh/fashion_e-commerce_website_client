import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBanner, getAllBanners, editBanner, removeBanner, getBannerById, removeManyBanners } from '../../services/BannerService'

export const createBannerAction = createAsyncThunk('banner/createBanner', async (bannerData, { rejectWithValue }) => {
    try {
        const response = await createBanner(bannerData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchBannerById = createAsyncThunk('banner/fetchBannerById', async (bannerId, { rejectWithValue }) => {
    try {
        const response = await getBannerById(bannerId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchBanners = createAsyncThunk('banner/fetchBanners', async (params, { rejectWithValue }) => {
    try {
        const response = await getAllBanners(params)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateBanner = createAsyncThunk('banner/updateBanner', async ({ bannerId, bannerData }, { rejectWithValue }) => {
    try {
        const response = await editBanner(bannerId, bannerData)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteBanner = createAsyncThunk('banner/deleteBanner', async (bannerId, { rejectWithValue }) => {
    try {
        const response = await removeBanner(bannerId)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteManyBanners = createAsyncThunk('banner/deleteManyBanners', async (bannerIds, { rejectWithValue }) => {
    try {
        const response = await removeManyBanners(bannerIds)
        return response
    } catch (error) {
        return rejectWithValue(error)
    }
})

const bannerSlice = createSlice({
    name: 'banner',
    initialState: {
        banners: [],
        filters: {
            search: '',
            startDate: null,
            endDate: null,
        },
        currentBanner: null,
        loading: false,
        error: null,
        success: false,
        status: 'idle',
    },
    reducers: {
        resetBannerState: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            console.log(state.filters)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBannerAction.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(createBannerAction.fulfilled, (state, action) => {
                state.loading = false
                state.banners.push(action.payload)
                state.success = true
            })
            .addCase(createBannerAction.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.success = false
            })
            .addCase(fetchBanners.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.banners = action.payload.banners
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(updateBanner.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false
                const index = state.banners.findIndex((banner) => banner._id === action.payload._id)
                if (index !== -1) {
                    state.banners[index] = action.payload
                }
                state.success = true
                state.currentBanner = action.payload
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.success = false
            })
            .addCase(deleteBanner.pending, (state) => {
                state.error = null
                state.success = false
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter((banner) => banner._id !== action.payload._id)
                state.success = true
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.error = action.payload
                state.success = false
            })
            .addCase(fetchBannerById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchBannerById.fulfilled, (state, action) => {
                state.loading = false
                state.currentBanner = action.payload
                console.log(state.currentBanner)
            })
            .addCase(fetchBannerById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteManyBanners.pending, (state) => {
                state.error = null
                state.success = false
            })
            .addCase(deleteManyBanners.fulfilled, (state, action) => {
                state.banners = state.banners.filter((banner) => !action.payload.includes(banner._id))
                state.success = true
            })
            .addCase(deleteManyBanners.rejected, (state, action) => {
                state.error = action.payload
                state.success = false
            })
    },
})

export const { resetBannerState, setFilters } = bannerSlice.actions

export default bannerSlice.reducer
