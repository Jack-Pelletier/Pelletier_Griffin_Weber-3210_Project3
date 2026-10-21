
// Create the asteroid environment
function createSpaceEnvironment(scene) {

    const asteroidField = createAsteroidField(scene);

    return asteroidField;

}


// Update the asteroid environment
function updateSpaceEnvironment(asteroidField, camera, time, deltaTime, spaceshipModel) {

    updateAsteroidField(asteroidField, camera, time, deltaTime);

    // Detect collisions with the spaceship
    if (spaceshipModel && spaceshipModel.group) {
        detectCollisions(asteroidField, spaceshipModel, time);
    }

}

function detectCollisions(asteroidField, spaceshipModel, time) {
const{asteroidData, dummy, asteroids} = asteroidField;
spaceshipModel.group.updateWorldMatrix(true, true); // Ensure the spaceship's world matrix is up to date


const spaceshipBox = new THREE.Box3().setFromObject(spaceshipModel.group);

const closestPoint = new THREE.Vector3();
const asteroidPosition = new THREE.Vector3();
const collisionNormal = new THREE.Vector3();
const shipCenter = new THREE.Vector3();

spaceshipBox.getCenter(shipCenter);

    for (let i = 0; i < asteroidData.length; i++) {
        const asteroid = asteroidData[i];
        asteroid.isColliding = false;

const phase = time * asteroid.driftSpeed + asteroid.phase;

let driftX = 0;

if (asteroid.movementType === 0) {
    driftX = Math.sin(phase) * asteroid.driftAmount;
} else if (asteroid.movementType === 1) {
    driftX = Math.sin(phase) * asteroid.driftAmount;
} else if (asteroid.movementType === 2) {
    driftX = Math.cos(phase) * asteroid.driftAmount;
}

    let x = asteroid.x + driftX;
    let y = asteroid.y;
    

    if (asteroid.movementType === 1) {
        const t = Math.sin(phase);
        y += (t * t - 0.5) * asteroid.driftAmount;
    }else if (asteroid.movementType === 2) {
    y += Math.sin(phase) * asteroid.driftAmount;
    }

    asteroidPosition.set(x, y, asteroid.z);

    spaceshipBox.clampPoint(asteroidPosition, closestPoint);

    collisionNormal.subVectors(asteroidPosition, closestPoint);

    const distance = collisionNormal.length();

    const scale = 
    asteroid.size *(1 + 0.2 * Math.sin(time * asteroid.driftSpeed + asteroid.phase));

    const radius = scale;

    if (distance < radius + 0.3) {
        asteroid.isColliding = true;
        console.log("collision detected")

        // Calculate the distance required to push the asteroid outside the spaceship
        let pushDistance = radius - distance + 0.3;

    if (distance < 0.0001){
    const distances = [
       { value: asteroidPosition.x - spaceshipBox.min.x, axis: 0, sign: -1 },
        { value: spaceshipBox.max.x - asteroidPosition.x, axis: 0, sign: 1 },
        { value: asteroidPosition.y - spaceshipBox.min.y, axis: 1, sign: -1 },
        { value: spaceshipBox.max.y - asteroidPosition.y, axis: 1, sign: 1 },
        { value: asteroidPosition.z - spaceshipBox.min.z, axis: 2, sign: -1 },
        { value: spaceshipBox.max.z - asteroidPosition.z, axis: 2, sign: 1 }  
    ];

    distances.sort((a, b) => a.value - b.value);

    collisionNormal.set(0,0,0);
    collisionNormal.setComponent(distances[0].axis, distances[0].sign);

        // Include the distance to the nearest box face
        pushDistance = distances[0].value + radius + 0.3;

        if(collisionNormal.lengthSq() < 0.0001){
            collisionNormal.set(0,0,1);
        }
    }

collisionNormal.normalize();

// Push the asteroid completely outside the spaceship
asteroid.x += collisionNormal.x * pushDistance;
asteroid.y += collisionNormal.y * pushDistance;
asteroid.z += collisionNormal.z * pushDistance;

const velocity = asteroid.velocity;
const dot = velocity.dot(collisionNormal);

if(dot < 0){
    velocity.addScaledVector(collisionNormal, -2 * dot);
}

// Give the asteroid a stronger outward bounce
const bounceSpeed = 12;

if(velocity.dot(collisionNormal) < bounceSpeed){
    velocity.addScaledVector(
        collisionNormal,
        bounceSpeed - velocity.dot(collisionNormal)
    );
}

// Apply the original animated drift when updating the instance matrix
dummy.position.set(
    asteroid.x + driftX,
    asteroid.y + (y - asteroid.y + collisionNormal.y * pushDistance),
    asteroid.z
);

dummy.rotation.set(
    time * asteroid.rotationSpeed,
    time * asteroid.rotationSpeed * 0.7,
    time * asteroid.rotationSpeed * 0.4
);
dummy.scale.setScalar(scale);
dummy.updateMatrix();
asteroidField.asteroids.setMatrixAt(i, dummy.matrix);

        
}

    }
    asteroidField.asteroids.instanceMatrix.needsUpdate = true;

}
