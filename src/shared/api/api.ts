import { API_ROOT } from '@/entities/model/constants'
import axios from 'axios'

export const api = axios.create({
	baseURL: API_ROOT,
})
