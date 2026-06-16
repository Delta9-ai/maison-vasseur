"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    THREE: any
  }
}

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: any
    scene: any
    renderer: any
    uniforms: any
    animationId: number | null
  }>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
  })
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Load Three.js dynamically
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"
    script.onload = () => {
      if (containerRef.current && window.THREE) {
        initThreeJS()
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose()
      }
      cleanupRef.current?.()
      document.head.removeChild(script)
    }
  }, [])

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return

    const THREE = window.THREE
    const container = containerRef.current

    // Clear any existing content
    container.innerHTML = ""

    // Initialize camera
    const camera = new THREE.Camera()
    camera.position.z = 1

    // Initialize scene
    const scene = new THREE.Scene()

    // Create geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2)

    // Historique des positions de la souris : on dessine un halo dégradé le
    // long de ces points (du plus récent au plus ancien) pour obtenir une
    // traînée de comète qui suit le curseur et s'estompe derrière lui.
    // Initialisé hors champ (9,9) pour qu'aucun halo n'apparaisse avant le
    // premier mouvement.
    const TRAIL_LENGTH = 18
    const trailVecs: Array<{ set: (x: number, y: number) => void; copy: (v: unknown) => void }> = []
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailVecs.push(new THREE.Vector2(9, 9))
    }

    // Define uniforms
    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      // Position lissée de la souris (tête de la traînée), même repère que `uv`.
      mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
      // Sillage : positions successives du curseur.
      mouseTrail: { type: "v2v", value: trailVecs },
      // 0 tant que la souris n'a pas bougé -> aucun effet au repos.
      mouseActive: { type: "f", value: 0.0 },
    }

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      #define TRAIL 18

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;
      uniform vec2 mouseTrail[TRAIL];
      uniform float mouseActive;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      varying vec2 vUv;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        // UV brut (avant mosaïque) conservé pour dessiner la traînée nette.
        vec2 sUv = uv;

        // Léger remous qui suit la tête de la traînée (désactivé au repos).
        vec2 toMouse = uv - mouse;
        float md = length(toMouse);
        float infl = exp(-md * md * 1.4);
        uv += (toMouse / max(md, 1e-3)) * infl * 0.05 * mouseActive;

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;

        // Distance avec l'axe Y aplati : les iso-distances deviennent des
        // stries verticales qui se dispersent sur toute la largeur de la page,
        // au lieu de se concentrer en une colonne centrale (motif radial).
        float d = length(vec2(uv.x, uv.y * 0.32));

        float glow = 0.0;
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            glow += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - d);
          }
        }
        glow *= 0.5;

        // Single-accent palette: ink background, vetiver lines, bone-hot cores.
        vec3 vetiverDeep = vec3(0.184, 0.420, 0.310);
        vec3 vetiver     = vec3(0.227, 0.561, 0.388);
        vec3 bone        = vec3(0.925, 0.906, 0.866);

        vec3 col = mix(vetiverDeep, vetiver, clamp(glow, 0.0, 1.0)) * glow;
        col = mix(col, bone, clamp(glow - 1.2, 0.0, 1.0));

        // --- Traînée de comète ---
        // Halo cumulé le long de l'historique du curseur : le point le plus
        // récent (k=0) brille le plus, les plus anciens s'estompent -> sillage.
        float trail = 0.0;
        for (int k = 0; k < TRAIL; k++) {
          float fade = 1.0 - float(k) / float(TRAIL);
          float dd = length(sUv - mouseTrail[k]);
          trail += fade * fade * 0.0019 / (dd * dd + 0.0011);
        }
        trail = clamp(trail * mouseActive, 0.0, 1.5);

        // Sillage vetiver, cœur tirant vers le bone incandescent.
        col += vetiver * trail * 0.8;
        col = mix(col, bone, clamp(trail - 0.65, 0.0, 1.0));

        gl_FragColor = vec4(col, 1.0);
      }
    `

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Store references
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
    }

    // Handle resize
    const onWindowResize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Suivi de la souris (cible + valeur lissée pour un mouvement organique).
    // On normalise dans le même repère que `uv` du shader : centré et divisé
    // par le plus petit côté, avec l'axe Y inversé (origine bas-gauche en GL).
    const mouseTarget = { x: 0, y: 0 }
    const mouseCurrent = { x: 0, y: 0 }
    let seeded = false

    // Écouté sur window (pas sur le container) car le shader est en -z-10,
    // sous le texte du Hero : sinon le survol du titre ne déclencherait rien.
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const minSide = Math.min(rect.width, rect.height)
      mouseTarget.x = ((e.clientX - rect.left) * 2 - rect.width) / minSide
      mouseTarget.y = -(((e.clientY - rect.top) * 2 - rect.height) / minSide)
      // Premier mouvement : on amorce tête + sillage sur place (pas de saut
      // depuis le centre) et on active l'effet.
      if (!seeded) {
        seeded = true
        mouseCurrent.x = mouseTarget.x
        mouseCurrent.y = mouseTarget.y
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trailVecs[i].set(mouseTarget.x, mouseTarget.y)
        }
        uniforms.mouseActive.value = 1.0
      }
    }
    window.addEventListener("pointermove", onPointerMove)
    cleanupRef.current = () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("resize", onWindowResize, false)
    }

    // Animation loop
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      // Tête réactive (le sillage, lui, naît du retard de l'historique).
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.18
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.18
      uniforms.mouse.value.set(mouseCurrent.x, mouseCurrent.y)
      // Décale l'historique d'un cran puis insère la position courante en tête
      // -> chaque image laisse une trace derrière le curseur (effet comète).
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        trailVecs[i].copy(trailVecs[i - 1])
      }
      trailVecs[0].set(mouseCurrent.x, mouseCurrent.y)
      renderer.render(scene, camera)
    }

    animate()
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute"
    />
  )
}
