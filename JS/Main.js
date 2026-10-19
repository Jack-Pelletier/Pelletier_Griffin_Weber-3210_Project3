
// Create the asteroid environment
function createSpaceEnvironment(scene) {

    const asteroidField = createAsteroidField(scene);

    return asteroidField;

}


// Update the asteroid environment
function updateSpaceEnvironment(asteroidField, camera, time, deltaTime) {

    updateAsteroidField(asteroidField, camera, time, deltaTime);

}
