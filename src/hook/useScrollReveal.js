import { useEffect } from 'react'

export const useScrollReveal = () => {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active')
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        )

        reveals.forEach((reveal) => observer.observe(reveal))

        return () => {
            reveals.forEach((reveal) => observer.unobserve(reveal))
        }
    }, [])
}
