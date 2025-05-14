import { API_ROOT } from '@/entities/model/constants'
import axios from 'axios'

export const api = axios.create({
	baseURL: API_ROOT,
})

api.interceptors.request.use((config) => {
	const token = 'Bearer tOkEn123'
	config.headers.Authorization = token
	return config
})
