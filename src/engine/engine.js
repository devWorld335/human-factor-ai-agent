/* eslint-disable */
// Humanfator 3D engine: robot, face rig, voice, product modules and the shared WebGL renderer.
// Ported from the original compiled build; Three.js identifiers are mapped to npm `three` exports.
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationMixer,
  BackSide,
  Box2,
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CurvePath,
  CylinderGeometry,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Float32BufferAttribute,
  FrontSide,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineCurve3,
  LinearFilter,
  LinearMipmapLinearFilter,
  LoopRepeat,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PCFSoftShadowMap,
  PMREMGenerator,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  QuadraticBezierCurve3,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Shape,
  ShapeUtils,
  Sphere,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import modelUrl from "../assets/models/agent.glb?url";
import voiceHappy from "../assets/voice/Happy.mp3";
import voiceAngry from "../assets/voice/Angry.mp3";
import voiceShy from "../assets/voice/Shy.mp3";
import voiceLaugh from "../assets/voice/Laugh.mp3";
import voiceExcited from "../assets/voice/Excited.mp3";

import { stage } from "./stage";
function gr(s) {
  return new MeshLambertMaterial({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: s,
  });
}
var Rh = new Map();
function Ih(s, e, t) {
  if (Rh.has(s)) return Rh.get(s);
  let n = e.map((r) => {
      let a = new BufferGeometry();
      return a.setAttribute("position", new Float32BufferAttribute(r, 3)), a.setIndex(t), a.computeVertexNormals(), a;
    }),
    i = n[0];
  return (
    (i.morphAttributes.position = n.slice(1).map((r) => r.attributes.position)),
    (i.morphAttributes.normal = n.slice(1).map((r) => r.attributes.normal)),
    i.computeBoundingSphere(),
    (i.boundingSphere = new Sphere(new Vector3(), s.includes("mouth") ? 0.2 : 1)),
    Rh.set(s, i),
    i
  );
}
var Vf = [
  [0.09, 0.048, 0.011],
  [0.098, 0.064, 0.015],
  [0.083, -0.049, 0.009],
  [0.071, 0.041, 0.008],
  [0.106, 0.007, 0.09],
];
function Ch(s, e) {
  let [t, n, i] = e,
    r = Math.cos(s);
  return new Vector3(t * r, n * (r * r - 0.5) + i * Math.sin(s), 0);
}
function kc(s, e, t) {
  let n = new Group();
  n.position.set(0, -0.422, 1.187), s.add(n);
  let i = [],
    r = [];
  for (let h = 0; h < 64; h++)
    for (let u = 0; u < 8; u++) {
      let d = h * 9 + u,
        f = d + 9;
      i.push(d, f, d + 1, f, f + 1, d + 1);
    }
  for (let h of Vf) {
    let u = [];
    for (let d = 0; d <= 64; d++) {
      let f = (d / 64) * Math.PI * 2,
        m = Ch(f, h),
        b = Ch(f + 0.001, h)
          .sub(m)
          .normalize(),
        g = new Vector3(-b.y, b.x, 0);
      for (let p = 0; p <= 8; p++) {
        let y = (p / 8) * Math.PI * 2,
          v = 0.008;
        u.push(m.x + g.x * Math.cos(y) * v, m.y + g.y * Math.cos(y) * v, Math.sin(y) * v);
      }
    }
    r.push(u);
  }
  let a = new Mesh(Ih("mouth-rim", r, i), e),
    o = [],
    l = [];
  for (let h = 0; h < 64; h++) o.push(0, h + 1, h + 2);
  for (let h of Vf) {
    let u = [0, -h[1] * 0.3, -0.009];
    for (let d = 0; d <= 64; d++) {
      let f = Ch((d / 64) * Math.PI * 2, h);
      u.push(f.x, f.y, -0.004);
    }
    l.push(u);
  }
  let c = new Mesh(Ih("mouth-cavity", l, o), t);
  return (
    n.add(a, c),
    (a.name = "Mouth \u2022 smile / frown / shy / laugh"),
    (c.name = "Dimensional mouth cavity"),
    {
      group: n,
      meshes: [a, c],
    }
  );
}
function Bc(s, e, t) {
  return [!0, !1].map((n) => {
    let o = [];
    for (let h = 0; h < 48; h++)
      for (let u = 0; u < 12; u++) {
        let d = h * 13 + u,
          f = d + 12 + 1;
        n ? o.push(d, d + 1, f, f, d + 1, f + 1) : o.push(d, f, d + 1, f, f + 1, d + 1);
      }
    let l = [0, 1, 2, 3].map((h) => {
        let u = [];
        for (let d = 0; d <= 48; d++) {
          let f = ((d / 48) * 2 - 1) * 0.703,
            m = Math.sqrt(Math.max(0, 0.703 * 0.703 - f * f)),
            b = n ? [0.703, 0.22 + e * f * 0.43, 0.43, 0.18][h] : [-0.703, -0.67, -0.61, -0.19][h],
            g = Math.max(-m, Math.min(m, b));
          for (let p = 0; p <= 12; p++) {
            let y = g + (((n ? m : -m) - g) * p) / 12,
              v = 0.218 + Math.sqrt(Math.max(0, 0.76 * 0.76 - f * f - y * y)) * 0.31 - 0.009;
            u.push(f, y, v);
          }
        }
        return u;
      }),
      c = new Mesh(Ih(`lid-${n}-${e}`, l, o), t);
    return (c.name = `${n ? "Upper" : "Lower"} mechanical eyelid`), (c.visible = !1), s.add(c), c;
  });
}
function qf(s) {
  s.forEach((e, t) => {
    let n = t ? 1 : -1,
      i = new Group(),
      r = new Group();
    i.position.set(n * 0.233, -0.596, 0);
    for (let a of [...e.children]) a.position.y < -0.64 && (a.position.sub(i.position), i.add(a));
    r.position.set(n * 0.037, -0.564, 0.02);
    for (let a of [...i.children]) a.position.y < -0.57 && (a.position.sub(r.position), r.add(a));
    i.add(r), e.add(i), (e.userData.elbow = i), (e.userData.wrist = r);
  });
}
var Ph = new Euler(),
  Wf = new Quaternion(),
  Fc = new Quaternion();
function Ea(s, e, t, n, i) {
  Wf.setFromEuler(Ph.set(e, t, n)), s.quaternion.slerp(Wf, 1 - Math.exp(-i * 14));
}
function applyProceduralPose(s, e, t, n, i) {
  let r = s.model,
    a = r.userData,
    o = a.head || (a.mouth ? r : null);
  if ((n && (Fc.setFromEuler(Ph.set(n.pitch, n.yaw, 0, "YXZ")), r.quaternion.multiply(Fc)), !o)) return;
  let l = o.userData,
    c = e.active ? 0.38 : 1,
    h = t?.pupilX || 0,
    u = t?.pupilY || 0;
  l.pupils.forEach((d, f) => {
    (d.position.x = MathUtils.clamp(h * c + e.pupilX + (f ? -1 : 1) * e.inward, -0.16, 0.16)),
      (d.position.y = MathUtils.clamp(u * c + e.pupilY, -0.11, 0.11));
  }),
    l.irises.forEach((d) => {
      (d.position.x = (t?.irisX || 0) * c),
        (d.position.y = (t?.irisY || 0) * c),
        (d.material.emissiveIntensity = 1.1 + e.chest * 0.55 + e.smile * 0.035);
    }),
    l.mouth.meshes.forEach((d) => d.morphTargetInfluences.splice(0, 4, e.smile, e.frown, e.shy, e.laugh)),
    l.lids.flat().forEach((d) => {
      (d.visible = e.angryLid + e.shy + e.squint > 0.003),
        (d.morphTargetInfluences[0] = e.angryLid),
        (d.morphTargetInfluences[1] = e.shy * 0.36),
        (d.morphTargetInfluences[2] = e.squint);
    }),
    a.head
      ? (Ea(o, e.headPitch, e.headYaw, e.headRoll, i),
        (o.position.y += e.bounce),
        (o.position.x = e.sway || 0),
        (a.torso.position.y = e.bounce),
        (a.torso.rotation.z = e.bodyRoll),
        (a.torso.position.x = e.sway || 0),
        a.arms.forEach((d, f) => {
          let m = f ? 1 : -1;
          (d.position.y = -0.15 + e.bounce),
            (d.position.x += e.sway || 0),
            Ea(d, f ? -0.13 * Math.abs(e.rightArm) : -0.2 * e.leftElbow, 0, m * 0.12 + (f ? e.rightArm : e.leftArm), i),
            Ea(d.userData.elbow, f ? -0.15 * e.rightElbow : -0.38 * e.leftElbow, 0, f ? e.rightElbow : e.leftElbow, i),
            Ea(d.userData.wrist, 0, f ? e.rightWrist : e.leftWrist, (f ? 1 : -1) * (f ? e.rightWrist : e.leftWrist), i);
        }),
        a.legs.forEach((d, f) => Ea(d, f ? e.rightLeg || 0 : e.leftLeg || 0, 0, -e.bodyRoll * 0.4, i)),
        a.core.scale.setScalar(1 + e.hover * 0.018 + e.chest * 0.06 - e.press * 0.018),
        (a.core.position.z -= e.press * 0.018),
        (a.coreLight.material.emissiveIntensity = 1.12 + e.chest))
      : (Fc.setFromEuler(Ph.set(e.headPitch, e.headYaw, e.headRoll)), r.quaternion.multiply(Fc));
}
var Lh = new Map(),
  tn = (s, e) => (Lh.has(s) || Lh.set(s, e()), Lh.get(s));
function dn(s, e, t, n = 0, i = 0, r = 0) {
  let a = new Mesh(e, t);
  return a.position.set(n, i, r), s.add(a), a;
}
function _r(s, e, t, n = 0, i = 0, r = 0, a = 1, o = 1, l = 1) {
  let c = dn(
    s,
    tn(`s${e}`, () => new SphereGeometry(e, 64, 40)),
    t,
    n,
    i,
    r,
  );
  return c.scale.set(a, o, l), c;
}
function ft(s, e, t, n, i, r, a = 0, o = 0, l = 0) {
  let c = e > 2 && t > 2 && n > 1 ? 16 : 6;
  return dn(
    s,
    tn(`b${e},${t},${n},${i}`, () => new RoundedBoxGeometry(e, t, n, c, i)),
    r,
    a,
    o,
    l,
  );
}
function Nt(s, e, t, n, i = 0, r = 0, a = 0) {
  return dn(
    s,
    tn(`t${e},${t}`, () => new TorusGeometry(e, t, 16, 112)),
    n,
    i,
    r,
    a,
  );
}
function ti(s, e, t, n, i = 0, r = 0, a = 0) {
  let o = dn(
    s,
    tn(`c${e},${t}`, () => new CylinderGeometry(e, e, t, 96)),
    n,
    i,
    r,
    a,
  );
  return (o.rotation.x = Math.PI / 2), o;
}
function wa(s, e, t) {
  let n = -s / 2,
    i = -e / 2,
    r = new Shape();
  return (
    r.moveTo(n + t, i),
    r.lineTo(n + s - t, i),
    r.quadraticCurveTo(n + s, i, n + s, i + t),
    r.lineTo(n + s, i + e - t),
    r.quadraticCurveTo(n + s, i + e, n + s - t, i + e),
    r.lineTo(n + t, i + e),
    r.quadraticCurveTo(n, i + e, n, i + e - t),
    r.lineTo(n, i + t),
    r.quadraticCurveTo(n, i, n + t, i),
    r
  );
}
function xr(s, e, t, n, i, r, a, o, l) {
  let c = tn(`o${e},${t},${n},${i}`, () => {
    let h = wa(e, t, n);
    return (
      h.holes.push(new Path(wa(e - 2 * i, t - 2 * i, n - i).getPoints(96))),
      new ExtrudeGeometry(h, {
        depth: 0.008,
        bevelEnabled: !0,
        bevelSize: i * 0.24,
        bevelThickness: 0.003,
        bevelSegments: 3,
        curveSegments: 48,
      })
    );
  });
  return dn(s, c, r, a, o, l);
}
function Kf(s = !1) {
  let t = new Uint8Array(262144),
    n = 1427,
    i = () => ((n = (n * 16807) % 2147483647) - 1) / 2147483646;
  for (let a = 0; a < 256; a++) {
    let o = i() * (s ? 15 : 3);
    for (let l = 0; l < 256; l++) {
      let c = (a * 256 + l) * 4,
        h = 221 + o + i() * (s ? 8 : 22);
      (t[c] = t[c + 1] = t[c + 2] = h), (t[c + 3] = 255);
    }
  }
  if (s)
    for (let a = 0; a < 26; a++) {
      let o = Math.floor(i() * 256),
        l = Math.floor(i() * 256),
        c = 3 + Math.floor(i() * 30);
      for (let h = l; h < Math.min(256, l + c); h++) {
        let u = (o * 256 + h) * 4;
        t[u] = t[u + 1] = t[u + 2] = 174 + Math.floor(i() * 22);
      }
    }
  let r = new DataTexture(t, 256, 256);
  return (
    (r.wrapS = r.wrapT = RepeatWrapping),
    r.repeat.set(s ? 3 : 6, s ? 5 : 6),
    (r.magFilter = LinearFilter),
    (r.minFilter = LinearMipmapLinearFilter),
    (r.generateMipmaps = !0),
    (r.needsUpdate = !0),
    r
  );
}
var _s = Kf(),
  zc = Kf(!0);
function uv() {
  let e = new Uint8Array(65536);
  for (let n = 0; n < 128; n++)
    for (let i = 0; i < 128; i++) {
      let r = Math.min(i, n, 127 - i, 127 - n) / 128,
        a = Math.round(255 * (0.6 + 0.4 * (1 - Math.exp(-r * 38)))),
        o = (n * 128 + i) * 4;
      (e[o] = e[o + 1] = e[o + 2] = a), (e[o + 3] = 255);
    }
  let t = new DataTexture(e, 128, 128);
  return (t.minFilter = t.magFilter = LinearFilter), (t.needsUpdate = !0), t;
}
var LE = uv(),
  $t = (s) => {
    let e = new MeshPhysicalMaterial(s);
    return (e.userData.premium = !0), e;
  },
  MATERIALS = {
    ceramic: $t({
      color: "#e5e3de",
      roughness: 0.43,
      roughnessMap: _s,
      bumpMap: _s,
      bumpScale: 0.0017,
      metalness: 0.035,
      clearcoat: 0.22,
      clearcoatRoughness: 0.3,
    }),
    porcelain: $t({
      color: "#efede8",
      roughness: 0.36,
      roughnessMap: _s,
      bumpMap: _s,
      bumpScale: 0.0012,
      metalness: 0.025,
      clearcoat: 0.3,
      clearcoatRoughness: 0.24,
    }),
    graphite: $t({
      color: "#131619",
      metalness: 0.65,
      roughness: 0.37,
      roughnessMap: zc,
    }),
    alloy: $t({
      color: "#9faaa9",
      metalness: 0.92,
      roughness: 0.31,
      roughnessMap: zc,
      bumpMap: zc,
      bumpScale: 0.0011,
    }),
    orange: $t({
      color: "#ee751d",
      emissive: "#ff6b15",
      emissiveIntensity: 0.38,
      metalness: 0.18,
      roughness: 0.3,
      clearcoat: 0.2,
    }),
  },
  { ceramic: jf, porcelain: Dh, graphite: qt, alloy: en, orange: Ta } = MATERIALS,
  un = $t({
    color: "#0b0d0e",
    roughness: 0.7,
    metalness: 0.04,
  }),
  dv = $t({
    color: "#020406",
    metalness: 0.08,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.045,
    ior: 1.48,
  }),
  Jf = $t({
    color: "#fffaf3",
    roughness: 0.038,
    metalness: 0,
    transmission: 0.94,
    thickness: 0.06,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.055,
    attenuationColor: "#fff3df",
    attenuationDistance: 2,
    transparent: !0,
    opacity: 0.14,
    depthWrite: !1,
  });
