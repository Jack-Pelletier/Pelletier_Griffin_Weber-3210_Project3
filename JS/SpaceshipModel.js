// glsl vertex shader
const screenVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// glsl fragment shader
const screenFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // Procedural grid lines
    vec2 gridUv = fract(vUv * 10.0);
    float lineX = step(0.90, gridUv.x) + step(gridUv.x, 0.10);
    float lineY = step(0.90, gridUv.y) + step(gridUv.y, 0.10);
    float gridPattern = clamp(lineX + lineY, 0.0, 1.0);

    // Animated vertical scanlines
    float scanline = sin(vUv.y * 40.0 - uTime * 4.0) * 0.2 + 0.8;

    // Pulse wave
    float pulse = sin(uTime * 2.0 + vUv.x * 4.0) * 0.15 + 0.85;

    vec3 finalColor = uColor * (gridPattern * 0.7 + 0.3) * scanline * pulse;
    
    // Explicit Alpha Blending factor
    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

// creates the spaceship geometries and overall model
class SpaceshipModel {
  constructor() {
    this.group = new THREE.Group();

    // uniforms for shader dispalys
    this.shaderUniforms = {
      uTime: { value: 0 },
      uColorCyan: { value: new THREE.Color(0x00d5ff) },
      uColorOrange: { value: new THREE.Color(0xff9900) },
      uColorGreen: { value: new THREE.Color(0x00ff88) }
    };

    // custom alpha blending
    const createShaderMaterial = (colorUniform) => new THREE.ShaderMaterial({
      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader,
      uniforms: {
        uTime: this.shaderUniforms.uTime,
        uColor: colorUniform
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    // spaceship materials
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
      // glsl shader display materials
      screenCyanMat: createShaderMaterial(this.shaderUniforms.uColorCyan),
      screenOrangeMat: createShaderMaterial(this.shaderUniforms.uColorOrange),
      screenGreenMat: createShaderMaterial(this.shaderUniforms.uColorGreen),
      btnRed: new THREE.MeshBasicMaterial({ color: 0xff3344 }),
      btnBlue: new THREE.MeshBasicMaterial({ color: 0x0088ff }),
      conduitMat: new THREE.MeshStandardMaterial({ color: 0x556075, metalness: 0.8, roughness: 0.2 })
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

  // dashboard console & animated screens
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

    // left console wing
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.4, 0.5),
      this.materials.dashboard
    );
    leftWing.position.set(-0.8, -0.5, -0.8);
    leftWing.rotation.set(Math.PI * 0.15, Math.PI * 0.15, -Math.PI * 0.05);
    dashGroup.add(leftWing);

    // right console wing
    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.4, 0.5),
      this.materials.dashboard
    );
    rightWing.position.set(0.8, -0.5, -0.8);
    rightWing.rotation.set(Math.PI * 0.15, -Math.PI * 0.15, Math.PI * 0.05);
    dashGroup.add(rightWing);

