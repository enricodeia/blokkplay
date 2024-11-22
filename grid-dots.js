document.addEventListener("DOMContentLoaded",function(){if("undefined"!=typeof THREE){let e={r:90,g:90,b:90},t={r:133,g:100,b:250},i={r:200,g:200,b:200},n=new THREE.Scene,o=new THREE.OrthographicCamera(-(window.innerWidth/2),window.innerWidth/2,window.innerHeight/2,-(window.innerHeight/2),-1e3,1e3);o.position.z=1;let r=new THREE.WebGLRenderer({canvas:document.getElementById("dots-canvas"),antialias:!0,alpha:!0});function a(e,t,i){let n=[];for(let o=-e/2;o<=e/2;o+=i)for(let r=-t/2;r<=t/2;r+=i)n.push(o,r,0);return new Float32Array(n)}r.setSize(window.innerWidth,window.innerHeight),r.setPixelRatio(window.devicePixelRatio);let s=new THREE.BufferGeometry;s.setAttribute("position",new THREE.Float32BufferAttribute(a(window.innerWidth,window.innerHeight,50),3));let u=new THREE.PointsMaterial({color:`rgb(${e.r},${e.g},${e.b})`,size:1,sizeAttenuation:!1,transparent:!0}),$=new THREE.Points(s,u);n.add($);let l=new THREE.BufferGeometry;l.setAttribute("position",new THREE.Float32BufferAttribute(a(window.innerWidth,window.innerHeight,50),3));let d=new THREE.ShaderMaterial({uniforms:{u_mouse:{value:new THREE.Vector2(-2e3,-2e3)},u_time:{value:0},u_interactionRadius:{value:400},u_intensity:{value:0}},vertexShader:`
        precision mediump float;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_interactionRadius;
        varying float v_distance;
        void main() {
          vec2 pos = position.xy;
          float distance = length(pos - u_mouse);
          v_distance = distance;
          float size = mix(1.0, 16.0, 1.0 - smoothstep(0.0, u_interactionRadius, distance));
          size *= 1.0 + 0.3 * sin(u_time * 2.0 + distance * 0.02);
          gl_PointSize = size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        precision mediump float;
        varying float v_distance;
        uniform vec2 u_mouse;
        uniform float u_interactionRadius;
        uniform float u_intensity;
        void main() {
          float normalizedDistance = smoothstep(0.0, u_interactionRadius, v_distance);
          vec3 centerColor = vec3(${t.r/255}, ${t.g/255}, ${t.b/255});
          vec3 outerColor = vec3(${i.r/255}, ${i.g/255}, ${i.b/255});
          vec3 color = mix(centerColor, outerColor, normalizedDistance);
          color = pow(color, vec3(1.2));
          float alpha = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - vec2(0.5)));
          gl_FragColor = vec4(color, alpha);
        }
      `,transparent:!0,blending:THREE.AdditiveBlending,depthTest:!1}),c=new THREE.Points(l,d);n.add(c);let m=new THREE.Vector2(-2e3,-2e3),f=new THREE.Clock,v=0,g=Date.now();function p(){let e=window.innerWidth,t=window.innerHeight;o.left=-(e/2),o.right=e/2,o.top=t/2,o.bottom=-(t/2),o.updateProjectionMatrix(),r.setSize(e,t);let i=a(e,t,50);$.geometry.setAttribute("position",new THREE.Float32BufferAttribute(i,3)),$.geometry.attributes.position.needsUpdate=!0,c.geometry.setAttribute("position",new THREE.Float32BufferAttribute(i,3)),c.geometry.attributes.position.needsUpdate=!0}document.addEventListener("mousemove",e=>{let t=e.clientX-window.innerWidth/2,i=-(e.clientY-window.innerHeight/2);m.set(t,i),v=1,g=Date.now()}),document.getElementById("dots-canvas").addEventListener("mouseleave",()=>{v=0}),!function e(){requestAnimationFrame(e);let t=f.getDelta();d.uniforms.u_time.value+=t,function e(t){let i=Date.now();i-g>1500?d.uniforms.u_interactionRadius.value+=(50-d.uniforms.u_interactionRadius.value)*Math.min(.5*t,1):d.uniforms.u_interactionRadius.value+=(400-d.uniforms.u_interactionRadius.value)*Math.min(.5*t,1),d.uniforms.u_mouse.value.lerp(m,.05),d.uniforms.u_intensity.value+=(v-d.uniforms.u_intensity.value)*Math.min(2*t,1)}(t),r.render(n,o)}(),window.addEventListener("resize",p),p()}else console.error("Three.js is not loaded. Please include Three.js in your HTML.")});
