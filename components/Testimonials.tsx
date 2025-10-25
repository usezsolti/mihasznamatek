import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    text: string;
    rating?: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Károly",
        avatar: "/Vélemények1.png",
        text: "Emelt matematikai tananyag gyakorlasa és elmagyarazasa miatt kerestem matek tanárt, így találtam Zsoltra. Zsolt egy nagyon rugalmas, humoros és remek tanitasi képességekkel rendelkezó ember. Már rengeteg temat atvettünk, közép és emelt szinten egyarnt, mindegyikben tudott olyat mutatni/mondani, amivel jobban értettem az adott témát, vagy gyorsabban tudtam megoldani.",
        rating: 5
    },
    {
        id: 2,
        name: "Márton",
        avatar: "/Vélemények2.png",
        text: "Nagyon érthetően és jól tanít türelmes és rendkívül hatékony. Az órák jó hangulatban teltek és szórakoztatók is voltak rövid időn belül felkészített az emelt érettségire. 10/10",
        rating: 5
    },
    {
        id: 3,
        name: "Norbert",
        avatar: "/Vélemények3.png",
        text: "Közvetlen és türelmes. Szereti a kihívásokat. Nagyon széles látókörű ember, ez a módszerein is látszik. Jól felkészült és kitartó. Mindig talál egy olyan megközelítést, amivel érthetővé teszi a legnehezebb anyagot is.",
        rating: 5
    },
    {
        id: 4,
        name: "Alma",
        avatar: "/Vélemények4.png",
        text: "Emelt matematika érettségire készitett fel tavasszal. Kedvesen és érthetően magyarázta a matekot, hétköznapi példákkal segítette a megértést. Elmagyarázta az összes feladatipust. Megbizható, crákat nem mondott le, mindig az elöre megbeszélt időpontban tartotta.",
        rating: 5
    },
    {
        id: 5,
        name: "Sofia",
        avatar: "/Vélemények5.png",
        text: "Nagyon sokat segített az érettségire való felkészülésben. Számomra a matematika mindig egy nehézség volt de sok segítség és extra gyakorlással sikerült egy egészen jó érettségit írnom.",
        rating: 5
    },
    {
        id: 6,
        name: "Csongor",
        avatar: "/Vélemények6.png",
        text: "Nagyon érthetően és jól tanít türelmes és rendkívül hatékony. Az órák jó hangulatban teltek és szórakoztatók is voltak rövid időn belül felkészített az emelt érettségire. 10/10",
        rating: 5
    },
    {
        id: 7,
        name: "Dániel",
        avatar: "/Vélemények7.png",
        text: "Nagyon hasznos es érthető magyarázatokat tud adni matekból könnyebben ment így a suliban is. Jófej humoros, inkább fiatalabb tanulóknak ajánlom ezért. De az biztos hogy egy matektudás bomba.",
        rating: 5
    },
    {
        id: 8,
        name: "Tamás",
        avatar: "/Vélemények8.png",
        text: "Zsolt nagyon sokat segített nekem az egyetemi matek vizsgákkal kapcsolatban. Barátságos, nyugodt, segítőkész. Csak ajánlani tudom nagyon élveztem vele a közös órákat",
        rating: 5
    },
    {
        id: 9,
        name: "Hanga",
        avatar: "/Vélemények9.png",
        text: "Mindig vidám hangulatban teltek az órák. Ha nem értettem valamit Zsolt kreatív megoldásokkal állt elő, hogy jobban menjen az anyag.",
        rating: 5
    },
    {
        id: 10,
        name: "Barnabás",
        avatar: "/Vélemények1.png",
        text: "Matematikai alapok tantargy zh felkészítés miatt kerestem meg először Zsoltit. Sajnos elsőre magamtól nem sikerült a tárgy de Zsolti segítségével már simán Ötösre megvolt. Az órák nagyon jó hangulatban telnek és nagyon érthetően magyaráz. Az időpont egyeztetés is elég rugalmas, mindig találtunk mindkettőnknek megfelelő időpontot. Bátran ajánlom mindenkinek.",
        rating: 5
    },
    {
        id: 11,
        name: "Zsolt",
        avatar: "/Vélemények2.png",
        text: "Szuper, rengeteget tanultam!",
        rating: 5
    },
    {
        id: 12,
        name: "Bence",
        avatar: "/Vélemények3.png",
        text: "Az időpont egyeztetésben rugalmas, az órák jó hangulatban zajlanak. A tananyagot érthetően magyarázza el, egyszerű példákkal. Az órákra előre készül.",
        rating: 5
    },
    {
        id: 13,
        name: "Ambrus",
        avatar: "/Vélemények4.png",
        text: "Középiskolai utolsó évemben nem nagyon ment nekem a matek, de miután elkezdtem Zsolthoz magánórákra járni sikerült írnom egy 80%-os emelt matek érettségit. Ez annak volt köszönhető, hogy Zsolt egyszerűen és könnyen érthetően magyarázta el a tananyagokat, valamint közvetlen stilusával élménnyé tette számomra a matek tanulását.",
        rating: 5
    },
    {
        id: 14,
        name: "Dávid",
        avatar: "/Vélemények5.png",
        text: "Elöször egyetemi programozás kurzuson találkoztam vele, miután az elózö felévben nem sikerült a tárgy. Az ö türelmes, alapos és érthető oktatási módszereinek köszönhetően sikeresen teljesitettem a tárgyat. Később kiderütt, hogy matematikat is tanit, igy külön matekórákat is kezdtem töle venni, amelyek szintén nagyon hasznosnak bizonyultak. Nagyon ajántom t mind programozás, mind matematika oktatasára, kiváló szakértelemmel és odaadással tanít.",
        rating: 5
    },
    {
        id: 15,
        name: "Esther",
        avatar: "/Vélemények6.png",
        text: "Zsolt rövid idő alatt készített fel matek érettségire és segített megérteni rengeteg témakört, amit előtte órán vagy magamtól nem tudtam volna. Mindenkinek csak ajánlani tudom, hiszen az órák hangulata máshoz nem volt fogható.",
        rating: 5
    },
    {
        id: 16,
        name: "Márk",
        avatar: "/Vélemények7.png",
        text: "Nagyon könnyen, és érthetően magyarázza el a tananyagokat, az órák izgalmasak és viccesek. Felhúzta az átlagomat. Ezen kívül megértő, ha esetleg le kell mondanom az órát.",
        rating: 5
    },
    {
        id: 17,
        name: "Réka",
        avatar: "/Vélemények8.png",
        text: "Zsolt nagyon kedves, hihetetlenül segítőkész ember és tanár, aki teljes mértékben konyhanyelven magyarázza el az anyagot. Órák tartásában teljes mértékben rugalmas, viszonylag gyorsan lehet időpontot egyeztetni vele. Összességében szerintem egy nagyon jó ember és az órák alkalmával tök jó baráti hangulatot teremt.",
        rating: 5
    },
    {
        id: 18,
        name: "Tomm",
        avatar: "/Vélemények9.png",
        text: "Jófej, könnyen érthetően magyarázza el az anyagot. Rugalmas, nyitott alternatív módokon is megértetni a témát!",
        rating: 5
    },
    {
        id: 19,
        name: "Janka",
        avatar: "/Vélemények1.png",
        text: "Ténylegesen segíteni szeretne és jó hangulatott hozott az órákra és jól magyarázz, tanít",
        rating: 5
    },
    {
        id: 20,
        name: "Levente",
        avatar: "/Vélemények2.png",
        text: "Zsolttal nagyon gyorsan és rugalmasan sikerült időpontokat egyeztetni. Rendkívül sokat segített egy sürgős felkészülés során, és hetente több intenzív korrepetálást is tartott. Az órák légköre barátságos volt, ugyanakkor gyakran hozott az egyetemi anyaghoz képest azonos, sőt néha még nehezebb feladatokat is. Zsolt segítségével gond nélkül sikerült átmenni Matek 1-en (sos pót zh), és Matek 2-n is. Szívből ajánlom mindenkinek.",
        rating: 5
    },
    {
        id: 21,
        name: "Anna",
        avatar: "/Vélemények10.png",
        text: "Zsolt segítségével sikerült megértenem a matematika alapjait. Türelmesen magyarázza el az anyagot, és mindig talál kreatív megoldásokat a nehézségekre. Az órák jó hangulatban telnek, és észrevehetően javult a matek tudásom.",
        rating: 5
    },
    {
        id: 22,
        name: "Péter",
        avatar: "/Vélemények11.png",
        text: "Kiváló tanár! Zsolt segítségével sikerült felkészülnöm az emelt matek érettségire. Az órák szórakoztatóak és érthetőek voltak. Mindenkinek ajánlom, aki matekban szeretne fejlődni.",
        rating: 5
    },
    {
        id: 23,
        name: "Kata",
        avatar: "/Vélemények12.png",
        text: "Zsolt egy fantasztikus tanár! Rugalmas az időpontokkal, és mindig segítőkész. Az órák alatt sok mindent megtanultam, és végre megértettem a matekot. Csak ajánlani tudom!",
        rating: 5
    }
];