    // aniamted screens!
    // center screen
    const mainScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.3),
      this.materials.screenCyanMat
    );
    mainScreen.position.set(0, -0.4, -0.75);
    mainScreen.rotation.x = Math.PI * 0.15;
    dashGroup.add(mainScreen);

    // left screen
    const leftScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.2),
      this.materials.screenOrangeMat
    );
    leftScreen.position.set(-0.75, -0.4, -0.75);
    leftScreen.rotation.set(Math.PI * 0.15, Math.PI * 0.15, -Math.PI * 0.05);
    dashGroup.add(leftScreen);

    // right screen
    const rightScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.2),
      this.materials.screenGreenMat
    );
    rightScreen.position.set(0.75, -0.4, -0.75);
    rightScreen.rotation.set(Math.PI * 0.15, -Math.PI * 0.15, Math.PI * 0.05);
    dashGroup.add(rightScreen);

    // switches and buttons - a lot of them
    const btnGeo = new THREE.BoxGeometry(0.035, 0.035, 0.035);
    for (let i = 0; i < 6; i++) {
      const btn = new THREE.Mesh(
        btnGeo,
        i % 2 === 0 ? this.materials.btnRed : this.materials.btnBlue
      );
      btn.position.set(-0.20 + i * 0.1, -0.30, -0.6);
      btn.rotation.x = Math.PI * 0.15;
      dashGroup.add(btn);
    }

    this.group.add(dashGroup);
  }

  // roof, walls, conduits & desk panels
  buildEnclosedWallsAndRoof() {
    const structureGroup = new THREE.Group();

    // overhead roof
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
    roofConsole.position.set(0, 0.7, -0.5);
    roofConsole.rotation.x = -Math.PI * 0.05;
    structureGroup.add(roofConsole);

    // overhead screen
    const roofDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.2),
      this.materials.screenCyanMat
    );
    roofDisplay.position.set(0, 0.6, -0.5);
    roofDisplay.rotation.x = Math.PI * 0.45;
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

    // conduit & wall details
    const conduitGeo = new THREE.BoxGeometry(0.05, 0.05, 1.5);
    const leftConduit = new THREE.Mesh(conduitGeo, this.materials.conduitMat);
    leftConduit.position.set(-0.9, 0.25, -0.2);
    structureGroup.add(leftConduit);

    const rightConduit = new THREE.Mesh(conduitGeo, this.materials.conduitMat);
    rightConduit.position.set(0.9, 0.25, -0.2);
    structureGroup.add(rightConduit);

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

    // throttles and keypad
    const throttleBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.05, 0.25),
      this.materials.accent
    );
    throttleBase.position.set(-0.8, -0.40, -0.25);
    structureGroup.add(throttleBase);

    // two throttle levers
    const lever1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05), this.materials.frame);
    lever1.position.set(-0.85, -0.4, -0.275);
    lever1.rotation.x = -Math.PI * 0.1;
    structureGroup.add(lever1);

    const lever2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05), this.materials.frame);
    lever2.position.set(-0.775, -0.4, -0.225);
    lever2.rotation.x = -Math.PI * 0.05;
    structureGroup.add(lever2);

    // right desk keypad
    const keypadBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.25), this.materials.accent);
    keypadBase.position.set(0.8, -0.4, -0.25);
    structureGroup.add(keypadBase);

    const keyGeo = new THREE.BoxGeometry(0.05, 0.02, 0.05);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const key = new THREE.Mesh(keyGeo, (row + col) % 2 === 0 ? this.materials.btnRed : this.materials.btnBlue);
        key.position.set(0.75 + col * 0.1, -0.375, -0.30 + row * 0.05);
        structureGroup.add(key);
      }
    }

    this.group.add(structureGroup);
  }

  // seat
  buildSeat() {
    const seatGroup = new THREE.Group();

    // seat cushion
    const seatBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.2, 0.5),
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
    leftPillar.rotation.set(Math.PI * 0.05, 0, -Math.PI * 0.1);
    frameGroup.add(leftPillar);

    // right pillar
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.5, 0.1),
      this.materials.frame
    );
    rightPillar.position.set(0.75, 0.1, -0.75);
    rightPillar.rotation.set(Math.PI * 0.05, 0, Math.PI * 0.1);
    frameGroup.add(rightPillar);

    this.group.add(frameGroup);
  }

  // flight controls - (depth perception makes this look a bit strange, numbers adjusted)
  buildFlightControls() {
    const controlGroup = new THREE.Group();

    // control base mount
    const mountBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.12),
      this.materials.frame
    );
    mountBase.position.set(0, -0.42, -0.45);
    controlGroup.add(mountBase);

    // flight shaft
    const shaft = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.3, 0.04),
      this.materials.accent
    );
    shaft.position.set(0, -0.26, -0.46);
    shaft.rotation.x = -Math.PI * 0.1;
    controlGroup.add(shaft);

    // handle bar
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.05, 0.05),
      this.materials.frame
    );
    handle.position.set(0, -0.1, -0.5);
    controlGroup.add(handle);

    this.group.add(controlGroup);
  }

  // updates time for animated glsl screens and their shaders
  update(time) {
    this.shaderUniforms.uTime.value = time;
  }
}