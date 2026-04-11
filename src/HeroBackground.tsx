import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const HeroBackground: React.FC = () => {
  const renderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let myP5: p5;

    const sketch = (p: p5) => {
      let particles: any[] = [];
      const numParticles = 800; // Increased for richer flow
      const noiseScale = 0.003;
      const zOffsetSpeed = 0.0005;
      let zOffset = 0;

      const colors = [
        p.color('#d97757'), // Anthropic Orange
        p.color('#6a9bcc'), // Anthropic Blue
        p.color('#788c5d'), // Anthropic Green
        p.color('#b0aea5'), // Anthropic Mid Gray
        p.color('#faf9f5')  // Anthropic Light
      ];

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        maxSpeed: number;
        color: p5.Color;
        size: number;
        life: number;
        maxLife: number;
        weight: number;

        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = p.random(0.5, 1.5);
          
          const r = p.random(1);
          if (r < 0.1) this.color = colors[0];
          else if (r < 0.2) this.color = colors[1];
          else if (r < 0.3) this.color = colors[2];
          else if (r < 0.8) this.color = colors[3];
          else this.color = colors[4];
          
          this.size = p.random(0.5, 2.5);
          this.maxLife = p.random(150, 400);
          this.life = p.random(0, this.maxLife);
          this.weight = p.random(0.1, 0.5);
        }

        update() {
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
          this.acc.mult(0);
          
          this.life++;
          if (this.life > this.maxLife || this.isOffScreen()) {
            this.reset();
          }
        }

        applyForce(force: p5.Vector) {
          this.acc.add(p.createVector(force.x * this.weight, force.y * this.weight));
        }

        display() {
          let alpha = 255;
          const fadeTime = 50;
          if (this.life < fadeTime) {
            alpha = p.map(this.life, 0, fadeTime, 0, 200);
          } else if (this.life > this.maxLife - fadeTime) {
            alpha = p.map(this.life, this.maxLife - fadeTime, this.maxLife, 200, 0);
          } else {
            alpha = 200;
          }

          p.noStroke();
          const c = p.color(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
          p.fill(c);
          p.ellipse(this.pos.x, this.pos.y, this.size);
        }

        isOffScreen() {
          return (
            this.pos.x < 0 ||
            this.pos.x > p.width ||
            this.pos.y < 0 ||
            this.pos.y > p.height
          );
        }

        reset() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel.mult(0);
          this.life = 0;
        }
      }

      p.setup = () => {
        const container = renderRef.current;
        if (container) {
          p.createCanvas(container.offsetWidth, container.offsetHeight);
          p.background('#141413'); 
          for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
          }
        }
      };

      p.draw = () => {
        // Slow trail effect
        p.background(20, 20, 19, 10); 

        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          
          // Organic turbulence algorithm
          const angle = p.noise(
            particle.pos.x * noiseScale, 
            particle.pos.y * noiseScale, 
            zOffset
          ) * p.TWO_PI * 4; 
          
          const force = p5.Vector.fromAngle(angle);
          force.setMag(0.15);
          
          particle.applyForce(force);
          particle.update();
          particle.display();
        }

        zOffset += zOffsetSpeed;
      };

      p.windowResized = () => {
        const container = renderRef.current;
        if (container) {
          p.resizeCanvas(container.offsetWidth, container.offsetHeight);
          p.background('#141413');
        }
      };
    };

    if (renderRef.current) {
      myP5 = new p5(sketch, renderRef.current);
    }

    return () => {
      if (myP5) {
        myP5.remove();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div ref={renderRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141413]/40 via-transparent to-[#141413] pointer-events-none" />
    </div>
  );
};

export default HeroBackground;