function fv() {
  let s = document.createElement("canvas");
  s.width = s.height = 1024;
  let e = s.getContext("2d"),
    t = e.createRadialGradient(512, 512, 160, 512, 512, 507);
  t.addColorStop(0, "#4a1d04"),
    t.addColorStop(0.28, "#ffb64b"),
    t.addColorStop(0.64, "#f57612"),
    t.addColorStop(0.88, "#ad3806"),
    t.addColorStop(1, "#201004"),
    (e.fillStyle = t),
    e.fillRect(0, 0, 1024, 1024);
  for (let i = 6; i < 1024; i += 20)
    for (let r = 6; r < 1024; r += 20) {
      let a = Math.hypot(r - 512, i - 512) / 512;
      a < 0.98 &&
        a > 0.27 &&
        ((e.fillStyle = "#35170380"),
        e.fillRect(r, i, 16, 16),
        (e.fillStyle = `rgba(255,184,67,${0.26 + 0.29 * (1 - a)})`),
        e.fillRect(r + 2, i + 2, 11, 11),
        (e.fillStyle = "#ffd68a35"),
        e.fillRect(r + 2, i + 2, 10, 1));
    }
  (e.lineWidth = 1.2), (e.strokeStyle = "#ffd17d35");
  for (let i of [192, 271, 350, 435, 485]) e.beginPath(), e.arc(512, 512, i, 0, Math.PI * 2), e.stroke();
  let n = new CanvasTexture(s);
  return (n.colorSpace = SRGBColorSpace), (n.anisotropy = 4), n;
}
var Yf = fv(),
  pv = $t({
    color: "#1a0d05",
    toneMapped: !1,
    map: Yf,
    emissiveMap: Yf,
    emissive: "#ffffff",
    emissiveIntensity: 1.1,
    metalness: 0.05,
    roughness: 0.66,
    clearcoat: 0,
  });
function zi(s, e, t = 0.024, n = en) {
  let i = tn(`screw${t}`, () => new CylinderGeometry(t, t, 0.016, 16)),
    r = new InstancedMesh(i, n, e.length),
    a = new InstancedMesh(
      tn(`slot${t}`, () => new BoxGeometry(t * 1.13, t * 0.19, 0.004)),
      un,
      e.length,
    ),
    o = new Object3D();
  e.forEach(([l, c, h], u) => {
    o.position.set(l, c, h),
      o.rotation.set(Math.PI / 2, 0, 0),
      o.updateMatrix(),
      r.setMatrixAt(u, o.matrix),
      (o.position.z += 0.01),
      o.rotation.set(0, 0, u * 0.71),
      o.updateMatrix(),
      a.setMatrixAt(u, o.matrix);
  }),
    s.add(r, a);
}
function createProceduralHead() {
  let s = new Group(),
    e = new Group(),
    t = new Group();
  s.add(e, t), _r(e, 1, jf, 0, 0.02, 0, 1.96, 1.32, 1.16), xr(t, 3.48, 1.93, 0.84, 0.027, un, 0, -0.02, 0.997);
  let n = tn("apertured-face", () => {
    let h = wa(3.43, 1.88, 0.82);
    for (let u of [-1, 1]) {
      let d = new Path();
      d.absarc(u * 0.91, 0.065, 0.796, 0, Math.PI * 2, !0), h.holes.push(d);
    }
    return new ExtrudeGeometry(h, {
      depth: 0.068,
      bevelEnabled: !0,
      bevelSegments: 6,
      bevelSize: 0.026,
      bevelThickness: 0.026,
      curveSegments: 64,
    });
  });
  dn(t, n, Dh, 0, -0.02, 0.981), xr(t, 3.46, 1.91, 0.83, 0.014, Ta, 0, -0.015, 1.072);
  let i = [],
    r = [],
    a = [],
    o = [];
  for (let h of [-1, 1]) {
    let u = new Group();
    u.position.set(h * 0.91, 0.045, 1.105),
      t.add(u),
      ti(u, 0.813, 0.11, qt),
      Nt(u, 0.806, 0.024, en, 0, 0, 0.073),
      Nt(u, 0.774, 0.02, un, 0, 0, 0.072),
      Nt(u, 0.755, 0.012, Ta, 0, 0, 0.091),
      Nt(u, 0.732, 0.016, en, 0, 0, 0.068),
      ti(u, 0.717, 0.03, un, 0, 0, 0.05);
    let d = new Group();
    (d.position.z = 0.14), u.add(d), i.push(d);
    let f = dn(
      d,
      tn("iris-disc", () => new CircleGeometry(0.677, 128)),
      pv.clone(),
    );
    a.push(f), Nt(d, 0.686, 0.009, qt, 0, 0, 0.003);
    let m = new Group();
    d.add(m), r.push(m), Nt(m, 0.379, 0.009, un, 0, 0, 0.014), _r(m, 0.379, dv, 0, 0, 0.022, 1, 1, 0.28);
    let b = tn("curved-eye-glass", () => {
        let v = new SphereGeometry(0.76, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2);
        return v.rotateX(Math.PI / 2), v.scale(1, 1, 0.31), v;
      }),
      g = dn(u, b, Jf, 0, 0, 0.218);
    g.renderOrder = 2;
    let p = dn(
      u,
      tn("lens-highlight", () => new TorusGeometry(0.54, 0.011, 8, 48, 0.73)),
      new MeshBasicMaterial({
        color: "#fff1d7",
        transparent: !0,
        opacity: 0.3,
        depthWrite: !1,
      }),
      0,
      0,
      0.389,
    );
    (p.rotation.z = 0.76), (p.renderOrder = 3);
    let y = qt.clone();
    (y.side = DoubleSide),
      o.push(Bc(u, h, y)),
      zi(
        u,
        [
          [-0.57, 0.57, 0.077],
          [0.57, -0.57, 0.077],
        ],
        0.014,
      );
  }
  let l = kc(
    t,
    $t({
      color: "#503322",
      roughness: 0.44,
      metalness: 0.12,
    }),
    $t({
      color: "#080605",
      roughness: 0.8,
      side: DoubleSide,
    }),
  );
  for (let h of [-1, 1]) {
    let u = new Group();
    u.position.set(h * 1.86, -0.045, -0.05),
      (u.rotation.y = (h * Math.PI) / 2),
      e.add(u),
      ti(u, 0.387, 0.105, Dh),
      Nt(u, 0.329, 0.015, qt, 0, 0, 0.056),
      Nt(u, 0.292, 0.012, en, 0, 0, 0.063),
      Nt(u, 0.279, 0.011, Ta, 0, 0, 0.065),
      ti(u, 0.245, 0.012, jf, 0, 0, 0.065),
      ti(u, 0.132, 0.018, qt, 0, 0, 0.079),
      Nt(u, 0.107, 0.005, en, 0, 0, 0.091),
      zi(
        u,
        [
          [0, 0.21, 0.084],
          [0, -0.21, 0.084],
        ],
        0.015,
      );
  }
  for (let h = 0; h < 3; h++) ft(e, 0.036, 0.055, 0.007, 0.008, en, -0.066 + h * 0.066, 0.955, 0.756);
  return (
    Nt(e, 1, 0.0035, qt, 0, 0.02, -0.37).scale.set(1.846, 1.243, 1),
    (s.userData = {
      shell: e,
      face: t,
      optics: i,
      pupils: r,
      irises: a,
      lids: o,
      mouth: l,
    }),
    s
  );
}
function Zf({ torso: s, arms: e, legs: t, core: n }) {
  for (let a of [0.21, 0.265, 0.32, 0.375]) Nt(s, 0.277, 0.005, qt, 0, a, 0).rotation.x = Math.PI / 2;
  Nt(n, 0.282, 0.013, un, 0, 0, -0.016), Nt(n, 0.25, 0.009, en, 0, 0, 0.026);
  let i = _r(n, 0.218, Jf, 0, 0, 0.057, 1, 1, 0.31);
  i.renderOrder = 2;
  let r = [];
  for (let a = 0; a < 6; a++) {
    let o = (a * Math.PI) / 3;
    r.push([Math.cos(o) * 0.27, Math.sin(o) * 0.27, 0.017]);
  }
  zi(n, r, 0.012),
    zi(
      s,
      [
        [-0.39, -0.84, 0.472],
        [0.39, -0.84, 0.472],
        [-0.28, -0.04, 0.415],
        [0.28, -0.04, 0.415],
      ],
      0.017,
    );
  for (let a = 0; a < 5; a++) ft(s, 0.037, 0.13, 0.012, 0.005, qt, (a - 2) * 0.068, -0.48, -0.574);
  e.forEach((a, o) => {
    let l = o ? 1 : -1,
      c = l * 0.27;
    Nt(a, 0.174, 0.008, en, l * 0.065, 0.005, 0.227),
      ti(a, 0.061, 0.018, qt, l * 0.065, 0.005, 0.244),
      zi(
        a,
        [
          [l * 0.065, 0.005, 0.256],
          [l * 0.233, -0.596, 0.143],
        ],
        0.021,
      ),
      Nt(a, 0.112, 0.009, qt, l * 0.233, -0.596, 0.105),
      ti(a, 0.083, 0.017, en, l * 0.233, -0.596, 0.122);
    for (let h of [-1.097, -1.131, -1.158]) Nt(a, 0.123, 0.007, en, c, h, 0.015).rotation.x = Math.PI / 2;
    for (let h = 0; h < 3; h++) {
      let u = c + (h - 1) * 0.072;
      _r(a, 0.036, qt, u, -1.29, 0.081),
        ft(a, 0.059, 0.074, 0.074, 0.022, en, u, -1.337, 0.083),
        ti(a, 0.022, 0.06, qt, u, -1.377, 0.087),
        ft(a, 0.058, 0.073, 0.076, 0.026, Dh, u, -1.416, 0.105),
        ft(a, 0.034, 0.039, 0.013, 0.01, un, u, -1.42, 0.15);
    }
    _r(a, 0.043, en, l * 0.395, -1.23, 0.075);
  }),
    t.forEach((a) => {
      ti(a, 0.13, 0.027, qt, 0, 0, 0.145),
        Nt(a, 0.111, 0.009, en, 0, 0, 0.16),
        zi(
          a,
          [
            [0, 0, 0.167],
            [0, -0.43, 0.15],
          ],
          0.019,
        );
      for (let o of [-0.1, -0.14]) Nt(a, 0.087, 0.005, qt, 0, o, 0.035).rotation.x = Math.PI / 2;
      ft(a, 0.289, 0.038, 0.029, 0.012, qt, 0, -0.624, 0.427), ft(a, 0.21, 0.012, 0.009, 0.004, Ta, 0, -0.621, 0.445);
      for (let o of [-0.083, 0, 0.083]) ft(a, 0.012, 0.009, 0.21, 0.003, qt, o, -0.497, 0.24);
      for (let o = 0; o < 4; o++) ft(a, 0.29, 0.011, 0.024, 0.004, en, 0, -0.772, -0.019 + o * 0.098);
    });
}
var mv = $t({
    name: "Module satin white ceramic",
    color: "#edece7",
    metalness: 0,
    roughness: 0.29,
    roughnessMap: _s,
    bumpMap: _s,
    bumpScale: 7e-4,
    clearcoat: 0.42,
    clearcoatRoughness: 0.17,
  }),
  gv = $t({
    name: "Module polished ceramic bezel",
    color: "#f7f5ed",
    metalness: 0,
    roughness: 0.24,
    roughnessMap: _s,
    clearcoat: 0.58,
    clearcoatRoughness: 0.12,
  }),
  Qf = $t({
    name: "Module polished champagne gold",
    color: "#dab879",
    metalness: 1,
    roughness: 0.17,
    roughnessMap: zc,
    clearcoat: 0.2,
    clearcoatRoughness: 0.07,
  }),
  bv = $t({
    name: "Module sapphire cover glass",
    color: "#e5edfa",
    metalness: 0,
    roughness: 0.045,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.035,
    transparent: !0,
    opacity: 0.12,
    depthWrite: !1,
  });
