import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '../utils/i18n';

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    rating?: number;
}

const testimonials: Testimonial[] = [
    { id: 1, name: 'Károly', avatar: '/Vélemények1.png', rating: 5 },
    { id: 2, name: 'Márton', avatar: '/Vélemények2.png', rating: 5 },
    { id: 3, name: 'Norbert', avatar: '/Vélemények3.png', rating: 5 },
    { id: 4, name: 'Alma', avatar: '/Vélemények4.png', rating: 5 },
    { id: 5, name: 'Sofia', avatar: '/Vélemények5.png', rating: 5 },
    { id: 6, name: 'Csongor', avatar: '/Vélemények6.png', rating: 5 },
    { id: 7, name: 'Dániel', avatar: '/Vélemények7.png', rating: 5 },
    { id: 8, name: 'Tamás', avatar: '/Vélemények8.png', rating: 5 },
    { id: 9, name: 'Hanga', avatar: '/Vélemények9.png', rating: 5 },
    { id: 10, name: 'Barnabás', avatar: '/Vélemények1.png', rating: 5 },
    { id: 11, name: 'Zsolt', avatar: '/Vélemények2.png', rating: 5 },
    { id: 12, name: 'Bence', avatar: '/Vélemények3.png', rating: 5 },
    { id: 13, name: 'Ambrus', avatar: '/Vélemények4.png', rating: 5 },
    { id: 14, name: 'Dávid', avatar: '/Vélemények5.png', rating: 5 },
    { id: 15, name: 'Esther', avatar: '/Vélemények6.png', rating: 5 },
    { id: 16, name: 'Márk', avatar: '/Vélemények7.png', rating: 5 },
    { id: 17, name: 'Réka', avatar: '/Vélemények8.png', rating: 5 },
    { id: 18, name: 'Tomm', avatar: '/Vélemények9.png', rating: 5 },
    { id: 19, name: 'Janka', avatar: '/Vélemények1.png', rating: 5 },
    { id: 20, name: 'Levente', avatar: '/Vélemények2.png', rating: 5 },
    { id: 21, name: 'Anna', avatar: '/Vélemények10.png', rating: 5 },
    { id: 22, name: 'Péter', avatar: '/Vélemények11.png', rating: 5 },
    { id: 23, name: 'Kata', avatar: '/Vélemények12.png', rating: 5 },
];

function TestimonialQuote({ id }: { id: number }) {
    const { t } = useLang();
    return (
        <p className="testimonial-text" suppressHydrationWarning>
            &ldquo;{t(`review.${id}`)}&rdquo;
        </p>
    );
}

const Testimonials: React.FC = () => {
    const { t } = useLang();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;

        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            } else {
                setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            }
        }

        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setCurrentX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setCurrentX(e.clientX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;

        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            } else {
                setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            }
        }

        setIsDragging(false);
    };

    const renderFooter = (testimonial: Testimonial) => (
        <div className="testimonial-footer">
            <div className="testimonial-avatar">
                <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="avatar-image"
                />
            </div>
            <div className="testimonial-info">
                <h4 className="testimonial-name">{testimonial.name}</h4>
                {testimonial.rating && (
                    <div className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="star">⭐</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="section-title">{t('testimonials.title')}</h2>
                <p className="section-subtitle">{t('testimonials.subtitle')}</p>

                <div className="testimonials-grid">
                    <div className="testimonials-swipe-container">
                        <div
                            className="testimonials-swipe-track"
                            ref={trackRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={{
                                transform: `translateX(${-currentIndex * 100}%)`,
                                transition: isDragging ? 'none' : 'transform 0.3s ease',
                            }}
                        >
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-swipe-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="swipe-indicators">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`swipe-indicator ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="testimonials-row infinite-row">
                        <div className="testimonials-track">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                            {testimonials.map((testimonial) => (
                                <div key={`duplicate-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="testimonials-row infinite-row reverse">
                        <div className="testimonials-track">
                            {testimonials.slice().reverse().map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                            {testimonials.slice().reverse().map((testimonial) => (
                                <div key={`duplicate-reverse-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="testimonials-row infinite-row">
                        <div className="testimonials-track">
                            {testimonials.slice(10).concat(testimonials.slice(0, 10)).map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                            {testimonials.slice(10).concat(testimonials.slice(0, 10)).map((testimonial) => (
                                <div key={`duplicate-shifted-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <TestimonialQuote id={testimonial.id} />
                                        {renderFooter(testimonial)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
