import React from 'react'
import * as s from './NotFound.module.scss'

export const NotFound = () => {
	return (
		<div className={s.not_found_container}>
			<div>Not found here...</div>
			<br />
			<p>Maybe, you will comment this section?</p>
		</div>
	)
}
