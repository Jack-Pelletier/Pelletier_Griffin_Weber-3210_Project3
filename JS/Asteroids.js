
// Random number helper
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}


// Create the asteroid field
function createAsteroidField(scene) {

    const asteroidCount = 500;
    const fieldWidth = 150;
    const fieldDepth = 350;

    // Create shared geometry
    const asteroidGeometry = new THREE.IcosahedronGeometry(1, 1);

    // Create shared material
    const asteroidMaterial = createAsteroidShaderMaterial();

    // Create the instanced asteroid mesh
    const asteroids = new THREE.InstancedMesh(asteroidGeometry, asteroidMaterial, asteroidCount);

    asteroids.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Prevent the entire field from being culled
    asteroids.frustumCulled = false;

    scene.add(asteroids);


    // Store asteroid properties
    const asteroidData = [];

    // Temporary object for transformation matrices
    const dummy = new THREE.Object3D();


    // Generate asteroids
    for (let i = 0; i < asteroidCount; i++) {

        const asteroid = {
            x: randomRange(-fieldWidth, fieldWidth),
            y: randomRange(-fieldWidth, fieldWidth),
            z: randomRange(-fieldDepth, fieldDepth),

            size: randomRange(0.5, 3),

            rotationSpeed: randomRange(0.1, 1),
            driftSpeed: randomRange(0.2, 2),
            driftAmount: randomRange(1, 8),

            phase: randomRange(0, Math.PI * 2),
            movementType: Math.floor(Math.random() * 3),

            velocity: new THREE.Vector3(
                randomRange(-0.05, 0.05),
                randomRange(-0.05, 0.05),
                randomRange(-0.1, -0.01)
            ),
            isColliding: false,
     
        };

        asteroidData.push(asteroid);


        // Give each asteroid a different color
        const color = new THREE.Color();

        color.setHSL(randomRange(0, 1), randomRange(0.3, 0.8), randomRange(0.3, 0.7));

        asteroids.setColorAt(i, color);


        // Set initial asteroid transformation
        dummy.position.set(asteroid.x, asteroid.y, asteroid.z);

        dummy.rotation.set(0, 0, 0);

        dummy.scale.setScalar(asteroid.size);

        dummy.updateMatrix();

        asteroids.setMatrixAt(i, dummy.matrix);

    }

    asteroids.instanceMatrix.needsUpdate = true;

    if (asteroids.instanceColor) {
        asteroids.instanceColor.needsUpdate = true;
    }


    // Return the asteroid field information
    return {
        asteroids,
        asteroidData,
        asteroidCount,
        fieldWidth,
        fieldDepth,
        dummy,
        cameraPosition: new THREE.Vector3()
    };

}


// Update asteroid animations
function updateAsteroidField(asteroidField, camera, time, deltaTime) {

    const {
        asteroids,
        asteroidData,
        asteroidCount,
        fieldWidth,
        fieldDepth,
        dummy,
        cameraPosition
    } = asteroidField;

    // Update custom shader animation
    asteroids.material.uniforms.uTime.value = time;


    // Get camera position in world coordinates
    camera.updateWorldMatrix(true, false);
    camera.getWorldPosition(cameraPosition);


    for (let i = 0; i < asteroidCount; i++) {

        const asteroid = asteroidData[i];


        

        asteroid.lastCollisionTime = time;
        //adds velocity from previous collisions
        asteroid.x += asteroid.velocity.x * deltaTime;
        asteroid.y += asteroid.velocity.y * deltaTime;
        asteroid.z += asteroid.velocity.z * deltaTime;

        // Recycle asteroid positions around the camera
        // This creates an effectively infinite field
        while (asteroid.x - cameraPosition.x > fieldWidth) {
            asteroid.x -= fieldWidth * 2;
        }

        while (asteroid.x - cameraPosition.x < -fieldWidth) {
            asteroid.x += fieldWidth * 2;
        }

        while (asteroid.y - cameraPosition.y > fieldWidth) {
            asteroid.y -= fieldWidth * 2;
        }

        while (asteroid.y - cameraPosition.y < -fieldWidth) {
            asteroid.y += fieldWidth * 2;
        }

        while (asteroid.z - cameraPosition.z > fieldDepth) {
            asteroid.z -= fieldDepth * 2;
        }

        while (asteroid.z - cameraPosition.z < -fieldDepth) {
            asteroid.z += fieldDepth * 2;
        }


        // Starting position
        let x = asteroid.x;
        let y = asteroid.y;


        // Movement type 0: Side-to-side drift
        if (asteroid.movementType === 0) {

            x += Math.sin(time * asteroid.driftSpeed + asteroid.phase) * asteroid.driftAmount;

        }


        // Movement type 1: Parabolic drift
        else if (asteroid.movementType === 1) {

            const t = Math.sin(time * asteroid.driftSpeed + asteroid.phase);

            x += t * asteroid.driftAmount;

            y += (t * t - 0.5) * asteroid.driftAmount;

        }


        // Movement type 2: Circular drift
        else {

            x += Math.cos(time * asteroid.driftSpeed + asteroid.phase) * asteroid.driftAmount;

            y += Math.sin(time * asteroid.driftSpeed + asteroid.phase) * asteroid.driftAmount;

        }


        // Update asteroid position
        dummy.position.set(x, y, asteroid.z);


        // Rotate each asteroid
        dummy.rotation.set(time * asteroid.rotationSpeed, time * asteroid.rotationSpeed * 0.7, time * asteroid.rotationSpeed * 0.4);


        // Make asteroids grow and shrink
        const scale = asteroid.size * (1 + 0.2 * Math.sin(time * asteroid.driftSpeed + asteroid.phase));

        dummy.scale.set(scale, scale, scale);


        // Update transformation matrix
        dummy.updateMatrix();

        asteroids.setMatrixAt(i, dummy.matrix);

    }


    // Update all asteroid transformations
    asteroids.instanceMatrix.needsUpdate = true;

}
