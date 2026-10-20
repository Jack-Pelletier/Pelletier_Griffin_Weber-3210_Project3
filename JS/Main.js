
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
}

for(let i = 0; i < asteroidField.asteroidCount; i++) {


for(let j = i + 1; j < asteroidField.asteroidCount; j++) {

if (objCollision(
    obj1.x, obj1.y, obj1.z, obj1.size,
    obj2.x, obj2.y, obj2.z, obj2.size)) {
    obj1.isColliding = true;
    obj2.isColliding = true;

}
}

}
}