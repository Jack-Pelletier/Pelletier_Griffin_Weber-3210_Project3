
// Create the asteroid environment
function createSpaceEnvironment(scene) {

    const asteroidField = createAsteroidField(scene);

    return asteroidField;

}


// Update the asteroid environment
function updateSpaceEnvironment(asteroidField, camera, time, deltaTime) {

    updateAsteroidField(asteroidField, camera, time, deltaTime);

}

function detectCollisions(asteroidField, spaceshipModel) {
const{asteroidData, dummy, asteroidCount} = asteroidField;
spaceshipModel.group.updateMatrixWorld(); // Ensure the spaceship's world matrix is up to date


const spaceshipBox = new THREE.Box3().setFromObject(spaceshipModel.group);

const closestPoint = new THREE.Vector3();
const asteroidPosition = new THREE.Vector3();
const collisionNormal = new THREE.Vector3();
const shipCenter = new THREE.Vector3();

spaceshipBox.getCenter(shipCenter);

    for (let i = 0; i < asteroidData.length; i++) {
        const asteroid = asteroidData[i];
        asteroid[i].isColliding = false;
       
const driftX = 
asteroid.movementType === 2
    ? Math.sin(asteroid.lastCollisionTime * asteroid.driftSpeed + asteroid.Phase) * asteroid.driftAmount
    : Math.cos(asteroid.lastCollisionTime * asteroid.driftSpeed + asteroid.Phase) * asteroid.driftAmount;

    let x = asteroid.x + driftX;
    let y = asteroid.y;
    

    if (asteroid.movementType === 1) {
        const t = Math.sin(asteroid.lastCollisionTime * asteroid.driftSpeed + asteroid.Phase);
        y += (t * t - 0.5) * asteroid.driftAmount;
    }else if (asteroid.movementType === 2) {
    y += Math.sin(asteroid.lastCollisionTime * asteroid.driftSpeed + asteroid.Phase) * asteroid.driftAmount;
    }

    asteroidPosition.set(x, y, asteroid.z);

    spaceshipBox.clampPoint(asteroidPosition, closestPoint);

    collisionNormal.subVectors(closestPoint, asteroidPosition);

    const distance = collisionNormal.length();

    const scale = 
    asteroid.size *(1 + 0.2 * Math.sin(asteroid.lastCollisionTime * asteroid.driftSpeed + asteroid.Phase));

    const radius = scale;

    if (distance < radius) {
        asteroid.isColliding = true;
    if (distance < 0.0001){
        collisionNormal.subVectors(shipCenter, asteroidPosition);


        if(collisionNormal.lengthsq() < 0.0001){
            collisionNormal.set(0,0,1);
        }
    }

collisionNormal.normalize();

const  pushDistance = radius - distance + 0.01;

asteroid.x += collisionNormal.x * pushDistance;
asteroid.y += collisionNormal.y * pushDistance;
asteroid.z += collisionNormal.z * pushDistance;

const velocity = asteroid.velocity;
const dot = velocity.dot(collisionNormal);

if(dot < 0){
    velocity.addScaledVector(collisionNormal, -2 * dot);
}

if(velocity.dot(collisionNormal) < 0.5){
    velocity.addScaledVector(
        collisionNormal,
        2 - velocity.dot(collisionNormal)

    );
}

dummy.position.set(
    asteroid.x,
    asteroid.y,
    asteroid.z
);

dummy.rotation.set(
    asteroid.lastCollisionTime * asteroid.rotationSpeed,
    asteroid.lastCollisionTime * asteroid.rotationSpeed * 0.7,
    asteroid.lastCollisionTime * asteroid.rotationSpeed * 0.4
);
dummy.scale.setScalar(scale);
dummy.updateMatrix();
asteroidPosition.setMatrixAt(i, dummy.matrix);

        
}

    }
    asteroidPosition.instanceMatrix.needsUpdate = true;

}