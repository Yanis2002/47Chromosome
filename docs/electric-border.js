// Electric Border Effect (iOS Safe)
// Adapted from https://codepen.io/BalintFerenczy/pen/yyYErXa
// Adapted palette to match 47Chromosome site

class ElectricBorder {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext("2d");
        
        // Configuration - adapted palette to match site colors
        this.width = options.width || 354;
        this.height = options.height || 504;
        this.octaves = options.octaves || 10;
        this.lacunarity = options.lacunarity || 1.6;
        this.gain = options.gain || 0.6;
        this.amplitude = options.amplitude || 0.2;
        this.frequency = options.frequency || 5;
        this.baseFlatness = options.baseFlatness || 0.2;
        this.displacement = options.displacement || 60;
        this.speed = options.speed || 1;
        this.borderOffset = options.borderOffset || 60;
        this.borderRadius = options.borderRadius || 40;
        this.lineWidth = options.lineWidth || 1;
        // Use site's accent colors
        this.color = options.color || "#ff00ff"; // --accent-neon
        this.colorSecondary = options.colorSecondary || "#00ffff"; // --accent-cyan
        
        this.animationId = null;
        this.time = 0;
        this.lastFrameTime = 0;
        
        // Get container dimensions
        const container = this.canvas.parentElement;
        if (container) {
            const rect = container.getBoundingClientRect();
            this.width = rect.width || this.width;
            this.height = rect.height || this.height;
        }
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.start();
    }
    
    // Random function - creates pseudo-random values from coordinates
    random(x) {
        return (Math.sin(x * 12.9898) * 43758.5453) % 1;
    }
    
    // 2D noise function for proper time animation
    noise2D(x, y) {
        const i = Math.floor(x);
        const j = Math.floor(y);
        const fx = x - i;
        const fy = y - j;
        
        // Four corners of the 2D grid
        const a = this.random(i + j * 57);
        const b = this.random(i + 1 + j * 57);
        const c = this.random(i + (j + 1) * 57);
        const d = this.random(i + 1 + (j + 1) * 57);
        
        // Smoothstep
        const ux = fx * fx * (3.0 - 2.0 * fx);
        const uy = fy * fy * (3.0 - 2.0 * fy);
        
        // Bilinear interpolation
        return (
            a * (1 - ux) * (1 - uy) +
            b * ux * (1 - uy) +
            c * (1 - ux) * uy +
            d * ux * uy
        );
    }
    
    // Octaved noise function
    octavedNoise(
        x,
        octaves,
        lacunarity,
        gain,
        baseAmplitude,
        baseFrequency,
        time = 0,
        seed = 0,
        baseFlatness = 1.0
    ) {
        let y = 0;
        let amplitude = baseAmplitude;
        let frequency = baseFrequency;
        
        for (let i = 0; i < octaves; i++) {
            let octaveAmplitude = amplitude;
            
            if (i === 0) {
                octaveAmplitude *= baseFlatness;
            }
            
            y +=
                octaveAmplitude *
                this.noise2D(frequency * x + seed * 100, time * frequency * 0.3);
            frequency *= lacunarity;
            amplitude *= gain;
        }
        
        return y;
    }
    
    // Get a point on a rounded rectangle perimeter using arc-length parameterization
    getRoundedRectPoint(t, left, top, width, height, radius) {
        // Calculate perimeter sections
        const straightWidth = width - 2 * radius;
        const straightHeight = height - 2 * radius;
        const cornerArc = (Math.PI * radius) / 2;
        const totalPerimeter =
            2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
        
        const distance = t * totalPerimeter;
        
        let accumulated = 0;
        
        // Top edge
        if (distance < straightWidth) {
            return {
                x: left + radius + distance,
                y: top,
                angle: 0
            };
        }
        accumulated += straightWidth;
        
        // Top-right corner
        if (distance < accumulated + cornerArc) {
            const cornerT = (distance - accumulated) / cornerArc;
            const angle = (cornerT * Math.PI) / 2;
            return {
                x: left + width - radius + radius * Math.cos(Math.PI - angle),
                y: top + radius - radius * Math.sin(Math.PI - angle),
                angle: angle
            };
        }
        accumulated += cornerArc;
        
        // Right edge
        if (distance < accumulated + straightHeight) {
            return {
                x: left + width,
                y: top + radius + (distance - accumulated),
                angle: Math.PI / 2
            };
        }
        accumulated += straightHeight;
        
        // Bottom-right corner
        if (distance < accumulated + cornerArc) {
            const cornerT = (distance - accumulated) / cornerArc;
            const angle = Math.PI / 2 + (cornerT * Math.PI) / 2;
            return {
                x: left + width - radius + radius * Math.cos(Math.PI - angle),
                y: top + height - radius - radius * Math.sin(Math.PI - angle),
                angle: angle
            };
        }
        accumulated += cornerArc;
        
        // Bottom edge
        if (distance < accumulated + straightWidth) {
            return {
                x: left + width - radius - (distance - accumulated),
                y: top + height,
                angle: Math.PI
            };
        }
        accumulated += straightWidth;
        
        // Bottom-left corner
        if (distance < accumulated + cornerArc) {
            const cornerT = (distance - accumulated) / cornerArc;
            const angle = Math.PI + (cornerT * Math.PI) / 2;
            return {
                x: left + radius + radius * Math.cos(Math.PI - angle),
                y: top + height - radius - radius * Math.sin(Math.PI - angle),
                angle: angle
            };
        }
        accumulated += cornerArc;
        
        // Left edge
        if (distance < accumulated + straightHeight) {
            return {
                x: left,
                y: top + height - radius - (distance - accumulated),
                angle: (3 * Math.PI) / 2
            };
        }
        accumulated += straightHeight;
        
        // Top-left corner
        const cornerT = (distance - accumulated) / cornerArc;
        const angle = (3 * Math.PI) / 2 + (cornerT * Math.PI) / 2;
        return {
            x: left + radius + radius * Math.cos(Math.PI - angle),
            y: top + radius - radius * Math.sin(Math.PI - angle),
            angle: angle
        };
    }
    
    draw() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        this.time += deltaTime * this.speed;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const left = this.borderOffset;
        const top = this.borderOffset;
        const width = this.width - 2 * this.borderOffset;
        const height = this.height - 2 * this.borderOffset;
        
        const numPoints = 200;
        const points = [];
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const basePoint = this.getRoundedRectPoint(
                t,
                left,
                top,
                width,
                height,
                this.borderRadius
            );
            
            const noiseValue = this.octavedNoise(
                t * 10,
                this.octaves,
                this.lacunarity,
                this.gain,
                this.amplitude,
                this.frequency,
                this.time,
                0,
                this.baseFlatness
            );
            
            const normalX = Math.cos(basePoint.angle + Math.PI / 2);
            const normalY = Math.sin(basePoint.angle + Math.PI / 2);
            
            points.push({
                x: basePoint.x + normalX * noiseValue * this.displacement,
                y: basePoint.y + normalY * noiseValue * this.displacement
            });
        }
        
        // Draw the border with gradient
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.closePath();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.colorSecondary);
        gradient.addColorStop(1, this.color);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }
    
    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.animationId) return;
        this.lastFrameTime = performance.now();
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resize() {
        const container = this.canvas.parentElement;
        if (container) {
            const rect = container.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    }
}

// Initialize Electric Border when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('electric-border-canvas');
    if (canvas) {
        const electricBorder = new ElectricBorder('electric-border-canvas', {
            width: 354,
            height: 504,
            color: '#ff00ff', // --accent-neon
            colorSecondary: '#00ffff' // --accent-cyan
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            electricBorder.resize();
        });
    }
});

