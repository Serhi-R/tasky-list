import type { AppProps } from 'next/app';
import {
    // Geist, Geist_Mono,
    Figtree,
} from 'next/font/google';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '../src/styles/globals.css';
import '../src/styles/output.css';

// const geistSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// });

const figTreeSans = Figtree({
    variable: '--font-figtree-sans',
    subsets: ['latin'],
});

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className={`${figTreeSans.variable} antialiased`}>
            <Component {...pageProps} />
        </div>
    );
}