const Testimonials: React.FC = () => {
    const [isClient, setIsClient] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
                // Swipe left - next testimonial
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            } else {
                // Swipe right - previous testimonial
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
                // Swipe left - next testimonial
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            } else {
                // Swipe right - previous testimonial
                setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            }
        }

        setIsDragging(false);
    };

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="section-title">Vélemények</h2>
                <p className="section-subtitle">Miért vagyok igazi MIHASZNA matektanár?</p>

                <div className="testimonials-grid">
                    {/* Swipe-able testimonials for mobile */}
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
                                transition: isDragging ? 'none' : 'transform 0.3s ease'
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={testimonial.id} className="testimonial-swipe-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text" suppressHydrationWarning>&ldquo;{testimonial.text}&rdquo;</p>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Swipe indicators */}
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

                    {/* Első sor - végtelen loop */}
                    <div className="testimonials-row infinite-row">
                        <div className="testimonials-track">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text" suppressHydrationWarning>&ldquo;{testimonial.text}&rdquo;</p>
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
                                    </div>
                                </div>
                            ))}
                            {/* Duplikáljuk a véleményeket a folyamatos mozgáshoz */}
                            {testimonials.map((testimonial) => (
                                <div key={`duplicate-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text" suppressHydrationWarning>&ldquo;{testimonial.text}&rdquo;</p>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Második sor - végtelen loop */}
                    <div className="testimonials-row infinite-row reverse">
                        <div className="testimonials-track">
                            {testimonials.slice().reverse().map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text" suppressHydrationWarning>&ldquo;{testimonial.text}&rdquo;</p>
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
                                    </div>
                                </div>
                            ))}
                            {/* Duplikáljuk a véleményeket a folyamatos mozgáshoz */}
                            {testimonials.slice().reverse().map((testimonial) => (
                                <div key={`duplicate-reverse-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text" suppressHydrationWarning>&ldquo;{testimonial.text}&rdquo;</p>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Harmadik sor - végtelen loop */}
                    <div className="testimonials-row infinite-row">
                        <div className="testimonials-track">
                            {testimonials.slice(10).concat(testimonials.slice(0, 10)).map((testimonial) => (
                                <div key={testimonial.id} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text">"{testimonial.text}"</p>
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
                                    </div>
                                </div>
                            ))}
                            {/* Duplikáljuk a véleményeket a folyamatos mozgáshoz */}
                            {testimonials.slice(10).concat(testimonials.slice(0, 10)).map((testimonial) => (
                                <div key={`duplicate-shifted-${testimonial.id}`} className="testimonial-card">
                                    <div className="testimonial-content">
                                        <p className="testimonial-text">"{testimonial.text}"</p>
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
