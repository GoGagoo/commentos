import { RefObject, useEffect, useRef } from 'react'

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void
) {
	const mousedownTargetRef = useRef<EventTarget | null>(null)

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent | TouchEvent) => {
			mousedownTargetRef.current = e.target
		}

		const handleClick = (e: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(e.target as Node)) return
			if (ref.current.contains(mousedownTargetRef.current as Node)) return
			handler()
		}

		document.addEventListener('mousedown', handleMouseDown)
		document.addEventListener('mouseup', handleClick)

		return () => {
			document.removeEventListener('mousedown', handleMouseDown)
			document.removeEventListener('mouseup', handleClick)
		}
	}, [ref, handler])
}
