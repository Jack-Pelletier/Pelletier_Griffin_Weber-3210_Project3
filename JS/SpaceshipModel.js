// there is a lot of clipping and dimensions not lining up after changes, will clean up later :I

class SpaceshipModel {
  constructor() {
    // using 'this' for more concise text
    this.group = new THREE.Group();

    // materials
    this.materials = {
      hull: new THREE.MeshStandardMaterial({
        color: 0x222630,
        roughness: 0.5,
        metalness: 0.4,
        flatShading: true
      }),
      dashboard: new THREE.MeshStandardMaterial({
        color: 0x12141a,
        roughness: 0.7,
        metalness: 0.2,
        flatShading: true
      }),
      frame: new THREE.MeshStandardMaterial({
        color: 0x0c0e12,
        roughness: 0.3,
        metalness: 0.8,
        flatShading: true
      }),
      accent: new THREE.MeshStandardMaterial({
        color: 0x3d4656,
        roughness: 0.4,
        metalness: 0.5,
        flatShading: true
      }),
      seat: new THREE.MeshStandardMaterial({
        color: 0x181b22,
        roughness: 0.8,
        metalness: 0.1,
        flatShading: true
      }),
      // Blocky display & indicator materials
      screenCyan: new THREE.MeshBasicMaterial({ color: 0x00d5ff }),
      screenOrange: new THREE.MeshBasicMaterial({ color: 0xff9900 }),
      screenGreen: new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
      btnRed: new THREE.MeshBasicMaterial({ color: 0xff3344 }),
      btnBlue: new THREE.MeshBasicMaterial({ color: 0x0088ff })
    };

    this.buildCockpit();
  }

  buildCockpit() {
    this.buildFloorAndPedals();
    this.buildDashboard();
    this.buildEnclosedWallsAndRoof();
    this.buildSeat();
    this.buildViewportFrame();
    this.buildFlightControls();
    this.buildMirrorHousing();
  }

  // floor and pedals
  buildFloorAndPedals() {
    const floorGroup = new THREE.Group();

    // main floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.1, 2.0),
      this.materials.hull
    );
    floor.position.set(0, -1, -0.2);
    floorGroup.add(floor);