function Sa(s, e, t, n = 0.027, i = 1.094) {
  let r = new CurvePath();
  for (let o = 1; o < e.length; o++) r.add(new LineCurve3(new Vector3(...e[o - 1], i), new Vector3(...e[o], i)));
  let a = dn(s, new TubeGeometry(r, e.length * 12, n, 12, !1), t);
  for (let o of [e[0], e[e.length - 1]]) _r(s, n, t, o[0], o[1], i);
  return a;
}
function xv() {
  return tn("raised-signal", () => {
    let s = document.createElement("canvas");
    s.width = s.height = 512;
    let e = s.getContext("2d");
    (e.font = "bold 96px Arial"), (e.fillStyle = "#fff"), e.fillText("SIGNAL", 51, 171);
    let t = e.getImageData(0, 0, 512, 512).data,
      n = new Map(),
      i = (l, c) => l >= 0 && c >= 0 && l < 512 && c < 512 && t[(c * 512 + l) * 4 + 3] > 127,
      r = (l, c, h, u) => {
        let d = `${l},${c}`;
        n.has(d) || n.set(d, []), n.get(d).push([h, u]);
      };
    for (let l = 70; l < 180; l++)
      for (let c = 40; c < 480; c++)
        i(c, l) &&
          (i(c, l - 1) || r(c, l, c + 1, l),
          i(c + 1, l) || r(c + 1, l, c + 1, l + 1),
          i(c, l + 1) || r(c + 1, l + 1, c, l + 1),
          i(c - 1, l) || r(c, l + 1, c, l));
    let a = [];
    for (; n.size; ) {
      let l = n.keys().next().value,
        c = [],
        h = l;
      do {
        let [d, f] = h.split(",").map(Number);
        c.push(new Vector2((d / 512 - 0.5) * 1.85, (0.5 - f / 512) * 2.04));
        let m = n.get(h);
        if (!m) break;
        let b = m.pop();
        m.length || n.delete(h), (h = b.join(","));
      } while (h !== l);
      let u = c.filter((d, f) => {
        let m = c[(f + c.length - 1) % c.length],
          b = c[(f + 1) % c.length];
        return Math.abs((d.x - m.x) * (b.y - d.y) - (d.y - m.y) * (b.x - d.x)) > 1e-8;
      });
      u.length > 2 && a.push(u);
    }
    let o = a.filter((l) => ShapeUtils.isClockWise(l)).map((l) => new Shape(l));
    for (let l of a.filter((c) => !ShapeUtils.isClockWise(c))) {
      let c = l[0];
      o.find((u) => new Box2().setFromPoints(u.getPoints()).containsPoint(c))?.holes.push(new Path(l));
    }
    return new ExtrudeGeometry(o, {
      depth: 0.018,
      bevelEnabled: !0,
      bevelSize: 0.0015,
      bevelThickness: 0.003,
      bevelSegments: 3,
      curveSegments: 12,
    });
  });
}
var ep = ([s, e]) => [(s / 512 - 0.5) * 1.85, (0.5 - e / 512) * 2.04];
function br(s, e, t = Qf, n = 0.031, i = 1.094) {
  return Sa(s, e.map(ep), t, n, i);
}
function _v(s, e, t, n, i, r, a) {
  let o = tn(
      `emblem-tile-${n}-${i}-${r}`,
      () =>
        new ExtrudeGeometry(wa((n * 1.85) / 512, (i * 2.04) / 512, (r * 1.85) / 512), {
          depth: 0.016,
          bevelEnabled: !0,
          bevelSize: 0.004,
          bevelThickness: 0.004,
          bevelSegments: 3,
          curveSegments: 16,
        }),
    ),
    [l, c] = ep([e, t]);
  return dn(s, o, a, l, c, 1.084);
}
function vv(s, e, t, n) {
  if (e === "market") {
    for (let i = 0; i < 5; i++)
      br(
        s,
        [
          [70, 110 + i * 70],
          [450, 110 + i * 70],
        ],
        t,
        0.0105,
        1.083,
      );
    br(
      s,
      [
        [70, 371],
        [143, 299],
        [215, 333],
        [300, 188],
        [361, 225],
        [438, 106],
      ],
      t,
      0.029,
      1.106,
    );
  } else if (e === "shield") {
    let i = new Path();
    i.moveTo(256, 70),
      i.lineTo(412, 129),
      i.lineTo(395, 291),
      i.quadraticCurveTo(375, 370, 256, 440),
      i.quadraticCurveTo(137, 370, 117, 291),
      i.lineTo(100, 129),
      i.closePath(),
      br(
        s,
        i.getPoints(24).map((r) => [r.x, r.y]),
        t,
      ),
      br(
        s,
        [
          [174, 252],
          [234, 312],
          [337, 187],
        ],
        t,
      );
  } else if (e === "compute")
    for (let i = 0; i < 3; i++)
      for (let r = 0; r < 3; r++) _v(s, 147 + r * 110, 132 + i * 110, 74, 74, 12, (r + i) % 3 === 0 ? t : n);
  else if (e === "launch")
    br(
      s,
      [
        [130, 378],
        [365, 143],
      ],
      t,
    ),
      br(
        s,
        [
          [206, 143],
          [365, 143],
          [365, 304],
        ],
        t,
      );
  else if (e === "canvas") {
    for (let r = 0; r < 8; r++) {
      let a = (r * Math.PI) / 4,
        o = new Group();
      s.add(o), o.scale.set(1.85 / 512, 2.04 / 512, 1);
      let l = tn(
          "design-emblem-ray",
          () =>
            new ExtrudeGeometry(wa(32, 132, 15), {
              depth: 0.016,
              bevelEnabled: !1,
              curveSegments: 16,
            }),
        ),
        c = dn(o, l, t, -Math.sin(a) * 114, -Math.cos(a) * 114, 1.084);
      c.rotation.z = -a;
    }
    let i = ti(s, (34 * 1.85) / 512, 0.02, t, 0, 0, 1.096);
    i.scale.z = 2.04 / 1.85;
  }
}
function createModule(s, e = {}) {
  let t = new Group(),
    { shell: n = mv, face: i = gv, gold: r = Qf, glass: a = bv } = e,
    o = r,
    l = r,
    c = r;
  ft(t, 2.42, 2.67, 1.56, 0.26, n),
    ft(t, 2.35, 2.6, 0.05, 0.24, un, 0, 0, 0.77),
    ft(t, 2.39, 2.65, 0.13, 0.12, i, 0, 0, 0.83),
    xr(t, 2.365, 2.625, 0.12, 0.023, r, 0, 0, 0.904),
    ft(t, 2.26, 2.51, 0.05, 0.1, r, 0, 0, 0.919),
    ft(t, 2.18, 2.39, 0.16, 0.09, i, 0, 0, 0.94),
    xr(t, 2.13, 2.34, 0.09, 0.013, o, 0, 0, 1.024),
    ft(t, 1.98, 2.18, 0.07, 0.065, i, 0, 0, 1.037),
    ft(t, 2.14, 2.36, 0.05, 0.17, un, 0, 0, -0.784),
    ft(t, 2.04, 2.26, 0.045, 0.13, n, 0, 0, -0.815);
  let h = new Group();
  (h.rotation.y = Math.PI), (h.position.z = -0.85), t.add(h);
  for (let d = 0; d < 8; d++) ft(h, 1.15, 0.029, 0.008, 0.01, un, 0, -0.36 + d * 0.1, 0.011);
  xr(h, 0.49, 0.15, 0.035, 0.017, l, 0, -0.82, 0.015),
    zi(
      h,
      [
        [-0.91, 1, 0.017],
        [0.91, 1, 0.017],
        [-0.91, -1, 0.017],
        [0.91, -1, 0.017],
      ],
      0.025,
      l,
    );
  for (let d of [-1, 1]) {
    let f = new Group();
    (f.position.x = d * 1.196), (f.rotation.y = (d * Math.PI) / 2), t.add(f);
    for (let m = 0; m < 3; m++) ft(f, 0.033, 1.74, 0.017, 0.009, un, -0.37 + m * 0.24, 0, 0);
    ft(f, 0.071, 0.31, 0.026, 0.018, l, 0.49, -0.57, 0.005), ft(f, 0.012, 1.65, 0.006, 0.003, r, 0.32, 0, 0.015);
  }
  for (let d = 0; d < 4; d++)
    ft(t, 0.27, 0.047, 0.3, 0.017, l, -0.45 + d * 0.32, 1.349, 0.23),
      ft(t, 0.25, 0.027, 0.015, 0.006, un, -0.45 + d * 0.32, 1.334, 0.397),
      ft(t, 0.265, 0.045, 0.027, 0.01, l, -0.86, -0.52 - d * 0.15, 1.096);
  if (
    (zi(
      t,
      [
        [-1.035, 1.135, 1.037],
        [1.035, 1.135, 1.037],
        [-1.035, -1.135, 1.037],
        [1.035, -1.135, 1.037],
      ],
      0.023,
      l,
    ),
    xr(t, 0.49, 0.137, 0.05, 0.026, r, 0.58, -0.99, 1.115),
    ft(t, 0.38, 0.037, 0.016, 0.01, un, 0.58, -0.99, 1.123),
    ft(t, 0.28, 0.009, 0.004, 0.002, Ta, 0.58, -0.99, 1.134),
    s === "signal")
  )
    dn(t, xv(), c, 0, 0, 1.084),
      [234, 287, 340, 393].forEach((d, f) =>
        Sa(
          t,
          [
            [(75 / 512 - 0.5) * 1.85, (0.5 - d / 512) * 2.04],
            [((435 - (f % 2) * 70) / 512 - 0.5) * 1.85, (0.5 - d / 512) * 2.04],
          ],
          f ? l : c,
          0.031,
        ),
      );
  else if (s === "code" || s === "developer") {
    let d = (f) => f.map(([m, b]) => [(m / 512 - 0.5) * 1.85, (0.5 - b / 512) * 2.04]);
    Sa(
      t,
      d([
        [188, 158],
        [108, 248],
        [188, 334],
      ]),
      c,
      0.031,
    ),
      Sa(
        t,
        d([
          [324, 158],
          [404, 248],
          [324, 334],
        ]),
        c,
        0.031,
      ),
      Sa(
        t,
        d([
          [288, 125],
          [226, 372],
        ]),
        c,
        0.031,
      );
  }
  ["signal", "code", "developer"].includes(s) || vv(t, s, r, i);
  let u = ft(t, 1.94, 2.14, 0.016, 0.06, a, 0, 0, 1.147);
  return (
    (u.name = `${s} protective optical window`),
    (u.castShadow = u.receiveShadow = !1),
    t.traverse((d) => {
      d.isMesh &&
        d.geometry.attributes.uv &&
        !d.geometry.attributes.uv1 &&
        d.geometry.setAttribute("uv1", d.geometry.attributes.uv.clone());
    }),
    (t.userData.premiumModule = !0),
    t
  );
}
var pt = (s, e, t) => Math.max(e, Math.min(t, s)),
  yv = (s) => ((s = pt(s, 0, 1)), s * s * (3 - 2 * s)),
  Mn = class {
    constructor(e = 5) {
      (this.value = 0), (this.velocity = 0), (this.frequency = e);
    }
    step(e, t) {
      let n = this.frequency * 2 * Math.PI,
        i = this.value - e,
        r = this.velocity + n * i,
        a = Math.exp(-n * Math.max(0, t));
      return (this.value = e + (i + r * t) * a), (this.velocity = (this.velocity - n * r * t) * a), this.value;
    }
  },
  Hc = class {
    constructor() {
      (this.target = {
        x: 0,
        y: 0,
      }),
        (this.eyes = {
          x: new Mn(3.2),
          y: new Mn(3.2),
        }),
        (this.head = {
          x: new Mn(1.25),
          y: new Mn(1.25),
        });
    }
    aim(e, t) {
      let n = Math.max(1, Math.hypot(e, t));
      (this.target.x = e / n), (this.target.y = t / n);
    }
    neutral() {
      this.aim(0, 0);
    }
    step(e) {
      let t = this.eyes.x.step(this.target.x, e),
        n = this.eyes.y.step(this.target.y, e),
        i = Math.max(1, Math.hypot(t, n));
      return {
        pupilX: (t / i) * 0.125,
        pupilY: (n / i) * 0.09,
        irisX: (t / i) * 0.018,
        irisY: (n / i) * 0.012,
        yaw: this.head.x.step(this.target.x, e) * 0.052,
        pitch: -this.head.y.step(this.target.y, e) * 0.026,
      };
    }
  },
  Gc = class {
    constructor({ idleSpeed: e = 0.075 } = {}) {
      (this.yaw = -0.32 + Math.sin(1.7 * 0.32) * 0.2),
        (this.pitch = 0.08),
        (this.vx = this.vy = 0),
        (this.dragging = !1),
        (this.lastMove = 0),
        (this.lastInteraction = -1 / 0),
        (this.idleSpeed = e === 0 ? 0 : pt(e, 0.05, 0.12)),
        (this.idleBlend = 1),
        (this.idleElapsed = 0),
        (this.idlePitch = 0),
        (this.displayYaw = new Mn(7)),
        (this.displayPitch = new Mn(7)),
        (this.displayYaw.value = this.yaw),
        (this.displayPitch.value = this.pitch);
    }
    suspend(e) {
      (this.pitch = pt(this.pitch + this.idlePitch, -0.42, 0.42)),
        (this.idlePitch = 0),
        (this.idleElapsed = 0),
        (this.idleBlend = 0),
        (this.lastInteraction = e);
    }
    begin(e) {
      this.suspend(e), (this.dragging = !0), (this.vx = this.vy = 0), (this.lastMove = e);
    }
    drag(e, t, n, i) {
      let r = e * 0.009,
        a = t * 0.004;
      (this.yaw += r), (this.pitch = pt(this.pitch + a, -0.42, 0.42));
      let o = pt(n, 1 / 240, 0.06),
        l = 1 - Math.exp(-o * 24);
      (this.vy += (pt(r / o, -7, 7) - this.vy) * l),
        (this.vx += (pt(a / o, -2, 2) - this.vx) * l),
        (this.lastMove = this.lastInteraction = i);
    }
    end(e, t = !1) {
      (this.dragging = !1), (this.lastInteraction = e), (t || e - this.lastMove > 0.12) && (this.vx = this.vy = 0);
    }
    reset(e) {
      this.suspend(e), (this.yaw = -0.32 + Math.sin(1.7 * 0.32) * 0.2), (this.pitch = 0.08), (this.vx = this.vy = 0);
    }
    step(e, t, n = !1, i = !1) {
      if (((e = pt(e, 0, 0.1)), !this.dragging && !n)) {
        let r = Math.exp(-5.3 * e),
          a = (1 - r) / 5.3;
        i || ((this.yaw += this.vy * a), (this.pitch = pt(this.pitch + this.vx * a, -0.42, 0.42))),
          (this.vx *= i ? 0 : r),
          (this.vy *= i ? 0 : r),
          (Math.abs(this.vx) < 1e-5 || Math.abs(this.pitch) === 0.42) && (this.vx = 0),
          Math.abs(this.vy) < 1e-5 && (this.vy = 0);
        let o = t - this.lastInteraction;
        (this.idleBlend = i ? 0 : o === 1 / 0 ? 1 : yv((o - 2.2) / 1.6)),
          this.idleBlend > 0 &&
            ((this.yaw += this.idleSpeed * this.idleBlend * e),
            (this.idleElapsed += this.idleBlend * e),
            (this.idlePitch = this.idleSpeed ? Math.sin(this.idleElapsed * 0.22) * 0.012 * this.idleBlend : 0));
      }
      return (
        (n || i) &&
          this.idlePitch &&
          ((this.pitch = pt(this.pitch + this.idlePitch, -0.42, 0.42)),
          (this.idlePitch = 0),
          (this.idleElapsed = 0),
          (this.idleBlend = 0)),
        {
          yaw: this.displayYaw.step(this.yaw, e),
          pitch: pt(this.displayPitch.step(this.pitch + this.idlePitch, e), -0.42, 0.42),
          y: Math.sin(1.7 * 0.85) * 0.025,
          z: 0,
          roll: -0.035,
        }
      );
    }
  };
var np = ["Happy", "Angry", "Shy", "Laugh", "Excited"],
  ip = (s, e, t) => {
    let n = pt((t - s) / (e - s), 0, 1);
    return n * n * (3 - 2 * n);
  },
  sp = (s, e, t) => ip(e, e + 0.32, s) * (1 - ip(t - 0.45, t, s)),
  Oh = [
    "smile",
    "frown",
    "shy",
    "laugh",
    "squint",
    "angryLid",
    "pupilX",
    "pupilY",
    "inward",
    "headPitch",
    "headYaw",
    "headRoll",
    "bounce",
    "bodyRoll",
    "sway",
    "leftLeg",
    "rightLeg",
    "leftArm",
    "rightArm",
    "leftElbow",
    "rightElbow",
    "leftWrist",
    "rightWrist",
    "chest",
    "press",
  ],
  ExpressionController = class {
    constructor() {
      (this.index = 0),
        (this.hasInteracted = !1),
        (this.age = 10),
        (this.greeting = !1),
        (this.duration = 3.2),
        (this.hover = 0),
        (this.hoverAge = 0),
        (this.springs = Object.fromEntries(Oh.map((e) => [e, new Mn(e === "laugh" ? 9 : e === "press" ? 5 : 3)]))),
        (this.springs.smile.value = 0.25);
    }
    get expression() {
      return np[this.index];
    }
    activate() {
      return (
        (this.greeting = !this.hasInteracted),
        (this.index = this.hasInteracted ? (this.index + 1) % np.length : 0),
        (this.hasInteracted = !0),
        (this.age = 0),
        (this.duration = [3.2, 2.8, 2.7, 3.95, 4.35][this.index]),
        this.expression
      );
    }
    finish() {
      this.age = this.duration;
    }
    step(e, { hovered: t = !1, pressed: n = !1, reduced: i = !1, frozen: r = !1, playback: a = null } = {}) {
      (e = pt(e, 0, 0.1)),
        a ? ((this.age = a.elapsed), (this.duration = a.duration)) : (!r || this.hasInteracted) && (this.age += e),
        (this.hoverAge = t ? this.hoverAge + e : 0),
        (this.hover += ((t ? 1 : 0) - this.hover) * (1 - Math.exp(-e * 9)));
      let o = this.age,
        l = this.hasInteracted && o < this.duration,
        c = !i && l ? sp(o, 0, this.duration) : 0,
        h = Object.fromEntries(Oh.map((m) => [m, 0]));
      if (((h.smile = 0.25), this.index === 0))
        (h.smile = this.hasInteracted ? 0.45 : 0.25),
          (h.headRoll = this.hasInteracted ? -0.018 : 0),
          (h.bounce = 0.026 * Math.sin(o * 6.5) * c);
      else if (this.index === 1)
        (h.smile = 0),
          (h.frown = 0.92),
          (h.angryLid = 0.84),
          (h.inward = 0.034),
          (h.headPitch = 0.032),
          (h.leftArm = -0.12),
          (h.rightArm = 0.12),
          (h.bodyRoll = Math.sin(o * 16) * 0.012 * c),
          (h.chest = 0.18 * c);
      else if (this.index === 2)
        (h.smile = 0),
          (h.shy = 0.82),
          (h.squint = 0.15),
          (h.pupilX = 0.034),
          (h.pupilY = -0.04),
          (h.headPitch = 0.058),
          (h.headYaw = -0.025),
          (h.headRoll = 0.032),
          (h.leftArm = 0.13),
          (h.rightArm = -0.13),
          (h.leftElbow = 0.35),
          (h.rightElbow = -0.35),
          (h.bodyRoll = Math.sin(o * 3.1) * 0.01 * c);
      else if (this.index === 3)
        (h.smile = 0),
          (h.laugh = 0.54),
          (h.squint = 0.46),
          (h.headPitch = -0.035),
          (h.headRoll = -0.025),
          (h.leftArm = 0.08),
          (h.leftElbow = 0.62);
      else {
        h.smile = 0.78;
        let m = (a?.beat ?? Math.max(0, o - 0.06) * 2) * Math.PI;
        (h.sway = Math.sin(m) * 0.042 * c),
          (h.bodyRoll = Math.sin(m) * 0.048 * c),
          (h.headRoll = -Math.sin(m) * 0.032 * c),
          (h.headPitch = -0.022 * c),
          (h.bounce = (1 - Math.cos(m * 2)) * 0.024 * c),
          (h.leftLeg = Math.max(0, Math.sin(m)) * 0.15 * c),
          (h.rightLeg = Math.max(0, -Math.sin(m)) * 0.15 * c),
          (h.leftArm = (-0.32 + Math.sin(m) * 0.16) * c),
          (h.rightArm = (0.32 + Math.sin(m) * 0.16) * c),
          (h.leftElbow = (0.38 + Math.cos(m) * 0.16) * c),
          (h.rightElbow = (0.38 - Math.cos(m) * 0.16) * c),
          (h.leftWrist = Math.sin(m) * 0.1 * c),
          (h.rightWrist = -Math.sin(m) * 0.1 * c),
          (h.chest = (0.1 + Math.pow(Math.max(0, Math.cos(m * 2)), 4) * 0.16) * c);
      }
      let u = this.greeting || this.index === 3,
        d = !i && l && u ? sp(o, 0.22, this.greeting ? 3.1 : 2.55) : 0;
      if (u && c) {
        (h.smile *= 1 - c),
          (h.laugh = Math.max(h.laugh, c * (0.84 + 0.1 * Math.sin(o * 9)))),
          (h.squint = Math.max(h.squint, c * 0.77)),
          (h.headPitch -= 0.048 * c),
          (h.headRoll -= 0.036 * c),
          (h.bounce = Math.sin(o * 9) * 0.042 * c),
          (h.leftArm = 0.12 * c),
          (h.leftElbow = (this.greeting ? 0.38 : 1.08) * c),
          (h.rightArm = 1.03 * d),
          (h.rightElbow = 1.26 * d);
        let m = pt((o - 0.45) / (this.greeting ? 2.35 : 1.65), 0, 1);
        (h.rightWrist = Math.sin(m * Math.PI * 2 * (this.greeting ? 3 : 2)) * 0.27 * d),
          (h.chest += (0.12 + Math.sin(o * 9) * 0.09) * c);
      }
      if (a && this.index !== 4) {
        let m = pt(a.mouth, 0, 1);
        (h.laugh = m * 0.94),
          (h.smile = (this.index === 0 || this.index === 3 ? 0.48 : h.smile) * (1 - m * 0.65)),
          (h.frown *= 1 - m * 0.6),
          (h.shy *= 1 - m * 0.6),
          (h.headPitch -= m * 0.009 * (i ? 0 : 1));
      }
      a && (h.chest += a.energy * 0.22),
        (h.chest += this.hover * (0.08 + (i ? 0 : 0.016 * Math.sin(this.hoverAge * 3.5)))),
        (h.press = n ? 1 : l ? Math.exp(-o * 15) * 0.45 : 0);
      let f = {};
      for (let m of Oh) f[m] = this.springs[m].step(h[m], e);
      return {
        ...f,
        hover: this.hover,
        active: l,
        expression: this.expression,
      };
    }
  },
  Wc = class {
    constructor() {
      (this.yaw = 0),
        (this.pitch = 0),
        (this.vy = 0),
        (this.vx = 0),
        (this.dragging = !1),
        (this.lastMove = 0),
        (this.y = new Mn(6.5)),
        (this.x = new Mn(6.5));
    }
    begin(e) {
      (this.dragging = !0), (this.vx = this.vy = 0), (this.lastMove = e);
    }
    drag(e, t, n, i) {
      let r = e * 0.008,
        a = t * 0.003;
      (this.yaw += r), (this.pitch = pt(this.pitch + a, -0.22, 0.22));
      let o = pt(n, 1 / 240, 0.06),
        l = 1 - Math.exp(-o * 22);
      (this.vy += (pt(r / o, -4, 4) - this.vy) * l),
        (this.vx += (pt(a / o, -1.3, 1.3) - this.vx) * l),
        (this.lastMove = i);
    }
    end(e, t = !1) {
      (this.dragging = !1), (t || e - this.lastMove > 0.12) && (this.vx = this.vy = 0);
    }
    reset() {
      this.yaw = this.pitch = this.vx = this.vy = 0;
    }
    step(e, t = !1) {
      if (((e = pt(e, 0, 0.1)), !this.dragging)) {
        let n = Math.exp(-5.8 * e),
          i = (1 - n) / 5.8;
        t || ((this.yaw += this.vy * i), (this.pitch = pt(this.pitch + this.vx * i, -0.22, 0.22))),
          (this.vy *= t ? 0 : n),
          (this.vx *= t ? 0 : n),
          Math.abs(this.pitch) === 0.22 && (this.vx = 0);
      }
      return {
        yaw: this.y.step(this.yaw, e),
        pitch: this.x.step(this.pitch, e),
      };
    }
  };
