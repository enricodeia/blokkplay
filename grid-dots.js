function isMobile(){return/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}document.addEventListener("DOMContentLoaded",function(){if("undefined"!=typeof THREE){let e={r:90,g:90,b:90},t=new THREE.Scene,i=new THREE.OrthographicCamera(-(window.innerWidth/2),window.innerWidth/2,window.innerHeight/2,-(window.innerHeight/2),-1e3,1e3);i.position.z=1;let n=new THREE.WebGLRenderer({canvas:document.getElementById("dots-canvas"),antialias:!0,alpha:!0});function o(e,t,i){let n=[];for(let o=-e/2;o<=e/2;o+=i)for(let r=-t/2;r<=t/2;r+=i)n.push(o,r,0);return new Float32Array(n)}n.setSize(window.innerWidth,window.innerHeight),n.setPixelRatio(window.devicePixelRatio);let r=new THREE.BufferGeometry;r.setAttribute("position",new THREE.Float32BufferAttribute(o(window.innerWidth,window.innerHeight,50),3));let a=new THREE.PointsMaterial({color:`rgb(${e.r},${e.g},${e.b})`,size:1,sizeAttenuation:!1,transparent:!0}),s=new THREE.Points(r,a);if(t.add(s),isMobile())!function e(){requestAnimationFrame(e),n.render(t,i)}();else{let l={r:133,g:100,b:250},u={r:200,g:200,b:200},$=new THREE.BufferGeometry;$.setAttribute("position",new THREE.Float32BufferAttribute(o(window.innerWidth,window.innerHeight,50),3));let d=new THREE.ShaderMaterial({uniforms:{u_mouse:{value:new THREE.Vector2(-2e3,-2e3)},u_time:{value:0},u_interactionRadius:{value:400},u_intensity:{value:0}},vertexShader:`
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
            vec3 centerColor = vec3(${l.r/255}, ${l.g/255}, ${l.b/255});
            vec3 outerColor = vec3(${u.r/255}, ${u.g/255}, ${u.b/255});
            vec3 color = mix(centerColor, outerColor, normalizedDistance);
            color = pow(color, vec3(1.2));
            float alpha = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - vec2(0.5)));
            gl_FragColor = vec4(color, alpha);
          }
        `,transparent:!0,blending:THREE.AdditiveBlending,depthTest:!1}),c=new THREE.Points($,d);t.add(c);let m=new THREE.Vector2(-2e3,-2e3),f=new THREE.Clock,v=0;document.addEventListener("mousemove",e=>{let t=e.clientX-window.innerWidth/2,i=-(e.clientY-window.innerHeight/2);m.set(t,i),v=1}),document.getElementById("dots-canvas").addEventListener("mouseleave",()=>{v=0}),!function e(){var o;requestAnimationFrame(e);let r=f.getDelta();d.uniforms.u_time.value+=r,o=r,d.uniforms.u_mouse.value.lerp(m,.05),d.uniforms.u_intensity.value+=(v-d.uniforms.u_intensity.value)*Math.min(2*o,1),n.render(t,i)}()}window.addEventListener("resize",()=>{i.left=-(window.innerWidth/2),i.right=window.innerWidth/2,i.top=window.innerHeight/2,i.bottom=-(window.innerHeight/2),i.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight);let e=o(window.innerWidth,window.innerHeight,50);s.geometry.setAttribute("position",new THREE.Float32BufferAttribute(e,3)),s.geometry.attributes.position.needsUpdate=!0})}else console.error("Three.js is not loaded. Please include Three.js in your HTML.")});
