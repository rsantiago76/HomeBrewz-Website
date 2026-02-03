/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                coffee: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#a77f72',
                    600: '#8a5a4d',
                    700: '#6f453b',
                    800: '#57332b',
                    900: '#432520',
                },
                'brand-green': '#1B4D3E',
            }
        },
    },
    plugins: [],
}