function createGaze(s) {
  let e = s.el.closest("#product-0") || s.el.closest("section");
  if (!e) return null;
  let t = new Hc(),
    n = null,
    i = () => {
      (n = null), t.neutral();
    },
    r = () => {
      if (!n) return;
      let a = e.getBoundingClientRect();
      if (n.x < a.left || n.x > a.right || n.y < a.top || n.y > a.bottom) return i();
      let o = s.el.getBoundingClientRect();
      t.aim((n.x - o.left - o.width * 0.5) / (a.width * 0.45), (o.top + o.height * 0.5 - n.y) / (a.height * 0.55));
    };
  return (
    e.addEventListener(
      "pointermove",
      (a) => {
        if (a.pointerType !== "mouse" || !matchMedia("(hover: hover) and (pointer: fine)").matches) return i();
        (n = {
          x: a.clientX,
          y: a.clientY,
        }),
          r();
      },
      {
        passive: !0,
      },
    ),
    e.addEventListener("pointerleave", i),
    e.addEventListener("pointercancel", i),
    window.addEventListener("blur", i),
    window.addEventListener("scroll", r, {
      passive: !0,
    }),
    document.addEventListener("visibilitychange", () => {
      document.hidden && i();
    }),
    t
  );
}
var Mv = new Set(["signal", "code", "canvas", "compute", "market", "developer", "launch", "shield"]);
function createModuleInteraction(s) {
  let e = s.type.startsWith("showcase-");
  if (!Mv.has(s.type) && !e) return null;
  let { el: t, camera: n, model: i } = s,
    r = new Gc(
      e
        ? {
            idleSpeed: 0,
          }
        : {},
    ),
    a = new Raycaster(),
    o = new Vector2(),
    l = {
      motion: r,
      interacted: !1,
      pointer: null,
    },
    c = () => performance.now() / 1e3;
  (t.style.pointerEvents = "auto"),
    (t.style.touchAction = "pan-y"),
    (t.style.userSelect = t.style.webkitUserSelect = "none"),
    (t.style.cursor = "default"),
    (t.tabIndex = 0),
    t.setAttribute("role", "group"),
    t.setAttribute("aria-roledescription", "rotatable 3D product module"),
    t.setAttribute(
      "aria-description",
      "Drag horizontally to rotate and vertically to tilt. Arrow keys rotate; Home restores the starting view.",
    );
  let h = (f) => {
      let m = t.getBoundingClientRect();
      return (
        o.set(((f.clientX - m.left) / m.width) * 2 - 1, 1 - ((f.clientY - m.top) / m.height) * 2),
        n.updateMatrixWorld(),
        i.updateWorldMatrix(!0, !0),
        a.setFromCamera(o, n),
        a.intersectObject(i, !0).some((b) => b.object.visible)
      );
    },
    u = (f) => {
      (l.interacted = !0),
        (l.pointer.engaged = !0),
        r.begin(c()),
        t.setPointerCapture(f.pointerId),
        (t.style.cursor = "grabbing");
    };
  t.addEventListener("pointerdown", (f) => {
    f.button !== 0 ||
      l.pointer ||
      !h(f) ||
      ((l.pointer = {
        id: f.pointerId,
        startX: f.clientX,
        startY: f.clientY,
        x: f.clientX,
        y: f.clientY,
        time: c(),
        engaged: !1,
      }),
      f.pointerType !== "touch" && (f.preventDefault(), u(f)));
  }),
    t.addEventListener("pointermove", (f) => {
      let m = l.pointer;
      if (!m || m.id !== f.pointerId) {
        !m && f.pointerType === "mouse" && (t.style.cursor = h(f) ? "grab" : "default");
        return;
      }
      if (!m.engaged) {
        let g = f.clientX - m.startX,
          p = f.clientY - m.startY;
        if (Math.abs(p) > 10 && Math.abs(p) > Math.abs(g) * 1.2) {
          l.pointer = null;
          return;
        }
        if (Math.abs(g) < 10 || Math.abs(g) < Math.abs(p) * 1.15) return;
        u(f);
      }
      f.cancelable && f.preventDefault();
      let b = c();
      r.drag(f.clientX - m.x, f.clientY - m.y, b - m.time, b), (m.x = f.clientX), (m.y = f.clientY), (m.time = b);
    });
  let d = (f, m = !1) => {
    let b = l.pointer;
    !b ||
      (f && f.pointerId !== b.id) ||
      ((l.pointer = null),
      b.engaged && Math.hypot(b.x - b.startX, b.y - b.startY) > 4 && (l.suppressClickUntil = c() + 0.15),
      b.engaged && r.end(c(), m),
      t.hasPointerCapture(b.id) && t.releasePointerCapture(b.id),
      (t.style.cursor = f?.pointerType === "mouse" && h(f) ? "grab" : "default"));
  };
  return (
    t.addEventListener("pointerup", (f) => d(f)),
    t.addEventListener("pointercancel", (f) => d(f, !0)),
    t.addEventListener("lostpointercapture", (f) => d(f, !0)),
    t.addEventListener("pointerleave", () => {
      l.pointer?.engaged || ((l.pointer = null), (t.style.cursor = "default"));
    }),
    t.addEventListener("dragstart", (f) => f.preventDefault()),
    t.addEventListener("click", (f) => {
      e && c() < l.suppressClickUntil && (f.preventDefault(), f.stopPropagation());
    }),
    window.addEventListener("blur", () => d(null, !0)),
    document.addEventListener("visibilitychange", () => {
      document.hidden && d(null, !0);
    }),
    t.addEventListener("keydown", (f) => {
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(f.key) &&
        (f.preventDefault(),
        (l.interacted = !0),
        r.suspend(c()),
        (r.vx = r.vy = 0),
        f.key === "Home" && r.reset(c()),
        f.key === "ArrowLeft" && (r.yaw -= 0.15),
        f.key === "ArrowRight" && (r.yaw += 0.15),
        f.key === "ArrowUp" && (r.pitch = pt(r.pitch - 0.08, -0.42, 0.42)),
        f.key === "ArrowDown" && (r.pitch = pt(r.pitch + 0.08, -0.42, 0.42)));
    }),
    l
  );
}
function createInteraction(s, e, t = null) {
  if (!["robot", "portrait", "head", "network"].includes(s.type)) return null;
  let { el: n, model: i, camera: r } = s,
    a = new Wc(),
    o = new Raycaster(),
    l = new Vector2(),
    c = {
      motion: a,
      pointer: null,
      chestHover: !1,
      pressed: !1,
      personality: e,
      button: null,
    },
    h = () => {
      let M = e.activate();
      t?.play(M), (c.pressed = !1);
    },
    u = (M) => {
      for (let R = M.object; R; R = R.parent) if (!R.visible || R.userData.noninteractive) return !1;
      return !0;
    },
    d = () => performance.now() / 1e3;
  (n.style.pointerEvents = "auto"),
    (n.style.touchAction = "pan-y"),
    (n.style.userSelect = n.style.webkitUserSelect = "none"),
    (n.style.cursor = "default"),
    (n.tabIndex = 0),
    n.setAttribute("role", "group"),
    n.setAttribute("aria-roledescription", "interactive 3D robot"),
    n.setAttribute(
      "aria-description",
      "Drag horizontally to rotate; use arrow keys to rotate and Home to face forward.",
    );
  let f = (M) => {
    let R = n.getBoundingClientRect();
    return (
      l.set(((M.clientX - R.left) / R.width) * 2 - 1, 1 - ((M.clientY - R.top) / R.height) * 2),
      r.updateMatrixWorld(),
      i.updateWorldMatrix(!0, !0),
      o.setFromCamera(l, r),
      o.intersectObject(i, !0).filter(u)
    );
  };
  if (i.userData.core) {
    let M = document.createElement("button");
    (c.button = M),
      (M.type = "button"),
      (M.style.cssText =
        "position:absolute;background:transparent;border:0;padding:0;margin:0;border-radius:50%;width:44px;height:44px;min-width:0;transform:translate(-50%,-50%);z-index:1;cursor:pointer;touch-action:pan-y;visibility:hidden"),
      M.setAttribute("aria-label", "Robot chest button \u2014 laugh, wave, and change expression"),
      M.setAttribute(
        "aria-description",
        "Plays a short sound and changes the robot\u2019s expression. Press Escape to stop the sound.",
      ),
      M.addEventListener("click", (R) => {
        R.stopPropagation(), h();
      }),
      M.addEventListener("pointerdown", (R) => {
        R.stopPropagation(), (c.pressed = !0);
      }),
      M.addEventListener("pointerup", () => (c.pressed = !1)),
      M.addEventListener("pointercancel", () => {
        (c.pressed = !1), (c.chestHover = !1);
      }),
      M.addEventListener("pointerenter", () => (c.chestHover = !0)),
      M.addEventListener("pointerleave", () => {
        (c.pressed = !1), (c.chestHover = !1);
      }),
      M.addEventListener("focus", () => (c.chestHover = !0)),
      M.addEventListener("blur", () => {
        (c.chestHover = !1), (c.pressed = !1);
      }),
      n.appendChild(M);
  }
  n.addEventListener("pointerdown", (M) => {
    M.target === c.button ||
      M.button !== 0 ||
      c.pointer ||
      !f(M).length ||
      ((c.pointer = {
        id: M.pointerId,
        x: M.clientX,
        y: M.clientY,
        startX: M.clientX,
        startY: M.clientY,
        time: d(),
        engaged: !1,
      }),
      M.pointerType !== "touch" && (M.preventDefault(), n.setPointerCapture(M.pointerId)));
  }),
    n.addEventListener("pointermove", (M) => {
      if (M.target === c.button && !c.pointer) return;
      let R = c.pointer;
      if (!R || R.id !== M.pointerId) {
        R || (n.style.cursor = M.pointerType === "mouse" && f(M).length ? "grab" : "default");
        return;
      }
      if (!R.engaged) {
        let T = M.clientX - R.startX,
          E = M.clientY - R.startY;
        if (M.pointerType === "touch" && Math.abs(E) > 9 && Math.abs(E) > Math.abs(T) * 1.15) {
          c.pointer = null;
          return;
        }
        if (M.pointerType === "touch" ? Math.abs(T) < 9 || Math.abs(T) < Math.abs(E) * 1.2 : Math.hypot(T, E) < 4)
          return;
        (R.engaged = !0), a.begin(d()), n.setPointerCapture(M.pointerId), (n.style.cursor = "grabbing");
      }
      M.cancelable && M.preventDefault();
      let L = d();
      a.drag(M.clientX - R.x, M.clientY - R.y, L - R.time, L), (R.x = M.clientX), (R.y = M.clientY), (R.time = L);
    });
  let m = (M, R = !1) => {
    let L = c.pointer;
    !L ||
      (M && M.pointerId !== L.id) ||
      ((c.pointer = null),
      L.engaged && a.end(d(), R),
      n.hasPointerCapture(L.id) && n.releasePointerCapture(L.id),
      (c.pressed = !1),
      (n.style.cursor = "default"));
  };
  n.addEventListener("pointerup", (M) => m(M)),
    n.addEventListener("pointercancel", (M) => m(M, !0)),
    n.addEventListener("lostpointercapture", (M) => m(M, !0)),
    n.addEventListener("pointerleave", () => {
      c.pointer?.engaged || (m(null, !0), (c.chestHover = !1), (n.style.cursor = "default"));
    }),
    n.addEventListener("dragstart", (M) => M.preventDefault());
  let b = () => {
    m(null, !0), (c.pressed = c.chestHover = !1);
  };
  window.addEventListener("blur", b),
    document.addEventListener("visibilitychange", () => {
      document.hidden && b();
    }),
    n.addEventListener("keydown", (M) => {
      if (M.key === "Escape") {
        t?.stop(), e.finish();
        return;
      }
      M.target !== c.button &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "Enter", " "].includes(M.key) &&
        (M.preventDefault(),
        (a.vx = a.vy = 0),
        M.key === "Home" && a.reset(),
        M.key === "ArrowLeft" && (a.yaw -= 0.16),
        M.key === "ArrowRight" && (a.yaw += 0.16),
        M.key === "ArrowUp" && (a.pitch = pt(a.pitch - 0.06, -0.22, 0.22)),
        M.key === "ArrowDown" && (a.pitch = pt(a.pitch + 0.06, -0.22, 0.22)),
        (M.key === "Enter" || M.key === " ") && !M.repeat && i.userData.core && h());
    });
  let g = new Vector3(),
    p = new Vector3(),
    y = new Vector3(),
    v = new Quaternion(),
    x = -1 / 0,
    w = !1;
  return (
    (c.updateButton = () => {
      if (!c.button) return;
      let M = i.userData.core,
        R = n.getBoundingClientRect();
      M.getWorldPosition(g),
        M.getWorldQuaternion(v),
        p.set(0, 0, 1).applyQuaternion(v),
        y.copy(r.position).sub(g).normalize();
      let L = p.dot(y) > 0.35;
      g.project(r);
      let T = L && g.z > -1 && g.z < 1 && Math.abs(g.x) < 1 && Math.abs(g.y) < 1;
      if (T && d() - x > 0.12) {
        (x = d()), o.setFromCamera(l.set(g.x, g.y), r);
        let k = o.intersectObject(i, !0).find(u)?.object;
        for (; k && k !== M; ) k = k.parent;
        w = k === M;
      }
      T || ((w = !1), (x = -1 / 0)),
        (T = T && w),
        (c.button.style.visibility = T ? "visible" : "hidden"),
        (c.button.style.left = `${(g.x + 1) * 0.5 * R.width}px`),
        (c.button.style.top = `${(1 - g.y) * 0.5 * R.height}px`),
        T || (c.chestHover = c.pressed = !1);
      let E = `Robot chest button \u2014 ${e.expression}. Activate for a new expression and sound.`;
      c.button.getAttribute("aria-label") !== E && c.button.setAttribute("aria-label", E);
      let P = t?.status || "idle";
      c.button.getAttribute("data-audio-state") !== P && c.button.setAttribute("data-audio-state", P);
    }),
    c
  );
}
var VOICE_BANK = {
  Happy: {
    duration: 3.2,
    fps: 50,
    mouth: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.035, 0.038, 0.031, 0.286, 0.431, 0.329, 0.356, 0.282, 0.278, 0.363,
      0.673, 0.846, 0.9, 0.824, 0.921, 0.864, 0.712, 0.695, 0.618, 0.601, 0.565, 0.569, 0.48, 0.405, 0.02, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0,
    ],
    energy: [
      0.248, 0.299, 0.267, 0.242, 0.292, 0.37, 0.34, 0.291, 0.297, 0.38, 0.348, 0.303, 0.268, 0.22, 0.195, 0.174, 0.148,
      0.299, 0.434, 0.329, 0.356, 0.282, 0.278, 0.363, 0.673, 0.846, 0.9, 0.824, 0.921, 0.864, 0.712, 0.695, 0.618,
      0.601, 0.565, 0.569, 0.48, 0.405, 0.02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    url: voiceHappy,
    bpm: 0,
    beatOffset: 0.06,
    transcript: "Hello!",
    peak: 0.48,
  },
  Angry: {
    duration: 2.8,
    fps: 50,
    mouth: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.561, 0.585, 0.675, 0.608, 0.489, 0.485, 0.463, 0.437, 0.531, 0.458,
      0.457, 0.275, 0.201, 0.216, 0.185, 0.266, 0.334, 0.337, 0.254, 0.21, 0.253, 0.351, 0.443, 0.502, 0.559, 0.82,
      0.88, 0.916, 0.91, 0.811, 0.761, 0.68, 0.636, 0.638, 0.622, 0.583, 0.396, 0.398, 0.401, 0.286, 0.272, 0.253,
      0.231, 0.227, 0.182, 0.042, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    energy: [
      0.307, 0.379, 0.366, 0.356, 0.33, 0.294, 0.177, 0.277, 0.244, 0.229, 0.144, 0.04, 0, 0.561, 0.585, 0.675, 0.608,
      0.489, 0.485, 0.463, 0.437, 0.531, 0.458, 0.457, 0.275, 0.201, 0.216, 0.185, 0.266, 0.334, 0.337, 0.254, 0.21,
      0.253, 0.351, 0.443, 0.502, 0.559, 0.82, 0.88, 0.916, 0.91, 0.811, 0.761, 0.68, 0.636, 0.638, 0.622, 0.583, 0.396,
      0.398, 0.401, 0.286, 0.272, 0.253, 0.231, 0.227, 0.182, 0.042, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    url: voiceAngry,
    bpm: 0,
    beatOffset: 0.06,
    transcript: "You are annoying.",
    peak: 0.48,
  },
  Shy: {
    duration: 2.7,
    fps: 50,
    mouth: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.004, 0.031, 0.004, 0.057, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.992, 1, 0.99, 1,
      0.213, 0.008, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    energy: [
      0, 0.06, 0.195, 0.178, 0.158, 0.142, 0.126, 0.113, 0.1, 0.088, 0.079, 0.072, 0.074, 0.056, 0.08, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 0.992, 1, 0.99, 1, 0.213, 0.008, 0, 0, 0, 0, 0, 0.032, 0.118, 0.106, 0.094, 0.084, 0.074, 0.065,
      0.057, 0.05, 0.044, 0.038, 0.032, 0.028, 0.023, 0.019, 0.016, 0.012, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    url: voiceShy,
    bpm: 0,
    beatOffset: 0.06,
    transcript: "Hmm.",
    peak: 0.4683,
  },
  Laugh: {
    duration: 3.9269,
    fps: 50,
    mouth: [
      0, 0, 0, 0, 0.055, 0.051, 0.051, 0.651, 0.776, 0.859, 0.733, 0.808, 0.89, 0.795, 0.621, 0.719, 0.591, 0.662,
      0.615, 0.573, 0.427, 0.005, 0, 0, 0, 0, 0, 0.005, 0.04, 0.051, 0.056, 0.064, 0.709, 0.815, 0.784, 0.782, 0.835,
      0.675, 0.749, 0.146, 0.06, 0.092, 0.774, 0.851, 0.838, 0.815, 0.81, 0.763, 0.771, 0.607, 0.542, 0.633, 0.498,
      0.59, 0.603, 0.415, 0.043, 0.012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.188, 0.451,
      0.589, 0.766, 0.866, 0.587, 0.372, 0.176, 0, 0, 0.489, 0.529, 0.542, 0.605, 0.749, 0.676, 0.618, 0.595, 0.611,
      0.585, 0.565, 0.569, 0.371, 0.056, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.125, 0.273, 0.286,
      0.403, 0.322, 0.246, 0.193, 0.172, 0.292, 0.418, 0.485, 0.449, 0.523, 0.688, 0.746, 0.74, 0.671, 0.634, 0.609,
      0.476, 0.518, 0.503, 0.465, 0.396, 0.365, 0.538, 0.589, 0.565, 0.5, 0.416, 0.392, 0.348, 0.192, 0, 0, 0.055,
      0.029, 0.041, 0.655, 0.846, 0.827, 0.828, 0.756, 0.745, 0.744, 0.476, 0.125, 0.186, 0.433, 0.375, 0.419, 0.367,
      0.315, 0.293, 0.329, 0.288, 0.232, 0.129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    energy: [
      0.082, 0.253, 0.231, 0.206, 0.194, 0.17, 0.112, 0.654, 0.776, 0.859, 0.733, 0.808, 0.89, 0.795, 0.621, 0.719,
      0.591, 0.662, 0.615, 0.573, 0.427, 0.005, 0, 0, 0, 0, 0, 0.005, 0.04, 0.051, 0.056, 0.064, 0.709, 0.815, 0.784,
      0.782, 0.835, 0.675, 0.749, 0.146, 0.06, 0.092, 0.774, 0.851, 0.838, 0.815, 0.81, 0.763, 0.771, 0.607, 0.542,
      0.633, 0.498, 0.59, 0.603, 0.415, 0.043, 0.012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0.188, 0.451, 0.589, 0.766, 0.866, 0.587, 0.372, 0.176, 0, 0, 0.489, 0.529, 0.542, 0.605, 0.749, 0.676, 0.618,
      0.595, 0.611, 0.585, 0.565, 0.569, 0.371, 0.056, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.125,
      0.273, 0.286, 0.403, 0.322, 0.246, 0.193, 0.172, 0.292, 0.418, 0.485, 0.449, 0.523, 0.688, 0.746, 0.74, 0.671,
      0.634, 0.609, 0.476, 0.518, 0.503, 0.465, 0.396, 0.365, 0.538, 0.589, 0.565, 0.5, 0.416, 0.392, 0.348, 0.192, 0,
      0, 0.055, 0.029, 0.041, 0.655, 0.846, 0.827, 0.828, 0.756, 0.745, 0.744, 0.476, 0.125, 0.186, 0.433, 0.375, 0.419,
      0.367, 0.315, 0.293, 0.329, 0.3, 0.275, 0.186, 0.109, 0.097, 0.085, 0.076, 0.067, 0.046, 0.01, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0,
    ],
    url: voiceLaugh,
    bpm: 0,
    beatOffset: 0.06,
    transcript: "Ha, ha ha! Got you! I\u2019m only teasing.",
    peak: 0.48,
  },
  Excited: {
    duration: 4.35,
    fps: 50,
    mouth: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    energy: [
      0, 0, 0, 0.935, 0.607, 0.579, 0.48, 0.449, 0.43, 0.399, 0.375, 0.342, 0.31, 0.293, 0.282, 0.289, 0.423, 0.347,
      0.281, 0.244, 0.217, 0.196, 0.177, 0.154, 0.091, 0.02, 0, 0, 0.938, 0.621, 0.572, 0.467, 0.449, 0.431, 0.4, 0.375,
      0.342, 0.309, 0.293, 0.282, 0.295, 0.422, 0.351, 0.279, 0.244, 0.219, 0.195, 0.175, 0.155, 0.091, 0.02, 0, 0,
      0.707, 0.684, 0.555, 0.478, 0.455, 0.42, 0.39, 0.384, 0.337, 0.314, 0.29, 0.273, 0.301, 0.427, 0.351, 0.278,
      0.244, 0.217, 0.196, 0.177, 0.154, 0.091, 0.02, 0, 0, 0.712, 0.685, 0.551, 0.476, 0.461, 0.412, 0.4, 0.378, 0.341,
      0.315, 0.29, 0.273, 0.309, 0.424, 0.346, 0.279, 0.241, 0.219, 0.197, 0.174, 0.156, 0.091, 0.02, 0, 0, 0.723,
      0.618, 0.571, 0.514, 0.453, 0.414, 0.401, 0.375, 0.348, 0.31, 0.291, 0.277, 0.299, 0.42, 0.346, 0.279, 0.244,
      0.217, 0.196, 0.177, 0.154, 0.091, 0.02, 0, 0, 0.725, 0.627, 0.565, 0.51, 0.456, 0.416, 0.4, 0.374, 0.347, 0.31,
      0.29, 0.277, 0.299, 0.421, 0.348, 0.277, 0.243, 0.218, 0.196, 0.176, 0.155, 0.091, 0.02, 0, 0, 0.737, 0.637,
      0.567, 0.481, 0.464, 0.425, 0.396, 0.376, 0.347, 0.304, 0.288, 0.279, 0.305, 0.423, 0.352, 0.278, 0.241, 0.219,
      0.197, 0.174, 0.156, 0.091, 0.02, 0, 0, 0.734, 0.632, 0.558, 0.495, 0.461, 0.423, 0.398, 0.378, 0.343, 0.304,
      0.288, 0.279, 0.308, 0.416, 0.354, 0.274, 0.245, 0.218, 0.197, 0.175, 0.158, 0.14, 0.126, 0.111, 0.1, 0.087,
      0.079, 0.068, 0.061, 0.053, 0.047, 0.04, 0.035, 0.03, 0.021, 0, 0, 0, 0, 0,
    ],
    url: voiceExcited,
    bpm: 120,
    beatOffset: 0.06,
    transcript: "",
    peak: 0.3299,
  },
};
function lp(s, e, t) {
  if (t < 0 || t * e >= s.length - 1) return 0;
  let n = Math.floor(t * e),
    i = t * e - n;
  return s[n] * (1 - i) + s[n + 1] * i;
}
var VoicePlayer = class {
  constructor({
    bank: e = VOICE_BANK,
    createContext: t = () => {
      let n = globalThis.AudioContext || globalThis.webkitAudioContext;
      return n
        ? new n({
            latencyHint: "interactive",
          })
        : null;
    },
  } = {}) {
    (this.bank = e),
      (this.createContext = t),
      (this.context = null),
      (this.buffers = new Map()),
      (this.current = null),
      (this.serial = 0);
  }
  decode(e) {
    if (!this.buffers.has(e)) {
      let i = fetch(this.bank[e].url)
        .then((res) => res.arrayBuffer())
        .then((buf) => this.context.decodeAudioData(buf))
        .catch((r) => {
          throw (this.buffers.delete(e), r);
        });
      this.buffers.set(e, i);
    }
    return this.buffers.get(e);
  }
  get status() {
    return this.current
      ? this.current.pending
        ? "loading"
        : this.context.currentTime < this.current.start + this.current.cue.duration
          ? "playing"
          : "idle"
      : "idle";
  }
  async play(e) {
    this.stop();
    let t = this.bank[e],
      n = this.serial;
    if (!t) return !1;
    try {
      if ((this.context || (this.context = this.createContext()), !this.context)) return !1;
      let i = this.context;
      this.current = {
        name: e,
        cue: t,
        pending: !0,
      };
      let r = i.resume(),
        [a] = await Promise.all([this.decode(e), r]);
      if (n !== this.serial) return !1;
      if (i.state !== "running") return (this.current = null), !1;
      let o = i.createBufferSource(),
        l = i.createGain();
      (o.buffer = a), o.connect(l), l.connect(i.destination);
      let c = i.currentTime + 0.025;
      return (
        l.gain.setValueAtTime(0, c),
        l.gain.linearRampToValueAtTime(0.72, c + 0.014),
        l.gain.setValueAtTime(0.72, c + Math.max(0.014, a.duration - 0.06)),
        l.gain.linearRampToValueAtTime(0, c + a.duration),
        (o.onended = () => {
          o.disconnect(), l.disconnect();
        }),
        (this.current = {
          name: e,
          cue: t,
          start: c,
          source: o,
          gain: l,
          pending: !1,
        }),
        o.start(c),
        !0
      );
    } catch {
      return n === this.serial && (this.current = null), !1;
    }
  }
  stop() {
    this.serial++;
    let e = this.current;
    if (((this.current = null), !e?.source)) return;
    let t = this.context.currentTime;
    e.gain.gain.cancelScheduledValues(t), e.gain.gain.setTargetAtTime(0, t, 0.008);
    try {
      e.source.stop(t + 0.045);
    } catch {}
  }
  sample() {
    let e = this.current;
    if (!e) return null;
    if (e.pending)
      return {
        pending: !0,
        elapsed: 0,
        mouth: 0,
        energy: 0,
        duration: e.cue.duration,
      };
    let t = Math.max(0, this.context.currentTime - e.start);
    return t > e.cue.duration + 0.4
      ? ((this.current = null), null)
      : {
          pending: !1,
          elapsed: t,
          duration: e.cue.duration,
          mouth: lp(e.cue.mouth, e.cue.fps, t),
          energy: lp(e.cue.energy, e.cue.fps, t),
          beat: e.cue.bpm ? (Math.max(0, t - e.cue.beatOffset) * e.cue.bpm) / 60 : 0,
        };
  }
};
function createCoolEnvironment(s) {
  let e = new Scene();
  e.background = new Color(0.06, 0.071, 0.087);
  let t = [
    [[-4.5, 3.6, 5], 2.8, 5.5, 7, "#f8fbff"],
    [[4.8, 1, 3], 0.85, 6.2, 5.5, "#e5eeff"],
    [[0.6, 6, -1], 5, 2.3, 4.6, "#ffffff"],
    [[-3, 1.5, -4], 1.2, 4.8, 5.8, "#bccfff"],
    [[3.8, -0.4, -4.2], 2, 4.2, 2.6, "#f0f4ff"],
    [[0, -3, 4.4], 4.8, 0.65, 1.3, "#d6dfed"],
    [[0.2, 0.3, 6], 4.5, 5.5, 0.62, "#e4eaf2"],
  ];
  for (let [i, r, a, o, l] of t) {
    let c = new Mesh(
      new PlaneGeometry(r, a),
      new MeshBasicMaterial({
        color: new Color(l).multiplyScalar(o),
        side: DoubleSide,
        toneMapped: !1,
      }),
    );
    c.position.fromArray(i), c.lookAt(0, 0, 0), e.add(c);
  }
  let n = s.fromScene(e, 0.012).texture;
  return (
    e.traverse((i) => {
      i.isMesh && (i.geometry.dispose(), i.material.dispose());
    }),
    n
  );
}
function vp(s, e, t, n, i, r = !1) {
  (s.environment = i), (s.environmentIntensity = r ? 0.8 : 1.05);
  let a = s.children.find((o) => o.isAmbientLight);
  a.color.set("#e5edff"),
    (a.intensity = 0.035),
    e.color.set("#f5f8ff"),
    (e.intensity = r ? 1.85 : 1.1),
    e.position.set(-4.5, 5.5, 6),
    t.color.set("#dce7ff"),
    (t.intensity = 0.26),
    t.position.set(4.5, 1.5, 3),
    n.color.set("#e5edff"),
    (n.intensity = 1.5),
    n.position.set(2.5, 4, -4),
    (e.shadow.normalBias = 0.004),
    (e.shadow.camera.left = e.shadow.camera.bottom = -2.5),
    (e.shadow.camera.right = e.shadow.camera.top = 2.5);
}
var du = new WeakMap();
function tuneMaterial(s) {
  if (du.has(s)) return du.get(s);
  let e = s.clone(),
    t = e.name;
  if (t.includes("brushed platinum"))
    e.color.set("#ccd3dd"),
      (e.metalness = 1),
      (e.roughness = 0.64),
      (e.clearcoat = 0.24),
      (e.clearcoatRoughness = 0.075);
  else if (t.includes("graphite alloy"))
    e.color.set("#4e5866"), (e.metalness = 1), (e.roughness = 0.74), (e.clearcoat = 0.18), (e.clearcoatRoughness = 0.1);
  else if (t.includes("violet titanium"))
    e.color.set("#87799e"),
      (e.metalness = 1),
      (e.roughness = 0.6),
      (e.clearcoat = 0.28),
      (e.clearcoatRoughness = 0.055),
      (e.iridescence = 0.16),
      (e.iridescenceIOR = 1.35),
      (e.iridescenceThicknessRange = [180, 270]);
  else if (t.includes("pale electrum")) e.color.set("#c3cfde"), (e.metalness = 1), (e.roughness = 0.12);
  else if (t.includes("ice optical glass") || t.startsWith("Sapphire optical glass")) {
    let n = t.startsWith("Sapphire");
    e.color.set(n ? "#dbebff" : "#eef5ff"),
      (e.metalness = 0),
      (e.roughness = 0.025),
      (e.transmission = 0.97),
      (e.thickness = n ? 0.42 : 0.24),
      (e.ior = 1.48),
      (e.attenuationColor = new Color(n ? "#668ac0" : "#c6ddf8")),
      (e.attenuationDistance = 1.5),
      (e.clearcoat = 1),
      (e.clearcoatRoughness = 0.018),
      (e.opacity = 1),
      (e.transparent = !1),
      (e.depthWrite = !0),
      (e.side = FrontSide);
  } else
    t.includes("frost diffuser")
      ? (e.color.set("#c0d9ed"),
        (e.metalness = 0.3),
        (e.roughness = 0.13),
        e.emissive.set("#78b6dc"),
        (e.emissiveIntensity = 0.14),
        (e.clearcoat = 1),
        (e.clearcoatRoughness = 0.04))
      : t.includes("amethyst plane") || t.startsWith("Amethyst crystal depth")
        ? ((e.metalness = 0.23),
          (e.roughness = 0.075),
          (e.transmission = 0.38),
          (e.thickness = 0.2),
          (e.clearcoat = 1),
          (e.clearcoatRoughness = 0.025))
        : t.startsWith("Carved obsidian")
          ? (e.color.set("#414955"),
            (e.metalness = 0.62),
            (e.roughness = 0.85),
            (e.transmission = 0),
            (e.clearcoat = 0.42),
            (e.clearcoatRoughness = 0.1))
          : t.startsWith("Olive anodized rim")
            ? ((e.metalness = 1), (e.roughness = 0.7), (e.clearcoat = 0.18))
            : t.startsWith("Blue instrument illumination") &&
              (e.color.set("#7896b7"),
              e.emissive.set("#8fceff"),
              (e.emissiveIntensity = 0.16),
              (e.metalness = 0.32),
              (e.roughness = 0.14),
              (e.clearcoat = 0.8),
              (e.clearcoatRoughness = 0.04));
  return (e.needsUpdate = !0), du.set(s, e), e;
}
function tuneMaterials(s) {
  s.traverse((e) => {
    if (!e.isMesh) return;
    e.material = Array.isArray(e.material) ? e.material.map(tuneMaterial) : tuneMaterial(e.material);
    let t = [].concat(e.material);
    (e.castShadow = t.every((n) => !n.transparent && !(n.transmission > 0.5))), (e.receiveShadow = e.castShadow);
  });
}
var Ca,
  Mp = [],
  SHOWCASE_MASTERS = {
    panther: "PANTHER_MASTER",
    gyroscope: "GYROSCOPE_MASTER",
    token: "EMBLEM_MASTER",
    strata: "STRATA_MASTER",
    creation: "CREATION_MASTER",
    network: "NETWORK_MASTER",
  },
  Sp = 1.3,
  Xt = 1.7,
  Nv = 2.055,
  Ov = 1.38 - Nv * Xt,
  fu = new Euler(),
  yr = new Quaternion();
async function loadMasters(s = modelUrl) {
  if (s.startsWith("__ASSET_")) return !1;
  MeshoptDecoder.useWorkers(Math.min(4, navigator.hardwareConcurrency || 2));
  let e = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(s),
    t = e.scene;
  for (let n of ["ROBOT_MASTER", ...Object.values(SHOWCASE_MASTERS)])
    if (!t.getObjectByName(n)) throw new Error(`Missing Higgsfield master: ${n}`);
  return (
    Uv(t),
    t.traverse((n) => {
      if (n.isMesh)
        for (let i of [].concat(n.material)) {
          for (let r of ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap"])
            i[r] && (i[r].anisotropy = 4);
          // Transmission shaders stall the first paint by more than a second.
          i.transmission > 0 && ((i.transmission = 0), (i.thickness = 0));
          i.name.startsWith("Optical glass") &&
            ((i.transparent = !0),
            (i.opacity = 0.035),
            (i.depthWrite = !1),
            (i.transmission = 0),
            (i.thickness = 0),
            (i.side = DoubleSide),
            (i.roughness = 0.022),
            (i.clearcoat = 0.32),
            (i.clearcoatRoughness = 0.022));
        }
    }),
    (Mp = e.animations.filter((n) => n.name.startsWith("MOTION_"))),
    (Ca = t),
    !0
  );
}
function Uv(s) {
  let e = [];
  s.traverse((n) => {
    n.children.length && e.push(n);
  });
  let t = /^(Iris_[LR]|Core_luminous_diffuser|Expression_mouth|Oval_ceramic_cranial_shell|Side_sensor_|Forehead)/;
  for (let n of e.reverse()) {
    let i = new Map();
    for (let r of n.children) {
      if (!r.isMesh || r.children.length || r.morphTargetInfluences || t.test(r.name) || Array.isArray(r.material))
        continue;
      let a = r.material.uuid;
      i.has(a) || i.set(a, []), i.get(a).push(r);
    }
    for (let r of i.values()) {
      if (r.length < 2) continue;
      let a = r.map((c) => {
          c.updateMatrix();
          let h = c.geometry.clone().applyMatrix4(c.matrix);
          return (
            h.attributes.uv ||
              h.setAttribute("uv", new BufferAttribute(new Float32Array(h.attributes.position.count * 2), 2)),
            h
          );
        }),
        o = mergeGeometries(a, !1);
      if ((a.forEach((c) => c.dispose()), !o)) continue;
      let l = new Mesh(o, r[0].material);
      (l.name = `Static assembly \u2014 ${n.name} \u2014 ${l.material.name}`),
        r.forEach((c) => c.removeFromParent()),
        n.add(l);
    }
  }
}
var Yc = () => !!Ca;
function wp() {
  if (!Ca) return;
  let s = Ca.getObjectByName("ROBOT_MASTER");
  return {
    shell: ys(s, "Satin ceramic"),
    face: ys(s, "Face ceramic"),
    gold: ys(s, "Champagne anodized aluminum"),
    glass: ys(s, "Optical glass"),
  };
}
function pu(s) {
  let e = Ca.getObjectByName(s);
  if (!e) throw new Error(`Missing Higgsfield master: ${s}`);
  let t = e.clone(!0);
  return (
    t.position.set(0, 0, 0),
    t.traverse((n) => {
      n.isMesh && ((n.castShadow = !n.material.transparent), (n.receiveShadow = !n.material.transparent));
    }),
    t
  );
}
function ys(s, e) {
  let t;
  return (
    s.traverse((n) => {
      !t && n.isMesh && n.material.name.startsWith(e) && (t = n.material);
    }),
    t
  );
}
function Ap(s) {
  let e = s.getObjectByName("Mouth"),
    t = e?.children.filter((h) => h.morphTargetInfluences?.length === 4) || [],
    n;
  t.length === 2
    ? (n = {
        group: e,
        meshes: t,
      })
    : (e && (e.visible = !1),
      (n = kc(s, ys(s, "Champagne"), ys(s, "Mouth interior"))),
      n.group.position.set(0, -0.198, 0.649),
      n.group.scale.setScalar(0.62));
  let i = ["L", "R"].map((h) => s.getObjectByName(`Eye_${h}`)),
    r = ["L", "R"].map((h) => s.getObjectByName(`Gaze_${h}`)),
    a = ["L", "R"].map((h) => s.getObjectByName(`Iris_${h}`));
  a.forEach((h) => {
    h.material = h.material.clone();
  });
  let o = i.map((h, u) =>
      Bc(h, u ? 1 : -1, ys(s, "Face ceramic")).map((d) => (d.scale.setScalar(0.44), (d.position.z = -0.064), d)),
    ),
    l = s.getObjectByName("Oval_ceramic_cranial_shell"),
    c = new Group();
  c.name = "Optical face assembly";
  for (let h of [...s.children])
    h === l || h.name.startsWith("Side_sensor_") || h.name.startsWith("Forehead") || c.add(h);
  return (
    s.add(c),
    (s.userData = {
      ...s.userData,
      referenceFace: !0,
      mouth: n,
      optics: i,
      pupils: r,
      irises: a,
      lids: o,
      face: c,
      shell: l,
    }),
    s
  );
}
function createReferenceHead() {
  let s = pu("ROBOT_MASTER"),
    e = Ap(s.getObjectByName("Head"));
  return e.removeFromParent(), e.position.set(0, 0, 0), e.scale.setScalar(Xt), (e.userData.reference = !0), e;
}
function createReferenceRobot() {
  let s = new Group(),
    e = pu("ROBOT_MASTER");
  e.scale.setScalar(Xt), (e.position.y = Ov), s.add(e);
  let t = Ap(e.getObjectByName("Head")),
    n = e.getObjectByName("Torso"),
    i = e.getObjectByName("ChestCore"),
    r = ["L", "R"].map((h) => {
      let u = e.getObjectByName(`Shoulder_${h}`);
      return (
        (u.userData.elbow = e.getObjectByName(`Elbow_${h}`)), (u.userData.wrist = e.getObjectByName(`Wrist_${h}`)), u
      );
    }),
    a = ["L", "R"].map((h) => e.getObjectByName(`Hip_${h}`)),
    l = e.getObjectByName("Core_luminous_diffuser") || e.getObjectByName("Core luminous diffuser");
  l ||
    i.traverse((h) => {
      h.isMesh && h.material.name.startsWith("Warm luminous") && (l = h);
    }),
    (l.material = l.material.clone());
  let c = new PointLight("#ff8a24", 0.014, 1.05, 2);
  return (
    (c.name = "Chest diffusion bounce"),
    c.position.set(0, 0, 0.078),
    i.add(c),
    (i.userData.isChestControl = !0),
    (s.userData = {
      reference: !0,
      asset: e,
      head: t,
      torso: n,
      core: i,
      coreLight: l,
      coreBounce: c,
      arms: r,
      legs: a,
      eyes: t.userData.optics,
      pupils: t.userData.pupils,
      rest: {
        head: t.position.clone(),
        torso: n.position.clone(),
        core: i.position.clone(),
        arms: r.map((h) => h.position.clone()),
        legs: a.map((h) => h.position.clone()),
      },
    }),
    s
  );
}
function Ip(s, e) {
  let t = s.userData,
    n = t.rest;
  t.head.position.copy(n.head),
    (t.head.position.y += (e * 1.03) / Xt),
    (t.head.userData.face.position.z = (e * 0.7) / Xt),
    t.head.userData.shell && (t.head.userData.shell.position.z = (-e * 0.46) / Xt),
    t.core.position.copy(n.core),
    (t.core.position.z += (e * 0.82) / Xt),
    t.arms.forEach((i, r) => {
      i.position.copy(n.arms[r]), (i.position.x += ((r ? 1 : -1) * e * 0.53) / Xt);
    }),
    t.legs.forEach((i, r) => {
      i.position.copy(n.legs[r]), (i.position.y -= (e * 0.25) / Xt);
    }),
    (t.modules.visible = e > 0.005),
    t.modules.scale.setScalar(Math.max(0.001, e)),
    (t.wires.visible = e > 0.03),
    t.wires.children.forEach((i, r) => {
      let a = r === 0 ? new Vector3(0, 1.38 + e * 1.03, 0) : t.parts[(r - 1) % t.parts.length].position,
        o = i.geometry.attributes.position;
      o.setXYZ(0, 0, -0.61, 0.35), o.setXYZ(1, a.x * e, a.y, a.z), (o.needsUpdate = !0), (i.material.opacity = e * 0.5);
    });
}
function Ra(s, e, t, n, i) {
  yr.setFromEuler(fu.set(e, t, n)), s.quaternion.slerp(yr, 1 - Math.exp(-14 * i));
}
function applyReferencePose(s, e, t, n, i) {
  let r = s.model,
    a = r.userData,
    o = a.head || r,
    l = o.userData;
  n && (yr.setFromEuler(fu.set(n.pitch, n.yaw, 0, "YXZ")), r.quaternion.multiply(yr));
  let c = e.active ? 0.38 : 1;
  l.pupils.forEach((h, u) => {
    (h.position.x = MathUtils.clamp(((t?.pupilX || 0) * c + e.pupilX + (u ? -1 : 1) * e.inward) * 0.49, -0.071, 0.071)),
      (h.position.y = MathUtils.clamp(((t?.pupilY || 0) * c + e.pupilY) * 0.49, -0.055, 0.055));
  }),
    l.irises.forEach((h) => {
      (h.position.x = (t?.irisX || 0) * 0.45 * c),
        (h.position.y = (t?.irisY || 0) * 0.45 * c),
        (h.material.emissiveIntensity = 1.65 + e.chest * 0.26);
    }),
    l.mouth.meshes.forEach((h) => h.morphTargetInfluences.splice(0, 4, e.smile, e.frown, e.shy, e.laugh)),
    l.lids.flat().forEach((h) => {
      (h.visible = e.angryLid + e.shy + e.squint > 0.003),
        (h.morphTargetInfluences[0] = e.angryLid),
        (h.morphTargetInfluences[1] = e.shy * 0.36),
        (h.morphTargetInfluences[2] = e.squint);
    }),
    a.head
      ? (Ra(o, e.headPitch + (t?.pitch || 0), e.headYaw + (t?.yaw || 0), e.headRoll, i),
        (o.position.y += e.bounce / Xt),
        (o.position.x += (e.sway || 0) / Xt),
        (a.torso.position.y = a.rest.torso.y + e.bounce / Xt),
        (a.torso.rotation.z = e.bodyRoll),
        (a.torso.position.x = a.rest.torso.x + (e.sway || 0) / Xt),
        a.arms.forEach((h, u) => {
          (h.position.y = a.rest.arms[u].y + e.bounce / Xt),
            (h.position.x += (e.sway || 0) / Xt),
            Ra(h, u ? -0.13 * Math.abs(e.rightArm) : -0.2 * e.leftElbow, 0, u ? e.rightArm : e.leftArm, i),
            Ra(h.userData.elbow, u ? -0.15 * e.rightElbow : -0.38 * e.leftElbow, 0, u ? e.rightElbow : e.leftElbow, i),
            Ra(h.userData.wrist, 0, u ? e.rightWrist : e.leftWrist, (u ? 1 : -1) * (u ? e.rightWrist : e.leftWrist), i);
        }),
        a.legs.forEach((h, u) => Ra(h, u ? e.rightLeg || 0 : e.leftLeg || 0, 0, -e.bodyRoll * 0.4, i)),
        a.core.scale.setScalar(1 + e.hover * 0.018 + e.chest * 0.06 - e.press * 0.018),
        (a.core.position.z -= (e.press * 0.018) / Xt),
        (a.coreLight.material.emissiveIntensity = 2.4 + e.chest),
        (a.coreBounce.intensity = 0.014 + e.chest * 0.007))
      : (yr.setFromEuler(fu.set(e.headPitch + (t?.pitch || 0), e.headYaw + (t?.yaw || 0), e.headRoll)),
        r.quaternion.multiply(yr));
}
function createShowcase(s) {
  let e = new Group(),
    t = pu(SHOWCASE_MASTERS[s]);
  tuneMaterials(t);
  let n = new Box3().setFromObject(t),
    i = n.getCenter(new Vector3()),
    r = n.getSize(new Vector3()),
    a = 3.15 / r.y;
  t.position.copy(i).multiplyScalar(-a), t.scale.setScalar(a), e.add(t);
  let o = new AnimationMixer(t),
    l = Mp.filter((c) => t.getObjectByName(c.name));
  for (let c of l)
    o.clipAction(c)
      .setLoop(LoopRepeat, 1 / 0)
      .play();
  return (
    (e.userData.showcase = {
      mixer: o,
      clips: l,
      timeScale: Sp,
    }),
    e
  );
}
function Dp(s, e, t, n, { frozen: i = !1, reduced: r = !1 } = {}) {
  let a = s.userData.showcase;
  if (!a) return;
  if (i) {
    a.mixer.setTime(0);
    return;
  }
  if (r) return;
  let o = n?.motion,
    l = !o?.dragging && t - (o?.lastInteraction ?? -1 / 0) > 2.2;
  (a.timeScale += ((l ? Sp : 0) - a.timeScale) * (1 - Math.exp(-e * 4))), a.mixer.update(e * a.timeScale);
}
function createWarmEnvironment(s) {
  let e = new Scene(),
    t = new Mesh(
      new SphereGeometry(20, 32, 20),
      new MeshBasicMaterial({
        color: new Color(0.075, 0.09, 0.11),
        side: BackSide,
      }),
    );
  e.add(t);
  let n = (r, a, o, l, c) => {
    let h = new Mesh(
      new PlaneGeometry(a, o),
      new MeshBasicMaterial({
        color: new Color(c).multiplyScalar(l),
        side: DoubleSide,
        toneMapped: !1,
      }),
    );
    h.position.fromArray(r), h.lookAt(0, 0.7, 0), e.add(h);
  };
  n([-3.8, 4.3, 5], 3.6, 5.5, 5.2, "#f7f8f5"),
    n([4.3, 1.5, 3.7], 2.6, 4.5, 1.4, "#d1dded"),
    n([0.2, 5, -4], 5.5, 2.2, 3.8, "#f6e5cf"),
    n([-2, -0.7, 4], 1.7, 0.7, 0.45, "#ffae5c");
  let i = s.fromScene(e, 0.02).texture;
  return (
    e.traverse((r) => {
      r.isMesh && (r.geometry.dispose(), r.material.dispose());
    }),
    i
  );
}
function mu(s, e, t, n, i) {
  (s.environment = i),
    (s.environmentIntensity = 0.76),
    (s.children.find((r) => r.isAmbientLight).intensity = 0.1),
    e.color.set("#f5f7f5"),
    (e.intensity = 1.65),
    e.position.set(-3.8, 5, 6),
    t.color.set("#d4e0ed"),
    (t.intensity = 0.4),
    t.position.set(4.5, 1.4, 4),
    n.color.set("#ffe1be"),
    (n.intensity = 1.1),
    n.position.set(1.7, 4, -4),
    (e.shadow.normalBias = 0.005);
}
var lt, Up, gu, Fp;
function Sn(s, e, t, n, i, r, a = 0, o = 0, l = 0) {
  let c = new Mesh(new RoundedBoxGeometry(e, t, n, r.userData.premium ? 6 : 4, i), r);
  return c.position.set(a, o, l), s.add(c), c;
}
function yi(s, e, t, n, i, r, a = 1, o = 1, l = 1) {
  let c = new Mesh(new SphereGeometry(e, t.userData.premium ? 64 : 24, t.userData.premium ? 40 : 16), t);
  return c.position.set(n, i, r), c.scale.set(a, o, l), s.add(c), c;
}
function Kc(s, e, t, n, i, r, a, o) {
  let l = new Mesh(new CylinderGeometry(e, t, n, 48), i);
  return l.position.set(r, a, o), s.add(l), l;
}
function Fv() {
  let s = document.createElement("canvas");
  s.width = s.height = 512;
  let e = s.getContext("2d");
  (e.fillStyle = "#27272a"), e.fillRect(0, 0, 512, 512);
  let t = 721,
    n = () => ((t = (t * 16807) % 2147483647), (t - 1) / 2147483646);
  for (let r = 0; r < 6500; r++) {
    let a = 26 + Math.floor(n() * 28);
    (e.fillStyle = `rgb(${a},${a},${a + 2})`), e.fillRect(n() * 512, n() * 512, n() * 7 + 1, n() * 3 + 1);
  }
  (e.strokeStyle = "#414146"), (e.lineWidth = 2);
  for (let r = 0; r < 13; r++) e.strokeRect(n() * 512, n() * 512, n() * 95 + 12, n() * 52 + 8);
  let i = new CanvasTexture(s);
  return (i.colorSpace = SRGBColorSpace), i;
}
var fS = Fv();
function Ei(s, e, t, n, i = 0, r = 0, a = 0) {
  let o = new Mesh(new TorusGeometry(e, t, 14, 72), n);
  return o.position.set(i, r, a), s.add(o), o;
}
var { ceramic: Jc, porcelain: Ia, graphite: Pa, alloy: Gi, orange: Si } = MATERIALS,
  pS = new MeshBasicMaterial({
    color: "#ff9e36",
  });
function kp(s = !1) {
  let e = document.createElement("canvas");
  e.width = e.height = 512;
  let t = e.getContext("2d"),
    n = t.createRadialGradient(256, 256, s ? 0 : 80, 256, 256, 246);
  n.addColorStop(0, s ? "#fff0b6" : "#241000"),
    n.addColorStop(0.28, "#ffba43"),
    n.addColorStop(0.62, "#ff790d"),
    n.addColorStop(0.86, "#c73700"),
    n.addColorStop(1, "#261006"),
    (t.fillStyle = n),
    t.fillRect(0, 0, 512, 512);
  for (let r = 14; r < 512; r += 11)
    for (let a = 14; a < 512; a += 11) {
      let o = Math.hypot(a - 256, r - 256) / 246;
      o > 0.3 && o < 0.96 && ((t.fillStyle = (a + r) % 33 === 0 ? "#ffc66555" : "#32100066"), t.fillRect(a, r, 7, 7));
    }
  (t.strokeStyle = "#ffba4855"), (t.lineWidth = 2);
  for (let r of [100, 132, 174, 214, 238]) t.beginPath(), t.arc(256, 256, r, 0, Math.PI * 2), t.stroke();
  let i = new CanvasTexture(e);
  return (i.colorSpace = SRGBColorSpace), i;
}
var mS = kp(),
  Op = kp(!0),
  Bp = () => (Yc() ? createReferenceHead() : createProceduralHead());
function createRobot() {
  if (Yc()) {
    let g = createReferenceRobot();
    return kv(g), g;
  }
  let s = new Group(),
    e = Bp(),
    t = new Group();
  e.position.set(0, 1.38, 0), s.add(e, t), yi(t, 1, Jc, 0, -0.59, -0.03, 0.72, 0.88, 0.57);
  let n = Kc(t, 0.265, 0.31, 0.25, Gi, 0, 0.3, 0);
  Ei(t, 0.292, 0.016, Si, 0, 0.28, 0).rotation.x = Math.PI / 2;
  let i = Kc(t, 0.57, 0.5, 0.18, Pa, 0, -1.27, -0.025),
    r = Ei(t, 0.565, 0.018, Si, 0, -1.2, -0.025);
  (r.rotation.x = Math.PI / 2), (r.scale.z = 0.88);
  let a = new Group();
  a.position.set(0, -0.62, 0.61), t.add(a), Ei(a, 0.268, 0.03, Gi), Ei(a, 0.234, 0.023, Si, 0, 0, 0.025);
  let o = new Mesh(
    new CircleGeometry(0.21, 96),
    new MeshPhysicalMaterial({
      map: Op,
      color: "#361806",
      emissiveMap: Op,
      emissive: "#ffffff",
      emissiveIntensity: 1.12,
      metalness: 0.08,
      roughness: 0.36,
    }),
  );
  (o.position.z = 0.029),
    a.add(o),
    yi(
      a,
      0.176,
      new MeshBasicMaterial({
        color: "#ffbd50",
        transparent: !0,
        opacity: 0.09,
      }),
      0,
      0,
      0.071,
      1,
      1,
      0.25,
    ),
    Sn(t, 0.27, 0.045, 0.055, 0.018, Gi, 0, 0.085, 0.397),
    Sn(t, 0.15, 0.018, 0.018, 0.006, Si, 0, 0.095, 0.438);
  let l = [],
    c = [];
  for (let g of [-1, 1]) {
    let p = new Group();
    p.position.set(g * 0.77, -0.15, 0),
      s.add(p),
      l.push(p),
      yi(p, 0.222, Gi, 0, 0, 0),
      yi(p, 0.225, Ia, g * 0.065, 0.005, 0.055, 1, 0.95, 0.9);
    let y = Ei(p, 0.164, 0.012, Si, g * 0.065, 0.005, 0.22),
      v = Kc(p, 0.095, 0.112, 0.54, Ia, g * 0.16, -0.33, 0);
    (v.rotation.z = g * 0.23),
      yi(p, 0.145, Gi, g * 0.233, -0.596, 0),
      yi(p, 0.24, Jc, g * 0.27, -0.864, 0.009, 0.83, 1.52, 0.88);
    let x = Ei(p, 0.154, 0.014, Si, g * 0.27, -1.11, 0.013);
    (x.rotation.x = Math.PI / 2),
      yi(p, 0.153, Ia, g * 0.27, -1.226, 0.037, 1.06, 0.8, 0.8),
      Sn(p, 0.067, 0.12, 0.085, 0.026, Jc, g * 0.43, -1.25, 0.071),
      (p.rotation.z = g * 0.12);
    let w = new Group();
    w.position.set(g * 0.36, -1.47, -0.01),
      s.add(w),
      c.push(w),
      yi(w, 0.185, Gi, 0, 0, 0),
      Kc(w, 0.073, 0.09, 0.39, Ia, 0, -0.225, 0.035),
      yi(w, 0.13, Ia, 0, -0.435, 0.053),
      Ei(w, 0.101, 0.011, Si, 0, -0.43, 0.135),
      Sn(w, 0.36, 0.23, 0.59, 0.1, Jc, 0, -0.615, 0.14),
      Sn(w, 0.34, 0.048, 0.52, 0.018, Pa, 0, -0.746, 0.145);
  }
  Zf({
    torso: t,
    arms: l,
    legs: c,
    core: a,
  }),
    qf(l),
    (a.userData.isChestControl = !0);
  let h = new Group();
  s.add(h);
  let u = [],
    d = [
      [-1.4, 0.27, -0.15],
      [1.4, 0.29, -0.15],
      [-1.33, -0.63, -0.12],
      [1.36, -0.66, -0.12],
      [-0.85, -1.4, -0.08],
      [0.88, -1.42, -0.08],
    ];
  for (let g = 0; g < 6; g++) {
    let p = new Group();
    p.position.fromArray(d[g]),
      h.add(p),
      Sn(p, 0.57, 0.4, 0.23, 0.075, Pa),
      Sn(p, 0.46, 0.29, 0.025, 0.055, Gi, 0, 0, 0.13);
    for (let y = 0; y < 3; y++) Sn(p, 0.035, 0.17, 0.009, 0.008, Si, -0.115 + y * 0.115, 0, 0.152);
    u.push(p);
  }
  let f = new Group();
  s.add(f);
  let m = new LineBasicMaterial({
    color: "#ff7321",
    transparent: !0,
    opacity: 0.58,
  });
  for (let g = 0; g < 8; g++) {
    let p = new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]), m);
    f.add(p);
  }
  let b = Ei(
    s,
    1.22,
    0.007,
    new MeshBasicMaterial({
      color: "#a44b1c",
      transparent: !0,
      opacity: 0.5,
    }),
    0,
    -2.25,
    0,
  );
  return (
    (b.rotation.x = Math.PI / 2),
    (b.userData.noninteractive = !0),
    (s.userData = {
      head: e,
      torso: t,
      core: a,
      coreLight: o,
      arms: l,
      legs: c,
      modules: h,
      parts: u,
      wires: f,
      ground: b,
      eyes: e.userData.optics,
      pupils: e.userData.pupils,
    }),
    s
  );
}
function kv(s) {
  let e = new Group(),
    t = new Group(),
    n = [];
  s.add(e, t),
    [
      [-1.4, 0.27, -0.15],
      [1.4, 0.29, -0.15],
      [-1.33, -0.63, -0.12],
      [1.36, -0.66, -0.12],
      [-0.85, -1.4, -0.08],
      [0.88, -1.42, -0.08],
    ].forEach((o) => {
      let l = new Group();
      l.position.fromArray(o),
        e.add(l),
        n.push(l),
        Sn(l, 0.57, 0.4, 0.23, 0.075, Pa),
        Sn(l, 0.46, 0.29, 0.025, 0.055, Gi, 0, 0, 0.13);
      for (let c = 0; c < 3; c++) Sn(l, 0.035, 0.17, 0.009, 0.008, Si, -0.115 + c * 0.115, 0, 0.152);
    });
  let r = new LineBasicMaterial({
    color: "#ff7321",
    transparent: !0,
    opacity: 0.58,
  });
  for (let o = 0; o < 8; o++) t.add(new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]), r));
  let a = Ei(
    s,
    1.22,
    0.007,
    new MeshBasicMaterial({
      color: "#a44b1c",
      transparent: !0,
      opacity: 0.5,
    }),
    0,
    -2.25,
    0,
  );
  (a.rotation.x = Math.PI / 2),
    (a.userData.noninteractive = !0),
    Object.assign(s.userData, {
      modules: e,
      wires: t,
      parts: n,
      ground: a,
    });
}
function setExplode(s, e) {
  let t = s.userData;
  if (t.reference && t.head) return Ip(s, e);
  if (!t.head) return;
  (t.head.position.y = 1.38 + e * 1.03),
    (t.head.userData.face.position.z = e * 0.7),
    (t.head.userData.shell.position.z = -e * 0.46),
    (t.core.position.z = 0.61 + e * 0.82),
    (t.modules.visible = e > 0.005),
    t.modules.scale.setScalar(Math.max(0.001, e)),
    (t.wires.visible = e > 0.03),
    t.arms.forEach((i, r) => {
      i.position.x = (r === 0 ? -1 : 1) * (0.77 + e * 0.53);
    }),
    t.legs.forEach((i) => (i.position.y = -1.47 - e * 0.25));
  let n = [t.head.position, ...t.parts.map((i) => i.position), new Vector3(0, -1.45 - e * 0.25, 0)];
  t.wires.children.forEach((i, r) => {
    let a = n[r],
      o = i.geometry.attributes.position;
    o.setXYZ(0, 0, -0.61, 0.35), o.setXYZ(1, a.x * e, a.y, 0.08), (o.needsUpdate = !0), (i.material.opacity = e * 0.5);
  });
}
function createNetwork() {
  let s = new Group(),
    e = [
      [-2.1, 1, -0.9],
      [2.1, 1, -0.9],
      [0, -0.3, 0.45],
      [-1.83, -1.37, -0.3],
      [1.83, -1.37, -0.3],
    ];
  for (let t = 0; t < 5; t++) {
    let n = createRobot();
    if (
      (n.scale.setScalar(t === 2 ? 0.48 : 0.37),
      n.position.fromArray(e[t]),
      setExplode(n, 0),
      (n.userData.ground.visible = !1),
      s.add(n),
      t !== 2)
    ) {
      let i = new QuadraticBezierCurve3(
        new Vector3(0, -0.3, 0.1),
        new Vector3(e[t][0] * 0.5, e[t][1], -0.65),
        new Vector3(...e[t]),
      );
      s.add(
        new Mesh(
          new TubeGeometry(i, 30, 0.01, 6, !1),
          new MeshBasicMaterial({
            color: "#ee651b",
            transparent: !0,
            opacity: 0.5,
          }),
        ),
      );
    }
  }
  return s;
}
function fillCrowd(view) {
  if (!view || view.type !== "robot" || view.extras.children.length) return;
  for (let d = 0; d < 4; d++) {
    let f = createRobot();
    f.scale.setScalar(0.4), setExplode(f, 0), (f.userData.ground.visible = !1), view.extras.add(f);
  }
}
function createView(s) {
  let e = new Scene();
  (e.environment = Up), (e.environmentIntensity = 0.78), e.add(new AmbientLight("#efe5d2", 0.5));
  let t = new DirectionalLight("#fff5e3", 3.4);
  t.position.set(-4, 6, 6), e.add(t);
  let n = new DirectionalLight("#dde4e5", 1.4);
  n.position.set(4, 2, 5), e.add(n);
  let i = new DirectionalLight("#ff862f", 1.15);
  i.position.set(1, 2, -4), e.add(i);
  let r = s.startsWith("showcase-"),
    a = r
      ? createShowcase(s.slice(9))
      : s === "robot" || s === "portrait"
        ? createRobot()
        : s === "head"
          ? Bp()
          : s === "network"
            ? createNetwork()
            : createModule(s, wp());
  e.add(a),
    a &&
      ((e.children.find((d) => d.isAmbientLight).intensity = 0.24),
      (t.intensity = 2.55),
      (n.intensity = 0.95),
      (i.intensity = 0.8),
      (e.environmentIntensity = 0.86),
      (t.castShadow = !0),
      t.shadow.mapSize.set(1024, 1024),
      (t.shadow.camera.left = t.shadow.camera.bottom = -5),
      (t.shadow.camera.right = t.shadow.camera.top = 5),
      (t.shadow.camera.near = 0.1),
      (t.shadow.camera.far = 24),
      (t.shadow.bias = -15e-5),
      (t.shadow.normalBias = 0.012),
      (t.shadow.radius = 3),
      a.traverse((d) => {
        d.isMesh &&
          ((d.castShadow =
            !d.material.transparent && !((r || a.userData.premiumModule) && d.material.transmission > 0.5)),
          (d.receiveShadow = d.castShadow));
      }));
  let o = new PerspectiveCamera(33, 1, 0.1, 80);
  ["robot", "portrait", "head", "network"].includes(s) && mu(e, t, n, i, gu),
    a.userData.premiumModule && mu(e, t, n, i, gu),
    o.position.set(0, 0.5, 8.7),
    s === "robot" && o.position.set(0, 0.68, 10.6),
    s === "portrait" && o.position.set(0, 1.3, 9.3),
    s === "network" && o.position.set(0, 0, 11.6),
    r && (o.position.set(0, 0.18, 6.65), (e.background = new Color("#000000")), vp(e, t, n, i, Fp)),
    o.lookAt(0, s === "portrait" ? 0.7 : 0, 0);
  let l = new Group();
  e.add(l), s === "robot" && (l.visible = !1);
  let c = new Group();
  if ((e.add(c), s === "robot")) {
    for (let d = 0; d < 5; d++) {
      let f = new Group(),
        m = ["\u2301", "\u2318", "\u2733", "\u25A6", "\u2197"][d];
      Sn(f, 0.54, 0.54, 0.15, 0.12, Pa);
      let b = document.createElement("canvas");
      b.width = b.height = 128;
      let g = b.getContext("2d");
      (g.fillStyle = "#ff8b38"),
        (g.textAlign = "center"),
        (g.textBaseline = "middle"),
        (g.font = "64px Arial"),
        g.fillText(m, 64, 65);
      let p = new CanvasTexture(b);
      p.colorSpace = SRGBColorSpace;
      let y = new Mesh(
        new PlaneGeometry(0.4, 0.4),
        new MeshBasicMaterial({
          map: p,
          transparent: !0,
        }),
      );
      (y.position.z = 0.085), f.add(y), c.add(f);
    }
    c.visible = !1;
  }
  let h = new Group();
  if ((e.add(h), s === "robot"))
    for (let d = 0; d < 4; d++)
      h.add(
        new Line(
          new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]),
          new LineBasicMaterial({
            color: "#ff731e",
            transparent: !0,
            opacity: 0,
          }),
        ),
      );
  let u = new Group();
  if ((e.add(u), s === "robot"))
    for (let d = 0; d < 5; d++)
      u.add(
        new Line(
          new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]),
          new LineBasicMaterial({
            color: "#ff731e",
            transparent: !0,
            opacity: 0,
          }),
        ),
      );
  return {
    scene: e,
    model: a,
    camera: o,
    type: s,
    extras: l,
    toolsGroup: c,
    networkLines: h,
    toolLines: u,
  };
}
function smoothstep(s, e, t) {
  let n = MathUtils.clamp((t - s) / (e - s), 0, 1);
  return n * n * (3 - 2 * n);
}
function lerp(s, e, t) {
  return s + (e - s) * t;
}
async function startEngine() {
  if (new URLSearchParams(location.search).has("fallback")) throw new Error("Static preview requested");
  (lt = new WebGLRenderer({
    alpha: !0,
    antialias: !0,
    powerPreference: "high-performance",
    preserveDrawingBuffer: !0,
  })),
    (lt.domElement.id = "webgl"),
    (lt.domElement.style.opacity = "0"),
    lt.setPixelRatio(Math.min(devicePixelRatio, 1.6)),
    lt.setSize(innerWidth, innerHeight),
    lt.setClearColor(0, 0),
    (lt.autoClear = !1),
    (lt.shadowMap.enabled = !0),
    (lt.shadowMap.type = PCFSoftShadowMap),
    (lt.outputColorSpace = SRGBColorSpace),
    (lt.toneMapping = ACESFilmicToneMapping),
    (lt.toneMappingExposure = 0.88),
    document.body.appendChild(lt.domElement);
  let s = new PMREMGenerator(lt),
    e = new RoomEnvironment();
  (Up = s.fromScene(e, 0.04).texture),
    (gu = createWarmEnvironment(s)),
    (Fp = createCoolEnvironment(s)),
    e.dispose(),
    s.dispose();
  try {
    await loadMasters();
  } catch (u) {
    console.warn("Higgsfield masters could not load; retaining the existing 3D assets.", u);
  }
  Yc() &&
    document.querySelectorAll(".story-image[data-asset]").forEach((u) => {
      u.style.background = "#000";
      let d = document.createElement("div");
      (d.className = "scene"),
        (d.dataset.model = `showcase-${u.dataset.asset}`),
        (d.style.cssText = "position:absolute;inset:0 auto 0 0;width:62%;height:100%;z-index:1"),
        d.setAttribute("aria-label", `${u.dataset.asset} \u2014 interactive 3D collectible`);
      let f = u.querySelector("img");
      f && (f.style.opacity = "0"), u.prepend(d);
    });
  let t = [],
    n = new ExpressionController(),
    i = new VoicePlayer(),
    r = () => {
      i.stop(), n.finish();
    };
  document.addEventListener("visibilitychange", () => {
    document.hidden && r();
  }),
    window.addEventListener("pagehide", r);
  let attached = new Set(),
    sceneQueue = [];
  function attachScene(u) {
    if (attached.has(u)) return;
    attached.add(u);
    let d = document.createElement("canvas");
    (d.style.cssText = "width:100%;height:100%;display:block"),
      d.setAttribute("aria-hidden", "true"),
      u.appendChild(d);
    let f = u.closest(".product"),
      m = f && f.id !== "product-0" ? f.nextElementSibling : null,
      view = {
        el: u,
        canvas: d,
        coveringProduct: m,
        ctx: d.getContext("2d"),
        ...createView(u.dataset.model),
      },
      gaze = ["robot", "portrait", "head", "network"].includes(view.type);
    (view.gaze = gaze ? createGaze(view) : null),
      (view.interaction = createInteraction(view, n, i)),
      (view.moduleInteraction = createModuleInteraction(view)),
      t.push(view);
    if (view.type === "robot" && view.model) {
      let rest = [],
        kept = 0;
      view.model.traverse((node) => {
        if (!node.isMesh) return;
        if (kept < 8) kept++;
        else (node.visible = !1), rest.push(node);
      });
      if (rest.length) {
        view.pendingMeshes = rest;
        view.canvas.style.opacity = "0";
        view.canvas.style.transition = "opacity .2s ease";
      }
    }
  }
  let draining = false;
  function drainScenes() {
    if (draining) return;
    draining = true;
    let step = () => {
      let node = sceneQueue.shift();
      if (!node) {
        draining = false;
        return;
      }
      attachScene(node);
      if (!sceneQueue.length) {
        draining = false;
        return;
      }
      setTimeout(step, 180);
    };
    step();
  }
  let sceneNodes = [...document.querySelectorAll(".scene")].sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    ),
    sceneObserver = new IntersectionObserver(
      (entries) => {
        let added = false;
        for (let entry of entries) {
          if (!entry.isIntersecting || attached.has(entry.target)) continue;
          sceneObserver.unobserve(entry.target);
          sceneQueue.push(entry.target), (added = true);
        }
        added && drainScenes();
      },
      { rootMargin: "400px 0px" },
    );
  sceneNodes[0] && attachScene(sceneNodes[0]);
  for (let node of sceneNodes) if (!attached.has(node)) sceneObserver.observe(node);
  let a = performance.now(),
    o = 0,
    l = !1;
  window.addEventListener("resize", () => {
    lt.setSize(innerWidth, innerHeight), lt.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  });
  let c = matchMedia("(prefers-reduced-motion: reduce)");
  lt.domElement.addEventListener("webglcontextlost", (u) => {
    u.preventDefault(), (l = !0);
  }),
    lt.domElement.addEventListener("webglcontextrestored", () => (l = !1));
  function h(u) {
    if ((requestAnimationFrame(h), l || document.hidden)) return;
    let d = Math.min((u - a) / 1e3, 0.04);
    (a = u), (o += d);
    let f = !!stage.capture,
      m = f || c.matches ? 1.7 : o,
      b = stage.reaction || "",
      g = n.step(d, {
        hovered: t.some((p) => p.interaction?.chestHover),
        pressed: t.some((p) => p.interaction?.pressed),
        reduced: c.matches,
        frozen: f,
        playback: i.sample(),
      });
    lt.setScissorTest(!1), lt.clear(!0, !0, !0), lt.setScissorTest(!0);
    for (let p of t) {
      let y = p.el.getBoundingClientRect();
      if (
        y.bottom <= 0 ||
        y.top >= innerHeight ||
        y.right <= 0 ||
        y.left >= innerWidth ||
        y.width === 0 ||
        y.height === 0 ||
        (p.coveringProduct && p.coveringProduct.getBoundingClientRect().top <= y.top)
      )
        continue;
      if (p.pendingMeshes) {
        if (p.pendingReady) (p.canvas.style.opacity = "1"), (p.pendingMeshes = null);
        else if (p.pendingMeshes.length) {
          for (let mesh of p.pendingMeshes.splice(0, 6)) mesh.visible = !0;
          p.pendingMeshes.length || (p.pendingReady = !0);
        }
      }
      (p.camera.aspect = y.width / y.height), p.camera.updateProjectionMatrix();
      let v = p.model.userData,
        x = p.gaze?.step(d);
      if (
        ((p.model.position.y = Math.sin(1.7 * 0.85) * 0.025), p.model.rotation.set(0, -0.12, 0), p.type === "robot")
      ) {
        let O = stage.capturePhase !== void 0 ? stage.capturePhase : stage.storyProgress || 0,
          k = smoothstep(0.13, 0.9, O) * (1 - smoothstep(1.2, 1.88, O)),
          W = smoothstep(1.28, 1.98, O) * (1 - smoothstep(2.18, 2.92, O)),
          q = smoothstep(2.62, 3.03, O) * (1 - smoothstep(3.32, 3.91, O)),
          H = smoothstep(3.25, 4, O),
          te = smoothstep(1.04, 1.8, O) * (1 - smoothstep(2.15, 3, O));
        p.camera.position.set(0, lerp(0.58, 1.45, k), 10.6 - k * 4.7 + W * 2.7 + H * 4.7),
          p.camera.lookAt(0, 0.05 + k * 1.37 + W * 0.6, 0),
          (p.model.rotation.y = -0.12 + Math.sin(1.7 * 0.3) * 0.04 - te * 0.6),
          (p.model.position.x = -H * 0.1),
          p.model.scale.setScalar(1 - H * 0.4),
          setExplode(p.model, W),
          (p.extras.visible = H > 0.005 || b === "agents");
        p.extras.visible && fillCrowd(p);
        let G = b === "agents" ? Math.max(0.35, H) : H,
          he = [
            [-2.7, 1.3, -0.75],
            [2.7, 1.3, -0.75],
            [-2.75, -1.34, -0.2],
            [2.75, -1.34, -0.2],
          ];
        p.extras.children.forEach((ce, pe) => {
          ce.position.set(he[pe][0] * G, he[pe][1] * G, he[pe][2]),
            ce.scale.setScalar(0.4 * G),
            (ce.rotation.y = pe % 2 === 0 ? 0.16 : -0.16);
        }),
          (p.toolsGroup.visible = q > 0.01 || b === "tools"),
          p.toolsGroup.children.forEach((ce, pe) => {
            let Pe = (pe / 5) * Math.PI * 2 + m * 0.12;
            ce.position.set(Math.cos(Pe) * 2.65, 0.25 + Math.sin(Pe) * 1.72, 0.05 + Math.sin(Pe) * 0.7),
              ce.scale.setScalar(Math.max(q, b === "tools" ? 1 : 0)),
              (ce.rotation.y = Math.sin(Pe) * 0.17);
          }),
          p.toolLines.children.forEach((ce, pe) => {
            let Pe = p.toolsGroup.children[pe].position,
              We = ce.geometry.attributes.position;
            We.setXYZ(0, 0, -0.62, 0.65),
              We.setXYZ(1, Pe.x, Pe.y, Pe.z),
              (We.needsUpdate = !0),
              (ce.material.opacity = p.toolsGroup.visible ? 0.23 + 0.13 * Math.sin(m * 3 + pe) : 0);
          }),
          p.networkLines.children.forEach((ce, pe) => {
            let crowd = p.extras.children[pe];
            if (!crowd) return;
            let Pe = crowd.position,
              We = ce.geometry.attributes.position;
            We.setXYZ(0, 0, -0.25, 0.05),
              We.setXYZ(1, Pe.x, Pe.y, Pe.z),
              (We.needsUpdate = !0),
              (ce.material.opacity = G * 0.5);
          });
      } else if (p.type === "portrait")
        setExplode(p.model, 0),
          p.camera.position.set(0, 1.25, 9.1),
          p.camera.lookAt(0, 0.7, 0),
          (p.model.rotation.y = 0.08 + Math.sin(1.7 * 0.3) * 0.06);
      else if (p.type === "head")
        (p.model.rotation.y = -0.08 + Math.sin(1.7 * 0.3) * 0.1),
          p.camera.position.set(0, 0, 7.8),
          p.camera.lookAt(0, 0, 0);
      else if (p.type === "network") (p.model.rotation.y = Math.sin(1.7 * 0.18) * 0.12), p.camera.lookAt(0, 0, 0);
      else {
        let O = p.moduleInteraction,
          k = O.motion.step(d, u / 1e3, f && !O.interacted, c.matches);
        p.model.rotation.set(k.pitch, k.yaw, k.roll),
          p.model.position.set(0, k.y, k.z),
          p.type.startsWith("showcase-") &&
            Dp(p.model, d, u / 1e3, O, {
              frozen: f,
              reduced: c.matches,
            });
      }
      if (p.interaction) {
        let O = p.interaction.motion.step(d, c.matches);
        (p.model.userData.reference ? applyReferencePose : applyProceduralPose)(
          p,
          g,
          p.interaction.motion.dragging ? null : x,
          O,
          d,
        ),
          p.model.updateWorldMatrix(!0, !0),
          p.interaction.updateButton();
      }
      lt.setViewport(y.left, innerHeight - y.bottom, y.width, y.height),
        lt.setScissor(
          Math.max(0, y.left),
          Math.max(0, innerHeight - y.bottom),
          Math.min(innerWidth, y.right) - Math.max(0, y.left),
          Math.min(innerHeight, y.bottom) - Math.max(0, y.top),
        ),
        lt.clear(!0, !0, !0),
        lt.render(p.scene, p.camera);
      let w = lt.getPixelRatio(),
        M = Math.round(y.width * w),
        R = Math.round(y.height * w);
      (p.canvas.width !== M || p.canvas.height !== R) && ((p.canvas.width = M), (p.canvas.height = R)),
        p.ctx.clearRect(0, 0, M, R);
      let L = Math.max(0, y.left),
        T = Math.max(0, y.top),
        E = Math.min(innerWidth, y.right) - L,
        P = Math.min(innerHeight, y.bottom) - T;
      E > 0 &&
        P > 0 &&
        p.ctx.drawImage(lt.domElement, L * w, T * w, E * w, P * w, (L - y.left) * w, (T - y.top) * w, E * w, P * w);
    }
  }
  requestAnimationFrame(h),
    (stage.render = {
      views: t,
      renderer: lt,
    });
}
export { startEngine };