    // foot ramp
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.05, 0.5),
      this.materials.hull
    );
    ramp.position.set(0, -0.8, -1.05);
    ramp.rotation.x = Math.PI * 0.2;
    floorGroup.add(ramp);

    // foot pedals
    const pedalGeo = new THREE.BoxGeometry(0.2, 0.3, 0.05);
    
    const leftPedal = new THREE.Mesh(pedalGeo, this.materials.accent);
    leftPedal.position.set(-0.5, -0.5, -1.0);
    leftPedal.rotation.x = -Math.PI * 0.15;
    floorGroup.add(leftPedal);

    const rightPedal = new THREE.Mesh(pedalGeo, this.materials.accent);
    rightPedal.position.set(0.5, -0.5, -1.0);
    rightPedal.rotation.x = -Math.PI * 0.15;
    floorGroup.add(rightPedal);

    this.group.add(floorGroup);
  }

  // dashboard
  buildDashboard() {
    const dashGroup = new THREE.Group();

    // main center console
    const centerBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.45, 0.65),
      this.materials.dashboard
    );
    centerBlock.position.set(0, -0.5, -0.80);
    centerBlock.rotation.x = Math.PI * 0.15;
    dashGroup.add(centerBlock);

    // left console
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.4, 0.5),
      this.materials.dashboard
    );
    leftWing.position.set(-0.8, -0.5, -0.8);
    leftWing.rotation.set(Math.PI * 0.15, Math.PI * 0.15, -Math.PI * 0.05);
    dashGroup.add(leftWing);

    // right console
    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.4, 0.5),
      this.materials.dashboard
    );
    rightWing.position.set(0.8, -0.5, -0.8);
    rightWing.rotation.set(Math.PI * 0.15, -Math.PI * 0.15, Math.PI * 0.05);
    dashGroup.add(rightWing);

    // center screen
    const mainScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.25, 0.02),
      this.materials.screenCyan
    );
    mainScreen.position.set(0, -0.4, -0.75);
    mainScreen.rotation.x = Math.PI * 0.15;
    dashGroup.add(mainScreen);

    // left screen
    const leftScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.25, 0.02),
      this.materials.screenOrange
    );
    leftScreen.position.set(-0.7, -0.45, -0.75);
    leftScreen.rotation.set(Math.PI * 0.15, Math.PI * 0.15, -Math.PI * 0.05);
    dashGroup.add(leftScreen);

    // right screen
    const rightScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.25, 0.02),
      this.materials.screenGreen
    );
    rightScreen.position.set(0.7, -0.45, -0.75);
    rightScreen.rotation.set(Math.PI * 0.15, -Math.PI * 0.15, Math.PI * 0.05);
    dashGroup.add(rightScreen);

    this.group.add(dashGroup);
  }

  // roof and walls
  buildEnclosedWallsAndRoof() {
    const structureGroup = new THREE.Group();

    // overhead
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.1, 1.5),
      this.materials.hull
    );
    roof.position.set(0, 0.75, -0.2);
    structureGroup.add(roof);

    // roof console
    const roofConsole = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.15, 0.75),
      this.materials.dashboard
    );
    roofConsole.position.set(0, 0.7, -0.4);
    roofConsole.rotation.x = -Math.PI * 0.05;
    structureGroup.add(roofConsole);

    // overhead screen
    const roofDisplay = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.25),
      this.materials.screenCyan
    );
    roofDisplay.position.set(0, 0.6, -0.4);
    roofDisplay.rotation.x = -Math.PI * 0.05;
    structureGroup.add(roofDisplay);

    // left wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2, 1.5),
      this.materials.hull
    );
    leftWall.position.set(-1, 0, -0.2);
    structureGroup.add(leftWall);

    // right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2, 1.5),
      this.materials.hull
    );
    rightWall.position.set(1, 0, -0.2);
    structureGroup.add(rightWall);

    // left desk
    const leftDesk = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 1),
      this.materials.dashboard
    );
    leftDesk.position.set(-0.8, -0.6, -0.2);
    structureGroup.add(leftDesk);

    // right desk
    const rightDesk = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 1),
      this.materials.dashboard
    );
    rightDesk.position.set(0.8, -0.6, -0.2);
    structureGroup.add(rightDesk);

    // left desk throttle
    const throttleBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.05, 0.25),
      this.materials.accent
    );
    throttleBase.position.set(-0.75, -0.40, -0.25);
    structureGroup.add(throttleBase);

    // the switch
    const throttleLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.12, 0.2),
      this.materials.frame
    );
    throttleLever.position.set(-0.75, -0.4, -0.25);
    throttleLever.rotation.x = -Math.PI * -0.1;
    structureGroup.add(throttleLever);

    // right desk pad
    const keypad = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.02, 0.25),
      this.materials.accent
    );
    keypad.position.set(0.75, -0.4, -0.25);
    structureGroup.add(keypad);

    this.group.add(structureGroup);
  }

  // seat (might remove as camera bounds dont show it)
  buildSeat() {
    const seatGroup = new THREE.Group();

    // seat cushion
    const seatBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.5),
      this.materials.seat
    );
    seatBase.position.set(0, -0.75, 0.1);
    seatGroup.add(seatBase);

    this.group.add(seatGroup);
  }

  // frame pillars
  buildViewportFrame() {
    const frameGroup = new THREE.Group();

    // visor
    const topVisor = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.1, 0.1),
      this.materials.frame
    );
    topVisor.position.set(0, 0.7, -0.75);
    frameGroup.add(topVisor);

    // left pillar
    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.5, 0.1),
      this.materials.frame
    );
    leftPillar.position.set(-0.75, 0.1, -0.75);
    leftPillar.rotation.set(Math.PI * 0.05, 0, -Math.PI * 0.12);
    frameGroup.add(leftPillar);

    // right pillar
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.5, 0.1),
      this.materials.frame
    );
    rightPillar.position.set(0.75, 0.1, -0.75);
    rightPillar.rotation.set(Math.PI * 0.05, 0, Math.PI * 0.12);
    frameGroup.add(rightPillar);

    this.group.add(frameGroup);
  }

  // flight controls
  buildFlightControls() {
    const controlGroup = new THREE.Group();

    // control base
    const mountBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.12),
      this.materials.frame
    );
    mountBase.position.set(0, -0.35, -0.45);
    controlGroup.add(mountBase);

    // flight shaft
    const shaft = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.32, 0.04),
      this.materials.accent
    );
    shaft.position.set(0, -0.25, -0.5);
    shaft.rotation.x = -Math.PI * 0.10;
    controlGroup.add(shaft);

    // handle Bar
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.05, 0.05),
      this.materials.frame
    );
    handle.position.set(0, -0.1, -0.475);
    controlGroup.add(handle);

    this.group.add(controlGroup);
  }

  // mirror housing
  buildMirrorHousing() {
    const mirrorGroup = new THREE.Group();

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.25, 0.05),
      this.materials.frame
    );
    bezel.position.set(0, 0.45, -0.7);
    mirrorGroup.add(bezel);

    // rear view temp model
    const mirrorScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.18, 0.02),
      this.materials.screenCyan
    );
    mirrorScreen.position.set(0, 0.45, -0.67);
    mirrorGroup.add(mirrorScreen);

    this.group.add(mirrorGroup);
  }

  update(time) {}
}