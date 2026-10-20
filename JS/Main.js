
// Create the asteroid environment
function createSpaceEnvironment(scene) {

    const asteroidField = createAsteroidField(scene);

    return asteroidField;

}


// Update the asteroid environment
function updateSpaceEnvironment(asteroidField, camera, time, deltaTime) {

    updateAsteroidField(asteroidField, camera, time, deltaTime);

}

function detectCollisions() {

let obj1;
let obj2;

    for (let i = 0; i < asteroidField.asteroidCount; i++) {

        asteroidField[i].isColliding = false;
}

for(let i = 0; i < asteroidField.asteroidCount; i++) {
obj1 = asteroidField.asteroidData[i];

for(let j = i + 1; j < asteroidField.asteroidCount; j++) {
obj2 = spaceshipModel.group[j]; 
if (objCollision(
    obj1.x, obj1.y, obj1.z, obj1.size,
    obj2.x, obj2.y, obj2.z, obj2.size)) {
    obj1.isColliding = true;
    obj2.isColliding = true;

}
}

}
}