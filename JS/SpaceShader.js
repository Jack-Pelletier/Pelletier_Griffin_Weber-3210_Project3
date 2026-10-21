// Create custom shader material for asteroids
function createAsteroidShaderMaterial() {

    const asteroidShaderMaterial = new THREE.ShaderMaterial({

        uniforms: {
            uTime: { value: 0 }
        },

        vertexShader: `
            attribute float aTextureSeed;

            varying vec2 vUv;
            varying vec3 vColor;
            varying vec3 vNormal;
            varying float vTextureSeed;

            void main() {

                // Pass UV coordinates
                vUv = uv;

                // Pass individual asteroid color
                vColor = instanceColor;

                // Pass individual texture seed
                vTextureSeed = aTextureSeed;

                // Pass surface normal
                vNormal = normalize(mat3(modelViewMatrix * instanceMatrix) * normal);

                gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);

            }
        `,

        fragmentShader: `
            uniform float uTime;

            varying vec2 vUv;
            varying vec3 vColor;
            varying vec3 vNormal;
            varying float vTextureSeed;

            // Generate random values from coordinates
            float random(vec2 p) {

                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);

            }

            // Generate smooth procedural noise
            float noise(vec2 p) {

                vec2 i = floor(p);
                vec2 f = fract(p);

                f = f * f * (3.0 - 2.0 * f);

                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));

                return mix(
                    mix(a, b, f.x),
                    mix(c, d, f.x),
                    f.y
                );

            }

            void main() {

                // Give each asteroid unique texture coordinates
                vec2 uniqueUv = vUv + vec2(
                    vTextureSeed * 13.7,
                    vTextureSeed * 29.3
                );

                // Animate each asteroid's texture
                vec2 animatedUv = uniqueUv + vec2(uTime * 0.01, uTime * 0.005);

                // Generate different surface patterns
                float pattern1 = noise(animatedUv * 12.0);
                float pattern2 = noise(animatedUv * 30.0);

                float rockyPattern = pattern1 * 0.7 + pattern2 * 0.3;

                // Create different shades of each asteroid's color
                vec3 darkColor = vColor * 0.35;
                vec3 lightColor = vColor * 1.5;

                vec3 finalColor = mix(darkColor, lightColor, rockyPattern);

                // Calculate directional lighting
                vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));

                float lighting = max(dot(normalize(vNormal), lightDirection), 0.0);

                finalColor *= 0.3 + lighting * 0.7;

                gl_FragColor = vec4(finalColor, 1.0);

            }
        `,

        side: THREE.FrontSide

    });

    return asteroidShaderMaterial;

}
