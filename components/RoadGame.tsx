import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BillboardData {
    year: string;
    title: string;
    description: string;
    position: [number, number, number];
}

const billboardData: BillboardData[] = [
    {
        year: '2015',
        title: 'Mechatronikai Mérnök',
        description: 'BME - Gépészmérnöki Kar',
        position: [-8, 2, -20]
    },
    {
        year: '2017',
        title: 'Mérnökinformatikus',
        description: 'BME - Villamosmérnöki és Informatikai Kar',
        position: [8, 2, -40]
    },
    {
        year: '2019',
        title: 'Matematika Tanár',
        description: 'ELTE - Természettudományi Kar',
        position: [-6, 2, -60]
    },
    {
        year: '2021',
        title: 'Sportoktató',
        description: 'Testnevelési és Sporttudományi Kar',
        position: [10, 2, -80]
    },
    {
        year: '2023',
        title: 'MIHASZNA Matek',
        description: 'Saját matek tanítási vállalkozás',
        position: [-4, 2, -100]
    }
];

const RoadGame: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const carRef = useRef<THREE.Mesh | null>(null);
    const roadRef = useRef<THREE.Mesh | null>(null);
    const billboardsRef = useRef<THREE.Group | null>(null);
    const [currentBillboard, setCurrentBillboard] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 0, -50);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Road
        const roadGeometry = new THREE.PlaneGeometry(20, 200);
        const roadMaterial = new THREE.MeshLambertMaterial({
            color: 0x333333,
            side: THREE.DoubleSide
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.z = -50;
        road.receiveShadow = true;
        scene.add(road);
        roadRef.current = road;

        // Road lines
        const lineGeometry = new THREE.PlaneGeometry(0.5, 200);
        const lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        for (let i = 0; i < 20; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.01, -10 - i * 10);
            scene.add(line);
        }

        // Car
        const carGeometry = new THREE.BoxGeometry(2, 1, 3);
        const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.set(0, 1, 10);
        car.castShadow = true;
        scene.add(car);
        carRef.current = car;

        // Billboards
        const billboardsGroup = new THREE.Group();
        billboardData.forEach((data, index) => {
            const billboardGeometry = new THREE.PlaneGeometry(6, 4);
            const billboardMaterial = new THREE.MeshLambertMaterial({
                color: index === 0 ? 0x00ff00 : 0x666666
            });
            const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
            billboard.position.set(...data.position);
            billboard.castShadow = true;
            billboard.userData = { index, data };
            billboardsGroup.add(billboard);
        });
        scene.add(billboardsGroup);
        billboardsRef.current = billboardsGroup;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Car bounce animation
            if (carRef.current) {
                carRef.current.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
            }

            // Billboard glow animation
            billboardsGroup.children.forEach((billboard, index) => {
                const material = billboard.material as THREE.MeshLambertMaterial;
                if (index === currentBillboard) {
                    material.color.setHex(0x00ff00);
                    billboard.scale.setScalar(1.2);
                } else {
                    material.color.setHex(0x666666);
                    billboard.scale.setScalar(1);
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !mountRef.current) return;

        const rect = mountRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        setMousePosition({ x, y });

        // Move car
        if (carRef.current) {
            carRef.current.position.x = x * 8;
        }

        // Update billboard based on car position
        const carZ = carRef.current?.position.z || 10;
        const billboardIndex = Math.floor(Math.abs(carZ - 10) / 20);
        if (billboardIndex !== currentBillboard && billboardIndex >= 0 && billboardIndex < billboardData.length) {
            setCurrentBillboard(billboardIndex);
        }
    };

    const handleMouseDown = () => {
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    return (
        <div className="road-game-container">
            <div
                ref={mountRef}
                style={{
                    width: '100%',
                    height: '500px',
                    cursor: isMouseDown ? 'grabbing' : 'grab'
                }}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            <div className="game-instructions">
                <p>🎮 Húzd az egeret az autó mozgatásához!</p>
                <p>📋 Aktuális: {billboardData[currentBillboard]?.title}</p>
            </div>
        </div>
    );
};

export default RoadGame;
