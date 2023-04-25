import { type Config } from 'tailwindcss'

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                shimmer: {
                    '100%': {
                        transform: 'translateX(100%)',
                    },
                },
            },
            animation: {
                infinite_shimmer: 'shimmer 1s infinite',
            },
        },
        maxWidth: {
            base: '1024px',
        },
    },
    plugins: [require('@tailwindcss/typography')],
} satisfies Config
