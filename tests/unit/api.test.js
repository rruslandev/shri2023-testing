require('dotenv').config()
const axios = require('axios')

const { BUG_ID = '0', URL } = process.env

const urlProducts = `${URL}api/products?bug_id=${BUG_ID}`
const urlItem = `${URL}api/products/7?bug_id=${BUG_ID}`
const postUrl = `${URL}api/checkout?bug_id=${BUG_ID}`

describe('Тестовые GET запросы', () => {
	it('У товара есть все поля и они имеют верные типы @bug-id=1', async () => {
		const response = await axios.get(urlProducts)

		expect(response.data[9]).toMatchObject({
			id: expect.any(Number),
			name: expect.any(String),
			price: expect.any(Number),
		})
	})

	it('Приходят верные данные по конкретному товару @bug-id=3', async () => {
		const response = await axios.get(urlItem)
		expect(response.data.id).toBe(7)
	})
})

describe('Тестовые POST запросы', () => {
	it('Отправляем POST запрос на ручку api/orders/ и получаем верный айди покупки товара @bug-id=2', async () => {
		expect.assertions(1)
		const data = {
			form: { name: '33/33', phone: '+333333333333', address: '33/33' },
			cart: {
				0: {
					name: 'Practical Chair',
					count: 1,
					price: 388,
				},
			},
		}

		try {
			const response = await axios.post(postUrl, data)
			const id = response.data.id

			const orders = await axios.get(`${URL}api/orders/`)
			const ordersInfo = orders.data
			expect(id).toBe(ordersInfo.length)
		} catch (error) {
			expect(error).toMatch('error')
		}
	})
})
