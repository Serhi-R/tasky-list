import Link from 'next/link';

export default function Footer() {
    const pageLinks = {
        Home: '/',
        'About Us': '/about',
        
    };

    const sections = [
        {
            items: ['Dashboard'],
        },
        {
            items: ['Task'],
        },
    ];

    return (
        <>
            <footer className="footer">
                <ul className="footer__list">
                    {sections.map((section, index) => (
                        <li key={index} className="footer__item">
                            <div className="footer__section">
                                <h2 className="footer__title">
                                    {section.title}
                                </h2>
                                <ul className="footer__links">
                                    {section.items.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="footer__links-item"
                                        >
                                            {item === 'Terms & Conditions' ? (
                                                <a
                                                    href="/terms.pdf"
                                                    target="_blank"
                                                    className="footer__link"
                                                >
                                                    {item}
                                                </a>
                                            ) : (
                                                <Link
                                                    href={
                                                        pageLinks[item] || '#'
                                                    }
                                                    className="footer__link"
                                                >
                                                    {item}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </footer>
        </>
    );
}
