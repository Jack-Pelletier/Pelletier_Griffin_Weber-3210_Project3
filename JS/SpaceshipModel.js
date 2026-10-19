// there is a lot of clipping and dimensions not lining up after changes, will clean up later :I

class SpaceshipModel {
  constructor() {
    // using 'this' for more consise text
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
      })
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
      new THREE.BoxGeometry(2.0, 0.08, 2.0),
      this.materials.hull
    );
    floor.position.set(0, -0.95, -0.2);
    floorGroup.add(floor);

    // foot ramp
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.06, 0.6),
      this.materials.hull
    );
    ramp.position.set(0, -0.78, -1.05);
    ramp.rotation.x = Math.PI * 0.18;
    floorGroup.add(ramp);

    // foot pedals
    const pedalGeo = new THREE.BoxGeometry(0.18, 0.28, 0.05);
    
    const leftPedal = new THREE.Mesh(pedalGeo, this.materials.accent);
    leftPedal.position.set(-0.3, -0.65, -1.0);
    leftPedal.rotation.x = -Math.PI * 0.15;
    floorGroup.add(leftPedal);

    const rightPedal = new THREE.Mesh(pedalGeo, this.materials.accent);
    rightPedal.position.set(0.3, -0.65, -1.0);
    rightPedal.rotation.x = -Math.PI * 0.15;
    floorGroup.add(rightPedal);

    this.group.add(floorGroup);
  }

  // dashboard
  buildDashboard() {
    const dashGroup = new THREE.Group();

    // main center console
    const centerBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.45, 0.65),
      this.materials.dashboard
    );
    centerBlock.position.set(0, -0.48, -0.80);
    centerBlock.rotation.x = Math.PI * 0.15;
    dashGroup.add(centerBlock);

    // left console
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.38, 0.55),
      this.materials.dashboard
    );
    leftWing.position.set(-0.68, -0.48, -0.72);
    leftWing.rotation.set(Math.PI * 0.12, Math.PI * 0.15, -Math.PI * 0.05);
    dashGroup.add(leftWing);

    // right console
    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.38, 0.55),
      this.materials.dashboard
    );
    rightWing.position.set(0.68, -0.48, -0.72);
    rightWing.rotation.set(Math.PI * 0.12, -Math.PI * 0.15, Math.PI * 0.05);
    dashGroup.add(rightWing);

    this.group.add(dashGroup);
  }

  // roof and walls
  buildEnclosedWallsAndRoof() {
    const structureGroup = new THREE.Group();

    // overhead
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.1, 1.4),
      this.materials.hull
    );
    roof.position.set(0, 0.72, -0.2);
    structureGroup.add(roof);

    // roof console
    const roofConsole = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.12, 0.8),
      this.materials.dashboard
    );
    roofConsole.position.set(0, 0.62, -0.3);
    roofConsole.rotation.x = -Math.PI * 0.05;
    structureGroup.add(roofConsole);

    // left wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.2, 1.6),
      this.materials.hull
    );
    leftWall.position.set(-0.95, -0.05, -0.2);
    structureGroup.add(leftWall);

    // right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.2, 1.6),
      this.materials.hull
    );
    rightWall.position.set(0.95, -0.05, -0.2);
    structureGroup.add(rightWall);

    // left desk
    const leftDesk = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 1.1),
      this.materials.dashboard
    );
    leftDesk.position.set(-0.78, -0.58, -0.2);
    structureGroup.add(leftDesk);

    // right desk
    const rightDesk = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 1.1),
      this.materials.dashboard
    );
    rightDesk.position.set(0.78, -0.58, -0.2);
    structureGroup.add(rightDesk);

    this.group.add(structureGroup);
  }

  // seat
  buildSeat() {
    const seatGroup = new THREE.Group();

    // seat cushion
    const seatBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.18, 0.6),
      this.materials.seat
    );
    seatBase.position.set(0, -0.72, 0.1);
    seatGroup.add(seatBase);

    // back (might not be visible anymore)
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.85, 0.15),
      this.materials.seat
    );
    backrest.position.set(0, -0.22, 0.42);
    backrest.rotation.x = -Math.PI * 0.06;
    seatGroup.add(backrest);

    // Headrest
    const headrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.28, 0.12),
      this.materials.seat
    );
    headrest.position.set(0, 0.32, 0.38);
    seatGroup.add(headrest);

    this.group.add(seatGroup);
  }

  // frame pillars
  buildViewportFrame() {
    const frameGroup = new THREE.Group();

    // visor
    const topVisor = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.12, 0.12),
      this.materials.frame
    );
    topVisor.position.set(0, 0.58, -0.72);
    frameGroup.add(topVisor);

    // left pillar
    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.1, 0.08),
      this.materials.frame
    );
    leftPillar.position.set(-0.78, 0.08, -0.72);
    leftPillar.rotation.set(Math.PI * 0.06, 0, -Math.PI * 0.12);
    frameGroup.add(leftPillar);

    // right pillar
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.1, 0.08),
      this.materials.frame
    );
    rightPillar.position.set(0.78, 0.08, -0.72);
    rightPillar.rotation.set(Math.PI * 0.06, 0, Math.PI * 0.12);
    frameGroup.add(rightPillar);

    this.group.add(frameGroup);
  }

  // flight controls
  buildFlightControls() {
    const controlGroup = new THREE.Group();

    // main Column
    const shaft = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.32, 0.05),
      this.materials.accent
    );
    shaft.position.set(0, -0.48, -0.52);
    shaft.rotation.x = -Math.PI * 0.12;
    controlGroup.add(shaft);

    // handle bar
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.04, 0.04),
      this.materials.frame
    );
    handle.position.set(0, -0.34, -0.55);
    controlGroup.add(handle);

    // left throttle lever
    const throttle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 0.16),
      this.materials.accent
    );
    throttle.position.set(-0.68, -0.35, -0.3);
    controlGroup.add(throttle);

    this.group.add(controlGroup);
  }

  // mirror housing
  buildMirrorHousing() {
    const mirrorGroup = new THREE.Group();

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.24, 0.04),
      this.materials.frame
    );
    bezel.position.set(0, 0.44, -0.68);
    mirrorGroup.add(bezel);

    this.group.add(mirrorGroup);
  }

  update(time) {}
}